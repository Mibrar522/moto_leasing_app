import React from 'react';

export default function WorkflowContent({ ctx }) {
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
