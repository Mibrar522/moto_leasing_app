const pool = require('../config/db');

const run = async (sql) => {
    await pool.query(sql);
};

// Lightweight "migration" runner. This repo doesn't use migrations, so we ensure
// customer-app tables/columns exist at startup.
const syncCustomerAppSchema = async () => {
    // Customer accounts (public/mobile app login)
    await run(`
        CREATE TABLE IF NOT EXISTS customer_accounts (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
            email varchar(255) NOT NULL,
            phone_country_code varchar(10) NOT NULL,
            phone_number varchar(30) NOT NULL,
            phone_e164 varchar(40) NOT NULL,
            is_phone_verified boolean DEFAULT false NOT NULL,
            is_active boolean DEFAULT true NOT NULL,
            preferred_dealer_id uuid NULL REFERENCES dealers(id) ON DELETE SET NULL,
            created_at timestamptz DEFAULT now() NOT NULL,
            updated_at timestamptz DEFAULT now() NOT NULL
        );
    `);

    await run(`
        CREATE UNIQUE INDEX IF NOT EXISTS customer_accounts_email_unique_idx
        ON customer_accounts (lower(email));
    `);

    await run(`
        CREATE UNIQUE INDEX IF NOT EXISTS customer_accounts_phone_unique_idx
        ON customer_accounts (phone_e164);
    `);

    // OTP store (phone verification + login)
    await run(`
        CREATE TABLE IF NOT EXISTS customer_otps (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            phone_e164 varchar(40) NOT NULL,
            purpose varchar(30) NOT NULL,
            code_hash text NOT NULL,
            expires_at timestamptz NOT NULL,
            consumed_at timestamptz NULL,
            created_at timestamptz DEFAULT now() NOT NULL
        );
    `);

    await run(`
        CREATE INDEX IF NOT EXISTS customer_otps_phone_purpose_idx
        ON customer_otps (phone_e164, purpose, expires_at);
    `);

    // Product pricing fields for customer app (controlled from web/admin)
    await run(`
        ALTER TABLE product_catalog
        ADD COLUMN IF NOT EXISTS cash_markup_percent numeric(8,2) DEFAULT 0 NOT NULL;
    `);

    await run(`
        ALTER TABLE product_catalog
        ADD COLUMN IF NOT EXISTS cash_markup_value numeric(12,2) DEFAULT 0 NOT NULL;
    `);

    await run(`
        ALTER TABLE product_catalog
        ADD COLUMN IF NOT EXISTS installment_markup_percent numeric(8,2) DEFAULT 0 NOT NULL;
    `);

    await run(`
        ALTER TABLE product_catalog
        ADD COLUMN IF NOT EXISTS installment_months integer DEFAULT 12 NOT NULL;
    `);

    // Customer orders and installment schedules
    await run(`
        CREATE TABLE IF NOT EXISTS customer_orders (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            customer_account_id uuid NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
            product_id uuid NULL REFERENCES product_catalog(id) ON DELETE RESTRICT,
            vehicle_id uuid NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
            purchase_mode varchar(20) NOT NULL,
            base_price numeric(12,2) DEFAULT 0 NOT NULL,
            markup_percent numeric(8,2) DEFAULT 0 NOT NULL,
            total_price numeric(12,2) DEFAULT 0 NOT NULL,
            installment_months integer DEFAULT 0 NOT NULL,
            monthly_amount numeric(12,2) DEFAULT 0 NOT NULL,
            down_payment numeric(12,2) DEFAULT 0 NOT NULL,
            financed_amount numeric(12,2) DEFAULT 0 NOT NULL,
            first_due_date date NULL,
            status varchar(20) DEFAULT 'PENDING' NOT NULL,
            created_at timestamptz DEFAULT now() NOT NULL,
            updated_at timestamptz DEFAULT now() NOT NULL,
            CONSTRAINT customer_orders_purchase_mode_check
                CHECK (purchase_mode IN ('CASH','INSTALLMENT'))
        );
    `);

    // If the table existed before we added new fields, ensure columns exist.
    await run(`ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS product_id uuid;`);
    await run(`ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS vehicle_id uuid;`);
    await run(`ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS down_payment numeric(12,2) DEFAULT 0 NOT NULL;`);
    await run(`ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS financed_amount numeric(12,2) DEFAULT 0 NOT NULL;`);
    await run(`ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS first_due_date date NULL;`);

    await run(`
        CREATE INDEX IF NOT EXISTS customer_orders_customer_idx
        ON customer_orders (customer_account_id, created_at DESC);
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS customer_order_installments (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            order_id uuid NOT NULL REFERENCES customer_orders(id) ON DELETE CASCADE,
            installment_number integer NOT NULL,
            due_date date NOT NULL,
            amount numeric(12,2) DEFAULT 0 NOT NULL,
            status varchar(20) DEFAULT 'PENDING' NOT NULL,
            paid_at timestamptz NULL,
            paid_amount numeric(12,2) DEFAULT 0 NOT NULL,
            received_at timestamptz NULL,
            created_at timestamptz DEFAULT now() NOT NULL,
            CONSTRAINT customer_installments_status_check
                CHECK (status IN ('PENDING','RECEIVED'))
        );
    `);

    await run(`
        CREATE UNIQUE INDEX IF NOT EXISTS customer_order_installments_unique_idx
        ON customer_order_installments (order_id, installment_number);
    `);
};

module.exports = { syncCustomerAppSchema };
