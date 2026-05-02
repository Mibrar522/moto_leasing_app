const pool = require('../config/db');

const ROLE_NAMES = ['SUPER_ADMIN', 'APPLICATION_ADMIN', 'MANAGER', 'AGENT'];

const FEATURE_DEFINITIONS = [
    ['FEAT_DASHBOARD_VIEW', 'View Dashboard'],
    ['FEAT_THEME_MGMT', 'Manage Application Themes'],
    ['FEAT_PROFILE_SWITCH', 'Switch Working Profile'],
    ['FEAT_APPLICATIONS_VIEW', 'View Applications'],
    ['FEAT_WORKFLOW_VIEW', 'View Workflow'],
    ['FEAT_CUSTOMER_MGMT', 'Manage Customers'],
    ['FEAT_CUSTOMER_BIOMETRIC', 'Create Customer Biometric'],
    ['FEAT_OCR_SCAN', 'CNIC and Passport Scanning'],
    ['FEAT_BIOMETRIC', 'Biometric Verification'],
    ['FEAT_PRODUCT_MGMT', 'Manage Products and Vehicles'],
    ['FEAT_FLEET_MGMT', 'Manage Fleet Inventory'],
    ['FEAT_STOCK_MGMT', 'Manage Stock Orders'],
    ['FEAT_SALES_CREATE', 'Create Sales Transactions'],
    ['FEAT_SALES_MGMT', 'Manage Sales Transactions'],
    ['FEAT_INSTALLMENT_MGMT', 'Manage Installments'],
    ['FEAT_INSTALLMENT_COMMISSION', 'Apply Installment Receipt Commission'],
    ['FEAT_DEALER_MGMT', 'Manage Dealer Applications'],
    ['FEAT_USER_MGMT', 'Manage Users and Roles'],
    ['FEAT_ACCESS_CONTROL', 'Manage Access Control'],
    ['FEAT_DASHBOARD_ACCESS_PROFILE', 'Dashboard: Access Profile'],
    ['FEAT_DASHBOARD_CARD_ACTIVE_LEASES', 'Dashboard Card: Total Settled Leases'],
    ['FEAT_DASHBOARD_CARD_PENDING_LEASES', 'Dashboard Card: Total Customer Pending Lease'],
    ['FEAT_DASHBOARD_CARD_PENDING_TASKS', 'Dashboard Card: Total Pending Tasks'],
    ['FEAT_DASHBOARD_CARD_TOTAL_REVENUE', 'Dashboard Card: Total Revenue'],
    ['FEAT_DASHBOARD_CARD_EMPLOYEE_COMMISSIONS', 'Dashboard Card: Total Employee Commissions'],
    ['FEAT_DASHBOARD_CARD_TOTAL_VEHICLES', 'Dashboard Card: Total Vehicles'],
    ['FEAT_DASHBOARD_CARD_TOTAL_CUSTOMERS', 'Dashboard Card: Total Customers'],
    ['FEAT_DASHBOARD_CARD_TOTAL_EMPLOYEES', 'Dashboard Card: Total Employees'],
    ['FEAT_DASHBOARD_CARD_ACTIVE_EMPLOYEES', 'Dashboard Card: Total Active Employees'],
    ['FEAT_DASHBOARD_CARD_TOTAL_DEALERS', 'Dashboard Card: Total Dealers'],
    ['FEAT_DASHBOARD_CARD_ACTIVE_DEALERS', 'Dashboard Card: Total Active Dealers'],
    ['FEAT_DASHBOARD_CARD_SCANNED_DOCUMENTS', 'Dashboard Card: Total Scanned Documents'],
    ['FEAT_DASHBOARD_CARD_ENROLLED_BIOMETRICS', 'Dashboard Card: Total Enrolled Biometrics'],
    ['FEAT_DASHBOARD_CARD_TOTAL_APPLICATIONS', 'Dashboard Card: Total Customer Leasing Applications'],
    ['FEAT_DASHBOARD_CARD_CASH_TRANSACTIONS', 'Dashboard Card: Total Cash Transactions'],
    ['FEAT_DASHBOARD_CARD_INSTALLMENT_TRANSACTIONS', 'Dashboard Card: Total Installment Transactions'],
    ['FEAT_DASHBOARD_CARD_RECEIVED_INSTALLMENTS', 'Dashboard Card: Total Received Installments'],
    ['FEAT_DASHBOARD_SALES_PERFORMANCE', 'Dashboard: Sales Performance'],
    ['FEAT_DASHBOARD_PROFIT_TRANSACTIONS', 'Dashboard: Recent Profit Transactions'],
    ['FEAT_DASHBOARD_COMPANY_PROFITABILITY', 'Dashboard: Company Business Profitability'],
    ['FEAT_DASHBOARD_RECENT_APPLICATIONS', 'Dashboard: Recent Applications'],
    ['FEAT_DASHBOARD_RECENT_EMPLOYEES', 'Dashboard: Recent Employees'],
    ['FEAT_ADS_MGMT', 'Manage App Advertisements'],
    ['FEAT_APPLICATIONS_LIST', 'Applications: Applications List'],
    ['FEAT_WORKFLOW_TASKS', 'Workflow: User Tasks'],
    ['FEAT_WORKFLOW_CONFIG', 'Workflow: Configure Approval Flow'],
    ['FEAT_PRODUCT_FORM', 'Products: Product Master Form'],
    ['FEAT_PRODUCT_TYPE_MGMT', 'Products: Vehicle Type Master'],
    ['FEAT_PRODUCT_REGISTER', 'Products: Product Master Register'],
    ['FEAT_COMPANY_FORM', 'Company Profile: Company Form'],
    ['FEAT_COMPANY_DIRECTORY', 'Company Profile: Company Directory'],
    ['FEAT_SALES_AGREEMENT_FORM', 'Sales: Vehicle Agreement Creation'],
    ['FEAT_SALES_AGREEMENT_SUMMARY', 'Sales: Agreement Summary'],
    ['FEAT_SALES_INSTALLMENT_PREVIEW', 'Sales: Installment Preview'],
    ['FEAT_SALES_REGISTER', 'Sales: Sales Transaction Register'],
    ['FEAT_TRANSACTION_REGISTER', 'Transactions: Transaction Register'],
    ['FEAT_STOCK_ORDER_FORM', 'Stock: Order Stock'],
    ['FEAT_STOCK_RECEIVED_VIEW', 'Stock: Stock Received From Company'],
    ['FEAT_STOCK_REGISTER', 'Stock: Stock Ordering Register'],
    ['FEAT_INSTALLMENT_OVERVIEW', 'Installments: Installment Overview'],
    ['FEAT_INSTALLMENT_COLLECTION', 'Installments: Monthly Installment Collection'],
['FEAT_CUSTOMER_FORM', 'Customers: Customer Intake Form'],
['FEAT_CUSTOMER_FINGERPRINT', 'Customers: Fingerprint Intake'],
['FEAT_CUSTOMER_REGISTER', 'Customers: Customer Registry'],
['FEAT_CUSTOMER_RECORD_VIEW', 'Customers: View Customer Record'],
['FEAT_CUSTOMER_RECORD_EDIT', 'Customers: Edit Customer Record'],
['FEAT_CUSTOMER_RECORD_DELETE', 'Customers: Delete Customer Record'],
['FEAT_CUSTOMER_OWNERSHIP_UNLOCK', 'Customers: Unlock Assigned Dealer and Created By'],
['FEAT_EMPLOYEE_FORM', 'Employees: Employee Form'],
['FEAT_EMPLOYEE_EDIT', 'Employees: Edit Employee'],
['FEAT_EMPLOYEE_SECURITY_UNLOCK', 'Employees: Unlock Dealer, Role, and Status'],
['FEAT_EMPLOYEE_ROLE_FEATURES_DISPLAY', 'Employees: Role and Features Display'],
    ['FEAT_EMPLOYEE_EXTRA_FEATURES', 'Employees: Extra Feature Access'],
    ['FEAT_EMPLOYEE_ADVANCE_CASH', 'Employees: Advance Cash'],
    ['FEAT_EMPLOYEE_SALARY_GENERATION', 'Employees: Monthly Salary Generation'],
    ['FEAT_EMPLOYEE_DIRECTORY', 'Employees: Employee Directory'],
    ['FEAT_EMPLOYEE_COMMISSION_LEDGER', 'Employees: Commission Ledger'],
    ['FEAT_EMPLOYEE_SALARY_RECORD', 'Employees: Salary Record'],
    ['FEAT_EMPLOYEE_ADVANCE_HISTORY', 'Employees: Advance History'],
    ['FEAT_EMPLOYEE_GENERATED_SALARIES', 'Employees: Generated Salaries'],
    ['FEAT_DEALER_FORM', 'Dealers: Dealer Form'],
    ['FEAT_DEALER_SUMMARY', 'Dealers: Fresh Start Summary'],
    ['FEAT_DEALER_DIRECTORY', 'Dealers: Dealer Directory'],
    ['FEAT_REPORT_STOCK_INVENTORY', 'Reports: Stock Inventory Report'],
    ['FEAT_REPORT_DAILY_SALES', 'Reports: Daily Transactions Sale Report'],
    ['FEAT_REPORT_STOCK_RECEIVED', 'Reports: Daily Transactions Stock Received'],
    ['FEAT_REPORT_CUSTOMERS', 'Reports: Customer Report'],
    ['FEAT_REPORT_CUSTOMER_TRANSACTIONS', 'Reports: Customer Transaction Report'],
    ['FEAT_REPORT_BUSINESS_TRANSACTIONS', 'Reports: Business Transaction Report'],
    ['FEAT_REPORT_INVOICE_VIEW', 'Reports: Invoice View Report'],
    ['FEAT_REPORT_EMPLOYEES', 'Reports: Employees Report'],
    ['FEAT_REPORT_SALARY', 'Reports: Salary Report'],
    ['FEAT_REPORT_DEALER_INFORMATION', 'Reports: Dealer Information Report'],
    ['FEAT_REPORT_DEALER_EMPLOYEES', 'Reports: Dealer Wise Employee Report'],
];

