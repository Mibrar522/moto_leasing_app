export default function StockReceivedReport({ ctx }) {
  const {
    getReportBranchValue,
    getStatusClass,
    getVisibleRows,
    renderEmptyState,
    renderReportFilters,
    renderTableLimitControl,
    reportDateFrom,
    reportDateTo,
    reportStockReceivedRows,
  } = ctx;

return (
                    <>
                        <div className="page-heading">
                            <h1>Daily Transactions Stock Received</h1>
                            <p>Track received stock records with date range, branch filter, status filter, and print support.</p>
                        </div>
                        {renderReportFilters({
                            title: 'Stock Received Filters',
                            showAgent: true,
                            agentLabel: 'Ordered By',
                            statusOptions: [
                                { value: 'ALL', label: 'All' },
                                { value: 'RECEIVED', label: 'Received' },
                                { value: 'PARTIAL', label: 'Partial' },
                                { value: 'PROCESSING', label: 'Processing' },
                            ],
                            searchPlaceholder: 'Search company, vehicle, ordered by...',
                        })}
                        <div className="table-card">
                            <div className="section-header">
                                <h3>Stock Received Register</h3>
                                <span className="section-caption">{reportDateFrom} to {reportDateTo}</span>
                            </div>
                            {reportStockReceivedRows.length === 0 ? renderEmptyState('No stock received records match the selected filters.') : (
                                <>
                                    <table className="pro-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Company</th>
                                                <th>Vehicle</th>
                                                <th>Branch</th>
                                                <th>Vehicle Received</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getVisibleRows('report-stock-received', reportStockReceivedRows).map((row) => (
                                                <tr key={row.id}>
                                                    <td>{String(row.received_at || row.updated_at || row.created_at || '').slice(0, 10) || 'Not set'}</td>
                                                    <td>{row.company_name || 'Not set'}</td>
                                                    <td>{row.brand} {row.model}<br />{row.vehicle_type || 'No type'}</td>
                                                    <td>{getReportBranchValue(row)}</td>
                                                    <td>{Number(row.received_quantity || 0) > 0 ? 'Yes' : 'Pending'}</td>
                                                    <td><span className={getStatusClass(row.order_status || row.status)}>{row.order_status || row.status || 'Not set'}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {renderTableLimitControl('report-stock-received', reportStockReceivedRows.length)}
                                </>
                            )}
                        </div>
                    </>
                );

}
