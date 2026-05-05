import { useEffect, useMemo, useState } from 'react';
import API from '../api/axios';
import FeatureTablePage, { formatCurrency } from '../components/FeatureTablePage';

export default function Installments() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    API.get('/sales')
      .then((response) => !cancelled && setSales(Array.isArray(response.data) ? response.data : []))
      .catch((err) => !cancelled && setError(err.response?.data?.message || 'Unable to load installments.'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const rows = useMemo(
    () => sales.filter((sale) => String(sale.sale_mode || '').toUpperCase() === 'INSTALLMENT'),
    [sales]
  );

  return (
    <FeatureTablePage
      activePage="installments"
      title="Installments"
      loading={loading}
      error={error}
      rows={rows}
      emptyMessage="No installment sales found."
      columns={[
        ['Customer', 'customer_name'],
        ['Vehicle', (row) => [row.brand, row.model].filter(Boolean).join(' ')],
        ['Monthly', (row) => formatCurrency(row.monthly_installment)],
        ['Total', (row) => formatCurrency(row.total_price || row.sale_price)],
        ['Status', 'status'],
      ]}
    />
  );
}
