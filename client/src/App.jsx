import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; 
import AdsManager from './pages/AdsManager';
import './App.css';

const hasSessionToken = () => {
  const token = localStorage.getItem('token');
  // Add a simple expiry or validity check if needed here
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
      <Routes>
        {/* Entry Point */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

        {/* Application Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/ads" element={<ProtectedRoute><AdsManager /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;