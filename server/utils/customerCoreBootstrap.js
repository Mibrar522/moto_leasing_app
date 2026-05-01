const pool = require('../config/db');

const run = async (sql) => {
    await pool.query(sql);
};

// This repo doesn't use migrations. Older databases can miss newer customer
// intake columns (OCR, document URLs, dealer ownership), which causes 500s on
// POST /api/v1/customers. We ensure the required columns exist at startup.
const syncCustomerCoreSchema = async () => {
    // Core customer enrichment columns
    await run(`
        ALTER TABLE customers
        ADD COLUMN IF NOT EXISTS ocr_details jsonb DEFAULT '{}'::jsonb NOT NULL;
    `);

    await run(`
        ALTER TABLE customers
        ADD COLUMN IF NOT EXISTS biometric_hash text;
    `);

    await run(`
        ALTER TABLE customers
        ADD COLUMN IF NOT EXISTS identity_doc_url text;
    `);

    // Ownership / scoping
    await run(`
        ALTER TABLE customers
        ADD COLUMN IF NOT EXISTS dealer_id uuid;
    `);

    await run(`
        ALTER TABLE customers
        ADD COLUMN IF NOT EXISTS created_by_agent uuid;
    `);

    // Timestamps (older DB snapshots may not have them)
    await run(`
        ALTER TABLE customers
        ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
    `);

    await run(`
        ALTER TABLE customers
        ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
    `);
};

module.exports = { syncCustomerCoreSchema };
