const pool = require('../config/db');

const ROLE_NAMES = ['SUPER_ADMIN', 'APPLICATION_ADMIN', 'AGENT', 'MANAGER'];


const CUSTOMER_FIELD_ACCESS = [
    ['FEAT_CUSTOMER_FIELD_ASSIGNED_DEALER', 'Assigned Dealer'],
    ['FEAT_CUSTOMER_FIELD_CREATED_BY', 'Created By'],
    ['FEAT_CUSTOMER_FIELD_FULL_NAME', 'Full Name'],
    ['FEAT_CUSTOMER_FIELD_FATHER_NAME', 'Father Name'],
    ['FEAT_CUSTOMER_FIELD_DATE_OF_BIRTH', 'Date Of Birth'],
    ['FEAT_CUSTOMER_FIELD_GENDER', 'Gender'],
    ['FEAT_CUSTOMER_FIELD_DOCUMENT_TYPE', 'Document Type'],
    ['FEAT_CUSTOMER_FIELD_CNIC_PASSPORT_NUMBER', 'CNIC / Passport Number'],
    ['FEAT_CUSTOMER_FIELD_CNIC_FRONT_UPLOAD', 'CNIC Front Upload'],
    ['FEAT_CUSTOMER_FIELD_CNIC_BACK_UPLOAD', 'CNIC Back Upload'],
    ['FEAT_CUSTOMER_FIELD_CONTACT_EMAIL', 'Contact Email'],
    ['FEAT_CUSTOMER_FIELD_CONTACT_PHONE', 'Contact Phone'],
    ['FEAT_CUSTOMER_FIELD_COUNTRY', 'Country'],
    ['FEAT_CUSTOMER_FIELD_ADDRESS', 'Address'],
    ['FEAT_CUSTOMER_FIELD_OCR_EXTRACTED_NAME', 'OCR Extracted Name'],
    ['FEAT_CUSTOMER_FIELD_OCR_SCAN_TEXT', 'OCR Scan Text'],
    ['FEAT_CUSTOMER_FIELD_FINGERPRINT_SCANNER_OUTPUT', 'Fingerprint Scanner Output'],
    ['FEAT_CUSTOMER_FIELD_SCANNER_DEVICE', 'Scanner Device'],
    ['FEAT_CUSTOMER_FIELD_SCAN_QUALITY', 'Scan Quality'],
    ['FEAT_CUSTOMER_FIELD_FINGERPRINT_STATUS', 'Fingerprint Status'],
    ['FEAT_CUSTOMER_FIELD_BIOMETRIC_HASH', 'Biometric Hash'],
    ['FEAT_CUSTOMER_FIELD_THUMB_UPLOAD', 'Thumb Upload'],
    ['FEAT_CUSTOMER_FIELD_SIGNATURE_UPLOAD', 'Signature Upload'],
    ['FEAT_CUSTOMER_FIELD_PASSPORT_PHOTO', 'Customer Photo'],
];

