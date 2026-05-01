CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS vehicle_types (
    id SERIAL PRIMARY KEY,
    type_key VARCHAR(30) NOT NULL UNIQUE,
    display_name VARCHAR(60) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dealers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_code VARCHAR(30) NOT NULL UNIQUE,
    dealer_name VARCHAR(160) NOT NULL,
    application_slug VARCHAR(160) UNIQUE,
    theme_key VARCHAR(40) NOT NULL DEFAULT 'sandstone',
    dealer_logo_url TEXT,
    dealer_signature_url TEXT,
    dealer_address TEXT,
    dealer_cnic VARCHAR(30),
    mobile_country VARCHAR(60) NOT NULL DEFAULT 'QATAR',
    mobile_country_code VARCHAR(10) NOT NULL DEFAULT '+974',
    mobile_number VARCHAR(30) NOT NULL,
    currency_code VARCHAR(10) NOT NULL DEFAULT 'QAR',
    contact_email VARCHAR(160),
    notes TEXT,
    db_clone_name VARCHAR(160),
    db_backup_label VARCHAR(160),
    provisioning_status VARCHAR(30) NOT NULL DEFAULT 'READY_FOR_CLONE',
    app_status VARCHAR(20) NOT NULL DEFAULT 'FRESH_START',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE dealers
    ADD COLUMN IF NOT EXISTS application_slug VARCHAR(160),
    ADD COLUMN IF NOT EXISTS theme_key VARCHAR(40) NOT NULL DEFAULT 'sandstone',
    ADD COLUMN IF NOT EXISTS dealer_signature_url TEXT,
    ADD COLUMN IF NOT EXISTS db_clone_name VARCHAR(160),
    ADD COLUMN IF NOT EXISTS db_backup_label VARCHAR(160),
    ADD COLUMN IF NOT EXISTS provisioning_status VARCHAR(30) NOT NULL DEFAULT 'READY_FOR_CLONE',
    ADD COLUMN IF NOT EXISTS admin_user_id UUID REFERENCES users(id) ON DELETE SET NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'dealers_application_slug_key'
    ) THEN
        ALTER TABLE dealers
            ADD CONSTRAINT dealers_application_slug_key UNIQUE (application_slug);
    END IF;
END $$;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS dealer_id UUID REFERENCES dealers(id) ON DELETE SET NULL;

ALTER TABLE customers
    ADD COLUMN IF NOT EXISTS dealer_id UUID REFERENCES dealers(id) ON DELETE SET NULL;

