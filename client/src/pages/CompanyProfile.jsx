import { useEffect, useState } from 'react';
import API from '../api/axios';
import FeatureTablePage from '../components/FeatureTablePage';

export default function CompanyProfile() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    API.get('/companies')
      .then((response) => !cancelled && setRows(Array.isArray(response.data) ? response.data : []))
      .catch((err) => !cancelled && setError(err.response?.data?.message || 'Unable to load company profiles.'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  return (
    <FeatureTablePage
      activePage="companies"
      title="Company Profile"
      loading={loading}
      error={error}
      rows={rows}
      emptyMessage="No company profiles found."
      columns={[
        ['Company', 'company_name'],
        ['Email', 'company_email'],
        ['Contact', 'contact_person'],
        ['Phone', 'phone'],
        ['Status', (row) => row.is_active ? 'Active' : 'Inactive'],
      ]}
    />
  );
}
