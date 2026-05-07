const pool = require('../config/db');

const addMonths = (dateString, index) => {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + index);
    return date.toISOString().slice(0, 10);
};

const recordEmployeeCommission = async (client, { userId, saleId, installmentId = null, commissionType, baseAmount, note = null }) => {
    const employeeResult = await client.query(
        `
        SELECT id, commission_percentage, commission_value
        FROM employees
        WHERE user_id = $1
        `,
        [userId]
    );

    if (employeeResult.rows.length === 0) {
        return;
    }

    const employee = employeeResult.rows[0];
    const numericBaseAmount = Number(baseAmount || 0);
    if (numericBaseAmount <= 0) {
        return;
    }

    if (installmentId) {
        const exists = await client.query(
            'SELECT id FROM employee_commissions WHERE installment_id = $1',
            [installmentId]
        );
        if (exists.rows.length > 0) return;
    }

    if (!installmentId && saleId) {
        const exists = await client.query(
            'SELECT id FROM employee_commissions WHERE sale_id = $1 AND commission_type = $2',
            [saleId, commissionType]
        );
        if (exists.rows.length > 0) return;
    }

    const commissionPercentage = Number(employee.commission_percentage || 0);
    const commissionValue = Number(employee.commission_value || 0);
    const commissionAmount = Number(((numericBaseAmount * commissionPercentage) / 100) + commissionValue);

    await client.query(
        `
        INSERT INTO employee_commissions (
            employee_id, sale_id, installment_id, commission_type, base_amount,
            commission_percentage, commission_value, commission_amount, earned_on, notes
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_DATE,$9)
        `,
        [
            employee.id,
            saleId || null,
            installmentId,
            commissionType,
            numericBaseAmount,
            commissionPercentage,
            commissionValue,
            commissionAmount,
            note,
        ]
    );
};

const getWorkflowStepRoles = (definition) => (
    [definition?.first_approver_role_name, definition?.second_approver_role_name].filter(Boolean)
);

const createWorkflowTask = async (client, {
    workflowDefinitionId,
    entityType,
    entityId,
    dealerId,
    createdBy,
    assignedRoleName,
    stepNumber,
    totalSteps,
    taskTitle,
}) => {
    const result = await client.query(
        `
        INSERT INTO workflow_tasks (
            workflow_definition_id, entity_type, entity_id, dealer_id, created_by,
            assigned_role_name, step_number, total_steps, task_title
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `,
        [
            workflowDefinitionId || null,
            entityType,
            entityId,
            dealerId || null,
            createdBy || null,
            assignedRoleName,
            stepNumber,
            totalSteps,
            taskTitle,
        ]
    );

    return result.rows[0];
};

const findApplicableSalesWorkflowDefinition = async (client, { roleName, dealerId }) => {
    if (!dealerId) {
        return null;
    }

    const result = await client.query(
        `
        SELECT *
        FROM workflow_definitions
        WHERE workflow_type = 'SALE_APPROVAL'
          AND requester_role_name = $1
          AND is_active = TRUE
          AND dealer_id = $2
        ORDER BY updated_at DESC, created_at DESC
        LIMIT 1
        `,
        [roleName, dealerId]
    );

    return result.rows[0] || null;
};

const ensureWorkflowDealerColumns = async (client) => {
    await client.query('ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dealer_id UUID');
    await client.query('ALTER TABLE sale_installments ADD COLUMN IF NOT EXISTS dealer_id UUID');
};

