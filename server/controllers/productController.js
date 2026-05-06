const pool = require('../config/db');
const { resolveDurableUploadUrl } = require('../utils/storage');

const isSuperAdminSession = (user = {}) =>
    Number(user?.real_role_id || user?.role_id) === 1 ||
    (user?.real_role_name || user?.role_name) === 'SUPER_ADMIN';
const getEffectiveDealerId = (user = {}) => user.effective_dealer_id || user.dealer_id || null;
const hasGlobalScope = (user = {}) => isSuperAdminSession(user) && !getEffectiveDealerId(user);

const ensureProductDealerColumns = async () => {
    await pool.query(`
        ALTER TABLE product_catalog
            ADD COLUMN IF NOT EXISTS dealer_id UUID,
            ADD COLUMN IF NOT EXISTS created_by UUID
    `);
    await pool.query(`
        ALTER TABLE stock_orders
            ADD COLUMN IF NOT EXISTS dealer_id UUID
    `);

    await pool.query(`
        UPDATE product_catalog pc
        SET dealer_id = creator.dealer_id
        FROM users creator
        WHERE creator.id = pc.created_by
          AND pc.dealer_id IS NULL
          AND creator.dealer_id IS NOT NULL
    `);

    await pool.query(`
        UPDATE product_catalog pc
        SET dealer_id = scoped.dealer_id
        FROM (
            SELECT DISTINCT ON (so.product_id)
                so.product_id,
                COALESCE(so.dealer_id, u.dealer_id) AS dealer_id
            FROM stock_orders so
            JOIN users u ON u.id = so.ordered_by
            WHERE so.product_id IS NOT NULL
              AND COALESCE(so.dealer_id, u.dealer_id) IS NOT NULL
            ORDER BY so.product_id, so.created_at DESC
        ) scoped
        WHERE scoped.product_id = pc.id
          AND pc.dealer_id IS NULL
    `);
};

const ensureVehicleTypesTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicle_types (
            id INTEGER PRIMARY KEY,
            type_key VARCHAR(80) NOT NULL UNIQUE,
            display_name VARCHAR(120) NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            sort_order INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await pool.query(`
        ALTER TABLE vehicle_types
            ADD COLUMN IF NOT EXISTS type_key VARCHAR(80),
            ADD COLUMN IF NOT EXISTS display_name VARCHAR(120),
            ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
            ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0,
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    `);

};

const getNextVehicleTypeId = async () => {
    const result = await pool.query('SELECT COALESCE(MAX(id), 0)::int + 1 AS next_id FROM vehicle_types');
    return Number(result.rows[0]?.next_id || 1);
};

