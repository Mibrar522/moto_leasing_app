const pool = require('../config/db');

const OWNED_TABLES = [
    'app_ads',
    'customers',
    'employees',
    'product_catalog',
    'company_profiles',
    'stock_orders',
    'sales_transactions',
    'customer_orders',
    'lease_applications',
    'workflow_definitions',
    'workflow_tasks',
];

const SYNC_CACHE_MS = 60 * 1000;
let syncInFlight = null;
let lastSyncCompletedAt = 0;

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

const syncUsersToDealerProfiles = async () => {
    await run(`
        UPDATE users u
        SET dealer_id = dealer_scope.dealer_id
        FROM (
            SELECT DISTINCT ON (u2.id)
                u2.id AS user_id,
                COALESCE(admin_dealer.id, email_dealer.id) AS dealer_id
            FROM users u2
            LEFT JOIN dealers admin_dealer ON admin_dealer.admin_user_id = u2.id
            LEFT JOIN dealers email_dealer ON LOWER(email_dealer.contact_email) = LOWER(u2.email)
            WHERE COALESCE(admin_dealer.id, email_dealer.id) IS NOT NULL
            ORDER BY
                u2.id,
                CASE WHEN admin_dealer.id IS NOT NULL THEN 0 ELSE 1 END
        ) dealer_scope
        WHERE u.id = dealer_scope.user_id
          AND (u.dealer_id IS NULL OR u.dealer_id <> dealer_scope.dealer_id)
    `);

    await run(`
        UPDATE employees e
        SET dealer_id = u.dealer_id
        FROM users u
        WHERE e.user_id = u.id
          AND u.dealer_id IS NOT NULL
          AND e.dealer_id <> u.dealer_id
    `);
};

const syncDealerOwnershipLight = async () => {
    await ensureColumn('product_catalog', 'dealer_id', 'UUID');
    await ensureColumn('product_catalog', 'created_by', 'UUID');
    await ensureColumn('company_profiles', 'dealer_id', 'UUID');
    await ensureColumn('company_profiles', 'created_by', 'UUID');
    await ensureColumn('stock_orders', 'dealer_id', 'UUID');

    await syncUsersToDealerProfiles();

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
        SET dealer_id = stock_scope.dealer_id
        FROM (
            SELECT
                so2.id,
                COALESCE(order_user.dealer_id, pc.dealer_id, cp.dealer_id) AS dealer_id
            FROM stock_orders so2
            LEFT JOIN users order_user ON order_user.id = so2.ordered_by
            LEFT JOIN product_catalog pc ON pc.id = so2.product_id
            LEFT JOIN company_profiles cp ON cp.id = so2.company_profile_id
            WHERE COALESCE(order_user.dealer_id, pc.dealer_id, cp.dealer_id) IS NOT NULL
        ) stock_scope
        WHERE stock_scope.id = so.id
          AND (so.dealer_id IS NULL OR so.dealer_id <> stock_scope.dealer_id)
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
};

const syncDealerOwnershipForRequest = async () => {
    try {
        await syncDealerOwnershipLight();
        return true;
    } catch (error) {
        console.warn('Dealer ownership request repair skipped:', error.message);
        return false;
    }
};

