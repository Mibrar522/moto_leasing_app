import React from 'react';

export default function SalesContent({ ctx }) {
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

    if (!canCreateSales) {
                            return <div className="feedback-card error">Your account does not have sales access.</div>;
                        }
    return (
                            <>
                                <div className="page-heading">
                                    <h1>Sales Transactions</h1>
                                    <p>Create complete vehicle sales agreements with witness details, cash or installment mode, and PDF upload.</p>
                                </div>
        
                                <div className="customers-grid">
                                    {canViewSalesAgreementForm ? (
                                    <form className="table-card customer-form-card" onSubmit={handleSaleSubmit}>
                                        <div className="section-header">
                                            <h3>{saleForm.id ? (saleFormReadOnly ? 'View Vehicle Sale' : 'Edit Vehicle Sale') : 'Vehicle Agreement Creation'}</h3>
                                            <div className="inline-actions">
                                                {saleForm.id ? (
                                                    <button type="button" className="view-btn" onClick={resetSaleForm}>
                                                        {saleFormReadOnly ? 'Close View' : 'Cancel Edit'}
                                                    </button>
                                                ) : null}
                                                {!saleFormReadOnly ? (
                                                    <button type="submit" className="primary-btn" disabled={savingSale}>
                                                        {savingSale ? 'Saving...' : saleForm.id ? 'Update Sale' : 'Create Sale'}
                                                    </button>
                                                ) : null}
                                            </div>
                                        </div>
                                        {saleMessage ? <div className="notice-banner">{saleMessage}</div> : null}
                                        <fieldset disabled={saleFormReadOnly || savingSale} className="form-reset">
                                        <div className="form-grid">
                                            <label className="field">
                                                <span>Customer</span>
                                                <select name="customer_id" value={saleForm.customer_id} onChange={handleSaleChange}>
                                                    <option value="">Select customer</option>
                                                    {dashboardData.customers.map((customer) => (
                                                        <option key={customer.id} value={customer.id}>{customer.full_name}</option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label className="field">
                                                <span>Available Stock</span>
                                                <span className="field-hint">
                                                    {selectedSaleVehicle
                                                        ? isSelectedSaleVehicleAvailable
                                                            ? 'This vehicle is currently available in stock.'
                                                            : 'This selected vehicle is already assigned and is not part of available stock.'
                                                        : `${availableSalesVehicles.length} vehicle${availableSalesVehicles.length === 1 ? '' : 's'} available in stock`}
                                                </span>
                                                <div className="custom-select-wrap" onClick={(event) => event.stopPropagation()}>
                                                    <button
                                                        type="button"
                                                        className={`custom-select-trigger ${salesVehicleDropdownOpen ? 'open' : ''}`}
                                                        onClick={() => setSalesVehicleDropdownOpen((current) => !current)}
                                                        aria-haspopup="listbox"
                                                        aria-expanded={salesVehicleDropdownOpen}
                                                    >
                                                        <span className="custom-select-trigger-copy">
                                                            <strong>{selectedSaleVehicleName}</strong>
                                                            <small>{selectedSaleVehicleSecondaryLine}</small>
                                                        </span>
                                                        <span className="custom-select-trigger-icon" aria-hidden="true">v</span>
                                                    </button>
                                                    {salesVehicleDropdownOpen ? (
                                                        <div className="custom-select-menu" role="listbox" aria-label="Available stock">
                                                            <button
                                                                type="button"
                                                                className={`custom-select-option ${!saleForm.vehicle_id ? 'selected' : ''}`}
                                                                onClick={() => {
                                                                    setSaleForm((current) => ({ ...current, vehicle_id: '' }));
                                                                    setSalesVehicleDropdownOpen(false);
                                                                }}
                                                            >
                                                                <span className="custom-select-option-title">Select vehicle</span>
                                                                <span className="custom-select-option-subtitle">Choose one available stock unit</span>
                                                            </button>
                                                            {salesVehicleOptions.map((vehicle) => {
                                                                const vehicleName = [vehicle.brand, vehicle.model].filter(Boolean).join(' ') || 'Unnamed vehicle';
                                                                const vehicleMeta = [
                                                                    vehicle.registration_number ? `Reg: ${vehicle.registration_number}` : '',
                                                                    String(vehicle.status || '').toUpperCase() === 'AVAILABLE' ? 'Available stock' : 'Already assigned',
                                                                ].filter(Boolean).join(' | ');
        
                                                                return (
                                                                    <button
                                                                        key={vehicle.id}
                                                                        type="button"
                                                                        className={`custom-select-option ${saleForm.vehicle_id === vehicle.id ? 'selected' : ''}`}
                                                                        onClick={() => {
                                                                            setSaleForm((current) => ({ ...current, vehicle_id: vehicle.id }));
                                                                            setSalesVehicleDropdownOpen(false);
                                                                        }}
                                                                    >
                                                                        <span className="custom-select-option-title">{vehicleName}</span>
                                                                        <span className="custom-select-option-subtitle">{vehicle.serial_number || 'Serial number not available'}</span>
                                                                        <span className="custom-select-option-meta">{vehicleMeta}</span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </label>
                                            <label className="field"><span>Sale Mode</span><select name="sale_mode" value={saleForm.sale_mode} onChange={handleSaleChange}><option value="CASH">Cash</option><option value="INSTALLMENT">Installment</option></select></label>
                                            <label className="field"><span>Agreement Number</span><input name="agreement_number" value={saleForm.agreement_number || ''} onChange={handleSaleChange} /></label>
                                            <label className="field"><span>Agreement Date</span><input type="date" name="agreement_date" value={saleForm.agreement_date || ''} onChange={handleSaleChange} /></label>
                                            <label className="field"><span>Purchase Date</span><input type="date" name="purchase_date" value={saleForm.purchase_date || ''} onChange={handleSaleChange} /></label>
                                            <label className="field"><span>Actual Price</span><input type="number" min="0" step="0.01" value={actualVehiclePrice ?? 0} readOnly /></label>
                                            {saleForm.sale_mode === 'CASH' ? (
                                                <>
                                                    <label className="field"><span>Purchase Price</span><input type="number" min="0" step="0.01" value={actualVehiclePrice ?? 0} readOnly /></label>
                                                    <label className="field"><span>Selling Price</span><input type="number" min="0" step="0.01" name="vehicle_price" value={saleForm.vehicle_price || ''} onChange={handleSaleChange} /></label>
                                                </>
                                            ) : (
                                                <>
                                                    <label className="field">
                                                        <span>Total Price</span>
                                                        <input type="number" min="0" step="0.01" name="vehicle_price" value={saleForm.vehicle_price || ''} onChange={handleSaleChange} />
                                                    </label>
                                                    <label className="field">
                                                        <span>Markup Percentage</span>
                                                        <input type="text" value={`${installmentMarkupPreview}%`} readOnly />
                                                    </label>
                                                    <label className="field"><span>Down Payment</span><input type="number" min="0" step="0.01" name="down_payment" value={saleForm.down_payment || ''} onChange={handleSaleChange} /></label>
                                                    <label className="field"><span>Monthly Installment</span><input type="number" min="0" step="0.01" name="monthly_installment" value={saleForm.monthly_installment || ''} readOnly /></label>
                                                </>
                                            )}
                                            <label className="field"><span>Witness Name</span><input name="witness_name" value={saleForm.witness_name || ''} onChange={handleSaleChange} /></label>
                                            <label className="field"><span>Witness CNIC</span><input name="witness_cnic" value={saleForm.witness_cnic || ''} onChange={handleSaleChange} /></label>
                                            <label className="field"><span>Witness 2 Name</span><input name="witness_two_name" value={saleForm.witness_two_name || ''} onChange={handleSaleChange} /></label>
                                            <label className="field"><span>Witness 2 CNIC</span><input name="witness_two_cnic" value={saleForm.witness_two_cnic || ''} onChange={handleSaleChange} /></label>
                                            <label className="field full-span"><span>Agreement PDF</span><input type="file" accept="application/pdf" onChange={handleAgreementUpload} /></label>
                                            <label className="field full-span"><span>Uploaded Agreement URL</span><input name="agreement_pdf_url" value={saleForm.agreement_pdf_url || ''} onChange={handleSaleChange} readOnly={uploadingAgreement} /></label>
                                            <label className="field full-span"><span>Dealer Signature Upload</span><input type="file" accept="image/*" onChange={handleSaleDealerSignatureUpload} disabled={saleFormReadOnly || savingSale} /></label>
                                            <label className="field full-span"><span>Dealer Signature URL</span><input name="dealer_signature_url" value={saleForm.dealer_signature_url || currentSalesDealerSignatureUrl || ''} onChange={handleSaleChange} readOnly /></label>
                                            <label className="field full-span"><span>Authorized Signature Upload</span><input type="file" accept="image/*,.pdf" onChange={(event) => handleSaleDocumentUpload(event, 'authorized_signature_url', 'Authorized signature', setUploadingSaleAuthorizedSignature)} disabled={saleFormReadOnly || savingSale} /></label>
                                            <label className="field full-span"><span>Authorized Signature URL</span><input name="authorized_signature_url" value={saleForm.authorized_signature_url || ''} onChange={handleSaleChange} readOnly={uploadingSaleAuthorizedSignature} /></label>
                                            <label className="field full-span"><span>Customer CNIC Front URL</span><input name="customer_cnic_front_url" value={saleCustomerCnicFrontUrl || ''} readOnly /></label>
                                            <label className="field full-span"><span>Customer CNIC Back URL</span><input name="customer_cnic_back_url" value={saleCustomerCnicBackUrl || ''} readOnly /></label>
                                            <label className="field full-span"><span>Bank Check Upload</span><input type="file" accept="*/*" onChange={(event) => handleSaleDocumentUpload(event, 'bank_check_url', 'Bank check', setUploadingSaleBankCheck)} /></label>
                                            <label className="field full-span"><span>Uploaded Bank Check URL</span><input name="bank_check_url" value={saleForm.bank_check_url || ''} onChange={handleSaleChange} readOnly={uploadingSaleBankCheck} /></label>
                                            <label className="field full-span"><span>Misc Document Upload</span><input type="file" accept="*/*" onChange={(event) => handleSaleDocumentUpload(event, 'misc_document_url', 'Misc document', setUploadingSaleMiscDocument)} /></label>
                                            <label className="field full-span"><span>Uploaded Misc Document URL</span><input name="misc_document_url" value={saleForm.misc_document_url || ''} onChange={handleSaleChange} readOnly={uploadingSaleMiscDocument} /></label>
                                            <label className="field full-span"><span>Remarks</span><textarea rows="4" name="remarks" value={saleForm.remarks || ''} onChange={handleSaleChange} /></label>
                                        </div>
        
                                        {saleForm.sale_mode === 'INSTALLMENT' && canViewSalesInstallmentPreview ? (
                                            <div className="scanner-box">
                                                <div className="section-header">
                                                    <h3>Installment Page</h3>
                                                    <span className="section-caption">Customer, vehicle, and purchase data stay visible while you build the installment plan.</span>
                                                </div>
                                                <div className="form-grid">
                                                    <label className="field"><span>Financed Amount</span><input type="number" min="0" step="0.01" name="financed_amount" value={saleForm.financed_amount || ''} readOnly /></label>
                                                    <label className="field"><span>Installment Months</span><input type="number" min="1" name="installment_months" value={saleForm.installment_months || ''} onChange={handleSaleChange} /></label>
                                                    <label className="field"><span>First Due Date</span><input type="date" name="first_due_date" value={saleForm.first_due_date || ''} onChange={handleSaleChange} /></label>
                                                </div>
                                            </div>
                                        ) : null}
                                        </fieldset>
                                    </form>
                                    ) : null}
        
                                    {canViewSalesAgreementSummary ? (
                                    <div className="table-card">
                                        <h3>Agreement Summary</h3>
                                        <div className="detail-grid">
                                            <div><span className="meta-label">Customer</span><p className="meta-value">{selectedSaleCustomer?.full_name || 'Select customer'}</p></div>
                                            <div><span className="meta-label">Customer CNIC</span><p className="meta-value">{selectedSaleCustomer?.cnic_passport_number || 'Select customer'}</p></div>
                                            <div><span className="meta-label">Dealer</span><p className="meta-value">{editingSaleRecord?.dealer_name || user?.dealer_name || 'Not set'}{editingSaleRecord?.dealer_code ? ` / ${editingSaleRecord.dealer_code}` : ''}</p></div>
                                            <div><span className="meta-label">Vehicle</span><p className="meta-value">{selectedSaleVehicle ? `${selectedSaleVehicle.brand} ${selectedSaleVehicle.model}` : 'Select vehicle'}</p></div>
                                            <div><span className="meta-label">Vehicle Type</span><p className="meta-value">{selectedSaleVehicle?.vehicle_type || 'Select vehicle'}</p></div>
                                            <div><span className="meta-label">Color</span><p className="meta-value">{selectedSaleVehicle?.color || 'Not set'}</p></div>
                                            <div><span className="meta-label">Stock Status</span><p className="meta-value">{selectedSaleVehicle ? (isSelectedSaleVehicleAvailable ? 'Available' : 'Assigned') : 'Select vehicle'}</p></div>
                                            <div><span className="meta-label">Description</span><p className="meta-value">{selectedSaleVehicle?.product_description || 'No description'}</p></div>
                                            <div><span className="meta-label">Chassis Number</span><p className="meta-value">{selectedSaleVehicle?.chassis_number || 'Select vehicle'}</p></div>
                                            <div><span className="meta-label">Engine Number</span><p className="meta-value">{selectedSaleVehicle?.engine_number || 'Select vehicle'}</p></div>
                                            <div><span className="meta-label">Actual Price</span><p className="meta-value">{formatCurrency(actualVehiclePrice)}</p></div>
                                            <div><span className="meta-label">{saleForm.sale_mode === 'CASH' ? 'Selling Price' : 'Total Price'}</span><p className="meta-value">{formatCurrency(saleForm.vehicle_price)}</p></div>
                                            {saleForm.sale_mode === 'INSTALLMENT' ? (
                                                <>
                                                    <div><span className="meta-label">Down Payment</span><p className="meta-value">{formatCurrency(saleForm.down_payment)}</p></div>
                                                    <div><span className="meta-label">Monthly Installment</span><p className="meta-value">{formatCurrency(saleForm.monthly_installment)}</p></div>
                                                </>
                                            ) : null}
                                            <div><span className="meta-label">Witness 1</span><p className="meta-value">{saleForm.witness_name || 'Not set'}{saleForm.witness_cnic ? ` / ${saleForm.witness_cnic}` : ''}</p></div>
                                            <div><span className="meta-label">Witness 2</span><p className="meta-value">{saleForm.witness_two_name || 'Not set'}{saleForm.witness_two_cnic ? ` / ${saleForm.witness_two_cnic}` : ''}</p></div>
                                        </div>
                                        <div className="detail-grid sale-document-grid">
                                            <div>
                                                <span className="meta-label">Dealer Signature</span>
                                                <div className="employee-document-preview">
                                                    {renderAssetPreview(saleDealerSignatureUrl, 'Dealer signature not available.', 'Dealer Signature')}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="meta-label">Customer CNIC Front</span>
                                                <div className="employee-document-preview">
                                                    {renderAssetPreview(saleCustomerCnicFrontUrl, 'Customer CNIC front not available.', 'Customer CNIC Front')}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="meta-label">Customer CNIC Back</span>
                                                <div className="employee-document-preview">
                                                    {renderAssetPreview(saleCustomerCnicBackUrl, 'Customer CNIC back not available.', 'Customer CNIC Back')}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="meta-label">Customer Signature</span>
                                                <div className="employee-document-preview">
                                                    {renderAssetPreview(selectedSaleCustomerSignatureUrl, 'Customer signature not available.', 'Customer Signature')}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="meta-label">Authorized Signature</span>
                                                <div className="employee-document-preview">
                                                    {renderAssetPreview(saleAuthorizedSignatureUrl, 'Authorized signature not available.', 'Authorized Signature')}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="meta-label">Agreement PDF</span>
                                                {saleForm.agreement_pdf_url ? (
                                                    <a className="view-btn" href={buildAssetUrl(saleForm.agreement_pdf_url)} target="_blank" rel="noreferrer">
                                                        {getDocumentDisplayName(saleForm.agreement_pdf_url, 'agreement.pdf')}
                                                    </a>
                                                ) : (
                                                    <div className="employee-document-empty">Agreement not uploaded.</div>
                                                )}
                                            </div>
                                            <div>
                                                <span className="meta-label">Bank Check</span>
                                                {saleForm.bank_check_url ? (
                                                    <a className="view-btn" href={buildAssetUrl(saleForm.bank_check_url)} target="_blank" rel="noreferrer">
                                                        {getDocumentDisplayName(saleForm.bank_check_url, 'bank-check.pdf')}
                                                    </a>
                                                ) : (
                                                    <div className="employee-document-empty">Bank check not uploaded.</div>
                                                )}
                                            </div>
                                            <div>
                                                <span className="meta-label">Misc Document</span>
                                                {saleForm.misc_document_url ? (
                                                    <a className="view-btn" href={buildAssetUrl(saleForm.misc_document_url)} target="_blank" rel="noreferrer">
                                                        {getDocumentDisplayName(saleForm.misc_document_url, 'misc-document')}
                                                    </a>
                                                ) : (
                                                    <div className="employee-document-empty">Misc document not uploaded.</div>
                                                )}
                                            </div>
                                        </div>
                                        {saleForm.sale_mode === 'INSTALLMENT' && canViewSalesInstallmentPreview ? (
                                            <div className="scanner-box">
                                                <h3>Installment Preview</h3>
                                                {installmentPreview.length === 0 ? (
                                                    renderEmptyState('Enter installment count, monthly amount, and first due date to generate the schedule preview.')
                                                ) : (
                                                    <table className="pro-table">
                                                        <thead>
                                                            <tr><th>No.</th><th>Due Date</th><th>Amount</th></tr>
                                                        </thead>
                                                        <tbody>
                                                            {installmentPreview.map((row) => (
                                                                <tr key={row.installment_number}>
                                                                    <td>{row.installment_number}</td>
                                                                    <td>{row.due_date}</td>
                                                                    <td>{formatCurrency(row.amount)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                    ) : null}
                                </div>
        
                                {canViewSalesRegister ? (
                                <div className="table-card">
                                    <h3>Sales Transaction Register</h3>
                                    {dashboardData.salesTransactions.length === 0 ? (
                                        renderEmptyState('No vehicle sales transactions have been created yet.')
                                    ) : (
                                        <div className="table-scroll">
                                            <table className="pro-table sales-register-table">
                                                <colgroup>
                                                    <col className="sales-col-customer" />
                                                    <col className="sales-col-vehicle" />
                                                    <col className="sales-col-dealer" />
                                                    <col className="sales-col-mode" />
                                                    <col className="sales-col-agreement" />
                                                    <col className="sales-col-witness" />
                                                    <col className="sales-col-status" />
                                                    <col className="sales-col-installments" />
                                                    <col className="sales-col-received-installments" />
                                                    <col className="sales-col-actions" />
                                                </colgroup>
                                                <thead>
                                                    <tr>
                                                        <th>Customer</th>
                                                        <th>Vehicle</th>
                                                        <th>Dealer / Agent</th>
                                                        <th>Mode</th>
                                                        <th>Agreement</th>
                                                        <th>Witness</th>
                                                        <th>Status</th>
                                                        <th>Installments</th>
                                                        <th>Received Installments</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dashboardData.salesTransactions.map((sale) => {
                                                        const summary = summarizeSaleInstallments(sale);
                                                        const isInstallmentSale = String(sale.sale_mode || '').toUpperCase() === 'INSTALLMENT';
                                                        const hasReceivedInstallment = isInstallmentSale && summary.actualReceivedCount > 0;
                                                        const isViewing = transactionActionState.saleId === sale.id && transactionActionState.action === 'view';
                                                        const isPrinting = transactionActionState.saleId === sale.id && transactionActionState.action === 'print';
                                                        const isRoutingInstallment = transactionActionState.saleId === sale.id && transactionActionState.action === 'installments';
                                                        const canEditSaleRecord = canManageSales
                                                            && canViewSalesAgreementForm
                                                            && String(sale.status || '').toUpperCase() !== 'RECEIVED'
                                                            && !hasReceivedInstallment;
        
                                                        return (
                                                            <tr key={sale.id}>
                                                                <td>{sale.customer_name}<br />{sale.cnic_passport_number}</td>
                                                                <td>{sale.brand} {sale.model}<br />{sale.serial_number || 'No serial'}<br />{sale.vehicle_type || 'No type'}{sale.color ? ` / ${sale.color}` : ''}<br />{sale.product_description || 'No description'}<br />{sale.chassis_number || 'No chassis'} / {sale.engine_number || 'No engine'}</td>
                                                                <td>{formatSaleDealerIdentity(sale)}<br />{formatSaleAgentIdentity(sale)}</td>
                                                                <td>{sale.sale_mode}<br />{formatCurrency(sale.vehicle_price)}</td>
                                                                <td>
                                                                    {sale.agreement_number || 'No number'}<br />
                                                                    {sale.agreement_pdf_url || 'No PDF uploaded'}
                                                                </td>
                                                                <td>
                                                                    {sale.witness_name || 'No witness'} / {sale.witness_cnic || 'No CNIC'}
                                                                    <br />
                                                                    {sale.witness_two_name || 'No second witness'} / {sale.witness_two_cnic || 'No second CNIC'}
                                                                </td>
                                                                <td><span className={getStatusClass(sale.status)}>{sale.status}</span></td>
                                                                <td className="sales-installment-cell">
                                                                    {isInstallmentSale ? (
                                                                        <div className="sales-installment-meta">
                                                                            <strong>{summary.actualReceivedCount}/{summary.totalPlannedMonths || 0}</strong>
                                                                            <span>{summary.pendingCount} pending</span>
                                                                        </div>
                                                                    ) : (
                                                                        <span className="muted-inline">Cash Sale</span>
                                                                    )}
                                                                </td>
                                                                <td className="sales-received-cell">
                                                                    {isInstallmentSale ? (
                                                                        <div className="installment-received-dates preserve-breaks">
                                                                            {summary.receivedDateLines}
                                                                        </div>
                                                                    ) : (
                                                                        <span className="muted-inline">Cash Sale</span>
                                                                    )}
                                                                </td>
                                                                <td className="sales-action-cell">
                                                                    <div className="sales-action-buttons">
                                                                        {isInstallmentSale ? (
                                                                            <button
                                                                                type="button"
                                                                                className="icon-action-btn"
                                                                                onClick={() => handleOpenInstallmentPage(sale.id)}
                                                                                disabled={isViewing || isPrinting || isRoutingInstallment}
                                                                                title={isRoutingInstallment ? 'Opening installment page' : 'Open installment page'}
                                                                                aria-label={isRoutingInstallment ? 'Opening installment page' : 'Open installment page'}
                                                                            >
                                                                                {isRoutingInstallment ? <span className="btn-spinner" aria-hidden="true" /> : tableActionIcons.installments}
                                                                                <span>{isRoutingInstallment ? 'Opening' : 'Open'}</span>
                                                                            </button>
                                                                        ) : null}
                                                                        <button
                                                                            type="button"
                                                                            className="icon-action-btn"
                                                                            onClick={() => handleViewSale(sale)}
                                                                            disabled={isViewing || isPrinting || isRoutingInstallment}
                                                                            title={isViewing ? 'Loading view' : 'View'}
                                                                            aria-label={isViewing ? 'Loading view' : 'View'}
                                                                        >
                                                                            {isViewing ? <span className="btn-spinner" aria-hidden="true" /> : tableActionIcons.view}
                                                                            <span>{isViewing ? 'Loading' : 'View'}</span>
                                                                        </button>
                                                                        {canEditSaleRecord ? (
                                                                            <button
                                                                                type="button"
                                                                                className="icon-action-btn"
                                                                                onClick={() => handleEditSale(sale)}
                                                                                title="Edit sale"
                                                                                aria-label="Edit sale"
                                                                            >
                                                                                {tableActionIcons.edit}
                                                                                <span>Edit</span>
                                                                            </button>
                                                                        ) : null}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                                ) : null}
                            </>
                        );
}
