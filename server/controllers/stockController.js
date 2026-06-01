const pool = require('../config/db');
const { buildHtml, buildLocalAttachments, sendMailSafe } = require('../utils/mail');
const { resolveDurableUploadUrl } = require('../utils/storage');
const { syncDealerOwnershipForRequest } = require('../utils/dealerOwnershipBootstrap');

const isSuperAdminSession = (user = {}) =>
    Number(user?.real_role_id || user?.role_id) === 1 ||
    (user?.real_role_name || user?.role_name) === 'SUPER_ADMIN';
const getEffectiveDealerId = (user = {}) => user.effective_dealer_id || user.dealer_id || null;
const hasGlobalScope = (user = {}) => isSuperAdminSession(user) && !getEffectiveDealerId(user);
const resolveWriteDealerId = (req) => getEffectiveDealerId(req.user) || req.body?.dealer_id || null;
const resolvedDealerScopeSql = (dealerParamIndex = 1, userParamIndex = 2) => `
    COALESCE(
        (
            SELECT COALESCE(current_user_scope.dealer_id, current_employee_scope.dealer_id, current_admin_dealer.id, current_email_dealer.id)
            FROM users current_user_scope
            LEFT JOIN employees current_employee_scope ON current_employee_scope.user_id = current_user_scope.id
            LEFT JOIN dealers current_admin_dealer ON current_admin_dealer.admin_user_id = current_user_scope.id
            LEFT JOIN dealers current_email_dealer ON LOWER(current_email_dealer.contact_email) = LOWER(current_user_scope.email)
            WHERE current_user_scope.id = $${userParamIndex}::uuid
            LIMIT 1
        ),
        $${dealerParamIndex}::uuid
    )
`;

const stockOrderDealerScopeClause = (dealerParamIndex = 1, userParamIndex = 2) => `
    WHERE (
        so.dealer_id = $${dealerParamIndex}::uuid
        OR u.dealer_id = $${dealerParamIndex}::uuid
        OR pc.dealer_id = $${dealerParamIndex}::uuid
        OR cp.dealer_id = $${dealerParamIndex}::uuid
        OR so.ordered_by = $${userParamIndex}::uuid
        OR so.ordered_by IN (
            SELECT dealer_user.id
            FROM users dealer_user
            WHERE dealer_user.dealer_id = $${dealerParamIndex}::uuid
        )
        OR so.ordered_by IN (
            SELECT dealer_employee.user_id
            FROM employees dealer_employee
            WHERE dealer_employee.dealer_id = $${dealerParamIndex}::uuid
              AND dealer_employee.user_id IS NOT NULL
        )
    )
`;

const stockOrderDealerScopeAndClause = (dealerParamIndex = 2, userParamIndex = 3) => `
    AND (
        so.dealer_id = $${dealerParamIndex}::uuid
        OR u.dealer_id = $${dealerParamIndex}::uuid
        OR pc.dealer_id = $${dealerParamIndex}::uuid
        OR cp.dealer_id = $${dealerParamIndex}::uuid
        OR so.ordered_by = $${userParamIndex}::uuid
        OR so.ordered_by IN (
            SELECT dealer_user.id
            FROM users dealer_user
            WHERE dealer_user.dealer_id = $${dealerParamIndex}::uuid
        )
        OR so.ordered_by IN (
            SELECT dealer_employee.user_id
            FROM employees dealer_employee
            WHERE dealer_employee.dealer_id = $${dealerParamIndex}::uuid
              AND dealer_employee.user_id IS NOT NULL
        )
    )
`;

const runOptionalStockSchemaQuery = async (label, sql) => {
    try {
        await pool.query(sql);
        return true;
    } catch (error) {
        console.warn(`Stock schema migration skipped (${label}):`, error.message);
        return false;
    }
};

