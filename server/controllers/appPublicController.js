const pool = require('../config/db');

const safeNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};

const computePercentPrice = (basePrice, percent) => {
    const base = safeNumber(basePrice);
    const pct = safeNumber(percent);
    return Math.round((base * (1 + pct / 100)) * 100) / 100;
};

const computeCashPrice = (basePrice, percent, value) => {
    const base = safeNumber(basePrice);
    const marginValue = safeNumber(value);
    if (marginValue > 0) {
        return Math.round((base + marginValue) * 100) / 100;
    }
    return computePercentPrice(base, percent);
};

exports.listDealers = async (_req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                id,
                dealer_code,
                dealer_name,
                dealer_logo_url,
                dealer_address,
                mobile_country_code,
                mobile_number,
                contact_email,
                currency_code,
                application_slug,
                is_active
            FROM dealers
            WHERE is_active = true
            ORDER BY dealer_name ASC
            `
        );

        return res.status(200).json({ dealers: result.rows });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to load dealers', error: error.message });
    }
};

exports.listAds = async (req, res) => {
    try {
        const dealerId = req.query.dealer_id ? String(req.query.dealer_id) : null;
        const params = [];
        const where = [];

        where.push('is_active = true');
        where.push('(start_at IS NULL OR start_at <= now())');
        where.push('(end_at IS NULL OR end_at >= now())');

        if (dealerId) {
            params.push(dealerId);
            where.push(`dealer_id = $${params.length}`);
        } else {
            return res.status(200).json({ ads: [] });
        }

        const result = await pool.query(
            `
            SELECT
                id,
                dealer_id,
                title,
                subtitle,
                image_url,
                cta_label,
                cta_url,
                display_order,
                start_at,
                end_at
            FROM app_ads
            ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
            ORDER BY display_order ASC, created_at DESC
            `,
            params
        );

        return res.status(200).json({ ads: result.rows });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to load ads', error: error.message });
    }
};

exports.listProducts = async (req, res) => {
    try {
        const dealerId = req.query.dealer_id ? String(req.query.dealer_id) : null;
        if (!dealerId) {
            return res.status(200).json({ products: [] });
        }

        const result = await pool.query(
            `
            SELECT
                id,
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
                is_active,
                created_at,
                updated_at
            FROM product_catalog
            WHERE is_active = true
              AND dealer_id = $1
            ORDER BY created_at DESC, brand ASC, model ASC
            `,
            [dealerId]
        );

        const products = result.rows.map((row) => {
            const basePrice = safeNumber(row.purchase_price);
            const cashTotal = computeCashPrice(basePrice, row.cash_markup_percent, row.cash_markup_value);
            const installmentTotal = computePercentPrice(basePrice, row.installment_markup_percent);
            const months = Math.max(0, parseInt(row.installment_months, 10) || 0);
            const monthlyAmount = months > 0
                ? Math.round((installmentTotal / months) * 100) / 100
                : safeNumber(row.monthly_rate);

            return {
                ...row,
                base_price: basePrice,
                cash_total_price: cashTotal,
                installment_total_price: installmentTotal,
                installment_monthly_amount: monthlyAmount,
            };
        });

        return res.status(200).json({ products });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to load products', error: error.message });
    }
};

exports.listAvailableVehicles = async (req, res) => {
    try {
        const dealerId = req.query.dealer_id ? String(req.query.dealer_id) : null;
        const params = [];
        const where = [];

        where.push(`UPPER(COALESCE(v.status, '')) = 'AVAILABLE'`);
        // Extra hardening: some older data may keep vehicle.status as AVAILABLE even after a sale/order.
        // Exclude vehicles that have any non-rejected sale transaction or any active/pending customer order.
        where.push(`NOT EXISTS (
            SELECT 1
            FROM sales_transactions st
            WHERE st.vehicle_id = v.id
              AND UPPER(COALESCE(st.approval_status, 'APPROVED')) <> 'REJECTED'
        )`);
        where.push(`NOT EXISTS (
            SELECT 1
            FROM customer_orders co
            WHERE co.vehicle_id = v.id
              AND UPPER(COALESCE(co.status, 'PENDING')) IN ('PENDING', 'ACTIVE')
        )`);

        if (dealerId) {
            params.push(dealerId);
            where.push(`COALESCE(so.dealer_id, ou.dealer_id, pc.dealer_id) = $${params.length}`);
        } else {
            return res.status(200).json({ vehicles: [] });
        }

        const result = await pool.query(
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
                v.serial_number,
                v.registration_number,
                v.chassis_number,
                v.engine_number,
                v.purchase_price,
                v.monthly_rate,
                d.id AS dealer_id,
                d.dealer_name,
                d.dealer_code,
                pc.id AS product_id,
                pc.cash_markup_percent,
                pc.cash_markup_value,
                pc.installment_markup_percent,
                pc.installment_months
            FROM vehicles v
            LEFT JOIN stock_orders so ON so.id = v.source_stock_order_id
            LEFT JOIN users ou ON ou.id = so.ordered_by
            LEFT JOIN product_catalog pc ON pc.id = so.product_id
            LEFT JOIN dealers d ON d.id = COALESCE(so.dealer_id, ou.dealer_id, pc.dealer_id)
            ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
            ORDER BY v.created_at DESC NULLS LAST, v.brand ASC, v.model ASC
            `,
            params
        );

        const vehicles = result.rows.map((row) => {
            const basePrice = safeNumber(row.purchase_price);
            const cashTotal = computeCashPrice(basePrice, row.cash_markup_percent, row.cash_markup_value);
            const installmentTotal = computePercentPrice(basePrice, row.installment_markup_percent);
            const months = Math.max(0, parseInt(row.installment_months, 10) || 0) || 12;
            const monthlyAmount = months > 0
                ? Math.round((installmentTotal / months) * 100) / 100
                : safeNumber(row.monthly_rate);

            return {
                ...row,
                base_price: basePrice,
                cash_total_price: cashTotal,
                installment_total_price: installmentTotal,
                installment_months: months,
                installment_monthly_amount: monthlyAmount,
            };
        });

        return res.status(200).json({ vehicles });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to load vehicles', error: error.message });
    }
};