const SUPER_ADMIN_FEATURES = FEATURE_DEFINITIONS
    .map(([featureKey]) => featureKey)
    .filter((featureKey) => !['FEAT_EMPLOYEE_SECURITY_UNLOCK', 'FEAT_CUSTOMER_OWNERSHIP_UNLOCK'].includes(featureKey));
const APPLICATION_ADMIN_FEATURES = [
    'FEAT_DASHBOARD_VIEW',
    'FEAT_THEME_MGMT',
    'FEAT_ADS_MGMT',
    'FEAT_APPLICATIONS_VIEW',
    'FEAT_WORKFLOW_VIEW',
    'FEAT_CUSTOMER_MGMT',
    'FEAT_CUSTOMER_BIOMETRIC',
    'FEAT_OCR_SCAN',
    'FEAT_BIOMETRIC',
    'FEAT_PRODUCT_MGMT',
    'FEAT_FLEET_MGMT',
    'FEAT_STOCK_MGMT',
    'FEAT_SALES_CREATE',
    'FEAT_SALES_MGMT',
    'FEAT_INSTALLMENT_MGMT',
    'FEAT_INSTALLMENT_COMMISSION',
    'FEAT_USER_MGMT',
    'FEAT_ACCESS_CONTROL',
    'FEAT_DASHBOARD_ACCESS_PROFILE',
    'FEAT_DASHBOARD_CARD_ACTIVE_LEASES',
    'FEAT_DASHBOARD_CARD_PENDING_LEASES',
    'FEAT_DASHBOARD_CARD_PENDING_TASKS',
    'FEAT_DASHBOARD_CARD_TOTAL_REVENUE',
    'FEAT_DASHBOARD_CARD_EMPLOYEE_COMMISSIONS',
    'FEAT_DASHBOARD_CARD_TOTAL_VEHICLES',
    'FEAT_DASHBOARD_CARD_TOTAL_CUSTOMERS',
    'FEAT_DASHBOARD_CARD_TOTAL_EMPLOYEES',
    'FEAT_DASHBOARD_CARD_ACTIVE_EMPLOYEES',
    'FEAT_DASHBOARD_CARD_TOTAL_DEALERS',
    'FEAT_DASHBOARD_CARD_ACTIVE_DEALERS',
    'FEAT_DASHBOARD_CARD_SCANNED_DOCUMENTS',
    'FEAT_DASHBOARD_CARD_ENROLLED_BIOMETRICS',
    'FEAT_DASHBOARD_CARD_TOTAL_APPLICATIONS',
    'FEAT_DASHBOARD_CARD_CASH_TRANSACTIONS',
    'FEAT_DASHBOARD_CARD_INSTALLMENT_TRANSACTIONS',
    'FEAT_DASHBOARD_CARD_RECEIVED_INSTALLMENTS',
    'FEAT_DASHBOARD_SALES_PERFORMANCE',
    'FEAT_DASHBOARD_PROFIT_TRANSACTIONS',
    'FEAT_DASHBOARD_COMPANY_PROFITABILITY',
    'FEAT_DASHBOARD_RECENT_APPLICATIONS',
    'FEAT_DASHBOARD_RECENT_EMPLOYEES',
    'FEAT_APPLICATIONS_LIST',
    'FEAT_WORKFLOW_TASKS',
    'FEAT_WORKFLOW_CONFIG',
    'FEAT_PRODUCT_FORM',
    'FEAT_PRODUCT_TYPE_MGMT',
    'FEAT_PRODUCT_REGISTER',
    'FEAT_COMPANY_FORM',
    'FEAT_COMPANY_DIRECTORY',
    'FEAT_SALES_AGREEMENT_FORM',
    'FEAT_SALES_AGREEMENT_SUMMARY',
    'FEAT_SALES_INSTALLMENT_PREVIEW',
    'FEAT_SALES_REGISTER',
    'FEAT_TRANSACTION_REGISTER',
    'FEAT_STOCK_ORDER_FORM',
    'FEAT_STOCK_RECEIVED_VIEW',
    'FEAT_STOCK_REGISTER',
    'FEAT_INSTALLMENT_OVERVIEW',
    'FEAT_INSTALLMENT_COLLECTION',
    'FEAT_CUSTOMER_FORM',
    'FEAT_CUSTOMER_FINGERPRINT',
    'FEAT_CUSTOMER_REGISTER',
    'FEAT_CUSTOMER_RECORD_VIEW',
    'FEAT_CUSTOMER_RECORD_EDIT',
    'FEAT_CUSTOMER_RECORD_DELETE',
    'FEAT_EMPLOYEE_FORM',
    'FEAT_EMPLOYEE_ROLE_FEATURES_DISPLAY',
    'FEAT_EMPLOYEE_EXTRA_FEATURES',
    'FEAT_EMPLOYEE_ADVANCE_CASH',
    'FEAT_EMPLOYEE_SALARY_GENERATION',
    'FEAT_EMPLOYEE_DIRECTORY',
    'FEAT_EMPLOYEE_COMMISSION_LEDGER',
    'FEAT_EMPLOYEE_SALARY_RECORD',
    'FEAT_EMPLOYEE_ADVANCE_HISTORY',
    'FEAT_EMPLOYEE_GENERATED_SALARIES',
    'FEAT_DEALER_FORM',
    'FEAT_DEALER_SUMMARY',
    'FEAT_DEALER_DIRECTORY',
    'FEAT_REPORT_STOCK_INVENTORY',
    'FEAT_REPORT_DAILY_SALES',
    'FEAT_REPORT_STOCK_RECEIVED',
    'FEAT_REPORT_CUSTOMERS',
    'FEAT_REPORT_CUSTOMER_TRANSACTIONS',
    'FEAT_REPORT_BUSINESS_TRANSACTIONS',
    'FEAT_REPORT_INVOICE_VIEW',
    'FEAT_REPORT_EMPLOYEES',
    'FEAT_REPORT_SALARY',
    'FEAT_REPORT_DEALER_INFORMATION',
    'FEAT_REPORT_DEALER_EMPLOYEES',
];
const MANAGER_FEATURES = [
    'FEAT_DASHBOARD_VIEW',
    'FEAT_ADS_MGMT',
    'FEAT_APPLICATIONS_VIEW',
    'FEAT_WORKFLOW_VIEW',
    'FEAT_CUSTOMER_MGMT',
    'FEAT_CUSTOMER_BIOMETRIC',
    'FEAT_OCR_SCAN',
    'FEAT_BIOMETRIC',
    'FEAT_PRODUCT_MGMT',
    'FEAT_FLEET_MGMT',
    'FEAT_STOCK_MGMT',
    'FEAT_SALES_CREATE',
    'FEAT_SALES_MGMT',
    'FEAT_INSTALLMENT_MGMT',
    'FEAT_INSTALLMENT_COMMISSION',
    'FEAT_DASHBOARD_ACCESS_PROFILE',
    'FEAT_DASHBOARD_CARD_ACTIVE_LEASES',
    'FEAT_DASHBOARD_CARD_PENDING_LEASES',
    'FEAT_DASHBOARD_CARD_PENDING_TASKS',
    'FEAT_DASHBOARD_CARD_TOTAL_REVENUE',
    'FEAT_DASHBOARD_CARD_EMPLOYEE_COMMISSIONS',
    'FEAT_DASHBOARD_CARD_TOTAL_VEHICLES',
    'FEAT_DASHBOARD_CARD_TOTAL_CUSTOMERS',
    'FEAT_DASHBOARD_CARD_TOTAL_EMPLOYEES',
    'FEAT_DASHBOARD_CARD_ACTIVE_EMPLOYEES',
    'FEAT_DASHBOARD_CARD_TOTAL_DEALERS',
    'FEAT_DASHBOARD_CARD_ACTIVE_DEALERS',
    'FEAT_DASHBOARD_CARD_SCANNED_DOCUMENTS',
    'FEAT_DASHBOARD_CARD_ENROLLED_BIOMETRICS',
    'FEAT_DASHBOARD_CARD_TOTAL_APPLICATIONS',
    'FEAT_DASHBOARD_CARD_CASH_TRANSACTIONS',
    'FEAT_DASHBOARD_CARD_INSTALLMENT_TRANSACTIONS',
    'FEAT_DASHBOARD_CARD_RECEIVED_INSTALLMENTS',
    'FEAT_DASHBOARD_SALES_PERFORMANCE',
    'FEAT_DASHBOARD_PROFIT_TRANSACTIONS',
    'FEAT_DASHBOARD_COMPANY_PROFITABILITY',
    'FEAT_DASHBOARD_RECENT_APPLICATIONS',
    'FEAT_DASHBOARD_RECENT_EMPLOYEES',
    'FEAT_APPLICATIONS_LIST',
    'FEAT_WORKFLOW_TASKS',
    'FEAT_WORKFLOW_CONFIG',
    'FEAT_PRODUCT_FORM',
    'FEAT_PRODUCT_TYPE_MGMT',
    'FEAT_PRODUCT_REGISTER',
    'FEAT_COMPANY_FORM',
    'FEAT_COMPANY_DIRECTORY',
    'FEAT_SALES_AGREEMENT_FORM',
    'FEAT_SALES_AGREEMENT_SUMMARY',
    'FEAT_SALES_INSTALLMENT_PREVIEW',
    'FEAT_SALES_REGISTER',
    'FEAT_TRANSACTION_REGISTER',
    'FEAT_STOCK_ORDER_FORM',
    'FEAT_STOCK_RECEIVED_VIEW',
    'FEAT_STOCK_REGISTER',
    'FEAT_INSTALLMENT_OVERVIEW',
    'FEAT_INSTALLMENT_COLLECTION',
    'FEAT_CUSTOMER_FORM',
    'FEAT_CUSTOMER_FINGERPRINT',
    'FEAT_CUSTOMER_REGISTER',
    'FEAT_CUSTOMER_RECORD_VIEW',
    'FEAT_CUSTOMER_RECORD_EDIT',
    'FEAT_CUSTOMER_RECORD_DELETE',
    'FEAT_REPORT_STOCK_INVENTORY',
    'FEAT_REPORT_DAILY_SALES',
    'FEAT_REPORT_STOCK_RECEIVED',
    'FEAT_REPORT_CUSTOMERS',
    'FEAT_REPORT_CUSTOMER_TRANSACTIONS',
    'FEAT_REPORT_BUSINESS_TRANSACTIONS',
    'FEAT_REPORT_INVOICE_VIEW',
    'FEAT_REPORT_EMPLOYEES',
    'FEAT_REPORT_SALARY',
    'FEAT_REPORT_DEALER_INFORMATION',
    'FEAT_REPORT_DEALER_EMPLOYEES',
];
const AGENT_FEATURES = [
    'FEAT_DASHBOARD_VIEW',
    'FEAT_APPLICATIONS_VIEW',
    'FEAT_WORKFLOW_VIEW',
    'FEAT_CUSTOMER_MGMT',
    'FEAT_CUSTOMER_BIOMETRIC',
    'FEAT_OCR_SCAN',
    'FEAT_BIOMETRIC',
    'FEAT_SALES_CREATE',
    'FEAT_SALES_MGMT',
    'FEAT_INSTALLMENT_MGMT',
    'FEAT_INSTALLMENT_COMMISSION',
    'FEAT_DASHBOARD_ACCESS_PROFILE',
    'FEAT_DASHBOARD_CARD_ACTIVE_LEASES',
    'FEAT_DASHBOARD_CARD_PENDING_LEASES',
    'FEAT_DASHBOARD_CARD_PENDING_TASKS',
    'FEAT_DASHBOARD_CARD_TOTAL_REVENUE',
    'FEAT_DASHBOARD_CARD_EMPLOYEE_COMMISSIONS',
    'FEAT_DASHBOARD_CARD_TOTAL_VEHICLES',
    'FEAT_DASHBOARD_CARD_TOTAL_CUSTOMERS',
    'FEAT_DASHBOARD_CARD_TOTAL_EMPLOYEES',
    'FEAT_DASHBOARD_CARD_ACTIVE_EMPLOYEES',
    'FEAT_DASHBOARD_CARD_TOTAL_DEALERS',
    'FEAT_DASHBOARD_CARD_ACTIVE_DEALERS',
    'FEAT_DASHBOARD_CARD_SCANNED_DOCUMENTS',
    'FEAT_DASHBOARD_CARD_ENROLLED_BIOMETRICS',
    'FEAT_DASHBOARD_CARD_TOTAL_APPLICATIONS',
    'FEAT_DASHBOARD_CARD_CASH_TRANSACTIONS',
    'FEAT_DASHBOARD_CARD_INSTALLMENT_TRANSACTIONS',
    'FEAT_DASHBOARD_CARD_RECEIVED_INSTALLMENTS',
    'FEAT_DASHBOARD_SALES_PERFORMANCE',
    'FEAT_DASHBOARD_PROFIT_TRANSACTIONS',
    'FEAT_DASHBOARD_RECENT_APPLICATIONS',
    'FEAT_APPLICATIONS_LIST',
    'FEAT_WORKFLOW_TASKS',
    'FEAT_WORKFLOW_CONFIG',
    'FEAT_SALES_AGREEMENT_FORM',
    'FEAT_SALES_AGREEMENT_SUMMARY',
    'FEAT_SALES_INSTALLMENT_PREVIEW',
    'FEAT_SALES_REGISTER',
    'FEAT_TRANSACTION_REGISTER',
    'FEAT_INSTALLMENT_OVERVIEW',
    'FEAT_INSTALLMENT_COLLECTION',
    'FEAT_CUSTOMER_FORM',
    'FEAT_CUSTOMER_FINGERPRINT',
    'FEAT_CUSTOMER_REGISTER',
    'FEAT_CUSTOMER_RECORD_VIEW',
    'FEAT_CUSTOMER_RECORD_EDIT',
    'FEAT_CUSTOMER_RECORD_DELETE',
    'FEAT_REPORT_DAILY_SALES',
    'FEAT_REPORT_CUSTOMERS',
    'FEAT_REPORT_CUSTOMER_TRANSACTIONS',
    'FEAT_REPORT_INVOICE_VIEW',
];

