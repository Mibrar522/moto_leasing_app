const pool = require('../config/db');
const { buildHtml, sendMailSafe } = require('../utils/mail');

const safeNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};

const round2 = (value) => Math.round(safeNumber(value) * 100) / 100;

const computeTotal = (basePrice, percent) => round2(safeNumber(basePrice) * (1 + safeNumber(percent) / 100));

const addMonths = (date, monthsToAdd) => {
    const d = new Date(date.getTime());
    const day = d.getDate();
    d.setMonth(d.getMonth() + monthsToAdd);
    // If month roll-over truncates day (e.g., Jan 31 -> Mar 2), clamp to last day of month.
    if (d.getDate() < day) {
        d.setDate(0);
    }
    return d;
};

const buildInstallmentAmounts = (total, months) => {
    const normalizedTotal = round2(total);
    const normalizedMonths = Math.max(1, parseInt(months, 10) || 1);

    const base = Math.floor((normalizedTotal / normalizedMonths) * 100) / 100;
    const amounts = Array.from({ length: normalizedMonths }, () => base);
    const sumFirst = round2(base * (normalizedMonths - 1));
    amounts[normalizedMonths - 1] = round2(normalizedTotal - sumFirst);
    return amounts;
};

const getOrderDealerMailContext = async (dealerId) => {
    if (!dealerId) {
        return {
            name: 'MotorLease',
            email: process.env.SMTP_USER,
        };
    }

    const result = await pool.query(
        `
        SELECT
            d.dealer_name,
            d.contact_email,
            d.mobile_country_code,
            d.mobile_number,
            admin_user.email AS admin_email
        FROM dealers d
        LEFT JOIN users admin_user ON admin_user.id = d.admin_user_id
        WHERE d.id = $1
        LIMIT 1
        `,
        [dealerId]
    );

    const row = result.rows[0] || {};
    return {
        name: row.dealer_name || 'MotorLease',
        email: row.contact_email || row.admin_email || process.env.SMTP_USER,
        admin_email: row.admin_email,
        mobile_country_code: row.mobile_country_code,
        mobile_number: row.mobile_number,
    };
};

const sendOrderCreatedEmails = async ({ customer, order, vehicle, installments }) => {
    const dealerMail = await getOrderDealerMailContext(customer.preferred_dealer_id || vehicle.dealer_id);
    const modeLabel = order.purchase_mode === 'INSTALLMENT' ? 'Installment' : 'Cash';
    const lines = [
        `Order ID: ${order.id}`,
        `Vehicle: ${vehicle.brand} ${vehicle.model}`,
        `Vehicle type: ${vehicle.vehicle_type || 'Not set'}`,
        `Purchase mode: ${modeLabel}`,
        `Total price: ${Number(order.total_price || 0)}`,
        order.purchase_mode === 'INSTALLMENT' ? `Installment months: ${order.installment_months}` : '',
        order.purchase_mode === 'INSTALLMENT' ? `Monthly amount: ${Number(order.monthly_amount || 0)}` : '',
        order.purchase_mode === 'INSTALLMENT' ? `Down payment: ${Number(order.down_payment || 0)}` : '',
    ].filter(Boolean);

    const customerResult = await sendMailSafe({
        dealer: dealerMail,
        to: customer.email,
        subject: `Order confirmation - ${vehicle.brand} ${vehicle.model}`,
        text: [
            `Dear ${customer.full_name || 'Customer'},`,
            '',
            'Your order has been placed successfully.',
            ...lines,
            installments?.length ? `Installment schedule created with ${installments.length} installment(s).` : '',
            '',
            `Thanks and regards,\n${dealerMail.name}\n${dealerMail.email || ''}`,
        ].filter(Boolean).join('\n'),
        html: buildHtml({
            title: 'Order Confirmation',
            greeting: `Dear ${customer.full_name || 'Customer'},`,
            lines: [
                'Your order has been placed successfully.',
                ...lines,
                installments?.length ? `Installment schedule created with ${installments.length} installment(s).` : '',
            ].filter(Boolean),
            dealer: dealerMail,
        }),
    });

    const dealerResult = await sendMailSafe({
        dealer: dealerMail,
        to: [dealerMail.email, dealerMail.admin_email],
        subject: `New customer order - ${vehicle.brand} ${vehicle.model}`,
        text: [
            'Dear team,',
            '',
            `A customer order has been placed by ${customer.full_name || customer.email}.`,
            `Customer email: ${customer.email}`,
            `Customer phone: ${customer.phone_e164 || ''}`,
            ...lines,
            '',
            `Thanks and regards,\n${dealerMail.name}\n${dealerMail.email || ''}`,
        ].join('\n'),
        html: buildHtml({
            title: 'New Customer Order',
            greeting: 'Dear team,',
            lines: [
                `A customer order has been placed by ${customer.full_name || customer.email}.`,
                `Customer email: ${customer.email}`,
                customer.phone_e164 ? `Customer phone: ${customer.phone_e164}` : '',
                ...lines,
            ].filter(Boolean),
            dealer: dealerMail,
        }),
    });

    return [customerResult, dealerResult];
};

