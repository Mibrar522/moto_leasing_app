import React from 'react';

export default function ProductsContent({ ctx }) {
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

    if (!canManageProducts) {
                            return <div className="feedback-card error">Your account does not have product management access.</div>;
                        }
    return (
                            <>
                                <div className="page-heading">
                                    <h1>Products</h1>
                                    <p>Create product master records that stock receiving can use later. Each received vehicle is stored as its own unique stock record.</p>
                                </div>
                                <div className="customers-grid">
                                    {canViewProductForm ? (
                                    <form className="table-card customer-form-card" onSubmit={handleProductSubmit}>
                                        <div className="section-header">
                                            <h3>{productForm.id ? 'Update Product Master' : 'New Product Master'}</h3>
                                            <div className="inline-actions">
                                                <button type="button" className="view-btn" onClick={resetProductForm}>Clear</button>
                                                <button type="submit" className="primary-btn" disabled={savingProduct}>
                                                    {savingProduct ? 'Saving...' : productForm.id ? 'Update Product' : 'Create Product'}
                                                </button>
                                            </div>
                                        </div>
                                        {productMessage ? <div className="notice-banner">{productMessage}</div> : null}
                                        <div className="form-grid">
                                            <label className="field"><span>Brand</span><input name="brand" value={productForm.brand} onChange={handleProductChange} /></label>
                                            <label className="field"><span>Model</span><input name="model" value={productForm.model} onChange={handleProductChange} /></label>
                                            <label className="field"><span>Vehicle Type</span><select name="vehicle_type" value={productForm.vehicle_type} onChange={handleProductChange}><option value="">Select vehicle type</option>{dashboardData.vehicleTypes.map((vehicleType) => (<option key={vehicleType.id} value={vehicleType.type_key}>{vehicleType.display_name}</option>))}</select></label>
                                            <label className="field"><span>Color</span><input name="color" value={productForm.color} onChange={handleProductChange} /></label>
                                            <label className="field full-span"><span>Product Description</span><textarea name="description" value={productForm.description || ''} onChange={handleProductChange} rows="3" placeholder="Short product details, features, or notes" /></label>
                                            <label className="field full-span"><span>Product Image</span><input type="file" accept="image/*" onChange={handleProductImageUpload} /></label>
                                            <label className="field full-span"><span>Uploaded Image URL</span><input name="image_url" value={productForm.image_url} onChange={handleProductChange} readOnly /></label>
                                            <label className="field"><span>Monthly Rate</span><input name="monthly_rate" value={productForm.monthly_rate} onChange={handleProductChange} type="number" min="0" step="0.01" /></label>
                                            <label className="field"><span>Actual Price</span><input name="purchase_price" value={productForm.purchase_price} onChange={handleProductChange} type="number" min="0" step="0.01" /></label>
                                            <div className="field full-span">
                                                <span>Installment</span>
                                                <div className="field-note">Commission percent added on actual price.</div>
                                            </div>
                                            <label className="field"><span>Commission %</span><input name="installment_markup_percent" value={productForm.installment_markup_percent} onChange={handleProductChange} type="number" min="0" step="0.01" /></label>
                                            <label className="field"><span>Months</span><input name="installment_months" value={productForm.installment_months} onChange={handleProductChange} type="number" min="1" step="1" /></label>
                                            <div className="field full-span">
                                                <span>Cash</span>
                                                <div className="field-note">Margin can be % or fixed value. If value is set, it overrides %.</div>
                                            </div>
                                            <label className="field"><span>Margin %</span><input name="cash_markup_percent" value={productForm.cash_markup_percent} onChange={handleProductChange} type="number" min="0" step="0.01" /></label>
                                            <label className="field"><span>Margin Value</span><input name="cash_markup_value" value={productForm.cash_markup_value} onChange={handleProductChange} type="number" min="0" step="0.01" /></label>
                                            <div className="field full-span">
                                                <span>Computed Totals</span>
                                                <div className="field-note">
                                                    Cash total: {formatCurrency(Number(productForm.purchase_price || 0) + (Number(productForm.cash_markup_value || 0) > 0 ? Number(productForm.cash_markup_value || 0) : (Number(productForm.purchase_price || 0) * (Number(productForm.cash_markup_percent || 0) / 100))))} | Installment total: {formatCurrency(Number(productForm.purchase_price || 0) * (1 + Number(productForm.installment_markup_percent || 0) / 100))}
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    ) : null}
        
                                    {canViewProductTypeMaster ? (
                                    <div className="table-card">
                                        <div className="section-header">
                                            <h3>Vehicle Type Master</h3>
                                        </div>
                                        {vehicleTypeMessage ? <div className="notice-banner">{vehicleTypeMessage}</div> : null}
                                        <form className="form-grid" onSubmit={handleVehicleTypeSubmit}>
                                            <label className="field">
                                                <span>New Vehicle Type</span>
                                                <input value={newVehicleType} onChange={(event) => setNewVehicleType(event.target.value)} placeholder="Example: Pickup / Loader / Tractor" />
                                            </label>
                                            <div className="field">
                                                <span>&nbsp;</span>
                                                <button type="submit" className="primary-btn" disabled={savingVehicleType}>
                                                    {savingVehicleType ? 'Saving...' : 'Add Type'}
                                                </button>
                                            </div>
                                        </form>
                                        <div className="feature-list spaced-top">
                                            {dashboardData.vehicleTypes.map((vehicleType) => (
                                                <span key={`type-${vehicleType.id}`} className="feature-pill">{vehicleType.display_name}</span>
                                            ))}
                                        </div>
                                    </div>
                                    ) : null}
                                </div>
        
                                {canViewProductRegister ? (
                                <div className="table-card">
                                    <h3>Product Master Register</h3>
                                    {filteredInventory.length === 0 ? (
                                        renderEmptyState('No product masters match the current search.')
                                    ) : (
                                        <table className="pro-table">
                                            <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Product Vehicle</th>
                                                <th>Type</th>
                                                <th>Color</th>
                                                <th>Description</th>
                                                <th>Pricing</th>
                                                <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredInventory.map((vehicle) => (
                                                    <tr key={vehicle.id}>
                                                        <td>{vehicle.image_url ? <img src={buildAssetUrl(vehicle.image_url)} alt={`${vehicle.brand} ${vehicle.model}`} className="product-thumb" /> : <span className="feature-pill muted">No image</span>}</td>
                                                        <td>{[vehicle.brand, vehicle.model].filter(Boolean).join(' ')}</td>
                                                        <td>{vehicle.vehicle_type || 'Not set'}</td>
                                                        <td>{vehicle.color || 'Not set'}</td>
                                                        <td>{vehicle.description || 'No description'}</td>
                                                        <td>
                                                            Actual: {formatCurrency(vehicle.purchase_price)}<br />
                                                            Cash: {formatCurrency(Number(vehicle.purchase_price || 0) + (Number(vehicle.cash_markup_value || 0) > 0 ? Number(vehicle.cash_markup_value || 0) : (Number(vehicle.purchase_price || 0) * (Number(vehicle.cash_markup_percent || 0) / 100))))}<br />
                                                            Installment: {formatCurrency(Number(vehicle.purchase_price || 0) * (1 + Number(vehicle.installment_markup_percent || 0) / 100))} ({Number(vehicle.installment_months || 0) || 12} mo)
                                                        </td>
                                                        <td><button type="button" className="view-btn" onClick={() => handleEditProduct(vehicle)}>Edit</button></td>
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
