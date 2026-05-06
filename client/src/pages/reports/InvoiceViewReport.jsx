export default function InvoiceViewReport({ ctx }) {
  const {
    getStatusClass,
    getVisibleRows,
    handlePrintTransaction,
    renderEmptyState,
    renderReportFilters,
    renderTableLimitControl,
    reportDateFrom,
    reportDateTo,
    reportInvoiceRows,
  } = ctx;

return (
                    <>
                        <div className="page-heading">
                            <h1>Invoice View Report</h1>
                            <p>Filter transactions by mode, branch, status, and date range, then click a customer transaction to open its invoice.</p>
                        </div>
                        {renderReportFilters({
                            title: 'Invoice Report Filters',
                            showAgent: true,
                            agentLabel: 'Agent Name',
                            showMode: true,
                            statusOptions: [
                                { value: 'ALL', label: 'All' },
                                { value: 'RECEIVED', label: 'Received' },
                                { value: 'PENDING', label: 'Pending' },
                            ],
                            searchPlaceholder: 'Search customer, vehicle, agreement, agent...',
                        })}
                        <div className="table-card">
                            <div className="section-header">
                                <h3>Invoice Transactions</h3>
                                <span className="section-caption">{reportDateFrom} to {reportDateTo}</span>
                            </div>
                            {reportInvoiceRows.length === 0 ? renderEmptyState('No invoice transactions match the selected filters.') : (
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
                                                <th>Agreement</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getVisibleRows('report-invoice-view', reportInvoiceRows).map((row) => (
                                                <tr key={row.id} className="report-clickable-row" onClick={() => handlePrintTransaction(row)}>
                                                    <td>{String(row.purchase_date || row.agreement_date || row.created_at || '').slice(0, 10) || 'Not set'}</td>
                                                    <td>{row.customer_name}<br />{row.cnic_passport_number}</td>
                                                    <td>{row.brand} {row.model}<br />{row.registration_number || 'No registration'}</td>
                                                    <td>{row.sale_mode}</td>
                                                    <td>{row.branch_name}</td>
                                                    <td><span className={getStatusClass(row.status)}>{row.status}</span></td>
                                                    <td>{row.agreement_number || 'Not set'}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="view-btn"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                handlePrintTransaction(row);
                                                            }}
                                                        >
                                                            Open Invoice
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {renderTableLimitControl('report-invoice-view', reportInvoiceRows.length)}
                                </>
                            )}
                        </div>
                    </>
                );

}
