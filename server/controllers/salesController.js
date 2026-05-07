const path = require('path');
const pool = require('../config/db');
const { resolveDurableUploadUrl } = require('../utils/storage');
const {
    findApplicableSalesWorkflowDefinition,
    queueSaleForWorkflow,
} = require('../services/workflowService');

const isSuperAdminSession = (user = {}) =>
    Number(user?.real_role_id || user?.role_id) === 1 ||
    (user?.real_role_name || user?.role_name) === 'SUPER_ADMIN';

const getSalesScopeContext = (user = {}) => {
    const isEmployeeLogin = Number(user?.role_id) === 3 || user?.role_name === 'AGENT';
    const isSuperAdmin = isSuperAdminSession(user);
    const effectiveDealerId = user?.effective_dealer_id || user?.dealer_id || null;
    const hasGlobalScope = isSuperAdmin && !user?.effective_dealer_id;
    const isDealerScopedView = Boolean(effectiveDealerId) && !hasGlobalScope;

    return {
        isEmployeeLogin,
        isSuperAdmin,
        effectiveDealerId,
        hasGlobalScope,
        isDealerScopedView,
    };
};

const getSaleDealerExpression = () => 'COALESCE(st.dealer_id, c.dealer_id, u.dealer_id)';
const getVehicleDealerExpression = () => 'COALESCE(v.dealer_id, so.dealer_id, ou.dealer_id, pc.dealer_id, cp.dealer_id)';
const ensureSalesDealerColumns = async (client) => {
    await client.query('ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS dealer_id UUID');
    await client.query('ALTER TABLE sales_transactions ADD COLUMN IF NOT EXISTS dealer_id UUID');
    await client.query('ALTER TABLE sale_installments ADD COLUMN IF NOT EXISTS dealer_id UUID');
};

const buildScopedSalesWhereClause = ({ isEmployeeLogin, isDealerScopedView }) => {
    if (isEmployeeLogin) {
        return 'WHERE st.agent_id = $1';
    }

    if (isDealerScopedView) {
        return `WHERE ${getSaleDealerExpression()} = $1`;
    }

    return '';
};

const getScopedSalesParams = ({ isEmployeeLogin, isDealerScopedView, effectiveDealerId, userId }) => {
    if (isEmployeeLogin) {
        return [userId];
    }

    if (isDealerScopedView) {
        return [effectiveDealerId];
    }

    return [];
};
const resolveSaleDealerId = (scope, reqUser, customerDealerId = null, vehicleDealerId = null) =>
    scope.effectiveDealerId
    || reqUser?.dealer_id
    || vehicleDealerId
    || customerDealerId
    || null;

const formatCurrencyAmount = (value) => `Rs ${Number(value || 0).toFixed(2)}`;

const isScopedDealerMatch = (scope, dealerId) => {
    if (!scope.isDealerScopedView) {
        return true;
    }

    return String(dealerId || '') === String(scope.effectiveDealerId || '');
};

const getCustomerDealerId = async (client, customerId) => {
    const result = await client.query(
        `
        SELECT
            c.id,
            COALESCE(c.dealer_id, creator.dealer_id) AS dealer_id
        FROM customers c
        LEFT JOIN users creator ON creator.id = c.created_by_agent
        WHERE c.id = $1
        `,
        [customerId]
    );

    return result.rows[0] || null;
};

const addMonths = (dateString, index) => {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + index);
    return date.toISOString().slice(0, 10);
};

const normalizeDateInput = (value) => {
    const raw = String(value ?? '').trim();
    return raw ? raw : null;
};

const normalizeTextInput = (value) => {
    const raw = String(value ?? '').trim();
    return raw ? raw : null;
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

exports.uploadAgreement = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Agreement PDF is required' });
    }

    const fallbackUrl = `/uploads/agreements/${req.file.filename}`;
    const url = await resolveDurableUploadUrl(req.file, 'agreements', fallbackUrl);

    res.status(201).json({
        fileName: req.file.filename,
        originalName: req.file.originalname,
        url,
    });
};

exports.uploadSaleDocument = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Sale document file is required' });
    }

    const fallbackUrl = `/uploads/sale-documents/${req.file.filename}`;
    const url = await resolveDurableUploadUrl(req.file, 'sale-documents', fallbackUrl);

    res.status(201).json({
        fileName: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        url,
    });
};

