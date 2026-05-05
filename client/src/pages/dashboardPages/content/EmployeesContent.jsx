import React from 'react';

export default function EmployeesContent({ ctx }) {
    const {
        ACCESS_PAGE_GROUPS,
        accessMessage,
        accessRoles,
        activePage,
        actualVehiclePrice,
        adForm,
        adMessage,
        adPreviewUrl,
        advanceForm,
        appBrandAddress,
        appBrandContact,
        appBrandName,
        applicationAds,
        availableSalesVehicles,
        buildAssetUrl,
        canDeleteCustomerRecord,
        canEditCustomerDealerDropdown,
        canEditCustomerRecord,
        canViewApplicationsList,
        canViewCompanyDirectory,
        canViewCompanyForm,
        canViewCustomerFingerprint,
        canViewCustomerForm,
        canViewCustomerRecord,
        canViewCustomerRegister,
        canViewDashboardCardActiveDealers,
        canViewDashboardCardActiveEmployees,
        canViewDashboardCardActiveLeases,
        canViewDashboardCardCashTransactions,
        canViewDashboardCardEmployeeCommissions,
        canViewDashboardCardEnrolledBiometrics,
        canViewDashboardCardInstallmentTransactions,
        canViewDashboardCardPendingLeases,
        canViewDashboardCardPendingTasks,
        canViewDashboardCardReceivedInstallments,
        canViewDashboardCardScannedDocuments,
        canViewDashboardCardTotalApplications,
        canViewDashboardCardTotalCustomers,
        canViewDashboardCardTotalDealers,
        canViewDashboardCardTotalEmployees,
        canViewDashboardCardTotalRevenue,
        canViewDashboardCardTotalVehicles,
        canViewDashboardCompanyProfitability,
        canViewDashboardProfitTransactions,
        canViewDashboardRecentApplications,
        canViewDashboardRecentEmployees,
        canViewDashboardSalesPerformance,
        canViewDealerDirectory,
        canViewDealerForm,
        canViewDealerSummary,
        canViewInstallmentCollection,
        canViewInstallmentOverview,
        canViewProductForm,
        canViewProductRegister,
        canViewProductTypeMaster,
        canViewSalesAgreementForm,
        canViewSalesAgreementSummary,
        canViewSalesInstallmentPreview,
        canViewSalesRegister,
        canViewStockOrderForm,
        canViewStockReceived,
        canViewStockRegister,
        canViewTransactionRegister,
        clearCustomerDocumentField,
        companyBusinessAnalytics,
        companyForm,
        companyMessage,
        completedWorkflowTasks,
        currentMonthPayrollRecords,
        currentPayrollMonth,
        currentSalesDealerSignatureUrl,
        customerDealerOptions,
        customerForm,
        customerMessage,
        customerOwnershipCandidates,
        dashboardData,
        dashboardThemes,
        dealerCountryOptions,
        dealerForm,
        dealerMessage,
        editingSaleRecord,
        employeeCurrentMonthCommission,
        employeeForm,
        employeeFormRoleFeatures,
        employeeMessage,
        featureByKey,
        filteredApplications,
        filteredCustomers,
        filteredDealers,
        filteredEmployees,
        filteredInventory,
        formatCompactCurrency,
        formatCurrency,
        formatSaleAgentIdentity,
        formatSaleDealerIdentity,
        formatWorkflowApprovalLine,
        formatWorkflowDealerIdentity,
        getDocumentDisplayName,
        getEmployeeEffectiveFeatureCount,
        getReportBranchValue,
        getRoleDisplayName,
        getStatusClass,
        getUniqueFeatures,
        getVisibleRows,
        handleAdChange,
        handleAdDelete,
        handleAdEdit,
        handleAdSubmit,
        handleAdUpload,
        handleAdvanceChange,
        handleAgreementUpload,
        handleBankSlipUpload,
        handleCaptureFingerprint,
        handleCompanyChange,
        handleCompanySubmit,
        handleCustomerAssetUpload,
        handleCustomerChange,
        handleCustomerSubmit,
        handleDealerChange,
        handleDealerLogoUpload,
        handleDealerSignatureUpload,
        handleDealerSubmit,
        handleDeleteCompany,
        handleDeleteCustomer,
        handleDeleteDealer,
        handleDeleteEmployee,
        handleEditCompany,
        handleEditCustomer,
        handleEditDealer,
        handleEditEmployee,
        handleEditProduct,
        handleEditSale,
        handleEditWorkflowDefinition,
        handleEmployeeAdvanceSubmit,
        handleEmployeeChange,
        handleEmployeeDocumentUpload,
        handleEmployeeSubmit,
        handleGenerateEmployeeSalary,
        handleInstallmentReceiptInputChange,
        handleOpenInstallmentPage,
        handlePrintInstallmentReceipt,
        handlePrintInvoice,
        handlePrintSalarySlip,
        handlePrintTransaction,
        handleProcessOcr,
        handleProductChange,
        handleProductImageUpload,
        handleProductSubmit,
        handleReceiveInstallment,
        handleSaleChange,
        handleSaleDealerSignatureUpload,
        handleSaleDocumentUpload,
        handleSaleSubmit,
        handleSaveRolePermissions,
        handleStockOrderChange,
        handleStockOrderSubmit,
        handleVehicleTypeSubmit,
        handleViewSale,
        handleViewTransaction,
        handleWorkflowDefinitionChange,
        handleWorkflowDefinitionSubmit,
        handleWorkflowTaskAction,
        installmentMarkupPreview,
        installmentPreview,
        installmentReceiptInputs,
        installmentSales,
        installmentSummary,
        isDealerScopedDashboard,
        isPreviewableImage,
        isPreviewablePdf,
        isSelectedSaleVehicleAvailable,
        isSuperAdmin,
        newVehicleType,
        normalizeDateInputValue,
        normalizeRoleName,
        openAccessPopup,
        openStockReceiveModal,
        overviewMetrics,
        payrollMonth,
        pendingStockOrders,
        pendingWorkflowTasks,
        processingWorkflowTaskId,
        productForm,
        productMessage,
        realIsSuperAdmin,
        receivedStockOrders,
        receivingInstallmentId,
        renderAssetPreview,
        renderCustomerDetails,
        renderEmployeeDetails,
        renderEmptyState,
        renderMetricCard,
        renderReportFilters,
        renderReportsSelector,
        renderTableLimitControl,
        reportBusinessTotals,
        reportBusinessTransactionRows,
        reportCustomerRows,
        reportCustomerTransactionRows,
        reportDateFrom,
        reportDateTo,
        reportDealerEmployeeRows,
        reportDealerInformationRows,
        reportEmployeeRows,
        reportInvoiceRows,
        reportSalaryRows,
        reportSalesCommissionTotal,
        reportSalesRows,
        reportSalesTotals,
        reportStockInventoryRows,
        reportStockReceivedRows,
        resetAdForm,
        resetCompanyForm,
        resetCustomerForm,
        resetDealerForm,
        resetEmployeeForm,
        resetProductForm,
        resetSaleForm,
        resetWorkflowDefinitionForm,
        resolvedBranchName,
        roleAssignments,
        roundCurrencyValue,
        salaryEligibleEmployees,
        saleAuthorizedSignatureUrl,
        saleCustomerCnicBackUrl,
        saleCustomerCnicFrontUrl,
        saleDealerSignatureUrl,
        saleForm,
        saleMessage,
        salesAnalytics,
        salesVehicleDropdownOpen,
        salesVehicleOptions,
        savingAccess,
        savingAd,
        savingAdvance,
        savingCompany,
        savingCustomer,
        savingDealer,
        savingEmployee,
        savingPayroll,
        savingProduct,
        savingSale,
        savingStock,
        savingVehicleType,
        savingWorkflowDefinition,
        selectedCustomer,
        selectedEmployee,
        selectedEmployeeCurrentMonthAdvances,
        selectedEmployeeCurrentMonthCommissions,
        selectedEmployeeCurrentMonthPayrolls,
        selectedEmployeeOutstandingAdvance,
        selectedInstallmentAuthorizedSignaturePath,
        selectedInstallmentCnicFrontPath,
        selectedInstallmentImageUrl,
        selectedInstallmentSignaturePath,
        selectedInstallmentThumbUrl,
        selectedSalaryEmployee,
        selectedSalaryEmployeeMonthCommission,
        selectedSalaryEmployeeOutstandingAdvance,
        selectedSaleCustomer,
        selectedSaleCustomerSignatureUrl,
        selectedSaleVehicle,
        selectedSaleVehicleName,
        selectedSaleVehicleSecondaryLine,
        selectedWorkflowTask,
        selectedWorkflowTaskGroup,
        selectedWorkflowTaskId,
        setDealerForm,
        setEmployeeAccessPopupOpen,
        setNewVehicleType,
        setPayrollMonth,
        setSalaryGenerationEmployeeId,
        setSaleForm,
        setSalesVehicleDropdownOpen,
        setSelectedCustomerId,
        setSelectedEmployeeId,
        setSelectedInstallmentSaleId,
        setSelectedWorkflowTaskId,
        setTransactionActionState,
        setUploadingSaleAuthorizedSignature,
        setUploadingSaleBankCheck,
        setUploadingSaleMiscDocument,
        stockMessage,
        stockOrderForm,
        summarizeSaleInstallments,
        tableActionIcons,
        totalEmployeeCommission,
        transactionActionState,
        transactionSales,
        uploadingAgreement,
        uploadingBankSlip,
        uploadingCustomerAsset,
        uploadingEmployeeDocument,
        uploadingSaleAuthorizedSignature,
        uploadingSaleBankCheck,
        uploadingSaleMiscDocument,
        user,
        vehicleTypeMessage,
        visibleSelectedInstallmentRows,
        workflowDefinitionForm,
        workflowMessage,
        workflowRoleOptions,
        workflowTaskGroups,
        workflowTasksTableRef,
    } = ctx;

    if (!canManageEmployees) {
                            return <div className="feedback-card error">Only the super admin can manage employee user accounts.</div>;
                        }
    return (
                            <>
                                <div className="page-heading">
                                    <h1>Employees</h1>
                                    <p>Create employees, assign roles, and grant extra features on top of role permissions.</p>
                                </div>
        
                                <div className="customers-grid">
                                    <form className="table-card customer-form-card" onSubmit={handleEmployeeSubmit}>
                                        <div className="section-header">
                                            <h3>{employeeForm.id ? 'Update Employee' : 'New Employee'}</h3>
                                            <div className="inline-actions">
                                                <button type="button" className="view-btn" onClick={resetEmployeeForm}>Clear</button>
                                                <button type="submit" className="primary-btn" disabled={savingEmployee || !canChangeEmployeeRecord}>
                                                    {savingEmployee ? 'Saving...' : employeeForm.id ? 'Update Employee' : 'Create Employee'}
                                                </button>
                                            </div>
                                        </div>
        
                                        {!canManageEmployees ? (
                                            <div className="notice-banner">
                                                Creation disabled.
                                            </div>
                                        ) : employeeForm.id && !canEditEmployees ? (
                                            <div className="notice-banner">
                                                Record locked.
                                            </div>
                                        ) : !canUnlockEmployeeSecurityFields ? (
                                            <div className="notice-banner">
                                                {employeeForm.id
                                                    ? 'Record locked.'
                                                    : 'Creation disabled.'}
                                            </div>
                                        ) : null}
        
                                        {employeeMessage ? <div className="notice-banner">{employeeMessage}</div> : null}
        
                                        <div className="form-grid">
                                            <label className="field"><span>Employee Code</span><input name="employee_code" value={employeeForm.employee_code} onChange={handleEmployeeChange} placeholder="EMP-001" disabled={!canChangeEmployeeRecord} /></label>
                                            <label className="field"><span>Full Name</span><input name="full_name" value={employeeForm.full_name} onChange={handleEmployeeChange} placeholder="Employee full name" disabled={!canChangeEmployeeRecord} /></label>
                                            <label className="field"><span>Email</span><input name="email" value={employeeForm.email} onChange={handleEmployeeChange} placeholder="employee@motorlease.com" disabled={!canChangeEmployeeRecord} /></label>
                                            <label className="field"><span>Login Password</span><input type="password" name="password" value={employeeForm.password} onChange={handleEmployeeChange} placeholder={employeeForm.id ? "Leave blank to keep current password" : "Set employee login password"} disabled={!canChangeEmployeeRecord} /></label>
                                            <label className="field"><span>Phone</span><input name="phone" value={employeeForm.phone} onChange={handleEmployeeChange} placeholder="+966..." disabled={!canChangeEmployeeRecord} /></label>
                                            <label className="field"><span>Employee CNIC</span><input name="cnic_number" value={employeeForm.cnic_number} onChange={handleEmployeeChange} placeholder="QID / CNIC / Passport no." disabled={!canChangeEmployeeRecord} /></label>
                                            <label className="field"><span>Department</span><input name="department" value={employeeForm.department} onChange={handleEmployeeChange} placeholder="Operations / Sales / Admin" disabled={!canChangeEmployeeRecord} /></label>
                                            <label className="field"><span>Job Title</span><input name="job_title" value={employeeForm.job_title} onChange={handleEmployeeChange} placeholder="Leasing Officer" disabled={!canChangeEmployeeRecord} /></label>
                                            <label className="field"><span>Base Salary</span><input type="number" step="0.01" name="base_salary" value={employeeForm.base_salary} onChange={handleEmployeeChange} placeholder="5000" disabled={!canChangeEmployeeRecord} /></label>
                                            <label className="field"><span>Commission Percentage</span><input type="number" step="0.01" name="commission_percentage" value={employeeForm.commission_percentage} onChange={handleEmployeeChange} placeholder="5" disabled={!canChangeEmployeeRecord} /></label>
                                            <label className="field"><span>Commission Value</span><input type="number" step="0.01" name="commission_value" value={employeeForm.commission_value} onChange={handleEmployeeChange} placeholder="2500" disabled={!canChangeEmployeeRecord} /></label>
                                            {realIsSuperAdmin ? (
                                                <label className="field">
                                                    <span>Assigned Dealer</span>
                                                    <select name="dealer_id" value={employeeForm.dealer_id} onChange={handleEmployeeChange} disabled={!canChangeEmployeeRecord || !canUnlockEmployeeSecurityFields}>
                                                        <option value="">Select dealer</option>
                                                        {(dashboardData.dealers || []).map((dealer) => (
                                                            <option key={`employee-dealer-${dealer.id}`} value={dealer.id}>{dealer.dealer_name}</option>
                                                        ))}
                                                    </select>
                                                </label>
                                            ) : (
                                                <label className="field">
                                                    <span>Assigned Dealer</span>
                                                    <input value={user?.dealer_name || 'Not set'} disabled />
                                                </label>
                                            )}
                                            <label className="field">
                                                <span>Created By</span>
                                                <input
                                                    value={employeeForm.id ? (selectedEmployee?.created_by_name || selectedEmployee?.created_by_email || 'Not set') : (user?.full_name || 'Current user')}
                                                    disabled
                                                />
                                            </label>
                                            <label className="field">
                                                <span>Role</span>
                                                <select name="role_id" value={employeeForm.role_id} onChange={handleEmployeeChange} disabled={!canChangeEmployeeRecord || !canUnlockEmployeeSecurityFields}>
                                                    <option value="">No role assigned</option>
                                                    {dashboardData.roles.map((role) => (
                                                        <option key={role.id} value={role.id}>{role.role_name}</option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label className="field"><span>Hire Date</span><input type="date" name="hired_at" value={employeeForm.hired_at} onChange={handleEmployeeChange} disabled={!canChangeEmployeeRecord} /></label>
                                            <label className="field full-span"><span>CNIC Front URL</span><input name="cnic_front_url" value={employeeForm.cnic_front_url} onChange={handleEmployeeChange} placeholder="/uploads/employees/..." disabled={!canChangeEmployeeRecord} /></label>
                                            <label className="field full-span"><span>Upload Employee CNIC Front</span><input type="file" accept="image/*,.pdf" onChange={(event) => handleEmployeeDocumentUpload(event, 'cnic_front_url')} disabled={!canChangeEmployeeRecord || uploadingEmployeeDocument} /></label>
                                            <label className="field full-span"><span>CNIC Back URL</span><input name="cnic_back_url" value={employeeForm.cnic_back_url} onChange={handleEmployeeChange} placeholder="/uploads/employees/..." disabled={!canChangeEmployeeRecord} /></label>
                                            <label className="field full-span"><span>Upload Employee CNIC Back</span><input type="file" accept="image/*,.pdf" onChange={(event) => handleEmployeeDocumentUpload(event, 'cnic_back_url')} disabled={!canChangeEmployeeRecord || uploadingEmployeeDocument} /></label>
                                            <label className="field full-span"><span>Notes</span><textarea name="notes" value={employeeForm.notes} onChange={handleEmployeeChange} rows="4" placeholder="Optional notes about this employee" disabled={!canChangeEmployeeRecord} /></label>
                                            <label className="field checkbox-field">
                                                <span>Active Employee</span>
                                                <input type="checkbox" name="is_active" checked={employeeForm.is_active} onChange={handleEmployeeChange} disabled={!canChangeEmployeeRecord || !canUnlockEmployeeSecurityFields} />
                                            </label>
                                        </div>
        
                                        <div className="scanner-box">
                                            <div className="section-header">
                                                <h3>Employee Feature Access</h3>
                                                <div className="inline-actions">
                                                    <span className="section-caption">Keep the page short and manage role-based access in a popup.</span>
                                                    <button
                                                        type="button"
                                                        className="view-btn"
                                                        onClick={() => setEmployeeAccessPopupOpen(true)}
                                                        disabled={!canChangeEmployeeRecord}
                                                    >
                                                        Manage Access
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="feature-access-summary">
                                                <div className="metric-card">
                                                    <label>Inherited From Role</label>
                                                    <div className="value">{employeeFormRoleFeatures.length}</div>
                                                </div>
                                                <div className="metric-card">
                                                    <label>Extra Access</label>
                                                    <div className="value success">{employeeForm.feature_ids.length}</div>
                                                </div>
                                                <div className="metric-card">
                                                    <label>Restricted Access</label>
                                                    <div className="value warning">{employeeForm.denied_feature_ids.length}</div>
                                                </div>
                                            </div>
                                            <div className="feature-stack">
                                                <div>
                                                    <span className="meta-label">Current Access Summary</span>
                                                    <div className="feature-list">
                                                        {employeeFormRoleFeatures.slice(0, 4).map((feature) => (
                                                            <span key={`summary-role-${feature.id}`} className="feature-pill">
                                                                {feature.display_name}
                                                            </span>
                                                        ))}
                                                        {employeeForm.feature_ids.slice(0, 4).map((featureId) => {
                                                            const feature = dashboardData.features.find((item) => Number(item.id) === Number(featureId));
                                                            return feature ? <span key={`summary-extra-${feature.id}`} className="feature-pill">{feature.display_name}</span> : null;
                                                        })}
                                                        {employeeForm.denied_feature_ids.slice(0, 4).map((featureId) => {
                                                            const feature = dashboardData.features.find((item) => Number(item.id) === Number(featureId));
                                                            return feature ? <span key={`summary-deny-${feature.id}`} className="feature-pill muted">{feature.display_name}</span> : null;
                                                        })}
                                                        {employeeFormRoleFeatures.length === 0 && employeeForm.feature_ids.length === 0 && employeeForm.denied_feature_ids.length === 0 ? (
                                                            <span className="feature-pill muted">Select a role, then open Manage Access</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
        
                                    {renderEmployeeDetails()}
                                </div>
        
                                <div className="customers-grid">
                                    <form className="table-card" onSubmit={handleEmployeeAdvanceSubmit}>
                                        <div className="section-header">
                                            <h3>Advance Cash</h3>
                                            <button type="submit" className="primary-btn" disabled={savingAdvance || !selectedEmployeeId}>
                                                {savingAdvance ? 'Saving...' : 'Save Advance'}
                                            </button>
                                        </div>
                                        <div className="form-grid">
                                            <label className="field">
                                                <span>Employee</span>
                                                <input value={selectedEmployee?.full_name || 'Select employee'} disabled />
                                            </label>
                                            <label className="field">
                                                <span>Advance Date</span>
                                                <input type="date" name="advance_date" value={advanceForm.advance_date} onChange={handleAdvanceChange} />
                                            </label>
                                            <label className="field">
                                                <span>Advance Amount</span>
                                                <input type="number" step="0.01" name="amount" value={advanceForm.amount} onChange={handleAdvanceChange} placeholder="1000" />
                                            </label>
                                            <label className="field full-span">
                                                <span>Reason</span>
                                                <textarea name="reason" value={advanceForm.reason} onChange={handleAdvanceChange} rows="3" placeholder="Expense / travel / office work" />
                                            </label>
                                        </div>
                                    </form>
        
                                    <div className="table-card">
                                        <div className="section-header">
                                            <h3>Monthly Salary Generation</h3>
                                            <button type="button" className="primary-btn" onClick={handleGenerateEmployeeSalary} disabled={savingPayroll || !salaryGenerationEmployeeId}>
                                                {savingPayroll ? 'Generating...' : 'Generate Salary'}
                                            </button>
                                        </div>
                                        <div className="form-grid">
                                            <label className="field">
                                                <span>Employee</span>
                                                <select value={salaryGenerationEmployeeId} onChange={(event) => setSalaryGenerationEmployeeId(event.target.value)}>
                                                    <option value="">Select employee</option>
                                                    {salaryEligibleEmployees.map((employee) => (
                                                        <option key={`salary-employee-${employee.id}`} value={employee.id}>
                                                            {employee.full_name} ({employee.employee_code || 'No code'})
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label className="field">
                                                <span>Payroll Month</span>
                                                <input type="month" value={payrollMonth} onChange={(event) => setPayrollMonth(event.target.value)} />
                                            </label>
                                            <div className="metric-card">
                                                <label>Base Salary</label>
                                                <div className="value">{formatCurrency(selectedSalaryEmployee?.base_salary || 0)}</div>
                                            </div>
                                            <div className="metric-card">
                                                <label>Earned Commission</label>
                                                <div className="value success">{formatCurrency(selectedSalaryEmployeeMonthCommission || 0)}</div>
                                            </div>
                                            <div className="metric-card">
                                                <label>Outstanding Advance</label>
                                                <div className="value warning">{formatCurrency(selectedSalaryEmployeeOutstandingAdvance || 0)}</div>
                                            </div>
                                        </div>
                                        {salaryEligibleEmployees.length === 0 ? (
                                            <div className="notice-banner">Salary already generated for all active employees in {payrollMonth}.</div>
                                        ) : null}
                                    </div>
                                </div>
        
                                <div className="table-card">
                                    <div className="section-header">
                                        <h3>Employee Directory</h3>
                                        <span className="section-caption">{filteredEmployees.length} visible employees</span>
                                    </div>
                                    {filteredEmployees.length === 0 ? (
                                        renderEmptyState('No employees found yet. Create the first employee record above.')
                                    ) : (
                                        <table className="pro-table">
                                            <thead>
                                                <tr>
                                                    <th>Code</th>
                                                    <th>Employee</th>
                                                    <th>Position / Designation</th>
                                                    <th>Role</th>
                                                    <th>Status</th>
                                                    <th>Features</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredEmployees.map((employee) => (
                                                    <tr key={employee.id}>
                                                        <td>{employee.employee_code}</td>
                                                        <td>
                                                            {employee.full_name}
                                                            <br />
                                                            {employee.job_title || 'No designation'}
                                                            <br />
                                                            {employee.dealer_name || 'Not set'}
                                                        </td>
                                                        <td>{employee.department || 'No position'}<br />{employee.job_title || 'No designation'}<br />{employee.dealer_name || 'Not set'}</td>
                                                        <td>{employee.role_name || 'No role'}<br />{Number(employee.commission_percentage || 0)}% / {formatCurrency(employee.commission_value || 0)}</td>
                                                        <td><span className={getStatusClass(employee.is_active ? 'ACTIVE' : 'DRAFT')}>{employee.is_active ? 'Active' : 'Inactive'}</span></td>
                                                        <td>{getEmployeeEffectiveFeatureCount(employee)}</td>
                                                        <td>
                                                            <div className="table-actions">
                                                                <button type="button" className="view-btn" onClick={() => setSelectedEmployeeId(employee.id)}>View</button>
                                                                {canEditEmployees ? <button type="button" className="view-btn" onClick={() => handleEditEmployee(employee)}>Edit</button> : null}
                                                                {canManageEmployees ? <button type="button" className="danger-btn" onClick={() => handleDeleteEmployee(employee)}>Delete</button> : null}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
        
                                <div className="customers-grid">
                                    <div className="table-card">
                                        <div className="section-header">
                                            <h3>Current Month Commission Ledger</h3>
                                            <span className="section-caption">{selectedEmployeeCurrentMonthCommissions.length} entries for {currentPayrollMonth}</span>
                                        </div>
                                        {selectedEmployeeCurrentMonthCommissions.length === 0 ? (
                                            renderEmptyState(`No commissions recorded yet for ${currentPayrollMonth}.`)
                                        ) : (
                                            <>
                                                <table className="pro-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Type</th>
                                                            <th>Base Amount</th>
                                                            <th>Commission</th>
                                                            <th>Customer</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getVisibleRows('employee-commissions', selectedEmployeeCurrentMonthCommissions).map((row) => (
                                                            <tr key={row.id}>
                                                                <td>{String(row.earned_on || '').slice(0, 10) || 'Not set'}</td>
                                                                <td>{row.commission_type}</td>
                                                                <td>{formatCurrency(row.base_amount || 0)}</td>
                                                                <td>{formatCurrency(row.commission_amount || 0)}</td>
                                                                <td>{row.customer_name || row.agreement_number || 'Not set'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {renderTableLimitControl('employee-commissions', selectedEmployeeCurrentMonthCommissions.length)}
                                            </>
                                        )}
                                    </div>
        
                                    <div className="table-card">
                                        <div className="section-header">
                                            <h3>Current Month Salary Record</h3>
                                            <span className="section-caption">{selectedEmployeeCurrentMonthPayrolls.length} generated record(s) for {currentPayrollMonth}</span>
                                        </div>
                                        {selectedEmployeeCurrentMonthPayrolls.length === 0 ? (
                                            renderEmptyState(`No salary generated yet for ${currentPayrollMonth}.`)
                                        ) : (
                                            <>
                                                <table className="pro-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Month</th>
                                                            <th>Base Salary</th>
                                                            <th>Commission</th>
                                                            <th>Advance Deduction</th>
                                                            <th>Net Salary</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getVisibleRows('employee-payrolls', selectedEmployeeCurrentMonthPayrolls).map((row) => (
                                                            <tr key={row.id}>
                                                                <td>{row.payroll_month}</td>
                                                                <td>{formatCurrency(row.base_salary || 0)}</td>
                                                                <td>{formatCurrency(row.total_commission || 0)}</td>
                                                                <td>{formatCurrency(row.total_advances || 0)}</td>
                                                                <td>{formatCurrency(row.net_salary || 0)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {renderTableLimitControl('employee-payrolls', selectedEmployeeCurrentMonthPayrolls.length)}
                                            </>
                                        )}
                                    </div>
                                </div>
        
                                <div className="table-card">
                                    <div className="section-header">
                                        <h3>Current Month Advance History</h3>
                                        <span className="section-caption">{selectedEmployeeCurrentMonthAdvances.length} advances for {currentPayrollMonth}</span>
                                    </div>
                                    {selectedEmployeeCurrentMonthAdvances.length === 0 ? (
                                        renderEmptyState(`No advance cash recorded yet for ${currentPayrollMonth}.`)
                                    ) : (
                                        <>
                                            <table className="pro-table">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Amount</th>
                                                        <th>Reason</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getVisibleRows('employee-advances', selectedEmployeeCurrentMonthAdvances).map((row) => (
                                                        <tr key={row.id}>
                                                            <td>{String(row.advance_date || '').slice(0, 10) || 'Not set'}</td>
                                                            <td>{formatCurrency(row.amount || 0)}</td>
                                                            <td>{row.reason || 'No reason'}</td>
                                                            <td>
                                                                <span className={getStatusClass(row.deducted_in_payroll_id ? 'RECEIVED' : 'PENDING')}>
                                                                    {row.deducted_in_payroll_id ? 'Deducted' : 'Outstanding'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {renderTableLimitControl('employee-advances', selectedEmployeeCurrentMonthAdvances.length)}
                                        </>
                                    )}
                                </div>
        
                                <div className="table-card">
                                    <div className="section-header">
                                        <h3>Current Month Generated Salaries</h3>
                                        <span className="section-caption">{currentMonthPayrollRecords.length} generated salary record(s)</span>
                                    </div>
                                    {currentMonthPayrollRecords.length === 0 ? renderEmptyState(`No salary generated yet for ${currentPayrollMonth}.`) : (
                                        <>
                                            <table className="pro-table">
                                                <thead>
                                                    <tr>
                                                        <th>Employee</th>
                                                        <th>Payroll Month</th>
                                                        <th>Base Salary</th>
                                                        <th>Commission</th>
                                                        <th>Advance Deduction</th>
                                                        <th>Net Salary</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getVisibleRows('current-month-payrolls', currentMonthPayrollRecords).map((row) => {
                                                        const payrollEmployee = dashboardData.employees.find((employee) => employee.id === row.employee_id);
                                                        const payrollRow = {
                                                            ...row,
                                                            full_name: payrollEmployee?.full_name || 'Unknown employee',
                                                            employee_code: payrollEmployee?.employee_code || 'No code',
                                                            department: payrollEmployee?.department || 'Not set',
                                                            branch_name: payrollEmployee?.branch_name || resolvedBranchName,
                                                            report_status: 'GENERATED',
                                                        };
                                                        return (
                                                            <tr key={row.id}>
                                                                <td>{payrollEmployee?.full_name || 'Unknown employee'}<br />{payrollEmployee?.employee_code || 'No code'}</td>
                                                                <td>{row.payroll_month}</td>
                                                                <td>{formatCurrency(row.base_salary || 0)}</td>
                                                                <td>{formatCurrency(row.total_commission || 0)}</td>
                                                                <td>{formatCurrency(row.total_advances || 0)}</td>
                                                                <td>{formatCurrency(row.net_salary || 0)}</td>
                                                                <td>
                                                                    <button type="button" className="view-btn" onClick={() => handlePrintSalarySlip(payrollRow)}>
                                                                        Print Slip
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                            {renderTableLimitControl('current-month-payrolls', currentMonthPayrollRecords.length)}
                                        </>
                                    )}
                                </div>
                            </>
                        );
}
