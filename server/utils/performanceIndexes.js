const pool = require('../config/db');

const PERFORMANCE_INDEX_STATEMENTS = [
    'CREATE INDEX IF NOT EXISTS idx_sales_transactions_created_at ON sales_transactions (created_at DESC)',
    'CREATE INDEX IF NOT EXISTS idx_sales_transactions_dealer_id ON sales_transactions (dealer_id)',
    'CREATE INDEX IF NOT EXISTS idx_sales_transactions_agent_id ON sales_transactions (agent_id)',
    'CREATE INDEX IF NOT EXISTS idx_sales_transactions_vehicle_id ON sales_transactions (vehicle_id)',
    'CREATE INDEX IF NOT EXISTS idx_sales_transactions_customer_id ON sales_transactions (customer_id)',
    'CREATE INDEX IF NOT EXISTS idx_sales_transactions_sale_mode ON sales_transactions (sale_mode)',
    'CREATE INDEX IF NOT EXISTS idx_sales_transactions_status ON sales_transactions (status)',
    'CREATE INDEX IF NOT EXISTS idx_sales_transactions_purchase_date ON sales_transactions (purchase_date)',
    'CREATE INDEX IF NOT EXISTS idx_sale_installments_sale_id ON sale_installments (sale_id)',
    'CREATE INDEX IF NOT EXISTS idx_sale_installments_dealer_id ON sale_installments (dealer_id)',
    'CREATE INDEX IF NOT EXISTS idx_sale_installments_status ON sale_installments (status)',
    'CREATE INDEX IF NOT EXISTS idx_sale_installments_paid_date ON sale_installments (paid_date)',
    'CREATE INDEX IF NOT EXISTS idx_sale_installments_due_date ON sale_installments (due_date)',
    'CREATE INDEX IF NOT EXISTS idx_customers_dealer_id ON customers (dealer_id)',
    'CREATE INDEX IF NOT EXISTS idx_customers_created_by_agent ON customers (created_by_agent)',
    'CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers (created_at DESC)',
    'CREATE INDEX IF NOT EXISTS idx_vehicles_dealer_id ON vehicles (dealer_id)',
    'CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles (status)',
    'CREATE INDEX IF NOT EXISTS idx_vehicles_source_stock_order_id ON vehicles (source_stock_order_id)',
    'CREATE INDEX IF NOT EXISTS idx_stock_orders_dealer_id ON stock_orders (dealer_id)',
    'CREATE INDEX IF NOT EXISTS idx_stock_orders_order_status ON stock_orders (order_status)',
    'CREATE INDEX IF NOT EXISTS idx_stock_orders_product_id ON stock_orders (product_id)',
    'CREATE INDEX IF NOT EXISTS idx_stock_orders_company_profile_id ON stock_orders (company_profile_id)',
    'CREATE INDEX IF NOT EXISTS idx_stock_orders_ordered_by ON stock_orders (ordered_by)',
    'CREATE INDEX IF NOT EXISTS idx_stock_orders_created_at ON stock_orders (created_at DESC)',
    'CREATE INDEX IF NOT EXISTS idx_stock_orders_received_at ON stock_orders (received_at)',
    'CREATE INDEX IF NOT EXISTS idx_product_catalog_dealer_id ON product_catalog (dealer_id)',
    'CREATE INDEX IF NOT EXISTS idx_product_catalog_created_by ON product_catalog (created_by)',
    'CREATE INDEX IF NOT EXISTS idx_company_profiles_dealer_id ON company_profiles (dealer_id)',
    'CREATE INDEX IF NOT EXISTS idx_company_profiles_created_by ON company_profiles (created_by)',
    'CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees (user_id)',
    'CREATE INDEX IF NOT EXISTS idx_employees_dealer_id ON employees (dealer_id)',
    'CREATE INDEX IF NOT EXISTS idx_employees_role_id ON employees (role_id)',
    'CREATE INDEX IF NOT EXISTS idx_employee_commissions_sale_id ON employee_commissions (sale_id)',
    'CREATE INDEX IF NOT EXISTS idx_employee_commissions_installment_id ON employee_commissions (installment_id)',
    'CREATE INDEX IF NOT EXISTS idx_employee_commissions_employee_id ON employee_commissions (employee_id)',
    'CREATE INDEX IF NOT EXISTS idx_employee_commissions_commission_date ON employee_commissions (commission_date)',
    'CREATE INDEX IF NOT EXISTS idx_employee_advances_employee_id ON employee_advances (employee_id)',
    'CREATE INDEX IF NOT EXISTS idx_employee_advances_advance_date ON employee_advances (advance_date)',
    'CREATE INDEX IF NOT EXISTS idx_employee_payrolls_employee_id ON employee_payrolls (employee_id)',
    'CREATE INDEX IF NOT EXISTS idx_employee_payrolls_payroll_month ON employee_payrolls (payroll_month)',
    'CREATE INDEX IF NOT EXISTS idx_workflow_tasks_entity ON workflow_tasks (entity_type, entity_id)',
    'CREATE INDEX IF NOT EXISTS idx_workflow_tasks_status ON workflow_tasks (task_status)',
    'CREATE INDEX IF NOT EXISTS idx_workflow_tasks_dealer_id ON workflow_tasks (dealer_id)',
    'CREATE INDEX IF NOT EXISTS idx_workflow_tasks_created_by ON workflow_tasks (created_by)',
    'CREATE INDEX IF NOT EXISTS idx_workflow_tasks_acted_by ON workflow_tasks (acted_by)',
    'CREATE INDEX IF NOT EXISTS idx_users_dealer_id ON users (dealer_id)',
    'CREATE INDEX IF NOT EXISTS idx_users_role_id ON users (role_id)'
];

let performanceIndexPromise = null;

const ensurePerformanceIndexes = async () => {
    if (!performanceIndexPromise) {
        performanceIndexPromise = (async () => {
            for (const statement of PERFORMANCE_INDEX_STATEMENTS) {
                try {
                    await pool.query(statement);
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