exports.listSales = async (req, res) => {
    try {
        const scope = getSalesScopeContext(req.user);
        const result = await pool.query(
            `
            SELECT
                st.*,
                st.customer_id,
                st.vehicle_id,
                c.full_name AS customer_name,
                c.cnic_passport_number,
                v.brand,
                v.model,
                v.image_url,
                v.vehicle_type,
                v.serial_number,
                v.registration_number,
                v.chassis_number,
                v.engine_number,
                v.purchase_price,
                u.full_name AS agent_name,
                d.id AS dealer_id,
                d.dealer_name,
                d.dealer_code,
                d.dealer_signature_url AS dealer_profile_signature_url,
                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'id', si.id,
                            'installment_number', si.installment_number,
                            'due_date', si.due_date,
                            'amount', si.amount,
                            'received_amount', si.received_amount,
                            'carry_forward_amount', si.carry_forward_amount,
                            'status', si.status,
                            'paid_date', si.paid_date
                        )
                    ) FILTER (WHERE si.id IS NOT NULL),
                    '[]'::json
                ) AS installments
            FROM sales_transactions st
            JOIN customers c ON c.id = st.customer_id
            JOIN vehicles v ON v.id = st.vehicle_id
            JOIN users u ON u.id = st.agent_id
            LEFT JOIN dealers d ON d.id = ${getSaleDealerExpression()}
            LEFT JOIN sale_installments si ON si.sale_id = st.id
            ${buildScopedSalesWhereClause(scope)}
            GROUP BY st.id, c.full_name, c.cnic_passport_number, v.brand, v.model, v.image_url, v.vehicle_type, v.serial_number, v.registration_number, v.chassis_number, v.engine_number, v.purchase_price, u.full_name, d.id, d.dealer_name, d.dealer_code, d.dealer_signature_url
            ORDER BY st.created_at DESC
            `,
            getScopedSalesParams({
                ...scope,
                userId: req.user.id,
            })
        );

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load sales transactions', error: error.message });
    }
};

