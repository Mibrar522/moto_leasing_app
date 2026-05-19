const pool = require('../config/db');

const PERFORMANCE_INDEXES = [
    { table: 'sales_transactions', columns: ['created_at'], statement: 'CREATE INDEX IF NOT EXISTS idx_sales_transactions_created_at ON sales_transactions (created_at DESC)' },
    { table: 'sales_transactions', columns: ['dealer_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_sales_transactions_dealer_id ON sales_transactions (dealer_id)' },
    { table: 'sales_transactions', columns: ['dealer_id', 'created_at'], statement: 'CREATE INDEX IF NOT EXISTS idx_sales_transactions_dealer_created_at ON sales_transactions (dealer_id, created_at DESC)' },
    { table: 'sales_transactions', columns: ['agent_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_sales_transactions_agent_id ON sales_transactions (agent_id)' },
    { table: 'sales_transactions', columns: ['agent_id', 'created_at'], statement: 'CREATE INDEX IF NOT EXISTS idx_sales_transactions_agent_created_at ON sales_transactions (agent_id, created_at DESC)' },
    { table: 'sales_transactions', columns: ['vehicle_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_sales_transactions_vehicle_id ON sales_transactions (vehicle_id)' },
    { table: 'sales_transactions', columns: ['customer_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_sales_transactions_customer_id ON sales_transactions (customer_id)' },
    { table: 'sales_transactions', columns: ['sale_mode'], statement: 'CREATE INDEX IF NOT EXISTS idx_sales_transactions_sale_mode ON sales_transactions (sale_mode)' },
    { table: 'sales_transactions', columns: ['status'], statement: 'CREATE INDEX IF NOT EXISTS idx_sales_transactions_status ON sales_transactions (status)' },
    { table: 'sales_transactions', columns: ['purchase_date'], statement: 'CREATE INDEX IF NOT EXISTS idx_sales_transactions_purchase_date ON sales_transactions (purchase_date)' },
    { table: 'sale_installments', columns: ['sale_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_sale_installments_sale_id ON sale_installments (sale_id)' },
    { table: 'sale_installments', columns: ['sale_id', 'status'], statement: 'CREATE INDEX IF NOT EXISTS idx_sale_installments_sale_status ON sale_installments (sale_id, status)' },
    { table: 'sale_installments', columns: ['dealer_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_sale_installments_dealer_id ON sale_installments (dealer_id)' },
    { table: 'sale_installments', columns: ['status'], statement: 'CREATE INDEX IF NOT EXISTS idx_sale_installments_status ON sale_installments (status)' },
    { table: 'sale_installments', columns: ['paid_date'], statement: 'CREATE INDEX IF NOT EXISTS idx_sale_installments_paid_date ON sale_installments (paid_date)' },
    { table: 'sale_installments', columns: ['due_date'], statement: 'CREATE INDEX IF NOT EXISTS idx_sale_installments_due_date ON sale_installments (due_date)' },
    { table: 'customers', columns: ['dealer_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_customers_dealer_id ON customers (dealer_id)' },
    { table: 'customers', columns: ['created_by_agent'], statement: 'CREATE INDEX IF NOT EXISTS idx_customers_created_by_agent ON customers (created_by_agent)' },
    { table: 'customers', columns: ['created_at'], statement: 'CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers (created_at DESC)' },
    { table: 'vehicles', columns: ['dealer_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_vehicles_dealer_id ON vehicles (dealer_id)' },
    { table: 'vehicles', columns: ['status'], statement: 'CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles (status)' },
    { table: 'vehicles', columns: ['source_stock_order_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_vehicles_source_stock_order_id ON vehicles (source_stock_order_id)' },
    { table: 'stock_orders', columns: ['dealer_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_stock_orders_dealer_id ON stock_orders (dealer_id)' },
    { table: 'stock_orders', columns: ['dealer_id', 'created_at'], statement: 'CREATE INDEX IF NOT EXISTS idx_stock_orders_dealer_created_at ON stock_orders (dealer_id, created_at DESC)' },
    { table: 'stock_orders', columns: ['order_status'], statement: 'CREATE INDEX IF NOT EXISTS idx_stock_orders_order_status ON stock_orders (order_status)' },
    { table: 'stock_orders', columns: ['product_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_stock_orders_product_id ON stock_orders (product_id)' },
    { table: 'stock_orders', columns: ['company_profile_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_stock_orders_company_profile_id ON stock_orders (company_profile_id)' },
    { table: 'stock_orders', columns: ['ordered_by'], statement: 'CREATE INDEX IF NOT EXISTS idx_stock_orders_ordered_by ON stock_orders (ordered_by)' },
    { table: 'stock_orders', columns: ['created_at'], statement: 'CREATE INDEX IF NOT EXISTS idx_stock_orders_created_at ON stock_orders (created_at DESC)' },
    { table: 'stock_orders', columns: ['received_at'], statement: 'CREATE INDEX IF NOT EXISTS idx_stock_orders_received_at ON stock_orders (received_at)' },
    { table: 'product_catalog', columns: ['dealer_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_product_catalog_dealer_id ON product_catalog (dealer_id)' },
    { table: 'product_catalog', columns: ['created_by'], statement: 'CREATE INDEX IF NOT EXISTS idx_product_catalog_created_by ON product_catalog (created_by)' },
    { table: 'company_profiles', columns: ['dealer_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_company_profiles_dealer_id ON company_profiles (dealer_id)' },
    { table: 'company_profiles', columns: ['created_by'], statement: 'CREATE INDEX IF NOT EXISTS idx_company_profiles_created_by ON company_profiles (created_by)' },
    { table: 'employees', columns: ['user_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees (user_id)' },
    { table: 'employees', columns: ['dealer_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_employees_dealer_id ON employees (dealer_id)' },
    { table: 'employees', columns: ['role_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_employees_role_id ON employees (role_id)' },
    { table: 'employee_commissions', columns: ['sale_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_employee_commissions_sale_id ON employee_commissions (sale_id)' },
    { table: 'employee_commissions', columns: ['installment_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_employee_commissions_installment_id ON employee_commissions (installment_id)' },
    { table: 'employee_commissions', columns: ['employee_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_employee_commissions_employee_id ON employee_commissions (employee_id)' },
    { table: 'employee_commissions', columns: ['commission_date'], statement: 'CREATE INDEX IF NOT EXISTS idx_employee_commissions_commission_date ON employee_commissions (commission_date)' },
    { table: 'employee_advances', columns: ['employee_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_employee_advances_employee_id ON employee_advances (employee_id)' },
    { table: 'employee_advances', columns: ['advance_date'], statement: 'CREATE INDEX IF NOT EXISTS idx_employee_advances_advance_date ON employee_advances (advance_date)' },
    { table: 'employee_payrolls', columns: ['employee_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_employee_payrolls_employee_id ON employee_payrolls (employee_id)' },
    { table: 'employee_payrolls', columns: ['payroll_month'], statement: 'CREATE INDEX IF NOT EXISTS idx_employee_payrolls_payroll_month ON employee_payrolls (payroll_month)' },
    { table: 'workflow_tasks', columns: ['entity_type', 'entity_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_workflow_tasks_entity ON workflow_tasks (entity_type, entity_id)' },
    { table: 'workflow_tasks', columns: ['task_status'], statement: 'CREATE INDEX IF NOT EXISTS idx_workflow_tasks_status ON workflow_tasks (task_status)' },
    { table: 'workflow_tasks', columns: ['dealer_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_workflow_tasks_dealer_id ON workflow_tasks (dealer_id)' },
    { table: 'workflow_tasks', columns: ['created_by'], statement: 'CREATE INDEX IF NOT EXISTS idx_workflow_tasks_created_by ON workflow_tasks (created_by)' },
    { table: 'workflow_tasks', columns: ['acted_by'], statement: 'CREATE INDEX IF NOT EXISTS idx_workflow_tasks_acted_by ON workflow_tasks (acted_by)' },
    { table: 'users', columns: ['dealer_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_users_dealer_id ON users (dealer_id)' },
    { table: 'users', columns: ['role_id'], statement: 'CREATE INDEX IF NOT EXISTS idx_users_role_id ON users (role_id)' },
];

let performanceIndexPromise = null;
const tableColumnCache = new Map();

const getTableColumns = async (tableName) => {
    if (tableColumnCache.has(tableName)) {
        return tableColumnCache.get(tableName);
    }

    const { rows } = await pool.query(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = ANY(current_schemas(false))
          AND table_name = $1
        `,
        [tableName]
    );
    const columns = new Set(rows.map((row) => row.column_name));
    tableColumnCache.set(tableName, columns);
    return columns;
};

const ensurePerformanceIndexes = async () => {
    if (!performanceIndexPromise) {
        performanceIndexPromise = (async () => {
            for (const indexConfig of PERFORMANCE_INDEXES) {
                try {
                    const tableResult = await pool.query('SELECT to_regclass($1) AS table_name', [indexConfig.table]);
                    if (!tableResult.rows[0]?.table_name) {
                        continue;
                    }

                    const columns = await getTableColumns(indexConfig.table);
                    const hasColumns = indexConfig.columns.every((column) => columns.has(column));
                    if (!hasColumns) {
                        continue;
                    }

                    await pool.query(indexConfig.statement);
                } catch (error) {
                    console.warn('Performance index skipped:', error.message);
                }
            }
        })();
    }

    return performanceIndexPromise;
};

module.exports = {
    ensurePerformanceIndexes,
};