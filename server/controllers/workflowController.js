const pool = require('../config/db');
const {
    approveWorkflowTask,
    rejectWorkflowTask,
} = require('../services/workflowService');

exports.saveWorkflowDefinition = async (req, res) => {
    try {
        const {
            id,
            definition_name,
            workflow_type = 'SALE_APPROVAL',
            dealer_id = null,
            requester_role_name,
            first_approver_role_name,
            second_approver_role_name,
            is_active = true,
        } = req.body;

        if (!String(definition_name || '').trim()) {
            return res.status(400).json({ message: 'Workflow name is required.' });
        }

        if (!String(requester_role_name || '').trim() || !String(first_approver_role_name || '').trim()) {
            return res.status(400).json({ message: 'Requester role and first approver role are required.' });
        }

        const normalizedPayload = [
            String(definition_name || '').trim(),
            String(workflow_type || 'SALE_APPROVAL').trim().toUpperCase(),
            dealer_id || null,
            String(requester_role_name || '').trim().toUpperCase(),
            String(first_approver_role_name || '').trim().toUpperCase(),
            String(second_approver_role_name || '').trim().toUpperCase() || null,
            Boolean(is_active),
        ];

        let result;
        if (id) {
            result = await pool.query(
                `
                UPDATE workflow_definitions
                SET
                    definition_name = $1,
                    workflow_type = $2,
                    dealer_id = $3,
                    requester_role_name = $4,
                    first_approver_role_name = $5,
                    second_approver_role_name = $6,
                    is_active = $7,
                    updated_by = $8,
                    updated_at = NOW()
                WHERE id = $9
                RETURNING *
                `,
                [...normalizedPayload, req.user.id, id]
            );
        } else {
            result = await pool.query(
                `
                INSERT INTO workflow_definitions (
                    definition_name, workflow_type, dealer_id, requester_role_name,
                    first_approver_role_name, second_approver_role_name, is_active,
                    created_by, updated_by
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8)
                RETURNING *
                `,
                [...normalizedPayload, req.user.id]
            );
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Workflow definition not found.' });
        }

        res.status(id ? 200 : 201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to save workflow definition', error: error.message });
    }
};

exports.approveTask = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const result = await approveWorkflowTask(client, req.params.id, req.user, req.body?.decision_notes || '');
        await client.query('COMMIT');
        res.status(200).json({ message: 'Workflow task approved successfully.', ...result });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: error.message || 'Failed to approve workflow task.' });
    } finally {
        client.release();
    }
};

exports.rejectTask = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const result = await rejectWorkflowTask(client, req.params.id, req.user, req.body?.decision_notes || '');
        await client.query('COMMIT');
        res.status(200).json({ message: 'Workflow task rejected successfully.', ...result });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: error.message || 'Failed to reject workflow task.' });
    } finally {
        client.release();
    }
};