exports.createSale = async (req, res) => {
    const client = await pool.connect();

    try {
        const scope = getSalesScopeContext(req.user);
        const {
            customer_id,
            vehicle_id,
            sale_mode,
            agreement_number,
            agreement_date,
            agreement_pdf_url,
            dealer_signature_url,
            authorized_signature_url,
            customer_cnic_front_url,
            customer_cnic_back_url,
            bank_check_url,
            misc_document_url,
            purchase_date,
            vehicle_price,
            down_payment,
            financed_amount,
            monthly_installment,
            installment_months,
            first_due_date,
            witness_name,
            witness_cnic,
            witness_two_name,
            witness_two_cnic,
            remarks,
        } = req.body;

        const normalizedSaleMode = String(sale_mode || '').trim().toUpperCase();
        const normalizedAgreementDate = normalizeDateInput(agreement_date);
        const normalizedPurchaseDate = normalizeDateInput(purchase_date);
        const normalizedFirstDueDate = normalizeDateInput(first_due_date);

        if (!customer_id || !vehicle_id) {
            return res.status(400).json({ message: 'Customer and vehicle are required.' });
        }

        if (!['CASH', 'INSTALLMENT'].includes(normalizedSaleMode)) {
            return res.status(400).json({ message: 'sale_mode must be CASH or INSTALLMENT.' });
        }

        if (!normalizedAgreementDate || !normalizedPurchaseDate) {
            return res.status(400).json({ message: 'Agreement date and purchase date are required.' });
        }

        if (normalizedSaleMode === 'INSTALLMENT') {
            const months = Number(installment_months || 0);
            const monthly = Number(monthly_installment || 0);
            if (!months || months <= 0 || !normalizedFirstDueDate || !monthly || monthly <= 0) {
                return res.status(400).json({ message: 'Installment months, first due date, and monthly installment are required for installment sales.' });
            }
        }

        await client.query('BEGIN');
        await ensureSalesDealerColumns(client);

        const customerRecord = await getCustomerDealerId(client, customer_id);
        if (!customerRecord) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Customer not found' });
        }

        if (!isScopedDealerMatch(scope, customerRecord.dealer_id)) {
            await client.query('ROLLBACK');
            return res.status(403).json({ message: 'You can only create sales for customers in your dealer records.' });
        }

        const vehicleResult = await client.query(
            `
            SELECT
                v.id,
                v.status,
                d.id AS dealer_id
            FROM vehicles v
            LEFT JOIN stock_orders so ON so.id = v.source_stock_order_id
            LEFT JOIN product_catalog pc ON pc.id = so.product_id
            LEFT JOIN company_profiles cp ON cp.id = so.company_profile_id
            LEFT JOIN users ou ON ou.id = so.ordered_by
            LEFT JOIN dealers d ON d.id = ${getVehicleDealerExpression()}
            WHERE v.id = $1
            FOR UPDATE OF v
            `,
            [vehicle_id]
        );

        if (vehicleResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        const vehicleStatus = String(vehicleResult.rows[0].status || '').toUpperCase();
        if (vehicleStatus !== 'AVAILABLE') {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Only available vehicles can be sold.' });
        }

        if (!isScopedDealerMatch(scope, vehicleResult.rows[0].dealer_id)) {
            await client.query('ROLLBACK');
            return res.status(403).json({ message: 'You can only create sales for vehicles in your dealer inventory.' });
        }

        const workflowDefinition = await findApplicableSalesWorkflowDefinition(client, {
            roleName: String(req.user.role_name || '').toUpperCase(),
            dealerId: scope.effectiveDealerId || null,
        });
        const requiresWorkflow = Boolean(workflowDefinition);
        const resolvedSaleDealerId = resolveSaleDealerId(
            scope,
            req.user,
            customerRecord.dealer_id,
            vehicleResult.rows[0].dealer_id
        );

        const saleResult = await client.query(
            `
            INSERT INTO sales_transactions (
                customer_id, vehicle_id, agent_id, dealer_id, sale_mode, agreement_number,
                agreement_date, agreement_pdf_url, dealer_signature_url, authorized_signature_url, customer_cnic_front_url, customer_cnic_back_url,
                bank_check_url, misc_document_url, purchase_date, vehicle_price,
                down_payment, financed_amount, monthly_installment, installment_months,
                first_due_date, witness_name, witness_cnic, witness_two_name, witness_two_cnic, remarks, status
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27)
            RETURNING *
            `,
            [
                customer_id,
                vehicle_id,
                req.user.id,
                resolvedSaleDealerId,
                normalizedSaleMode,
                normalizeTextInput(agreement_number),
                normalizedAgreementDate,
                normalizeTextInput(agreement_pdf_url),
                normalizeTextInput(dealer_signature_url),
                normalizeTextInput(authorized_signature_url),
                customer_cnic_front_url || null,
                customer_cnic_back_url || null,
                normalizeTextInput(bank_check_url),
                normalizeTextInput(misc_document_url),
                normalizedPurchaseDate,
                vehicle_price || 0,
                down_payment || 0,
                financed_amount || 0,
                monthly_installment || 0,
                installment_months || 0,
                normalizedFirstDueDate,
                normalizeTextInput(witness_name),
                normalizeTextInput(witness_cnic),
                normalizeTextInput(witness_two_name),
                normalizeTextInput(witness_two_cnic),
                normalizeTextInput(remarks),
                requiresWorkflow ? 'UNDER_REVIEW' : normalizedSaleMode === 'CASH' ? 'RECEIVED' : 'PENDING',
            ]
        );

        if (!requiresWorkflow && normalizedSaleMode === 'INSTALLMENT' && Number(installment_months) > 0 && normalizedFirstDueDate) {
            for (let index = 0; index < Number(installment_months); index += 1) {
                await client.query(
                    `
                    INSERT INTO sale_installments (
                        sale_id, dealer_id, installment_number, due_date, amount, status
                    )
                    VALUES ($1,$2,$3,$4,$5,$6)
                    `,
                    [
                        saleResult.rows[0].id,
                        resolvedSaleDealerId,
                        index + 1,
                        addMonths(normalizedFirstDueDate, index),
                        monthly_installment || 0,
                        'PENDING',
                    ]
                );
            }
        }

        if (!requiresWorkflow && normalizedSaleMode === 'CASH') {
            await recordEmployeeCommission(client, {
                userId: req.user.id,
                saleId: saleResult.rows[0].id,
                commissionType: 'CASH_SALE',
                baseAmount: Number(vehicle_price || 0),
                note: 'Cash sale commission',
            });
        } else if (!requiresWorkflow && Number(down_payment || 0) > 0) {
            await recordEmployeeCommission(client, {
                userId: req.user.id,
                saleId: saleResult.rows[0].id,
                commissionType: 'INSTALLMENT_DOWN_PAYMENT',
                baseAmount: Number(down_payment || 0),
                note: 'Installment down payment commission',
            });
        }

        if (requiresWorkflow) {
            await queueSaleForWorkflow(client, {
                sale: saleResult.rows[0],
                vehicleId: vehicle_id,
                creator: req.user,
                workflowDefinition,
            });
        } else {
            await client.query(
                `
                UPDATE sales_transactions
                SET approval_status = 'APPROVED'
                WHERE id = $1
                `,
                [saleResult.rows[0].id]
            );

            await client.query(
                'UPDATE vehicles SET status = $1 WHERE id = $2 AND dealer_id = $3',
                [normalizedSaleMode === 'CASH' ? 'SOLD' : 'INSTALLMENT', vehicle_id, resolvedSaleDealerId]
            );
        }

        await client.query('COMMIT');
        res.status(201).json(saleResult.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        if (error?.code === '23503') {
            return res.status(400).json({ message: 'Invalid customer/vehicle reference for sale.', error: error.detail || error.message });
        }
        if (error?.code === '22P02' || error?.code === '22007') {
            return res.status(400).json({ message: 'Invalid sale input format (date/id/number). Please re-check the form.', error: error.message });
        }
        res.status(500).json({ message: 'Failed to create sale transaction', error: error.message, code: error.code });
    } finally {
        client.release();
    }
};

exports.updateSale = async (req, res) => {
    const client = await pool.connect();

    try {
        const scope = getSalesScopeContext(req.user);
        const {
            customer_id,
            vehicle_id,
            sale_mode,
            agreement_number,
            agreement_date,
            agreement_pdf_url,
            dealer_signature_url,
            authorized_signature_url,
            customer_cnic_front_url,
            customer_cnic_back_url,
            bank_check_url,
            misc_document_url,
            purchase_date,
            vehicle_price,
            down_payment,
            financed_amount,
            monthly_installment,
            installment_months,
            first_due_date,
            witness_name,
            witness_cnic,
            witness_two_name,
            witness_two_cnic,
            remarks,
        } = req.body;

        await client.query('BEGIN');
        await ensureSalesDealerColumns(client);

        const currentSaleResult = await client.query(
            `
            SELECT
                st.*,
                ${getSaleDealerExpression()} AS dealer_id
            FROM sales_transactions st
            JOIN customers c ON c.id = st.customer_id
            JOIN users u ON u.id = st.agent_id
            WHERE st.id = $1
            FOR UPDATE OF st
            `,
            [req.params.id]
        );

        if (currentSaleResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Sale not found' });
        }

        const currentSale = currentSaleResult.rows[0];
        if (!isScopedDealerMatch(scope, currentSale.dealer_id)) {
            await client.query('ROLLBACK');
            return res.status(403).json({ message: 'You can only update transactions for your dealer.' });
        }

        const customerRecord = await getCustomerDealerId(client, customer_id);
        if (!customerRecord) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Customer not found' });
        }

        if (!isScopedDealerMatch(scope, customerRecord.dealer_id)) {
            await client.query('ROLLBACK');
            return res.status(403).json({ message: 'You can only assign customers from your dealer records.' });
        }

        const pendingWorkflowApproval = String(currentSale.approval_status || '').toUpperCase() !== 'APPROVED';

        const receivedInstallmentResult = await client.query(
            `
            SELECT COUNT(*)::int AS received_count
            FROM sale_installments
            WHERE sale_id = $1 AND UPPER(status) = 'RECEIVED'
            `,
            [currentSale.id]
        );

        if (Number(receivedInstallmentResult.rows[0].received_count) > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'This sale already has received installments and can no longer be edited.' });
        }

        const targetVehicleResult = await client.query(
            `
            SELECT
                v.id,
                v.status,
                d.id AS dealer_id
            FROM vehicles v
            LEFT JOIN stock_orders so ON so.id = v.source_stock_order_id
            LEFT JOIN product_catalog pc ON pc.id = so.product_id
            LEFT JOIN company_profiles cp ON cp.id = so.company_profile_id
            LEFT JOIN users ou ON ou.id = so.ordered_by
            LEFT JOIN dealers d ON d.id = ${getVehicleDealerExpression()}
            WHERE v.id = $1
            FOR UPDATE OF v
            `,
            [vehicle_id]
        );

        if (targetVehicleResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        const targetVehicleStatus = String(targetVehicleResult.rows[0].status || '').toUpperCase();
        if (vehicle_id !== currentSale.vehicle_id && targetVehicleStatus !== 'AVAILABLE') {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Only available vehicles can be selected for a sale.' });
        }

        if (!isScopedDealerMatch(scope, targetVehicleResult.rows[0].dealer_id)) {
            await client.query('ROLLBACK');
            return res.status(403).json({ message: 'You can only assign vehicles from your dealer inventory.' });
        }
        const resolvedSaleDealerId = resolveSaleDealerId(
            scope,
            req.user,
            customerRecord.dealer_id,
            targetVehicleResult.rows[0].dealer_id
        );

        await client.query(
            `
            UPDATE sales_transactions
            SET
                customer_id = $2,
                vehicle_id = $3,
                sale_mode = $4,
                agreement_number = $5,
                agreement_date = $6,
                agreement_pdf_url = $7,
                dealer_signature_url = $8,
                authorized_signature_url = $9,
                dealer_id = $10,
                customer_cnic_front_url = $11,
                customer_cnic_back_url = $12,
                bank_check_url = $13,
                misc_document_url = $14,
                purchase_date = $15,
                vehicle_price = $16,
                down_payment = $17,
                financed_amount = $18,
                monthly_installment = $19,
                installment_months = $20,
                first_due_date = $21,
                witness_name = $22,
                witness_cnic = $23,
                witness_two_name = $24,
                witness_two_cnic = $25,
                remarks = $26,
                status = $27
            WHERE id = $1
            `,
            [
                req.params.id,
                customer_id,
                vehicle_id,
                sale_mode,
                agreement_number || null,
                agreement_date,
                agreement_pdf_url || null,
                dealer_signature_url || null,
                authorized_signature_url || null,
                resolvedSaleDealerId,
                customer_cnic_front_url || null,
                customer_cnic_back_url || null,
                bank_check_url || null,
                misc_document_url || null,
                purchase_date,
                vehicle_price || 0,
                down_payment || 0,
                financed_amount || 0,
                monthly_installment || 0,
                installment_months || 0,
                first_due_date || null,
                witness_name || null,
                witness_cnic || null,
                witness_two_name || null,
                witness_two_cnic || null,
                remarks || null,
                pendingWorkflowApproval ? 'UNDER_REVIEW' : sale_mode === 'CASH' ? 'RECEIVED' : 'PENDING',
            ]
        );

        await client.query('DELETE FROM sale_installments WHERE sale_id = $1', [req.params.id]);

        if (!pendingWorkflowApproval && sale_mode === 'INSTALLMENT' && Number(installment_months) > 0 && first_due_date) {
            for (let index = 0; index < Number(installment_months); index += 1) {
                await client.query(
                    `
                    INSERT INTO sale_installments (
                        sale_id, dealer_id, installment_number, due_date, amount, status
                    )
                    VALUES ($1,$2,$3,$4,$5,$6)
                    `,
                    [
                        req.params.id,
                        resolvedSaleDealerId,
                        index + 1,
                        addMonths(first_due_date, index),
                        monthly_installment || 0,
                        'PENDING',
                    ]
                );
            }
        }

        if (vehicle_id !== currentSale.vehicle_id) {
            await client.query(
                'UPDATE vehicles SET status = $1 WHERE id = $2 AND dealer_id = $3',
                ['AVAILABLE', currentSale.vehicle_id, currentSale.dealer_id]
            );
        }

        await client.query(
            'UPDATE vehicles SET status = $1 WHERE id = $2 AND dealer_id = $3',
            [pendingWorkflowApproval ? 'RESERVED' : sale_mode === 'CASH' ? 'SOLD' : 'INSTALLMENT', vehicle_id, resolvedSaleDealerId]
        );

        const updatedSaleResult = await client.query(
            `
            SELECT *
            FROM sales_transactions
            WHERE id = $1
            `,
            [req.params.id]
        );

        await client.query('COMMIT');
        res.status(200).json(updatedSaleResult.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Failed to update sale transaction', error: error.message });
    } finally {
        client.release();
    }
};

