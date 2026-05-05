import { useEffect, useState } from 'react';
import API from '../api/axios';
import FeatureTablePage, { formatCurrency } from '../components/FeatureTablePage';

export default function Sales() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    API.get('/sales')
      .then((response) => !cancelled && setRows(Array.isArray(response.data) ? response.data : []))
      .catch(() => API.get('/admin/dashboard', { params: { page: 'sales' } })
        .then((response) => !cancelled && setRows(Array.isArray(response.data?.salesTransactions) ? response.data.salesTransactions : []))
        .catch((err) => !cancelled && setError(err.response?.data?.message || 'Unable to load sales.')))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  return (
    <FeatureTablePage
      activePage="sales"
      title="Sales"
      loading={loading}
      error={error}
      rows={rows}
      emptyMessage="No sales found."
      columns={[
        ['Customer', 'customer_name'],
        ['Vehicle', (row) => [row.brand, row.model].filter(Boolean).join(' ')],
        ['Mode', 'sale_mode'],
        ['Total', (row) => formatCurrency(row.total_price || row.sale_price)],
        ['Status', 'status'],
      ]}
    />
  );
}
