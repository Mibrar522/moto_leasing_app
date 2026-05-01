// server/controllers/leaseController.js
const pool = require('../config/db'); 

exports.submitLease = async (req, res) => {
    const client = await pool.connect();
    try {
        const { customer_id, vehicle_id, duration_months, monthly_installment, total_amount } = req.body;
        const agent_id = req.user.id; 

        await client.query('BEGIN'); // Enterprise Transaction

        // 1. Check vehicle availability in the 'vehicles' table
        const vCheck = await client.query('SELECT status FROM vehicles WHERE id = $1 FOR UPDATE', [vehicle_id]);
        if (!vCheck.rows[0] || vCheck.rows[0].status !== 'AVAILABLE') {
            throw new Error('Vehicle is no longer available');
        }

        // 2. Insert into 'lease_applications' table
        const newLease = await client.query(
            `INSERT INTO lease_applications (customer_id, vehicle_id, agent_id, duration_months, monthly_installment, total_amount)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [customer_id, vehicle_id, agent_id, duration_months, monthly_installment, total_amount]
        );

        // 3. Update 'vehicles' status
        await client.query('UPDATE vehicles SET status = $1 WHERE id = $2', ['LEASED', vehicle_id]);

        await client.query('COMMIT'); 
        res.status(201).json(newLease.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK'); 
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
};