const ensureRole = async (client, roleName) => {
    await client.query(
        `
        INSERT INTO roles (role_name)
        SELECT $1::varchar
        WHERE NOT EXISTS (
            SELECT 1
            FROM roles
            WHERE role_name = $1::varchar
        )
        `,
        [roleName]
    );
};

const ensureFeature = async (client, featureKey, displayName) => {
    await client.query(
        `
        INSERT INTO features (feature_key, display_name)
        SELECT $1::varchar, $2::varchar
        WHERE NOT EXISTS (
            SELECT 1
            FROM features
            WHERE feature_key = $1::varchar
        )
        `,
        [featureKey, displayName]
    );

    await client.query(
        'UPDATE features SET display_name = $2 WHERE feature_key = $1',
        [featureKey, displayName]
    );
};

const ensureRolePermission = async (client, roleId, featureKey) => {
    await client.query(
        `
        INSERT INTO role_permissions (role_id, feature_id)
        SELECT $1, f.id
        FROM features f
        WHERE f.feature_key = $2
          AND NOT EXISTS (
              SELECT 1
              FROM role_permissions rp
              WHERE rp.role_id = $1
                AND rp.feature_id = f.id
          )
        `,
        [roleId, featureKey]
    );
};

const roleHasPermissions = async (client, roleId) => {
    const result = await client.query(
        `
        SELECT EXISTS (
            SELECT 1
            FROM role_permissions
            WHERE role_id = $1
        ) AS has_permissions
        `,
        [roleId]
    );

    return result.rows[0]?.has_permissions === true;
};

