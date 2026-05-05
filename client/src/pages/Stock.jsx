import { useEffect, useState } from 'react';
import API from '../api/axios';
import FeatureTablePage, { formatCurrency } from '../components/FeatureTablePage';

export default function Stock() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    API.get('/stock/orders')
      .then((response) => !cancelled && setRows(Array.isArray(response.data) ? response.data : []))
      .catch((err) => !cancelled && setError(err.response?.data?.message || 'Unable to load stock orders.'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  return (
    <FeatureTablePage
      activePage="stock"
      title="Stock Orders"
      loading={loading}
      error={error}
      rows={rows}
      emptyMessage="No stock orders found."
      columns={[
        ['Company', (row) => row.company_name || row.company_email],
        ['Vehicle', (row) => [row.brand, row.model, row.color].filter(Boolean).join(' ')],
        ['Amount', (row) => formatCurrency(row.order_amount || row.total_amount || row.unit_price)],
        ['Status', (row) => row.order_status || row.status],
        ['Email', (row) => row.email_error || (row.email_sent ? 'Sent' : 'Not sent')],
      ]}
    />
  );
}
