export default function EmployeesReport({ ctx }) {
  const {
    formatCurrency,
    getStatusClass,
    getVisibleRows,
    renderEmptyState,
    renderReportFilters,
    renderTableLimitControl,
    reportEmployeeRows,
  } = ctx;

return (
                    <>
                        <div className="page-heading">
                            <h1>Employees Report</h1>
                            <p>Review employee records with branch filter, status filter, and quick printing.</p>
                        </div>
                        {renderReportFilters({
                            title: 'Employees Report Filters',
                            showDateRange: false,
                            showAgent: true,
                            agentLabel: 'Employee Name',
                            statusOptions: [
                                { value: 'ALL', label: 'All' },
                                { value: 'ACTIVE', label: 'Active' },
                                { value: 'INACTIVE', label: 'Inactive' },
                            ],
                            searchPlaceholder: 'Search employee, code, email, department...',
                        })}
                        <div className="table-card">
                            <div className="section-header">
                                <h3>Employees Register</h3>
                                <span className="section-caption">{reportEmployeeRows.length} records</span>
                            </div>
                            {reportEmployeeRows.length === 0 ? renderEmptyState('No employee records match the selected filters.') : (
                                <>
                                    <table className="pro-table">
                                        <thead>
                                            <tr>
                                                <th>Employee</th>
                                                <th>Code</th>
                                                <th>Department</th>
                                                <th>Commission %</th>
                                                <th>Commission Value</th>
                                                <th>Total Earned Commission</th>
                                                <th>Outstanding Advance</th>
                                                <th>Latest Net Salary</th>
                                                <th>Status</th>
                                                <th>Branch</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getVisibleRows('report-employees', reportEmployeeRows).map((row) => (
                                                <tr key={row.id}>
                                                    <td>{row.full_name}<br />{row.job_title || row.department || 'No designation'}<br />{row.branch_name || 'No dealer'}</td>
                                                    <td>{row.employee_code || 'Not set'}</td>
                                                    <td>{row.department || 'Not set'}<br />{row.job_title || 'No designation'}</td>
                                                    <td>{Number(row.commission_percentage || 0)}%</td>
                                                    <td>{formatCurrency(row.commission_value || 0)}</td>
                                                    <td>{formatCurrency(row.earned_commission || 0)}</td>
                                                    <td>{formatCurrency(row.outstanding_advance || 0)}</td>
                                                    <td>{formatCurrency(row.latest_net_salary || 0)}</td>
                                                    <td><span className={getStatusClass(row.report_status)}>{row.report_status}</span></td>
                                                    <td>{row.branch_name}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {renderTableLimitControl('report-employees', reportEmployeeRows.length)}
                                </>
                            )}
                        </div>
                    </>
                );

}
