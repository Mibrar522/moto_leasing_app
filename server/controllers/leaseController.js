// server/controllers/leaseController.js
const pool = require('../config/db'); 

const isSuperAdminSession = (user = {}) =>
    Number(user?.real_role_id || user?.role_id) === 1 ||
    (user?.real_role_name || user?.role_name) === 'SUPER_ADMIN';
const getEffectiveDealerId = (user = {}) => user.effective_dealer_id || user.dealer_id || null;
const hasGlobalScope = (user = {}) => isSuperAdminSession(user) && !getEffectiveDealerId(user);

exports.submitLease = async (req, res) => {
    const client = await pool.connect();
    try {
        const { customer_id, vehicle_id, duration_months, monthly_installment, total_amount } = req.body;
        const agent_id = req.user.id; 
        const globalScope = hasGlobalScope(req.user);
        const dealerId = getEffectiveDealerId(req.user);

        await client.query('BEGIN'); // Enterprise Transaction
        await client.query('ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dealer_id UUID');
        await client.query('ALTER TABLE lease_applications ADD COLUMN IF NOT EXISTS dealer_id UUID');

        // 1. Check vehicle availability in the 'vehicles' table
        const vCheck = await client.query(
            `
            SELECT v.status, COALESCE(v.dealer_id, so.dealer_id, ou.dealer_id, pc.dealer_id) AS dealer_id
            FROM vehicles v
            LEFT JOIN stock_orders so ON so.id = v.source_stock_order_id
            LEFT JOIN users ou ON ou.id = so.ordered_by
            LEFT JOIN product_catalog pc ON pc.id = so.product_id
            WHERE v.id = $1
            FOR UPDATE OF v
            `,
            [vehicle_id]
        );
        if (!vCheck.rows[0] || vCheck.rows[0].status !== 'AVAILABLE') {
            throw new Error('Vehicle is no longer available');
        }

        if (!globalScope && String(vCheck.rows[0].dealer_id || '') !== String(dealerId || '')) {
            throw new Error('Vehicle is not available for your dealer');
        }

        const cCheck = await client.query(
            'SELECT dealer_id FROM customers WHERE id = $1',
            [customer_id]
        );
        if (!cCheck.rows[0]) {
            throw new Error('Customer not found');
        }
        if (!globalScope && String(cCheck.rows[0].dealer_id || '') !== String(dealerId || '')) {
            throw new Error('Customer is not available for your dealer');
        }
        const resolvedDealerId = cCheck.rows[0].dealer_id || vCheck.rows[0].dealer_id || dealerId || null;
        if (!resolvedDealerId) {
            throw new Error('Dealer assignment is required for lease applications');
        }

        // 2. Insert into 'lease_applications' table
        const newLease = await client.query(
            `INSERT INTO lease_applications (customer_id, vehicle_id, agent_id, dealer_id, duration_months, monthly_installment, total_amount)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [customer_id, vehicle_id, agent_id, resolvedDealerId, duration_months, monthly_installment, total_amount]
        );

        // 3. Update 'vehicles' status
        await client.query(
            'UPDATE vehicles SET status = $1 WHERE id = $2 AND dealer_id = $3',
            ['LEASED', vehicle_id, resolvedDealerId]
        );

        await client.query('COMMIT'); 
        res.status(201).json(newLease.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK'); 
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
};
