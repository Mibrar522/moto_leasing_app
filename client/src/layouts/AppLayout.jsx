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
                <span className={`nav-btn-icon nav-btn-icon-${item.key}`} aria-hidden="true" />
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