exports.receiveInstallment = async (req, res) => {
    const client = await pool.connect();

    try {
        const scope = getSalesScopeContext(req.user);
        const manualAmount = Number(req.body?.received_amount || 0);
        await client.query('BEGIN');

        const currentInstallmentResult = await client.query(
            `
            SELECT
                si.*,
                st.agent_id,
                ${getSaleDealerExpression()} AS dealer_id
            FROM sale_installments si
            JOIN sales_transactions st ON st.id = si.sale_id
            JOIN customers c ON c.id = st.customer_id
            JOIN users u ON u.id = st.agent_id
            WHERE si.id = $1
            `,
            [req.params.id]
        );

        if (currentInstallmentResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Installment not found' });
        }

        const currentInstallment = currentInstallmentResult.rows[0];
        if (!isScopedDealerMatch(scope, currentInstallment.dealer_id)) {
            await client.query('ROLLBACK');
            return res.status(403).json({ message: 'You can only receive installments for your dealer transactions.' });
        }

        const saleId = currentInstallment.sale_id;
        const expectedAmount = Number(currentInstallment.amount || 0);
        const remainingBalanceBeforeReceiptResult = await client.query(
            `
            SELECT
                st.financed_amount,
                st.vehicle_price,
                st.down_payment,
                COALESCE(SUM(si.received_amount), 0) AS total_received_amount
            FROM sales_transactions st
            LEFT JOIN sale_installments si ON si.sale_id = st.id
            WHERE st.id = $1
            GROUP BY st.id
            `,
            [saleId]
        );
        const remainingBalanceRow = remainingBalanceBeforeReceiptResult.rows[0] || {};
        const beforeReceiptInstallmentBalance = Number(remainingBalanceRow.financed_amount || 0) > 0
            ? Number(remainingBalanceRow.financed_amount || 0)
            : Math.max(Number(remainingBalanceRow.vehicle_price || 0) - Number(remainingBalanceRow.down_payment || 0), 0);
        const totalRemainingAmount = Math.max(beforeReceiptInstallmentBalance - Number(remainingBalanceRow.total_received_amount || 0), 0);

        if (manualAmount < 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Received amount cannot be negative.' });
        }

        const receivedAmount = manualAmount > 0 ? manualAmount : expectedAmount;
        if (receivedAmount <= 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Received amount must be greater than zero.' });
        }

        const futureInstallmentsResult = await client.query(
            `
            SELECT *
            FROM sale_installments
            WHERE sale_id = $1
              AND installment_number > $2
              AND UPPER(COALESCE(status, '')) <> 'RECEIVED'
            ORDER BY installment_number ASC
            FOR UPDATE
            `,
            [saleId, Number(currentInstallment.installment_number)]
        );

        const futureInstallments = futureInstallmentsResult.rows;
        const carryForwardAmount = Math.max(expectedAmount - receivedAmount, 0);
        const extraAdvanceAmount = Math.max(receivedAmount - expectedAmount, 0);

        if (carryForwardAmount > 0 && futureInstallments.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: `Final pending installment must be paid in full. Remaining amount is ${formatCurrencyAmount(totalRemainingAmount)}.` });
        }

        const futureOutstandingAmount = futureInstallments.reduce((sum, row) => sum + Number(row.amount || 0), 0);
        if (extraAdvanceAmount > futureOutstandingAmount) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Received amount cannot exceed the total remaining installment balance.' });
        }

        const installmentResult = await client.query(
            `
            UPDATE sale_installments
            SET
                received_amount = $2,
                carry_forward_amount = $3,
                status = $4,
                paid_date = CURRENT_DATE
            WHERE id = $1
            RETURNING *
            `,
            [
                req.params.id,
                receivedAmount,
                carryForwardAmount > 0 ? carryForwardAmount : extraAdvanceAmount > 0 ? -extraAdvanceAmount : 0,
                carryForwardAmount > 0 ? 'PARTIAL' : 'RECEIVED',
            ]
        );

        if (carryForwardAmount > 0) {
            await client.query(
                `
                UPDATE sale_installments
                SET amount = amount + $2
                WHERE id = $1
                `,
                [futureInstallments[0].id, carryForwardAmount]
            );
        } else if (extraAdvanceAmount > 0) {
            let remainingAdvance = extraAdvanceAmount;

            for (const futureInstallment of futureInstallments) {
                if (remainingAdvance <= 0) {
                    break;
                }

                const installmentAmount = Number(futureInstallment.amount || 0);
                if (installmentAmount <= 0) {
                    continue;
                }

                if (remainingAdvance >= installmentAmount) {
                    await client.query(
                        `
                        UPDATE sale_installments
                        SET
                            amount = 0,
                            received_amount = 0,
                            carry_forward_amount = 0,
                            status = 'RECEIVED',
                            paid_date = CURRENT_DATE
                        WHERE id = $1
                        `,
                        [futureInstallment.id]
                    );
                    remainingAdvance -= installmentAmount;
                } else {
                    await client.query(
                        `
                        UPDATE sale_installments
                        SET
                            amount = amount - $2,
                            carry_forward_amount = 0,
                            status = 'PENDING',
                            paid_date = NULL
                        WHERE id = $1
                        `,
                        [futureInstallment.id, remainingAdvance]
                    );
                    remainingAdvance = 0;
                }
            }
        }

        const saleBalanceResult = await client.query(
            `
            SELECT financed_amount, vehicle_price, down_payment, monthly_installment
            FROM sales_transactions
            WHERE id = $1
            FOR UPDATE
            `,
            [saleId]
        );

        const saleBalanceRow = saleBalanceResult.rows[0] || {};
        const expectedInstallmentBalance = Number(saleBalanceRow.financed_amount || 0) > 0
            ? Number(saleBalanceRow.financed_amount || 0)
            : Math.max(Number(saleBalanceRow.vehicle_price || 0) - Number(saleBalanceRow.down_payment || 0), 0);
        const standardMonthlyAmount = Math.max(Number(saleBalanceRow.monthly_installment || 0), 0);

        const normalizeRowsResult = await client.query(
            `
            SELECT *
            FROM sale_installments
            WHERE sale_id = $1
            ORDER BY installment_number ASC
            FOR UPDATE
            `,
            [saleId]
        );

        const normalizeRows = normalizeRowsResult.rows;
        const totalReceivedAmount = normalizeRows.reduce((sum, row) => sum + Number(row.received_amount || 0), 0);
        let remainingInstallmentBalance = Math.max(expectedInstallmentBalance - totalReceivedAmount, 0);
        let adjustedNextPending = false;

        for (const row of normalizeRows) {
            const hasReceivedCash = Number(row.received_amount || 0) > 0;
            const normalizedStatus = String(row.status || '').toUpperCase();

            if (hasReceivedCash || normalizedStatus === 'RECEIVED' || normalizedStatus === 'PARTIAL') {
                continue;
            }

            const currentAmount = Math.max(Number(row.amount || 0), 0);
            const baseAmount = adjustedNextPending
                ? (standardMonthlyAmount > 0 ? standardMonthlyAmount : currentAmount)
                : currentAmount;
            const nextAmount = Math.max(Math.min(baseAmount, remainingInstallmentBalance), 0);

            if (nextAmount > 0) {
                await client.query(
                    `
                    UPDATE sale_installments
                    SET
                        amount = $2,
                        carry_forward_amount = 0,
                        status = 'PENDING',
                        paid_date = NULL
                    WHERE id = $1
                    `,
                    [row.id, nextAmount]
                );
                remainingInstallmentBalance -= nextAmount;
                adjustedNextPending = true;
            } else {
                await client.query(
                    `
                    DELETE FROM sale_installments
                    WHERE id = $1
                    `,
                    [row.id]
                );
            }
        }

        const pendingResult = await client.query(
            `
            SELECT COUNT(*)::int AS pending_count
            FROM sale_installments
            WHERE sale_id = $1
              AND amount > 0
              AND COALESCE(received_amount, 0) <= 0
              AND UPPER(status) <> 'RECEIVED'
            `,
            [saleId]
        );

        await client.query(
            `
            UPDATE sales_transactions
            SET status = $2
            WHERE id = $1
            `,
            [saleId, Number(pendingResult.rows[0].pending_count) === 0 ? 'RECEIVED' : 'PENDING']
        );

        const canApplyInstallmentReceiptCommission = (req.user?.feature_keys || []).includes('FEAT_INSTALLMENT_COMMISSION');

        if (canApplyInstallmentReceiptCommission && currentInstallment.agent_id) {
            await recordEmployeeCommission(client, {
                userId: currentInstallment.agent_id,
                saleId,
                installmentId: req.params.id,
                commissionType: 'INSTALLMENT_RECEIPT',
                baseAmount: receivedAmount,
                note: `Installment ${currentInstallment.installment_number} received`,
            });
        }

        await client.query('COMMIT');
        res.status(200).json(installmentResult.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Failed to receive installment', error: error.message });
    } finally {
        client.release();
    }
};
