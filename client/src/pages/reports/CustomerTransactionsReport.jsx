export default function CustomerTransactionsReport({ ctx }) {
  const {
    getStatusClass,
    getVisibleRows,
    renderEmptyState,
    renderReportFilters,
    renderTableLimitControl,
    reportCustomerTransactionRows,
    reportDateFrom,
    reportDateTo,
  } = ctx;

return (
                    <>
                        <div className="page-heading">
                            <h1>Customer Transaction Report</h1>
                            <p>See whether each customer purchased on cash or installment, and for installment sales view the received installment dates.</p>
                        </div>
                        {renderReportFilters({
                            title: 'Customer Transaction Filters',
                            showAgent: true,
                            agentLabel: 'Agent Name',
                            showMode: true,
                            statusOptions: [
                                { value: 'ALL', label: 'All' },
                                { value: 'RECEIVED', label: 'Received' },
                                { value: 'PENDING', label: 'Pending' },
                            ],
                            searchPlaceholder: 'Search customer, CNIC, vehicle, agreement, agent...',
                        })}
                        <div className="table-card">
                            <div className="section-header">
                                <h3>Customer Transactions</h3>
                                <span className="section-caption">{reportDateFrom} to {reportDateTo}</span>
                            </div>
                            {reportCustomerTransactionRows.length === 0 ? renderEmptyState('No customer transactions match the selected filters.') : (
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
                                                <th>Installment Collection</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getVisibleRows('report-customer-transactions', reportCustomerTransactionRows).map((row) => (
                                                <tr key={row.id}>
                                                    <td>{row.report_activity_date || String(row.purchase_date || row.agreement_date || row.created_at || '').slice(0, 10) || 'Not set'}</td>
                                                    <td>{row.customer_name}<br />{row.cnic_passport_number}</td>
                                                    <td>{row.brand} {row.model}<br />{row.registration_number || 'No registration'}</td>
                                                    <td>{row.sale_mode}</td>
                                                    <td>{row.branch_name}</td>
                                                    <td><span className={getStatusClass(row.status)}>{row.status}</span></td>
                                                    <td className="preserve-breaks">
                                                        {String(row.sale_mode || '').toUpperCase() === 'INSTALLMENT'
                                                            ? row.installment_collection_label
                                                            : 'Cash sale'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {renderTableLimitControl('report-customer-transactions', reportCustomerTransactionRows.length)}
                                </>
                            )}
                        </div>
                    </>
                );

}