const ensureCustomerOrdersColumns = async (client) => {
    // Existing DBs may have an older customer_orders table. Ensure columns used by the API exist.
    await client.query(`ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS product_id uuid;`);
    await client.query(`ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS vehicle_id uuid;`);
    await client.query(`ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS dealer_id uuid;`);
    await client.query(`ALTER TABLE customer_order_installments ADD COLUMN IF NOT EXISTS dealer_id uuid;`);
    await client.query(`ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS down_payment numeric(12,2) DEFAULT 0 NOT NULL;`);
    await client.query(`ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS financed_amount numeric(12,2) DEFAULT 0 NOT NULL;`);
    await client.query(`ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS first_due_date date NULL;`);
};

exports.createOrder = async (req, res) => {
    const client = await pool.connect();
    try {
        const customerAccountId = req.customer.id;
        const vehicleId = String(req.body.vehicle_id || '').trim();
        const purchaseMode = String(req.body.purchase_mode || '').trim().toUpperCase();

        if (!vehicleId) {
            return res.status(400).json({ message: 'vehicle_id is required' });
        }

        if (!['CASH', 'INSTALLMENT'].includes(purchaseMode)) {
            return res.status(400).json({ message: 'purchase_mode must be CASH or INSTALLMENT' });
        }

        await client.query('ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dealer_id uuid');
        await ensureCustomerOrdersColumns(client);

        const vehicleResult = await client.query(
            `
            SELECT
                v.id,
                v.status,
                v.brand,
                v.model,
                v.vehicle_type,
                v.color,
                v.product_description,
                v.image_url,
                v.monthly_rate,
                v.purchase_price,
                v.dealer_id AS vehicle_dealer_id,
                so.product_id,
                pc.cash_markup_percent,
                pc.cash_markup_value,
                pc.installment_markup_percent,
                pc.installment_months,
                pc.is_active AS product_is_active,
                COALESCE(v.dealer_id, d.id) AS dealer_id
            FROM vehicles v
            LEFT JOIN stock_orders so ON so.id = v.source_stock_order_id
            LEFT JOIN product_catalog pc ON pc.id = so.product_id
            LEFT JOIN company_profiles cp ON cp.id = so.company_profile_id
            LEFT JOIN users ordered_by_user ON ordered_by_user.id = so.ordered_by
            LEFT JOIN dealers d ON d.id = COALESCE(so.dealer_id, ordered_by_user.dealer_id, pc.dealer_id, cp.dealer_id)
            WHERE v.id = $1
            LIMIT 1
            `,
            [vehicleId]
        );

        if (vehicleResult.rows.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        const vehicle = vehicleResult.rows[0];
        if (!vehicle.dealer_id || (req.customer.preferred_dealer_id && String(vehicle.dealer_id) !== String(req.customer.preferred_dealer_id))) {
            return res.status(403).json({ message: 'This vehicle is not available for your selected dealer.' });
        }
        const vehicleStatus = String(vehicle.status || '').toUpperCase();
        if (vehicleStatus !== 'AVAILABLE') {
            return res.status(400).json({ message: 'Only available vehicles can be purchased.' });
        }

        if (vehicle.product_id && vehicle.product_is_active === false) {
            return res.status(400).json({ message: 'This product is not active.' });
        }

        const basePrice = safeNumber(vehicle.purchase_price);

        let markupPercent = 0;
        let totalPrice = basePrice;
        let installmentMonths = 0;
        let monthlyAmount = 0;
        let downPayment = 0;
        let financedAmount = 0;
        let firstDueDate = null;

        if (purchaseMode === 'CASH') {
            const cashValue = safeNumber(vehicle.cash_markup_value);
            if (cashValue > 0 && basePrice > 0) {
                totalPrice = round2(basePrice + cashValue);
                markupPercent = round2((cashValue / basePrice) * 100);
            } else {
                markupPercent = safeNumber(vehicle.cash_markup_percent);
                totalPrice = computeTotal(basePrice, markupPercent);
            }
        } else {
            markupPercent = safeNumber(vehicle.installment_markup_percent);
            const requestedMonths = parseInt(req.body.installment_months, 10);
            const defaultMonths = parseInt(vehicle.installment_months, 10) || 12;
            installmentMonths = Math.max(1, Math.min(60, Number.isFinite(requestedMonths) ? requestedMonths : defaultMonths));
            totalPrice = computeTotal(basePrice, markupPercent);
            monthlyAmount = installmentMonths > 0 ? round2(totalPrice / installmentMonths) : 0;

            downPayment = Math.max(0, safeNumber(req.body.down_payment));
            financedAmount = Math.max(0, round2(totalPrice - downPayment));
            const rawFirstDueDate = String(req.body.first_due_date || '').trim();
            firstDueDate = rawFirstDueDate ? rawFirstDueDate : null;
        }

        await client.query('BEGIN');

        const insertOrder = async () => client.query(
            `
            INSERT INTO customer_orders (
                customer_account_id,
                product_id,
                vehicle_id,
                dealer_id,
                purchase_mode,
                base_price,
                markup_percent,
                total_price,
                installment_months,
                monthly_amount,
                down_payment,
                financed_amount,
                first_due_date,
                status
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'ACTIVE')
            RETURNING *
            `,
            [
                customerAccountId,
                vehicle.product_id || null,
                vehicle.id,
                vehicle.dealer_id,
                purchaseMode,
                basePrice,
                markupPercent,
                totalPrice,
                installmentMonths,
                monthlyAmount,
                downPayment,
                financedAmount,
                firstDueDate,
            ]
        );

        let orderInsert;
        try {
            orderInsert = await insertOrder();
        } catch (error) {
            // Auto-migrate older DBs and retry once.
            if (String(error?.code || '') === '42703' || String(error?.message || '').includes('does not exist')) {
                await ensureCustomerOrdersColumns(client);
                orderInsert = await insertOrder();
            } else {
                throw error;
            }
        }

        const order = orderInsert.rows[0];
        let installments = [];

        if (purchaseMode === 'INSTALLMENT') {
            const amounts = buildInstallmentAmounts(totalPrice, installmentMonths);
            const today = new Date();

            for (let i = 1; i <= installmentMonths; i += 1) {
                const dueDate = addMonths(today, i);
                const amount = amounts[i - 1];
                const inst = await client.query(
                    `
                    INSERT INTO customer_order_installments (
                        order_id,
                        dealer_id,
                        installment_number,
                        due_date,
                        amount,
                        status
                    )
                    VALUES ($1,$2,$3,$4,$5,'PENDING')
                    RETURNING *
                    `,
                    [order.id, order.dealer_id, i, dueDate.toISOString().slice(0, 10), amount]
                );
                installments.push(inst.rows[0]);
            }
        }

        const nextVehicleStatus = purchaseMode === 'CASH' ? 'SOLD' : 'INSTALLMENT';
        const vehicleStatusUpdate = await client.query(
            'UPDATE vehicles SET status = $1 WHERE id = $2 AND dealer_id = $3',
            [nextVehicleStatus, vehicle.id, vehicle.dealer_id]
        );
        if (vehicleStatusUpdate.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: 'Vehicle ownership changed before the order could be completed.' });
        }

        await client.query('COMMIT');

        sendOrderCreatedEmails({
            customer: req.customer,
            order,
            vehicle,
            installments,
        })
            .then((results) => {
                const failed = results.filter((entry) => entry && !entry.sent);
                if (failed.length > 0) {
                    console.warn('Order created email warning:', failed.map((entry) => entry.error).join('; '));
                }
            })
            .catch((mailError) => console.warn('Order created email warning:', mailError.message));

        return res.status(201).json({
            message: 'Order created',
            order,
            vehicle: {
                id: vehicle.id,
                brand: vehicle.brand,
                model: vehicle.model,
                vehicle_type: vehicle.vehicle_type,
                color: vehicle.color,
                description: vehicle.product_description,
                image_url: vehicle.image_url,
            },
            installments,
        });
    } catch (error) {
        try { await client.query('ROLLBACK'); } catch (_) {}
        return res.status(500).json({ message: 'Failed to create order', error: error.message });
    } finally {
        client.release();
    }
};

