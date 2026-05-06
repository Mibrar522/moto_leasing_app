const pool = require('../config/db');
const { reconcileReceivedStockOrders } = require('./stockController');
const { syncAccessCatalogDefaults } = require('../utils/accessBootstrap');

const PENDING_APPLICATION_STATUSES = ['PENDING', 'SUBMITTED', 'UNDER_REVIEW'];
const hasAnyFeature = (featureKeys = [], requiredKeys = []) => requiredKeys.some((featureKey) => featureKeys.includes(featureKey));
const getNotificationReaderUserId = (user = {}) => user.real_user_id || user.id;
let dashboardMaintenanceRunning = false;
let dashboardMaintenanceLastStartedAt = 0;

const runDashboardMaintenance = () => {
    const now = Date.now();
    if (dashboardMaintenanceRunning || now - dashboardMaintenanceLastStartedAt < 5 * 60 * 1000) {
        return;
    }

    dashboardMaintenanceRunning = true;
    dashboardMaintenanceLastStartedAt = now;

    Promise.all([
        syncAccessCatalogDefaults(),
        reconcileReceivedStockOrders(),
    ])
        .catch((error) => console.warn('Dashboard maintenance skipped:', error.message))
        .finally(() => {
            dashboardMaintenanceRunning = false;
        });
};

const safeDashboardQuery = async (runner, label, fallbackRows = []) => {
    try {
        return await runner();
    } catch (error) {
        console.warn(`${label} fallback:`, error.message);
        return { rows: fallbackRows };
    }
};

const ensureDashboardDealerScopeColumns = async (wantsProducts, wantsCompanies) => {
    try {
        if (wantsProducts) {
            await pool.query(`
                ALTER TABLE product_catalog
                    ADD COLUMN IF NOT EXISTS dealer_id UUID,
                    ADD COLUMN IF NOT EXISTS created_by UUID
            `);
        }
        if (wantsCompanies) {
            await pool.query(`
                ALTER TABLE company_profiles
                    ADD COLUMN IF NOT EXISTS dealer_id UUID,
                    ADD COLUMN IF NOT EXISTS created_by UUID
            `);
        }
        return true;
    } catch (error) {
        console.warn('Dashboard dealer scope column setup skipped:', error.message);
        return false;
    }
};

const getRolePermissions = async () => {
    const rolePermissionsResult = await pool.query(
        `
        SELECT
            rp.role_id,
            rp.feature_id,
            COALESCE(r.role_name, r.name) AS role_name,
            f.feature_key,
            f.display_name
        FROM role_permissions rp
        JOIN roles r ON r.id = rp.role_id
        JOIN features f ON f.id = rp.feature_id
        ORDER BY rp.role_id, rp.feature_id
        `
    );

    return rolePermissionsResult.rows;
};

