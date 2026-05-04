const pool = require('../config/db');
const { buildHtml, buildLocalAttachments, sendMailSafe } = require('../utils/mail');

const normalizeStockOrderId = (orderId) => String(orderId || '').replace(/-/g, '').toUpperCase();
const buildStockRegistrationNumber = (orderId, pieceNumber) =>
    `STK-${normalizeStockOrderId(orderId)}-${String(pieceNumber).padStart(3, '0')}`;
const sanitizeSerialSegment = (value) =>
    String(value || '')
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '');
const getVehicleUniqueConstraintMessage = (error) => {
    switch (error?.constraint) {
        case 'vehicles_chassis_number_unique_idx':
        case 'vehicles_chassis_number_key':
            return 'Chassis number must be unique.';
        case 'vehicles_engine_number_unique_idx':
        case 'vehicles_engine_number_key':
            return 'Engine number must be unique.';
        case 'vehicles_registration_number_unique_idx':
        case 'vehicles_registration_number_key':
            return 'Registration number must be unique.';
        case 'vehicles_serial_number_unique_idx':
        case 'vehicles_serial_number_key':
            return 'Serial number must be unique.';
        default:
            return null;
    }
};
const buildInventorySerialBase = (order, pieceNumber) => {
    return [
        'STK',
        sanitizeSerialSegment(order.brand),
        sanitizeSerialSegment(order.color),
        sanitizeSerialSegment(order.model),
        sanitizeSerialSegment(order.chassis_number || `${order.id}${pieceNumber}`),
        sanitizeSerialSegment(order.engine_number || `${order.id}${pieceNumber}`),
    ].join('');
};

const getDealerMailContext = async (userId, fallbackUser = {}) => {
    const result = await pool.query(
        `
        SELECT
            d.dealer_name,
            d.contact_email,
            d.mobile_country_code,
            d.mobile_number,
            u.email AS user_email,
            u.full_name AS user_name
        FROM users u
        LEFT JOIN dealers d ON d.id = u.dealer_id
        WHERE u.id = $1
        LIMIT 1
        `,
        [userId]
    );

    const row = result.rows[0] || {};
    return {
        name: row.dealer_name || fallbackUser.dealer_name || fallbackUser.full_name || row.user_name || 'MotorLease',
        email: row.contact_email || row.user_email || fallbackUser.contact_email || fallbackUser.email || process.env.SMTP_USER,
        mobile_country_code: row.mobile_country_code || fallbackUser.mobile_country_code,
        mobile_number: row.mobile_number || fallbackUser.mobile_number,
    };
};

const sendStockOrderEmailInBackground = ({ order, company, product, vehicle_type, total_amount, unit_price, expected_delivery_date, notes, bank_slip_url, userId, user }) => {
    if (!company.company_email) {
        return;
    }

    setImmediate(async () => {
        try {
            const dealerMail = await getDealerMailContext(userId, user);
            const amount = Number(total_amount || unit_price || product.purchase_price || 0);
            const lines = [
                `A new stock order has been placed for ${product.brand} ${product.model}.`,
                `Vehicle type: ${String(product.vehicle_type || vehicle_type || '').toUpperCase()}`,
                `Quantity: 1`,
                `Total amount: ${amount}`,
                expected_delivery_date ? `Expected delivery date: ${expected_delivery_date}` : '',
                notes ? `Notes: ${notes}` : '',
            ].filter(Boolean);
            const emailResult = await sendMailSafe({
                dealer: dealerMail,
                to: company.company_email,
                subject: `Stock order ${order.id} - ${product.brand} ${product.model}`,
                text: [
                    `Dear ${company.company_name},`,
                    '',
                    ...lines,
                    '',
                    'The bank slip is attached when available.',
                    '',
                    `Thanks and regards\n${dealerMail.name}\n${dealerMail.email || ''}`,
                ].join('\n'),
                html: buildHtml({
                    title: 'New Stock Order',
                    greeting: `Dear ${company.company_name},`,
                    lines: [...lines, 'The bank slip is attached when available.'],
                    dealer: dealerMail,
                }),
                attachments: buildLocalAttachments([bank_slip_url]),
            });

            await pool.query(
                'UPDATE stock_orders SET email_sent = $1, email_error = $2 WHERE id = $3',
                [emailResult.sent, emailResult.error, order.id]
            );

            if (!emailResult.sent) {
                console.warn('Stock order email warning:', emailResult.error);
            }
        } catch (error) {
            await pool.query(
                'UPDATE stock_orders SET email_sent = $1, email_error = $2 WHERE id = $3',
                [false, error.message, order.id]
            ).catch(() => {});
            console.warn('Stock order email warning:', error.message);
        }
    });
};

