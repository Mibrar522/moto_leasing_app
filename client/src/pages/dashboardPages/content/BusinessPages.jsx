import React from 'react';

function CustomersContent({ ctx }) {
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

    if (!canOpenCustomers) {
                            return <div className="feedback-card error">Your account does not have customer onboarding access.</div>;
                        }
    return (
                            <>
                                <div className="page-heading">
                                    <h1>Customers</h1>
                                    <p>Create, update, delete, view, and enrich customer profiles with OCR and fingerprint intake metadata.</p>
                                </div>
        
                                <div className="customers-grid">
                                    {canViewCustomerForm ? (
                                    <form className="table-card customer-form-card" onSubmit={handleCustomerSubmit}>
                                        <div className="section-header">
                                            <h3>{customerForm.id ? 'Update Customer' : 'New Customer Intake'}</h3>
                                            <div className="inline-actions">
                                                <button type="button" className="view-btn" onClick={resetCustomerForm}>
                                                    Clear
                                                </button>
                                                <button type="submit" className="primary-btn" disabled={savingCustomer || (!customerForm.id && !canUnlockCustomerOwnership)}>
                                                    {savingCustomer ? 'Saving...' : customerForm.id ? 'Update Customer' : 'Create Customer'}
                                                </button>
                                            </div>
                                        </div>
        
                                        {customerForm.id && !canUnlockCustomerOwnership ? (
                                            <div className="notice-banner">
                                                Ownership locked.
                                            </div>
                                        ) : !customerForm.id && !canUnlockCustomerOwnership ? (
                                            <div className="notice-banner">
                                                Creation disabled.
                                            </div>
                                        ) : null}
        
                                        {customerMessage ? <div className="notice-banner">{customerMessage}</div> : null}
        
                                        <div className="form-grid">
                                            <label className="field">
                                                <span>Assigned Dealer</span>
                                                {canUnlockCustomerOwnership && canEditCustomerDealerDropdown ? (
                                                    <select name="dealer_id" value={customerForm.dealer_id} onChange={handleCustomerChange}>
                                                        {isSuperAdmin ? <option value="">Select dealer</option> : null}
                                                        {customerDealerOptions.map((dealer) => (
                                                            <option key={`customer-dealer-${dealer.id}`} value={dealer.id}>{dealer.dealer_name}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input value={customerForm.id ? (selectedCustomer?.dealer_name || user?.dealer_name || 'Not set') : (user?.dealer_name || 'Current dealer')} disabled />
                                                )}
                                            </label>
                                            <label className="field">
                                                <span>Created By</span>
                                                {canUnlockCustomerOwnership ? (
                                                    <select name="created_by_agent" value={customerForm.created_by_agent} onChange={handleCustomerChange}>
                                                        <option value="">Select owner</option>
                                                        {customerOwnershipCandidates.map((staff) => (
                                                            <option key={`customer-owner-${staff.id}`} value={staff.id}>
                                                                {staff.full_name} {staff.job_title ? `- ${staff.job_title}` : ''} {staff.dealer_name ? `(${staff.dealer_name})` : ''}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input value={customerForm.id ? (selectedCustomer?.created_by_name || selectedCustomer?.created_by_email || 'Not set') : (user?.full_name || 'Current user')} disabled />
                                                )}
                                            </label>
                                            <label className="field">
                                                <span>Full Name</span>
                                                <input name="full_name" value={customerForm.full_name} onChange={handleCustomerChange} placeholder="Customer legal name" />
                                            </label>
                                            <label className="field">
                                                <span>Father Name</span>
                                                <input name="father_name" value={customerForm.father_name} onChange={handleCustomerChange} placeholder="Father name from CNIC" />
                                            </label>
                                            <label className="field">
                                                <span>Date Of Birth</span>
                                                <input type="date" name="date_of_birth" value={normalizeDateInputValue(customerForm.date_of_birth)} onChange={handleCustomerChange} />
                                            </label>
                                            <label className="field">
                                                <span>Gender</span>
                                                <input name="gender" value={customerForm.gender} onChange={handleCustomerChange} placeholder="Male / Female" />
                                            </label>
                                            <label className="field">
                                                <span>Document Type</span>
                                                <select name="document_type" value={customerForm.document_type} onChange={handleCustomerChange}>
                                                    <option value="CNIC">CNIC</option>
                                                    <option value="PASSPORT">Passport</option>
                                                </select>
                                            </label>
                                            <label className="field">
                                                <span>CNIC / Passport Number</span>
                                                <input name="cnic_passport_number" value={customerForm.cnic_passport_number} onChange={handleCustomerChange} placeholder="35202-1234567-1 or passport no." />
                                            </label>
                                            <label className="field">
                                                <span>Identity Document URL</span>
                                                <input name="identity_doc_url" value={customerForm.identity_doc_url} onChange={handleCustomerChange} placeholder="https://... or internal document path" />
                                                <div className="field-url-actions">
                                                    <a className="view-btn" href={buildAssetUrl(customerForm.identity_doc_url)} target="_blank" rel="noreferrer" aria-disabled={!customerForm.identity_doc_url}>
                                                        Open
                                                    </a>
                                                    <button type="button" className="secondary-btn" onClick={() => clearCustomerDocumentField('identity_doc_url')} disabled={!customerForm.identity_doc_url}>
                                                        Clear
                                                    </button>
                                                </div>
                                            </label>
                                            <label className="field">
                                                <span>CNIC Front Upload</span>
                                                <input type="file" accept="*/*" onChange={(event) => handleCustomerAssetUpload(event, 'identity_doc_url', 'CNIC front', 'CNIC_FRONT')} disabled={!canUseOcr || uploadingCustomerAsset} />
                                            </label>
                                            <div className="field full-span">
                                                <span className="meta-label">CNIC Front Preview</span>
                                                <div className="employee-document-preview">
                                                    {customerForm.identity_doc_url ? (
                                                        isPreviewableImage(customerForm.identity_doc_url) ? (
                                                            <img
                                                                src={buildAssetUrl(customerForm.identity_doc_url)}
                                                                alt="Customer CNIC front"
                                                                className="employee-document-image"
                                                            />
                                                        ) : isPreviewablePdf(customerForm.identity_doc_url) ? (
                                                            <iframe
                                                                src={buildAssetUrl(customerForm.identity_doc_url)}
                                                                title="Customer CNIC front PDF"
                                                                className="employee-document-frame"
                                                            />
                                                        ) : (
                                                            <a href={buildAssetUrl(customerForm.identity_doc_url)} target="_blank" rel="noreferrer" className="view-btn">
                                                                Open CNIC Front
                                                            </a>
                                                        )
                                                    ) : (
                                                        <div className="employee-document-empty">No CNIC front uploaded</div>
                                                    )}
                                                </div>
                                            </div>
                                            <label className="field">
                                                <span>CNIC Back URL</span>
                                                <input name="identity_doc_back_url" value={customerForm.identity_doc_back_url} onChange={handleCustomerChange} placeholder="/uploads/customers/..." />
                                                <div className="field-url-actions">
                                                    <a className="view-btn" href={buildAssetUrl(customerForm.identity_doc_back_url)} target="_blank" rel="noreferrer" aria-disabled={!customerForm.identity_doc_back_url}>
                                                        Open
                                                    </a>
                                                    <button type="button" className="secondary-btn" onClick={() => clearCustomerDocumentField('identity_doc_back_url')} disabled={!customerForm.identity_doc_back_url}>
                                                        Clear
                                                    </button>
                                                </div>
                                            </label>
                                            <label className="field">
                                                <span>CNIC Back Upload</span>
                                                <input type="file" accept="*/*" onChange={(event) => handleCustomerAssetUpload(event, 'identity_doc_back_url', 'CNIC back', 'CNIC_BACK')} disabled={!canUseOcr || uploadingCustomerAsset} />
                                            </label>
                                            <div className="field full-span">
                                                <span className="meta-label">CNIC Back Preview</span>
                                                <div className="employee-document-preview">
                                                    {customerForm.identity_doc_back_url ? (
                                                        isPreviewableImage(customerForm.identity_doc_back_url) ? (
                                                            <img
                                                                src={buildAssetUrl(customerForm.identity_doc_back_url)}
                                                                alt="Customer CNIC back"
                                                                className="employee-document-image"
                                                            />
                                                        ) : isPreviewablePdf(customerForm.identity_doc_back_url) ? (
                                                            <iframe
                                                                src={buildAssetUrl(customerForm.identity_doc_back_url)}
                                                                title="Customer CNIC back PDF"
                                                                className="employee-document-frame"
                                                            />
                                                        ) : (
                                                            <a href={buildAssetUrl(customerForm.identity_doc_back_url)} target="_blank" rel="noreferrer" className="view-btn">
                                                                Open CNIC Back
                                                            </a>
                                                        )
                                                    ) : (
                                                        <div className="employee-document-empty">No CNIC back uploaded</div>
                                                    )}
                                                </div>
                                            </div>
                                            <label className="field">
                                                <span>Contact Email</span>
                                                <input name="contact_email" value={customerForm.contact_email} onChange={handleCustomerChange} placeholder="customer@example.com" />
                                            </label>
                                            <label className="field">
                                                <span>Contact Phone</span>
                                                <input name="contact_phone" value={customerForm.contact_phone} onChange={handleCustomerChange} placeholder="+966..." />
                                            </label>
                                            <label className="field">
                                                <span>Country</span>
                                                <input name="country" value={customerForm.country} onChange={handleCustomerChange} placeholder="Pakistan" />
                                            </label>
                                            <label className="field full-span">
                                                <span>Address</span>
                                                <textarea name="address" value={customerForm.address} onChange={handleCustomerChange} rows="3" placeholder="Customer address from CNIC or entered manually" />
                                            </label>
                                            <label className="field full-span">
                                                <span>OCR Extracted Name</span>
                                                <input name="extracted_name" value={customerForm.extracted_name} onChange={handleCustomerChange} placeholder="Autofilled from OCR or entered manually" />
                                            </label>
                                        </div>
        
                                        <div className="inline-actions spaced-top">
                                            <button type="button" className="secondary-btn" onClick={handleProcessOcr} disabled={!canUseOcr}>
                                                Process OCR
                                            </button>
                                        </div>
        
                                        {canViewCustomerFingerprint ? (
                                        <div className="scanner-box">
                                            <div className="section-header">
                                                <h3>Fingerprint Intake</h3>
                                            <button type="button" className="secondary-btn" onClick={handleCaptureFingerprint} disabled={!canCreateCustomerBiometric || uploadingCustomerAsset}>
                                                {uploadingCustomerAsset ? 'Scanning...' : 'Scan Thumb Device'}
                                            </button>
                                            </div>
        
                                            <div className="form-grid">
                                                <label className="field full-span">
                                                    <span>Fingerprint Scanner Output</span>
                                                    <textarea name="fingerprint_seed" value={customerForm.fingerprint_seed} onChange={handleCustomerChange} rows="4" placeholder="Filled from the thumb device automatically, or paste enrollment seed here as a fallback." disabled={!canCreateCustomerBiometric} />
                                                </label>
                                                <label className="field">
                                                    <span>Scanner Device</span>
                                                    <input name="fingerprint_device" value={customerForm.fingerprint_device} onChange={handleCustomerChange} placeholder="SecuGen / Mantra / Digital Persona" disabled={!canCreateCustomerBiometric} />
                                                </label>
                                                <label className="field">
                                                    <span>Scan Quality</span>
                                                    <input name="fingerprint_quality" value={customerForm.fingerprint_quality} onChange={handleCustomerChange} placeholder="HIGH / MEDIUM / LOW" disabled={!canCreateCustomerBiometric} />
                                                </label>
                                                <label className="field">
                                                    <span>Fingerprint Status</span>
                                                    <select name="fingerprint_status" value={customerForm.fingerprint_status} onChange={handleCustomerChange} disabled={!canCreateCustomerBiometric}>
                                                        <option value="NOT_CAPTURED">Not Captured</option>
                                                        <option value="PENDING">Pending</option>
                                                        <option value="ENROLLED">Enrolled</option>
                                                    </select>
                                                </label>
                                                <label className="field full-span">
                                                    <span>Biometric Hash</span>
                                                    <textarea name="biometric_hash" value={customerForm.biometric_hash} onChange={handleCustomerChange} rows="3" placeholder="Generated fingerprint hash appears here" disabled={!canCreateCustomerBiometric} />
                                                </label>
                                                <label className="field full-span">
                                                    <span>Biometric Thumb URL</span>
                                                    <input name="fingerprint_thumb_url" value={customerForm.fingerprint_thumb_url} onChange={handleCustomerChange} placeholder="/uploads/customers/..." disabled={!canCreateCustomerBiometric} />
                                                </label>
                                                <label className="field full-span">
                                                    <span>Thumb Upload</span>
                                                    <input type="file" accept="image/*" onChange={(event) => handleCustomerAssetUpload(event, 'fingerprint_thumb_url', 'Thumb image', 'THUMB')} disabled={!canCreateCustomerBiometric || uploadingCustomerAsset} />
                                                </label>
                                                <div className="field full-span">
                                                    <span className="meta-label">Thumb Preview</span>
                                                    <div className="employee-document-preview">
                                                        {customerForm.fingerprint_thumb_url ? (
                                                            <img
                                                                src={buildAssetUrl(customerForm.fingerprint_thumb_url)}
                                                                alt="Customer thumb"
                                                                className="employee-document-image"
                                                            />
                                                        ) : (
                                                            <div className="employee-document-empty">No thumb image uploaded</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <label className="field full-span">
                                                    <span>Signature URL</span>
                                                    <input name="signature_image_url" value={customerForm.signature_image_url} onChange={handleCustomerChange} placeholder="/uploads/customers/..." />
                                                </label>
                                                <label className="field full-span">
                                                    <span>Signature Upload</span>
                                                    <input type="file" accept="image/*" onChange={(event) => handleCustomerAssetUpload(event, 'signature_image_url', 'Signature', 'SIGNATURE')} disabled={!canManageCustomers || uploadingCustomerAsset} />
                                                </label>
                                                <div className="field full-span">
                                                    <span className="meta-label">Signature Preview</span>
                                                    <div className="employee-document-preview">
                                                        {customerForm.signature_image_url ? (
                                                            <img
                                                                src={buildAssetUrl(customerForm.signature_image_url)}
                                                                alt="Customer signature"
                                                                className="employee-document-image"
                                                            />
                                                        ) : (
                                                            <div className="employee-document-empty">No signature uploaded</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        ) : null}
                                    </form>
                                    ) : null}
        
                                    {renderCustomerDetails()}
                                </div>
        
                                {canViewCustomerRegister ? (
                                <div className="table-card">
                                    <div className="section-header">
                                        <h3>Customer Registry</h3>
                                        <span className="section-caption">{filteredCustomers.length} visible customers</span>
                                    </div>
        
                                    {filteredCustomers.length === 0 ? (
                                        renderEmptyState('No customers found yet. Create the first customer intake record above.')
                                    ) : (
                                        <table className="pro-table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Father Name</th>
                                                    <th>DOB</th>
                                                    <th>Gender</th>
                                                    <th>Document Type</th>
                                                    <th>CNIC / Passport</th>
                                                    <th>Country</th>
                                                    <th>Address</th>
                                                    <th>Contact</th>
                                                    <th>OCR</th>
                                                    <th>Fingerprint</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredCustomers.map((customer) => {
                                                    const ocrDetails = customer.ocr_details || {};
                                                    const fingerprint = ocrDetails.fingerprint || {};
        
                                                    return (
                                                        <tr key={customer.id}>
                                                            <td>{customer.full_name}</td>
                                                            <td>{ocrDetails.father_name || 'Not set'}</td>
                                                            <td>{ocrDetails.date_of_birth || 'Not set'}</td>
                                                            <td>{ocrDetails.gender || 'Not set'}</td>
                                                            <td>{ocrDetails.document_type || 'Not tagged'}</td>
                                                            <td>{customer.cnic_passport_number}</td>
                                                            <td>{ocrDetails.country || 'Not set'}</td>
                                                            <td>{ocrDetails.address || 'Not set'}</td>
                                                            <td>{ocrDetails.contact_email || 'No email'}<br />{ocrDetails.contact_phone || 'No phone'}</td>
                                                            <td>
                                                                <span className={getStatusClass(ocrDetails.raw_ocr_text ? 'READY' : 'DRAFT')}>
                                                                    {ocrDetails.raw_ocr_text ? 'Scanned' : 'Pending'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className={getStatusClass(fingerprint.status || (customer.biometric_hash ? 'ENROLLED' : 'NOT_CAPTURED'))}>
                                                                    {fingerprint.status || (customer.biometric_hash ? 'ENROLLED' : 'NOT_CAPTURED')}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="table-actions">
                                                                    {canViewCustomerRecord ? (
                                                                        <button type="button" className="view-btn" onClick={() => setSelectedCustomerId(customer.id)}>View</button>
                                                                    ) : null}
                                                                    {canEditCustomerRecord ? (
                                                                        <button type="button" className="view-btn" onClick={() => handleEditCustomer(customer)}>Edit</button>
                                                                    ) : null}
                                                                    {canDeleteCustomerRecord ? (
                                                                        <button type="button" className="danger-btn" onClick={() => handleDeleteCustomer(customer)}>Delete</button>
                                                                    ) : null}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                                ) : null}
                            </>
                        );
}

function ProductsContent({ ctx }) {
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

function CompaniesContent({ ctx }) {
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

    if (!canManageStock) {
                            return <div className="feedback-card error">Your account does not have company profile access.</div>;
                        }
    return (
                            <>
                                <div className="page-heading">
                                    <h1>Company Profile</h1>
                                    <p>Create supplier company profiles so stock orders can select companies from a controlled dropdown.</p>
                                </div>
                                <div className="customers-grid">
                                    {canViewCompanyForm ? (
                                    <form className="table-card customer-form-card" onSubmit={handleCompanySubmit}>
                                        <div className="section-header">
                                            <h3>{companyForm.id ? 'Update Company Profile' : 'New Company Profile'}</h3>
                                            <div className="inline-actions">
                                                <button type="button" className="view-btn" onClick={resetCompanyForm}>Clear</button>
                                                <button type="submit" className="primary-btn" disabled={savingCompany}>
                                                    {savingCompany ? 'Saving...' : companyForm.id ? 'Update Company' : 'Save Company'}
                                                </button>
                                            </div>
                                        </div>
                                        {companyMessage ? <div className="notice-banner">{companyMessage}</div> : null}
                                        <div className="form-grid">
                                            <label className="field"><span>Company Name</span><input name="company_name" value={companyForm.company_name} onChange={handleCompanyChange} /></label>
                                            <label className="field"><span>Company Email</span><input name="company_email" type="email" value={companyForm.company_email} onChange={handleCompanyChange} /></label>
                                            <label className="field"><span>Contact Person</span><input name="contact_person" value={companyForm.contact_person} onChange={handleCompanyChange} /></label>
                                            <label className="field"><span>Phone</span><input name="phone" value={companyForm.phone} onChange={handleCompanyChange} /></label>
                                            <label className="field full-span"><span>Address</span><textarea name="address" value={companyForm.address} onChange={handleCompanyChange} rows="3" /></label>
                                            <label className="field full-span"><span>Notes</span><textarea name="notes" value={companyForm.notes} onChange={handleCompanyChange} rows="3" /></label>
                                        </div>
                                    </form>
                                    ) : null}
        
                                    {canViewCompanyDirectory ? (
                                    <div className="table-card">
                                        <div className="section-header">
                                            <h3>Company Directory</h3>
                                            <span className="section-caption">{(dashboardData.companies || []).length} active companies</span>
                                        </div>
                                        {(dashboardData.companies || []).length === 0 ? renderEmptyState('No company profiles created yet.') : (
                                            <table className="pro-table">
                                                <thead>
                                                    <tr>
                                                        <th>Company</th>
                                                        <th>Contact</th>
                                                        <th>Address</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(dashboardData.companies || []).map((company) => (
                                                        <tr key={company.id}>
                                                            <td>{company.company_name}<br />{company.contact_person || 'No contact person'}</td>
                                                            <td>{company.company_email || 'No email'}<br />{company.phone || 'No phone'}</td>
                                                            <td>{company.address || 'No address'}</td>
                                                            <td>
                                                                <div className="table-actions">
                                                                    <button type="button" className="view-btn" onClick={() => handleEditCompany(company)}>Edit</button>
                                                                    <button type="button" className="danger-btn" onClick={() => handleDeleteCompany(company)}>Delete</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                    ) : null}
                                </div>
                            </>
                        );
}

function StockContent({ ctx }) {
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

    if (!canManageStock) {
                            return <div className="feedback-card error">Your account does not have stock and fleet management access.</div>;
                        }
    return (
                            <>
                                <div className="page-heading">
                                    <h1>Stock Orders</h1>
                                    <p>Order stock against product masters, attach the bank online slip, email the supplier, and track what has been received.</p>
                                </div>
        
                                <div className="customers-grid">
                                    {canViewStockOrderForm ? (
                                    <form className="table-card customer-form-card" onSubmit={handleStockOrderSubmit}>
                                        <div className="section-header">
                                            <h3>Order Stock</h3>
                                            <button type="submit" className="primary-btn" disabled={savingStock}>
                                                {savingStock ? 'Processing...' : 'Create Order'}
                                            </button>
                                        </div>
                                        {stockMessage ? <div className="notice-banner">{stockMessage}</div> : null}
                                        <div className="form-grid">
                                            <label className="field">
                                                <span>Company Profile</span>
                                                <select name="company_profile_id" value={stockOrderForm.company_profile_id} onChange={handleStockOrderChange}>
                                                    <option value="">Select company</option>
                                                    {(dashboardData.companies || []).map((company) => (
                                                        <option key={`stock-company-${company.id}`} value={company.id}>
                                                            {company.company_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label className="field"><span>Company Name</span><input name="company_name" value={stockOrderForm.company_name} onChange={handleStockOrderChange} readOnly /></label>
                                            <label className="field"><span>Company Email</span><input name="company_email" type="email" value={stockOrderForm.company_email} onChange={handleStockOrderChange} placeholder="supplier@company.com" readOnly /></label>
                                            <label className="field full-span">
                                                <span>Product Vehicle</span>
                                                <select name="product_id" value={stockOrderForm.product_id} onChange={handleStockOrderChange}>
                                                    <option value="">Select product vehicle</option>
                                                    {(dashboardData.products || []).map((product) => (
                                                        <option key={`stock-product-${product.id}`} value={product.id}>
                                                            {[product.brand, product.vehicle_type, product.model].filter(Boolean).join(' - ')}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label className="field"><span>Vehicle Type</span><input name="vehicle_type" value={stockOrderForm.vehicle_type} onChange={handleStockOrderChange} readOnly /></label>
                                            <label className="field"><span>Brand</span><input name="brand" value={stockOrderForm.brand} onChange={handleStockOrderChange} readOnly /></label>
                                            <label className="field"><span>Model</span><input name="model" value={stockOrderForm.model} onChange={handleStockOrderChange} readOnly /></label>
                                            <label className="field"><span>Color</span><input name="color" value={stockOrderForm.color || ''} onChange={handleStockOrderChange} readOnly /></label>
                                            <label className="field full-span"><span>Product Description</span><textarea name="product_description" value={stockOrderForm.product_description || ''} onChange={handleStockOrderChange} rows="3" readOnly /></label>
                                            <label className="field"><span>Unit Price</span><input type="number" min="0" step="0.01" name="unit_price" value={stockOrderForm.unit_price} onChange={handleStockOrderChange} /></label>
                                            <label className="field"><span>Total Amount</span><input type="number" min="0" step="0.01" name="total_amount" value={stockOrderForm.total_amount} onChange={handleStockOrderChange} readOnly /></label>
                                            <label className="field"><span>Expected Delivery</span><input type="date" name="expected_delivery_date" value={stockOrderForm.expected_delivery_date} onChange={handleStockOrderChange} /></label>
                                            <label className="field full-span"><span>Bank Online Slip</span><input type="file" accept="application/pdf,image/*" onChange={handleBankSlipUpload} /></label>
                                            <label className="field full-span"><span>Uploaded Slip URL</span><input name="bank_slip_url" value={stockOrderForm.bank_slip_url} onChange={handleStockOrderChange} readOnly={uploadingBankSlip} /></label>
                                            <label className="field full-span"><span>Notes</span><textarea rows="4" name="notes" value={stockOrderForm.notes} onChange={handleStockOrderChange} placeholder="Payment reference, supplier note, or bank transaction details" /></label>
                                        </div>
                                    </form>
                                    ) : null}
        
                                    {canViewStockReceived ? (
                                    <div className="table-card">
                                        <h3>Stock Received From Company</h3>
                                        {receivedStockOrders.length === 0 ? (
                                            renderEmptyState('No stock has been marked as received yet.')
                                        ) : (
                                            <table className="pro-table">
                                                <thead>
                                                    <tr>
                                                        <th>Company</th>
                                                        <th>Vehicle</th>
                                                        <th>Vehicle Received</th>
                                                        <th>Received At</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {receivedStockOrders.map((order) => (
                                                        <tr key={order.id}>
                                                            <td>{order.company_name}</td>
                                                            <td>{order.brand} {order.model}<br />{order.vehicle_type}{order.product_color ? ` / ${order.product_color}` : ''}<br />{order.product_description || 'No description'}</td>
                                                            <td>{Number(order.received_quantity || 0) > 0 ? 'Yes' : 'Pending'}</td>
                                                            <td>{order.received_at ? new Date(order.received_at).toLocaleDateString('en-PK') : 'Pending'}</td>
                                                            <td><span className={getStatusClass(order.order_status)}>{order.order_status}</span></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                    ) : null}
                                </div>
        
                                {canViewStockRegister ? (
                                <div className="table-card">
                                    <h3>Stock Ordering Register</h3>
                                    {pendingStockOrders.length === 0 ? (
                                        renderEmptyState('No stock orders have been created yet.')
                                    ) : (
                                        <table className="pro-table">
                                            <thead>
                                                <tr>
                                                    <th>Company</th>
                                                    <th>Vehicle</th>
                                                    <th>Amount</th>
                                                    <th>Delivery</th>
                                                    <th>Email</th>
                                                    <th>Slip</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pendingStockOrders.map((order) => (
                                                    <tr key={order.id}>
                                                            <td>{order.company_name}<br />{order.company_email || 'No email'}</td>
                                                        <td>{order.brand} {order.model}<br />{order.vehicle_type}{order.product_color ? ` / ${order.product_color}` : ''}<br />{order.product_description || 'No description'}</td>
                                                        <td>{formatCurrency(order.total_amount)}</td>
                                                        <td>{order.expected_delivery_date || 'Not set'}</td>
                                                        <td>{order.email_sent ? 'Sent' : order.email_error || 'Pending config'}</td>
                                                        <td>{order.bank_slip_url ? <a href={buildAssetUrl(order.bank_slip_url)} target="_blank" rel="noreferrer">View Slip</a> : 'No slip'}</td>
                                                        <td><span className={getStatusClass(order.order_status)}>{order.order_status}</span></td>
                                                        <td><button type="button" className="view-btn" onClick={() => openStockReceiveModal(order)} disabled={savingStock}>Receive Stock</button></td>
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

function SalesContent({ ctx }) {
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

function TransactionsContent({ ctx }) {
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

function InstallmentsContent({ ctx }) {
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

    if (!canManageInstallments) {
                            return <div className="feedback-card error">Your account does not have installment management access.</div>;
                        }
    if (!selectedInstallmentSale) {
                            return (
                                <>
                                    <div className="page-heading">
                                        <h1>Installment Page</h1>
                                        <p>Track received and pending monthly installments for financed vehicle sales.</p>
                                    </div>
                                    <div className="feedback-card">No installment sales are available yet.</div>
                                </>
                            );
                        }
    return (
                            <>
                                <div className="page-heading">
                                    <h1>Installment Page</h1>
                                    <p>View the customer, vehicle, and monthly installment collection status in one place.</p>
                                </div>
        
                                {saleMessage ? <div className="notice-banner">{saleMessage}</div> : null}
        
                                {canViewInstallmentOverview ? (
                                <div className="table-card installment-hero-card">
                                    <div className="installment-hero">
                                        <div className="installment-hero-image-wrap">
                                            {selectedInstallmentImageUrl ? (
                                                <img
                                                    src={selectedInstallmentImageUrl}
                                                    alt={`${selectedInstallmentSale.brand} ${selectedInstallmentSale.model}`}
                                                    className="installment-hero-image"
                                                />
                                            ) : (
                                                <div className="installment-hero-image fallback">No vehicle image</div>
                                            )}
                                        </div>
                                        <div className="installment-hero-content">
                                            <div className="section-header">
                                                <h3>{selectedInstallmentSale.brand} {selectedInstallmentSale.model}</h3>
                                                <div className="inline-actions">
                                                    <select
                                                        value={selectedInstallmentSale.id}
                                                        onChange={(event) => setSelectedInstallmentSaleId(event.target.value)}
                                                        className="installment-sale-picker no-print"
                                                    >
                                                        {installmentSales.map((sale) => (
                                                            <option key={sale.id} value={sale.id}>
                                                                {sale.customer_name} - {sale.brand} {sale.model} - {sale.dealer_name || 'No dealer'}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button type="button" className="primary-btn no-print" onClick={handlePrintInvoice}>
                                                        Print Invoice
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="detail-grid">
                                                <div><span className="meta-label">Customer</span><p className="meta-value">{selectedInstallmentSale.customer_name}</p></div>
                                                <div><span className="meta-label">CNIC</span><p className="meta-value">{selectedInstallmentSale.cnic_passport_number}</p></div>
                                                <div><span className="meta-label">Dealer</span><p className="meta-value">{formatSaleDealerIdentity(selectedInstallmentSale)}</p></div>
                                                <div><span className="meta-label">Recorded By</span><p className="meta-value">{selectedInstallmentSale.agent_name || 'System'}</p></div>
                                                <div><span className="meta-label">Agreement</span><p className="meta-value">{selectedInstallmentSale.agreement_number || 'No agreement number'}</p></div>
                                                <div><span className="meta-label">Purchase Date</span><p className="meta-value">{selectedInstallmentSale.purchase_date}</p></div>
                                                <div><span className="meta-label">Vehicle Type</span><p className="meta-value">{selectedInstallmentSale.vehicle_type || 'Not set'}</p></div>
                                                <div><span className="meta-label">Registration</span><p className="meta-value">{selectedInstallmentSale.registration_number || 'Not set'}</p></div>
                                                <div><span className="meta-label">Chassis Number</span><p className="meta-value">{selectedInstallmentSale.chassis_number || 'Not set'}</p></div>
                                                <div><span className="meta-label">Engine Number</span><p className="meta-value">{selectedInstallmentSale.engine_number || 'Not set'}</p></div>
                                                <div><span className="meta-label">Total Price</span><p className="meta-value">{formatCurrency(selectedInstallmentSale.vehicle_price)}</p></div>
                                                <div><span className="meta-label">Down Payment</span><p className="meta-value">{formatCurrency(selectedInstallmentSale.down_payment)}</p></div>
                                                <div><span className="meta-label">Monthly Installment</span><p className="meta-value">{formatCurrency(selectedInstallmentSale.monthly_installment)}</p></div>
                                                <div><span className="meta-label">Months</span><p className="meta-value">{selectedInstallmentSale.installment_months || 0}</p></div>
                                                <div><span className="meta-label">Witness 1</span><p className="meta-value">{selectedInstallmentSale.witness_name || 'Not set'}{selectedInstallmentSale.witness_cnic ? ` / ${selectedInstallmentSale.witness_cnic}` : ''}</p></div>
                                                <div><span className="meta-label">Witness 2</span><p className="meta-value">{selectedInstallmentSale.witness_two_name || 'Not set'}{selectedInstallmentSale.witness_two_cnic ? ` / ${selectedInstallmentSale.witness_two_cnic}` : ''}</p></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ) : null}
        
                                {canViewInstallmentOverview ? (
                                <div className="metrics-grid">
                                    <div className="metric-card"><label>Received Installments</label><div className="value success">{installmentSummary.receivedCount}</div></div>
                                    <div className="metric-card"><label>Pending Installments</label><div className="value warning">{installmentSummary.pendingCount}</div></div>
                                    <div className="metric-card"><label>Received Cash</label><div className="value success">{formatCurrency(installmentSummary.receivedAmount)}</div></div>
                                    <div className="metric-card">
                                        <label>Next Payment</label>
                                        <div className="value warning">{formatCurrency(installmentSummary.nextPaymentAmount)}</div>
                                        <div className="meta-inline">{installmentSummary.nextPaymentDate || 'No pending installment'}</div>
                                    </div>
                                    <div className="metric-card">
                                        <label>Total Remaining</label>
                                        <div className="value warning">{formatCurrency(installmentSummary.totalRemainingAmount)}</div>
                                        <div className="meta-inline">From total price balance</div>
                                    </div>
                                </div>
                                ) : null}
        
                                    {canViewInstallmentOverview ? (
                                    <div className="table-card print-invoice">
                                        <div className="invoice-header">
                                            <div>
                                                <p className="invoice-kicker">{appBrandName} Invoice</p>
                                                <h2>Installment Transaction Statement</h2>
                                                <p className="invoice-subtitle">Vehicle sale, customer details, and full payment history.</p>
                                                <p className="invoice-subtitle">{appBrandAddress}</p>
                                                <p className="invoice-subtitle">{appBrandContact}</p>
                                            </div>
                                            <div className="invoice-meta">
                                                <div><span className="meta-label">Agreement No.</span><p className="meta-value">{selectedInstallmentSale.agreement_number || 'Not set'}</p></div>
                                            <div><span className="meta-label">Printed On</span><p className="meta-value">{new Date().toLocaleDateString('en-PK')}</p></div>
                                            <div><span className="meta-label">Status</span><p className="meta-value">{selectedInstallmentSale.status}</p></div>
                                        </div>
                                    </div>
        
                                    <div className="invoice-hero">
                                        <div className="invoice-image-wrap">
                                            {selectedInstallmentImageUrl ? (
                                                <img
                                                    src={selectedInstallmentImageUrl}
                                                    alt={`${selectedInstallmentSale.brand} ${selectedInstallmentSale.model}`}
                                                    className="invoice-image"
                                                />
                                            ) : (
                                                <div className="invoice-image fallback">No vehicle image</div>
                                            )}
                                        </div>
                                        <div className="invoice-grid">
                                            <div><span className="meta-label">Customer</span><p className="meta-value">{selectedInstallmentSale.customer_name}</p></div>
                                            <div><span className="meta-label">Customer CNIC</span><p className="meta-value">{selectedInstallmentSale.cnic_passport_number}</p></div>
                                            <div><span className="meta-label">Dealer</span><p className="meta-value">{formatSaleDealerIdentity(selectedInstallmentSale)}</p></div>
                                            <div><span className="meta-label">Recorded By</span><p className="meta-value">{selectedInstallmentSale.agent_name || 'System'}</p></div>
                                            <div><span className="meta-label">Vehicle</span><p className="meta-value">{selectedInstallmentSale.brand} {selectedInstallmentSale.model}</p></div>
                                            <div><span className="meta-label">Registration</span><p className="meta-value">{selectedInstallmentSale.registration_number || 'Not set'}</p></div>
                                            <div><span className="meta-label">Vehicle Type</span><p className="meta-value">{selectedInstallmentSale.vehicle_type || 'Not set'}</p></div>
                                            <div><span className="meta-label">Purchase Date</span><p className="meta-value">{selectedInstallmentSale.purchase_date}</p></div>
                                            <div><span className="meta-label">Chassis Number</span><p className="meta-value">{selectedInstallmentSale.chassis_number || 'Not set'}</p></div>
                                            <div><span className="meta-label">Engine Number</span><p className="meta-value">{selectedInstallmentSale.engine_number || 'Not set'}</p></div>
                                            <div><span className="meta-label">Total Price</span><p className="meta-value">{formatCurrency(selectedInstallmentSale.vehicle_price)}</p></div>
                                            <div><span className="meta-label">Down Payment</span><p className="meta-value">{formatCurrency(selectedInstallmentSale.down_payment)}</p></div>
                                            <div><span className="meta-label">Monthly Installment</span><p className="meta-value">{formatCurrency(selectedInstallmentSale.monthly_installment)}</p></div>
                                            <div><span className="meta-label">Total Remaining</span><p className="meta-value">{formatCurrency(installmentSummary.totalRemainingAmount)}</p></div>
                                            <div><span className="meta-label">Witness 1</span><p className="meta-value">{selectedInstallmentSale.witness_name || 'Not set'}{selectedInstallmentSale.witness_cnic ? ` / ${selectedInstallmentSale.witness_cnic}` : ''}</p></div>
                                            <div><span className="meta-label">Witness 2</span><p className="meta-value">{selectedInstallmentSale.witness_two_name || 'Not set'}{selectedInstallmentSale.witness_two_cnic ? ` / ${selectedInstallmentSale.witness_two_cnic}` : ''}</p></div>
                                        </div>
                                    </div>
        
                                    <div className="invoice-summary-strip">
                                        <div className="invoice-stat"><span className="meta-label">Received Cash</span><strong>{formatCurrency(installmentSummary.receivedAmount)}</strong></div>
                                        <div className="invoice-stat"><span className="meta-label">Next Payment</span><strong>{formatCurrency(installmentSummary.nextPaymentAmount)}</strong></div>
                                        <div className="invoice-stat"><span className="meta-label">Next Due Date</span><strong>{installmentSummary.nextPaymentDate || 'No pending installment'}</strong></div>
                                        <div className="invoice-stat"><span className="meta-label">Pending Installments</span><strong>{installmentSummary.pendingCount}</strong></div>
                                    </div>
        
                                    <div className="scan-preview">
                                        <div>
                                            <span className="meta-label">Biometric Thumb</span>
                                            <div className="employee-document-preview">
                                                {selectedInstallmentThumbUrl ? (
                                                    <img
                                                        src={selectedInstallmentThumbUrl}
                                                        alt="Biometric thumb"
                                                        className="employee-document-image"
                                                    />
                                                ) : (
                                                    <div className="employee-document-empty">Thumb not attached</div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="meta-label">Customer CNIC Front</span>
                                            <div className="employee-document-preview">
                                                {renderAssetPreview(selectedInstallmentCnicFrontPath, 'CNIC front not attached', 'Customer CNIC front')}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="meta-label">Customer Signature</span>
                                            <div className="employee-document-preview">
                                                {renderAssetPreview(selectedInstallmentSignaturePath, 'Signature not attached', 'Customer signature')}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="meta-label">Authorized Signature</span>
                                            <div className="employee-document-preview">
                                                {renderAssetPreview(selectedInstallmentAuthorizedSignaturePath, 'Authorized signatory', 'Authorized signature')}
                                            </div>
                                            <p className="meta-value" style={{ marginTop: '10px', textAlign: 'center', fontWeight: 700 }}>
                                                {selectedInstallmentSale.agent_name || 'Authorized Officer'}
                                            </p>
                                        </div>
                                    </div>
        
                                </div>
                                    ) : null}
        
                                {canViewInstallmentCollection ? (
                                <div className="table-card">
                                    <h3>Monthly Installment Collection</h3>
                                    {visibleSelectedInstallmentRows.length === 0 ? (
                                        renderEmptyState('No installment schedule has been generated for this sale yet.')
                                    ) : (
                                        <table className="pro-table">
                                            <thead>
                                                <tr>
                                                    <th>No.</th>
                                                    <th>Due Date</th>
                                                    <th>Amount</th>
                                                    <th>Received Cash</th>
                                                    <th>Carry Forward</th>
                                                    <th>Status</th>
                                                    <th>Received Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {visibleSelectedInstallmentRows.map((row) => {
                                                    const normalizedStatus = String(row.status || '').toUpperCase();
                                                    const isReceived = normalizedStatus === 'RECEIVED' || normalizedStatus === 'PARTIAL' || Number(row.received_amount || 0) > 0;
                                                    const receiptInputValue = installmentReceiptInputs[row.id] ?? '';
                                                    const previewBalanceAdjustment = receiptInputValue
                                                        ? Number(row.amount || 0) - Number(receiptInputValue || 0)
                                                        : Number(row.carry_forward_amount || 0);
                                                    return (
                                                        <tr key={row.id}>
                                                            <td>{row.installment_number}</td>
                                                            <td>{row.due_date}</td>
                                                            <td>{formatCurrency(row.amount)}</td>
                                                            <td>
                                                                {isReceived ? (
                                                                    formatCurrency(row.received_amount)
                                                                ) : (
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        step="0.01"
                                                                        className="table-inline-input"
                                                                        value={receiptInputValue}
                                                                        onChange={(event) => handleInstallmentReceiptInputChange(row.id, event.target.value)}
                                                                        placeholder={String(row.amount || '')}
                                                                        disabled={receivingInstallmentId === row.id}
                                                                    />
                                                                )}
                                                            </td>
                                                            <td>{formatCurrency(isReceived ? row.carry_forward_amount : previewBalanceAdjustment)}</td>
                                                            <td>
                                                                <span className={getStatusClass(row.status)}>
                                                                    {isReceived ? '✓ Received' : String(row.status || 'Pending')}
                                                                </span>
                                                            </td>
                                                            <td>{row.paid_date || 'Not received yet'}</td>
                                                            <td>
                                                                <div className="inline-actions">
                                                                    <button
                                                                        type="button"
                                                                        className="view-btn"
                                                                        onClick={() => handlePrintInstallmentReceipt(row)}
                                                                    >
                                                                        Print
                                                                    </button>
                                                                    {isReceived ? (
                                                                        <span className="feature-pill">Cash Received</span>
                                                                    ) : (
                                                                        <button
                                                                            type="button"
                                                                            className="primary-btn"
                                                                            onClick={() => handleReceiveInstallment(row)}
                                                                            disabled={receivingInstallmentId === row.id}
                                                                        >
                                                                            {receivingInstallmentId === row.id ? 'Saving...' : receiptInputValue ? 'Receive Amount' : 'Receive Full'}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                                ) : null}
                            </>
                        );
}

export default function BusinessPages({ pageKey, ctx }) {
    switch (pageKey) {
        case 'customers':
            return <CustomersContent ctx={ctx} />;
        case 'products':
            return <ProductsContent ctx={ctx} />;
        case 'companies':
            return <CompaniesContent ctx={ctx} />;
        case 'stock':
            return <StockContent ctx={ctx} />;
        case 'sales':
            return <SalesContent ctx={ctx} />;
        case 'transactions':
            return <TransactionsContent ctx={ctx} />;
        case 'installments':
            return <InstallmentsContent ctx={ctx} />;
        default:
            return null;
    }
}