const ensureStockScopedColumns = async () => {
    await runOptionalStockSchemaQuery('stock order payment columns', `
        ALTER TABLE stock_orders
            ADD COLUMN IF NOT EXISTS dealer_id UUID,
            ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
            ADD COLUMN IF NOT EXISTS remaining_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
            ADD COLUMN IF NOT EXISTS purchase_paid_at TIMESTAMPTZ
    `);
    await runOptionalStockSchemaQuery('vehicle dealer column', `
        ALTER TABLE vehicles
            ADD COLUMN IF NOT EXISTS dealer_id UUID
    `);
    await runOptionalStockSchemaQuery('backfill stock dealer ownership', `
        WITH stock_owner AS (
            SELECT
                so2.id,
                COALESCE(u.dealer_id, pc.dealer_id, cp.dealer_id) AS dealer_id
            FROM stock_orders so2
            LEFT JOIN users u ON u.id = so2.ordered_by
            LEFT JOIN product_catalog pc ON pc.id = so2.product_id
            LEFT JOIN company_profiles cp ON cp.id = so2.company_profile_id
            WHERE COALESCE(u.dealer_id, pc.dealer_id, cp.dealer_id) IS NOT NULL
        )
        UPDATE stock_orders so
        SET dealer_id = stock_owner.dealer_id
        FROM stock_owner
        WHERE stock_owner.id = so.id
          AND so.dealer_id IS NULL
    `);
    await runOptionalStockSchemaQuery('product catalog ownership columns', `
        ALTER TABLE product_catalog
            ADD COLUMN IF NOT EXISTS dealer_id UUID,
            ADD COLUMN IF NOT EXISTS created_by UUID
    `);
    await runOptionalStockSchemaQuery('company ownership columns', `
        ALTER TABLE company_profiles
            ADD COLUMN IF NOT EXISTS dealer_id UUID,
            ADD COLUMN IF NOT EXISTS created_by UUID
    `);
    await runOptionalStockSchemaQuery('purchase ledger table', `
        CREATE TABLE IF NOT EXISTS purchase_ledger (
            id UUID PRIMARY KEY DEFAULT (md5(random()::text || clock_timestamp()::text)::uuid),
            dealer_id UUID,
            stock_order_id UUID NOT NULL UNIQUE REFERENCES stock_orders(id) ON DELETE CASCADE,
            company_profile_id UUID REFERENCES company_profiles(id) ON DELETE SET NULL,
            vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
            company_name VARCHAR(255) NOT NULL,
            vehicle_label VARCHAR(255) NOT NULL,
            color VARCHAR(120),
            registration_number VARCHAR(120),
            chassis_number VARCHAR(160),
            engine_number VARCHAR(160),
            purchase_date TIMESTAMPTZ,
            paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
            remaining_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
            payment_date TIMESTAMPTZ,
            notes TEXT,
            created_by UUID,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);
    await runOptionalStockSchemaQuery('purchase ledger optional columns', `
        ALTER TABLE purchase_ledger
            ADD COLUMN IF NOT EXISTS dealer_id UUID,
            ADD COLUMN IF NOT EXISTS vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
            ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    `);
};

const roundMoney = (value) => Math.round(Number(value || 0) * 100) / 100;
const calculateRemainingAmount = (totalAmount, paidAmount) =>
    Math.max(roundMoney(totalAmount) - roundMoney(paidAmount), 0);

const upsertPurchaseLedger = async (client, order, userId = null) => {
    const vehicleResult = await client.query(
        `
        SELECT id, registration_number, chassis_number, engine_number, color, image_url
        FROM vehicles
        WHERE source_stock_order_id = $1
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [order.id]
    );
    const vehicle = vehicleResult.rows[0] || {};
    const vehicleLabel = [order.brand, order.model, order.vehicle_type].filter(Boolean).join(' / ') || 'Vehicle';

    await client.query(
        `
        INSERT INTO purchase_ledger (
            dealer_id,
            stock_order_id,
            company_profile_id,
            vehicle_id,
            company_name,
            vehicle_label,
            color,
            registration_number,
            chassis_number,
            engine_number,
            purchase_date,
            paid_amount,
            remaining_amount,
            payment_date,
            notes,
            created_by,
            updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,NOW())
        ON CONFLICT (stock_order_id) DO UPDATE SET
            dealer_id = EXCLUDED.dealer_id,
            company_profile_id = EXCLUDED.company_profile_id,
            vehicle_id = EXCLUDED.vehicle_id,
            company_name = EXCLUDED.company_name,
            vehicle_label = EXCLUDED.vehicle_label,
            color = EXCLUDED.color,
            registration_number = EXCLUDED.registration_number,
            chassis_number = EXCLUDED.chassis_number,
            engine_number = EXCLUDED.engine_number,
            purchase_date = EXCLUDED.purchase_date,
            paid_amount = EXCLUDED.paid_amount,
            remaining_amount = EXCLUDED.remaining_amount,
            payment_date = EXCLUDED.payment_date,
            notes = EXCLUDED.notes,
            updated_at = NOW()
        `,
        [
            order.dealer_id || null,
            order.id,
            order.company_profile_id || null,
            vehicle.id || null,
            order.company_name || 'Supplier',
            vehicleLabel,
            vehicle.color || order.color || null,
            vehicle.registration_number || order.registration_number || null,
            vehicle.chassis_number || order.chassis_number || null,
            vehicle.engine_number || order.engine_number || null,
            order.expected_delivery_date || order.created_at || null,
            roundMoney(order.paid_amount),
            roundMoney(order.remaining_amount),
            order.purchase_paid_at || null,
            order.notes || null,
            userId,
        ]
    );
};

