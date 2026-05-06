export default function SalaryReport({ ctx }) {
  const {
    formatCurrency,
    getVisibleRows,
    handlePrintSalarySlip,
    renderEmptyState,
    renderReportFilters,
    renderTableLimitControl,
    reportSalaryRows,
  } = ctx;

return (
                    <>
                        <div className="page-heading">
                            <h1>Salary Report</h1>
                            <p>Review generated payroll records with date range, branch filter, and quick printing.</p>
                        </div>
                        {renderReportFilters({
                            title: 'Salary Report Filters',
                            showDateRange: true,
                            showBranch: true,
                            showAgent: true,
                            agentLabel: 'Employee Name',
                            showMode: false,
                            statusOptions: [
                                { value: 'ALL', label: 'All' },
                                { value: 'GENERATED', label: 'Generated' },
                            ],
                            searchPlaceholder: 'Search employee, code, month, department...',
                        })}
                        <div className="table-card">
                            <div className="section-header">
                                <h3>Generated Salary Register</h3>
                                <span className="section-caption">{reportSalaryRows.length} records</span>
                            </div>
                            {reportSalaryRows.length === 0 ? renderEmptyState('No salary records match the selected filters.') : (
                                <>
                                    <table className="pro-table">
                                        <thead>
                                            <tr>
                                                <th>Employee</th>
                                                <th>Code</th>
                                                <th>Payroll Month</th>
                                                <th>Base Salary</th>
                                                <th>Commission</th>
                                                <th>Advance Deduction</th>
                                                <th>Net Salary</th>
                                                <th>Branch</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getVisibleRows('report-salary', reportSalaryRows).map((row) => (
                                                <tr key={row.id}>
                                                    <td>{row.full_name}<br />{row.job_title || row.department || 'No designation'}<br />{row.branch_name || 'No dealer'}</td>
                                                    <td>{row.employee_code || 'Not set'}</td>
                                                    <td>{row.payroll_month || 'Not set'}</td>
                                                    <td>{formatCurrency(row.base_salary || 0)}</td>
                                                    <td>{formatCurrency(row.total_commission || 0)}</td>
                                                    <td>{formatCurrency(row.total_advances || 0)}</td>
                                                    <td>{formatCurrency(row.net_salary || 0)}</td>
                                                    <td>{row.branch_name}</td>
                                                    <td>
                                                        <button type="button" className="view-btn" onClick={() => handlePrintSalarySlip(row)}>
                                                            Print Slip
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {renderTableLimitControl('report-salary', reportSalaryRows.length)}
                                </>
                            )}
                        </div>
                    </>
                );

}