exports.listOrders = async (req, res) => {
    try {
        const customerAccountId = req.customer.id;
        const result = await pool.query(
            `
            SELECT
                o.*,
                v.brand AS product_brand,
                v.model AS product_model,
                v.vehicle_type AS product_vehicle_type,
                v.color AS product_color,
                v.image_url AS product_image_url,
                v.product_description AS product_description,
                COALESCE(inst.received_count, 0) AS received_installments,
                COALESCE(inst.total_count, 0) AS total_installments
            FROM customer_orders o
            LEFT JOIN vehicles v ON v.id = o.vehicle_id
            LEFT JOIN (
                SELECT
                    order_id,
                    COUNT(*) AS total_count,
                    COUNT(*) FILTER (WHERE status = 'RECEIVED') AS received_count
                FROM customer_order_installments
                GROUP BY order_id
            ) inst ON inst.order_id = o.id
            WHERE o.customer_account_id = $1
              AND o.dealer_id = $2
            ORDER BY o.created_at DESC
            `,
            [customerAccountId, req.customer.preferred_dealer_id || null]
        );

        return res.status(200).json({ orders: result.rows });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to load orders', error: error.message });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const customerAccountId = req.customer.id;
        const orderId = String(req.params.id || '').trim();
        if (!orderId) {
            return res.status(400).json({ message: 'Order id is required' });
        }

        const orderResult = await pool.query(
            `
            SELECT
                o.*,
                v.brand AS product_brand,
                v.model AS product_model,
                v.vehicle_type AS product_vehicle_type,
                v.color AS product_color,
                v.image_url AS product_image_url,
                v.product_description AS product_description
            FROM customer_orders o
            LEFT JOIN vehicles v ON v.id = o.vehicle_id
            WHERE o.id = $1
              AND o.customer_account_id = $2
              AND o.dealer_id = $3
            LIMIT 1
            `,
            [orderId, customerAccountId, req.customer.preferred_dealer_id || null]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const installmentsResult = await pool.query(
            `
            SELECT *
            FROM customer_order_installments
            WHERE order_id = $1
              AND dealer_id = $2
            ORDER BY installment_number ASC
            `,
            [orderId, orderResult.rows[0].dealer_id]
        );

        return res.status(200).json({
            order: orderResult.rows[0],
            installments: installmentsResult.rows,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to load order', error: error.message });
    }
};

exports.receiveInstallment = async (req, res) => {
    try {
        const customerAccountId = req.customer.id;
        const orderId = String(req.params.id || '').trim();
        const installmentNumber = parseInt(req.params.installmentNumber, 10);

        if (!orderId || !Number.isFinite(installmentNumber)) {
            return res.status(400).json({ message: 'Invalid order/installment' });
        }

        const orderCheck = await pool.query(
            `
            SELECT id
            FROM customer_orders
            WHERE id = $1
              AND customer_account_id = $2
              AND dealer_id = $3
            LIMIT 1
            `,
            [orderId, customerAccountId, req.customer.preferred_dealer_id || null]
        );

        if (orderCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const paidAmount = req.body.paid_amount != null ? round2(req.body.paid_amount) : null;

        const update = await pool.query(
            `
            UPDATE customer_order_installments
            SET
                status = 'RECEIVED',
                paid_at = COALESCE(paid_at, now()),
                received_at = COALESCE(received_at, now()),
                paid_amount = COALESCE($3, paid_amount, amount)
            WHERE order_id = $1
              AND installment_number = $2
              AND dealer_id = $4
              AND status <> 'RECEIVED'
            RETURNING *
            `,
            [orderId, installmentNumber, paidAmount, req.customer.preferred_dealer_id || null]
        );

        if (update.rows.length === 0) {
            const existing = await pool.query(
                `
                SELECT *
                FROM customer_order_installments
                WHERE order_id = $1
                  AND installment_number = $2
                  AND dealer_id = $3
                LIMIT 1
                `,
                [orderId, installmentNumber, req.customer.preferred_dealer_id || null]
            );
            if (existing.rows.length === 0) {
                return res.status(404).json({ message: 'Installment not found' });
            }
            return res.status(200).json({ message: 'Already received', installment: existing.rows[0] });
        }

        return res.status(200).json({ message: 'Installment received', installment: update.rows[0] });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update installment', error: error.message });
    }
};