const SALES_FIELD_ACCESS = [
    ['FEAT_SALES_FIELD_CUSTOMER', 'Customer'],
    ['FEAT_SALES_FIELD_AVAILABLE_STOCK', 'Available Stock'],
    ['FEAT_SALES_FIELD_SALE_MODE', 'Sale Mode'],
    ['FEAT_SALES_FIELD_AGREEMENT_NUMBER', 'Agreement Number'],
    ['FEAT_SALES_FIELD_AGREEMENT_DATE', 'Agreement Date'],
    ['FEAT_SALES_FIELD_PURCHASE_DATE', 'Purchase Date'],
    ['FEAT_SALES_FIELD_ACTUAL_PRICE', 'Actual Price'],
    ['FEAT_SALES_FIELD_PRINT_ACTUAL_PRICE_ON_INVOICE', 'Print Actual Price on Invoice'],
    ['FEAT_SALES_FIELD_PURCHASE_PRICE', 'Purchase Price'],
    ['FEAT_SALES_FIELD_SELLING_PRICE', 'Selling Price'],
    ['FEAT_SALES_FIELD_TOTAL_PRICE', 'Total Price'],
    ['FEAT_SALES_FIELD_MARGIN_PERCENT', 'Margin %'],
    ['FEAT_SALES_FIELD_MARGIN_VALUE', 'Margin Value'],
    ['FEAT_SALES_FIELD_MARKUP_PERCENTAGE', 'Markup Percentage'],
    ['FEAT_SALES_FIELD_DOWN_PAYMENT', 'Down Payment'],
    ['FEAT_SALES_FIELD_MONTHLY_INSTALLMENT', 'Monthly Installment'],
    ['FEAT_SALES_FIELD_INSTALLMENT_METHOD', 'Installment Method (Dropdown)'],
    ['FEAT_SALES_FIELD_WITNESS_NAME', 'Witness Name'],
    ['FEAT_SALES_FIELD_WITNESS_FATHER_NAME', 'Witness Father Name'],
    ['FEAT_SALES_FIELD_WITNESS_MOBILE_NUMBER', 'Witness Mobile Number'],
    ['FEAT_SALES_FIELD_WITNESS_CNIC', 'Witness CNIC'],
    ['FEAT_SALES_FIELD_WITNESS_ADDRESS', 'Witness Address'],
    ['FEAT_SALES_FIELD_WITNESS_2_NAME', 'Witness 2 Name'],
    ['FEAT_SALES_FIELD_WITNESS_2_FATHER_NAME', 'Witness 2 Father Name'],
    ['FEAT_SALES_FIELD_WITNESS_2_MOBILE_NUMBER', 'Witness 2 Mobile Number'],
    ['FEAT_SALES_FIELD_WITNESS_2_CNIC', 'Witness 2 CNIC'],
    ['FEAT_SALES_FIELD_WITNESS_2_ADDRESS', 'Witness 2 Address'],
    ['FEAT_SALES_FIELD_AGREEMENT_PDF', 'Agreement PDF'],
    ['FEAT_SALES_FIELD_DEALER_SIGNATURE_UPLOAD', 'Dealer Signature Upload'],
    ['FEAT_SALES_FIELD_AUTHORIZED_SIGNATURE_UPLOAD', 'Authorized Signature Upload'],
    ['FEAT_SALES_FIELD_BANK_CHECK_UPLOAD', 'Bank Check Upload'],
    ['FEAT_SALES_FIELD_MISC_DOCUMENT_UPLOAD', 'Misc Document Upload'],
    ['FEAT_SALES_FIELD_REMARKS', 'Remarks'],
    ['FEAT_SALES_FIELD_FINANCED_AMOUNT', 'Financed Amount'],
    ['FEAT_SALES_FIELD_INSTALLMENT_MONTHS', 'Installment Months'],
    ['FEAT_SALES_FIELD_FIRST_DUE_DATE', 'First Due Date'],
];

