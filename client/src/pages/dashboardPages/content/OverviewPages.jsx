import React from 'react';

function DashboardHomeContent({ ctx }) {
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
                                    <h1>Executive Overview</h1>
                                    <p>
                                        {Number(user?.role_id) === 3
                                            ? 'Tracking your sales pipeline, received business, and overdue follow-ups for this month.'
                                            : 'Monitoring live leasing activity, fleet readiness, customer onboarding, and revenue.'}
                                    </p>
                                </div>
        
                                <div className="metrics-grid">
                                    {Number(user?.role_id) === 3 ? (
                                        <>
                                            <div className="metric-card"><label>Received Sales</label><div className="value success">{formatCompactCurrency(dashboardData.employeeSales.receivedValue)}</div></div>
                                            <div className="metric-card"><label>Pending Sales</label><div className="value warning">{formatCompactCurrency(dashboardData.employeeSales.pendingValue)}</div></div>
                                            <div className="metric-card"><label>Earned Commission</label><div className="value success">{formatCompactCurrency(employeeCurrentMonthCommission)}</div></div>
                                            <div className="metric-card"><label>Outstanding Advance</label><div className="value warning">{formatCompactCurrency(selectedEmployeeOutstandingAdvance)}</div></div>
                                            <div className="metric-card"><label>Overdue This Month</label><div className="value warning">{dashboardData.employeeSales.overdueFollowups}</div></div>
                                            <div className="metric-card"><label>Received Count</label><div className="value">{dashboardData.employeeSales.receivedCount}</div></div>
                                            <div className="metric-card"><label>Pending Count</label><div className="value">{dashboardData.employeeSales.pendingCount}</div></div>
                                            <div className="metric-card"><label>Visible Applications</label><div className="value">{filteredApplications.length}</div></div>
                                        </>
                                    ) : (
                                        <>
                                            {canViewDashboardCardActiveLeases ? renderMetricCard('Total Settled Leases', overviewMetrics.settledLeases, { iconKey: 'leases' }) : null}
                                            {canViewDashboardCardPendingLeases ? renderMetricCard('Total Customer Pending Lease', overviewMetrics.pendingLeases, { valueClassName: 'warning', iconKey: 'tasks' }) : null}
                                            {canViewDashboardCardPendingTasks ? renderMetricCard('Total Pending Tasks', overviewMetrics.pendingTasks, { valueClassName: 'warning', iconKey: 'tasks' }) : null}
                                            {canViewDashboardCardTotalRevenue ? renderMetricCard('Total Revenue', formatCompactCurrency(overviewMetrics.totalRevenue), { valueClassName: 'success', iconKey: 'revenue' }) : null}
                                            {canViewDashboardCardEmployeeCommissions ? renderMetricCard('Total Employee Commissions', formatCompactCurrency(totalEmployeeCommission), { valueClassName: 'success', iconKey: 'employees' }) : null}
                                            {canViewDashboardCardTotalVehicles ? renderMetricCard('Total Vehicles', dashboardData.metrics.totalVehicles, { iconKey: 'vehicles' }) : null}
                                            {canViewDashboardCardTotalCustomers ? renderMetricCard('Total Customers', dashboardData.metrics.totalCustomers, { iconKey: 'customers' }) : null}
                                            {canViewDashboardCardTotalEmployees ? renderMetricCard('Total Employees', dashboardData.metrics.totalEmployees, { iconKey: 'employees' }) : null}
                                            {canViewDashboardCardActiveEmployees ? renderMetricCard('Total Active Employees', dashboardData.metrics.activeEmployees, { iconKey: 'employees' }) : null}
                                            {canViewDashboardCardTotalDealers ? renderMetricCard(isDealerScopedDashboard ? 'Visible Dealers' : 'Total Dealers', dashboardData.metrics.totalDealers, { iconKey: 'dealers' }) : null}
                                            {canViewDashboardCardActiveDealers ? renderMetricCard(isDealerScopedDashboard ? 'Visible Active Dealers' : 'Total Active Dealers', dashboardData.metrics.activeDealers, { iconKey: 'dealers' }) : null}
                                            {canViewDashboardCardScannedDocuments ? renderMetricCard('Total Scanned Documents', dashboardData.metrics.scannedDocuments, { iconKey: 'documents' }) : null}
                                            {canViewDashboardCardEnrolledBiometrics ? renderMetricCard('Total Enrolled Biometrics', dashboardData.metrics.enrolledBiometrics, { iconKey: 'biometrics' }) : null}
                                            {canViewDashboardCardTotalApplications ? renderMetricCard('Total Customer Leasing Applications', overviewMetrics.leasingApplications, { iconKey: 'applications' }) : null}
                                            {canViewDashboardCardCashTransactions ? renderMetricCard('Total Cash Transactions', overviewMetrics.cashTransactions, { iconKey: 'revenue' }) : null}
                                            {canViewDashboardCardInstallmentTransactions ? renderMetricCard('Total Installment Transactions', overviewMetrics.installmentTransactions, { iconKey: 'tasks' }) : null}
                                            {canViewDashboardCardReceivedInstallments ? renderMetricCard('Total Received Installments', overviewMetrics.receivedInstallments, { iconKey: 'applications' }) : null}
                                        </>
                                    )}
                                </div>
        
                                <div className="dashboard-split">
                                    {canViewDashboardSalesPerformance ? (
                                    <div className="table-card sales-insight-card">
                                        <div className="section-header">
                                            <div>
                                                <h3>Sales Performance</h3>
                                                <p className="section-caption">Live comparison of actual cost, selling price, and realized profit for {salesAnalytics.monthLabel}.</p>
                                            </div>
                                            <span className="feature-pill">{salesAnalytics.totalDeals} total sales</span>
                                        </div>
        
                                        <div className="sales-summary-grid">
                                            <div className="sales-summary-stat">
                                                <span className="meta-label">Actual Value</span>
                                                <strong>{formatCompactCurrency(salesAnalytics.totals.actual)}</strong>
                                            </div>
                                            <div className="sales-summary-stat">
                                                <span className="meta-label">Selling Value</span>
                                                <strong>{formatCompactCurrency(salesAnalytics.totals.selling)}</strong>
                                            </div>
                                            <div className="sales-summary-stat">
                                                <span className="meta-label">Gross Profit</span>
                                                <strong>{formatCompactCurrency(salesAnalytics.totals.profit)}</strong>
                                            </div>
                                            <div className="sales-summary-stat">
                                                <span className="meta-label">Profit Margin</span>
                                                <strong>{roundCurrencyValue(salesAnalytics.profitMargin)}%</strong>
                                            </div>
                                        </div>
        
                                        {salesAnalytics.recentChart.length === 0 ? (
                                            renderEmptyState('No sales transactions are available yet for charting.')
                                        ) : (
                                            <div className="sales-chart">
                                                {salesAnalytics.recentChart.map((sale) => (
                                                    <div key={sale.id} className="sales-chart-item">
                                                        <div className="sales-chart-bars">
                                                            <div className="sales-chart-bar actual" style={{ height: sale.actualHeight }} title={`Actual: ${formatCurrency(sale.actualPrice)}`} />
                                                            <div className="sales-chart-bar selling" style={{ height: sale.sellHeight }} title={`Selling: ${formatCurrency(sale.sellPrice)}`} />
                                                        </div>
                                                        <div className="sales-chart-meta">
                                                            <strong>{sale.shortLabel}</strong>
                                                            <span>{formatCompactCurrency(sale.actualPrice)} actual</span>
                                                            <span>{formatCompactCurrency(sale.sellPrice)} selling</span>
                                                            <span>{formatCurrency(sale.profit)} profit{sale.count > 1 ? ` across ${sale.count} sales` : ''}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    ) : null}
        
                                    {canViewDashboardProfitTransactions ? (
                                    <div className="table-card sales-insight-card">
                                        <div className="section-header">
                                            <div>
                                                <h3>Recent Profit Transactions</h3>
                                                <p className="section-caption">Actual price, selling price, and profit shown for {salesAnalytics.monthLabel}.</p>
                                            </div>
                                        </div>
        
                                        {salesAnalytics.recentTransactions.length === 0 ? (
                                            renderEmptyState(`No sales transactions recorded in ${salesAnalytics.monthLabel} yet.`)
                                        ) : (
                                            <>
                                                <table className="pro-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Vehicle</th>
                                                            <th>Employee</th>
                                                            <th>Actual</th>
                                                            <th>Selling</th>
                                                            <th>Profit</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getVisibleRows('recent-profit-transactions', salesAnalytics.recentTransactions).map((sale) => (
                                                            <tr key={sale.id}>
                                                                <td>{sale.customer_name}<br />{[sale.brand, sale.model].filter(Boolean).join(' ')}</td>
                                                                <td>{sale.agent_name || 'System'}<br />{sale.dealer_name || 'Not set'}</td>
                                                                <td>{formatCurrency(sale.actualPrice)}</td>
                                                                <td>{formatCurrency(sale.sellPrice)}</td>
                                                                <td>{formatCurrency(sale.profit)}</td>
                                                                <td><span className={getStatusClass(sale.status)}>{sale.status}</span></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {renderTableLimitControl('recent-profit-transactions', salesAnalytics.recentTransactions.length)}
                                            </>
                                        )}
                                    </div>
                                    ) : null}
                                </div>
        
                                {canViewDashboardCompanyProfitability ? (
                                <div className="table-card sales-insight-card">
                                    <div className="section-header">
                                        <div>
                                            <h3>Company Business Profitability</h3>
                                            <p className="section-caption">Company-wise actual cost, selling value, and profit or loss for {salesAnalytics.monthLabel}.</p>
                                        </div>
                                    </div>
        
                                    {companyBusinessAnalytics.length === 0 ? (
                                        renderEmptyState(`No company profitability data available in ${salesAnalytics.monthLabel} yet.`)
                                    ) : (
                                        <>
                                            <table className="pro-table">
                                                <thead>
                                                    <tr>
                                                        <th>Company</th>
                                                        <th>Deals</th>
                                                        <th>Actual Cost</th>
                                                        <th>Selling Value</th>
                                                        <th>Profit / Loss</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getVisibleRows('company-profitability', companyBusinessAnalytics).map((row) => (
                                                        <tr key={row.companyName}>
                                                            <td>{row.companyName}</td>
                                                            <td>{row.deals}</td>
                                                            <td>{formatCurrency(row.actual)}</td>
                                                            <td>{formatCurrency(row.selling)}</td>
                                                            <td>
                                                                <span className={row.profit >= 0 ? 'pill-active' : 'pill-warning'}>
                                                                    {formatCurrency(row.profit)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {renderTableLimitControl('company-profitability', companyBusinessAnalytics.length)}
                                        </>
                                    )}
                                </div>
                                ) : null}
        
                                <div className="dashboard-split">
                                    {canViewDashboardRecentApplications ? (
                                    <div className="table-card">
                                        <h3>{Number(user?.role_id) === 3 ? 'My Applications' : 'Recent Applications'}</h3>
                                        {filteredApplications.length === 0 ? (
                                            renderEmptyState('No lease applications are available yet. Create one to see it here.')
                                        ) : (
                                            <>
                                                <table className="pro-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Client Name</th>
                                                            <th>Vehicle Model</th>
                                                            <th>Status</th>
                                                            <th>Monthly Rate</th>
                                                            <th>Total Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getVisibleRows('recent-applications', filteredApplications).map((application) => (
                                                            <tr key={application.id}>
                                                                <td>{application.customer_name || 'Unassigned Customer'}</td>
                                                                <td>{[application.brand, application.model].filter(Boolean).join(' ') || 'Vehicle Pending'}</td>
                                                                <td><span className={getStatusClass(application.status)}>{application.status || 'Unknown'}</span></td>
                                                                <td>{formatCurrency(application.monthly_installment)}</td>
                                                                <td>{formatCurrency(application.total_amount)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {renderTableLimitControl('recent-applications', filteredApplications.length)}
                                            </>
                                        )}
                                    </div>
                                    ) : null}
        
                                    {canViewDashboardRecentEmployees ? (
                                    <div className="table-card">
                                        <h3>Recent Employees</h3>
                                        {dashboardData.employees.length === 0 ? (
                                            renderEmptyState('No employees have been created yet.')
                                        ) : (
                                            <>
                                                <table className="pro-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Code</th>
                                                            <th>Role</th>
                                                            <th>Features</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getVisibleRows('recent-employees', dashboardData.employees).map((employee) => {
                                                            return (
                                                                <tr key={employee.id}>
                                                                    <td>{employee.full_name}<br />{employee.job_title || employee.department || 'No designation'}<br />{employee.dealer_name || 'Not set'}</td>
                                                                    <td>{employee.employee_code}</td>
                                                                    <td>{employee.role_name || 'No role'}</td>
                                                    <td>{getEmployeeEffectiveFeatureCount(employee)}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                                {renderTableLimitControl('recent-employees', dashboardData.employees.length)}
                                            </>
                                        )}
                                    </div>
                                    ) : null}
                                </div>
                            </>
                        );
}

function ApplicationsContent({ ctx }) {
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

    if (!canViewApplications) {
                            return <div className="feedback-card error">Your account does not have application access.</div>;
                        }
    return (
                            <>
                                <div className="page-heading">
                                    <h1>Applications</h1>
                                    <p>Live lease applications stored in PostgreSQL</p>
                                </div>
                                <div className="applications-ads-panel">
                                    <div className="section-header">
                                        <div>
                                            <h3>Mobile Ad Studio</h3>
                                            <span className="section-caption">
                                                Create vehicle promotions here and they will flow directly into the mobile app slider with image, title, description, and CTA text.
                                            </span>
                                        </div>
                                    </div>
                                    {adMessage ? <div className="ads-banner">{adMessage}</div> : null}
                                    {!canManageAds ? (
                                        <div className="feedback-card error">
                                            Your account cannot manage mobile ads. Enable feature <strong>FEAT_ADS_MGMT</strong> for this role (Access Control).
                                        </div>
                                    ) : (
                                        <section className="ads-studio">
                                            <form className="ads-form" onSubmit={handleAdSubmit}>
                                                <div className="ads-form-heading">
                                                    <div>
                                                        <h3>{adForm.id ? 'Edit Campaign' : 'Create Campaign'}</h3>
                                                        <p>Use the same vehicle name and description the mobile team should see in the slider.</p>
                                                    </div>
                                                    <span className={`ads-status ${adForm.is_active ? 'is-active' : 'is-draft'}`}>
                                                        {adForm.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                                <div className="ads-grid">
                                                    <label>
                                                        Vehicle / Ad Name
                                                        <input
                                                            name="title"
                                                            value={adForm.title}
                                                            onChange={handleAdChange}
                                                            placeholder="Honda CD-70 Red 2026"
                                                        />
                                                    </label>
                                                    <label>
                                                        CTA Button Label
                                                        <input
                                                            name="cta_label"
                                                            value={adForm.cta_label}
                                                            onChange={handleAdChange}
                                                            placeholder="View Offer"
                                                        />
                                                    </label>
                                                    <label className="ads-span-2">
                                                        Description
                                                        <textarea
                                                            name="subtitle"
                                                            value={adForm.subtitle}
                                                            onChange={handleAdChange}
                                                            placeholder="Fresh stock, approved installment plan, and quick dealer delivery."
                                                            rows={4}
                                                        />
                                                    </label>
                                                    <label className="ads-span-2">
                                                        CTA URL
                                                        <input
                                                            name="cta_url"
                                                            value={adForm.cta_url}
                                                            onChange={handleAdChange}
                                                            placeholder="https://..."
                                                        />
                                                    </label>
                                                    <label>
                                                        Slide Order
                                                        <input
                                                            name="display_order"
                                                            type="number"
                                                            value={adForm.display_order}
                                                            onChange={handleAdChange}
                                                        />
                                                    </label>
                                                    <label>
                                                        Dealer ID (optional)
                                                        <input
                                                            name="dealer_id"
                                                            value={adForm.dealer_id}
                                                            onChange={handleAdChange}
                                                            placeholder="Leave empty (global), or paste dealer UUID / dealer code / application slug"
                                                        />
                                                    </label>
                                                    <label>
                                                        Start Date
                                                        <input name="start_at" type="date" value={adForm.start_at} onChange={handleAdChange} />
                                                    </label>
                                                    <label>
                                                        End Date
                                                        <input name="end_at" type="date" value={adForm.end_at} onChange={handleAdChange} />
                                                    </label>
                                                </div>
                                                <div className="ads-upload">
                                                    <label className="ads-upload-label">
                                                        Campaign Image
                                                        <input type="file" accept="image/*" onChange={handleAdUpload} />
                                                    </label>
                                                    <label className="ads-inline">
                                                        <input
                                                            name="is_active"
                                                            type="checkbox"
                                                            checked={adForm.is_active}
                                                            onChange={handleAdChange}
                                                        />
                                                        Push to mobile
                                                    </label>
                                                </div>
                                                <div className="ads-actions">
                                                    <button type="button" onClick={resetAdForm} disabled={savingAd}>Reset</button>
                                                    <button type="submit" disabled={savingAd}>
                                                        {savingAd ? 'Saving...' : adForm.id ? 'Update Campaign' : 'Publish Campaign'}
                                                    </button>
                                                </div>
                                            </form>
        
                                            <aside className="ads-phone-preview">
                                                <div className="ads-phone-shell">
                                                    <div className="ads-phone-notch" />
                                                    <div className="ads-phone-screen">
                                                        <span className="ads-preview-kicker">Mobile Preview</span>
                                                        <div className="ads-mobile-slide">
                                                            <div className="ads-mobile-copy">
                                                                <span className="ads-chip">Featured Vehicle</span>
                                                                <h4>{adForm.title || 'Vehicle name will appear here'}</h4>
                                                                <p>{adForm.subtitle || 'Short campaign description will appear here for the mobile slider.'}</p>
                                                                <button type="button">{adForm.cta_label || 'View Offer'}</button>
                                                            </div>
                                                            <div className="ads-mobile-visual">
                                                                {adPreviewUrl ? (
                                                                    <img className="ads-preview" src={adPreviewUrl} alt="Campaign preview" />
                                                                ) : (
                                                                    <div className="ads-preview-placeholder">Upload image</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </aside>
                                        </section>
                                    )}
                                    <div className="ads-list">
                                        <h3>Campaign Library</h3>
                                        {applicationAds.length === 0 ? (
                                            <p className="ads-empty">No ads created yet. The next campaign you publish here will appear in mobile.</p>
                                        ) : null}
                                        <div className="ads-cards">
                                            {(dashboardData.ads || []).map((ad) => {
                                                const imageUrl = buildAssetUrl(ad.image_url);
                                                const targetUrl = ad.cta_url || imageUrl;
        
                                                return (
                                                    <div key={ad.id} className="ads-card">
                                                        <div className="ads-card-copy">
                                                            {imageUrl ? (
                                                                <img className="ads-card-thumb" src={imageUrl} alt={ad.title || 'Campaign'} />
                                                            ) : null}
                                                            <div>
                                                                <strong>{ad.title || 'Untitled ad'}</strong>
                                                                <p>{ad.subtitle || 'No description'}</p>
                                                                <span className="ads-card-meta">
                                                                    Order {ad.display_order ?? 0} - {ad.is_active ? 'Live on mobile' : 'Inactive'}
                                                                </span>
                                                                {targetUrl ? (
                                                                    <div>
                                                                        <a className="application-ad-cta" href={targetUrl} target="_blank" rel="noreferrer">
                                                                            {ad.cta_label || 'Open offer'}
                                                                        </a>
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        {canManageAds ? (
                                                            <div className="ads-card-actions">
                                                                <button type="button" onClick={() => handleAdEdit(ad)} disabled={savingAd}>Edit</button>
                                                                <button type="button" onClick={() => handleAdDelete(ad.id)} disabled={savingAd}>Delete</button>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                {canViewApplicationsList ? (
                                    <div className="table-card">
                                        <h3>Applications List</h3>
                                        {filteredApplications.length === 0 ? (
                                            renderEmptyState('No lease applications match the current search.')
                                        ) : (
                                            <>
                                                <table className="pro-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Customer</th>
                                                            <th>Vehicle</th>
                                                            <th>Status</th>
                                                            <th>Installment</th>
                                                            <th>Agent</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getVisibleRows('applications', filteredApplications).map((application) => (
                                                            <tr key={application.id}>
                                                                <td>{application.customer_name || 'Unassigned Customer'}</td>
                                                                <td>{[application.brand, application.model].filter(Boolean).join(' ') || 'Vehicle Pending'}</td>
                                                                <td>
                                                                    <span className={getStatusClass(application.status)}>
                                                                        {application.status || 'Unknown'}
                                                                    </span>
                                                                </td>
                                                                <td>{formatCurrency(application.monthly_installment)}</td>
                                                                <td>{application.agent_name || 'System'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {renderTableLimitControl('applications', filteredApplications.length)}
                                            </>
                                        )}
                                    </div>
                                ) : <div className="feedback-card">No enabled application functions for this role.</div>}
                            </>
                        );
}

export default function OverviewPages({ pageKey, ctx }) {
    switch (pageKey) {
        case 'dashboard':
            return <DashboardHomeContent ctx={ctx} />;
        case 'applications':
            return <ApplicationsContent ctx={ctx} />;
        default:
            return null;
    }
}
