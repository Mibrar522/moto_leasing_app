export default function DailySalesReport({ ctx }) {
  const {
    formatCompactCurrency,
    formatCurrency,
    getReportBranchValue,
    getStatusClass,
    getVisibleRows,
    renderEmptyState,
    renderMetricCard,
    renderReportFilters,
    renderTableLimitControl,
    reportDateFrom,
    reportDateTo,
    reportSalesCommissionTotal,
    reportSalesRows,
    reportSalesTotals,
  } = ctx;

return (
                    <>
                        <div className="page-heading">
                            <h1>Daily Transactions Sale Report</h1>
                            <p>View cash and installment sales with date-wise filters, branch name filter, and quick printing.</p>
                        </div>
                        {renderReportFilters({
                            title: 'Sale Report Filters',
                            showAgent: true,
                            agentLabel: 'Agent Name',
                            showMode: true,
                            statusOptions: [
                                { value: 'ALL', label: 'All' },
                                { value: 'RECEIVED', label: 'Received' },
                                { value: 'PARTIAL', label: 'Partial' },
                                { value: 'PENDING', label: 'Pending' },
                            ],
                            searchPlaceholder: 'Search customer, vehicle, agreement, agent...',
                        })}
                        <div className="metrics-grid">
                            {renderMetricCard('Total Deals', reportSalesTotals.deals, { iconKey: 'applications' })}
                            {renderMetricCard('Total Amount', formatCompactCurrency(reportSalesTotals.amount), { valueClassName: 'success', iconKey: 'revenue' })}
                            {renderMetricCard('Received', formatCompactCurrency(reportSalesTotals.received), { valueClassName: 'success', iconKey: 'revenue' })}
                            {renderMetricCard('Pending', formatCompactCurrency(reportSalesTotals.pending), { valueClassName: 'warning', iconKey: 'tasks' })}
                            {renderMetricCard('Total Commission', formatCompactCurrency(reportSalesCommissionTotal), { valueClassName: 'success', iconKey: 'employees' })}
                        </div>
                        <div className="table-card">
                            <div className="section-header">
                                <h3>Daily Sale Transactions</h3>
                                <span className="section-caption">{reportDateFrom} to {reportDateTo}</span>
                            </div>
                            {reportSalesRows.length === 0 ? renderEmptyState('No sales transactions match the selected filters.') : (
                                <>
                                    <table className="pro-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Customer</th>
                                                <th>Vehicle</th>
                                                <th>Mode</th>
                                                <th>Branch</th>
                                                <th>Status</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getVisibleRows('report-daily-sales', reportSalesRows).map((sale) => (
                                                <tr key={sale.id}>
                                                    <td>{String(sale.purchase_date || sale.agreement_date || sale.created_at || '').slice(0, 10) || 'Not set'}</td>
                                                    <td>{sale.customer_name}<br />{sale.cnic_passport_number}</td>
                                                    <td>{sale.brand} {sale.model}<br />{sale.registration_number || 'No registration'}</td>
                                                    <td>{sale.sale_mode}</td>
                                                    <td>{getReportBranchValue(sale)}</td>
                                                    <td><span className={getStatusClass(sale.report_status || sale.status)}>{sale.report_status || sale.status}</span></td>
                                                    <td>{formatCurrency(sale.vehicle_price || 0)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {renderTableLimitControl('report-daily-sales', reportSalesRows.length)}
                                </>
                            )}
                        </div>
                    </>
                );

}
