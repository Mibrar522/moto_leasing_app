const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { buildHtml, buildLocalAttachments, sendMailSafe } = require('../utils/mail');
const { resolveDurableUploadUrl } = require('../utils/storage');

const isSuperAdminSession = (user = {}) =>
    Number(user?.real_role_id || user?.role_id) === 1 ||
    (user?.real_role_name || user?.role_name) === 'SUPER_ADMIN';

const hasFeature = (user = {}, featureKey) =>
    Array.isArray(user?.feature_keys) && user.feature_keys.includes(featureKey);

const mapEmployee = (row) => ({
    ...row,
    assigned_features: row.assigned_features || [],
    role_features: row.role_features || [],
    denied_features: row.denied_features || [],
});

const getEmployeeConstraintMessage = (error) => {
    switch (error?.constraint) {
        case 'users_email_key':
        case 'employees_email_key':
            return 'Email is already in use.';
        case 'employees_employee_code_key':
        case 'employees_dealer_code_unique_idx':
            return 'Employee code must be unique for this dealer.';
        case 'employees_user_id_key':
            return 'This login account is already linked to another employee.';
        default:
            return null;
    }
};

const employeeSelect = `
    SELECT
        e.id,
        e.user_id,
        e.dealer_id,
        e.employee_code,
        e.full_name,
        e.email,
        e.phone,
        e.cnic_number,
        e.cnic_doc_url,
        e.cnic_front_url,
        e.cnic_back_url,
        e.department,
        e.job_title,
        e.commission_percentage,
        e.commission_value,
        e.base_salary,
        e.role_id,
        e.is_active,
        e.hired_at,
        e.notes,
        e.created_by,
        e.created_at,
        e.updated_at,
        r.role_name,
        d.dealer_name,
        d.dealer_code,
        creator.full_name AS created_by_name,
        creator.email AS created_by_email,
        COALESCE(
            json_agg(DISTINCT jsonb_build_object('id', eftr.id, 'key', eftr.feature_key, 'name', eftr.display_name))
            FILTER (WHERE eftr.id IS NOT NULL),
            '[]'::json
        ) AS assigned_features,
        COALESCE(
            json_agg(DISTINCT jsonb_build_object('id', rf.id, 'key', rf.feature_key, 'name', rf.display_name))
            FILTER (WHERE rf.id IS NOT NULL),
            '[]'::json
        ) AS role_features,
        COALESCE(
            json_agg(DISTINCT jsonb_build_object('id', df.id, 'key', df.feature_key, 'name', df.display_name))
            FILTER (WHERE df.id IS NOT NULL),
            '[]'::json
        ) AS denied_features
`;

const employeeFrom = `
    FROM employees e
    LEFT JOIN dealers d ON d.id = e.dealer_id
    LEFT JOIN users creator ON creator.id = e.created_by
    LEFT JOIN roles r ON r.id = e.role_id
    LEFT JOIN employee_features ef ON ef.employee_id = e.id
    LEFT JOIN features eftr ON eftr.id = ef.feature_id
    LEFT JOIN role_permissions rp ON rp.role_id = e.role_id
    LEFT JOIN features rf ON rf.id = rp.feature_id
    LEFT JOIN employee_feature_overrides efo ON efo.employee_id = e.id AND efo.access_mode = 'DENY'
    LEFT JOIN features df ON df.id = efo.feature_id
`;

const employeeGroup = `
    GROUP BY
        e.id, e.user_id, e.dealer_id, e.employee_code, e.full_name, e.email, e.phone, e.cnic_number, e.cnic_doc_url, e.cnic_front_url, e.cnic_back_url,
        e.department, e.job_title, e.commission_percentage, e.commission_value, e.base_salary, e.role_id, e.is_active, e.hired_at,
        e.notes, e.created_by, e.created_at, e.updated_at, r.role_name, d.dealer_name, d.dealer_code, creator.full_name, creator.email
`;