const queueSaleForWorkflow = async (client, { sale, vehicleId, creator, workflowDefinition }) => {
    const stepRoles = getWorkflowStepRoles(workflowDefinition);
    if (stepRoles.length === 0) {
        return null;
    }
    await ensureWorkflowDealerColumns(client);
    const saleDealerId = sale.dealer_id || creator.effective_dealer_id || creator.dealer_id || null;

    await client.query(
        `
        UPDATE sales_transactions
        SET
            workflow_definition_id = $2,
            approval_status = 'PENDING',
            current_workflow_step = 1,
            status = 'UNDER_REVIEW',
            last_workflow_action_at = NOW(),
            last_workflow_action_by = $3
        WHERE id = $1
        `,
        [sale.id, workflowDefinition.id, creator.id]
    );

    const reservedVehicle = await client.query(
        'UPDATE vehicles SET status = $1 WHERE id = $2 AND dealer_id = $3',
        ['RESERVED', vehicleId, saleDealerId]
    );
    if (reservedVehicle.rowCount === 0) {
        throw new Error('Workflow could not reserve vehicle because dealer ownership did not match.');
    }

    return createWorkflowTask(client, {
        workflowDefinitionId: workflowDefinition.id,
        entityType: 'SALE',
        entityId: sale.id,
        dealerId: saleDealerId,
        createdBy: creator.id,
        assignedRoleName: stepRoles[0],
        stepNumber: 1,
        totalSteps: stepRoles.length,
        taskTitle: `Review sale request for ${sale.customer_id}`,
    });
};

const finalizeApprovedSale = async (client, saleId, actingUserId = null) => {
    await ensureWorkflowDealerColumns(client);

    const saleResult = await client.query(
        `
        SELECT *
        FROM sales_transactions
        WHERE id = $1
        FOR UPDATE
        `,
        [saleId]
    );

    if (saleResult.rows.length === 0) {
        throw new Error('Sale not found for workflow approval.');
    }

    const sale = saleResult.rows[0];

    const vehicleResult = await client.query(
        `
        SELECT id, dealer_id
        FROM vehicles
        WHERE id = $1
          AND dealer_id = $2
        FOR UPDATE
        `,
        [sale.vehicle_id, sale.dealer_id]
    );

    if (vehicleResult.rows.length === 0) {
        throw new Error('Linked vehicle not found for workflow approval.');
    }

    const existingInstallmentsResult = await client.query(
        'SELECT COUNT(*)::int AS installment_count FROM sale_installments WHERE sale_id = $1',
        [saleId]
    );

    if (
        String(sale.sale_mode || '').toUpperCase() === 'INSTALLMENT'
        && Number(sale.installment_months || 0) > 0
        && sale.first_due_date
        && Number(existingInstallmentsResult.rows[0].installment_count || 0) === 0
    ) {
        for (let index = 0; index < Number(sale.installment_months); index += 1) {
            await client.query(
                `
                INSERT INTO sale_installments (
                    sale_id, dealer_id, installment_number, due_date, amount, status
                )
                VALUES ($1,$2,$3,$4,$5,$6)
                `,
                [
                    saleId,
                    sale.dealer_id,
                    index + 1,
                    addMonths(sale.first_due_date, index),
                    sale.monthly_installment || 0,
                    'PENDING',
                ]
            );
        }
    }

    if (String(sale.sale_mode || '').toUpperCase() === 'CASH') {
        await recordEmployeeCommission(client, {
            userId: sale.agent_id,
            saleId,
            commissionType: 'CASH_SALE',
            baseAmount: Number(sale.vehicle_price || 0),
            note: 'Cash sale commission',
        });
    } else if (Number(sale.down_payment || 0) > 0) {
        await recordEmployeeCommission(client, {
            userId: sale.agent_id,
            saleId,
            commissionType: 'INSTALLMENT_DOWN_PAYMENT',
            baseAmount: Number(sale.down_payment || 0),
            note: 'Installment down payment commission',
        });
    }

    await client.query(
        `
        UPDATE sales_transactions
        SET
            approval_status = 'APPROVED',
            current_workflow_step = 0,
            status = $2,
            last_workflow_action_at = NOW(),
            last_workflow_action_by = COALESCE($3, last_workflow_action_by)
        WHERE id = $1
        `,
        [saleId, String(sale.sale_mode || '').toUpperCase() === 'CASH' ? 'RECEIVED' : 'PENDING', actingUserId]
    );

    await client.query(
        'UPDATE vehicles SET status = $1 WHERE id = $2 AND dealer_id = $3',
        [String(sale.sale_mode || '').toUpperCase() === 'CASH' ? 'SOLD' : 'INSTALLMENT', sale.vehicle_id, sale.dealer_id]
    );

    return sale;
};

