import { useEffect, useMemo, useState } from 'react';
import API from '../../api/axios';
import AppLayout from '../../layouts/AppLayout';

const pageConfig = {
  applications: {
    title: 'Applications',
    dataKey: 'applications',
    empty: 'No applications found.',
    columns: [
      ['Customer', 'customer_name'],
      ['Vehicle', (row) => [row.brand, row.model].filter(Boolean).join(' ')],
      ['Status', 'status'],
      ['Created', (row) => String(row.created_at || '').slice(0, 10)],
    ],
  },
  customers: {
    title: 'Customers',
    dataKey: 'customers',
    empty: 'No customers found.',
    columns: [
      ['Name', 'full_name'],
      ['CNIC / Passport', 'cnic_passport_number'],
      ['Phone', 'contact_phone'],
      ['Dealer', 'dealer_name'],
    ],
  },
  employees: {
    title: 'Employees',
    dataKey: 'employees',
    empty: 'No employees found.',
    columns: [
      ['Name', 'full_name'],
      ['Code', 'employee_code'],
      ['Role', 'role_name'],
      ['Dealer', 'dealer_name'],
    ],
  },
  products: {
    title: 'Products',
    dataKey: 'products',
    empty: 'No products found.',
    columns: [
      ['Vehicle', (row) => [row.brand, row.model].filter(Boolean).join(' ')],
      ['Type', 'vehicle_type'],
      ['Price', (row) => formatCurrency(row.actual_price || row.price)],
      ['Status', 'status'],
    ],
  },
  companies: {
    title: 'Company Profile',
    dataKey: 'companies',
    empty: 'No company profiles found.',
    columns: [
      ['Company', 'company_name'],
      ['Email', 'company_email'],
      ['Phone', 'company_phone'],
      ['Contact', 'contact_person'],
    ],
  },
  stock: {
    title: 'Stock Orders',
    dataKey: 'stockOrders',
    empty: 'No stock orders found.',
    columns: [
      ['Company', (row) => row.company_name || row.company_email],
      ['Vehicle', (row) => [row.brand, row.model, row.color].filter(Boolean).join(' ')],
      ['Amount', (row) => formatCurrency(row.order_amount || row.actual_price)],
      ['Status', (row) => row.order_status || row.status],
    ],
  },
  sales: {
    title: 'Sales',
    dataKey: 'salesTransactions',
    empty: 'No sales found.',
    columns: [
      ['Customer', 'customer_name'],
      ['Vehicle', (row) => [row.brand, row.model].filter(Boolean).join(' ')],
      ['Mode', 'sale_mode'],
      ['Total', (row) => formatCurrency(row.total_price || row.sale_price)],
    ],
  },
  transactions: {
    title: 'Adhoc Transactions',
    dataKey: 'salesTransactions',
    empty: 'No transactions found.',
    columns: [
      ['Customer', 'customer_name'],
      ['Mode', 'sale_mode'],
      ['Status', 'status'],
      ['Total', (row) => formatCurrency(row.total_price || row.sale_price)],
    ],
  },
  installments: {
    title: 'Installments',
    dataKey: 'salesTransactions',
    empty: 'No installment sales found.',
    filter: (row) => row.sale_mode === 'INSTALLMENT',
    columns: [
      ['Customer', 'customer_name'],
      ['Vehicle', (row) => [row.brand, row.model].filter(Boolean).join(' ')],
      ['Monthly', (row) => formatCurrency(row.monthly_installment)],
      ['Status', 'status'],
    ],
  },
  workflow: {
    title: 'Workflow',
    dataKey: 'workflowTasks',
    empty: 'No workflow tasks found.',
    columns: [
      ['Task', 'task_title'],
      ['Requester', 'requester_name'],
      ['Status', 'status'],
      ['Created', (row) => String(row.created_at || '').slice(0, 10)],
    ],
  },
  'user-tasks': {
    title: 'User Tasks',
    dataKey: 'workflowTasks',
    empty: 'No user tasks found.',
    columns: [
      ['Task', 'task_title'],
      ['Requester', 'requester_name'],
      ['Status', 'status'],
      ['Created', (row) => String(row.created_at || '').slice(0, 10)],
    ],
  },
  access: {
    title: 'Access Control',
    dataKey: 'roles',
    empty: 'No roles found.',
    columns: [
      ['Role', 'role_name'],
      ['ID', 'id'],
    ],
  },
  dealers: {
    title: 'Dealers',
    dataKey: 'dealers',
    empty: 'No dealers found.',
    columns: [
      ['Dealer', 'dealer_name'],
      ['Code', 'dealer_code'],
      ['Email', 'email'],
      ['Status', 'status'],
    ],
  },
  reports: {
    title: 'Reports',
    dataKey: 'salesTransactions',
    empty: 'No report data loaded.',
    columns: [
      ['Customer', 'customer_name'],
      ['Mode', 'sale_mode'],
      ['Status', 'status'],
      ['Total', (row) => formatCurrency(row.total_price || row.sale_price)],
    ],
  },
  'report-stock-inventory': {
    title: 'Stock Inventory Report',
    dataKey: 'products',
    empty: 'No stock inventory found.',
    columns: [
      ['Vehicle', (row) => [row.brand, row.model].filter(Boolean).join(' ')],
      ['Type', 'vehicle_type'],
      ['Price', (row) => formatCurrency(row.actual_price || row.price)],
      ['Status', 'status'],
    ],
  },
  'report-stock-received': {
    title: 'Stock Received Report',
    dataKey: 'stockOrders',
    empty: 'No received stock found.',
    filter: (row) => String(row.order_status || row.status || '').toUpperCase() === 'RECEIVED',
    columns: [
      ['Company', (row) => row.company_name || row.company_email],
      ['Vehicle', (row) => [row.brand, row.model, row.color].filter(Boolean).join(' ')],
      ['Amount', (row) => formatCurrency(row.order_amount || row.actual_price)],
      ['Status', (row) => row.order_status || row.status],
    ],
  },
  'report-customers': {
    title: 'Customer Report',
    dataKey: 'customers',
    empty: 'No customers found.',
    columns: [
      ['Name', 'full_name'],
      ['CNIC / Passport', 'cnic_passport_number'],
      ['Phone', 'contact_phone'],
      ['Dealer', 'dealer_name'],
    ],
  },
  'report-employees': {
    title: 'Employees Report',
    dataKey: 'employees',
    empty: 'No employees found.',
    columns: [
      ['Name', 'full_name'],
      ['Code', 'employee_code'],
      ['Role', 'role_name'],
      ['Dealer', 'dealer_name'],
    ],
  },
  'report-dealer-information': {
    title: 'Dealer Information Report',
    dataKey: 'dealers',
    empty: 'No dealers found.',
    columns: [
      ['Dealer', 'dealer_name'],
      ['Code', 'dealer_code'],
      ['Email', 'email'],
      ['Status', 'status'],
    ],
  },
};

