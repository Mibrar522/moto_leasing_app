export default function DealerInformationReport({ ctx }) {
  const {
    getStatusClass,
    getVisibleRows,
    renderEmptyState,
    renderReportFilters,
    renderTableLimitControl,
    reportDealerInformationRows,
  } = ctx;

return (
                    <>
                        <div className="page-heading">
                            <h1>Dealer Information Report</h1>
                            <p>Review dealer profile details together with the employees linked to each dealer.</p>
                        </div>
                        {renderReportFilters({
                            title: 'Dealer Information Filters',
                            showDateRange: false,
                            showBranch: true,
                            showAgent: false,
                            showMode: false,
                            statusOptions: [
                                { value: 'ALL', label: 'All' },
                                { value: 'ACTIVE', label: 'Active' },
                                { value: 'INACTIVE', label: 'Inactive' },
                            ],
                            searchPlaceholder: 'Search dealer, code, address, employee, department...',
                        })}
                        <div className="table-card">
                            <div className="section-header">
                                <h3>Dealer Information Register</h3>
                                <span className="section-caption">{reportDealerInformationRows.length} records</span>
                            </div>
                            {reportDealerInformationRows.length === 0 ? renderEmptyState('No dealer information records match the selected filters.') : (
                                <div className="dealer-report-stack">
                                    {getVisibleRows('report-dealer-information', reportDealerInformationRows).map((dealer) => (
                                        <div key={dealer.id} className="dealer-report-card">
                                            <div className="dealer-report-head">
                                                <div>
                                                    <h4>{dealer.dealer_name || 'Dealer'}</h4>
                                                    <p>{dealer.dealer_code || 'No dealer code'}</p>
                                                </div>
                                                <span className={getStatusClass(dealer.report_status)}>{dealer.report_status}</span>
                                            </div>
                                            <div className="detail-grid">
                                                <div><span className="meta-label">Address</span><p className="meta-value">{dealer.dealer_address || 'Not set'}</p></div>
                                                <div><span className="meta-label">Contact</span><p className="meta-value">{[dealer.mobile_country_code, dealer.mobile_number].filter(Boolean).join(' ') || dealer.contact_email || 'Not set'}</p></div>
                                                <div><span className="meta-label">Currency</span><p className="meta-value">{dealer.currency_code || 'Not set'}</p></div>
                                                <div><span className="meta-label">Employees</span><p className="meta-value">{dealer.employee_count} total / {dealer.active_employee_count} active</p></div>
                                            </div>
                                            <div className="spaced-top">
                                                <h4>Dealer Employees</h4>
                                                {dealer.employees.length === 0 ? (
                                                    <p className="meta-inline">No employees linked to this dealer yet.</p>
                                                ) : (
                                                    <table className="pro-table">
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Code</th>
                                                                <th>Email</th>
                                                                <th>Department</th>
                                                                <th>Role</th>
                                                                <th>Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {dealer.employees.map((employee) => (
                                                                <tr key={employee.id}>
                                                                    <td>{employee.full_name || 'Not set'}<br />{employee.job_title || employee.department || 'No designation'}</td>
                                                                    <td>{employee.employee_code || 'Not set'}</td>
                                                                    <td>{employee.email || 'No email'}</td>
                                                                    <td>{employee.department || 'Not set'}<br />{employee.job_title || 'No designation'}</td>
                                                                    <td>{employee.role_name || 'No role'}</td>
                                                                    <td><span className={getStatusClass(employee.is_active ? 'ACTIVE' : 'INACTIVE')}>{employee.is_active ? 'ACTIVE' : 'INACTIVE'}</span></td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {renderTableLimitControl('report-dealer-information', reportDealerInformationRows.length)}
                                </div>
                            )}
                        </div>
                    </>
                );

}
