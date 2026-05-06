export default function CustomersReport({ ctx }) {
  const {
    getStatusClass,
    getVisibleRows,
    renderEmptyState,
    renderReportFilters,
    renderTableLimitControl,
    reportCustomerRows,
  } = ctx;

return (
                    <>
                        <div className="page-heading">
                            <h1>Customer Report</h1>
                            <p>Filter customer records by status, branch, and keyword search for a cleaner report view.</p>
                        </div>
                        {renderReportFilters({
                            title: 'Customer Report Filters',
                            showDateRange: false,
                            statusOptions: [
                                { value: 'ALL', label: 'All' },
                                { value: 'DOCUMENTED', label: 'Documented' },
                                { value: 'OCR_READY', label: 'OCR Ready' },
                                { value: 'BIOMETRIC_ENROLLED', label: 'Biometric Enrolled' },
                                { value: 'PENDING', label: 'Pending' },
                            ],
                            searchPlaceholder: 'Search customer, CNIC, country, address...',
                        })}
                        <div className="table-card">
                            <div className="section-header">
                                <h3>Customer Register</h3>
                                <span className="section-caption">{reportCustomerRows.length} records</span>
                            </div>
                            {reportCustomerRows.length === 0 ? renderEmptyState('No customer records match the selected filters.') : (
                                <>
                                    <table className="pro-table">
                                        <thead>
                                            <tr>
                                                <th>Customer</th>
                                                <th>CNIC</th>
                                                <th>Status</th>
                                                <th>Country</th>
                                                <th>Branch</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getVisibleRows('report-customers', reportCustomerRows).map((row) => (
                                                <tr key={row.id}>
                                                    <td>{row.full_name}<br />{row.created_by_name || 'Created by system'}</td>
                                                    <td>{row.cnic_passport_number || 'Not set'}</td>
                                                    <td><span className={getStatusClass(row.report_status)}>{row.report_status}</span></td>
                                                    <td>{row.ocr_details?.country || 'Not set'}</td>
                                                    <td>{row.branch_name}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {renderTableLimitControl('report-customers', reportCustomerRows.length)}
                                </>
                            )}
                        </div>
                    </>
                );

}
