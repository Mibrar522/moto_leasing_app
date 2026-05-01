import { HashRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // Import Dashboard
import AdsManager from './pages/AdsManager';
import './App.css';

const hasSessionToken = () => Boolean(localStorage.getItem('token'));

function ProtectedRoute({ children }) {
  return hasSessionToken() ? children : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  return hasSessionToken() ? <Navigate to="/app/dashboard" replace /> : children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={hasSessionToken() ? "/app/dashboard" : "/login"} replace />} />
        <Route
          path="/login"
          element={(
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          )}
        />
        <Route
          path="/register"
          element={(
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          )}
        />
        <Route
          path="/app/dashboard"
          element={(
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/app/ads"
          element={(
            <ProtectedRoute>
              <AdsManager />
            </ProtectedRoute>
          )}
        />
        <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/Dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="*" element={<Navigate to={hasSessionToken() ? "/app/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