const CUSTOMER_FIELD_FEATURE_KEYS = CUSTOMER_FIELD_ACCESS.map(([featureKey]) => featureKey);
const SALES_FIELD_FEATURE_KEYS = SALES_FIELD_ACCESS.map(([featureKey]) => featureKey);
const FEATURE_DEFINITIONS = [
    ['FEAT_DASHBOARD_VIEW', 'Open Dashboard Page'],
    ['FEAT_THEME_MGMT', 'Theme Controls'],
    ['FEAT_PROFILE_SWITCH', 'Profile Switch'],
    ['FEAT_APPLICATIONS_VIEW', 'Open Applications Page'],
    ['FEAT_WORKFLOW_VIEW', 'Workflow Access'],
    ['FEAT_CUSTOMER_MGMT', 'Open Customers Page'],
    ['FEAT_CUSTOMER_BIOMETRIC', 'Customer Biometric Access'],
    ['FEAT_OCR_SCAN', 'OCR Upload Access'],
    ['FEAT_BIOMETRIC', 'Biometric Verification Access'],
    ['FEAT_PRODUCT_MGMT', 'Open Products Page'],
    ['FEAT_FLEET_MGMT', 'Fleet Inventory Access'],
    ['FEAT_STOCK_MGMT', 'Open Stock Page'],
    ['FEAT_SALES_CREATE', 'Create Sale Button'],
    ['FEAT_SALES_MGMT', 'Sales Management Access'],
    ['FEAT_INSTALLMENT_MGMT', 'Open Installments Page'],
    ['FEAT_INSTALLMENT_COMMISSION', 'Installment Receipt Commission'],
    ['FEAT_DEALER_MGMT', 'Open Dealers Page'],
    ['FEAT_USER_MGMT', 'Open Employees Page'],
    ['FEAT_ACCESS_CONTROL', 'Open Access Control Page'],
    ['FEAT_DASHBOARD_ACCESS_PROFILE', 'Access Profile'],
    ['FEAT_DASHBOARD_TRANSACTION_DATE_FILTER', 'Dashboard Transaction Date Filter'],
    ['FEAT_DASHBOARD_CARD_ACTIVE_LEASES', 'Total Settled Leases'],
    ['FEAT_DASHBOARD_CARD_PENDING_LEASES', 'Total Customer Pending Lease'],
    ['FEAT_DASHBOARD_CARD_PENDING_TASKS', 'Total Pending Tasks'],
    ['FEAT_DASHBOARD_CARD_TOTAL_REVENUE', 'Total Revenue'],
    ['FEAT_DASHBOARD_CARD_EMPLOYEE_COMMISSIONS', 'Total Employee Commissions'],
    ['FEAT_DASHBOARD_CARD_TOTAL_VEHICLES', 'Total Vehicles'],
    ['FEAT_DASHBOARD_CARD_TOTAL_CUSTOMERS', 'Total Customers'],
    ['FEAT_DASHBOARD_CARD_TOTAL_EMPLOYEES', 'Total Employees'],
    ['FEAT_DASHBOARD_CARD_ACTIVE_EMPLOYEES', 'Total Active Employees'],
    ['FEAT_DASHBOARD_CARD_TOTAL_DEALERS', 'Total Dealers'],
    ['FEAT_DASHBOARD_CARD_ACTIVE_DEALERS', 'Total Active Dealers'],
    ['FEAT_DASHBOARD_CARD_SCANNED_DOCUMENTS', 'Total Scanned Documents'],
    ['FEAT_DASHBOARD_CARD_ENROLLED_BIOMETRICS', 'Total Enrolled Biometrics'],
    ['FEAT_DASHBOARD_CARD_TOTAL_APPLICATIONS', 'Total Customer Leasing Applications'],
    ['FEAT_DASHBOARD_CARD_CASH_TRANSACTIONS', 'Total Cash Transactions'],
    ['FEAT_DASHBOARD_CARD_INSTALLMENT_TRANSACTIONS', 'Total Installment Transactions'],
    ['FEAT_DASHBOARD_CARD_RECEIVED_INSTALLMENTS', 'Total Received Installments'],
    ['FEAT_DASHBOARD_SALES_PERFORMANCE', 'Sales Composition'],
    ['FEAT_DASHBOARD_PROFIT_TRANSACTIONS', 'Recent Profit Transactions'],
    ['FEAT_DASHBOARD_COMPANY_PROFITABILITY', 'Company Business Profitability'],
    ['FEAT_DASHBOARD_RECENT_APPLICATIONS', 'Recent Applications'],
    ['FEAT_DASHBOARD_RECENT_EMPLOYEES', 'Recent Employees'],
    ['FEAT_ADS_MGMT', 'Advertisement Controls'],
    ['FEAT_APPLICATIONS_LIST', 'Applications List'],
    ['FEAT_WORKFLOW_TASKS', 'User Tasks'],
    ['FEAT_WORKFLOW_CONFIG', 'Approval Flow Setup'],
    ['FEAT_PRODUCT_FORM', 'New Product Master'],
    ['FEAT_PRODUCT_TYPE_MGMT', 'Vehicle Type Master'],
    ['FEAT_PRODUCT_REGISTER', 'Product Master Register'],
    ['FEAT_COMPANY_FORM', 'New Company Profile'],
    ['FEAT_COMPANY_DIRECTORY', 'Company Directory'],
    ['FEAT_SALES_AGREEMENT_FORM', 'Vehicle Agreement Creation'],
    ['FEAT_SALES_AGREEMENT_SUMMARY', 'Agreement Summary'],
    ['FEAT_SALES_INSTALLMENT_PREVIEW', 'Installment Page'],
    ['FEAT_SALES_REGISTER', 'Sales Transaction Register'],
    ['FEAT_SALES_UPDATE', 'Sales Register Update Button'],
    ['FEAT_SALES_URL_FIELDS', 'Sales Attachment URL Fields'],
    ['FEAT_TRANSACTION_REGISTER', 'Transaction Register'],
    ...SALES_FIELD_ACCESS,
    ['FEAT_STOCK_ORDER_FORM', 'Order Stock'],
    ['FEAT_STOCK_RECEIVED_VIEW', 'Stock Received From Company'],
    ['FEAT_STOCK_REGISTER', 'Stock Ordering Register'],
    ['FEAT_STOCK_RECEIVE', 'Receive Stock Button'],
    ['FEAT_STOCK_UPDATE', 'Update Stock Button'],
    ['FEAT_STOCK_DELETE', 'Delete Stock Button'],
    ['FEAT_INSTALLMENT_OVERVIEW', 'Installment Page'],
    ['FEAT_INSTALLMENT_COLLECTION', 'Monthly Installment Collection'],
['FEAT_CUSTOMER_FORM', 'New Customer Intake'],
['FEAT_CUSTOMER_FINGERPRINT', 'Fingerprint Intake'],
['FEAT_CUSTOMER_OCR_FIELDS', 'OCR Text Fields'],
['FEAT_CUSTOMER_OCR_PROCESS', 'Process OCR Button'],
['FEAT_CUSTOMER_FINGERPRINT_FIELDS', 'Fingerprint Text Fields'],
['FEAT_CUSTOMER_FINGERPRINT_SCAN', 'Scan Thumb Button'],
['FEAT_CUSTOMER_REGISTER', 'Customer Registry'],
['FEAT_CUSTOMER_RECORD_VIEW', 'View Customer Record'],
['FEAT_CUSTOMER_RECORD_EDIT', 'Edit Customer Record'],
['FEAT_CUSTOMER_RECORD_DELETE', 'Delete Customer Record'],
['FEAT_CUSTOMER_OWNERSHIP_UNLOCK', 'Unlock Assigned Dealer and Created By'],
    ...CUSTOMER_FIELD_ACCESS,
['FEAT_EMPLOYEE_FORM', 'New Employee'],
['FEAT_EMPLOYEE_EDIT', 'Update Employee'],
['FEAT_EMPLOYEE_SECURITY_UNLOCK', 'Unlock Dealer, Role, and Status'],
['FEAT_EMPLOYEE_ROLE_FEATURES_DISPLAY', 'Employee Feature Access'],
    ['FEAT_EMPLOYEE_EXTRA_FEATURES', 'Extra Feature Access'],
    ['FEAT_EMPLOYEE_ADVANCE_CASH', 'Advance Cash'],
    ['FEAT_EMPLOYEE_SALARY_GENERATION', 'Monthly Salary Generation'],
    ['FEAT_EMPLOYEE_DIRECTORY', 'Employee Directory'],
    ['FEAT_EMPLOYEE_COMMISSION_LEDGER', 'Current Month Commission Ledger'],
    ['FEAT_EMPLOYEE_SALARY_RECORD', 'Current Month Salary Record'],
    ['FEAT_EMPLOYEE_ADVANCE_HISTORY', 'Current Month Advance History'],
    ['FEAT_EMPLOYEE_GENERATED_SALARIES', 'Current Month Generated Salaries'],
    ['FEAT_DEALER_FORM', 'New Dealer'],
    ['FEAT_DEALER_SUMMARY', 'Fresh Start Summary'],
    ['FEAT_DEALER_DIRECTORY', 'Dealer Directory'],
    ['FEAT_REPORT_STOCK_INVENTORY', 'Stock Inventory Report'],
    ['FEAT_REPORT_DAILY_SALES', 'Daily Transactions Sale Report'],
    ['FEAT_REPORT_STOCK_RECEIVED', 'Daily Stock Received Report'],
    ['FEAT_REPORT_CUSTOMERS', 'Customer Report'],
    ['FEAT_REPORT_CUSTOMER_TRANSACTIONS', 'Customer Transaction Report'],
    ['FEAT_REPORT_BUSINESS_TRANSACTIONS', 'Business Transaction Report'],
    ['FEAT_REPORT_INVOICE_VIEW', 'Invoice View Report'],
    ['FEAT_REPORT_EMPLOYEES', 'Employees Report'],
    ['FEAT_REPORT_SALARY', 'Salary Report'],
    ['FEAT_REPORT_DEALER_INFORMATION', 'Dealer Information Report'],
    ['FEAT_REPORT_DEALER_EMPLOYEES', 'Dealer Wise Employee Report'],
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
    'FEAT_DASHBOARD_TRANSACTION_DATE_FILTER',
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
    'FEAT_SALES_UPDATE',
    'FEAT_SALES_URL_FIELDS',
    'FEAT_TRANSACTION_REGISTER',
    'FEAT_STOCK_ORDER_FORM',
    'FEAT_STOCK_RECEIVED_VIEW',
    'FEAT_STOCK_REGISTER',
    'FEAT_STOCK_RECEIVE',
    'FEAT_STOCK_UPDATE',
    'FEAT_STOCK_DELETE',
    'FEAT_INSTALLMENT_OVERVIEW',
    'FEAT_INSTALLMENT_COLLECTION',
    'FEAT_CUSTOMER_FORM',
    'FEAT_CUSTOMER_FINGERPRINT',
    'FEAT_CUSTOMER_OCR_FIELDS',
    'FEAT_CUSTOMER_OCR_PROCESS',
    'FEAT_CUSTOMER_FINGERPRINT_FIELDS',
    'FEAT_CUSTOMER_FINGERPRINT_SCAN',
    'FEAT_CUSTOMER_REGISTER',
    'FEAT_CUSTOMER_RECORD_VIEW',
    'FEAT_CUSTOMER_RECORD_EDIT',
    'FEAT_CUSTOMER_RECORD_DELETE',
    ...CUSTOMER_FIELD_FEATURE_KEYS,
    ...SALES_FIELD_FEATURE_KEYS,
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
    'FEAT_DASHBOARD_TRANSACTION_DATE_FILTER',
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
    'FEAT_SALES_UPDATE',
    'FEAT_SALES_URL_FIELDS',
    'FEAT_TRANSACTION_REGISTER',
    'FEAT_STOCK_ORDER_FORM',
    'FEAT_STOCK_RECEIVED_VIEW',
    'FEAT_STOCK_REGISTER',
    'FEAT_STOCK_RECEIVE',
    'FEAT_STOCK_UPDATE',
    'FEAT_STOCK_DELETE',
    'FEAT_INSTALLMENT_OVERVIEW',
    'FEAT_INSTALLMENT_COLLECTION',
    'FEAT_CUSTOMER_FORM',
    'FEAT_CUSTOMER_FINGERPRINT',
    'FEAT_CUSTOMER_OCR_FIELDS',
    'FEAT_CUSTOMER_OCR_PROCESS',
    'FEAT_CUSTOMER_FINGERPRINT_FIELDS',
    'FEAT_CUSTOMER_FINGERPRINT_SCAN',
    'FEAT_CUSTOMER_REGISTER',
    'FEAT_CUSTOMER_RECORD_VIEW',
    'FEAT_CUSTOMER_RECORD_EDIT',
    'FEAT_CUSTOMER_RECORD_DELETE',
    ...CUSTOMER_FIELD_FEATURE_KEYS,
    ...SALES_FIELD_FEATURE_KEYS,
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
    'FEAT_DASHBOARD_TRANSACTION_DATE_FILTER',
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
    'FEAT_SALES_UPDATE',
    'FEAT_SALES_URL_FIELDS',
    'FEAT_TRANSACTION_REGISTER',
    'FEAT_INSTALLMENT_OVERVIEW',
    'FEAT_INSTALLMENT_COLLECTION',
    'FEAT_CUSTOMER_FORM',
    'FEAT_CUSTOMER_FINGERPRINT',
    'FEAT_CUSTOMER_OCR_FIELDS',
    'FEAT_CUSTOMER_OCR_PROCESS',
    'FEAT_CUSTOMER_FINGERPRINT_FIELDS',
    'FEAT_CUSTOMER_FINGERPRINT_SCAN',
    'FEAT_CUSTOMER_REGISTER',
    'FEAT_CUSTOMER_RECORD_VIEW',
    'FEAT_CUSTOMER_RECORD_EDIT',
    'FEAT_CUSTOMER_RECORD_DELETE',
    ...CUSTOMER_FIELD_FEATURE_KEYS,
    ...SALES_FIELD_FEATURE_KEYS,
    'FEAT_REPORT_DAILY_SALES',
    'FEAT_REPORT_CUSTOMERS',
    'FEAT_REPORT_CUSTOMER_TRANSACTIONS',
    'FEAT_REPORT_INVOICE_VIEW',
];

