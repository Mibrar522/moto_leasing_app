import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import './App.css';

const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DashboardHomePage = lazy(() => import('./pages/dashboardPages/DashboardHomePage'));
const ApplicationsPage = lazy(() => import('./pages/dashboardPages/ApplicationsPage'));
const WorkflowPage = lazy(() => import('./pages/dashboardPages/WorkflowPage'));
const UserTasksPage = lazy(() => import('./pages/dashboardPages/UserTasksPage'));
const AccessControlPage = lazy(() => import('./pages/dashboardPages/AccessControlPage'));
const CustomersPage = lazy(() => import('./pages/dashboardPages/CustomersPage'));
const ProductsPage = lazy(() => import('./pages/dashboardPages/ProductsPage'));
const StockPage = lazy(() => import('./pages/dashboardPages/StockPage'));
const SalesPage = lazy(() => import('./pages/dashboardPages/SalesPage'));
const InstallmentsPage = lazy(() => import('./pages/dashboardPages/InstallmentsPage'));
const EmployeesPage = lazy(() => import('./pages/dashboardPages/EmployeesPage'));
const DealersPage = lazy(() => import('./pages/dashboardPages/DealersPage'));
const ReportsPage = lazy(() => import('./pages/dashboardPages/ReportsPage'));
const TransactionsPage = lazy(() => import('./pages/dashboardPages/TransactionsPage'));
const CompaniesPage = lazy(() => import('./pages/dashboardPages/CompaniesPage'));
const AdsManager = lazy(() => import('./pages/AdsManager'));

const hasSessionToken = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

function ProtectedRoute({ children }) {
  return hasSessionToken() ? children : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  return hasSessionToken() ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  const isAuthenticated = hasSessionToken();

  return (
    <Router>
      <Suspense fallback={<div className="app-loading">Loading...</div>}>
        <Routes>
          {/* Entry Point */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />

          {/* Auth Routes */}
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

          {/* Application Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardHomePage /></ProtectedRoute>} />
          <Route path="/dashboard/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
          <Route path="/dashboard/workflow" element={<ProtectedRoute><WorkflowPage /></ProtectedRoute>} />
          <Route path="/dashboard/user-tasks" element={<ProtectedRoute><UserTasksPage /></ProtectedRoute>} />
          <Route path="/dashboard/access" element={<ProtectedRoute><AccessControlPage /></ProtectedRoute>} />
          <Route path="/dashboard/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
          <Route path="/dashboard/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
          <Route path="/dashboard/stock" element={<ProtectedRoute><StockPage /></ProtectedRoute>} />
          <Route path="/dashboard/sales" element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
          <Route path="/dashboard/installments" element={<ProtectedRoute><InstallmentsPage /></ProtectedRoute>} />
          <Route path="/dashboard/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
          <Route path="/dashboard/dealers" element={<ProtectedRoute><DealersPage /></ProtectedRoute>} />
          <Route path="/dashboard/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/dashboard/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
          <Route path="/dashboard/companies" element={<ProtectedRoute><CompaniesPage /></ProtectedRoute>} />
          <Route path="/dashboard/report-stock-inventory" element={<ProtectedRoute><ReportsPage pageKey="report-stock-inventory" /></ProtectedRoute>} />
          <Route path="/dashboard/report-daily-sales" element={<ProtectedRoute><ReportsPage pageKey="report-daily-sales" /></ProtectedRoute>} />
          <Route path="/dashboard/report-stock-received" element={<ProtectedRoute><ReportsPage pageKey="report-stock-received" /></ProtectedRoute>} />
          <Route path="/dashboard/report-customers" element={<ProtectedRoute><ReportsPage pageKey="report-customers" /></ProtectedRoute>} />
          <Route path="/dashboard/report-customer-transactions" element={<ProtectedRoute><ReportsPage pageKey="report-customer-transactions" /></ProtectedRoute>} />
          <Route path="/dashboard/report-business-transactions" element={<ProtectedRoute><ReportsPage pageKey="report-business-transactions" /></ProtectedRoute>} />
          <Route path="/dashboard/report-invoice-view" element={<ProtectedRoute><ReportsPage pageKey="report-invoice-view" /></ProtectedRoute>} />
          <Route path="/dashboard/report-employees" element={<ProtectedRoute><ReportsPage pageKey="report-employees" /></ProtectedRoute>} />
          <Route path="/dashboard/report-salary" element={<ProtectedRoute><ReportsPage pageKey="report-salary" /></ProtectedRoute>} />
          <Route path="/dashboard/report-dealer-information" element={<ProtectedRoute><ReportsPage pageKey="report-dealer-information" /></ProtectedRoute>} />
          <Route path="/dashboard/report-dealer-employees" element={<ProtectedRoute><ReportsPage pageKey="report-dealer-employees" /></ProtectedRoute>} />
          <Route path="/dashboard/:dashboardPage" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/ads" element={<ProtectedRoute><AdsManager /></ProtectedRoute>} />

          {/* Legacy Support (Important for old bookmarks/cached links) */}
          <Route path="/app/dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/app/ads" element={<Navigate to="/ads" replace />} />
          <Route path="/app/*" element={<Navigate to="/dashboard" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