const ensureDefaultRolePermissions = async (client, roleId, featureKeys = []) => {
    if (!roleId) {
        return;
    }

    const hasPermissions = await roleHasPermissions(client, roleId);

    // Preserve access-control changes made from the admin UI.
    if (hasPermissions) {
        return;
    }

    for (const featureKey of featureKeys) {
        await ensureRolePermission(client, roleId, featureKey);
    }
};

exports.syncAccessControlDefaults = async () => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query(`
            ALTER TABLE dealers
                ADD COLUMN IF NOT EXISTS theme_key VARCHAR(40) NOT NULL DEFAULT 'sandstone',
                ADD COLUMN IF NOT EXISTS dealer_signature_url TEXT
        `);

        await client.query(`
            ALTER TABLE users
                ADD COLUMN IF NOT EXISTS brand_name VARCHAR(180),
                ADD COLUMN IF NOT EXISTS brand_logo_url TEXT,
                ADD COLUMN IF NOT EXISTS brand_address TEXT
        `);

        await client.query(`
            ALTER TABLE customers
                ADD COLUMN IF NOT EXISTS dealer_id UUID REFERENCES dealers(id) ON DELETE SET NULL
        `);

        await client.query(`
            ALTER TABLE employees
                ADD COLUMN IF NOT EXISTS cnic_number VARCHAR(80),
                ADD COLUMN IF NOT EXISTS cnic_doc_url TEXT,
                ADD COLUMN IF NOT EXISTS cnic_front_url TEXT,
                ADD COLUMN IF NOT EXISTS cnic_back_url TEXT,
                ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL
        `);

        await client.query(`
            UPDATE employees e
            SET dealer_id = u.dealer_id
            FROM users u
            WHERE e.user_id = u.id
              AND e.dealer_id IS NULL
              AND u.dealer_id IS NOT NULL
        `);

        await client.query(`
            UPDATE employees e
            SET created_by = d.admin_user_id
            FROM dealers d
            WHERE e.dealer_id = d.id
              AND e.created_by IS NULL
              AND d.admin_user_id IS NOT NULL
        `);

        await client.query(`
            UPDATE employees
            SET cnic_front_url = COALESCE(NULLIF(TRIM(cnic_front_url), ''), cnic_doc_url)
            WHERE COALESCE(NULLIF(TRIM(cnic_doc_url), ''), '') <> ''
        `);

        await client.query(`
            DELETE FROM employees
            WHERE dealer_id IS NULL
        `);

        await client.query(`
            ALTER TABLE employees
                ALTER COLUMN dealer_id SET NOT NULL
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS employee_feature_overrides (
                employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
                feature_id INTEGER NOT NULL REFERENCES features(id) ON DELETE CASCADE,
                access_mode VARCHAR(10) NOT NULL CHECK (access_mode IN ('ALLOW', 'DENY')),
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                PRIMARY KEY (employee_id, feature_id)
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS product_catalog (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                brand VARCHAR(120) NOT NULL,
                model VARCHAR(120) NOT NULL,
                serial_number VARCHAR(220),
                registration_number VARCHAR(120),
                vehicle_type VARCHAR(80) NOT NULL,
                chassis_number VARCHAR(160),
                engine_number VARCHAR(160),
                color VARCHAR(80),
                description TEXT,
                image_url TEXT NOT NULL,
                monthly_rate NUMERIC(12, 2) NOT NULL DEFAULT 0,
                purchase_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
                cash_markup_percent NUMERIC(8, 2) NOT NULL DEFAULT 0,
                cash_markup_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
                installment_markup_percent NUMERIC(8, 2) NOT NULL DEFAULT 0,
                installment_months INTEGER NOT NULL DEFAULT 12,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);

        await client.query(`
            ALTER TABLE product_catalog
                ADD COLUMN IF NOT EXISTS serial_number VARCHAR(220),
                ADD COLUMN IF NOT EXISTS registration_number VARCHAR(120),
                ADD COLUMN IF NOT EXISTS chassis_number VARCHAR(160),
                ADD COLUMN IF NOT EXISTS engine_number VARCHAR(160),
                ADD COLUMN IF NOT EXISTS color VARCHAR(80),
                ADD COLUMN IF NOT EXISTS description TEXT,
                ADD COLUMN IF NOT EXISTS monthly_rate NUMERIC(12, 2) NOT NULL DEFAULT 0,
                ADD COLUMN IF NOT EXISTS purchase_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
                ADD COLUMN IF NOT EXISTS cash_markup_percent NUMERIC(8, 2) NOT NULL DEFAULT 0,
                ADD COLUMN IF NOT EXISTS cash_markup_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
                ADD COLUMN IF NOT EXISTS installment_markup_percent NUMERIC(8, 2) NOT NULL DEFAULT 0,
                ADD COLUMN IF NOT EXISTS installment_months INTEGER NOT NULL DEFAULT 12,
                ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
                ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS company_profiles (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                company_name VARCHAR(180) NOT NULL,
                company_email VARCHAR(180),
                contact_person VARCHAR(160),
                phone VARCHAR(60),
                address TEXT,
                notes TEXT,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                UNIQUE (company_name)
            )
        `);

        await client.query(`
            ALTER TABLE company_profiles
                ADD COLUMN IF NOT EXISTS contact_person VARCHAR(160),
                ADD COLUMN IF NOT EXISTS phone VARCHAR(60),
                ADD COLUMN IF NOT EXISTS address TEXT,
                ADD COLUMN IF NOT EXISTS notes TEXT,
                ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
                ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS vehicle_types (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                type_key VARCHAR(80) NOT NULL UNIQUE,
                display_name VARCHAR(120) NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                sort_order INTEGER NOT NULL DEFAULT 1
            )
        `);

        await client.query(`
            ALTER TABLE vehicles
                ADD COLUMN IF NOT EXISTS product_description TEXT,
                ADD COLUMN IF NOT EXISTS serial_number VARCHAR(260),
                ADD COLUMN IF NOT EXISTS source_stock_order_id UUID REFERENCES stock_orders(id) ON DELETE SET NULL
        `);

        await client.query(`
            ALTER TABLE stock_orders
                ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES product_catalog(id) ON DELETE SET NULL,
                ADD COLUMN IF NOT EXISTS company_profile_id UUID REFERENCES company_profiles(id) ON DELETE SET NULL,
                ADD COLUMN IF NOT EXISTS serial_number VARCHAR(260),
                ADD COLUMN IF NOT EXISTS product_description TEXT,
                ADD COLUMN IF NOT EXISTS received_quantity INTEGER NOT NULL DEFAULT 0,
                ADD COLUMN IF NOT EXISTS received_at TIMESTAMPTZ,
                ADD COLUMN IF NOT EXISTS email_sent BOOLEAN NOT NULL DEFAULT FALSE,
                ADD COLUMN IF NOT EXISTS email_error TEXT
        `);

        await client.query(`
            ALTER TABLE sales_transactions
                ADD COLUMN IF NOT EXISTS dealer_id UUID REFERENCES dealers(id) ON DELETE SET NULL,
                ADD COLUMN IF NOT EXISTS workflow_definition_id UUID,
                ADD COLUMN IF NOT EXISTS approval_status VARCHAR(30) NOT NULL DEFAULT 'APPROVED',
                ADD COLUMN IF NOT EXISTS current_workflow_step INTEGER NOT NULL DEFAULT 0,
                ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
                ADD COLUMN IF NOT EXISTS last_workflow_action_at TIMESTAMPTZ,
                ADD COLUMN IF NOT EXISTS last_workflow_action_by UUID REFERENCES users(id) ON DELETE SET NULL,
                ADD COLUMN IF NOT EXISTS dealer_signature_url TEXT,
                ADD COLUMN IF NOT EXISTS authorized_signature_url TEXT,
                ADD COLUMN IF NOT EXISTS customer_cnic_front_url TEXT,
                ADD COLUMN IF NOT EXISTS customer_cnic_back_url TEXT,
                ADD COLUMN IF NOT EXISTS bank_check_url TEXT,
                ADD COLUMN IF NOT EXISTS misc_document_url TEXT
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS workflow_definitions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                definition_name VARCHAR(180) NOT NULL,
                workflow_type VARCHAR(60) NOT NULL DEFAULT 'SALE_APPROVAL',
                dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
                requester_role_name VARCHAR(60) NOT NULL,
                first_approver_role_name VARCHAR(60) NOT NULL,
                second_approver_role_name VARCHAR(60),
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_by UUID REFERENCES users(id) ON DELETE SET NULL,
                updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS workflow_tasks (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                workflow_definition_id UUID REFERENCES workflow_definitions(id) ON DELETE SET NULL,
                entity_type VARCHAR(40) NOT NULL,
                entity_id UUID NOT NULL,
                dealer_id UUID REFERENCES dealers(id) ON DELETE SET NULL,
                created_by UUID REFERENCES users(id) ON DELETE SET NULL,
                assigned_role_name VARCHAR(60) NOT NULL,
                step_number INTEGER NOT NULL DEFAULT 1,
                total_steps INTEGER NOT NULL DEFAULT 1,
                task_title VARCHAR(220) NOT NULL,
                task_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
                decision_notes TEXT,
                acted_by UUID REFERENCES users(id) ON DELETE SET NULL,
                acted_at TIMESTAMPTZ,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS workflow_definitions_lookup_idx
            ON workflow_definitions (workflow_type, requester_role_name, dealer_id, is_active)
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS workflow_tasks_lookup_idx
            ON workflow_tasks (entity_type, entity_id, assigned_role_name, task_status, dealer_id, created_at DESC)
        `);

        await client.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM pg_constraint
                    WHERE conname = 'sales_transactions_workflow_definition_id_fkey'
                ) THEN
                    ALTER TABLE sales_transactions
                    ADD CONSTRAINT sales_transactions_workflow_definition_id_fkey
                    FOREIGN KEY (workflow_definition_id) REFERENCES workflow_definitions(id) ON DELETE SET NULL;
                END IF;
            END $$;
        `);

        await client.query(`
            UPDATE sales_transactions
            SET approval_status = COALESCE(NULLIF(TRIM(approval_status), ''), 'APPROVED')
        `);

        await client.query(`
            ALTER TABLE stock_orders
                ALTER COLUMN quantity SET DEFAULT 1
        `);

        await client.query(`
            UPDATE stock_orders
            SET quantity = 1
            WHERE quantity IS NULL OR quantity < 1
        `);

        await client.query(`
            UPDATE product_catalog
            SET serial_number = CONCAT(
                'STK',
                REGEXP_REPLACE(UPPER(COALESCE(brand, '')), '[^A-Z0-9]+', '', 'g'),
                REGEXP_REPLACE(UPPER(COALESCE(color, '')), '[^A-Z0-9]+', '', 'g'),
                REGEXP_REPLACE(UPPER(COALESCE(model, '')), '[^A-Z0-9]+', '', 'g'),
                REGEXP_REPLACE(UPPER(COALESCE(chassis_number, '')), '[^A-Z0-9]+', '', 'g'),
                REGEXP_REPLACE(UPPER(COALESCE(engine_number, '')), '[^A-Z0-9]+', '', 'g')
            )
            WHERE COALESCE(TRIM(serial_number), '') = ''
        `);

        await client.query(`
            INSERT INTO vehicle_types (type_key, display_name, sort_order)
            SELECT DISTINCT
                UPPER(TRIM(v.vehicle_type)) AS type_key,
                INITCAP(LOWER(TRIM(v.vehicle_type))) AS display_name,
                ROW_NUMBER() OVER (ORDER BY UPPER(TRIM(v.vehicle_type)))
            FROM vehicles v
            WHERE COALESCE(TRIM(v.vehicle_type), '') <> ''
            ON CONFLICT (type_key) DO NOTHING
        `);

        await client.query(`
            INSERT INTO company_profiles (company_name, company_email)
            SELECT DISTINCT
                so.company_name,
                NULLIF(so.company_email, '')
            FROM stock_orders so
            WHERE COALESCE(so.company_name, '') <> ''
              AND NOT EXISTS (
                    SELECT 1
                    FROM company_profiles cp
                    WHERE UPPER(cp.company_name) = UPPER(so.company_name)
              )
        `);

        await client.query(`
            INSERT INTO product_catalog (brand, model, serial_number, vehicle_type, color, description, image_url, monthly_rate, purchase_price)
            SELECT DISTINCT ON (UPPER(COALESCE(brand, '')), UPPER(COALESCE(model, '')), UPPER(COALESCE(vehicle_type, '')))
                brand,
                model,
                CONCAT(
                    'STK',
                    REGEXP_REPLACE(UPPER(COALESCE(brand, '')), '[^A-Z0-9]+', '', 'g'),
                    REGEXP_REPLACE(UPPER(COALESCE(color, '')), '[^A-Z0-9]+', '', 'g'),
                    REGEXP_REPLACE(UPPER(COALESCE(model, '')), '[^A-Z0-9]+', '', 'g'),
                    REGEXP_REPLACE(UPPER(COALESCE(chassis_number, '')), '[^A-Z0-9]+', '', 'g'),
                    REGEXP_REPLACE(UPPER(COALESCE(engine_number, '')), '[^A-Z0-9]+', '', 'g')
                ),
                UPPER(COALESCE(vehicle_type, '')),
                color,
                product_description,
                image_url,
                COALESCE(monthly_rate, 0),
                COALESCE(purchase_price, 0)
            FROM vehicles
            WHERE COALESCE(brand, '') <> ''
              AND COALESCE(model, '') <> ''
              AND COALESCE(vehicle_type, '') <> ''
              AND COALESCE(image_url, '') <> ''
              AND NOT EXISTS (
                    SELECT 1
                    FROM product_catalog pc
                    WHERE UPPER(pc.brand) = UPPER(vehicles.brand)
                      AND UPPER(pc.model) = UPPER(vehicles.model)
                      AND UPPER(pc.vehicle_type) = UPPER(vehicles.vehicle_type)
              )
            ORDER BY UPPER(COALESCE(brand, '')), UPPER(COALESCE(model, '')), UPPER(COALESCE(vehicle_type, '')), created_at DESC
        `);

        await client.query(`
            WITH ranked_serials AS (
                SELECT
                    id,
                    UPPER(serial_number) AS normalized_serial,
                    ROW_NUMBER() OVER (
                        PARTITION BY UPPER(serial_number)
                        ORDER BY created_at ASC, id ASC
                    ) AS row_number
                FROM product_catalog
                WHERE COALESCE(TRIM(serial_number), '') <> ''
            )
            UPDATE product_catalog pc
            SET serial_number = CONCAT(ranked_serials.normalized_serial, '-', ranked_serials.row_number)
            FROM ranked_serials
            WHERE pc.id = ranked_serials.id
              AND ranked_serials.row_number > 1
        `);

        await client.query(`
            UPDATE stock_orders so
            SET serial_number = COALESCE(
                NULLIF(TRIM(so.serial_number), ''),
                NULLIF(TRIM(pc.serial_number), '')
            )
            FROM product_catalog pc
            WHERE so.product_id = pc.id
              AND COALESCE(TRIM(so.serial_number), '') = ''
        `);

        await client.query(`
            UPDATE vehicles v
            SET serial_number = COALESCE(
                NULLIF(TRIM(v.serial_number), ''),
                CONCAT(
                    'STK',
                    REGEXP_REPLACE(UPPER(COALESCE(v.brand, '')), '[^A-Z0-9]+', '', 'g'),
                    REGEXP_REPLACE(UPPER(COALESCE(v.color, '')), '[^A-Z0-9]+', '', 'g'),
                    REGEXP_REPLACE(UPPER(COALESCE(v.model, '')), '[^A-Z0-9]+', '', 'g'),
                    REGEXP_REPLACE(UPPER(COALESCE(NULLIF(TRIM(v.chassis_number), ''), v.id::text)), '[^A-Z0-9]+', '', 'g'),
                    REGEXP_REPLACE(UPPER(COALESCE(NULLIF(TRIM(v.engine_number), ''), v.id::text)), '[^A-Z0-9]+', '', 'g')
                )
            )
            FROM product_catalog pc
            WHERE UPPER(COALESCE(pc.brand, '')) = UPPER(COALESCE(v.brand, ''))
              AND UPPER(COALESCE(pc.model, '')) = UPPER(COALESCE(v.model, ''))
              AND UPPER(COALESCE(pc.vehicle_type, '')) = UPPER(COALESCE(v.vehicle_type, ''))
              AND COALESCE(TRIM(v.serial_number), '') = ''
        `);

        await client.query(`
            UPDATE vehicles v
            SET source_stock_order_id = so.id
            FROM stock_orders so
            WHERE v.source_stock_order_id IS NULL
              AND v.registration_number LIKE CONCAT('STK-', REPLACE(UPPER(so.id::text), '-', ''), '-%')
        `);

        await client.query(`
            WITH ranked_vehicle_serials AS (
                SELECT
                    id,
                    UPPER(serial_number) AS normalized_serial,
                    ROW_NUMBER() OVER (
                        PARTITION BY UPPER(serial_number)
                        ORDER BY created_at ASC NULLS LAST, id ASC
                    ) AS row_number
                FROM vehicles
                WHERE COALESCE(TRIM(serial_number), '') <> ''
            )
            UPDATE vehicles v
            SET serial_number = CONCAT(ranked_vehicle_serials.normalized_serial, '-', ranked_vehicle_serials.row_number)
            FROM ranked_vehicle_serials
            WHERE v.id = ranked_vehicle_serials.id
              AND ranked_vehicle_serials.row_number > 1
        `);

        await client.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS product_catalog_serial_number_unique_idx
            ON product_catalog (UPPER(serial_number))
            WHERE COALESCE(TRIM(serial_number), '') <> ''
        `);

        await client.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS product_catalog_chassis_number_unique_idx
            ON product_catalog (UPPER(chassis_number))
            WHERE COALESCE(TRIM(chassis_number), '') <> ''
        `);

        await client.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS product_catalog_engine_number_unique_idx
            ON product_catalog (UPPER(engine_number))
            WHERE COALESCE(TRIM(engine_number), '') <> ''
        `);

        await client.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS product_catalog_registration_number_unique_idx
            ON product_catalog (UPPER(registration_number))
            WHERE COALESCE(TRIM(registration_number), '') <> ''
        `);

        await client.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS vehicles_serial_number_unique_idx
            ON vehicles (UPPER(serial_number))
            WHERE COALESCE(TRIM(serial_number), '') <> ''
        `);

        await client.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS vehicles_chassis_number_unique_idx
            ON vehicles (UPPER(chassis_number))
            WHERE COALESCE(TRIM(chassis_number), '') <> ''
        `);

        await client.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS vehicles_engine_number_unique_idx
            ON vehicles (UPPER(engine_number))
            WHERE COALESCE(TRIM(engine_number), '') <> ''
        `);

        await client.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS vehicles_registration_number_unique_idx
            ON vehicles (UPPER(registration_number))
            WHERE COALESCE(TRIM(registration_number), '') <> ''
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS stock_orders_serial_number_idx
            ON stock_orders (UPPER(serial_number))
            WHERE COALESCE(TRIM(serial_number), '') <> ''
        `);

        await client.query(`
            ALTER TABLE employees
                ADD COLUMN IF NOT EXISTS commission_percentage NUMERIC(8, 2) NOT NULL DEFAULT 0,
                ADD COLUMN IF NOT EXISTS commission_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
                ADD COLUMN IF NOT EXISTS base_salary NUMERIC(12, 2) NOT NULL DEFAULT 0
        `);

        await client.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1
                    FROM pg_constraint
                    WHERE conname = 'employees_employee_code_key'
                ) THEN
                    ALTER TABLE employees
                    DROP CONSTRAINT employees_employee_code_key;
                END IF;
            END $$;
        `);

        await client.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS employees_dealer_code_unique_idx
            ON employees (COALESCE(dealer_id, '00000000-0000-0000-0000-000000000000'::uuid), UPPER(employee_code))
            WHERE COALESCE(TRIM(employee_code), '') <> ''
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS employee_commissions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
                sale_id UUID REFERENCES sales_transactions(id) ON DELETE SET NULL,
                installment_id UUID REFERENCES sale_installments(id) ON DELETE SET NULL,
                commission_type VARCHAR(30) NOT NULL,
                base_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
                commission_percentage NUMERIC(8, 2) NOT NULL DEFAULT 0,
                commission_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
                commission_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
                earned_on DATE NOT NULL DEFAULT CURRENT_DATE,
                notes TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS employee_salary_advances (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
                advance_date DATE NOT NULL DEFAULT CURRENT_DATE,
                amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
                reason TEXT,
                deducted_in_payroll_id UUID,
                created_by UUID REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS employee_payrolls (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
                payroll_month VARCHAR(7) NOT NULL,
                base_salary NUMERIC(12, 2) NOT NULL DEFAULT 0,
                total_commission NUMERIC(12, 2) NOT NULL DEFAULT 0,
                total_advances NUMERIC(12, 2) NOT NULL DEFAULT 0,
                net_salary NUMERIC(12, 2) NOT NULL DEFAULT 0,
                generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
                notes TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                UNIQUE (employee_id, payroll_month)
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS notification_reads (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                notification_key TEXT NOT NULL,
                read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                UNIQUE (user_id, notification_key)
            )
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS notification_reads_user_idx
            ON notification_reads (user_id, read_at DESC)
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS app_ads (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
                title VARCHAR(180),
                subtitle TEXT,
                image_url TEXT,
                cta_label VARCHAR(120),
                cta_url TEXT,
                display_order INTEGER NOT NULL DEFAULT 0,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                start_at TIMESTAMPTZ,
                end_at TIMESTAMPTZ,
                created_by UUID REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS app_ads_active_idx
            ON app_ads (is_active, display_order, created_at DESC)
        `);

        for (const roleName of ROLE_NAMES) {
            await ensureRole(client, roleName);
        }

        for (const [featureKey, displayName] of FEATURE_DEFINITIONS) {
            await ensureFeature(client, featureKey, displayName);
        }

        const rolesResult = await client.query(
            'SELECT id, role_name FROM roles'
        );

        const roleIdByName = rolesResult.rows.reduce((acc, role) => {
            acc[role.role_name] = role.id;
            return acc;
        }, {});

        await ensureDefaultRolePermissions(client, roleIdByName.SUPER_ADMIN, SUPER_ADMIN_FEATURES);
        await ensureDefaultRolePermissions(client, roleIdByName.APPLICATION_ADMIN, APPLICATION_ADMIN_FEATURES);
        await ensureDefaultRolePermissions(client, roleIdByName.MANAGER, MANAGER_FEATURES);
        await ensureDefaultRolePermissions(client, roleIdByName.AGENT, AGENT_FEATURES);

        await client.query('COMMIT');
        return {
            rolesEnsured: ROLE_NAMES.length,
            featuresEnsured: FEATURE_DEFINITIONS.length,
        };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