const resolveUniqueInventorySerialNumber = async (client, order, pieceNumber) => {
    const baseSerialNumber = buildInventorySerialBase(order, pieceNumber);

    const existingSerialsResult = await client.query(
        `
        SELECT serial_number
        FROM vehicles
        WHERE UPPER(serial_number) = $1
           OR UPPER(serial_number) LIKE $2
        `,
        [baseSerialNumber, `${baseSerialNumber}-%`]
    );

    const existingSerials = new Set(
        existingSerialsResult.rows.map((row) => String(row.serial_number || '').toUpperCase())
    );

    if (!existingSerials.has(baseSerialNumber)) {
        return baseSerialNumber;
    }

    let suffix = 2;
    while (existingSerials.has(`${baseSerialNumber}-${suffix}`)) {
        suffix += 1;
    }

    return `${baseSerialNumber}-${suffix}`;
};

const createReceivedInventoryVehicle = async (client, order, item, pieceNumber) => {
    const registrationNumber = String(item.registration_number || '').trim();
    const chassisNumber = String(item.chassis_number || '').trim();
    const engineNumber = String(item.engine_number || '').trim();
    const itemColor = String(item.color || order.color || '').trim();

    if (!registrationNumber || !chassisNumber || !engineNumber) {
        throw new Error('Registration number, chassis number, and engine number are required for each received vehicle.');
    }

    const serialNumber = await resolveUniqueInventorySerialNumber(
        client,
        {
            ...order,
            color: itemColor || order.color,
            registration_number: registrationNumber,
            chassis_number: chassisNumber,
            engine_number: engineNumber,
        },
        pieceNumber
    );

    await client.query(
        `
        INSERT INTO vehicles (
            brand,
            model,
            registration_number,
            vehicle_type,
            chassis_number,
            engine_number,
            serial_number,
            source_stock_order_id,
            color,
            product_description,
            image_url,
            monthly_rate,
            purchase_price,
            status
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        `,
        [
            order.brand,
            order.model,
            registrationNumber,
            String(order.vehicle_type || '').toUpperCase(),
            chassisNumber,
            engineNumber,
            serialNumber,
            order.id,
            itemColor || null,
            order.product_description || null,
            order.image_url || null,
            Number(order.monthly_rate || 0),
            Number(order.unit_price || 0),
            'AVAILABLE',
        ]
    );

    return serialNumber;
};

const syncReceivedStockOrderInventory = async (client, order) => {
    const orderedQuantity = 1;
    const receivedQuantity = Math.min(Number(order.received_quantity || 0), orderedQuantity);

    if (receivedQuantity <= 0) {
        return 0;
    }

    const registrationPrefix = `STK-${normalizeStockOrderId(order.id)}-`;
    const existingVehiclesResult = await client.query(
        `
        SELECT id, registration_number, source_stock_order_id
        FROM vehicles
        WHERE source_stock_order_id = $1
           OR registration_number LIKE $2
        `,
        [order.id, `${registrationPrefix}%`]
    );

    const existingRegistrations = new Set(
        existingVehiclesResult.rows.map((row) => String(row.registration_number || '').toUpperCase())
    );

    const unlinkedVehicleIds = existingVehiclesResult.rows
        .filter((row) => row.id && !row.source_stock_order_id)
        .map((row) => row.id);

    if (unlinkedVehicleIds.length > 0) {
        await client.query(
            `
            UPDATE vehicles
            SET source_stock_order_id = $2
            WHERE id = ANY($1::uuid[])
            `,
            [unlinkedVehicleIds, order.id]
        );
    }
    // Current workflow records one real vehicle only when the receive popup submits
    // chassis, engine, and registration details. Reconciliation should not invent
    // placeholder vehicles anymore because that creates duplicate inventory rows.
    return existingRegistrations.size;
};

