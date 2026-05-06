export default function BusinessTransactionsReport({ ctx }) {
  const {
    formatCompactCurrency,
    formatCurrency,
    getVisibleRows,
    renderEmptyState,
    renderMetricCard,
    renderReportFilters,
    renderTableLimitControl,
    reportBusinessTotals,
    reportBusinessTransactionRows,
    reportDateFrom,
    reportDateTo,
  } = ctx;

return (
                    <>
                        <div className="page-heading">
                            <h1>Business Transaction Report</h1>
                            <p>Track actual price, selling price, and profit or loss for each business transaction.</p>
                        </div>
                        {renderReportFilters({
                            title: 'Business Transaction Filters',
                            showAgent: true,
                            agentLabel: 'Agent Name',
                            showMode: true,
                            statusOptions: [
                                { value: 'ALL', label: 'All' },
                                { value: 'RECEIVED', label: 'Received' },
                                { value: 'PENDING', label: 'Pending' },
                                { value: 'PROFIT', label: 'Profit' },
                                { value: 'LOSS', label: 'Loss' },
                            ],
                            searchPlaceholder: 'Search customer, vehicle, agreement, agent...',
                        })}
                        <div className="metrics-grid">
                            {renderMetricCard('Actual Value', formatCompactCurrency(reportBusinessTotals.actual), { iconKey: 'vehicles' })}
                            {renderMetricCard('Selling Value', formatCompactCurrency(reportBusinessTotals.selling), { valueClassName: 'success', iconKey: 'revenue' })}
                            {renderMetricCard('Profit', formatCompactCurrency(reportBusinessTotals.profit), { valueClassName: 'success', iconKey: 'activeEmployees' })}
                            {renderMetricCard('Loss', formatCompactCurrency(reportBusinessTotals.loss), { valueClassName: 'warning', iconKey: 'tasks' })}
                        </div>
                        <div className="table-card">
                            <div className="section-header">
                                <h3>Business Transactions</h3>
                                <span className="section-caption">{reportDateFrom} to {reportDateTo}</span>
                            </div>
                            {reportBusinessTransactionRows.length === 0 ? renderEmptyState('No business transactions match the selected filters.') : (
                                <>
                                    <table className="pro-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Customer</th>
                                                <th>Vehicle</th>
                                                <th>Mode</th>
                                                <th>Branch</th>
                                                <th>Actual Price</th>
                                                <th>Selling Price</th>
                                                <th>Profit / Loss</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getVisibleRows('report-business-transactions', reportBusinessTransactionRows).map((row) => (
                                                <tr key={row.id}>
                                                    <td>{String(row.purchase_date || row.agreement_date || row.created_at || '').slice(0, 10) || 'Not set'}</td>
                                                    <td>{row.customer_name}<br />{row.cnic_passport_number}</td>
                                                    <td>{row.brand} {row.model}<br />{row.registration_number || 'No registration'}</td>
                                                    <td>{row.sale_mode}</td>
                                                    <td>{row.branch_name}</td>
                                                    <td>{formatCurrency(row.actual_price || 0)}</td>
                                                    <td>{formatCurrency(row.selling_price || 0)}</td>
                                                    <td>
                                                        <span className={Number(row.profit_loss || 0) >= 0 ? 'pill-active' : 'pill-warning'}>
                                                            {formatCurrency(row.profit_loss || 0)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {renderTableLimitControl('report-business-transactions', reportBusinessTransactionRows.length)}
                                </>
                            )}
                        </div>
                    </>
                );

}
