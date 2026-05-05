import { useEffect, useState } from 'react';
import API from '../api/axios';
import FeatureTablePage, { formatCurrency } from '../components/FeatureTablePage';

export default function Products() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    API.get('/products')
      .then((response) => !cancelled && setRows(Array.isArray(response.data) ? response.data : []))
      .catch((err) => !cancelled && setError(err.response?.data?.message || 'Unable to load products.'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  return (
    <FeatureTablePage
      activePage="products"
      title="Products"
      loading={loading}
      error={error}
      rows={rows}
      emptyMessage="No products found."
      columns={[
        ['Vehicle', (row) => [row.brand, row.model].filter(Boolean).join(' ')],
        ['Type', 'vehicle_type'],
        ['Color', 'color'],
        ['Purchase Price', (row) => formatCurrency(row.purchase_price)],
        ['Monthly Rate', (row) => formatCurrency(row.monthly_rate)],
      ]}
    />
  );
}
