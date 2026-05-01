const pool = require('../config/db');

const round2 = (value) => Math.round((Number(value || 0) || 0) * 100) / 100;

exports.receiveCustomerOrderInstallment = async (req, res) => {
    try {
        const orderId = String(req.params.id || '').trim();
        const installmentNumber = parseInt(req.params.installmentNumber, 10);
        if (!orderId || !Number.isFinite(installmentNumber)) {
            return res.status(400).json({ message: 'Invalid order/installment' });
        }

        const paidAmount = req.body?.paid_amount != null ? round2(req.body.paid_amount) : null;
        if (paidAmount != null && paidAmount < 0) {
            return res.status(400).json({ message: 'paid_amount cannot be negative' });
        }

        const existing = await pool.query(
            `
            SELECT id, status, amount, paid_amount
            FROM customer_order_installments
            WHERE order_id = $1
              AND installment_number = $2
            LIMIT 1
            `,
            [orderId, installmentNumber]
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