const ensureAccessTableShape = async (client) => {
    await client.query(`
        ALTER TABLE roles
            ADD COLUMN IF NOT EXISTS name VARCHAR(60),
            ADD COLUMN IF NOT EXISTS role_name VARCHAR(60)
    `);
};

const ensureRole = async (client, roleName) => {
    if (roleName === 'SUPER_ADMIN') {
        await client.query(`
            UPDATE roles
            SET role_name = 'SUPER_ADMIN',
                name = COALESCE(name, 'SUPER_ADMIN')
            WHERE id = 1
              AND NOT EXISTS (
                  SELECT 1
                  FROM roles
                  WHERE role_name = 'SUPER_ADMIN' OR name = 'SUPER_ADMIN'
              )
        `);
    }
    await client.query(
        `
        INSERT INTO roles (id, name, role_name)
        SELECT next_id, $1::varchar, $1::varchar
        FROM (SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM roles) ids
        WHERE NOT EXISTS (
            SELECT 1
            FROM roles
            WHERE role_name = $1::varchar OR name = $1::varchar
        )
        `,
        [roleName]
    );

    await client.query(
        `
        UPDATE roles
        SET role_name = COALESCE(role_name, name),
            name = COALESCE(name, role_name)
        WHERE role_name = $1::varchar OR name = $1::varchar
        `,
        [roleName]
    );
};

