import { useEffect, useState } from 'react';
import API from '../api/axios';
import FeatureTablePage from '../components/FeatureTablePage';

export default function Employees() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    API.get('/employees')
      .then((response) => !cancelled && setRows(Array.isArray(response.data) ? response.data : []))
      .catch((err) => !cancelled && setError(err.response?.data?.message || 'Unable to load employees.'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  return (
    <FeatureTablePage
      activePage="employees"
      title="Employees"
      loading={loading}
      error={error}
      rows={rows}
      emptyMessage="No employees found."
      columns={[
        ['Name', 'full_name'],
        ['Code', 'employee_code'],
        ['Role', 'role_name'],
        ['Dealer', 'dealer_name'],
      ]}
    />
  );
}