[
  'report-daily-sales',
  'report-customer-transactions',
  'report-business-transactions',
  'report-invoice-view',
].forEach((key) => {
  pageConfig[key] = {
    ...pageConfig.reports,
    title: key
      .replace(/^report-/, '')
      .split('-')
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(' '),
  };
});

pageConfig['report-salary'] = {
  title: 'Salary Report',
  dataKey: 'employeePayrolls',
  empty: 'No salary records found.',
  columns: [
    ['Employee', 'employee_name'],
    ['Month', 'payroll_month'],
    ['Net Salary', (row) => formatCurrency(row.net_salary)],
    ['Status', 'status'],
  ],
};

pageConfig['report-dealer-employees'] = {
  ...pageConfig['report-employees'],
  title: 'Dealer Wise Employee Report',
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `Rs ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getCellValue = (row, column) => {
  const accessor = column[1];
  if (typeof accessor === 'function') return accessor(row);
  return row?.[accessor] ?? '';
};

export default function DomainDataPage({ pageKey }) {
  const config = pageConfig[pageKey] || pageConfig.customers;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    API.get('/admin/dashboard', { params: { page: pageKey } })
      .then((response) => {
        if (!cancelled) {
          setData(response.data || {});
          if (response.data?.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Unable to load this page.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pageKey]);

  const rows = useMemo(() => {
    const baseRows = Array.isArray(data[config.dataKey]) ? data[config.dataKey] : [];
    return config.filter ? baseRows.filter(config.filter) : baseRows;
  }, [config, data]);

  return (
    <AppLayout activePage={pageKey} title={config.title}>
      {loading ? <div className="feedback-card">Loading {config.title.toLowerCase()}...</div> : null}
      {error ? <div className="feedback-card error">{error}</div> : null}
      {!loading && !error ? (
        <div className="table-card">
          <div className="section-header">
            <div>
              <h3>{config.title}</h3>
              <p className="section-caption">{rows.length} record(s)</p>
            </div>
          </div>
          {rows.length === 0 ? (
            <div className="empty-state"><p>{config.empty}</p></div>
          ) : (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    {config.columns.map(([label]) => <th key={label}>{label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id || index}>
                      {config.columns.map((column) => (
                        <td key={column[0]}>{getCellValue(row, column) || '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </AppLayout>
  );
}