const reconcileReceivedStockOrders = async () => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const receivedOrdersResult = await client.query(
            `
            SELECT
                so.*,
                pc.image_url,
                pc.monthly_rate,
                pc.color,
                pc.serial_number,
                pc.description AS product_description
            FROM stock_orders so
            LEFT JOIN product_catalog pc ON pc.id = so.product_id
            WHERE COALESCE(so.received_quantity, 0) > 0
               OR UPPER(COALESCE(so.order_status, '')) = 'RECEIVED'
            ORDER BY so.created_at ASC
            `
        );

        for (const order of receivedOrdersResult.rows) {
            await syncReceivedStockOrderInventory(client, order);
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

exports.uploadBankSlip = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Bank slip file is required' });
    }

    res.status(201).json({
        fileName: req.file.filename,
        originalName: req.file.originalname,
        url: `/uploads/bank-slips/${req.file.filename}`,
    });
};

exports.listStockOrders = async (_req, res) => {
    try {
        await reconcileReceivedStockOrders();

        const result = await pool.query(
            `
            SELECT
                so.*,
                cp.company_name AS profile_company_name,
                cp.company_email AS profile_company_email,
                pc.brand AS product_brand,
                pc.model AS product_model,
                pc.vehicle_type AS product_vehicle_type,
                pc.color AS product_color,
                pc.description AS product_description,
                pc.serial_number AS product_serial_number,
                pc.image_url AS product_image_url,
                pc.monthly_rate AS product_monthly_rate,
                pc.purchase_price AS product_purchase_price,
                u.full_name AS ordered_by_name
            FROM stock_orders so
            LEFT JOIN company_profiles cp ON cp.id = so.company_profile_id
            LEFT JOIN product_catalog pc ON pc.id = so.product_id
            JOIN users u ON u.id = so.ordered_by
            ORDER BY so.created_at DESC
            `
        );

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load stock orders', error: error.message });
    }
};

exports.createStockOrder = async (req, res) => {
    try {
        const {
            company_profile_id,
            product_id,
            vehicle_type,
            chassis_number,
            engine_number,
            unit_price,
            total_amount,
            expected_delivery_date,
            bank_slip_url,
            notes,
            order_status,
        } = req.body;

        if (!company_profile_id || !product_id || !bank_slip_url) {
            return res.status(400).json({ message: 'Company profile, product vehicle, and bank slip are required' });
        }

        const companyResult = await pool.query(
            `
            SELECT id, company_name, company_email
            FROM company_profiles
            WHERE id = $1 AND is_active = TRUE
            `,
            [company_profile_id]
        );

        if (companyResult.rows.length === 0) {
            return res.status(400).json({ message: 'Select a valid company profile.' });
        }

        const productResult = await pool.query(
            `
            SELECT id, brand, model, serial_number, vehicle_type, image_url, monthly_rate, purchase_price, color, description
            FROM product_catalog
            WHERE id = $1 AND is_active = TRUE
            `,
            [product_id]
        );

        if (productResult.rows.length === 0) {
            return res.status(400).json({ message: 'Select a valid product vehicle from the product master.' });
        }

        const company = companyResult.rows[0];
        const product = productResult.rows[0];

        const result = await pool.query(
            `
            INSERT INTO stock_orders (
                ordered_by, company_profile_id, company_name, company_email, product_id, vehicle_type, brand, model,
                chassis_number, engine_number, serial_number, quantity, unit_price, total_amount, product_description,
                expected_delivery_date, bank_slip_url, notes, order_status
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
            RETURNING *
            `,
            [
                req.user.id,
                company.id,
                company.company_name,
                company.company_email || null,
                product.id,
                String(product.vehicle_type || vehicle_type || '').toUpperCase(),
                product.brand,
                product.model,
                chassis_number || null,
                engine_number || null,
                product.serial_number || null,
                1,
                Number(unit_price || product.purchase_price || 0),
                Number(total_amount || unit_price || product.purchase_price || 0),
                product.description || null,
                expected_delivery_date || null,
                bank_slip_url,
                notes || null,
                order_status || 'PROCESSING',
            ]
        );

        const order = result.rows[0];
        const emailPending = Boolean(company.company_email);

        sendStockOrderEmailInBackground({
            order,
            company,
            product,
            vehicle_type,
            total_amount,
            unit_price,
            expected_delivery_date,
            notes,
            bank_slip_url,
            userId: req.user.id,
            user: req.user,
        });

        res.status(201).json({ ...order, email_sent: false, email_error: null, email_pending: emailPending });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create stock order', error: error.message });
    }
};

