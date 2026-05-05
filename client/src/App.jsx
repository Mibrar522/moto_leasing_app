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
          <Route path="/dashboard/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
          <Route path="/dashboard/workflow" element={<ProtectedRoute><Workflow /></ProtectedRoute>} />
          <Route path="/dashboard/user-tasks" element={<ProtectedRoute><UserTasks /></ProtectedRoute>} />
          <Route path="/dashboard/access" element={<ProtectedRoute><AccessControl /></ProtectedRoute>} />
          <Route path="/dashboard/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/dashboard/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/dashboard/stock" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
          <Route path="/dashboard/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
          <Route path="/dashboard/installments" element={<ProtectedRoute><Installments /></ProtectedRoute>} />
          <Route path="/dashboard/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
          <Route path="/dashboard/dealers" element={<ProtectedRoute><Dealers /></ProtectedRoute>} />
          <Route path="/dashboard/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/dashboard/transactions" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
          <Route path="/dashboard/companies" element={<ProtectedRoute><CompanyProfile /></ProtectedRoute>} />
          <Route path="/dashboard/report-stock-inventory" element={<ProtectedRoute><StockInventoryReport /></ProtectedRoute>} />
          <Route path="/dashboard/report-daily-sales" element={<ProtectedRoute><DailySalesReport /></ProtectedRoute>} />
          <Route path="/dashboard/report-stock-received" element={<ProtectedRoute><StockReceivedReport /></ProtectedRoute>} />
          <Route path="/dashboard/report-customers" element={<ProtectedRoute><CustomersReport /></ProtectedRoute>} />
          <Route path="/dashboard/report-customer-transactions" element={<ProtectedRoute><CustomerTransactionsReport /></ProtectedRoute>} />
          <Route path="/dashboard/report-business-transactions" element={<ProtectedRoute><BusinessTransactionsReport /></ProtectedRoute>} />
          <Route path="/dashboard/report-invoice-view" element={<ProtectedRoute><InvoiceViewReport /></ProtectedRoute>} />
          <Route path="/dashboard/report-employees" element={<ProtectedRoute><EmployeesReport /></ProtectedRoute>} />
          <Route path="/dashboard/report-salary" element={<ProtectedRoute><SalaryReport /></ProtectedRoute>} />
          <Route path="/dashboard/report-dealer-information" element={<ProtectedRoute><DealerInformationReport /></ProtectedRoute>} />
          <Route path="/dashboard/report-dealer-employees" element={<ProtectedRoute><DealerEmployeesReport /></ProtectedRoute>} />
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