const syncEmployeeFeatures = async (client, employeeId, featureIds = [], deniedFeatureIds = []) => {
    await client.query('DELETE FROM employee_features WHERE employee_id = $1', [employeeId]);
    await client.query('DELETE FROM employee_feature_overrides WHERE employee_id = $1', [employeeId]);

    const uniqueFeatureIds = [...new Set((featureIds || []).map(Number).filter(Boolean))];
    const uniqueDeniedFeatureIds = [...new Set((deniedFeatureIds || []).map(Number).filter(Boolean))];

    for (const featureId of uniqueFeatureIds) {
        await client.query(
            'INSERT INTO employee_features (employee_id, feature_id) VALUES ($1, $2)',
            [employeeId, featureId]
        );
    }

    for (const featureId of uniqueDeniedFeatureIds) {
        await client.query(
            `INSERT INTO employee_feature_overrides (employee_id, feature_id, access_mode) VALUES ($1, $2, 'DENY')`,
            [employeeId, featureId]
        );
    }
};

const getEmployeeDealerMailContext = async (dealerId, creatorId) => {
    const result = await pool.query(
        `
        SELECT
            d.dealer_name,
            d.contact_email,
            d.mobile_country_code,
            d.mobile_number,
            admin_user.email AS admin_email,
            creator.email AS creator_email,
            creator.full_name AS creator_name
        FROM dealers d
        LEFT JOIN users admin_user ON admin_user.id = d.admin_user_id
        LEFT JOIN users creator ON creator.id = $2
        WHERE d.id = $1
        LIMIT 1
        `,
        [dealerId, creatorId]
    );

    const row = result.rows[0] || {};
    return {
        name: row.dealer_name || row.creator_name || 'MotorLease',
        email: row.contact_email || row.admin_email || row.creator_email || process.env.SMTP_USER,
        mobile_country_code: row.mobile_country_code,
        mobile_number: row.mobile_number,
    };
};

const sendEmployeeCreatedEmail = async ({ employee, password, dealerId, creatorId }) => {
    const dealerMail = await getEmployeeDealerMailContext(dealerId, creatorId);
    const roleName = employee.role_name || 'Staff';
    const loginUrl = process.env.CLIENT_APP_URL || process.env.FRONTEND_URL || 'https://moto-leasing-app.vercel.app/login';
    const lines = [
        `Your staff account has been created for ${dealerMail.name}.`,
        `Role: ${roleName}`,
        `Employee code: ${employee.employee_code}`,
        `Login email: ${employee.email}`,
        `Temporary password: ${password}`,
        `Login URL: ${loginUrl}`,
        'Please sign in and keep your password secure.',
    ];

    return sendMailSafe({
        dealer: dealerMail,
        to: employee.email,
        subject: `Staff account created - ${dealerMail.name}`,
        text: [
            `Dear ${employee.full_name},`,
            '',
            ...lines,
            '',
            `Thanks and regards,\n${dealerMail.name}\n${dealerMail.email || ''}`,
        ].join('\n'),
        html: buildHtml({
            title: 'Staff Account Created',
            greeting: `Dear ${employee.full_name},`,
            lines,
            dealer: dealerMail,
        }),
        attachments: buildLocalAttachments([
            employee.cnic_doc_url,
            employee.cnic_front_url,
            employee.cnic_back_url,
        ]),
    });
};

const getEmployeeScopeClause = (isSuperAdmin) => (isSuperAdmin ? 'WHERE e.id = $1' : 'WHERE e.id = $1 AND e.dealer_id = $2');

