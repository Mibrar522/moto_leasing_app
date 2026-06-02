const pool = require('../config/db');

const runLedgerQuery = async (label, sql) => {
    try {
        await pool.query(sql);
        return true;
    } catch (error) {
        console.warn(`Purchase ledger bootstrap skipped (${label}):`, error.message);
        return false;
    }
};

const syncPurchaseLedgerSchema = async () => {
    await runLedgerQuery('stock order payment columns', `
        ALTER TABLE stock_orders
            ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
            ADD COLUMN IF NOT EXISTS remaining_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
            ADD COLUMN IF NOT EXISTS purchase_paid_at TIMESTAMPTZ
    `);

    await runLedgerQuery('purchase ledger table', `
        CREATE TABLE IF NOT EXISTS purchase_ledger (
            id UUID PRIMARY KEY DEFAULT (md5(random()::text || clock_timestamp()::text)::uuid),
            dealer_id UUID,
            stock_order_id UUID NOT NULL,
            company_profile_id UUID,
            vehicle_id UUID,
            company_name VARCHAR(255) NOT NULL DEFAULT 'Supplier',
            vehicle_label VARCHAR(255) NOT NULL DEFAULT 'Vehicle',
            color VARCHAR(120),
            registration_number VARCHAR(120),
            chassis_number VARCHAR(160),
            engine_number VARCHAR(160),
            purchase_date TIMESTAMPTZ,
            paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
            remaining_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
            payment_date TIMESTAMPTZ,
            notes TEXT,
            created_by UUID,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await runLedgerQuery('purchase ledger columns', `
        ALTER TABLE purchase_ledger
            ADD COLUMN IF NOT EXISTS dealer_id UUID,
            ADD COLUMN IF NOT EXISTS stock_order_id UUID,
            ADD COLUMN IF NOT EXISTS company_profile_id UUID,
            ADD COLUMN IF NOT EXISTS vehicle_id UUID,
            ADD COLUMN IF NOT EXISTS company_name VARCHAR(255) NOT NULL DEFAULT 'Supplier',
            ADD COLUMN IF NOT EXISTS vehicle_label VARCHAR(255) NOT NULL DEFAULT 'Vehicle',
            ADD COLUMN IF NOT EXISTS color VARCHAR(120),
            ADD COLUMN IF NOT EXISTS registration_number VARCHAR(120),
            ADD COLUMN IF NOT EXISTS chassis_number VARCHAR(160),
            ADD COLUMN IF NOT EXISTS engine_number VARCHAR(160),
            ADD COLUMN IF NOT EXISTS purchase_date TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
            ADD COLUMN IF NOT EXISTS remaining_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
            ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS notes TEXT,
            ADD COLUMN IF NOT EXISTS created_by UUID,
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    `);

    await runLedgerQuery('purchase ledger defaults', `
        UPDATE purchase_ledger
        SET
            company_name = COALESCE(company_name, 'Supplier'),
            vehicle_label = COALESCE(vehicle_label, 'Vehicle'),
            paid_amount = COALESCE(paid_amount, 0),
            remaining_amount = COALESCE(remaining_amount, 0),
            created_at = COALESCE(created_at, NOW()),
            updated_at = COALESCE(updated_at, NOW())
    `);

    await runLedgerQuery('purchase ledger duplicate cleanup', `
        DELETE FROM purchase_ledger stale
        USING purchase_ledger keeper
        WHERE stale.stock_order_id IS NOT NULL
          AND keeper.stock_order_id = stale.stock_order_id
          AND stale.id <> keeper.id
          AND (
              keeper.updated_at > stale.updated_at
              OR (keeper.updated_at = stale.updated_at AND keeper.id::text > stale.id::text)
          )
    `);

    await runLedgerQuery('purchase ledger stock order unique index', `
        CREATE UNIQUE INDEX IF NOT EXISTS purchase_ledger_stock_order_id_unique
        ON purchase_ledger (stock_order_id)
    `);
};

const backfillPurchaseLedger = async () => {
    await pool.query(`
        INSERT INTO purchase_ledger (
            dealer_id,
            stock_order_id,
            company_profile_id,
            vehicle_id,
            company_name,
            vehicle_label,
            color,
            registration_number,
            chassis_number,
            engine_number,
            purchase_date,
            paid_amount,
            remaining_amount,
            payment_date,
            notes,
            created_by,
            created_at,
            updated_at
        )
        SELECT
            so.dealer_id,
            so.id,
            so.company_profile_id,
            v.id,
            COALESCE(so.company_name, cp.company_name, 'Supplier'),
            COALESCE(NULLIF(CONCAT_WS(' / ', so.brand, so.model, so.vehicle_type), ''), 'Vehicle'),
            COALESCE(v.color, so.color),
            v.registration_number,
            v.chassis_number,
            v.engine_number,
            COALESCE(so.order_date, so.expected_delivery_date, so.created_at),
            COALESCE(so.paid_amount, 0),
            COALESCE(
                so.remaining_amount,
                GREATEST(COALESCE(so.total_amount, 0) - COALESCE(so.paid_amount, 0), 0)
            ),
            so.purchase_paid_at,
            so.notes,
            so.ordered_by,
            NOW(),
            NOW()
        FROM stock_orders so
        LEFT JOIN company_profiles cp ON cp.id = so.company_profile_id
        LEFT JOIN LATERAL (
            SELECT id, registration_number, chassis_number, engine_number, color
            FROM vehicles
            WHERE source_stock_order_id = so.id
            ORDER BY created_at DESC
            LIMIT 1
        ) v ON true
        WHERE so.order_status = 'RECEIVED'
          AND so.received_quantity > 0
        ON CONFLICT (stock_order_id) DO UPDATE SET
            dealer_id = EXCLUDED.dealer_id,
            company_profile_id = EXCLUDED.company_profile_id,
            vehicle_id = EXCLUDED.vehicle_id,
            company_name = EXCLUDED.company_name,
            vehicle_label = EXCLUDED.vehicle_label,
            color = EXCLUDED.color,
            registration_number = EXCLUDED.registration_number,
            chassis_number = EXCLUDED.chassis_number,
            engine_number = EXCLUDED.engine_number,
            purchase_date = EXCLUDED.purchase_date,
            paid_amount = EXCLUDED.paid_amount,
            remaining_amount = EXCLUDED.remaining_amount,
            payment_date = EXCLUDED.payment_date,
            notes = EXCLUDED.notes,
            updated_at = NOW()
    `);
};

const syncPurchaseLedger = async () => {
    await syncPurchaseLedgerSchema();
    await backfillPurchaseLedger();
};

module.exports = {
    syncPurchaseLedger,
    syncPurchaseLedgerSchema,
    backfillPurchaseLedger,
};
