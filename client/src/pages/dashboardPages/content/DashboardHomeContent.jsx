import React from 'react';

export default function DashboardHomeContent({ ctx }) {
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
