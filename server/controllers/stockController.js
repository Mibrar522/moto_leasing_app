const pool = require('../config/db');
const { buildHtml, buildLocalAttachments, sendMailSafe } = require('../utils/mail');
const { resolveDurableUploadUrl } = require('../utils/storage');

const isSuperAdminSession = (user = {}) =>
    Number(user?.real_role_id || user?.role_id) === 1 ||
    (user?.real_role_name || user?.role_name) === 'SUPER_ADMIN';
const getEffectiveDealerId = (user = {}) => user.effective_dealer_id || user.dealer_id || null;
const hasGlobalScope = (user = {}) => isSuperAdminSession(user) && !getEffectiveDealerId(user);

const ensureStockScopedColumns = async () => {
    await pool.query(`
        ALTER TABLE stock_orders
            ADD COLUMN IF NOT EXISTS dealer_id UUID
    `);
    await pool.query(`
        UPDATE stock_orders so
        SET dealer_id = u.dealer_id
        FROM users u
        WHERE u.id = so.ordered_by
          AND so.dealer_id IS NULL
          AND u.dealer_id IS NOT NULL
    `);
    await pool.query(`
        ALTER TABLE product_catalog
            ADD COLUMN IF NOT EXISTS dealer_id UUID,
            ADD COLUMN IF NOT EXISTS created_by UUID
    `);
    await pool.query(`
        ALTER TABLE company_profiles
            ADD COLUMN IF NOT EXISTS dealer_id UUID,
            ADD COLUMN IF NOT EXISTS created_by UUID
    `);
};

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
        LEFT JOIN dealers d ON d.id = COALESCE(u.dealer_id, $2::uuid)
        WHERE u.id = $1
        LIMIT 1
        `,
        [userId, fallbackUser.effective_dealer_id || fallbackUser.dealer_id || null]
    );

    const row = result.rows[0] || {};
    return {
        name: row.dealer_name || fallbackUser.dealer_name || fallbackUser.full_name || row.user_name || 'MotorLease',
        email: row.contact_email || row.user_email || fallbackUser.contact_email || fallbackUser.email || process.env.SMTP_USER,
        mobile_country_code: row.mobile_country_code || fallbackUser.mobile_country_code,
        mobile_number: row.mobile_number || fallbackUser.mobile_number,
    };
};

const sendStockOrderEmail = async ({ order, company, product, vehicle_type, total_amount, unit_price, expected_delivery_date, notes, bank_slip_url, userId, user }) => {
    if (!company.company_email) {
        return { sent: false, error: 'Company email is not available for this stock order' };
    }

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
        [emailResult.sent, emailResult.sent ? null : emailResult.error, order.id]
    );

    if (!emailResult.sent) {
        console.warn('Stock order email warning:', emailResult.error);
    }

    return emailResult;
};

const sendStockOrderEmailInBackground = (payload) => {
    if (!payload.company.company_email) {
        return;
    }

    setImmediate(async () => {
        try {
            await sendStockOrderEmail(payload);
        } catch (error) {
            await pool.query(
                'UPDATE stock_orders SET email_sent = $1, email_error = $2 WHERE id = $3',
                [false, error.message, payload.order.id]
            ).catch(() => {});
            console.warn('Stock order email warning:', error.message);
        }
    });
};

const getStockOrderEmailContext = async (orderId, user = {}) => {
    await ensureStockScopedColumns();
    const globalScope = hasGlobalScope(user);
    const dealerId = getEffectiveDealerId(user);
    const result = await pool.query(
        `
        SELECT
            so.*,
            cp.company_name AS profile_company_name,
            cp.company_email AS profile_company_email,
            pc.brand AS product_brand,
            pc.model AS product_model,
            pc.vehicle_type AS product_vehicle_type,
            pc.purchase_price AS product_purchase_price
        FROM stock_orders so
        LEFT JOIN company_profiles cp ON cp.id = so.company_profile_id
        LEFT JOIN product_catalog pc ON pc.id = so.product_id
        LEFT JOIN users u ON u.id = so.ordered_by
        WHERE so.id = $1
          ${globalScope ? '' : 'AND COALESCE(so.dealer_id, u.dealer_id) = $2'}
        LIMIT 1
        `,
        globalScope ? [orderId] : [orderId, dealerId]
    );

    const order = result.rows[0];
    if (!order) {
        return null;
    }

    return {
        order,
        company: {
            company_name: order.company_name || order.profile_company_name || 'Supplier',
            company_email: order.company_email || order.profile_company_email,
        },
        product: {
            brand: order.brand || order.product_brand || 'Vehicle',
            model: order.model || order.product_model || '',
            vehicle_type: order.vehicle_type || order.product_vehicle_type || '',
            purchase_price: order.unit_price || order.product_purchase_price || 0,
        },
    };
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

    const fallbackUrl = `/uploads/bank-slips/${req.file.filename}`;
    const url = await resolveDurableUploadUrl(req.file, 'bank-slips', fallbackUrl);

    res.status(201).json({
        fileName: req.file.filename,
        originalName: req.file.originalname,
        url,
    });
};

exports.listStockOrders = async (req, res) => {
    try {
        await ensureStockScopedColumns();
        const globalScope = hasGlobalScope(req.user);
        const dealerId = getEffectiveDealerId(req.user);
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
            LEFT JOIN dealers d ON d.id = COALESCE(so.dealer_id, u.dealer_id)
            ${globalScope ? '' : 'WHERE COALESCE(so.dealer_id, u.dealer_id) = $1'}
            ORDER BY so.created_at DESC
            `,
            globalScope ? [] : [dealerId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load stock orders', error: error.message });
    }
};

