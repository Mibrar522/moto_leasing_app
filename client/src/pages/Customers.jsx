import { useEffect, useState } from 'react';
import API from '../api/axios';
import FeatureTablePage from '../components/FeatureTablePage';

export default function Customers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    API.get('/customers')
      .then((response) => !cancelled && setRows(Array.isArray(response.data) ? response.data : []))
      .catch((err) => !cancelled && setError(err.response?.data?.message || 'Unable to load customers.'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  return (
    <FeatureTablePage
      activePage="customers"
      title="Customers"
      loading={loading}
      error={error}
      rows={rows}
      emptyMessage="No customers found."
      columns={[
        ['Name', 'full_name'],
        ['CNIC / Passport', 'cnic_passport_number'],
        ['Phone', 'contact_phone'],
        ['Dealer', 'dealer_name'],
      ]}
    />
  );
}
