import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import './App.css';

const Register = lazy(() => import('./pages/Register'));
const DashboardRoutePage = lazy(() => import('./pages/dashboardPages/DashboardRoutePage'));
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
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRoutePage /></ProtectedRoute>} />
          <Route path="/dashboard/applications" element={<ProtectedRoute><DashboardRoutePage pageKey="applications" /></ProtectedRoute>} />
          <Route path="/dashboard/workflow" element={<ProtectedRoute><DashboardRoutePage pageKey="workflow" /></ProtectedRoute>} />
          <Route path="/dashboard/user-tasks" element={<ProtectedRoute><DashboardRoutePage pageKey="user-tasks" /></ProtectedRoute>} />
          <Route path="/dashboard/access" element={<ProtectedRoute><DashboardRoutePage pageKey="access" /></ProtectedRoute>} />
          <Route path="/dashboard/customers" element={<ProtectedRoute><DashboardRoutePage pageKey="customers" /></ProtectedRoute>} />
          <Route path="/dashboard/products" element={<ProtectedRoute><DashboardRoutePage pageKey="products" /></ProtectedRoute>} />
          <Route path="/dashboard/stock" element={<ProtectedRoute><DashboardRoutePage pageKey="stock" /></ProtectedRoute>} />
          <Route path="/dashboard/sales" element={<ProtectedRoute><DashboardRoutePage pageKey="sales" /></ProtectedRoute>} />
          <Route path="/dashboard/installments" element={<ProtectedRoute><DashboardRoutePage pageKey="installments" /></ProtectedRoute>} />
          <Route path="/dashboard/employees" element={<ProtectedRoute><DashboardRoutePage pageKey="employees" /></ProtectedRoute>} />
          <Route path="/dashboard/dealers" element={<ProtectedRoute><DashboardRoutePage pageKey="dealers" /></ProtectedRoute>} />
          <Route path="/dashboard/reports" element={<ProtectedRoute><DashboardRoutePage pageKey="reports" /></ProtectedRoute>} />
          <Route path="/dashboard/transactions" element={<ProtectedRoute><DashboardRoutePage pageKey="transactions" /></ProtectedRoute>} />
          <Route path="/dashboard/companies" element={<ProtectedRoute><DashboardRoutePage pageKey="companies" /></ProtectedRoute>} />
          <Route path="/dashboard/report-stock-inventory" element={<ProtectedRoute><DashboardRoutePage pageKey="report-stock-inventory" /></ProtectedRoute>} />
          <Route path="/dashboard/report-daily-sales" element={<ProtectedRoute><DashboardRoutePage pageKey="report-daily-sales" /></ProtectedRoute>} />
          <Route path="/dashboard/report-stock-received" element={<ProtectedRoute><DashboardRoutePage pageKey="report-stock-received" /></ProtectedRoute>} />
          <Route path="/dashboard/report-customers" element={<ProtectedRoute><DashboardRoutePage pageKey="report-customers" /></ProtectedRoute>} />
          <Route path="/dashboard/report-customer-transactions" element={<ProtectedRoute><DashboardRoutePage pageKey="report-customer-transactions" /></ProtectedRoute>} />
          <Route path="/dashboard/report-business-transactions" element={<ProtectedRoute><DashboardRoutePage pageKey="report-business-transactions" /></ProtectedRoute>} />
          <Route path="/dashboard/report-invoice-view" element={<ProtectedRoute><DashboardRoutePage pageKey="report-invoice-view" /></ProtectedRoute>} />
          <Route path="/dashboard/report-employees" element={<ProtectedRoute><DashboardRoutePage pageKey="report-employees" /></ProtectedRoute>} />
          <Route path="/dashboard/report-salary" element={<ProtectedRoute><DashboardRoutePage pageKey="report-salary" /></ProtectedRoute>} />
          <Route path="/dashboard/report-dealer-information" element={<ProtectedRoute><DashboardRoutePage pageKey="report-dealer-information" /></ProtectedRoute>} />
          <Route path="/dashboard/report-dealer-employees" element={<ProtectedRoute><DashboardRoutePage pageKey="report-dealer-employees" /></ProtectedRoute>} />
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
