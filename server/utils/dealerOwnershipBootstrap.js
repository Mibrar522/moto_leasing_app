const pool = require('../config/db');

const OWNED_TABLES = [
    'product_catalog',
    'company_profiles',
    'stock_orders',
    'sales_transactions',
];

const run = (sql, params = []) => pool.query(sql, params);

const ensureColumn = async (table, column, definition) => {
    await run(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${column} ${definition}`);
};

const ensureRequiredDealerConstraint = async (table) => {
    const constraintName = `${table}_dealer_id_required`;
    await run(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = '${constraintName}'
            ) THEN
                ALTER TABLE ${table}
                    ADD CONSTRAINT ${constraintName}
                    CHECK (dealer_id IS NOT NULL) NOT VALID;
            END IF;
        END $$;
    `);
};

const validateRequiredDealerConstraint = async (table) => {
    const constraintName = `${table}_dealer_id_required`;

    try {
        await run(`ALTER TABLE ${table} VALIDATE CONSTRAINT ${constraintName}`);
    } catch (error) {
        console.warn(`Dealer ownership validation pending for ${table}:`, error.message);
    }
};

const warnUnownedRows = async (table) => {
    const result = await run(`SELECT COUNT(*)::int AS total FROM ${table} WHERE dealer_id IS NULL`);
    const total = Number(result.rows[0]?.total || 0);

    if (total > 0) {
        console.warn(`Dealer ownership warning: ${table} still has ${total} legacy row(s) without dealer_id.`);
    }
};

const syncDealerOwnership = async () => {
    await ensureColumn('product_catalog', 'dealer_id', 'UUID');
    await ensureColumn('product_catalog', 'created_by', 'UUID');
    await ensureColumn('company_profiles', 'dealer_id', 'UUID');
    await ensureColumn('company_profiles', 'created_by', 'UUID');
    await ensureColumn('stock_orders', 'dealer_id', 'UUID');
    await ensureColumn('sales_transactions', 'dealer_id', 'UUID');
    await ensureColumn('customers', 'dealer_id', 'UUID');
    await ensureColumn('customers', 'created_by_agent', 'UUID');
    await ensureColumn('employees', 'dealer_id', 'UUID');
    await ensureColumn('employees', 'created_by', 'UUID');
    await ensureColumn('workflow_definitions', 'dealer_id', 'UUID');
    await ensureColumn('workflow_tasks', 'dealer_id', 'UUID');

    await run(`
        UPDATE product_catalog pc
        SET dealer_id = creator.dealer_id
        FROM users creator
        WHERE creator.id = pc.created_by
          AND pc.dealer_id IS NULL
          AND creator.dealer_id IS NOT NULL
    `);

    await run(`
        UPDATE company_profiles cp
        SET dealer_id = creator.dealer_id
        FROM users creator
        WHERE creator.id = cp.created_by
          AND cp.dealer_id IS NULL
          AND creator.dealer_id IS NOT NULL
    `);

    await run(`
        UPDATE stock_orders so
        SET dealer_id = COALESCE(order_user.dealer_id, pc.dealer_id, cp.dealer_id)
        FROM users order_user
        LEFT JOIN product_catalog pc ON pc.id = so.product_id
        LEFT JOIN company_profiles cp ON cp.id = so.company_profile_id
        WHERE order_user.id = so.ordered_by
          AND so.dealer_id IS NULL
          AND COALESCE(order_user.dealer_id, pc.dealer_id, cp.dealer_id) IS NOT NULL
    `);

    await run(`
        UPDATE product_catalog pc
        SET dealer_id = stock_owner.dealer_id
        FROM (
            SELECT DISTINCT ON (so.product_id)
                so.product_id,
                so.dealer_id
            FROM stock_orders so
            WHERE so.product_id IS NOT NULL
              AND so.dealer_id IS NOT NULL
            ORDER BY so.product_id, so.created_at DESC
        ) stock_owner
        WHERE stock_owner.product_id = pc.id
          AND pc.dealer_id IS NULL
    `);

    await run(`
        UPDATE company_profiles cp
        SET dealer_id = stock_owner.dealer_id
        FROM (
            SELECT DISTINCT ON (so.company_profile_id)
                so.company_profile_id,
                so.dealer_id
            FROM stock_orders so
            WHERE so.company_profile_id IS NOT NULL
              AND so.dealer_id IS NOT NULL
            ORDER BY so.company_profile_id, so.created_at DESC
        ) stock_owner
        WHERE stock_owner.company_profile_id = cp.id
          AND cp.dealer_id IS NULL
    `);

    await run(`
        UPDATE sales_transactions st
        SET dealer_id = COALESCE(c.dealer_id, agent.dealer_id, so.dealer_id)
        FROM customers c
        JOIN users agent ON agent.id = st.agent_id
        LEFT JOIN vehicles v ON v.id = st.vehicle_id
        LEFT JOIN stock_orders so ON so.id = v.source_stock_order_id
        WHERE c.id = st.customer_id
          AND st.dealer_id IS NULL
          AND COALESCE(c.dealer_id, agent.dealer_id, so.dealer_id) IS NOT NULL
    `);

    await run(`
        UPDATE workflow_tasks wt
        SET dealer_id = wd.dealer_id
        FROM workflow_definitions wd
        WHERE wd.id = wt.workflow_definition_id
          AND wt.dealer_id IS NULL
          AND wd.dealer_id IS NOT NULL
    `);

    await run('CREATE INDEX IF NOT EXISTS idx_product_catalog_dealer_id ON product_catalog(dealer_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_company_profiles_dealer_id ON company_profiles(dealer_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_stock_orders_dealer_id ON stock_orders(dealer_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_sales_transactions_dealer_id ON sales_transactions(dealer_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_customers_dealer_id ON customers(dealer_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_employees_dealer_id ON employees(dealer_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_workflow_definitions_dealer_id ON workflow_definitions(dealer_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_workflow_tasks_dealer_id ON workflow_tasks(dealer_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_vehicles_source_stock_order_id ON vehicles(source_stock_order_id)');

    for (const table of OWNED_TABLES) {
        await ensureRequiredDealerConstraint(table);
        await validateRequiredDealerConstraint(table);
        await warnUnownedRows(table);
    }
};

module.exports = { syncDealerOwnership };