exports.getDashboardData = async (req, res) => {
    try {
        runDashboardMaintenance();

        const isEmployeeLogin = Number(req.user.role_id) === 3 || req.user.role_name === 'AGENT';
        const isSuperAdmin = Number(req.user.role_id) === 1 || req.user.role_name === 'SUPER_ADMIN';
        const isManagerLogin = req.user.role_name === 'MANAGER';
        const isApplicationAdminLogin = req.user.role_name === 'APPLICATION_ADMIN';
        const isAgentLogin = req.user.role_name === 'AGENT' || Number(req.user.role_id) === 3;

        // Prefer the dealer embedded in the JWT (supports super-admin dealer switching),
        // but fall back to the dealer linked in the DB access profile for dealer-scoped roles.
        const tokenDealerId = req.user.effective_dealer_id || req.user.dealer_id || null;
        let effectiveDealerId = tokenDealerId;

        const userResult = await pool.query(
            `
            SELECT
                u.id,
                u.full_name,
                u.email,
                u.role_id,
                r.role_name,
                COALESCE(u.dealer_id, e.dealer_id) AS dealer_id,
                u.brand_name,
                u.brand_logo_url,
                u.brand_address,
                d.dealer_name,
                d.theme_key,
                d.dealer_logo_url,
                d.dealer_signature_url,
                d.dealer_address,
                d.mobile_country_code,
                d.mobile_number,
                d.contact_email,
                d.currency_code,
                d.application_slug
            FROM users u
            LEFT JOIN roles r ON r.id = u.role_id
            LEFT JOIN employees e ON e.user_id = u.id
            LEFT JOIN dealers d ON d.id = COALESCE(u.dealer_id, e.dealer_id)
            WHERE u.id = $1
            GROUP BY u.id, r.role_name, u.dealer_id, e.dealer_id, u.brand_name, u.brand_logo_url, u.brand_address, d.dealer_name, d.theme_key, d.dealer_logo_url, d.dealer_signature_url, d.dealer_address, d.mobile_country_code, d.mobile_number, d.contact_email, d.currency_code, d.application_slug
            `,
            [req.user.id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!effectiveDealerId) {
            effectiveDealerId = userResult.rows[0].dealer_id || null;
        }

        const hasGlobalScope = isSuperAdmin && !req.user.effective_dealer_id;
        const isDealerScopedView = Boolean(effectiveDealerId) && !isEmployeeLogin && !hasGlobalScope;
        const hasDealerDataScope = Boolean(effectiveDealerId) && !hasGlobalScope;
        const canViewWorkflowWorkspace = hasAnyFeature(req.user.feature_keys || [], ['FEAT_WORKFLOW_VIEW']);
        const canViewWorkflowDefinitions = canViewWorkflowWorkspace && hasAnyFeature(req.user.feature_keys || [], ['FEAT_WORKFLOW_CONFIG']);
        const canViewWorkflowTasks = canViewWorkflowWorkspace && hasAnyFeature(req.user.feature_keys || [], ['FEAT_WORKFLOW_TASKS']);
        const leaseMetricsWhereClause = isEmployeeLogin
            ? 'WHERE la.agent_id = $2'
            : isDealerScopedView
                ? 'WHERE u.dealer_id = $2'
                : '';
        const applicationsParams = isEmployeeLogin || isDealerScopedView
            ? [PENDING_APPLICATION_STATUSES, isEmployeeLogin ? req.user.id : effectiveDealerId]
            : [PENDING_APPLICATION_STATUSES];
        const applicationsListWhereClause = isEmployeeLogin
            ? 'WHERE la.agent_id = $1'
            : isDealerScopedView
                ? 'WHERE u.dealer_id = $1'
                : '';

        const featureResult = (req.user.feature_keys || []).length > 0
            ? await pool.query(
                `
                SELECT feature_key AS key, display_name AS name
                FROM features
                WHERE feature_key = ANY($1::text[])
                ORDER BY display_name
                `,
                [req.user.feature_keys]
            )
            : { rows: [] };
        const notificationReadsResult = await safeDashboardQuery(
            () => pool.query(
                `
                SELECT notification_key, read_at
                FROM notification_reads
                WHERE user_id = $1
                ORDER BY read_at DESC
                `,
                [getNotificationReaderUserId(req.user)]
            ),
            'notification reads',
            []
        );

        Object.assign(userResult.rows[0], {
            features: featureResult.rows,
            real_user_id: req.user.real_user_id || req.user.id,
            real_role_id: req.user.real_role_id || req.user.role_id,
            real_role_name: req.user.real_role_name || req.user.role_name,
            real_dealer_id: req.user.real_dealer_id || null,
            real_feature_keys: req.user.real_feature_keys || req.user.feature_keys || [],
            profile_mode: req.user.profile_mode || (isSuperAdmin ? 'SUPER_ADMIN' : 'DEFAULT'),
            switched_profile: Boolean(req.user.switched_profile),
        });

        if (isDealerScopedView) {
            const scopedDealerResult = await pool.query(
                `
                SELECT
                    id,
                    dealer_name,
                    theme_key,
                    dealer_logo_url,
                    dealer_address,
                    mobile_country_code,
                    mobile_number,
                    contact_email,
                    currency_code,
                    application_slug
                FROM dealers
                WHERE id = $1
                `,
                [effectiveDealerId]
            );

            if (scopedDealerResult.rows[0]) {
                Object.assign(userResult.rows[0], {
                    dealer_id: scopedDealerResult.rows[0].id,
                    dealer_name: scopedDealerResult.rows[0].dealer_name,
                    theme_key: scopedDealerResult.rows[0].theme_key,
                    dealer_logo_url: scopedDealerResult.rows[0].dealer_logo_url,
                    dealer_address: scopedDealerResult.rows[0].dealer_address,
                    mobile_country_code: scopedDealerResult.rows[0].mobile_country_code,
                    mobile_number: scopedDealerResult.rows[0].mobile_number,
                    contact_email: scopedDealerResult.rows[0].contact_email,
                    currency_code: scopedDealerResult.rows[0].currency_code,
                    application_slug: scopedDealerResult.rows[0].application_slug,
                    effective_dealer_id: scopedDealerResult.rows[0].id,
                    profile_mode: 'DEALER_SWITCH',
                });
            }
        }

        const canViewSalesTransactions = hasAnyFeature(req.user.feature_keys || [], [
            'FEAT_SALES_CREATE',
            'FEAT_SALES_MGMT',
            'FEAT_INSTALLMENT_MGMT',
            'FEAT_TRANSACTION_REGISTER',
            'FEAT_REPORT_DAILY_SALES',
            'FEAT_REPORT_CUSTOMER_TRANSACTIONS',
            'FEAT_REPORT_BUSINESS_TRANSACTIONS',
            'FEAT_REPORT_INVOICE_VIEW',
            'FEAT_DASHBOARD_SALES_PERFORMANCE',
            'FEAT_DASHBOARD_PROFIT_TRANSACTIONS',
            'FEAT_DASHBOARD_COMPANY_PROFITABILITY',
        ]);

        const requestedPage = String(req.query.page || 'dashboard').trim().toLowerCase();
        const reportPageRequested = requestedPage === 'reports' || requestedPage.startsWith('report-');
        const dashboardGroupsByPage = {
            dashboard: ['metrics', 'applications', 'ads', 'notifications', 'dealers'],
            customers: ['customers', 'dealers'],
            employees: ['employees', 'dealers', 'roles', 'features', 'employeeFinancials'],
            dealers: ['dealers', 'roles'],
            access: ['roles', 'features', 'rolePermissions'],
            applications: ['applications'],
            workflow: ['workflowDefinitions', 'workflowTasks', 'salesTransactions'],
            'user-tasks': ['workflowTasks', 'salesTransactions'],
            products: ['products', 'vehicleTypes'],
            companies: ['companies'],
            stock: ['stockOrders', 'products', 'companies', 'vehicleTypes'],
            sales: ['salesTransactions', 'customers', 'inventory', 'dealers', 'workflowDefinitions'],
            transactions: ['salesTransactions'],
            installments: ['salesTransactions', 'customers', 'inventory'],
        };
        const requestedGroups = new Set([
            ...(dashboardGroupsByPage[requestedPage] || dashboardGroupsByPage.dashboard),
            ...(reportPageRequested ? ['salesTransactions', 'stockOrders', 'customers', 'employees', 'products', 'inventory', 'dealers', 'employeeFinancials'] : []),
        ]);
        const wantsGroup = (groupKey) => requestedGroups.has(groupKey);
        const dealerScopeColumnsReady = await ensureDashboardDealerScopeColumns(wantsGroup('products'), wantsGroup('companies'));

        const metricsResult = wantsGroup('metrics') ? await pool.query(
            `
            SELECT
                COUNT(*) FILTER (WHERE UPPER(v.status) = 'AVAILABLE')::int AS available_vehicles,
                COUNT(*)::int AS total_vehicles
            FROM vehicles v
            ${isDealerScopedView ? `
            LEFT JOIN stock_orders so ON so.id = v.source_stock_order_id
            LEFT JOIN users vou ON vou.id = so.ordered_by
            WHERE vou.dealer_id = $1
            ` : ''}
            `,
            isDealerScopedView ? [effectiveDealerId] : []
        ) : { rows: [{ available_vehicles: 0, total_vehicles: 0 }] };

        const leaseMetricsResult = wantsGroup('metrics') ? await pool.query(
            `
            SELECT
                COUNT(*) FILTER (WHERE UPPER(status) = ANY($1::text[]))::int AS pending_applications,
                COUNT(*)::int AS total_applications,
                COALESCE(SUM(total_amount), 0)::numeric AS total_revenue
            FROM lease_applications
            ${isDealerScopedView ? 'JOIN users lu ON lu.id = lease_applications.agent_id' : ''}
            ${isEmployeeLogin ? 'WHERE agent_id = $2' : isDealerScopedView ? 'WHERE lu.dealer_id = $2' : ''}
            `,
            applicationsParams
        ) : { rows: [{ pending_applications: 0, total_applications: 0, total_revenue: 0 }] };

        const settledLeaseMetricsResult = wantsGroup('metrics') ? await pool.query(
            `
            SELECT
                COUNT(*) FILTER (
                    WHERE installment_count > 0
                      AND pending_installment_count = 0
                      AND received_installment_count = installment_count
                )::int AS settled_leases,
                COUNT(*) FILTER (
                    WHERE installment_count > 0
                      AND pending_installment_count > 0
                )::int AS pending_leases
            FROM (
                SELECT
                    st.id,
                    COUNT(si.id)::int AS installment_count,
                    COUNT(*) FILTER (WHERE UPPER(COALESCE(si.status, '')) = 'RECEIVED')::int AS received_installment_count,
                    COUNT(*) FILTER (WHERE UPPER(COALESCE(si.status, '')) <> 'RECEIVED')::int AS pending_installment_count
                FROM sales_transactions st
                LEFT JOIN users su ON su.id = st.agent_id
                LEFT JOIN sale_installments si ON si.sale_id = st.id
                WHERE UPPER(COALESCE(st.sale_mode, '')) = 'INSTALLMENT'
                  AND UPPER(COALESCE(st.approval_status, 'APPROVED')) = 'APPROVED'
                  ${isEmployeeLogin ? 'AND st.agent_id = $1' : isDealerScopedView ? 'AND su.dealer_id = $1' : ''}
                GROUP BY st.id
            ) AS installment_sales
            `,
            isEmployeeLogin || isDealerScopedView ? [isEmployeeLogin ? req.user.id : effectiveDealerId] : []
        ) : { rows: [{ settled_leases: 0, pending_leases: 0 }] };

        const salesMetricsResult = wantsGroup('metrics') ? await pool.query(
            `
            SELECT
                COUNT(*)::int AS total_sales,
                COUNT(*) FILTER (
                    WHERE UPPER(COALESCE(sale_mode, '')) = 'INSTALLMENT'
                    AND UPPER(COALESCE(status, '')) <> 'RECEIVED'
                )::int AS active_installment_sales,
                COUNT(*) FILTER (
                    WHERE UPPER(COALESCE(status, '')) <> 'RECEIVED'
                )::int AS pending_sales,
                COALESCE(SUM(vehicle_price), 0)::numeric AS total_sales_revenue
            FROM sales_transactions
            ${isEmployeeLogin ? 'WHERE agent_id = $1' : isDealerScopedView ? 'WHERE agent_id IN (SELECT id FROM users WHERE dealer_id = $1)' : ''}
            `,
            isEmployeeLogin || isDealerScopedView ? [isEmployeeLogin ? req.user.id : effectiveDealerId] : []
        ) : { rows: [{ total_sales: 0, active_installment_sales: 0, pending_sales: 0, total_sales_revenue: 0 }] };

        const installmentTaskMetricsResult = wantsGroup('metrics') ? await pool.query(
            `
            SELECT
                COUNT(*)::int AS pending_installments
            FROM sale_installments si
            JOIN sales_transactions st ON st.id = si.sale_id
            LEFT JOIN users stu ON stu.id = st.agent_id
            WHERE UPPER(COALESCE(si.status, '')) <> 'RECEIVED'
            ${isEmployeeLogin ? 'AND st.agent_id = $1' : isDealerScopedView ? 'AND stu.dealer_id = $1' : ''}
            `,
            isEmployeeLogin || isDealerScopedView ? [isEmployeeLogin ? req.user.id : effectiveDealerId] : []
        ) : { rows: [{ pending_installments: 0 }] };

        const employeeSalesResult = wantsGroup('metrics') && isEmployeeLogin
            ? await pool.query(
                `
                SELECT
                    COUNT(*) FILTER (WHERE UPPER(status) = ANY($1::text[]))::int AS received_count,
                    COUNT(*) FILTER (WHERE UPPER(status) = ANY($2::text[]))::int AS pending_count,
                    COALESCE(SUM(total_amount) FILTER (WHERE UPPER(status) = ANY($1::text[])), 0)::numeric AS received_value,
                    COALESCE(SUM(total_amount) FILTER (WHERE UPPER(status) = ANY($2::text[])), 0)::numeric AS pending_value,
                    COUNT(*) FILTER (
                        WHERE UPPER(status) = ANY($2::text[])
                        AND created_at < date_trunc('month', CURRENT_DATE)
                    )::int AS overdue_followups
                FROM lease_applications
                WHERE agent_id = $3
                `,
                [['RECEIVED'], PENDING_APPLICATION_STATUSES, req.user.id]
            )
            : { rows: [{ received_count: 0, pending_count: 0, received_value: 0, pending_value: 0, overdue_followups: 0 }] };

        const customerMetricsResult = wantsGroup('metrics') ? await pool.query(
            `
            SELECT
                COUNT(*)::int AS total_customers,
                COUNT(*) FILTER (WHERE biometric_hash IS NOT NULL AND biometric_hash <> '')::int AS enrolled_biometrics,
                COUNT(*) FILTER (
                    WHERE COALESCE(ocr_details->>'document_type', '') IN ('CNIC', 'PASSPORT')
                )::int AS scanned_documents
            FROM customers
            ${isDealerScopedView ? 'WHERE created_by_agent IN (SELECT id FROM users WHERE dealer_id = $1)' : ''}
            `,
            isDealerScopedView ? [effectiveDealerId] : []
        ) : { rows: [{ total_customers: 0, enrolled_biometrics: 0, scanned_documents: 0 }] };

        const employeeMetricsResult = wantsGroup('metrics') ? await pool.query(
            `
            SELECT
                COUNT(*)::int AS total_employees,
                COUNT(*) FILTER (WHERE is_active = TRUE)::int AS active_employees
            FROM employees
            ${isDealerScopedView ? 'WHERE dealer_id = $1' : ''}
            `,
            isDealerScopedView ? [effectiveDealerId] : []
        ) : { rows: [{ total_employees: 0, active_employees: 0 }] };

        const dealerMetricsResult = wantsGroup('metrics') ? await pool.query(
            `
            SELECT
                COUNT(*)::int AS total_dealers,
                COUNT(*) FILTER (WHERE is_active = TRUE)::int AS active_dealers
            FROM dealers
            ${isDealerScopedView ? 'WHERE id = $1' : ''}
            `,
            isDealerScopedView ? [effectiveDealerId] : []
        ) : { rows: [{ total_dealers: 0, active_dealers: 0 }] };

        const applicationsResult = wantsGroup('applications') ? await pool.query(
            `
            SELECT
                la.id,
                la.status,
                la.duration_months,
                la.monthly_installment,
                la.total_amount,
                la.created_at,
                c.full_name AS customer_name,
                v.brand,
                v.model,
                v.registration_number,
                u.full_name AS agent_name
            FROM lease_applications la
            LEFT JOIN customers c ON c.id = la.customer_id
            LEFT JOIN vehicles v ON v.id = la.vehicle_id
            LEFT JOIN users u ON u.id = la.agent_id
            ${applicationsListWhereClause}
            ORDER BY la.created_at DESC
            LIMIT 10
            `,
            isEmployeeLogin || isDealerScopedView ? [isEmployeeLogin ? req.user.id : effectiveDealerId] : []
        ) : { rows: [] };

        const inventoryResult = wantsGroup('inventory') && (!hasDealerDataScope || dealerScopeColumnsReady) ? await safeDashboardQuery(
            () => pool.query(
            `
            SELECT
                v.id,
                v.brand,
                v.model,
                v.serial_number,
                v.registration_number,
                v.vehicle_type,
                v.chassis_number,
                v.engine_number,
                v.color,
                v.product_description,
                v.image_url,
                v.status,
                v.monthly_rate,
                v.purchase_price,
                v.created_at,
                pc.cash_markup_percent,
                pc.cash_markup_value,
                pc.installment_markup_percent,
                pc.installment_months,
                d.id AS dealer_id,
                d.dealer_name,
                d.dealer_code
            FROM vehicles v
            LEFT JOIN stock_orders so ON so.id = v.source_stock_order_id
            LEFT JOIN product_catalog pc ON pc.id = so.product_id
            LEFT JOIN users ou ON ou.id = so.ordered_by
            LEFT JOIN dealers d ON d.id = ou.dealer_id
            ${hasDealerDataScope ? 'WHERE d.id = $1' : ''}
            ORDER BY v.created_at DESC NULLS LAST, v.brand ASC, v.model ASC
            LIMIT 500
            `,
            hasDealerDataScope ? [effectiveDealerId] : []
            ),
            'inventory query',
            []
        ) : { rows: [] };

        const productsResult = wantsGroup('products') && (!hasDealerDataScope || dealerScopeColumnsReady) ? await safeDashboardQuery(
            () => pool.query(
            `
            SELECT
                id,
                brand,
                model,
                serial_number,
                registration_number,
                vehicle_type,
                chassis_number,
                engine_number,
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
            WHERE is_active = TRUE
              ${hasDealerDataScope ? 'AND dealer_id = $1' : ''}
            ORDER BY created_at DESC, brand ASC, model ASC
            LIMIT 500
            `,
            hasDealerDataScope ? [effectiveDealerId] : []
            ),
            'products query',
            []
        ) : { rows: [] };

        const companiesResult = wantsGroup('companies') && (!hasDealerDataScope || dealerScopeColumnsReady) ? await safeDashboardQuery(
            () => pool.query(
            `
            SELECT
                id,
                company_name,
                company_email,
                contact_person,
                phone,
                address,
                notes,
                is_active,
                created_at,
                updated_at
            FROM company_profiles
            WHERE is_active = TRUE
              ${hasDealerDataScope ? 'AND dealer_id = $1' : ''}
            ORDER BY company_name ASC
            LIMIT 300
            `,
            hasDealerDataScope ? [effectiveDealerId] : []
            ),
            'companies query',
            []
        ) : { rows: [] };

        const customersResult = wantsGroup('customers') ? await safeDashboardQuery(
            () => pool.query(
                `
                SELECT
                    c.id,
                    c.full_name,
                    c.cnic_passport_number,
                    c.ocr_details,
                    c.biometric_hash,
                    c.identity_doc_url,
                    c.created_by_agent,
                    COALESCE(
                        CASE
                            WHEN UPPER(COALESCE(creator_role.role_name, '')) = 'APPLICATION_ADMIN'
                                THEN NULLIF(d.dealer_name, '')
                            ELSE NULL
                        END,
                        NULLIF(creator.full_name, ''),
                        NULLIF(creator.brand_name, ''),
                        NULLIF(d.dealer_name, ''),
                        creator.email
                    ) AS created_by_name,
                    creator.email AS created_by_email,
                    COALESCE(c.dealer_id, creator.dealer_id) AS dealer_id,
                    d.dealer_name,
                    d.dealer_code
                FROM customers c
                LEFT JOIN users creator ON creator.id = c.created_by_agent
                LEFT JOIN dealers d ON d.id = COALESCE(c.dealer_id, creator.dealer_id)
                LEFT JOIN roles creator_role ON creator_role.id = creator.role_id
                ${isDealerScopedView ? 'WHERE COALESCE(c.dealer_id, creator.dealer_id) = $1' : ''}
                ORDER BY c.full_name ASC
                LIMIT 2000
                `,
                isDealerScopedView ? [effectiveDealerId] : []
            ),
            'customers query',
            []
        ) : { rows: [] };

        const employeeScopeClause = hasGlobalScope
            ? ''
            : isAgentLogin
                ? 'WHERE e.user_id = $1'
                : isManagerLogin || isApplicationAdminLogin
                    ? 'WHERE e.dealer_id = $1'
                    : 'WHERE e.dealer_id = $1';
        const employeeScopeParams = hasGlobalScope ? [] : [isAgentLogin ? req.user.id : effectiveDealerId];

        const employeesResult = wantsGroup('employees') ? await safeDashboardQuery(
            () => pool.query(
                `
                SELECT
                    e.id,
                    e.user_id,
                    e.dealer_id,
                    d.dealer_name,
                    d.dealer_code,
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
                    e.dealer_id,
                    e.created_by,
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
                ${employeeScopeClause}
                GROUP BY
                    e.id,
                    e.user_id,
                    e.dealer_id,
                    d.dealer_name,
                    d.dealer_code,
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
                    r.role_name,
                    creator.full_name,
                    creator.email,
                    e.created_at
                ORDER BY e.created_at DESC
                LIMIT 50
                `,
                employeeScopeParams
            ),
            'employees query',
            []
        ) : { rows: [] };
        const dealerStaffScopeClause = hasGlobalScope
            ? ''
            : isAgentLogin
                ? 'WHERE (u.id = $1 OR e.user_id = $1)'
                : isManagerLogin
                    ? "WHERE COALESCE(u.dealer_id, e.dealer_id) = $1 AND COALESCE(r.role_name, '') <> 'APPLICATION_ADMIN'"
                    : isApplicationAdminLogin
                        ? "WHERE COALESCE(u.dealer_id, e.dealer_id) = $1 AND COALESCE(r.role_name, '') <> 'SUPER_ADMIN'"
                        : 'WHERE COALESCE(u.dealer_id, e.dealer_id) = $1';
        const dealerStaffScopeParams = hasGlobalScope ? [] : [isAgentLogin ? req.user.id : effectiveDealerId];
        const dealerStaffResult = wantsGroup('employees') ? await pool.query(
            `
            SELECT
                u.id,
                COALESCE(u.dealer_id, e.dealer_id) AS dealer_id,
                d.dealer_name,
                d.dealer_code,
                u.full_name,
                u.email,
                u.is_active,
                r.role_name,
                e.employee_code,
                e.department,
                e.job_title,
                e.hired_at,
                u.created_at
            FROM users u
            LEFT JOIN employees e ON e.user_id = u.id
            LEFT JOIN dealers d ON d.id = COALESCE(u.dealer_id, e.dealer_id)
            LEFT JOIN roles r ON r.id = COALESCE(e.role_id, u.role_id)
            ${dealerStaffScopeClause}
            ORDER BY u.full_name ASC, u.created_at DESC
            LIMIT 300
            `,
            dealerStaffScopeParams
        ) : { rows: [] };

        const rolesResult = wantsGroup('roles') ? await pool.query('SELECT id, COALESCE(role_name, name) AS role_name FROM roles ORDER BY id') : { rows: [] };
        const featuresResult = wantsGroup('features') ? await pool.query('SELECT id, feature_key, display_name FROM features ORDER BY id') : { rows: [] };
        const workflowDefinitionScopeClause = hasGlobalScope ? '' : 'WHERE wd.dealer_id = $1 OR wd.dealer_id IS NULL';
        const workflowDefinitionScopeParams = hasGlobalScope ? [] : [effectiveDealerId || null];
        const workflowDefinitionsResult = wantsGroup('workflowDefinitions') && canViewWorkflowDefinitions
            ? await pool.query(
                `
                SELECT
                    wd.*,
                    d.dealer_name,
                    d.dealer_code,
                    creator.full_name AS created_by_name,
                    updater.full_name AS updated_by_name
                FROM workflow_definitions wd
                LEFT JOIN dealers d ON d.id = wd.dealer_id
                LEFT JOIN users creator ON creator.id = wd.created_by
                LEFT JOIN users updater ON updater.id = wd.updated_by
                ${workflowDefinitionScopeClause}
                ORDER BY wd.updated_at DESC, wd.created_at DESC
                `,
                workflowDefinitionScopeParams
            )
            : { rows: [] };
        let workflowTaskScopeClause = '';
        let workflowTaskScopeParams = [];
        if (wantsGroup('workflowTasks') && canViewWorkflowTasks) {
            if (isAgentLogin) {
                workflowTaskScopeClause = 'WHERE wt.created_by = $1 OR wt.acted_by = $1';
                workflowTaskScopeParams = [req.user.id];
            } else if (!hasGlobalScope) {
                workflowTaskScopeClause = `
                    WHERE (
                        (wt.assigned_role_name = $1 AND (wt.dealer_id = $2 OR wt.dealer_id IS NULL))
                        OR wt.acted_by = $3
                    )
                `;
                workflowTaskScopeParams = [req.user.role_name, effectiveDealerId || null, req.user.id];
            }
        }
        const workflowTasksResult = wantsGroup('workflowTasks') && canViewWorkflowTasks
            ? await pool.query(
                `
                SELECT
                    wt.*,
                    wd.definition_name,
                    requester.full_name AS requester_name,
                    actor.full_name AS acted_by_name,
                    d.dealer_name,
                    d.dealer_code,
                    st.sale_mode,
                    st.approval_status,
                    st.agreement_number,
                    st.agreement_date,
                    st.agreement_pdf_url,
                    st.dealer_signature_url,
                    st.purchase_date,
                    st.vehicle_price,
                    st.down_payment,
                    st.financed_amount,
                    st.monthly_installment,
                    st.installment_months,
                    st.first_due_date,
                    st.witness_name,
                    st.witness_cnic,
                    st.witness_two_name,
                    st.witness_two_cnic,
                    st.remarks,
                    st.rejection_reason,
                    c.full_name AS customer_name,
                    c.cnic_passport_number,
                    v.brand,
                    v.model,
                    v.vehicle_type,
                    v.color,
                    v.product_description,
                    v.image_url,
                    v.serial_number,
                    v.registration_number,
                    v.chassis_number,
                    v.engine_number
                FROM workflow_tasks wt
                LEFT JOIN workflow_definitions wd ON wd.id = wt.workflow_definition_id
                LEFT JOIN users requester ON requester.id = wt.created_by
                LEFT JOIN users actor ON actor.id = wt.acted_by
                LEFT JOIN dealers d ON d.id = wt.dealer_id
                LEFT JOIN sales_transactions st ON st.id = wt.entity_id AND wt.entity_type = 'SALE'
                LEFT JOIN customers c ON c.id = st.customer_id
                LEFT JOIN vehicles v ON v.id = st.vehicle_id
                ${workflowTaskScopeClause}
                ORDER BY
                    CASE WHEN UPPER(COALESCE(wt.task_status, '')) = 'PENDING' THEN 0 ELSE 1 END,
                    wt.created_at DESC
                LIMIT 200
                `,
                workflowTaskScopeParams
            )
            : { rows: [] };
        const commissionRoleJoin = isManagerLogin ? 'JOIN roles er ON er.id = e.role_id' : '';
        const commissionScopeClause = hasGlobalScope
            ? ''
            : isAgentLogin
                ? 'WHERE e.user_id = $1'
                : isManagerLogin
                    ? "WHERE e.dealer_id = $1 AND er.role_name = 'AGENT'"
                    : 'WHERE e.dealer_id = $1';
        const commissionScopeParams = hasGlobalScope ? [] : [isAgentLogin ? req.user.id : effectiveDealerId];

        const employeeCommissionsResult = wantsGroup('employeeFinancials') ? await safeDashboardQuery(
            () => pool.query(
                `
                SELECT
                    ec.*,
                    e.full_name AS employee_name,
                    st.agreement_number,
                    c.full_name AS customer_name
                FROM employee_commissions ec
                JOIN employees e ON e.id = ec.employee_id
                ${commissionRoleJoin}
                LEFT JOIN sales_transactions st ON st.id = ec.sale_id
                LEFT JOIN customers c ON c.id = st.customer_id
                ${commissionScopeClause}
                ORDER BY ec.earned_on DESC, ec.created_at DESC
                LIMIT 200
                `,
                commissionScopeParams
            ),
            'employee commissions query',
            []
        ) : { rows: [] };
        const advanceRoleJoin = isManagerLogin ? 'JOIN roles er ON er.id = e.role_id' : '';
        const advanceScopeClause = hasGlobalScope
            ? ''
            : isAgentLogin
                ? 'WHERE e.user_id = $1'
                : isManagerLogin
                    ? "WHERE e.dealer_id = $1 AND er.role_name = 'AGENT'"
                    : 'WHERE e.dealer_id = $1';
        const advanceScopeParams = hasGlobalScope ? [] : [isAgentLogin ? req.user.id : effectiveDealerId];

        const employeeAdvancesResult = wantsGroup('employeeFinancials') ? await safeDashboardQuery(
            () => pool.query(
                `
                SELECT
                    esa.*,
                    e.full_name AS employee_name
                FROM employee_salary_advances esa
                JOIN employees e ON e.id = esa.employee_id
                ${advanceRoleJoin}
                ${advanceScopeClause}
                ORDER BY esa.advance_date DESC, esa.created_at DESC
                LIMIT 200
                `,
                advanceScopeParams
            ),
            'employee advances query',
            []
        ) : { rows: [] };
        const payrollRoleJoin = isManagerLogin ? 'JOIN roles er ON er.id = e.role_id' : '';
        const payrollScopeClause = hasGlobalScope
            ? ''
            : isAgentLogin
                ? 'WHERE e.user_id = $1'
                : isManagerLogin
                    ? "WHERE e.dealer_id = $1 AND er.role_name = 'AGENT'"
                    : 'WHERE e.dealer_id = $1';
        const payrollScopeParams = hasGlobalScope ? [] : [isAgentLogin ? req.user.id : effectiveDealerId];

        const employeePayrollsResult = wantsGroup('employeeFinancials') ? await safeDashboardQuery(
            () => pool.query(
                `
                SELECT
                    ep.*,
                    e.full_name AS employee_name
                FROM employee_payrolls ep
                JOIN employees e ON e.id = ep.employee_id
                ${payrollRoleJoin}
                ${payrollScopeClause}
                ORDER BY ep.payroll_month DESC, ep.created_at DESC
                LIMIT 200
                `,
                payrollScopeParams
            ),
            'employee payrolls query',
            []
        ) : { rows: [] };
        const dealersResult = wantsGroup('dealers') ? await pool.query(
            `
            SELECT
                d.id,
                d.dealer_code,
                d.dealer_name,
                d.theme_key,
                d.dealer_logo_url,
                d.dealer_address,
                d.dealer_cnic,
                d.mobile_country,
                d.mobile_country_code,
                d.mobile_number,
                d.currency_code,
                d.contact_email,
                d.notes,
                d.app_status,
                d.is_active,
                d.created_at,
                d.updated_at,
                u.full_name AS created_by_name,
                admin_user.full_name AS admin_full_name,
                admin_user.email AS admin_email
            FROM dealers d
            LEFT JOIN users u ON u.id = d.created_by
            LEFT JOIN users admin_user ON admin_user.id = d.admin_user_id
            ORDER BY d.created_at DESC, d.dealer_name ASC
            LIMIT 50
            `
        ) : { rows: [] };
        const vehicleTypesResult = wantsGroup('vehicleTypes') ? await pool.query(
            `
            SELECT id, type_key, display_name, is_active, sort_order
            FROM vehicle_types
            WHERE is_active = TRUE
            ORDER BY sort_order ASC, display_name ASC
            `
        ) : { rows: [] };
        const rolePermissions = wantsGroup('rolePermissions') ? await getRolePermissions() : [];
        const stockOrdersResult = wantsGroup('stockOrders') && (!hasDealerDataScope || dealerScopeColumnsReady) ? await safeDashboardQuery(
            () => pool.query(
            `
            SELECT
                so.*,
                cp.company_name AS profile_company_name,
                cp.company_email AS profile_company_email,
                pc.image_url AS product_image_url,
                pc.monthly_rate AS product_monthly_rate,
                pc.purchase_price AS product_purchase_price,
                pc.color AS product_color,
                pc.serial_number AS product_serial_number,
                pc.description AS product_description,
                u.full_name AS ordered_by_name,
                d.id AS dealer_id,
                d.dealer_name,
                d.dealer_code
            FROM stock_orders so
            LEFT JOIN company_profiles cp ON cp.id = so.company_profile_id
            LEFT JOIN product_catalog pc ON pc.id = so.product_id
            JOIN users u ON u.id = so.ordered_by
            LEFT JOIN dealers d ON d.id = u.dealer_id
            ${hasDealerDataScope ? 'WHERE d.id = $1' : ''}
            ORDER BY so.created_at DESC
            LIMIT 300
            `,
            hasDealerDataScope ? [effectiveDealerId] : []
            ),
            'stock orders query',
            []
        ) : { rows: [] };
        const adsScopeClause = effectiveDealerId ? 'AND (dealer_id = $1 OR dealer_id IS NULL)' : '';
        const adsScopeParams = effectiveDealerId ? [effectiveDealerId] : [];
        let adsResult = { rows: [] };
        if (wantsGroup('ads')) try {
            adsResult = await pool.query(
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
                    is_active,
                    start_at,
                    end_at
                FROM app_ads
                WHERE is_active = TRUE
                  AND (start_at IS NULL OR start_at <= NOW())
                  AND (end_at IS NULL OR end_at >= NOW())
                  ${adsScopeClause}
                ORDER BY display_order ASC, created_at DESC
                `,
                adsScopeParams
            );
        } catch (adsError) {
            console.warn('Dashboard ads fallback:', adsError.message);
        }
        const salesResult = wantsGroup('salesTransactions') && canViewSalesTransactions
            ? await safeDashboardQuery(
                () => pool.query(
                `
                SELECT
                    st.id,
                    st.customer_id,
                    st.vehicle_id,
                    st.sale_mode,
                    st.approval_status,
                    st.agreement_number,
                    st.agreement_date,
                    st.agreement_pdf_url,
                    st.dealer_signature_url,
                    st.authorized_signature_url,
                    st.customer_cnic_front_url,
                    st.customer_cnic_back_url,
                    st.bank_check_url,
                    st.misc_document_url,
                    st.purchase_date,
                    st.vehicle_price,
                    st.down_payment,
                    st.financed_amount,
                    st.monthly_installment,
                    st.installment_months,
                    st.first_due_date,
                    st.witness_name,
                    st.witness_cnic,
                    st.witness_two_name,
                    st.witness_two_cnic,
                    st.remarks,
                    st.status,
                    st.created_at,
                    c.full_name AS customer_name,
                    c.cnic_passport_number,
                    c.identity_doc_url AS customer_identity_doc_url,
                    c.ocr_details AS customer_ocr_details,
                    COALESCE(c.ocr_details->'fingerprint'->>'thumb_image_url', '') AS customer_fingerprint_thumb_url,
                    v.brand,
                    v.model,
                    v.image_url,
                    v.vehicle_type,
                    v.serial_number,
                    v.registration_number,
                    v.chassis_number,
                    v.engine_number,
                    v.color,
                    v.product_description,
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
                LEFT JOIN dealers d ON d.id = COALESCE(st.dealer_id, c.dealer_id, u.dealer_id)
                LEFT JOIN sale_installments si ON si.sale_id = st.id
                ${isEmployeeLogin ? 'WHERE st.agent_id = $1' : isDealerScopedView ? 'WHERE d.id = $1' : ''}
                GROUP BY
                    st.id,
                    st.customer_id,
                    st.vehicle_id,
                    st.sale_mode,
                    st.approval_status,
                    st.agreement_number,
                    st.agreement_date,
                    st.agreement_pdf_url,
                    st.dealer_signature_url,
                    st.authorized_signature_url,
                    st.customer_cnic_front_url,
                    st.customer_cnic_back_url,
                    st.bank_check_url,
                    st.misc_document_url,
                    st.purchase_date,
                    st.vehicle_price,
                    st.down_payment,
                    st.financed_amount,
                    st.monthly_installment,
                    st.installment_months,
                    st.first_due_date,
                    st.witness_name,
                    st.witness_cnic,
                    st.witness_two_name,
                    st.witness_two_cnic,
                    st.remarks,
                    st.status,
                    st.created_at,
                    c.full_name,
                    c.cnic_passport_number,
                    c.identity_doc_url,
                    c.ocr_details,
                    v.brand,
                    v.model,
                    v.image_url,
                    v.vehicle_type,
                    v.serial_number,
                    v.registration_number,
                    v.chassis_number,
                    v.engine_number,
                    v.color,
                    v.product_description,
                    v.purchase_price,
                    u.full_name,
                    d.id,
                    d.dealer_name,
                    d.dealer_code,
                    d.dealer_signature_url
                ORDER BY st.created_at DESC
                LIMIT 300
                `,
                isEmployeeLogin || isDealerScopedView ? [isEmployeeLogin ? req.user.id : effectiveDealerId] : []
                ),
                'sales transactions query',
                []
            )
            : { rows: [] };

        const metrics = {
                activeLeases: Number(settledLeaseMetricsResult.rows[0].settled_leases || 0),
                pendingLeases: Number(settledLeaseMetricsResult.rows[0].pending_leases || 0),
                pendingTasks: Number(leaseMetricsResult.rows[0].pending_applications || 0),
            totalRevenue: Number(leaseMetricsResult.rows[0].total_revenue || 0) + Number(salesMetricsResult.rows[0].total_sales_revenue || 0),
            totalVehicles: metricsResult.rows[0].total_vehicles,
            availableVehicles: metricsResult.rows[0].available_vehicles,
            totalApplications: Number(leaseMetricsResult.rows[0].total_applications || 0),
            totalCustomers: customerMetricsResult.rows[0].total_customers,
            scannedDocuments: customerMetricsResult.rows[0].scanned_documents,
            enrolledBiometrics: customerMetricsResult.rows[0].enrolled_biometrics,
            totalEmployees: employeeMetricsResult.rows[0].total_employees,
            activeEmployees: employeeMetricsResult.rows[0].active_employees,
            totalDealers: dealerMetricsResult.rows[0].total_dealers,
            activeDealers: dealerMetricsResult.rows[0].active_dealers,
        };

        const employeeSales = {
            receivedCount: employeeSalesResult.rows[0].received_count,
            pendingCount: employeeSalesResult.rows[0].pending_count,
            receivedValue: Number(employeeSalesResult.rows[0].received_value || 0),
            pendingValue: Number(employeeSalesResult.rows[0].pending_value || 0),
            overdueFollowups: employeeSalesResult.rows[0].overdue_followups,
            scope: isEmployeeLogin ? 'personal' : 'all',
        };

        res.status(200).json({
            user: userResult.rows[0],
            metrics,
            employeeSales,
            applications: applicationsResult.rows,
            products: productsResult.rows,
            companies: companiesResult.rows,
            inventory: inventoryResult.rows,
            customers: customersResult.rows,
            employees: employeesResult.rows,
            dealerStaff: dealerStaffResult.rows,
            roles: rolesResult.rows,
            features: featuresResult.rows,
            dealers: dealersResult.rows,
            vehicleTypes: vehicleTypesResult.rows,
            rolePermissions,
            workflowDefinitions: workflowDefinitionsResult.rows,
            workflowTasks: workflowTasksResult.rows,
            employeeCommissions: employeeCommissionsResult.rows,
            employeeAdvances: employeeAdvancesResult.rows,
            employeePayrolls: employeePayrollsResult.rows,
            salesTransactions: salesResult.rows,
            stockOrders: stockOrdersResult.rows,
            ads: adsResult.rows,
            notificationReadKeys: notificationReadsResult.rows.map((row) => row.notification_key),
        });
    } catch (error) {
        console.error('Dashboard data error:', error.message);
        console.error(error.stack);
        res.status(500).json({ message: 'Failed to load dashboard data', error: error.message });
    }
};

exports.markNotificationsRead = async (req, res) => {
    try {
        const notificationKeys = [...new Set((req.body.notification_keys || [])
            .map((value) => String(value || '').trim())
            .filter(Boolean))];

        if (notificationKeys.length === 0) {
            return res.status(200).json({ message: 'No notifications selected.', notificationReadKeys: [] });
        }

        const userId = getNotificationReaderUserId(req.user);
        const values = [];
        const placeholders = notificationKeys.map((key, index) => {
            values.push(userId, key);
            const offset = index * 2;
            return `($${offset + 1}, $${offset + 2}, NOW())`;
        });

        await pool.query(
            `
            INSERT INTO notification_reads (user_id, notification_key, read_at)
            VALUES ${placeholders.join(', ')}
            ON CONFLICT (user_id, notification_key)
            DO UPDATE SET read_at = EXCLUDED.read_at
            `,
            values
        );

        const notificationReadsResult = await pool.query(
            `
            SELECT notification_key
            FROM notification_reads
            WHERE user_id = $1
            ORDER BY read_at DESC
            `,
            [userId]
        );

        return res.status(200).json({
            message: 'Notifications marked as read.',
            notificationReadKeys: notificationReadsResult.rows.map((row) => row.notification_key),
        });
    } catch (error) {
        console.error('Mark notifications read error:', error.message);
        return res.status(500).json({ message: 'Failed to mark notifications as read.', error: error.message });
    }
};

exports.updateRolePermissions = async (req, res) => {
    const client = await pool.connect();

    try {
        const roleId = Number(req.params.roleId);
        const featureIds = [...new Set((req.body.feature_ids || []).map(Number).filter(Boolean))];

        await client.query('BEGIN');
        await client.query('DELETE FROM role_permissions WHERE role_id = $1', [roleId]);

        for (const featureId of featureIds) {
            await client.query(
                'INSERT INTO role_permissions (role_id, feature_id) VALUES ($1, $2)',
                [roleId, featureId]
            );
        }

        await client.query('COMMIT');

        const rolePermissions = await getRolePermissions();
        res.status(200).json({ message: 'Role permissions updated', rolePermissions });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Failed to update role permissions', error: error.message });
    } finally {
        client.release();
    }
};