exports.updateStockOrder = async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            order_status,
            received_quantity,
            received_at,
            notes,
            received_items = [],
        } = req.body;

        await client.query('BEGIN');

        const currentOrderResult = await client.query(
            `
            SELECT
                so.*,
                pc.image_url,
                pc.monthly_rate,
                pc.color,
                pc.serial_number,
                pc.description AS product_description
            FROM stock_orders so
            LEFT JOIN product_catalog pc ON pc.id = so.product_id
            WHERE so.id = $1
            FOR UPDATE OF so
            `,
            [req.params.id]
        );

        if (currentOrderResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Stock order not found' });
        }

        const currentOrder = currentOrderResult.rows[0];
        const additionalReceivedItems = Array.isArray(received_items) ? received_items : [];
        const additionalReceivedCount = additionalReceivedItems.length;
        const currentReceivedQuantity = Number(currentOrder.received_quantity || 0);
        const orderedQuantity = 1;

        if (additionalReceivedCount > 1) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Each stock order can receive only one unique vehicle record.' });
        }

        const nextReceivedQuantity =
            additionalReceivedCount > 0
                ? currentReceivedQuantity + additionalReceivedCount
                : received_quantity === '' || received_quantity === undefined
                    ? currentReceivedQuantity
                    : Number(received_quantity);
        const receivedDelta = nextReceivedQuantity - currentReceivedQuantity;

        if (Number.isNaN(nextReceivedQuantity) || nextReceivedQuantity < 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Received vehicle status must be valid.' });
        }

        if (nextReceivedQuantity > orderedQuantity) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Each stock order can receive only one vehicle.' });
        }

        if (receivedDelta < 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Received stock cannot be reduced after the vehicle has been recorded into inventory.' });
        }

        if (additionalReceivedCount > 0 && receivedDelta !== additionalReceivedCount) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Received vehicle details do not match the stock order being marked as received.' });
        }

        const nextOrderStatus =
            order_status ||
            (nextReceivedQuantity >= orderedQuantity && orderedQuantity > 0
                ? 'RECEIVED'
                : nextReceivedQuantity > 0
                    ? 'PROCESSING'
                    : currentOrder.order_status);

        const result = await client.query(
            `
            UPDATE stock_orders
            SET
                quantity = 1,
                order_status = COALESCE($2, order_status),
                received_quantity = COALESCE($3, received_quantity),
                received_at = COALESCE($4, received_at),
                notes = COALESCE($5, notes)
            WHERE id = $1
            RETURNING *
            `,
            [
                req.params.id,
                nextOrderStatus || null,
                nextReceivedQuantity,
                received_at || null,
                notes || null,
            ]
        );

        if (additionalReceivedCount > 0) {
            const registrationPrefix = `STK-${normalizeStockOrderId(currentOrder.id)}-`;
            await client.query(
                `
                DELETE FROM vehicles
                WHERE source_stock_order_id = $1
                  AND registration_number LIKE $2
                `,
                [currentOrder.id, `${registrationPrefix}%`]
            );

            for (let index = 0; index < additionalReceivedItems.length; index += 1) {
                await createReceivedInventoryVehicle(client, currentOrder, additionalReceivedItems[index], currentReceivedQuantity + index + 1);
            }
        } else {
            await syncReceivedStockOrderInventory(client, {
                ...currentOrder,
                received_quantity: nextReceivedQuantity,
            });
        }

        await client.query('COMMIT');

        res.status(200).json(result.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Stock receive/update error:', {
            message: error.message,
            code: error.code,
            constraint: error.constraint,
            detail: error.detail,
        });
        if (error.message === 'Registration number, chassis number, and engine number are required for each received vehicle.') {
            return res.status(400).json({ message: error.message });
        }
        if (error.code === '23505') {
            const uniquenessMessage = getVehicleUniqueConstraintMessage(error);
            if (uniquenessMessage) {
                return res.status(409).json({ message: uniquenessMessage });
            }
        }

        res.status(500).json({ message: 'Failed to update stock order', error: error.message, detail: error.detail || null, constraint: error.constraint || null });
    } finally {
        client.release();
    }
};

exports.reconcileReceivedStockOrders = reconcileReceivedStockOrders;
