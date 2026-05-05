import AppLayout from '../layouts/AppLayout';

export const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `Rs ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getCellValue = (row, column) => {
  const accessor = column[1];
  if (typeof accessor === 'function') return accessor(row);
  return row?.[accessor] ?? '';
};

export default function FeatureTablePage({
  activePage,
  title,
  loading,
  error,
  rows,
  columns,
  emptyMessage,
  children,
}) {
  return (
    <AppLayout activePage={activePage} title={title}>
      {children}
      {loading ? <div className="feedback-card">Loading {title.toLowerCase()}...</div> : null}
      {error ? <div className="feedback-card error">{error}</div> : null}
      {!loading && !error ? (
        <div className="table-card">
          <div className="section-header">
            <div>
              <h3>{title}</h3>
              <p className="section-caption">{rows.length} record(s)</p>
            </div>
          </div>
          {rows.length === 0 ? (
            <div className="empty-state"><p>{emptyMessage}</p></div>
          ) : (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    {columns.map(([label]) => <th key={label}>{label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id || index}>
                      {columns.map((column) => (
                        <td key={column[0]}>{getCellValue(row, column) || '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </AppLayout>
  );
}