const ensureFeature = async (client, featureKey, displayName) => {
    await client.query(
        `
        INSERT INTO features (id, feature_key, display_name)
        SELECT next_id, $1::varchar, $2::varchar
        FROM (SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM features) ids
        WHERE NOT EXISTS (
            SELECT 1
            FROM features
            WHERE feature_key = $1::varchar
        )
        `,
        [featureKey, displayName]
    );

    await client.query(
        'UPDATE features SET display_name = $2::varchar WHERE feature_key = $1::varchar',
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
const getVehicleTypesIdDataType = async (client) => {
    const result = await client.query(`
        SELECT data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'vehicle_types'
          AND column_name = 'id'
        LIMIT 1
    `);

    return result.rows[0]?.data_type || '';
};

const seedVehicleTypesFromVehicles = async (client) => {
    const idDataType = await getVehicleTypesIdDataType(client);

    if (idDataType.includes('integer')) {
        await client.query(`
            WITH new_types AS (
                SELECT
                    UPPER(TRIM(v.vehicle_type)) AS type_key,
                    INITCAP(LOWER(TRIM(v.vehicle_type))) AS display_name,
                    ROW_NUMBER() OVER (ORDER BY UPPER(TRIM(v.vehicle_type))) AS row_number
                FROM vehicles v
                WHERE COALESCE(TRIM(v.vehicle_type), '') <> ''
                  AND NOT EXISTS (
                      SELECT 1
                      FROM vehicle_types vt
                      WHERE vt.type_key = UPPER(TRIM(v.vehicle_type))
                  )
                GROUP BY UPPER(TRIM(v.vehicle_type)), INITCAP(LOWER(TRIM(v.vehicle_type)))
            ),
            max_values AS (
                SELECT
                    COALESCE(MAX(id), 0) AS max_id,
                    COALESCE(MAX(sort_order), 0) AS max_sort_order
                FROM vehicle_types
            )
            INSERT INTO vehicle_types (id, type_key, display_name, sort_order)
            SELECT
                max_values.max_id + new_types.row_number,
                new_types.type_key,
                new_types.display_name,
                max_values.max_sort_order + new_types.row_number
            FROM new_types
            CROSS JOIN max_values
            ON CONFLICT (type_key) DO NOTHING
        `);
        return;
    }

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
};

exports.syncAccessControlDefaults = async () => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        await ensureAccessTableShape(client);

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
                ADD COLUMN IF NOT EXISTS source_stock_order_id UUID REFERENCES stock_orders(id) ON DELETE SET NULL,
                ADD COLUMN IF NOT EXISTS dealer_id UUID REFERENCES dealers(id) ON DELETE SET NULL
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
                REGEXP_REPLACE(UPPER(COALESCE(engine_number, '')), '[^A-Z0-9]+', '', 'g'),
                REGEXP_REPLACE(UPPER(id::text), '[^A-Z0-9]+', '', 'g')
            )
            WHERE COALESCE(TRIM(serial_number), '') = ''
        `);

        await seedVehicleTypesFromVehicles(client);

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
                    REGEXP_REPLACE(UPPER(COALESCE(engine_number, '')), '[^A-Z0-9]+', '', 'g'),
                    REGEXP_REPLACE(UPPER(id::text), '[^A-Z0-9]+', '', 'g')
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
            'SELECT id, COALESCE(role_name, name) AS role_name FROM roles'
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
        await ensureAccessTableShape(client);

        for (const roleName of ROLE_NAMES) {
            await ensureRole(client, roleName);
        }

        for (const [featureKey, displayName] of FEATURE_DEFINITIONS) {
            await ensureFeature(client, featureKey, displayName);
        }

        const rolesResult = await client.query('SELECT id, COALESCE(role_name, name) AS role_name FROM roles');
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