exports.syncAccessCatalogDefaults = async () => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query(`
            CREATE TABLE IF NOT EXISTS product_catalog (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                brand VARCHAR(120) NOT NULL,
                model VARCHAR(120) NOT NULL,
                serial_number VARCHAR(220),
                registration_number VARCHAR(120),
                vehicle_type VARCHAR(80) NOT NULL,
                chassis_number VARCHAR(160),
                engine_number VARCHAR(160),
                color VARCHAR(80),
                description TEXT,
                image_url TEXT NOT NULL,
                monthly_rate NUMERIC(12, 2) NOT NULL DEFAULT 0,
                purchase_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
                cash_markup_percent NUMERIC(8, 2) NOT NULL DEFAULT 0,
                cash_markup_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
                installment_markup_percent NUMERIC(8, 2) NOT NULL DEFAULT 0,
                installment_months INTEGER NOT NULL DEFAULT 12,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);

        await client.query(`
            ALTER TABLE product_catalog
                ADD COLUMN IF NOT EXISTS cash_markup_percent NUMERIC(8, 2) NOT NULL DEFAULT 0,
                ADD COLUMN IF NOT EXISTS cash_markup_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
                ADD COLUMN IF NOT EXISTS installment_markup_percent NUMERIC(8, 2) NOT NULL DEFAULT 0,
                ADD COLUMN IF NOT EXISTS installment_months INTEGER NOT NULL DEFAULT 12
        `);

        for (const roleName of ROLE_NAMES) {
            await ensureRole(client, roleName);
        }

        for (const [featureKey, displayName] of FEATURE_DEFINITIONS) {
            await ensureFeature(client, featureKey, displayName);
        }

        const rolesResult = await client.query('SELECT id, role_name FROM roles');
        const roleIdByName = rolesResult.rows.reduce((acc, role) => {
            acc[role.role_name] = role.id;
            return acc;
        }, {});

        await ensureDefaultRolePermissions(client, roleIdByName.SUPER_ADMIN, SUPER_ADMIN_FEATURES);
        await ensureDefaultRolePermissions(client, roleIdByName.APPLICATION_ADMIN, APPLICATION_ADMIN_FEATURES);
        await ensureDefaultRolePermissions(client, roleIdByName.MANAGER, MANAGER_FEATURES);
        await ensureDefaultRolePermissions(client, roleIdByName.AGENT, AGENT_FEATURES);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};