exports.createStockOrder = async (req, res) => {
    try {
        await ensureStockScopedColumns();
        const globalScope = hasGlobalScope(req.user);
        const dealerId = getEffectiveDealerId(req.user);
        if (!globalScope && !dealerId) {
            return res.status(403).json({ message: 'Dealer scope is required to create stock orders.' });
        }

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
            WHERE id = $1
              AND is_active = TRUE
              ${globalScope ? '' : 'AND dealer_id = $2'}
            `,
            globalScope ? [company_profile_id] : [company_profile_id, dealerId]
        );

        if (companyResult.rows.length === 0) {
            return res.status(400).json({ message: 'Select a valid company profile.' });
        }

        const productResult = await pool.query(
            `
            SELECT id, brand, model, serial_number, vehicle_type, image_url, monthly_rate, purchase_price, color, description
            FROM product_catalog
            WHERE id = $1
              AND is_active = TRUE
              ${globalScope ? '' : 'AND dealer_id = $2'}
            `,
            globalScope ? [product_id] : [product_id, dealerId]
        );

        if (productResult.rows.length === 0) {
            return res.status(400).json({ message: 'Select a valid product vehicle from the product master.' });
        }

        const company = companyResult.rows[0];
        const product = productResult.rows[0];

        const result = await pool.query(
            `
            INSERT INTO stock_orders (
                ordered_by, dealer_id, company_profile_id, company_name, company_email, product_id, vehicle_type, brand, model,
                chassis_number, engine_number, serial_number, quantity, unit_price, total_amount, product_description,
                expected_delivery_date, bank_slip_url, notes, order_status
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
            RETURNING *
            `,
            [
                req.user.id,
                globalScope ? null : dealerId,
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

exports.resendStockOrderEmail = async (req, res) => {
    try {
        const context = await getStockOrderEmailContext(req.params.id, req.user);

        if (!context) {
            return res.status(404).json({ message: 'Stock order not found' });
        }

        const emailResult = await sendStockOrderEmail({
            ...context,
            vehicle_type: context.order.vehicle_type,
            total_amount: context.order.total_amount,
            unit_price: context.order.unit_price,
            expected_delivery_date: context.order.expected_delivery_date,
            notes: context.order.notes,
            bank_slip_url: context.order.bank_slip_url,
            userId: context.order.ordered_by || req.user.id,
            user: req.user,
        });

        if (!emailResult.sent) {
            return res.status(502).json({
                message: 'Stock order email was not sent.',
                error: emailResult.error,
            });
        }

        res.status(200).json({
            message: 'Stock order email sent successfully.',
            email_sent: true,
            email_error: null,
        });
    } catch (error) {
        await pool.query(
            'UPDATE stock_orders SET email_sent = $1, email_error = $2 WHERE id = $3',
            [false, error.message, req.params.id]
        ).catch(() => {});
        res.status(500).json({ message: 'Failed to resend stock order email', error: error.message });
    }
};

exports.updateStockOrder = async (req, res) => {
    const client = await pool.connect();

    try {
        const globalScope = hasGlobalScope(req.user);
        const dealerId = getEffectiveDealerId(req.user);
        await ensureStockScopedColumns();
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
            LEFT JOIN users u ON u.id = so.ordered_by
            WHERE so.id = $1
              ${globalScope ? '' : 'AND COALESCE(so.dealer_id, u.dealer_id) = $2'}
            FOR UPDATE OF so
            `,
            globalScope ? [req.params.id] : [req.params.id, dealerId]
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