ALTER TABLE employees
    ADD COLUMN IF NOT EXISTS dealer_id UUID REFERENCES dealers(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS commission_percentage NUMERIC(8, 2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS commission_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS base_salary NUMERIC(12, 2) NOT NULL DEFAULT 0;

INSERT INTO roles (role_name)
SELECT 'APPLICATION_ADMIN'
WHERE NOT EXISTS (
    SELECT 1
    FROM roles
    WHERE role_name = 'APPLICATION_ADMIN'
);

INSERT INTO vehicle_types (type_key, display_name, sort_order)
SELECT seed.type_key, seed.display_name, seed.sort_order
FROM (
    VALUES
        ('BIKE', 'Bike', 1),
        ('MOTOR', 'Motor', 2),
        ('CAR', 'Car', 3),
        ('SUV', 'SUV', 4),
        ('VAN', 'Van', 5),
        ('TRUCK', 'Truck', 6),
        ('BUS', 'Bus', 7)
) AS seed(type_key, display_name, sort_order)
WHERE NOT EXISTS (
    SELECT 1
    FROM vehicle_types vt
    WHERE vt.type_key = seed.type_key
);

ALTER TABLE vehicles
    ADD COLUMN IF NOT EXISTS chassis_number VARCHAR(100),
    ADD COLUMN IF NOT EXISTS engine_number VARCHAR(100),
    ADD COLUMN IF NOT EXISTS color VARCHAR(40),
    ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS purchase_price NUMERIC(12, 2),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_vehicle_type_check;
ALTER TABLE vehicles
    ADD CONSTRAINT vehicles_vehicle_type_check
    CHECK (
        vehicle_type::text = ANY (
            ARRAY[
                'BIKE',
                'MOTOR',
                'CAR',
                'SUV',
                'VAN',
                'TRUCK',
                'BUS'
            ]::text[]
        )
    );

CREATE TABLE IF NOT EXISTS sales_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    agent_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    dealer_id UUID REFERENCES dealers(id) ON DELETE SET NULL,
    sale_mode VARCHAR(20) NOT NULL CHECK (sale_mode IN ('CASH', 'INSTALLMENT')),
    agreement_number VARCHAR(60),
    agreement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    agreement_pdf_url TEXT,
    dealer_signature_url TEXT,
    authorized_signature_url TEXT,
    customer_cnic_front_url TEXT,
    customer_cnic_back_url TEXT,
    bank_check_url TEXT,
    misc_document_url TEXT,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    vehicle_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    down_payment NUMERIC(12, 2) NOT NULL DEFAULT 0,
    financed_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    monthly_installment NUMERIC(12, 2) NOT NULL DEFAULT 0,
    installment_months INTEGER NOT NULL DEFAULT 0,
    first_due_date DATE,
    witness_name VARCHAR(120),
    witness_cnic VARCHAR(30),
    witness_two_name VARCHAR(120),
    witness_two_cnic VARCHAR(30),
    remarks TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE sales_transactions
    ADD COLUMN IF NOT EXISTS dealer_id UUID REFERENCES dealers(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS witness_two_name VARCHAR(120),
    ADD COLUMN IF NOT EXISTS witness_two_cnic VARCHAR(30),
    ADD COLUMN IF NOT EXISTS dealer_signature_url TEXT,
    ADD COLUMN IF NOT EXISTS authorized_signature_url TEXT,
    ADD COLUMN IF NOT EXISTS customer_cnic_front_url TEXT,
    ADD COLUMN IF NOT EXISTS customer_cnic_back_url TEXT,
    ADD COLUMN IF NOT EXISTS bank_check_url TEXT,
    ADD COLUMN IF NOT EXISTS misc_document_url TEXT;

CREATE TABLE IF NOT EXISTS sale_installments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL REFERENCES sales_transactions(id) ON DELETE CASCADE,
    installment_number INTEGER NOT NULL,
    due_date DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    received_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    carry_forward_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    paid_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (sale_id, installment_number)
);

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
);

CREATE TABLE IF NOT EXISTS employee_salary_advances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    advance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    reason TEXT,
    deducted_in_payroll_id UUID,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
);

ALTER TABLE sale_installments
    ADD COLUMN IF NOT EXISTS received_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS carry_forward_amount NUMERIC(12, 2) NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS stock_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ordered_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    company_name VARCHAR(120) NOT NULL,
    company_email VARCHAR(160),
    vehicle_type VARCHAR(30) NOT NULL,
    brand VARCHAR(80) NOT NULL,
    model VARCHAR(80) NOT NULL,
    chassis_number VARCHAR(100),
    engine_number VARCHAR(100),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    expected_delivery_date DATE,
    bank_slip_url TEXT,
    notes TEXT,
    order_status VARCHAR(20) NOT NULL DEFAULT 'PROCESSING',
    email_sent BOOLEAN NOT NULL DEFAULT FALSE,
    email_error TEXT,
    received_quantity INTEGER NOT NULL DEFAULT 0,
    received_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_updated_at_generic()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_vehicles_updated_at ON vehicles;
CREATE TRIGGER trg_vehicles_updated_at
BEFORE UPDATE ON vehicles
FOR EACH ROW EXECUTE FUNCTION set_updated_at_generic();

DROP TRIGGER IF EXISTS trg_sales_transactions_updated_at ON sales_transactions;
CREATE TRIGGER trg_sales_transactions_updated_at
BEFORE UPDATE ON sales_transactions
FOR EACH ROW EXECUTE FUNCTION set_updated_at_generic();

DROP TRIGGER IF EXISTS trg_stock_orders_updated_at ON stock_orders;
CREATE TRIGGER trg_stock_orders_updated_at
BEFORE UPDATE ON stock_orders
FOR EACH ROW EXECUTE FUNCTION set_updated_at_generic();

DROP TRIGGER IF EXISTS trg_dealers_updated_at ON dealers;
CREATE TRIGGER trg_dealers_updated_at
BEFORE UPDATE ON dealers
FOR EACH ROW EXECUTE FUNCTION set_updated_at_generic();

