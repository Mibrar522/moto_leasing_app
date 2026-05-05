import React from 'react';

function WorkflowContent({ ctx }) {
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

    if (!canOpenWorkflowWorkspace) {
                            return <div className="feedback-card error">Your account does not have workflow access.</div>;
                        }
    return (
                            <>
                                <div className="page-heading">
                                    <h1>Workflow</h1>
                                    <p>Define the approval path yourself. You can route requests directly from agent to application admin, or first to manager and then to application admin.</p>
                                </div>
                                {canViewWorkflowConfig ? (
                                    <div className="table-card">
                                        <div className="section-header">
                                            <h3>Approval Flow Setup</h3>
                                            <div className="inline-actions">
                                                <button type="button" className="view-btn" onClick={resetWorkflowDefinitionForm}>Clear</button>
                                                <button type="submit" form="workflow-definition-form" className="primary-btn" disabled={savingWorkflowDefinition}>
                                                    {savingWorkflowDefinition ? 'Saving...' : workflowDefinitionForm.id ? 'Update Workflow' : 'Save Workflow'}
                                                </button>
                                            </div>
                                        </div>
                                        {workflowMessage ? <div className="notice-banner">{workflowMessage}</div> : null}
                                        <form id="workflow-definition-form" className="form-grid" onSubmit={handleWorkflowDefinitionSubmit}>
                                            <label className="field">
                                                <span>Workflow Name</span>
                                                <input name="definition_name" value={workflowDefinitionForm.definition_name} onChange={handleWorkflowDefinitionChange} placeholder="Agent Sale Approval" />
                                            </label>
                                            <label className="field">
                                                <span>Requester Role</span>
                                                <select name="requester_role_name" value={workflowDefinitionForm.requester_role_name} onChange={handleWorkflowDefinitionChange}>
                                                    {workflowRoleOptions.map((roleName) => <option key={`requester-${roleName}`} value={roleName}>{roleName}</option>)}
                                                </select>
                                            </label>
                                            <label className="field">
                                                <span>First Approval Target</span>
                                                <select name="first_approver_role_name" value={workflowDefinitionForm.first_approver_role_name} onChange={handleWorkflowDefinitionChange}>
                                                    {workflowRoleOptions.filter((roleName) => roleName !== workflowDefinitionForm.requester_role_name).map((roleName) => <option key={`first-${roleName}`} value={roleName}>{roleName}</option>)}
                                                </select>
                                            </label>
                                            <label className="field">
                                                <span>Second Approval Target</span>
                                                <select name="second_approver_role_name" value={workflowDefinitionForm.second_approver_role_name} onChange={handleWorkflowDefinitionChange}>
                                                    <option value="">Skip second approval</option>
                                                    {workflowRoleOptions
                                                        .filter((roleName) => roleName !== workflowDefinitionForm.requester_role_name && roleName !== workflowDefinitionForm.first_approver_role_name)
                                                        .map((roleName) => <option key={`second-${roleName}`} value={roleName}>{roleName}</option>)}
                                                </select>
                                            </label>
                                            {isSuperAdmin ? (
                                                <label className="field">
                                                    <span>Dealer Scope</span>
                                                    <select name="dealer_id" value={workflowDefinitionForm.dealer_id} onChange={handleWorkflowDefinitionChange}>
                                                        <option value="">All Dealers</option>
                                                        {(dashboardData.dealers || []).map((dealer) => (
                                                            <option key={`workflow-dealer-${dealer.id}`} value={dealer.id}>{dealer.dealer_name}</option>
                                                        ))}
                                                    </select>
                                                </label>
                                            ) : null}
                                            <label className="field checkbox-field">
                                                <span>Active Workflow</span>
                                                <input type="checkbox" name="is_active" checked={workflowDefinitionForm.is_active} onChange={handleWorkflowDefinitionChange} />
                                            </label>
                                        </form>
                                        <div className="notice-banner spaced-top">
                                            Direct flow: set <strong>First Approval Target</strong> to <strong>APPLICATION_ADMIN</strong> and leave <strong>Second Approval Target</strong> empty. Manager flow: set <strong>First Approval Target</strong> to <strong>MANAGER</strong> and <strong>Second Approval Target</strong> to <strong>APPLICATION_ADMIN</strong>.
                                        </div>
                                        <div className="feature-list spaced-top">
                                            {(dashboardData.workflowDefinitions || []).length > 0 ? (
                                                dashboardData.workflowDefinitions.map((definition) => (
                                                    <button key={definition.id} type="button" className="feature-pill" onClick={() => handleEditWorkflowDefinition(definition)}>
                                                        {definition.definition_name} · {definition.requester_role_name} → {definition.first_approver_role_name}{definition.second_approver_role_name ? ` → ${definition.second_approver_role_name}` : ''}
                                                    </button>
                                                ))
                                            ) : (
                                                <span className="feature-pill muted">No workflow definitions saved yet</span>
                                            )}
                                        </div>
                                    </div>
                                ) : null}
        
                                {!canViewWorkflowConfig && canViewWorkflowTasks ? (
                                    <div className="table-card">
                                        <div className="section-header">
                                            <h3>Workflow Access</h3>
                                        </div>
                                        <div className="notice-banner">
                                            Approval flow setup is disabled for this role, but workflow task handling is still enabled. Use the <strong>User Tasks</strong> tab to review and process assigned approvals.
                                        </div>
                                    </div>
                                ) : null}
        
                                {false ? (
                                    <div className="dashboard-split">
                                        <div className="table-card">
                                            <div className="section-header">
                                                <h3>User Tasks</h3>
                                                <span className="section-caption">{pendingWorkflowTasks.length} pending / {completedWorkflowTasks.length} completed</span>
                                            </div>
                                            {(dashboardData.workflowTasks || []).length === 0 ? renderEmptyState('No workflow tasks are available for this user right now.') : (
                                                <table className="pro-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Status</th>
                                                            <th>Dealer</th>
                                                            <th>Customer</th>
                                                            <th>Vehicle</th>
                                                            <th>Route</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(dashboardData.workflowTasks || []).map((task) => (
                                                            <tr key={task.id}>
                                                                <td><span className={getStatusClass(task.task_status)}>{task.task_status}</span></td>
                                                                <td>{task.dealer_name || 'Global'}</td>
                                                                <td>{task.customer_name || 'Not set'}</td>
                                                                <td>{task.brand} {task.model}<br />{task.serial_number || task.registration_number || 'No serial'}</td>
                                                                <td>{task.requester_name || 'Unknown'} → {task.assigned_role_name} ({task.step_number}/{task.total_steps})</td>
                                                                <td><button type="button" className="view-btn" onClick={() => setSelectedWorkflowTaskId(task.id)}>Review</button></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
        
                                        <div className="table-card">
                                            <div className="section-header">
                                                <h3>Task Review</h3>
                                                <span className="section-caption">{selectedWorkflowTask ? `${selectedWorkflowTask.assigned_role_name} review` : 'Choose a task'}</span>
                                            </div>
                                            {selectedWorkflowTask ? (
                                                <>
                                                    <div className="detail-grid">
                                                        <div><span className="meta-label">Workflow</span><p className="meta-value">{selectedWorkflowTask.definition_name || 'Sale Approval'}</p></div>
                                                        <div><span className="meta-label">Approval Line</span><p className="meta-value">{selectedWorkflowTaskGroup?.approvalTrail || formatWorkflowApprovalLine(selectedWorkflowTask)}</p></div>
                                    <div><span className="meta-label">Dealer</span><p className="meta-value">{formatWorkflowDealerIdentity(selectedWorkflowTask)}</p></div>
                                                        <div><span className="meta-label">Requested By</span><p className="meta-value">{selectedWorkflowTask.requester_name || 'Unknown'}</p></div>
                                                        <div><span className="meta-label">Customer</span><p className="meta-value">{selectedWorkflowTask.customer_name || 'Not set'}{selectedWorkflowTask.cnic_passport_number ? ` / ${selectedWorkflowTask.cnic_passport_number}` : ''}</p></div>
                                                        <div><span className="meta-label">Vehicle</span><p className="meta-value">{selectedWorkflowTask.brand} {selectedWorkflowTask.model}{selectedWorkflowTask.serial_number ? ` / ${selectedWorkflowTask.serial_number}` : selectedWorkflowTask.registration_number ? ` / ${selectedWorkflowTask.registration_number}` : ''}</p></div>
                                                        <div><span className="meta-label">Chassis / Engine</span><p className="meta-value">{selectedWorkflowTask.chassis_number || 'Not set'} / {selectedWorkflowTask.engine_number || 'Not set'}</p></div>
                                                        <div><span className="meta-label">Sale Mode</span><p className="meta-value">{selectedWorkflowTask.sale_mode || 'Not set'}</p></div>
                                                        <div><span className="meta-label">Vehicle Price</span><p className="meta-value">{formatCurrency(selectedWorkflowTask.vehicle_price || 0)}</p></div>
                                                        <div><span className="meta-label">Agreement No.</span><p className="meta-value">{selectedWorkflowTask.agreement_number || 'Not set'}</p></div>
                                                        <div><span className="meta-label">Purchase Date</span><p className="meta-value">{selectedWorkflowTask.purchase_date || selectedWorkflowTask.agreement_date || 'Not set'}</p></div>
                                                    </div>
                                                    <div className="inline-actions spaced-top">
                                                        {selectedWorkflowTask.agreement_pdf_url ? (
                                                            <a className="view-btn" href={buildAssetUrl(selectedWorkflowTask.agreement_pdf_url)} target="_blank" rel="noreferrer">Open Attachment</a>
                                                        ) : (
                                                            <span className="feature-pill muted">No attachment uploaded</span>
                                                        )}
                                                        {canViewSalesAgreementForm ? (
                                                            <button
                                                                type="button"
                                                                className="view-btn"
                                                                onClick={() => {
                                                                    const workflowSale = (dashboardData.salesTransactions || []).find((sale) => sale.id === selectedWorkflowTask.entity_id);
                                                                    if (workflowSale) {
                                                                        handleEditSale(workflowSale);
                                                                    }
                                                                }}
                                                            >
                                                                View / Edit Form
                                                            </button>
                                                        ) : null}
                                                        {String(selectedWorkflowTask.task_status || '').toUpperCase() === 'PENDING' ? (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    className="secondary-btn"
                                                                    onClick={() => handleWorkflowTaskAction(selectedWorkflowTask.id, 'reject')}
                                                                    disabled={processingWorkflowTaskId === selectedWorkflowTask.id}
                                                                >
                                                                    {processingWorkflowTaskId === selectedWorkflowTask.id ? 'Saving...' : 'Reject'}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="primary-btn"
                                                                    onClick={() => handleWorkflowTaskAction(selectedWorkflowTask.id, 'approve')}
                                                                    disabled={processingWorkflowTaskId === selectedWorkflowTask.id}
                                                                >
                                                                    {processingWorkflowTaskId === selectedWorkflowTask.id ? 'Saving...' : 'Approve'}
                                                                </button>
                                                            </>
                                                        ) : null}
                                                    </div>
                                                    {null}
                                                </>
                                            ) : (
                                                renderEmptyState('Select a workflow task to review the request form, attachment, and approval action.')
                                            )}
                                        </div>
                                    </div>
                                ) : null}
                            </>
                        );
}

function UserTasksContent({ ctx }) {
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

    if (!canViewWorkflowTasks) {
                            return <div className="feedback-card error">Your account does not have user task access.</div>;
                        }
    return (
                            <>
                                <div className="page-heading">
                                    <h1>User Tasks</h1>
                                    <p>All approval requests come here for the assigned manager or application admin to review customer details, vehicle details, and attachments.</p>
                                </div>
        
                                <div className="table-card" ref={workflowTasksTableRef}>
                                    <div className="section-header">
                                        <h3>User Task Queue</h3>
                                        <span className="section-caption">{pendingWorkflowTasks.length} pending / {completedWorkflowTasks.length} completed</span>
                                    </div>
                                    {workflowTaskGroups.length === 0 ? renderEmptyState('No workflow tasks are available for this user right now.') : (
                                        <table className="pro-table">
                                            <thead>
                                                <tr>
                                                    <th>Status</th>
                                                    <th>Dealer / Requester</th>
                                                    <th>Customer</th>
                                                    <th>Vehicle</th>
                                                    <th>Attachment</th>
                                                    <th>Route</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {workflowTaskGroups.map((group) => {
                                                    const task = group.primaryTask;
                                                    return (
                                                                <tr key={`user-task-group-${group.key}`} className={task?.id === selectedWorkflowTaskId ? 'workflow-task-row is-selected' : 'workflow-task-row'}>
                                                                    <td><span className={getStatusClass(group.overallStatus)}>{group.overallStatus}</span></td>
                                                            <td>{formatWorkflowDealerIdentity(task)}<br />{task?.requester_name || 'Unknown requester'}</td>
                                                            <td>{task?.customer_name || 'Not set'}<br />{task?.cnic_passport_number || 'No ID'}</td>
                                                            <td>{task?.brand} {task?.model}<br />{task?.serial_number || task?.registration_number || 'No serial'}</td>
                                                            <td>{task?.agreement_pdf_url ? 'Attached' : 'No file'}</td>
                                                        <td>{task.requester_name || 'Unknown'} → {task.assigned_role_name} ({task.step_number}/{task.total_steps})</td>
                                                            <td><button type="button" className="view-btn" onClick={() => setSelectedWorkflowTaskId(task?.id || '')}>View Details</button></td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </>
                        );
}

function EmployeesContent({ ctx }) {
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

function AccessControlContent({ ctx }) {
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

    return (
                            <>
                                <div className="page-heading">
                                    <h1>Roles and Features</h1>
                                    <p>Application admins can assign role permissions and control which features managers and employees can use.</p>
                                </div>
        
                                {!canManageAccess ? (
                                    <div className="feedback-card error">Your account cannot manage access control.</div>
                                ) : null}
        
                                {accessMessage ? <div className="notice-banner">{accessMessage}</div> : null}
        
                                <div className="access-role-grid">
                                    {accessRoles.length === 0 ? (
                                        <div className="feedback-card error">
                                            No access roles were returned by the backend. Check the roles table has SUPER_ADMIN, APPLICATION_ADMIN, MANAGER, and AGENT role names.
                                        </div>
                                    ) : null}
                                    {accessRoles.map((role) => (
                                        <div key={role.id} className="table-card">
                                            <div className="section-header">
                                                <h3>{getRoleDisplayName(role.role_name)}</h3>
                                                <button
                                                    type="button"
                                                    className="primary-btn"
                                                    disabled={!canManageAccess || savingAccess}
                                                    onClick={() => handleSaveRolePermissions(role.id)}
                                                >
                                                    {savingAccess ? 'Saving...' : 'Save Role'}
                                                </button>
                                            </div>
                                            <p className="section-caption">Open a page to enable or disable its available functions for this role.</p>
                                            <div className="access-page-grid">
                                                {ACCESS_PAGE_GROUPS.map((group) => {
                                                    const availableFeatures = getUniqueFeatures(
                                                        group.featureKeys
                                                            .map((featureKey) => featureByKey[featureKey])
                                                            .filter(Boolean)
                                                    );
                                                    const enabledCount = availableFeatures.filter((feature) => (roleAssignments[role.id] || []).includes(Number(feature.id))).length;
        
                                                    return (
                                                        <button
                                                            key={`${role.id}-${group.key}`}
                                                            type="button"
                                                            className="access-page-card"
                                                            onClick={() => openAccessPopup(role.id, group.key)}
                                                            disabled={!canManageAccess || availableFeatures.length === 0}
                                                        >
                                                            <span className="access-page-title">{group.label}</span>
                                                            <span className="access-page-meta">{enabledCount} / {availableFeatures.length} enabled</span>
                                                            <span className="access-page-description">{group.description}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        );
}

function DealersContent({ ctx }) {
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

    return (
                                <>
                                    <div className="page-heading">
                                        <h1>Dealer Applications</h1>
                                        <p>Create a fresh dealer profile with its own branding, country-aware contact details, and currency setup.</p>
                                    </div>
        
                                {!canManageDealers ? (
                                    <div className="feedback-card error">Only the super admin can create and configure dealer applications.</div>
                                ) : null}
        
                                <div className="customers-grid">
                                    {canViewDealerForm ? (
                                    <form className="table-card customer-form-card" onSubmit={handleDealerSubmit}>
                                        <div className="section-header">
                                            <h3>{dealerForm.id ? 'Edit Dealer' : 'New Dealer'}</h3>
                                            <div className="inline-actions">
                                                {dealerForm.id ? (
                                                    <button type="button" className="view-btn" onClick={resetDealerForm}>
                                                        Cancel Edit
                                                    </button>
                                                ) : null}
                                                <button type="submit" className="primary-btn" disabled={!canManageDealers || savingDealer}>
                                                    {savingDealer ? 'Saving...' : dealerForm.id ? 'Update Dealer' : 'Create Dealer'}
                                                </button>
                                            </div>
                                        </div>
                                        {dealerMessage ? <div className="notice-banner">{dealerMessage}</div> : null}
                                        <div className="form-grid">
                                            <label className="field"><span>Dealer Name</span><input name="dealer_name" value={dealerForm.dealer_name} onChange={handleDealerChange} /></label>
                                            <label className="field"><span>Dealer CNIC</span><input name="dealer_cnic" value={dealerForm.dealer_cnic} onChange={handleDealerChange} /></label>
                                            <label className="field full-span"><span>Dealer Address</span><textarea rows="3" name="dealer_address" value={dealerForm.dealer_address} onChange={handleDealerChange} /></label>
                                            <label className="field full-span"><span>Dealer Logo</span><input type="file" accept="image/*" onChange={handleDealerLogoUpload} /></label>
                                            <label className="field full-span"><span>Uploaded Logo URL</span><input name="dealer_logo_url" value={dealerForm.dealer_logo_url} onChange={handleDealerChange} readOnly /></label>
                                            <label className="field full-span"><span>Dealer Signature Image</span><input type="file" accept="image/*" onChange={handleDealerSignatureUpload} required={!dealerForm.id && !dealerForm.dealer_signature_url} /></label>
                                            <label className="field full-span"><span>Uploaded Signature URL</span><input name="dealer_signature_url" value={dealerForm.dealer_signature_url} onChange={handleDealerChange} readOnly /></label>
                                            <div className="field full-span">
                                                <span>Signature Preview</span>
                                                {renderAssetPreview(dealerForm.dealer_signature_url, 'Upload dealer signature to continue onboarding.', 'Dealer Signature')}
                                            </div>
                                            <label className="field"><span>Application Theme</span><select name="theme_key" value={dealerForm.theme_key} onChange={handleDealerChange}>{dashboardThemes.map((theme) => <option key={theme.key} value={theme.key}>{theme.label}</option>)}</select></label>
                                            <label className="field"><span>Mobile Country</span><select name="mobile_country" value={dealerForm.mobile_country} onChange={handleDealerChange}>{dealerCountryOptions.map((country) => <option key={country.value} value={country.value}>{country.label}</option>)}</select></label>
                                            <label className="field"><span>Country Code</span><input name="mobile_country_code" value={dealerForm.mobile_country_code} readOnly /></label>
                                            <label className="field"><span>Mobile Number</span><input name="mobile_number" value={dealerForm.mobile_number} onChange={handleDealerChange} placeholder="Example: 30000000" /></label>
                                            <label className="field"><span>Currency</span><select name="currency_code" value={dealerForm.currency_code} onChange={handleDealerChange}><option value="QAR">QAR</option><option value="PKR">PKR</option><option value="SAR">SAR</option><option value="AED">AED</option><option value="USD">USD</option></select></label>
                                            <label className="field"><span>Contact Email</span><input name="contact_email" value={dealerForm.contact_email} onChange={handleDealerChange} type="email" /></label>
                                            <label className="field"><span>Dealer Admin Name</span><input name="admin_full_name" value={dealerForm.admin_full_name} onChange={handleDealerChange} /></label>
                                            <label className="field"><span>Dealer Admin Email</span><input name="admin_email" value={dealerForm.admin_email} onChange={handleDealerChange} type="email" /></label>
                                            <label className="field">
                                                <span>Dealer Admin Role</span>
                                                <select name="admin_role_id" value={dealerForm.admin_role_id} onChange={handleDealerChange}>
                                    {accessRoles.filter((role) => normalizeRoleName(role.role_name) !== 'SUPER_ADMIN').map((role) => (
                                        <option key={`dealer-admin-role-${role.id}`} value={role.id}>{getRoleDisplayName(role.role_name)}</option>
                                    ))}
                                                </select>
                                            </label>
                                            <label className="field"><span>Dealer Admin Password</span><input name="admin_password" value={dealerForm.admin_password} onChange={handleDealerChange} type="password" /></label>
                                            <label className="field">
                                                <span>Dealer Status</span>
                                                <select name="is_active" value={String(dealerForm.is_active)} onChange={(event) => setDealerForm((current) => ({ ...current, is_active: event.target.value === 'true' }))}>
                                                    <option value="true">Active</option>
                                                    <option value="false">Inactive</option>
                                                </select>
                                            </label>
                                            <label className="field full-span"><span>Setup Notes</span><textarea rows="4" name="notes" value={dealerForm.notes} onChange={handleDealerChange} placeholder="Anything special for this dealer's new application setup..." /></label>
                                        </div>
                                    </form>
                                    ) : null}
        
                                    {canViewDealerSummary ? (
                                    <div className="table-card">
                                        <h3>Fresh Start Summary</h3>
                                        <div className="detail-grid">
                                            <div><span className="meta-label">Platform Scope</span><p className="meta-value">Multi-dealer ready</p></div>
                                            <div><span className="meta-label">Selected Country</span><p className="meta-value">{dealerCountryOptions.find((country) => country.value === dealerForm.mobile_country)?.label || dealerForm.mobile_country} ({dealerForm.mobile_country_code})</p></div>
                                            <div><span className="meta-label">Selected Theme</span><p className="meta-value">{dashboardThemes.find((theme) => theme.key === dealerForm.theme_key)?.label || 'Sandstone Pro'}</p></div>
                                            <div><span className="meta-label">New Dealer State</span><p className="meta-value">Fresh Start</p></div>
                                            <div><span className="meta-label">Data Baseline</span><p className="meta-value">0 customers, 0 employees, 0 products, 0 sales</p></div>
                                            <div><span className="meta-label">Provisioned Login</span><p className="meta-value">Application Admin</p></div>
                                            <div><span className="meta-label">Dealer Setup</span><p className="meta-value">Clean profile + admin login</p></div>
                                        </div>
                                        <div className="feature-list spaced-top">
                                            <span className="feature-pill">Branding Ready</span>
                                            <span className="feature-pill">Theme Ready</span>
                                            <span className="feature-pill">Currency Ready</span>
                                            <span className="feature-pill">Dealer Profile Ready</span>
                                        </div>
                                        <p className="meta-inline">
                                            Each new dealer created here starts as a clean dealer profile so you can later attach its own users, products, customers, and transactions.
                                        </p>
                                    </div>
                                    ) : null}
                                </div>
        
                                {canViewDealerDirectory ? (
                                <div className="table-card">
                                    <div className="section-header">
                                        <h3>Dealer Directory</h3>
                                        <span className="section-caption">{filteredDealers.length} dealer profiles</span>
                                    </div>
                                    {filteredDealers.length === 0 ? (
                                        renderEmptyState('No dealer applications have been created yet.')
                                    ) : (
                                        <table className="pro-table">
                                            <thead>
                                                  <tr>
                                                      <th>Logo</th>
                                                      <th>Dealer</th>
                                                      <th>Contact</th>
                                                      <th>Currency</th>
                                                      <th>Theme</th>
                                                      <th>Application</th>
                                                      <th>App Status</th>
                                                      <th>Created By</th>
                                                      <th>Actions</th>
                                                  </tr>
                                              </thead>
                                              <tbody>
                                                {filteredDealers.map((dealer) => (
                                                    <tr key={dealer.id}>
                                                        <td>
                                                            {dealer.dealer_logo_url ? (
                                                                <img src={buildAssetUrl(dealer.dealer_logo_url)} alt={dealer.dealer_name} className="product-thumb" />
                                                            ) : (
                                                                <span className="feature-pill muted">No logo</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {dealer.dealer_name}
                                                            <br />
                                                            {dealer.dealer_code}
                                                        </td>
                                                        <td>
                                                            {dealer.mobile_country_code} {dealer.mobile_number}
                                                            <br />
                                                            {dealer.dealer_cnic}
                                                        </td>
                                                        <td>{dealer.currency_code}</td>
                                                        <td>{dashboardThemes.find((theme) => theme.key === dealer.theme_key)?.label || 'Sandstone Pro'}</td>
                                                        <td>
                                                            {dealer.application_slug || 'Pending'}
                                                        </td>
                                                        <td>
                                                            <span className={getStatusClass(dealer.is_active ? 'ACTIVE' : 'DRAFT')}>
                                                                {dealer.provisioning_status || dealer.app_status || 'FRESH_START'}
                                                            </span>
                                                          </td>
                                                          <td>{dealer.created_by_name || 'System'}</td>
                                                          <td>
                                                              <div className="table-actions">
                                                                  <button type="button" className="view-btn" onClick={() => handleEditDealer(dealer)}>Edit</button>
                                                                  <button type="button" className="danger-btn" onClick={() => handleDeleteDealer(dealer)}>Delete</button>
                                                              </div>
                                                          </td>
                                                      </tr>
                                                  ))}
                                              </tbody>
                                        </table>
                                    )}
                                </div>
                                ) : null}
                            </>
                        );
}

export default function AdminPages({ pageKey, ctx }) {
    switch (pageKey) {
        case 'workflow':
            return <WorkflowContent ctx={ctx} />;
        case 'user-tasks':
            return <UserTasksContent ctx={ctx} />;
        case 'employees':
            return <EmployeesContent ctx={ctx} />;
        case 'access':
            return <AccessControlContent ctx={ctx} />;
        case 'dealers':
            return <DealersContent ctx={ctx} />;
        default:
            return null;
    }
}
