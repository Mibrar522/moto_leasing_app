import { useEffect, useMemo, useState } from 'react';
import API from '../api/axios';
import AppLayout from '../layouts/AppLayout';
import { formatCurrency } from '../components/FeatureTablePage';
import './Dashboard.css';
import './AdsManager.css';

const metricItems = [
  ['Total Vehicles', 'totalVehicles'],
  ['Available Vehicles', 'availableVehicles'],
  ['Total Customers', 'totalCustomers'],
  ['Total Employees', 'totalEmployees'],
  ['Pending Applications', 'pendingApplications'],
  ['Total Applications', 'totalApplications'],
  ['Total Revenue', 'totalRevenue', 'currency'],
  ['Pending Tasks', 'pendingInstallments'],
];

const getMetricValue = (metrics, key, type) => {
  const value = metrics?.[key] ?? 0;
  return type === 'currency' ? formatCurrency(value) : Number(value || 0).toLocaleString();
};

export default function Dashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    API.get('/admin/dashboard', { params: { page: 'dashboard' } })
      .then((response) => {
        if (cancelled) return;
        setData(response.data || {});
        if (response.data?.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Unable to load dashboard.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = data.metrics || {};
  const recentApplications = useMemo(
    () => (Array.isArray(data.applications) ? data.applications.slice(0, 8) : []),
    [data.applications]
  );

  return (
    <AppLayout activePage="dashboard" title="Dashboard">
      {loading ? <div className="feedback-card">Loading dashboard...</div> : null}
      {error ? <div className="feedback-card error">{error}</div> : null}

      {!loading && !error ? (
        <>
          <div className="metrics-grid">
            {metricItems.map(([label, key, type]) => (
              <div key={key} className="metric-card">
                <label>{label}</label>
                <strong>{getMetricValue(metrics, key, type)}</strong>
              </div>
            ))}
          </div>

          <div className="table-card">
            <div className="section-header">
              <div>
                <h3>Recent Applications</h3>
                <p className="section-caption">{recentApplications.length} latest record(s)</p>
              </div>
            </div>

            {recentApplications.length === 0 ? (
              <div className="empty-state"><p>No recent applications found.</p></div>
            ) : (
              <div className="table-scroll">
                <table className="pro-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Vehicle</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map((application) => (
                      <tr key={application.id}>
                        <td>{application.customer_name || '-'}</td>
                        <td>{[application.brand, application.model].filter(Boolean).join(' ') || '-'}</td>
                        <td>{application.status || '-'}</td>
                        <td>{String(application.created_at || '').slice(0, 10) || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </AppLayout>
  );
}
