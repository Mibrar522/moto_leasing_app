import { NavLink, useNavigate } from 'react-router-dom';
import '../pages/Dashboard.css';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { key: 'customers', label: 'Customers', path: '/dashboard/customers' },
  { key: 'employees', label: 'Employees', path: '/dashboard/employees' },
  { key: 'applications', label: 'Applications', path: '/dashboard/applications' },
  { key: 'sales', label: 'Sales', path: '/dashboard/sales' },
  { key: 'reports', label: 'Reports', path: '/dashboard/reports' },
  { key: 'installments', label: 'Installments', path: '/dashboard/installments' },
  { key: 'companies', label: 'Company Profile', path: '/dashboard/companies' },
  { key: 'stock', label: 'Stock', path: '/dashboard/stock' },
  { key: 'products', label: 'Products', path: '/dashboard/products' },
  { key: 'workflow', label: 'Workflow', path: '/dashboard/workflow' },
  { key: 'access', label: 'Access Control', path: '/dashboard/access' },
  { key: 'dealers', label: 'Dealers', path: '/dashboard/dealers' },
];

const navIcons = {
  dashboard: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h7V4H4v9zm9 7h7V4h-7v16zM4 20h7v-5H4v5z" /></svg>
  ),
  customers: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-4 3-7 7-7s7 3 7 7H2zm12 0c0-2.3-.9-4.3-2.4-5.8 1.1-.7 2.4-1.2 3.9-1.2 3.6 0 6.5 2.7 6.5 7h-8z" /></svg>
  ),
  employees: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm-8 9c0-4.4 3.6-8 8-8s8 3.6 8 8H4z" /></svg>
  ),
  applications: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l5 5v15H6V2zm8 1.5V8h4.5L14 3.5zM8 12h8v2H8v-2zm0 4h8v2H8v-2z" /></svg>
  ),
  sales: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4V6zm2 2v8h12V8H6zm3 2h6v2H9v-2z" /></svg>
  ),
  reports: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14v18H5V3zm3 13h2V9H8v7zm4 0h2V6h-2v10zm4 0h2v-4h-2v4z" /></svg>
  ),
  installments: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v2h3v16H4V5h3V3zm0 5v11h10V8H7zm2 3h6v2H9v-2zm0 4h4v2H9v-2z" /></svg>
  ),
  companies: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V5l8-3 8 3v16h-6v-6h-4v6H4zm4-11h2V8H8v2zm6 0h2V8h-2v2z" /></svg>
  ),
  stock: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7l9-4 9 4v10l-9 4-9-4V7zm9 2.2L17.8 7 12 4.8 6.2 7 12 9.2zm-7 6.5l6 2.7v-7.3L5 8.4v7.3zm8 2.7l6-2.7V8.4l-6 2.7v7.3z" /></svg>
  ),
  products: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h11l5 5v7H4V6zm2 2v8h12v-4h-4V8H6zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></svg>
  ),
  workflow: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h6v6H6V4zm6 10h6v6h-6v-6zM8 13h2c0-2.8 2.2-5 5-5h1V6h-1c-3.9 0-7 3.1-7 7z" /></svg>
  ),
  access: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a5 5 0 0 0-5 5v3H5v12h14V10h-2V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 0 1 6 0v3H9z" /></svg>
  ),
  dealers: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21V4h18v17h-2v-2H5v2H3zm4-4h10V6H7v11zm2-8h6v2H9V9zm0 4h6v2H9v-2z" /></svg>
  ),
};

const getInitials = (value = '') => String(value || 'ML')
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase())
  .join('') || 'ML';

export default function AppLayout({ activePage = 'dashboard', title = '', children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null') || {};
  const theme = localStorage.getItem('dashboard_theme') || user.theme_key || 'sandstone';
  const brandName = user.dealer_name || user.brand_name || 'MotorLease';
  const brandAddress = user.dealer_address || user.brand_address || 'Head office address not set';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout notranslate" data-theme={theme}>
      <aside className="app-sidebar">
        <nav className="side-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) => `nav-btn ${isActive || activePage === item.key ? 'active' : ''}`}
            >
              <span className="nav-btn-content">
                <span className={`nav-btn-icon nav-btn-icon-${item.key}`} aria-hidden="true">
                  {navIcons[item.key]}
                </span>
                <span className="nav-btn-label">{item.label}</span>
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <header className="dashboard-header">
        <div className="header-main">
          <div className="header-dealer-banner">
            <div className="header-dealer-logo fallback">{getInitials(brandName)}</div>
            <div className="header-dealer-copy">
              <strong>{brandName}</strong>
              <span>{`Address: ${brandAddress}`}</span>
            </div>
          </div>
        </div>
        <div className="user-meta">
          <div className="agent-strip">
            <span className="agent-strip-label">Agent</span>
            <strong>{user.full_name || 'User'}</strong>
          </div>
          <button type="button" className="logout-btn profile-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {title ? (
          <div className="page-heading">
            <h1>{title}</h1>
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
