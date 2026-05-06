import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import './App.css';

const Register = lazy(() => import('./pages/Register'));
const DashboardRoutePage = lazy(() => import('./pages/dashboardPages/DashboardRoutePage'));
const AdsManager = lazy(() => import('./pages/AdsManager'));
const Customers = lazy(() => import('./pages/Customers'));
const Employees = lazy(() => import('./pages/Employees'));
const Applications = lazy(() => import('./pages/Applications'));
const Sales = lazy(() => import('./pages/Sales'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Installments = lazy(() => import('./pages/Installments'));
const CompanyProfile = lazy(() => import('./pages/CompanyProfile'));
const Stock = lazy(() => import('./pages/Stock'));
const Products = lazy(() => import('./pages/Products'));
const Workflow = lazy(() => import('./pages/Workflow'));
const UserTasks = lazy(() => import('./pages/UserTasks'));
const AccessControl = lazy(() => import('./pages/AccessControl'));
const Dealers = lazy(() => import('./pages/Dealers'));
const Reports = lazy(() => import('./pages/reports/Reports'));
const StockInventoryReport = lazy(() => import('./pages/reports/StockInventoryReport'));
const DailySalesReport = lazy(() => import('./pages/reports/DailySalesReport'));
const StockReceivedReport = lazy(() => import('./pages/reports/StockReceivedReport'));
const CustomersReport = lazy(() => import('./pages/reports/CustomersReport'));
const CustomerTransactionsReport = lazy(() => import('./pages/reports/CustomerTransactionsReport'));
const BusinessTransactionsReport = lazy(() => import('./pages/reports/BusinessTransactionsReport'));
const InvoiceViewReport = lazy(() => import('./pages/reports/InvoiceViewReport'));
const EmployeesReport = lazy(() => import('./pages/reports/EmployeesReport'));
const SalaryReport = lazy(() => import('./pages/reports/SalaryReport'));
const DealerInformationReport = lazy(() => import('./pages/reports/DealerInformationReport'));
const DealerEmployeesReport = lazy(() => import('./pages/reports/DealerEmployeesReport'));

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
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRoutePage /></ProtectedRoute>} />
          <Route path="/dashboard/applications" element={<ProtectedRoute><DashboardRoutePage pageKey="applications" PageComponent={Applications} /></ProtectedRoute>} />
          <Route path="/dashboard/workflow" element={<ProtectedRoute><DashboardRoutePage pageKey="workflow" PageComponent={Workflow} /></ProtectedRoute>} />
          <Route path="/dashboard/user-tasks" element={<ProtectedRoute><DashboardRoutePage pageKey="user-tasks" PageComponent={UserTasks} /></ProtectedRoute>} />
          <Route path="/dashboard/access" element={<ProtectedRoute><DashboardRoutePage pageKey="access" PageComponent={AccessControl} /></ProtectedRoute>} />
          <Route path="/dashboard/customers" element={<ProtectedRoute><DashboardRoutePage pageKey="customers" PageComponent={Customers} /></ProtectedRoute>} />
          <Route path="/dashboard/products" element={<ProtectedRoute><DashboardRoutePage pageKey="products" PageComponent={Products} /></ProtectedRoute>} />
          <Route path="/dashboard/stock" element={<ProtectedRoute><DashboardRoutePage pageKey="stock" PageComponent={Stock} /></ProtectedRoute>} />
          <Route path="/dashboard/sales" element={<ProtectedRoute><DashboardRoutePage pageKey="sales" PageComponent={Sales} /></ProtectedRoute>} />
          <Route path="/dashboard/installments" element={<ProtectedRoute><DashboardRoutePage pageKey="installments" PageComponent={Installments} /></ProtectedRoute>} />
          <Route path="/dashboard/employees" element={<ProtectedRoute><DashboardRoutePage pageKey="employees" PageComponent={Employees} /></ProtectedRoute>} />
          <Route path="/dashboard/dealers" element={<ProtectedRoute><DashboardRoutePage pageKey="dealers" PageComponent={Dealers} /></ProtectedRoute>} />
          <Route path="/dashboard/reports" element={<ProtectedRoute><DashboardRoutePage pageKey="reports" PageComponent={Reports} /></ProtectedRoute>} />
          <Route path="/dashboard/transactions" element={<ProtectedRoute><DashboardRoutePage pageKey="transactions" PageComponent={Transactions} /></ProtectedRoute>} />
          <Route path="/dashboard/companies" element={<ProtectedRoute><DashboardRoutePage pageKey="companies" PageComponent={CompanyProfile} /></ProtectedRoute>} />
          <Route path="/dashboard/report-stock-inventory" element={<ProtectedRoute><DashboardRoutePage pageKey="report-stock-inventory" PageComponent={StockInventoryReport} /></ProtectedRoute>} />
          <Route path="/dashboard/report-daily-sales" element={<ProtectedRoute><DashboardRoutePage pageKey="report-daily-sales" PageComponent={DailySalesReport} /></ProtectedRoute>} />
          <Route path="/dashboard/report-stock-received" element={<ProtectedRoute><DashboardRoutePage pageKey="report-stock-received" PageComponent={StockReceivedReport} /></ProtectedRoute>} />
          <Route path="/dashboard/report-customers" element={<ProtectedRoute><DashboardRoutePage pageKey="report-customers" PageComponent={CustomersReport} /></ProtectedRoute>} />
          <Route path="/dashboard/report-customer-transactions" element={<ProtectedRoute><DashboardRoutePage pageKey="report-customer-transactions" PageComponent={CustomerTransactionsReport} /></ProtectedRoute>} />
          <Route path="/dashboard/report-business-transactions" element={<ProtectedRoute><DashboardRoutePage pageKey="report-business-transactions" PageComponent={BusinessTransactionsReport} /></ProtectedRoute>} />
          <Route path="/dashboard/report-invoice-view" element={<ProtectedRoute><DashboardRoutePage pageKey="report-invoice-view" PageComponent={InvoiceViewReport} /></ProtectedRoute>} />
          <Route path="/dashboard/report-employees" element={<ProtectedRoute><DashboardRoutePage pageKey="report-employees" PageComponent={EmployeesReport} /></ProtectedRoute>} />
          <Route path="/dashboard/report-salary" element={<ProtectedRoute><DashboardRoutePage pageKey="report-salary" PageComponent={SalaryReport} /></ProtectedRoute>} />
          <Route path="/dashboard/report-dealer-information" element={<ProtectedRoute><DashboardRoutePage pageKey="report-dealer-information" PageComponent={DealerInformationReport} /></ProtectedRoute>} />
          <Route path="/dashboard/report-dealer-employees" element={<ProtectedRoute><DashboardRoutePage pageKey="report-dealer-employees" PageComponent={DealerEmployeesReport} /></ProtectedRoute>} />
          <Route path="/dashboard/:dashboardPage" element={<ProtectedRoute><DashboardRoutePage /></ProtectedRoute>} />
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