INSERT INTO features (feature_key, display_name)
SELECT seed.feature_key, seed.display_name
FROM (
    VALUES
        ('FEAT_DASHBOARD_VIEW', 'View Dashboard'),
        ('FEAT_THEME_MGMT', 'Manage Application Themes'),
        ('FEAT_APPLICATIONS_VIEW', 'View Applications'),
        ('FEAT_CUSTOMER_MGMT', 'Manage Customers'),
        ('FEAT_CUSTOMER_BIOMETRIC', 'Create Customer Biometric'),
        ('FEAT_OCR_SCAN', 'CNIC and Passport Scanning'),
        ('FEAT_BIOMETRIC', 'Biometric Verification'),
        ('FEAT_PRODUCT_MGMT', 'Manage Products and Vehicles'),
        ('FEAT_FLEET_MGMT', 'Manage Fleet Inventory'),
        ('FEAT_STOCK_MGMT', 'Manage Stock Orders'),
        ('FEAT_SALES_CREATE', 'Create Sales Transactions'),
        ('FEAT_SALES_MGMT', 'Manage Sales Transactions'),
        ('FEAT_INSTALLMENT_MGMT', 'Manage Installments'),
        ('FEAT_INSTALLMENT_COMMISSION', 'Apply Installment Receipt Commission'),
        ('FEAT_DEALER_MGMT', 'Manage Dealer Applications'),
        ('FEAT_USER_MGMT', 'Manage Users and Roles'),
        ('FEAT_ACCESS_CONTROL', 'Manage Access Control')
) AS seed(feature_key, display_name)
WHERE NOT EXISTS (
    SELECT 1
    FROM features f
    WHERE f.feature_key = seed.feature_key
);

UPDATE features
SET display_name = seed.display_name
FROM (
    VALUES
        ('FEAT_DASHBOARD_VIEW', 'View Dashboard'),
        ('FEAT_THEME_MGMT', 'Manage Application Themes'),
        ('FEAT_APPLICATIONS_VIEW', 'View Applications'),
        ('FEAT_CUSTOMER_MGMT', 'Manage Customers'),
        ('FEAT_CUSTOMER_BIOMETRIC', 'Create Customer Biometric'),
        ('FEAT_OCR_SCAN', 'CNIC and Passport Scanning'),
        ('FEAT_BIOMETRIC', 'Biometric Verification'),
        ('FEAT_PRODUCT_MGMT', 'Manage Products and Vehicles'),
        ('FEAT_FLEET_MGMT', 'Manage Fleet Inventory'),
        ('FEAT_STOCK_MGMT', 'Manage Stock Orders'),
        ('FEAT_SALES_CREATE', 'Create Sales Transactions'),
        ('FEAT_SALES_MGMT', 'Manage Sales Transactions'),
        ('FEAT_INSTALLMENT_MGMT', 'Manage Installments'),
        ('FEAT_INSTALLMENT_COMMISSION', 'Apply Installment Receipt Commission'),
        ('FEAT_DEALER_MGMT', 'Manage Dealer Applications'),
        ('FEAT_USER_MGMT', 'Manage Users and Roles'),
        ('FEAT_ACCESS_CONTROL', 'Manage Access Control')
) AS seed(feature_key, display_name)
WHERE features.feature_key = seed.feature_key;

INSERT INTO role_permissions (role_id, feature_id)
SELECT 1, f.id
FROM features f
WHERE f.feature_key IN (
    'FEAT_DASHBOARD_VIEW',
    'FEAT_THEME_MGMT',
    'FEAT_APPLICATIONS_VIEW',
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
    'FEAT_DEALER_MGMT',
    'FEAT_USER_MGMT',
    'FEAT_ACCESS_CONTROL'
)
AND NOT EXISTS (
    SELECT 1
    FROM role_permissions rp
    WHERE rp.role_id = 1 AND rp.feature_id = f.id
);

INSERT INTO role_permissions (role_id, feature_id)
SELECT r.id, f.id
FROM roles r
JOIN features f ON f.feature_key IN (
    'FEAT_DASHBOARD_VIEW',
    'FEAT_THEME_MGMT',
    'FEAT_APPLICATIONS_VIEW',
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
    'FEAT_USER_MGMT'
)
WHERE r.role_name = 'APPLICATION_ADMIN'
AND NOT EXISTS (
    SELECT 1
    FROM role_permissions rp
    WHERE rp.role_id = r.id AND rp.feature_id = f.id
);
