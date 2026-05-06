export default function DealerEmployeesReport({ ctx }) {
  const {
    getStatusClass,
    getVisibleRows,
    renderEmptyState,
    renderReportFilters,
    renderTableLimitControl,
    reportDealerEmployeeRows,
  } = ctx;

return (
                    <>
                        <div className="page-heading">
                            <h1>Dealer Wise Employee Report</h1>
                            <p>Review dealer-wise employee records with all available filters, login details, designation, hire date, and resigned status.</p>
                        </div>
                        {renderReportFilters({
                            title: 'Dealer Wise Employee Filters',
                            showDateRange: true,
                            showBranch: true,
                            showAgent: true,
                            agentLabel: 'Employee Name',
                            showMode: false,
                            statusOptions: [
                                { value: 'ALL', label: 'All' },
                                { value: 'ACTIVE', label: 'Active' },
                                { value: 'INACTIVE', label: 'Inactive' },
                                { value: 'RESIGNED', label: 'Resigned' },
                            ],
                            searchPlaceholder: 'Search dealer, employee, designation, code, login email...',
                        })}
                        <div className="table-card">
                            <div className="section-header">
                                <h3>Dealer Wise Employee Register</h3>
                                <span className="section-caption">{reportDealerEmployeeRows.length} records</span>
                            </div>
                            {reportDealerEmployeeRows.length === 0 ? renderEmptyState('No dealer wise employee records match the selected filters.') : (
                                <>
                                    <table className="pro-table">
                                        <thead>
                                            <tr>
                                                <th>Dealer</th>
                                                <th>Employee</th>
                                                <th>Designation</th>
                                                <th>Employee Code</th>
                                                <th>Login Email</th>
                                                <th>Hire Date</th>
                                                <th>Resigned</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getVisibleRows('report-dealer-employees', reportDealerEmployeeRows).map((row) => (
                                                <tr key={row.id}>
                                                    <td>{row.dealer_name}<br />{row.dealer_code || 'No dealer code'}</td>
                                                    <td>{row.full_name}<br />{row.designation || 'No designation'}<br />{row.role_name || 'No role'}</td>
                                                    <td>{row.designation || 'Not set'}</td>
                                                    <td>{row.employee_code || 'Not set'}</td>
                                                    <td>{row.login_email || 'No email'}</td>
                                                    <td>{String(row.hired_at || '').slice(0, 10) || 'Not set'}</td>
                                                    <td><span className={getStatusClass(row.resigned_status)}>{row.resigned_status}</span></td>
                                                    <td><span className={getStatusClass(row.status)}>{row.status}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {renderTableLimitControl('report-dealer-employees', reportDealerEmployeeRows.length)}
                                </>
                            )}
                        </div>
                    </>
                );

}