exports.createAdvance = async (req, res) => {
    const client = await pool.connect();

    try {
        const isSuperAdmin = isSuperAdminSession(req.user);
        const { amount, reason, advance_date } = req.body;

        if (Number(amount || 0) <= 0) {
            return res.status(400).json({ message: 'Advance amount must be greater than zero' });
        }

        const employeeCheck = await client.query(
            `SELECT id FROM employees e ${getEmployeeScopeClause(isSuperAdmin)}`,
            isSuperAdmin ? [req.params.id] : [req.params.id, req.user.dealer_id]
        );

        if (employeeCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const result = await client.query(
            `
            INSERT INTO employee_salary_advances (employee_id, advance_date, amount, reason, created_by)
            VALUES ($1, COALESCE($2::date, CURRENT_DATE), $3, $4, $5)
            RETURNING *
            `,
            [req.params.id, advance_date || null, Number(amount || 0), reason || null, req.user.id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create employee advance', error: error.message });
    } finally {
        client.release();
    }
};

exports.generateSalary = async (req, res) => {
    const client = await pool.connect();

    try {
        const isSuperAdmin = isSuperAdminSession(req.user);
        const payrollMonth = String(req.body?.payroll_month || '').trim();
        const notes = req.body?.notes || null;

        if (!/^\d{4}-\d{2}$/.test(payrollMonth)) {
            return res.status(400).json({ message: 'Payroll month is required in YYYY-MM format' });
        }

        await client.query('BEGIN');

        const employeeResult = await client.query(
            `
            SELECT e.id, e.base_salary
            FROM employees e
            ${getEmployeeScopeClause(isSuperAdmin)}
            FOR UPDATE
            `,
            isSuperAdmin ? [req.params.id] : [req.params.id, req.user.dealer_id]
        );

        if (employeeResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Employee not found' });
        }

        const existingPayroll = await client.query(
            'SELECT id FROM employee_payrolls WHERE employee_id = $1 AND payroll_month = $2',
            [req.params.id, payrollMonth]
        );

        if (existingPayroll.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Salary already generated for this month' });
        }

        const monthStart = `${payrollMonth}-01`;
        const commissionResult = await client.query(
            `
            SELECT COALESCE(SUM(commission_amount), 0)::numeric AS total_commission
            FROM employee_commissions
            WHERE employee_id = $1
              AND to_char(earned_on, 'YYYY-MM') = $2
            `,
            [req.params.id, payrollMonth]
        );

        const advancesResult = await client.query(
            `
            SELECT
                COALESCE(SUM(amount), 0)::numeric AS total_advances,
                array_remove(array_agg(id), NULL) AS advance_ids
            FROM employee_salary_advances
            WHERE employee_id = $1
              AND deducted_in_payroll_id IS NULL
              AND advance_date <= $2::date
            `,
            [req.params.id, monthStart]
        );

        const baseSalary = Number(employeeResult.rows[0].base_salary || 0);
        const totalCommission = Number(commissionResult.rows[0].total_commission || 0);
        const totalAdvances = Number(advancesResult.rows[0].total_advances || 0);
        const netSalary = baseSalary + totalCommission - totalAdvances;

        const payrollInsert = await client.query(
            `
            INSERT INTO employee_payrolls (
                employee_id, payroll_month, base_salary, total_commission,
                total_advances, net_salary, generated_by, notes
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *
            `,
            [req.params.id, payrollMonth, baseSalary, totalCommission, totalAdvances, netSalary, req.user.id, notes]
        );

        const payrollId = payrollInsert.rows[0].id;
        const advanceIds = advancesResult.rows[0].advance_ids || [];
        if (advanceIds.length > 0) {
            await client.query(
                `
                UPDATE employee_salary_advances
                SET deducted_in_payroll_id = $2
                WHERE id = ANY($1::uuid[])
                `,
                [advanceIds, payrollId]
            );
        }

        await client.query('COMMIT');
        res.status(201).json(payrollInsert.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Failed to generate salary', error: error.message });
    } finally {
        client.release();
    }
};

exports.listEmployees = async (req, res) => {
    try {
        const isSuperAdmin = isSuperAdminSession(req.user);
        const whereClause = isSuperAdmin ? '' : 'WHERE e.dealer_id = $1';
        const params = isSuperAdmin ? [] : [req.user.dealer_id];

        const [employeesResult, rolesResult, featuresResult] = await Promise.all([
            pool.query(
                `
                ${employeeSelect}
                ${employeeFrom}
                ${whereClause}
                ${employeeGroup}
                ORDER BY e.created_at DESC
                `,
                params
            ),
            pool.query('SELECT id, role_name FROM roles ORDER BY id'),
            pool.query('SELECT id, feature_key, display_name FROM features ORDER BY id'),
        ]);

        res.status(200).json({
            employees: employeesResult.rows.map(mapEmployee),
            roles: rolesResult.rows,
            features: featuresResult.rows,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to load employees', error: error.message });
    }
};

exports.createEmployee = async (req, res) => {
    const client = await pool.connect();

    try {
        const isSuperAdmin = isSuperAdminSession(req.user);
        const canUnlockSecurityFields = hasFeature(req.user, 'FEAT_EMPLOYEE_SECURITY_UNLOCK');
        const {
            user_id,
            password,
            employee_code,
            full_name,
            email,
            phone,
            cnic_number,
            cnic_doc_url,
            cnic_front_url,
            cnic_back_url,
            department,
            job_title,
            commission_percentage,
            commission_value,
            base_salary,
            role_id,
            is_active,
            hired_at,
            notes,
            feature_ids = [],
            denied_feature_ids = [],
            dealer_id,
        } = req.body;

        if (!employee_code || !full_name || !email || !password) {
            return res.status(400).json({ message: 'Employee code, full name, email, and password are required' });
        }

        if (!canUnlockSecurityFields) {
            return res.status(403).json({ message: 'Employee creation is blocked because the Employee Security Unlock feature is disabled for this account.' });
        }

        await client.query('BEGIN');

        const agentRoleResult = await client.query(
            `SELECT id FROM roles WHERE role_name = 'AGENT' LIMIT 1`
        );
        const defaultAgentRoleId = agentRoleResult.rows[0]?.id ? Number(agentRoleResult.rows[0].id) : null;
        const requestedDealerId = isSuperAdmin ? (dealer_id || null) : req.user.dealer_id;
        const requestedRoleId = role_id ? Number(role_id) : null;
        const requestedIsActive = typeof is_active === 'boolean' ? is_active : true;
        const lockedDealerId = req.user.dealer_id || null;

        if (!canUnlockSecurityFields && !lockedDealerId) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Employee security fields are locked for this account. Switch into a dealer profile or enable the unlock feature before creating a new employee.' });
        }

        const effectiveDealerId = canUnlockSecurityFields ? requestedDealerId : lockedDealerId;
        const effectiveRoleId = canUnlockSecurityFields ? requestedRoleId : defaultAgentRoleId;
        const effectiveIsActive = canUnlockSecurityFields ? requestedIsActive : true;

        if (isSuperAdmin && !effectiveDealerId) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Dealer assignment is required when the super admin creates an employee.' });
        }

        if (!isSuperAdmin && !effectiveDealerId) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Dealer admin is missing dealer scope' });
        }

        if (!canUnlockSecurityFields && requestedDealerId !== effectiveDealerId) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Assigned dealer is locked on new employee creation for this account.' });
        }

        if (!canUnlockSecurityFields && requestedRoleId !== effectiveRoleId) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Role is locked on new employee creation for this account.' });
        }

        if (!canUnlockSecurityFields && requestedIsActive !== effectiveIsActive) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Employee active status is locked on new employee creation for this account.' });
        }

        const duplicateEmployeeResult = await client.query(
            `
            SELECT id, employee_code, email
            FROM employees
            WHERE LOWER(email) = LOWER($1)
               OR (
                    UPPER(employee_code) = UPPER($2)
                    AND COALESCE(dealer_id, '00000000-0000-0000-0000-000000000000'::uuid) = COALESCE($3::uuid, '00000000-0000-0000-0000-000000000000'::uuid)
               )
            `,
            [email, employee_code, effectiveDealerId]
        );

        if (duplicateEmployeeResult.rows.length > 0) {
            const duplicateEmployee = duplicateEmployeeResult.rows[0];
            await client.query('ROLLBACK');
            if (String(duplicateEmployee.email || '').toLowerCase() === String(email || '').toLowerCase()) {
                return res.status(400).json({ message: 'Email is already in use.' });
            }
            return res.status(400).json({ message: 'Employee code must be unique for this dealer.' });
        }

        if (!isSuperAdmin && effectiveRoleId) {
            const roleCheck = await client.query('SELECT role_name FROM roles WHERE id = $1', [effectiveRoleId]);
            const targetRole = roleCheck.rows[0]?.role_name;

            if (!['MANAGER', 'AGENT'].includes(targetRole)) {
                await client.query('ROLLBACK');
                return res.status(403).json({ message: 'Application admin can only create manager and employee accounts' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let linkedUserId = user_id || null;

        if (!linkedUserId) {
            const existingUserResult = await client.query(
                'SELECT id, dealer_id FROM users WHERE LOWER(email) = LOWER($1)',
                [email]
            );

            if (existingUserResult.rows.length > 0) {
                const existingUser = existingUserResult.rows[0];
                const linkedEmployeeCheck = await client.query(
                    'SELECT id FROM employees WHERE user_id = $1',
                    [existingUser.id]
                );

                if (linkedEmployeeCheck.rows.length > 0) {
                    await client.query('ROLLBACK');
                    return res.status(400).json({ message: 'Email is already in use.' });
                }

                await client.query(
                    `
                    UPDATE users
                    SET
                        full_name = $1,
                        password_hash = $2,
                        role_id = $3,
                        is_active = $4,
                        dealer_id = $5
                    WHERE id = $6
                    `,
                    [
                        full_name,
                        hashedPassword,
                        effectiveRoleId || 3,
                        effectiveIsActive,
                        effectiveDealerId,
                        existingUser.id,
                    ]
                );

                linkedUserId = existingUser.id;
            }
        }

        if (!linkedUserId) {
            const userInsert = await client.query(
                `
                INSERT INTO users (full_name, email, password_hash, role_id, is_active, dealer_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
                `,
                [
                    full_name,
                    email,
                    hashedPassword,
                    effectiveRoleId || 3,
                    effectiveIsActive,
                    effectiveDealerId,
                ]
            );
            linkedUserId = userInsert.rows[0].id;
        }

        const insertResult = await client.query(
            `
            INSERT INTO employees (
                user_id, employee_code, full_name, email, phone, department,
                cnic_number, cnic_doc_url, cnic_front_url, cnic_back_url, job_title, commission_percentage, commission_value, base_salary, role_id, is_active, hired_at, notes, dealer_id, created_by
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,COALESCE($17::timestamptz, NOW()),$18,$19,$20)
            RETURNING id
            `,
            [
                linkedUserId,
                employee_code,
                full_name,
                email,
                phone || null,
                department || null,
                cnic_number || null,
                cnic_doc_url || null,
                cnic_front_url || cnic_doc_url || null,
                cnic_back_url || null,
                job_title || null,
                Number(commission_percentage || 0),
                Number(commission_value || 0),
                Number(base_salary || 0),
                effectiveRoleId || null,
                effectiveIsActive,
                hired_at || null,
                notes || null,
                effectiveDealerId,
                req.user.id,
            ]
        );

        const employeeId = insertResult.rows[0].id;
        await syncEmployeeFeatures(client, employeeId, feature_ids, denied_feature_ids);

        const result = await client.query(
            `
            ${employeeSelect}
            ${employeeFrom}
            WHERE e.id = $1
            ${employeeGroup}
            `,
            [employeeId]
        );

        await client.query('COMMIT');
        const createdEmployee = mapEmployee(result.rows[0]);
        sendEmployeeCreatedEmail({
            employee: createdEmployee,
            password,
            dealerId: effectiveDealerId,
            creatorId: req.user.id,
        })
            .then((mailResult) => {
                if (!mailResult.sent) {
                    console.warn('Employee created email warning:', mailResult.error);
                }
            })
            .catch((mailError) => console.warn('Employee created email warning:', mailError.message));

        res.status(201).json(createdEmployee);
    } catch (error) {
        await client.query('ROLLBACK');
        const constraintMessage = getEmployeeConstraintMessage(error);
        if (constraintMessage) {
            return res.status(400).json({ message: constraintMessage });
        }
        res.status(500).json({ message: 'Failed to create employee', error: error.message });
    } finally {
        client.release();
    }
};

exports.updateEmployee = async (req, res) => {
    const client = await pool.connect();

    try {
        const isSuperAdmin = isSuperAdminSession(req.user);
        const {
            user_id,
            password,
            employee_code,
            full_name,
            email,
            phone,
            cnic_number,
            cnic_doc_url,
            cnic_front_url,
            cnic_back_url,
            department,
            job_title,
            commission_percentage,
            commission_value,
            base_salary,
            role_id,
            is_active,
            hired_at,
            notes,
            feature_ids = [],
            denied_feature_ids = [],
            dealer_id,
        } = req.body;

        await client.query('BEGIN');

        const exists = await client.query(
            `SELECT id, dealer_id FROM employees WHERE id = $1 ${isSuperAdmin ? '' : 'AND dealer_id = $2'}`,
            isSuperAdmin ? [req.params.id] : [req.params.id, req.user.dealer_id]
        );
        if (exists.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Employee not found' });
        }

        const currentEmployee = await client.query(
            'SELECT user_id, full_name, email, role_id, dealer_id, is_active FROM employees WHERE id = $1',
            [req.params.id]
        );
        let linkedUserId = user_id || currentEmployee.rows[0].user_id;
        const currentRoleId = currentEmployee.rows[0].role_id ? Number(currentEmployee.rows[0].role_id) : null;
        const currentDealerId = currentEmployee.rows[0].dealer_id || exists.rows[0].dealer_id || null;
        const requestedRoleId = role_id ? Number(role_id) : null;
        const requestedDealerId = isSuperAdmin ? (dealer_id || currentDealerId || null) : req.user.dealer_id;
        const currentIsActive = Boolean(currentEmployee.rows[0].is_active);
        const requestedIsActive = typeof is_active === 'boolean' ? is_active : currentIsActive;
        const canUnlockSecurityFields = hasFeature(req.user, 'FEAT_EMPLOYEE_SECURITY_UNLOCK');
        const effectiveDealerId = currentDealerId;
        if (isSuperAdmin && !effectiveDealerId) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Dealer assignment is required when the super admin updates an employee.' });
        }

        if (!canUnlockSecurityFields && requestedDealerId !== currentDealerId) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Assigned dealer is locked after employee creation. Use a dedicated transfer flow to move this employee.' });
        }

        if (!canUnlockSecurityFields && requestedRoleId !== currentRoleId) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Role is locked after employee creation. Use a dedicated role-change flow to update employee access level.' });
        }

        if (!canUnlockSecurityFields && requestedIsActive !== currentIsActive) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Active or inactive status is locked after employee creation. Ask an authorized user to unlock employee security fields first.' });
        }

        const finalRoleId = canUnlockSecurityFields ? requestedRoleId : currentRoleId;
        const finalDealerId = canUnlockSecurityFields ? requestedDealerId : currentDealerId;
        const finalIsActive = canUnlockSecurityFields ? requestedIsActive : currentIsActive;

        const duplicateEmployeeResult = await client.query(
            `
            SELECT id, employee_code, email
            FROM employees
            WHERE id <> $1
              AND (
                    LOWER(email) = LOWER($2)
                    OR (
                        UPPER(employee_code) = UPPER($3)
                        AND COALESCE(dealer_id, '00000000-0000-0000-0000-000000000000'::uuid) = COALESCE($4::uuid, '00000000-0000-0000-0000-000000000000'::uuid)
                    )
              )
            `,
            [req.params.id, email, employee_code, effectiveDealerId]
        );

        if (duplicateEmployeeResult.rows.length > 0) {
            const duplicateEmployee = duplicateEmployeeResult.rows[0];
            await client.query('ROLLBACK');
            if (String(duplicateEmployee.email || '').toLowerCase() === String(email || '').toLowerCase()) {
                return res.status(400).json({ message: 'Email is already in use.' });
            }
            return res.status(400).json({ message: 'Employee code must be unique for this dealer.' });
        }

        if (!isSuperAdmin && role_id) {
            const roleCheck = await client.query('SELECT role_name FROM roles WHERE id = $1', [role_id]);
            const targetRole = roleCheck.rows[0]?.role_name;

            if (!['MANAGER', 'AGENT'].includes(targetRole)) {
                await client.query('ROLLBACK');
                return res.status(403).json({ message: 'Application admin can only assign manager and employee roles' });
            }
        }

        if (!linkedUserId && password) {
            const existingUserByEmail = await client.query(
                'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
                [email]
            );

            if (existingUserByEmail.rows.length > 0) {
                linkedUserId = existingUserByEmail.rows[0].id;
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const newUser = await client.query(
                    `
                    INSERT INTO users (full_name, email, password_hash, role_id, is_active, dealer_id)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING id
                    `,
                    [
                        full_name || currentEmployee.rows[0].full_name,
                        email || currentEmployee.rows[0].email,
                        hashedPassword,
                        finalRoleId || 3,
                        finalIsActive,
                        finalDealerId,
                    ]
                );

                linkedUserId = newUser.rows[0].id;
            }
        }

        await client.query(
            `
            UPDATE employees
            SET
                user_id = $1,
                employee_code = $2,
                full_name = $3,
                email = $4,
                phone = $5,
                cnic_number = $6,
                cnic_doc_url = $7,
                cnic_front_url = $8,
                cnic_back_url = $9,
                department = $10,
                job_title = $11,
                commission_percentage = $12,
                commission_value = $13,
                base_salary = $14,
                role_id = $15,
                is_active = $16,
                hired_at = COALESCE($17::timestamptz, hired_at),
                notes = $18,
                dealer_id = $19
            WHERE id = $20
            `,
            [
                linkedUserId || null,
                employee_code,
                full_name,
                email,
                phone || null,
                cnic_number || null,
                cnic_doc_url || null,
                cnic_front_url || cnic_doc_url || null,
                cnic_back_url || null,
                department || null,
                job_title || null,
                Number(commission_percentage || 0),
                Number(commission_value || 0),
                Number(base_salary || 0),
                finalRoleId,
                finalIsActive,
                hired_at || null,
                notes || null,
                finalDealerId,
                req.params.id,
            ]
        );

        if (linkedUserId) {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                await client.query(
                    `
                    UPDATE users
                    SET
                        full_name = $1,
                        email = $2,
                        role_id = $3,
                        is_active = $4,
                        password_hash = $5,
                        dealer_id = $6
                    WHERE id = $7
                    `,
                    [full_name, email, finalRoleId, finalIsActive, hashedPassword, finalDealerId, linkedUserId]
                );
            } else {
                await client.query(
                    `
                    UPDATE users
                    SET
                        full_name = $1,
                        email = $2,
                        role_id = $3,
                        is_active = $4,
                        dealer_id = $5
                    WHERE id = $6
                    `,
                    [full_name, email, finalRoleId, finalIsActive, finalDealerId, linkedUserId]
                );
            }
        }

        await syncEmployeeFeatures(client, req.params.id, feature_ids, denied_feature_ids);

        const result = await client.query(
            `
            ${employeeSelect}
            ${employeeFrom}
            WHERE e.id = $1
            ${employeeGroup}
            `,
            [req.params.id]
        );

        await client.query('COMMIT');
        res.status(200).json(mapEmployee(result.rows[0]));
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Failed to update employee', error: error.message });
    } finally {
        client.release();
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const isSuperAdmin = isSuperAdminSession(req.user);
        const result = await pool.query(
            `DELETE FROM employees WHERE id = $1 ${isSuperAdmin ? '' : 'AND dealer_id = $2'} RETURNING id, user_id, full_name, employee_code`,
            isSuperAdmin ? [req.params.id] : [req.params.id, req.user.dealer_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        if (result.rows[0].user_id) {
            await pool.query('DELETE FROM users WHERE id = $1', [result.rows[0].user_id]);
        }

        res.status(200).json({ message: 'Employee deleted', employee: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete employee', error: error.message });
    }
};

exports.uploadEmployeeDocument = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Employee CNIC file is required' });
    }

    const fallbackUrl = `/uploads/employees/${req.file.filename}`;
    const url = await resolveDurableUploadUrl(req.file, 'employees', fallbackUrl);

    res.status(200).json({
        url,
        originalName: req.file.originalname,
    });
};