const normalizeStockOrderId = (orderId) => String(orderId || '').replace(/-/g, '').toUpperCase();
const buildStockRegistrationNumber = (orderId, pieceNumber) =>
    `STK-${normalizeStockOrderId(orderId)}-${String(pieceNumber).padStart(3, '0')}`;
const stockOrderSaleLockSql = `
    SELECT st.id
    FROM vehicles v
    JOIN sales_transactions st ON st.vehicle_id = v.id
    WHERE v.source_stock_order_id = $1
    LIMIT 1
`;
const getStockOrderSaleLock = async (client, stockOrderId) => {
    const result = await client.query(stockOrderSaleLockSql, [stockOrderId]);
    return result.rows[0] || null;
};
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
const getDuplicateVehicleFieldMessage = (field, value) => {
    const fieldLabels = {
        registration_number: 'Registration number',
        chassis_number: 'Chassis number',
        engine_number: 'Engine number',
    };
    return `${fieldLabels[field] || 'Vehicle reference'} "${value}" already exists in inventory. Duplicate registration, chassis, or engine numbers are not allowed.`;
};
const checkReceivedVehicleDuplicate = async (client, { field, value, sourceStockOrderId }) => {
    const normalizedValue = String(value || '').trim();
    if (!normalizedValue) return '';

    const allowedFields = new Set(['registration_number', 'chassis_number', 'engine_number']);
    if (!allowedFields.has(field)) return '';

    const result = await client.query(
        `
        SELECT id
        FROM vehicles
        WHERE UPPER(${field}) = UPPER($1)
          AND ($2::uuid IS NULL OR source_stock_order_id IS DISTINCT FROM $2::uuid)
        LIMIT 1
        `,
        [normalizedValue, sourceStockOrderId || null]
    );

    return result.rows.length > 0 ? getDuplicateVehicleFieldMessage(field, normalizedValue) : '';
};
const checkReceivedVehicleDuplicates = async (client, item, sourceStockOrderId) => {
    const fields = [
        ['registration_number', item.registration_number],
        ['chassis_number', item.chassis_number],
        ['engine_number', item.engine_number],
    ];

    for (const [field, value] of fields) {
        const message = await checkReceivedVehicleDuplicate(client, { field, value, sourceStockOrderId });
        if (message) return message;
    }

    return '';
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
const normalizeInventoryVehicleType = (value) => {
    const type = String(value || '').trim().toUpperCase();
    if (type === 'MOTOR_CAR') {
        return 'CAR';
    }
    if (type === 'MOTORCYCLE' || type === 'MOTOR_BIKE') {
        return 'BIKE';
    }
    if (['BIKE', 'MOTOR', 'CAR', 'SUV', 'VAN', 'TRUCK', 'BUS'].includes(type)) {
        return type;
    }
    return 'MOTOR';
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
        expected_delivery_date ? `Order date: ${expected_delivery_date}` : '',
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
          ${globalScope ? '' : stockOrderDealerScopeAndClause(2, 3)}
        LIMIT 1
        `,
        globalScope ? [orderId] : [orderId, dealerId, user.id]
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

    const duplicateMessage = await checkReceivedVehicleDuplicates(
        client,
        {
            registration_number: registrationNumber,
            chassis_number: chassisNumber,
            engine_number: engineNumber,
        },
        order.id
    );
    if (duplicateMessage) {
        const duplicateError = new Error(duplicateMessage);
        duplicateError.statusCode = 409;
        throw duplicateError;
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
            dealer_id,
            status
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        `,
        [
            order.brand,
            order.model,
            registrationNumber,
            normalizeInventoryVehicleType(order.vehicle_type),
            chassisNumber,
            engineNumber,
            serialNumber,
            order.id,
            itemColor || null,
            order.product_description || null,
            order.image_url || null,
            Number(order.monthly_rate || 0),
            Number(order.unit_price || 0),
            order.dealer_id || null,
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
        await syncDealerOwnershipForRequest();
        const globalScope = hasGlobalScope(req.user);
        const dealerId = getEffectiveDealerId(req.user);
        await reconcileReceivedStockOrders();

        const result = await pool.query(
            `
            WITH stock_rows AS (
                SELECT
                    so.*,
                    received_vehicle.registration_number AS received_registration_number,
                    received_vehicle.chassis_number AS received_chassis_number,
                    received_vehicle.engine_number AS received_engine_number,
                    COALESCE(so.received_at, received_vehicle.created_at) AS effective_received_at,
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
                    u.full_name AS ordered_by_name,
                    EXISTS (
                        SELECT 1
                        FROM vehicles sold_vehicle
                        JOIN sales_transactions sold_sale ON sold_sale.vehicle_id = sold_vehicle.id
                        WHERE sold_vehicle.source_stock_order_id = so.id
                    ) AS is_locked_by_sale,
                    COALESCE(
                        so.dealer_id,
                        pc.dealer_id,
                        cp.dealer_id,
                        u.dealer_id,
                        ordered_employee.dealer_id,
                        ordered_admin_dealer.id,
                        ordered_email_dealer.id
                    ) AS resolved_dealer_id,
                    CASE
                        WHEN so.dealer_id IS NOT NULL THEN 'stock_order'
                        WHEN pc.dealer_id IS NOT NULL THEN 'product'
                        WHEN cp.dealer_id IS NOT NULL THEN 'company'
                        WHEN u.dealer_id IS NOT NULL THEN 'ordered_by_user'
                        WHEN ordered_employee.dealer_id IS NOT NULL THEN 'ordered_by_employee'
                        WHEN ordered_admin_dealer.id IS NOT NULL THEN 'ordered_by_admin_dealer'
                        WHEN ordered_email_dealer.id IS NOT NULL THEN 'ordered_by_email_dealer'
                        ELSE 'unmapped'
                    END AS ownership_source
                FROM stock_orders so
                LEFT JOIN company_profiles cp ON cp.id = so.company_profile_id
                LEFT JOIN product_catalog pc ON pc.id = so.product_id
                LEFT JOIN users u ON u.id = so.ordered_by
                LEFT JOIN employees ordered_employee ON ordered_employee.user_id = u.id
                LEFT JOIN dealers ordered_admin_dealer ON ordered_admin_dealer.admin_user_id = u.id
                LEFT JOIN dealers ordered_email_dealer ON LOWER(ordered_email_dealer.contact_email) = LOWER(u.email)
                LEFT JOIN LATERAL (
                    SELECT
                        v.registration_number,
                        v.chassis_number,
                        v.engine_number,
                        v.created_at
                    FROM vehicles v
                    WHERE v.source_stock_order_id = so.id
                    ORDER BY v.created_at DESC
                    LIMIT 1
                ) received_vehicle ON true
            )
            SELECT *
            FROM stock_rows
            ${globalScope ? '' : `WHERE (
                resolved_dealer_id = $1::uuid
                OR ordered_by = $2::uuid
            )`}
            ORDER BY created_at DESC
            `,
            globalScope ? [] : [dealerId, req.user.id]
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
        const dealerId = resolveWriteDealerId(req);
        if (!dealerId) {
            return res.status(403).json({ message: 'Select a dealer before creating stock orders. Stock cannot be saved as global records.' });
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
            SELECT cp.id, cp.company_name, cp.company_email
            FROM company_profiles cp
            LEFT JOIN users creator ON creator.id = cp.created_by
            LEFT JOIN LATERAL (
                SELECT COALESCE(so.dealer_id, u.dealer_id) AS dealer_id
                FROM stock_orders so
                LEFT JOIN users u ON u.id = so.ordered_by
                WHERE so.company_profile_id = cp.id
                  AND COALESCE(so.dealer_id, u.dealer_id) IS NOT NULL
                ORDER BY so.created_at DESC
                LIMIT 1
            ) stock_owner ON true
            WHERE cp.id = $1
              AND cp.is_active = TRUE
              AND COALESCE(cp.dealer_id, creator.dealer_id, stock_owner.dealer_id) = $2
            `,
            [company_profile_id, dealerId]
        );

        if (companyResult.rows.length === 0) {
            return res.status(400).json({ message: 'Select a valid company profile.' });
        }

        const productResult = await pool.query(
            `
            SELECT pc.id, pc.brand, pc.model, pc.serial_number, pc.vehicle_type, pc.image_url, pc.monthly_rate, pc.purchase_price, pc.color, pc.description
            FROM product_catalog pc
            LEFT JOIN users creator ON creator.id = pc.created_by
            LEFT JOIN LATERAL (
                SELECT COALESCE(so.dealer_id, u.dealer_id) AS dealer_id
                FROM stock_orders so
                LEFT JOIN users u ON u.id = so.ordered_by
                WHERE so.product_id = pc.id
                  AND COALESCE(so.dealer_id, u.dealer_id) IS NOT NULL
                ORDER BY so.created_at DESC
                LIMIT 1
            ) stock_owner ON true
            WHERE pc.id = $1
              AND pc.is_active = TRUE
              AND COALESCE(pc.dealer_id, creator.dealer_id, stock_owner.dealer_id) = $2
            `,
            [product_id, dealerId]
        );

        if (productResult.rows.length === 0) {
            return res.status(400).json({ message: 'Select a valid product vehicle from the product master.' });
        }

        const company = companyResult.rows[0];
        const product = productResult.rows[0];
        const orderTotalAmount = roundMoney(total_amount || unit_price || product.purchase_price || 0);
        const orderPaidAmount = 0;
        const orderRemainingAmount = calculateRemainingAmount(orderTotalAmount, orderPaidAmount);

        const result = await pool.query(
            `
            INSERT INTO stock_orders (
                ordered_by, dealer_id, company_profile_id, company_name, company_email, product_id, vehicle_type, brand, model,
                chassis_number, engine_number, serial_number, quantity, unit_price, total_amount, paid_amount, remaining_amount, product_description,
                expected_delivery_date, bank_slip_url, notes, order_status
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
            RETURNING *
            `,
            [
                req.user.id,
                dealerId,
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
                orderTotalAmount,
                orderPaidAmount,
                orderRemainingAmount,
                product.description || null,
                expected_delivery_date || null,
                bank_slip_url,
                notes || null,
                order_status || 'PROCESSING',
            ]
        );

        const order = result.rows[0];
        const ledgerClient = await pool.connect();
        try {
            await upsertPurchaseLedger(ledgerClient, order, req.user.id);
        } catch (ledgerError) {
            console.warn('Purchase ledger sync skipped after stock order create:', ledgerError.message);
        } finally {
            ledgerClient.release();
        }
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
        const hasDealerScope = !globalScope && Boolean(dealerId);
        await ensureStockScopedColumns();
        const {
            order_status,
            received_quantity,
            received_at,
            company_profile_id,
            product_id,
            unit_price,
            total_amount,
            paid_amount,
            payment_amount,
            payment_date,
            expected_delivery_date,
            bank_slip_url,
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
            LEFT JOIN company_profiles cp ON cp.id = so.company_profile_id
            LEFT JOIN users u ON u.id = so.ordered_by
            WHERE so.id = $1
              ${globalScope ? '' : stockOrderDealerScopeAndClause(2, 3)}
            FOR UPDATE OF so
            `,
            globalScope ? [req.params.id] : [req.params.id, dealerId, req.user.id]
        );

        if (currentOrderResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Stock order not found' });
        }

        const currentOrder = currentOrderResult.rows[0];
        const saleLock = await getStockOrderSaleLock(client, currentOrder.id);
        if (saleLock) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: 'This stock order is locked because a customer transaction has already been created.' });
        }

        let nextCompany = {
            id: currentOrder.company_profile_id,
            company_name: currentOrder.company_name,
            company_email: currentOrder.company_email,
        };
        if (company_profile_id && company_profile_id !== currentOrder.company_profile_id) {
            const companyResult = await client.query(
                `
                SELECT cp.id, cp.company_name, cp.company_email
                FROM company_profiles cp
                LEFT JOIN users creator ON creator.id = cp.created_by
                WHERE cp.id = $1
                  AND cp.is_active = TRUE
                  ${hasDealerScope ? 'AND COALESCE(cp.dealer_id, creator.dealer_id) = $2' : ''}
                `,
                hasDealerScope ? [company_profile_id, dealerId] : [company_profile_id]
            );

            if (companyResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'Select a valid company profile.' });
            }

            nextCompany = companyResult.rows[0];
        }

        let nextProduct = {
            id: currentOrder.product_id,
            brand: currentOrder.brand,
            model: currentOrder.model,
            serial_number: currentOrder.serial_number,
            vehicle_type: currentOrder.vehicle_type,
            color: currentOrder.color,
            description: currentOrder.product_description,
            purchase_price: currentOrder.unit_price,
        };
        if (product_id && product_id !== currentOrder.product_id) {
            const productResult = await client.query(
                `
                SELECT pc.id, pc.brand, pc.model, pc.serial_number, pc.vehicle_type, pc.purchase_price, pc.color, pc.description
                FROM product_catalog pc
                LEFT JOIN users creator ON creator.id = pc.created_by
                WHERE pc.id = $1
                  AND pc.is_active = TRUE
                  ${hasDealerScope ? 'AND COALESCE(pc.dealer_id, creator.dealer_id) = $2' : ''}
                `,
                hasDealerScope ? [product_id, dealerId] : [product_id]
            );

            if (productResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'Select a valid product vehicle from the product master.' });
            }

            nextProduct = productResult.rows[0];
        }

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
        const nextTotalAmount = total_amount === undefined || total_amount === ''
            ? roundMoney(currentOrder.total_amount)
            : roundMoney(total_amount);
        const currentPaidAmount = roundMoney(currentOrder.paid_amount);
        let nextPaidAmount = paid_amount === undefined || paid_amount === ''
            ? currentPaidAmount
            : roundMoney(paid_amount);
        const paymentAmount = payment_amount === undefined || payment_amount === ''
            ? 0
            : roundMoney(payment_amount);
        const currentRemainingAmount = calculateRemainingAmount(nextTotalAmount, nextPaidAmount);

        if (paymentAmount > 0) {
            if (paymentAmount > currentRemainingAmount) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: `Payment amount cannot be greater than the remaining balance of ${currentRemainingAmount}.` });
            }
            nextPaidAmount = Math.min(roundMoney(nextPaidAmount + paymentAmount), nextTotalAmount);
        }

        if (nextPaidAmount > nextTotalAmount) {
            nextPaidAmount = nextTotalAmount;
        }
        const nextRemainingAmount = calculateRemainingAmount(nextTotalAmount, nextPaidAmount);
        const nextPaymentDate = paymentAmount > 0
            ? (payment_date || new Date().toISOString())
            : (currentOrder.purchase_paid_at || null);

        const result = await client.query(
            `
            UPDATE stock_orders
            SET
                quantity = 1,
                order_status = COALESCE($2, order_status),
                received_quantity = COALESCE($3, received_quantity),
                received_at = COALESCE($4, received_at),
                notes = COALESCE($5, notes),
                company_profile_id = COALESCE($6, company_profile_id),
                company_name = COALESCE($7, company_name),
                company_email = COALESCE($8, company_email),
                product_id = COALESCE($9, product_id),
                vehicle_type = COALESCE($10, vehicle_type),
                brand = COALESCE($11, brand),
                model = COALESCE($12, model),
                serial_number = COALESCE($13, serial_number),
                unit_price = COALESCE($14, unit_price),
                total_amount = COALESCE($15, total_amount),
                paid_amount = $16,
                remaining_amount = $17,
                purchase_paid_at = COALESCE($18, purchase_paid_at),
                product_description = COALESCE($19, product_description),
                expected_delivery_date = COALESCE($20, expected_delivery_date),
                bank_slip_url = COALESCE($21, bank_slip_url)
            WHERE id = $1
            RETURNING *
            `,
            [
                req.params.id,
                nextOrderStatus || null,
                nextReceivedQuantity,
                received_at || null,
                notes || null,
                nextCompany.id || null,
                nextCompany.company_name || null,
                nextCompany.company_email || null,
                nextProduct.id || null,
                String(nextProduct.vehicle_type || '').toUpperCase() || null,
                nextProduct.brand || null,
                nextProduct.model || null,
                nextProduct.serial_number || null,
                unit_price === undefined || unit_price === '' ? null : Number(unit_price),
                nextTotalAmount,
                nextPaidAmount,
                nextRemainingAmount,
                nextPaymentDate,
                nextProduct.description || null,
                expected_delivery_date || null,
                bank_slip_url || null,
            ]
        );

        const updatedOrder = result.rows[0];
        await client.query(
            `
            UPDATE vehicles
            SET
                brand = $2,
                model = $3,
                vehicle_type = $4,
                color = COALESCE(color, $5),
                product_description = $6,
                purchase_price = $7,
                monthly_rate = 0
            WHERE source_stock_order_id = $1
            `,
            [
                currentOrder.id,
                updatedOrder.brand,
                updatedOrder.model,
                normalizeInventoryVehicleType(updatedOrder.vehicle_type),
                updatedOrder.color || null,
                updatedOrder.product_description || null,
                Number(updatedOrder.unit_price || 0),
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
        try {
            await upsertPurchaseLedger(client, updatedOrder, req.user.id);
        } catch (ledgerError) {
            console.warn('Purchase ledger sync skipped after stock order update:', ledgerError.message);
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
        if (error.statusCode === 409) {
            return res.status(409).json({ message: error.message });
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

exports.deleteStockOrder = async (req, res) => {
    const client = await pool.connect();

    try {
        const globalScope = hasGlobalScope(req.user);
        const dealerId = getEffectiveDealerId(req.user);
        await ensureStockScopedColumns();

        await client.query('BEGIN');

        const currentOrderResult = await client.query(
            `
            SELECT so.*
            FROM stock_orders so
            LEFT JOIN product_catalog pc ON pc.id = so.product_id
            LEFT JOIN company_profiles cp ON cp.id = so.company_profile_id
            LEFT JOIN users u ON u.id = so.ordered_by
            WHERE so.id = $1
              ${globalScope ? '' : stockOrderDealerScopeAndClause(2, 3)}
            FOR UPDATE OF so
            `,
            globalScope ? [req.params.id] : [req.params.id, dealerId, req.user.id]
        );

        if (currentOrderResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Stock order not found' });
        }

        const saleLock = await getStockOrderSaleLock(client, req.params.id);
        if (saleLock) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: 'This stock order is locked because a customer transaction has already been created.' });
        }

        await client.query('DELETE FROM vehicles WHERE source_stock_order_id = $1', [req.params.id]);
        await client.query('DELETE FROM stock_orders WHERE id = $1', [req.params.id]);

        await client.query('COMMIT');
        res.status(200).json({ message: 'Stock order deleted successfully.' });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Failed to delete stock order', error: error.message });
    } finally {
        client.release();
    }
};
exports.reconcileReceivedStockOrders = reconcileReceivedStockOrders;
exports.ensureStockScopedColumns = ensureStockScopedColumns;