const performDealerOwnershipSync = async () => {
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
    await ensureColumn('app_ads', 'dealer_id', 'UUID');
    await ensureColumn('customer_orders', 'dealer_id', 'UUID');
    await ensureColumn('lease_applications', 'dealer_id', 'UUID');

    await syncUsersToDealerProfiles();

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
        SET dealer_id = stock_scope.dealer_id
        FROM (
            SELECT
                so2.id,
                COALESCE(order_user.dealer_id, pc.dealer_id, cp.dealer_id) AS dealer_id
            FROM stock_orders so2
            LEFT JOIN users order_user ON order_user.id = so2.ordered_by
            LEFT JOIN product_catalog pc ON pc.id = so2.product_id
            LEFT JOIN company_profiles cp ON cp.id = so2.company_profile_id
            WHERE COALESCE(order_user.dealer_id, pc.dealer_id, cp.dealer_id) IS NOT NULL
        ) stock_scope
        WHERE stock_scope.id = so.id
          AND (so.dealer_id IS NULL OR so.dealer_id <> stock_scope.dealer_id)
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
        SET dealer_id = sale_scope.dealer_id
        FROM (
            SELECT
                st2.id,
                COALESCE(c.dealer_id, agent.dealer_id, so.dealer_id) AS dealer_id
            FROM sales_transactions st2
            JOIN customers c ON c.id = st2.customer_id
            JOIN users agent ON agent.id = st2.agent_id
            LEFT JOIN vehicles v ON v.id = st2.vehicle_id
            LEFT JOIN stock_orders so ON so.id = v.source_stock_order_id
            WHERE COALESCE(c.dealer_id, agent.dealer_id, so.dealer_id) IS NOT NULL
        ) sale_scope
        WHERE sale_scope.id = st.id
          AND st.dealer_id IS NULL
    `);

    await run(`
        UPDATE customer_orders co
        SET dealer_id = order_scope.dealer_id
        FROM (
            SELECT
                co2.id,
                COALESCE(ca.preferred_dealer_id, so.dealer_id, order_user.dealer_id, pc.dealer_id) AS dealer_id
            FROM customer_orders co2
            JOIN customer_accounts ca ON ca.id = co2.customer_account_id
            LEFT JOIN vehicles v ON v.id = co2.vehicle_id
            LEFT JOIN stock_orders so ON so.id = v.source_stock_order_id
            LEFT JOIN users order_user ON order_user.id = so.ordered_by
            LEFT JOIN product_catalog pc ON pc.id = COALESCE(co2.product_id, so.product_id)
            WHERE COALESCE(ca.preferred_dealer_id, so.dealer_id, order_user.dealer_id, pc.dealer_id) IS NOT NULL
        ) order_scope
        WHERE order_scope.id = co.id
          AND co.dealer_id IS NULL
    `);

    await run(`
        UPDATE lease_applications la
        SET dealer_id = lease_scope.dealer_id
        FROM (
            SELECT
                la2.id,
                COALESCE(c.dealer_id, agent.dealer_id, so.dealer_id, order_user.dealer_id, pc.dealer_id) AS dealer_id
            FROM lease_applications la2
            JOIN customers c ON c.id = la2.customer_id
            LEFT JOIN users agent ON agent.id = la2.agent_id
            LEFT JOIN vehicles v ON v.id = la2.vehicle_id
            LEFT JOIN stock_orders so ON so.id = v.source_stock_order_id
            LEFT JOIN users order_user ON order_user.id = so.ordered_by
            LEFT JOIN product_catalog pc ON pc.id = so.product_id
            WHERE COALESCE(c.dealer_id, agent.dealer_id, so.dealer_id, order_user.dealer_id, pc.dealer_id) IS NOT NULL
        ) lease_scope
        WHERE lease_scope.id = la.id
          AND la.dealer_id IS NULL
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
    await run('CREATE INDEX IF NOT EXISTS idx_app_ads_dealer_id ON app_ads(dealer_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_customer_orders_dealer_id ON customer_orders(dealer_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_lease_applications_dealer_id ON lease_applications(dealer_id)');

    for (const table of OWNED_TABLES) {
        await ensureRequiredDealerConstraint(table);
        await validateRequiredDealerConstraint(table);
        await warnUnownedRows(table);
    }
};

const syncDealerOwnership = async ({ force = false } = {}) => {
    const now = Date.now();
    if (!force && syncInFlight) {
        return syncInFlight;
    }
    if (!force && lastSyncCompletedAt && now - lastSyncCompletedAt < SYNC_CACHE_MS) {
        return;
    }

    syncInFlight = performDealerOwnershipSync()
        .then(() => {
            lastSyncCompletedAt = Date.now();
        })
        .finally(() => {
            syncInFlight = null;
        });

    return syncInFlight;
};

module.exports = { syncDealerOwnership, syncDealerOwnershipForRequest };