exports.listProducts = async (req, res) => {
    try {
        await ensureProductDealerColumns();
        const globalScope = hasGlobalScope(req.user);
        const dealerId = getEffectiveDealerId(req.user);

        const result = await pool.query(
            `
            SELECT
                pc.id,
                pc.brand,
                pc.model,
                pc.serial_number,
                pc.registration_number,
                pc.vehicle_type,
                pc.chassis_number,
                pc.engine_number,
                pc.color,
                pc.description,
                pc.image_url,
                pc.monthly_rate,
                pc.purchase_price,
                pc.cash_markup_percent,
                pc.cash_markup_value,
                pc.installment_markup_percent,
                pc.installment_months,
                pc.is_active,
                pc.created_at,
                pc.updated_at
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
            WHERE pc.is_active = TRUE
              ${globalScope ? '' : 'AND COALESCE(pc.dealer_id, creator.dealer_id, stock_owner.dealer_id) = $1'}
            ORDER BY pc.created_at DESC, pc.brand ASC, pc.model ASC
            `,
            globalScope ? [] : [dealerId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load products', error: error.message });
    }
};

exports.listVehicleTypes = async (_req, res) => {
    try {
        await ensureVehicleTypesTable();

        const result = await pool.query(
            `
            SELECT id, type_key, display_name, is_active, sort_order
            FROM vehicle_types
            WHERE is_active = TRUE
            ORDER BY sort_order ASC, display_name ASC
            `
        );

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load vehicle types', error: error.message });
    }
};

exports.createVehicleType = async (req, res) => {
    try {
        await ensureVehicleTypesTable();

        const rawName = String(req.body.display_name || req.body.type_key || '').trim();
        if (!rawName) {
            return res.status(400).json({ message: 'Vehicle type name is required' });
        }

        const typeKey = rawName.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');

        const existingResult = await pool.query(
            `
            SELECT id
            FROM vehicle_types
            WHERE type_key = $1
            LIMIT 1
            `,
            [typeKey]
        );

        let result;

        if (existingResult.rows.length > 0) {
            result = await pool.query(
                `
                UPDATE vehicle_types
                SET display_name = $2,
                    is_active = TRUE
                WHERE id = $1
                RETURNING id, type_key, display_name, is_active, sort_order
                `,
                [existingResult.rows[0].id, rawName]
            );
        } else {
            const nextId = await getNextVehicleTypeId();
            result = await pool.query(
                `
                INSERT INTO vehicle_types (id, type_key, display_name, is_active, sort_order)
                VALUES (
                    $1,
                    $2,
                    $3,
                    TRUE,
                    COALESCE((SELECT MAX(sort_order) + 1 FROM vehicle_types), 1)
                )
                RETURNING id, type_key, display_name, is_active, sort_order
                `,
                [nextId, typeKey, rawName]
            );
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create vehicle type',
            error: error.message,
            codeVersion: 'vehicle-types-bound-id-v2',
        });
    }
};

exports.createProduct = async (req, res) => {
    try {
        await ensureProductDealerColumns();
        const globalScope = hasGlobalScope(req.user);
        const dealerId = getEffectiveDealerId(req.user);
        if (!globalScope && !dealerId) {
            return res.status(403).json({ message: 'Dealer scope is required to create products.' });
        }

        const {
            brand,
            model,
            vehicle_type,
            color,
            description,
            image_url,
            monthly_rate,
            purchase_price,
            cash_markup_percent,
            cash_markup_value,
            installment_markup_percent,
            installment_months,
        } = req.body;

        if (!image_url) {
            return res.status(400).json({ message: 'Product image is required' });
        }

        const vehicleTypeCheck = await pool.query(
            'SELECT type_key FROM vehicle_types WHERE type_key = $1 AND is_active = TRUE',
            [String(vehicle_type || '').toUpperCase()]
        );

        if (vehicleTypeCheck.rows.length === 0) {
            return res.status(400).json({ message: 'Select a valid vehicle type from the master table.' });
        }
        const result = await pool.query(
            `
            INSERT INTO product_catalog (
                brand,
                model,
                vehicle_type,
                color,
                description,
                image_url,
                monthly_rate,
                purchase_price,
                cash_markup_percent,
                cash_markup_value,
                installment_markup_percent,
                installment_months,
                dealer_id,
                created_by
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
            RETURNING *
            `,
            [
                brand,
                model,
                String(vehicle_type || '').toUpperCase(),
                color || null,
                description || null,
                image_url,
                monthly_rate || 0,
                purchase_price || 0,
                cash_markup_percent || 0,
                cash_markup_value || 0,
                installment_markup_percent || 0,
                installment_months || 12,
                globalScope ? null : dealerId,
                req.user.id,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        await ensureProductDealerColumns();
        const globalScope = hasGlobalScope(req.user);
        const dealerId = getEffectiveDealerId(req.user);

        const {
            brand,
            model,
            vehicle_type,
            color,
            description,
            image_url,
            monthly_rate,
            purchase_price,
            cash_markup_percent,
            cash_markup_value,
            installment_markup_percent,
            installment_months,
        } = req.body;

        if (!String(brand || '').trim() || !String(model || '').trim() || !String(vehicle_type || '').trim()) {
            return res.status(400).json({ message: 'Brand, model, and vehicle type are required.' });
        }

        if (!image_url) {
            return res.status(400).json({ message: 'Product image is required' });
        }

        const vehicleTypeCheck = await pool.query(
            'SELECT type_key FROM vehicle_types WHERE type_key = $1 AND is_active = TRUE',
            [String(vehicle_type || '').toUpperCase()]
        );

        if (vehicleTypeCheck.rows.length === 0) {
            return res.status(400).json({ message: 'Select a valid vehicle type from the master table.' });
        }

        const result = await pool.query(
            `
            UPDATE product_catalog
            SET
                brand = $1,
                model = $2,
                vehicle_type = $3,
                color = $4,
                description = $5,
                image_url = $6,
                monthly_rate = $7,
                purchase_price = $8,
                cash_markup_percent = $9,
                cash_markup_value = $10,
                installment_markup_percent = $11,
                installment_months = $12,
                updated_at = NOW()
            WHERE id = $13
              ${globalScope ? '' : 'AND dealer_id = $14'}
            RETURNING *
            `,
            [
                String(brand || '').trim(),
                String(model || '').trim(),
                String(vehicle_type || '').toUpperCase().trim(),
                color || null,
                description || null,
                image_url,
                monthly_rate || 0,
                purchase_price || 0,
                cash_markup_percent || 0,
                cash_markup_value || 0,
                installment_markup_percent || 0,
                installment_months || 12,
                req.params.id,
                ...(globalScope ? [] : [dealerId]),
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
};

exports.uploadProductImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Product image is required' });
    }

    const fallbackUrl = `/uploads/products/${req.file.filename}`;
    const url = await resolveDurableUploadUrl(req.file, 'products', fallbackUrl);

    res.status(201).json({
        fileName: req.file.filename,
        originalName: req.file.originalname,
        url,
    });
};
