const pool = require('../config/db');

const round2 = (value) => Math.round((Number(value || 0) || 0) * 100) / 100;
const isSuperAdminSession = (user = {}) =>
    Number(user?.real_role_id || user?.role_id) === 1 ||
    (user?.real_role_name || user?.role_name) === 'SUPER_ADMIN';
const getEffectiveDealerId = (user = {}) => user.effective_dealer_id || user.dealer_id || null;
const hasGlobalScope = (user = {}) => isSuperAdminSession(user) && !getEffectiveDealerId(user);

exports.receiveCustomerOrderInstallment = async (req, res) => {
    try {
        const orderId = String(req.params.id || '').trim();
        const installmentNumber = parseInt(req.params.installmentNumber, 10);
        if (!orderId || !Number.isFinite(installmentNumber)) {
            return res.status(400).json({ message: 'Invalid order/installment' });
        }

        const paidAmount = req.body?.paid_amount != null ? round2(req.body.paid_amount) : null;
        const globalScope = hasGlobalScope(req.user);
        const dealerId = getEffectiveDealerId(req.user);
        if (paidAmount != null && paidAmount < 0) {
            return res.status(400).json({ message: 'paid_amount cannot be negative' });
        }

        const existing = await pool.query(
            `
            SELECT coi.id, coi.status, coi.amount, coi.paid_amount
            FROM customer_order_installments coi
            JOIN customer_orders co ON co.id = coi.order_id
            JOIN customer_accounts ca ON ca.id = co.customer_account_id
            LEFT JOIN vehicles v ON v.id = co.vehicle_id
            LEFT JOIN stock_orders so ON so.id = v.source_stock_order_id
            LEFT JOIN product_catalog pc ON pc.id = so.product_id
            LEFT JOIN users ou ON ou.id = so.ordered_by
            WHERE coi.order_id = $1
              AND coi.installment_number = $2
              ${globalScope ? '' : 'AND COALESCE(ca.preferred_dealer_id, so.dealer_id, ou.dealer_id, pc.dealer_id) = $3'}
            LIMIT 1
            `,
            globalScope ? [orderId, installmentNumber] : [orderId, installmentNumber, dealerId]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({ message: 'Installment not found' });
        }

        if (String(existing.rows[0].status || '').toUpperCase() === 'RECEIVED') {
            return res.status(200).json({ message: 'Already received', installment: existing.rows[0] });
        }

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
            RETURNING *
            `,
            [orderId, installmentNumber, paidAmount]
        );

        return res.status(200).json({ message: 'Installment received', installment: update.rows[0] });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update installment', error: error.message });
    }
};
