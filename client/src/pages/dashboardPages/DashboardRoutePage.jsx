import { lazy } from 'react';
import { useParams } from 'react-router-dom';
import DomainDataPage from './DomainDataPage';

const Dashboard = lazy(() => import('../Dashboard'));

const domainPages = new Set([
  'applications',
  'workflow',
  'user-tasks',
  'access',
  'customers',
  'products',
  'stock',
  'sales',
  'installments',
  'employees',
  'dealers',
  'reports',
  'report-stock-inventory',
  'report-daily-sales',
  'report-stock-received',
  'report-customers',
  'report-customer-transactions',
  'report-business-transactions',
  'report-invoice-view',
  'report-employees',
  'report-salary',
  'report-dealer-information',
  'report-dealer-employees',
  'transactions',
  'companies',
]);

export default function DashboardRoutePage({ pageKey = '' }) {
  const params = useParams();
  const resolvedPage = pageKey || params.dashboardPage || 'dashboard';

  if (resolvedPage === 'dashboard') {
    return <Dashboard pageKey="dashboard" />;
  }

  if (domainPages.has(resolvedPage)) {
    return <DomainDataPage pageKey={resolvedPage} />;
  }

  return <DomainDataPage pageKey="customers" />;
}
