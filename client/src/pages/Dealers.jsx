import { useEffect, useState } from 'react';
import API from '../api/axios';
import FeatureTablePage from '../components/FeatureTablePage';

export default function Dealers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    API.get('/dealers')
      .then((response) => !cancelled && setRows(Array.isArray(response.data) ? response.data : []))
      .catch((err) => !cancelled && setError(err.response?.data?.message || 'Unable to load dealers.'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  return (
    <FeatureTablePage
      activePage="dealers"
      title="Dealers"
      loading={loading}
      error={error}
      rows={rows}
      emptyMessage="No dealers found."
      columns={[
        ['Dealer', 'dealer_name'],
        ['Code', 'dealer_code'],
        ['Email', 'email'],
        ['Status', 'status'],
      ]}
    />
  );
}
