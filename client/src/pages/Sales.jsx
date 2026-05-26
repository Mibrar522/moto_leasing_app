import { useMemo, useState } from 'react';

export default function Sales({ ctx }) {
  const {
    actualVehiclePrice,
    availableSalesVehicles,
    buildAssetUrl,
    canCreateSales,
    canManageSales,
    canViewSalesAgreementForm,
    canViewSalesAgreementSummary,
    canViewSalesInstallmentPreview,
    canViewSalesRegister,
    canUpdateSalesRegister,
    canViewSalesUrlFields,
    canEditSalesField,
    currentSalesDealerSignatureUrl,
    dashboardData,
    editingSaleRecord,
    formatCurrency,
    formatSaleAgentIdentity,
    formatSaleDealerIdentity,
    getDocumentDisplayName,
    getStatusClass,
    handleAgreementUpload,
    handleEditSale,
    handleOpenInstallmentPage,
    handleSaleChange,
    handleSaleDealerSignatureUpload,
    handleSaleDocumentUpload,
    handleSaleSubmit,
    handleViewSale,
    installmentMarkupPreview,
    installmentPreview,
    isSelectedSaleVehicleAvailable,
    renderAssetPreview,
    renderEmptyState,
    resetSaleForm,
    saleAuthorizedSignatureUrl,
    saleCustomerCnicBackUrl,
    saleCustomerCnicFrontUrl,
    saleDealerSignatureUrl,
    saleForm,
    saleFormReadOnly,
    saleMessage,
    salesVehicleDropdownOpen,
    salesVehicleOptions,
    savingSale,
    selectedSaleCustomer,
    selectedSaleCustomerSignatureUrl,
    selectedSaleCustomerPassportPhotoUrl,
    selectedSaleVehicle,
    selectedSaleVehicleName,
    selectedSaleVehicleSecondaryLine,
    setSaleForm,
    setSalesVehicleDropdownOpen,
    setUploadingSaleAuthorizedSignature,
    setUploadingSaleBankCheck,
    setUploadingSaleMiscDocument,
    summarizeSaleInstallments,
    tableActionIcons,
    transactionActionState,
    uploadingAgreement,
    uploadingSaleAuthorizedSignature,
    uploadingSaleBankCheck,
    uploadingSaleMiscDocument,
    user,
  } = ctx;

  const [salesRegisterOpen, setSalesRegisterOpen] = useState(false);
  const [salesRegisterSearchOpen, setSalesRegisterSearchOpen] = useState(false);
  const [salesRegisterSearch, setSalesRegisterSearch] = useState('');
  const [salesRegisterSearchField, setSalesRegisterSearchField] = useState('customer_name');
  const salesRegisterSearchFields = [
    { value: 'customer_name', label: 'Customer Name' },
    { value: 'customer_mobile', label: 'Mobile Number' },
    { value: 'cnic_passport_number', label: 'CNIC' },
    { value: 'chassis_number', label: 'Chassis' },
    { value: 'engine_number', label: 'Engine' },
    { value: 'registration_number', label: 'Registration' },
  ];
  const normalizeSalesRegisterSearch = (value) => String(value || '').trim().toLowerCase();
  const getSaleCustomerMobile = (sale) => (
    sale.customer_mobile_number
    || sale.customer_contact_phone
    || sale.contact_phone
    || sale.customer_ocr_details?.contact_phone
    || sale.customer_ocr_details?.contactPhone
    || ''
  );
  const getSalesRegisterSearchValue = (sale, field) => {
    if (field === 'customer_mobile') return getSaleCustomerMobile(sale);
    return sale[field] || '';
  };
  const salesRegisterSearchFieldLabel = salesRegisterSearchFields.find((field) => field.value === salesRegisterSearchField)?.label || 'Customer Name';
  const filteredSalesRegisterRows = useMemo(() => {
    const term = normalizeSalesRegisterSearch(salesRegisterSearch);
    const salesRows = dashboardData.salesTransactions || [];
    if (!term) return salesRows;

    const startsWithMatches = [];
    const containsMatches = [];
    salesRows.forEach((sale) => {
      const fieldValue = normalizeSalesRegisterSearch(getSalesRegisterSearchValue(sale, salesRegisterSearchField));
      const combinedValue = normalizeSalesRegisterSearch([
        sale.customer_name,
        getSaleCustomerMobile(sale),
        sale.cnic_passport_number,
        sale.chassis_number,
        sale.engine_number,
        sale.registration_number,
        sale.brand,
        sale.model,
        sale.serial_number,
        sale.agreement_number,
      ].filter(Boolean).join(' '));

      if (fieldValue.startsWith(term) || combinedValue.startsWith(term)) {
        startsWithMatches.push(sale);
      } else if (fieldValue.includes(term) || combinedValue.includes(term)) {
        containsMatches.push(sale);
      }
    });

    return [...startsWithMatches, ...containsMatches];
  }, [dashboardData.salesTransactions, salesRegisterSearch, salesRegisterSearchField]);
  const salesRegisterRows = salesRegisterOpen ? filteredSalesRegisterRows : filteredSalesRegisterRows.slice(0, 5);

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
                                    <label className="field" hidden={!canEditSalesField('Customer')}>
                                        <span>Customer</span>
                                        <select name="customer_id" value={saleForm.customer_id} onChange={handleSaleChange}>
                                            <option value="">Select customer</option>
                                            {dashboardData.customers.map((customer) => (
                                                <option key={customer.id} value={customer.id}>{customer.full_name}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <div className="field full-span" hidden={!canEditSalesField('Customer')}>
                                        <span className="meta-label">Selected Customer Photo</span>
                                        <div className="employee-document-preview">
                                            {renderAssetPreview(selectedSaleCustomerPassportPhotoUrl, 'Select a customer with photo.', 'Selected Customer Photo')}
                                        </div>
                                    </div>
                                    <label className="field" hidden={!canEditSalesField('Available Stock')}>
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
                                    <label className="field" hidden={!canEditSalesField('Sale Mode')}><span>Sale Mode</span><select name="sale_mode" value={saleForm.sale_mode} onChange={handleSaleChange}><option value="CASH">Cash</option><option value="INSTALLMENT">Installment</option></select></label>
                                    <label className="field" hidden={!canEditSalesField('Agreement Number')}><span>Agreement Number</span><input name="agreement_number" value={saleForm.agreement_number || ''} onChange={handleSaleChange} /></label>
                                    <label className="field" hidden={!canEditSalesField('Agreement Date')}><span>Agreement Date</span><input type="date" name="agreement_date" value={saleForm.agreement_date || ''} onChange={handleSaleChange} /></label>
                                    <label className="field" hidden={!canEditSalesField('Purchase Date')}><span>Purchase Date</span><input type="date" name="purchase_date" value={saleForm.purchase_date || ''} onChange={handleSaleChange} /></label>
                                    <label className="field" hidden={!canEditSalesField('Actual Price')}><span>Actual Price</span><input type="number" min="0" step="0.01" value={actualVehiclePrice ?? 0} readOnly /></label>
                                    <label className="field checkbox-field" hidden={!canEditSalesField('Print Actual Price on Invoice')}><span>Print Actual Price on Invoice</span><input type="checkbox" name="print_actual_price" checked={Boolean(saleForm.print_actual_price)} onChange={handleSaleChange} /></label>
                                    {saleForm.sale_mode === 'CASH' ? (
                                        <>
                                            <label className="field" hidden={!canEditSalesField('Purchase Price')}><span>Purchase Price</span><input type="number" min="0" step="0.01" value={actualVehiclePrice ?? 0} readOnly /></label>
                                            <label className="field" hidden={!canEditSalesField('Selling Price')}><span>Selling Price</span><input type="number" min="0" step="0.01" name="vehicle_price" value={saleForm.vehicle_price || ''} onChange={handleSaleChange} /></label>
                                        </>
                                    ) : (
                                        <>
                                            <label className="field" hidden={!canEditSalesField('Total Price')}>
                                                <span>Total Price</span>
                                                <input type="number" min="0" step="0.01" name="vehicle_price" value={saleForm.vehicle_price || ''} onChange={handleSaleChange} />
                                            </label>
                                            <label className="field" hidden={!canEditSalesField('Down Payment')}><span>Down Payment</span><input type="number" min="0" step="0.01" name="down_payment" value={saleForm.down_payment || ''} onChange={handleSaleChange} /></label>
                                            <label className="field" hidden={!canEditSalesField('Installment Method (Dropdown)')}>
                                                <span>Installment Method (Dropdown)</span>
                                                <select name="installment_calculation_method" value={saleForm.installment_calculation_method || 'MONTHLY_AMOUNT'} onChange={handleSaleChange}>
                                                    <option value="MONTHS">Auto</option>
                                                    <option value="MONTHLY_AMOUNT">Manual</option>
                                                </select>
                                            </label>
                                            <label className="field" hidden={!canEditSalesField('Monthly Installment')}><span>Monthly Installment</span><input type="number" min="0" step="0.01" name="monthly_installment" value={saleForm.monthly_installment || ''} onChange={handleSaleChange} readOnly={(saleForm.installment_calculation_method || 'MONTHLY_AMOUNT') !== 'MONTHLY_AMOUNT'} /></label>
                                            <label className="field" hidden={!canEditSalesField('Installment Months')}><span>Installment Months</span><input type="number" min="1" name="installment_months" value={saleForm.installment_months || ''} onChange={handleSaleChange} readOnly={(saleForm.installment_calculation_method || 'MONTHLY_AMOUNT') === 'MONTHLY_AMOUNT'} /></label>
                                            <label className="field" hidden={!canEditSalesField('Financed Amount')}><span>Financed Amount</span><input type="number" min="0" step="0.01" name="financed_amount" value={saleForm.financed_amount || ''} readOnly /></label>
                                            <label className="field" hidden={!canEditSalesField('Margin %')}>
                                                <span>Margin %</span>
                                                <input type="number" min="0" step="0.01" name="installment_margin_percent" value={saleForm.installment_margin_percent || ''} onChange={handleSaleChange} />
                                            </label>
                                            <label className="field" hidden={!canEditSalesField('Margin Value')}>
                                                <span>Margin Value</span>
                                                <input type="number" min="0" step="0.01" name="installment_margin_value" value={saleForm.installment_margin_value || ''} onChange={handleSaleChange} />
                                            </label>
                                            <label className="field" hidden={!canEditSalesField('Markup Percentage')}>
                                                <span>Markup Percentage</span>
                                                <input type="text" value={`${installmentMarkupPreview}%`} readOnly />
                                            </label>
                                        </>
                                    )}
                                    <div className="sales-witness-group full-span" hidden={!canEditSalesField('Witness 1 Data')}>
                                        <div className="sales-witness-group-header">
                                            <h4>Witness 1 Data</h4>
                                            <span>Required witness details</span>
                                        </div>
                                        <div className="form-grid sales-witness-grid">
                                            <label className="field"><span>Name</span><input name="witness_name" value={saleForm.witness_name || ''} onChange={handleSaleChange} /></label>
                                            <label className="field"><span>Father Name</span><input name="witness_father_name" value={saleForm.witness_father_name || ''} onChange={handleSaleChange} /></label>
                                            <label className="field"><span>CNIC</span><input name="witness_cnic" value={saleForm.witness_cnic || ''} onChange={handleSaleChange} /></label>
                                            <label className="field"><span>Mobile Number</span><input name="witness_mobile_number" value={saleForm.witness_mobile_number || ''} onChange={handleSaleChange} /></label>
                                            <label className="field full-span"><span>Address</span><textarea rows="2" name="witness_address" value={saleForm.witness_address || ''} onChange={handleSaleChange} /></label>
                                        </div>
                                    </div>
                                    <div className="sales-witness-group full-span" hidden={!canEditSalesField('Witness 2 Data')}>
                                        <div className="sales-witness-group-header">
                                            <h4>Witness 2 Data</h4>
                                            <span>Optional witness details</span>
                                        </div>
                                        <div className="form-grid sales-witness-grid">
                                            <label className="field"><span>Name</span><input name="witness_two_name" value={saleForm.witness_two_name || ''} onChange={handleSaleChange} /></label>
                                            <label className="field"><span>Father Name</span><input name="witness_two_father_name" value={saleForm.witness_two_father_name || ''} onChange={handleSaleChange} /></label>
                                            <label className="field"><span>CNIC</span><input name="witness_two_cnic" value={saleForm.witness_two_cnic || ''} onChange={handleSaleChange} /></label>
                                            <label className="field"><span>Mobile Number</span><input name="witness_two_mobile_number" value={saleForm.witness_two_mobile_number || ''} onChange={handleSaleChange} /></label>
                                            <label className="field full-span"><span>Address</span><textarea rows="2" name="witness_two_address" value={saleForm.witness_two_address || ''} onChange={handleSaleChange} /></label>
                                        </div>
                                    </div>
                                    <label className="field full-span" hidden={!canEditSalesField('Agreement PDF')}><span>Agreement PDF</span><input type="file" accept="application/pdf" onChange={handleAgreementUpload} /></label>
                                    <label className="field full-span" hidden={!canEditSalesField('Dealer Signature Upload')}><span>Dealer Signature Upload</span><input type="file" accept="image/*" onChange={handleSaleDealerSignatureUpload} disabled={saleFormReadOnly || savingSale} /></label>
                                    <label className="field full-span" hidden={!canEditSalesField('Authorized Signature Upload')}><span>Authorized Signature Upload</span><input type="file" accept="image/*,.pdf" onChange={(event) => handleSaleDocumentUpload(event, 'authorized_signature_url', 'Authorized signature', setUploadingSaleAuthorizedSignature)} disabled={saleFormReadOnly || savingSale} /></label>
                                    <label className="field full-span" hidden={!canEditSalesField('Bank Check Upload')}><span>Bank Check Upload</span><input type="file" accept="*/*" onChange={(event) => handleSaleDocumentUpload(event, 'bank_check_url', 'Bank check', setUploadingSaleBankCheck)} /></label>
                                    <label className="field full-span" hidden={!canEditSalesField('Misc Document Upload')}><span>Misc Document Upload</span><input type="file" accept="*/*" onChange={(event) => handleSaleDocumentUpload(event, 'misc_document_url', 'Misc document', setUploadingSaleMiscDocument)} /></label>
                                    <label className="field full-span" hidden={!canEditSalesField('Remarks')}><span>Remarks</span><textarea rows="4" name="remarks" value={saleForm.remarks || ''} onChange={handleSaleChange} /></label>
                                </div>

                                {saleForm.sale_mode === 'INSTALLMENT' && canViewSalesInstallmentPreview ? (
                                    <div className="scanner-box">
                                        <div className="section-header">
                                            <h3>Installment Page</h3>
                                            <span className="section-caption">Customer, vehicle, and purchase data stay visible while you build the installment plan.</span>
                                        </div>
                                        <div className="form-grid">
                                            <label className="field" hidden={!canEditSalesField('First Due Date')}><span>First Due Date</span><input type="date" name="first_due_date" value={saleForm.first_due_date || ''} onChange={handleSaleChange} /></label>
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
                                    <div><span className="meta-label">Customer Photo</span><p className="meta-value">{selectedSaleCustomerPassportPhotoUrl ? 'Ready' : 'Not uploaded'}</p></div>
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
                                    <div className="summary-witness-card full-span">
                                        <span className="meta-label">Witness 1</span>
                                        <div className="summary-witness-grid">
                                            <p><span>Name</span><strong>{saleForm.witness_name || 'Not set'}</strong></p>
                                            <p><span>Father Name</span><strong>{saleForm.witness_father_name || 'Not set'}</strong></p>
                                            <p><span>Mobile</span><strong>{saleForm.witness_mobile_number || 'Not set'}</strong></p>
                                            <p><span>CNIC</span><strong>{saleForm.witness_cnic || 'Not set'}</strong></p>
                                            <p className="summary-witness-address"><span>Address</span><strong>{saleForm.witness_address || 'Not set'}</strong></p>
                                        </div>
                                    </div>
                                    <div className="summary-witness-card full-span summary-witness-card-optional">
                                        <span className="meta-label">Witness 2</span>
                                        <div className="summary-witness-grid">
                                            <p><span>Name</span><strong>{saleForm.witness_two_name || 'Not set'}</strong></p>
                                            <p><span>Father Name</span><strong>{saleForm.witness_two_father_name || 'Not set'}</strong></p>
                                            <p><span>Mobile</span><strong>{saleForm.witness_two_mobile_number || 'Not set'}</strong></p>
                                            <p><span>CNIC</span><strong>{saleForm.witness_two_cnic || 'Not set'}</strong></p>
                                            <p className="summary-witness-address"><span>Address</span><strong>{saleForm.witness_two_address || 'Not set'}</strong></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-grid sale-document-grid">
                                    <div>
                                        <span className="meta-label">Dealer Signature</span>
                                        <div className="employee-document-preview">
                                            {renderAssetPreview(saleDealerSignatureUrl, 'Dealer signature not available.', 'Dealer Signature')}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="meta-label">Customer Photo</span>
                                        <div className="employee-document-preview">
                                            {renderAssetPreview(selectedSaleCustomerPassportPhotoUrl, 'Customer photo not available.', 'Customer Photo')}
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
                            <div className="section-header customer-registry-header">
                                <h3>Sales Transaction Register</h3>
                                <div className="customer-registry-search-area">
                                    <span className="customer-registry-search-label">Sales Register Search</span>
                                    <div className={`customer-registry-search-controls ${salesRegisterSearchOpen ? 'is-open' : ''}`}>
                                        <button
                                            type="button"
                                            className={`customer-registry-search-toggle ${salesRegisterSearchOpen ? 'is-active' : ''}`}
                                            onClick={() => setSalesRegisterSearchOpen((current) => !current)}
                                            aria-label="Search sales register"
                                            title="Search sales register"
                                        >
                                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M10.8 18.1a7.3 7.3 0 1 1 5.1-2.1l4 4a1.2 1.2 0 0 1-1.7 1.7l-4-4a7.2 7.2 0 0 1-3.4.4Zm0-2.4a4.9 4.9 0 1 0 0-9.8 4.9 4.9 0 0 0 0 9.8Z" />
                                            </svg>
                                        </button>
                                        {salesRegisterSearchOpen ? (
                                            <>
                                                <input
                                                    type="search"
                                                    value={salesRegisterSearch}
                                                    onChange={(event) => setSalesRegisterSearch(event.target.value)}
                                                    placeholder={`Live search by ${salesRegisterSearchFieldLabel}`}
                                                    autoFocus
                                                />
                                                <select
                                                    value={salesRegisterSearchField}
                                                    onChange={(event) => {
                                                        setSalesRegisterSearchField(event.target.value);
                                                        setSalesRegisterSearch('');
                                                    }}
                                                >
                                                    {salesRegisterSearchFields.map((field) => (
                                                        <option key={field.value} value={field.value}>{field.label}</option>
                                                    ))}
                                                </select>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                                <span className="section-caption">{salesRegisterRows.length} shown of {filteredSalesRegisterRows.length} sales</span>
                            </div>
                            {filteredSalesRegisterRows.length === 0 ? (
                                renderEmptyState(salesRegisterSearch ? 'No sales transactions match the selected register search.' : 'No vehicle sales transactions have been created yet.')
                            ) : (
                                <>
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
                                            {salesRegisterRows.map((sale) => {
                                                const summary = summarizeSaleInstallments(sale);
                                                const isInstallmentSale = String(sale.sale_mode || '').toUpperCase() === 'INSTALLMENT';
                                                const hasReceivedInstallment = isInstallmentSale && summary.actualReceivedCount > 0;
                                                const isViewing = transactionActionState.saleId === sale.id && transactionActionState.action === 'view';
                                                const isPrinting = transactionActionState.saleId === sale.id && transactionActionState.action === 'print';
                                                const isRoutingInstallment = transactionActionState.saleId === sale.id && transactionActionState.action === 'installments';
                                                const canUpdateSaleRecord = canUpdateSalesRegister
                                                    && canViewSalesAgreementForm
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
                                                            {[sale.witness_name, sale.witness_father_name, sale.witness_mobile_number, sale.witness_cnic].filter(Boolean).join(' / ') || 'No witness'}
                                                            <br />
                                                            {[sale.witness_two_name, sale.witness_two_father_name, sale.witness_two_mobile_number, sale.witness_two_cnic].filter(Boolean).join(' / ') || 'No second witness'}
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
                                                                {canUpdateSaleRecord ? (
                                                                    <button
                                                                        type="button"
                                                                        className="icon-action-btn"
                                                                        onClick={() => handleEditSale(sale)}
                                                                        title="Update sale"
                                                                        aria-label="Update sale"
                                                                    >
                                                                        {tableActionIcons.edit}
                                                                        <span>Update</span>
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
                                {filteredSalesRegisterRows.length > 5 ? (
                                    <div className="inline-actions spaced-top">
                                        <button
                                            type="button"
                                            className="view-btn"
                                            onClick={() => setSalesRegisterOpen((current) => !current)}
                                        >
                                            {salesRegisterOpen ? 'View less' : 'View more'}
                                        </button>
                                    </div>
                                ) : null}
                                </>
                            )}
                        </div>
                        ) : null}
                    </>
                );

}
