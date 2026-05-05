import React from 'react';

export default function TransactionsContent({ ctx }) {
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

    if (!canManageSales) {
                            return <div className="feedback-card error">Your account does not have sales transaction access.</div>;
                        }
    return (
                            <>
                                <div className="page-heading">
                                    <h1>Adhoc Transactions</h1>
                                    <p>See cash and installment transactions together, print them, and jump into pending installment collections.</p>
                                </div>
        
                                {canViewTransactionRegister ? (
                                <div className="table-card">
                                    <h3>Transaction Register</h3>
                                    {transactionSales.length === 0 ? (
                                        renderEmptyState('No cash or installment transactions are available yet.')
                                    ) : (
                                        <div className="table-scroll">
                                        <table className="pro-table transaction-register-table">
                                            <thead>
                                                <tr>
                                                    <th>Customer</th>
                                                    <th>Vehicle</th>
                                                    <th>Dealer / Agent</th>
                                                    <th>Mode</th>
                                                    <th>Agreement</th>
                                                    <th>Snapshot</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactionSales.map((sale) => {
                                                    const summary = summarizeSaleInstallments(sale);
                                                    const hasPendingInstallments = String(sale.sale_mode || '').toUpperCase() === 'INSTALLMENT' && summary.pendingCount > 0;
                                                    const isViewing = transactionActionState.saleId === sale.id && transactionActionState.action === 'view';
                                                    const isPrinting = transactionActionState.saleId === sale.id && transactionActionState.action === 'print';
                                                    const isRoutingInstallment = transactionActionState.saleId === sale.id && transactionActionState.action === 'installments';
        
                                                    return (
                                                        <tr key={sale.id}>
                                                            <td>{sale.customer_name}<br />{sale.cnic_passport_number}</td>
                                                            <td>{sale.brand} {sale.model}<br />{sale.registration_number || 'No registration'}</td>
                                                            <td>{formatSaleDealerIdentity(sale)}<br />{formatSaleAgentIdentity(sale)}</td>
                                                            <td>{sale.sale_mode}<br />{formatCurrency(sale.vehicle_price)}</td>
                                                            <td>{sale.agreement_number || 'No number'}<br />{sale.purchase_date || 'No date'}</td>
                                                            <td>
                                                                {String(sale.sale_mode || '').toUpperCase() === 'INSTALLMENT'
                                                                    ? `${summary.actualReceivedCount}/${summary.totalPlannedMonths} / ${summary.pendingCount} pending`
                                                                    : 'Cash collected'}
                                                            </td>
                                                            <td><span className={getStatusClass(sale.status)}>{sale.status}</span></td>
                                                            <td>
                                                                <button type="button" className="view-btn" onClick={() => handleViewTransaction(sale)} disabled={isViewing || isPrinting || isRoutingInstallment}>
                                                                    {isViewing ? <span className="btn-spinner" aria-hidden="true" /> : null}
                                                                    {isViewing ? 'Loading...' : 'View'}
                                                                </button>{' '}
                                                                <button type="button" className="view-btn" onClick={() => handlePrintTransaction(sale)} disabled={isViewing || isPrinting || isRoutingInstallment}>
                                                                    {isPrinting ? <span className="btn-spinner" aria-hidden="true" /> : null}
                                                                    {isPrinting ? 'Printing...' : 'Print'}
                                                                </button>{' '}
                                                                {hasPendingInstallments ? (
                                                                    <button
                                                                        type="button"
                                                                        className="view-btn"
                                                                        onClick={() => {
                                                                            setTransactionActionState({ saleId: sale.id, action: 'installments' });
                                                                            window.requestAnimationFrame(() => {
                                                                                handleOpenInstallmentPage(sale.id);
                                                                                setTransactionActionState({ saleId: '', action: '' });
                                                                            });
                                                                        }}
                                                                        disabled={isViewing || isPrinting || isRoutingInstallment}
                                                                    >
                                                                        {isRoutingInstallment ? <span className="btn-spinner" aria-hidden="true" /> : null}
                                                                        {isRoutingInstallment ? 'Opening...' : 'Installments'}
                                                                    </button>
                                                                ) : null}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        </div>
                                    )}
                                </div>
                                ) : <div className="feedback-card">No enabled transaction functions for this role.</div>}
        
                            </>
                        );
}