const approveWorkflowTask = async (client, taskId, actingUser, decisionNotes = '') => {
    const taskResult = await client.query(
        `
        SELECT wt.*, wd.first_approver_role_name, wd.second_approver_role_name
        FROM workflow_tasks wt
        LEFT JOIN workflow_definitions wd ON wd.id = wt.workflow_definition_id
        WHERE wt.id = $1
        FOR UPDATE OF wt
        `,
        [taskId]
    );

    if (taskResult.rows.length === 0) {
        throw new Error('Workflow task not found.');
    }

    const task = taskResult.rows[0];
    if (String(task.task_status || '').toUpperCase() !== 'PENDING') {
        throw new Error('This workflow task has already been completed.');
    }

    await client.query(
        `
        UPDATE workflow_tasks
        SET task_status = 'APPROVED', decision_notes = $2, acted_by = $3, acted_at = NOW(), updated_at = NOW()
        WHERE id = $1
        `,
        [taskId, decisionNotes || null, actingUser.id]
    );

    const stepRoles = getWorkflowStepRoles(task);
    const nextStep = Number(task.step_number || 1) + 1;
    const nextRole = stepRoles[nextStep - 1];

    if (!nextRole) {
        await finalizeApprovedSale(client, task.entity_id, actingUser.id);
        return { taskStatus: 'APPROVED_FINAL' };
    }

    await client.query(
        `
        UPDATE sales_transactions
        SET current_workflow_step = $2, last_workflow_action_at = NOW(), last_workflow_action_by = $3
        WHERE id = $1
        `,
        [task.entity_id, nextStep, actingUser.id]
    );

    await createWorkflowTask(client, {
        workflowDefinitionId: task.workflow_definition_id,
        entityType: task.entity_type,
        entityId: task.entity_id,
        dealerId: task.dealer_id,
        createdBy: task.created_by,
        assignedRoleName: nextRole,
        stepNumber: nextStep,
        totalSteps: stepRoles.length,
        taskTitle: task.task_title,
    });

    return { taskStatus: 'APPROVED_NEXT' };
};

const rejectWorkflowTask = async (client, taskId, actingUser, decisionNotes = '') => {
    await ensureWorkflowDealerColumns(client);

    const taskResult = await client.query(
        `
        SELECT wt.*, st.vehicle_id, st.dealer_id AS sale_dealer_id
        FROM workflow_tasks wt
        LEFT JOIN sales_transactions st ON st.id = wt.entity_id
        WHERE wt.id = $1
        FOR UPDATE OF wt
        `,
        [taskId]
    );

    if (taskResult.rows.length === 0) {
        throw new Error('Workflow task not found.');
    }

    const task = taskResult.rows[0];
    if (String(task.task_status || '').toUpperCase() !== 'PENDING') {
        throw new Error('This workflow task has already been completed.');
    }

    await client.query(
        `
        UPDATE workflow_tasks
        SET task_status = 'REJECTED', decision_notes = $2, acted_by = $3, acted_at = NOW(), updated_at = NOW()
        WHERE id = $1
        `,
        [taskId, decisionNotes || null, actingUser.id]
    );

    await client.query(
        `
        UPDATE workflow_tasks
        SET task_status = 'CANCELLED', updated_at = NOW()
        WHERE entity_type = $1
          AND entity_id = $2
          AND task_status = 'PENDING'
          AND id <> $3
        `,
        [task.entity_type, task.entity_id, taskId]
    );

    await client.query(
        `
        UPDATE sales_transactions
        SET
            approval_status = 'REJECTED',
            current_workflow_step = 0,
            status = 'REJECTED',
            rejection_reason = $2,
            last_workflow_action_at = NOW(),
            last_workflow_action_by = $3
        WHERE id = $1
        `,
        [task.entity_id, decisionNotes || null, actingUser.id]
    );

    if (task.vehicle_id) {
        await client.query(
            'UPDATE vehicles SET status = $1 WHERE id = $2 AND dealer_id = $3',
            ['AVAILABLE', task.vehicle_id, task.sale_dealer_id || task.dealer_id]
        );
    }

    return { taskStatus: 'REJECTED' };
};

module.exports = {
    findApplicableSalesWorkflowDefinition,
    queueSaleForWorkflow,
    finalizeApprovedSale,
    approveWorkflowTask,
    rejectWorkflowTask,
};
