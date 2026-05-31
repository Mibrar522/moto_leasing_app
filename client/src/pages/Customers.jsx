import { useMemo, useState } from 'react';

export default function Customers({ ctx }) {
  const {
    buildAssetUrl,
    canEditCustomerFingerprintFields,
    canEditCustomerOcrFields,
    canProcessCustomerOcr,
    canScanCustomerFingerprint,
    canDeleteCustomerRecord,
    canEditCustomerDealerDropdown,
    canEditCustomerField,
    canEditCustomerRecord,
    canManageCustomers,
    canOpenCustomers,
    canUnlockCustomerOwnership,
    canUseOcr,
    canViewCustomerFingerprint,
    canViewCustomerForm,
    canViewCustomerRecord,
    canViewCustomerRegister,
    customerDealerOptions,
    customerForm,
    customerMessage,
    customerOwnershipCandidates,
    filteredCustomers,
    getStatusClass,
    handleCaptureFingerprint,
    handleCustomerAssetUpload,
    handleCustomerChange,
    handleCustomerSubmit,
    handleDeleteCustomer,
    handleEditCustomer,
    handleProcessOcr,
    isPreviewableImage,
    isPreviewablePdf,
    isSuperAdmin,
    renderEmptyState,
    resetCustomerForm,
    savingCustomer,
    selectedCustomer,
    setSelectedCustomerId,
    uploadingCustomerAsset,
    user,
  } = ctx;

  const [customerRegisterOpen, setCustomerRegisterOpen] = useState(false);
  const [customerWorkspaceOpen, setCustomerWorkspaceOpen] = useState(false);
  const [customerRegistrySearchOpen, setCustomerRegistrySearchOpen] = useState(false);
  const [customerRegistrySearch, setCustomerRegistrySearch] = useState('');
  const [customerRegistrySearchField, setCustomerRegistrySearchField] = useState('full_name');
  const customerRegistrySearchFields = [
    { value: 'full_name', label: 'Name' },
    { value: 'cnic_passport_number', label: 'CNIC' },
    { value: 'mobile_number', label: 'Mobile Number' },
  ];
  const normalizeRegistrySearch = (value) => String(value || '').trim().toLowerCase();
  const getCustomerRegistrySearchValue = (customer, field) => {
    const ocrDetails = customer.ocr_details || {};
    if (field === 'mobile_number') {
      return customer.contact_phone || ocrDetails.contact_phone || '';
    }
    return customer[field] || '';
  };
  const customerRegistrySearchFieldLabel = customerRegistrySearchFields.find((field) => field.value === customerRegistrySearchField)?.label || 'Name';
  const customerRegistryFilteredCustomers = useMemo(() => {
    const term = normalizeRegistrySearch(customerRegistrySearch);
    if (!term) return filteredCustomers;

    const startsWithMatches = [];
    const containsMatches = [];
    filteredCustomers.forEach((customer) => {
      const fieldValue = normalizeRegistrySearch(getCustomerRegistrySearchValue(customer, customerRegistrySearchField));
      const combinedValue = normalizeRegistrySearch([
        customer.full_name,
        customer.cnic_passport_number,
        customer.contact_phone,
        customer.ocr_details?.contact_phone,
      ].filter(Boolean).join(' '));

      if (fieldValue.startsWith(term) || combinedValue.startsWith(term)) {
        startsWithMatches.push(customer);
      } else if (fieldValue.includes(term) || combinedValue.includes(term)) {
        containsMatches.push(customer);
      }
    });

    return [...startsWithMatches, ...containsMatches];
  }, [customerRegistrySearch, customerRegistrySearchField, filteredCustomers]);
  const customerRegisterRows = customerRegisterOpen ? customerRegistryFilteredCustomers : customerRegistryFilteredCustomers.slice(0, 5);

  const openNewCustomerWorkspace = () => {
    resetCustomerForm();
    setSelectedCustomerId('');
    setCustomerWorkspaceOpen(true);
  };

  const openCustomerViewWorkspace = (customer) => {
    setSelectedCustomerId(customer.id);
    setCustomerWorkspaceOpen(true);
  };

  const openCustomerEditWorkspace = (customer) => {
    setSelectedCustomerId(customer.id);
    handleEditCustomer(customer);
    setCustomerWorkspaceOpen(true);
  };

  const getCustomerCreatedByLabel = (customer = {}) => {
    const isCurrentUserCreator =
      customer.created_by_agent &&
      user?.id &&
      String(customer.created_by_agent) === String(user.id);
    const isCurrentUserApplicationAdmin = String(user?.role_name || '').toUpperCase() === 'APPLICATION_ADMIN';

    if (isCurrentUserCreator && isCurrentUserApplicationAdmin) {
      return user?.dealer_name || customer.dealer_name || user?.full_name || customer.created_by_name || user?.email || customer.created_by_email || 'Not set';
    }

    if (isCurrentUserCreator) {
      return user?.full_name || customer.created_by_name || user?.email || customer.created_by_email || 'Not set';
    }

    return customer.created_by_name || customer.dealer_name || customer.created_by_email || 'Not set';
  };

  const showCustomerCnicFront = canEditCustomerField('CNIC Front Upload');
  const showCustomerCnicBack = canEditCustomerField('CNIC Back Upload');
  const showCustomerOcrExtractedName = canEditCustomerOcrFields && canEditCustomerField('OCR Extracted Name');
  const showCustomerOcrScanText = canEditCustomerOcrFields && canEditCustomerField('OCR Scan Text');
  const showCustomerFingerprintScannerOutput = canEditCustomerFingerprintFields && canEditCustomerField('Fingerprint Scanner Output');
  const showCustomerScannerDevice = canEditCustomerFingerprintFields && canEditCustomerField('Scanner Device');
  const showCustomerScanQuality = canEditCustomerFingerprintFields && canEditCustomerField('Scan Quality');
  const showCustomerFingerprintStatus = canEditCustomerFingerprintFields && canEditCustomerField('Fingerprint Status');
  const showCustomerBiometricHash = canEditCustomerFingerprintFields && canEditCustomerField('Biometric Hash');
  const showCustomerThumbUpload = canEditCustomerFingerprintFields && canEditCustomerField('Thumb Upload');
  const showCustomerSignatureUpload = canEditCustomerField('Signature Upload');
  const showCustomerPassportPhoto = true;
  const toDateInputValue = (value = '') => {
    const normalized = String(value || '').trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized;

    const dotted = normalized.match(/^(\d{2})[./-](\d{2})[./-](\d{4})$/);
    if (dotted) return `${dotted[3]}-${dotted[2]}-${dotted[1]}`;

    return '';
  };
  const toGenderSelectValue = (value = '') => {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'm' || normalized === 'male') return 'Male';
    if (normalized === 'f' || normalized === 'female') return 'Female';
    if (normalized === 'other') return 'Other';
    return '';
  };
  const customerDocumentIsCnic = String(customerForm.document_type || '').toUpperCase() === 'CNIC';
  const customerIdentityPattern = customerDocumentIsCnic
    ? '\\d{5}-\\d{7}-\\d{1}'
    : '[A-Za-z0-9][A-Za-z0-9-]{4,19}';
  const customerIdentityTitle = customerDocumentIsCnic
    ? 'CNIC must use dashed format: 12345-1234567-1'
    : 'Passport number must be 5 to 20 letters, numbers, or dashes.';
  const customerIdentityPlaceholder = customerDocumentIsCnic
    ? '12345-1234567-1'
    : 'Passport number';

  const getLiveCustomerValue = (field, fallback = '') => {
    const formValue = customerForm[field];
    if (formValue !== undefined && formValue !== null && String(formValue).trim() !== '') {
      return formValue;
    }
    return selectedCustomer?.[field] || fallback;
  };

  const renderLiveDocumentPreview = (url, label, emptyLabel) => (
    <div className="employee-document-preview">
      {url ? (
        isPreviewableImage(url) ? (
          <img src={buildAssetUrl(url)} alt={label} className="employee-document-image" />
        ) : isPreviewablePdf(url) ? (
          <iframe src={buildAssetUrl(url)} title={label} className="employee-document-frame" />
        ) : (
          <a href={buildAssetUrl(url)} target="_blank" rel="noreferrer" className="view-btn">
            Open {label}
          </a>
        )
      ) : (
        <div className="employee-document-empty">{emptyLabel}</div>
      )}
    </div>
  );

  const renderCustomerLivePreview = () => {
    const selectedOcrDetails = selectedCustomer?.ocr_details || {};
    const selectedFingerprint = selectedOcrDetails.fingerprint || {};
    const liveFingerprint = {
      status: getLiveCustomerValue('fingerprint_status', selectedFingerprint.status || 'NOT_CAPTURED'),
      device: getLiveCustomerValue('fingerprint_device', selectedFingerprint.device || ''),
      quality: getLiveCustomerValue('fingerprint_quality', selectedFingerprint.quality || ''),
      thumb_image_url: getLiveCustomerValue('fingerprint_thumb_url', selectedFingerprint.thumb_image_url || ''),
    };
    const liveCustomer = {
      full_name: getLiveCustomerValue('full_name'),
      father_name: getLiveCustomerValue('father_name', selectedOcrDetails.father_name || ''),
      date_of_birth: toDateInputValue(getLiveCustomerValue('date_of_birth', selectedOcrDetails.date_of_birth || '')),
      gender: toGenderSelectValue(getLiveCustomerValue('gender', selectedOcrDetails.gender || '')),
      document_type: getLiveCustomerValue('document_type', selectedOcrDetails.document_type || 'CNIC'),
      cnic_passport_number: getLiveCustomerValue('cnic_passport_number'),
      contact_email: getLiveCustomerValue('contact_email', selectedOcrDetails.contact_email || ''),
      contact_phone: getLiveCustomerValue('contact_phone', selectedOcrDetails.contact_phone || ''),
      country: getLiveCustomerValue('country', selectedOcrDetails.country || ''),
      address: getLiveCustomerValue('address', selectedOcrDetails.address || ''),
      extracted_name: getLiveCustomerValue('extracted_name', selectedOcrDetails.extracted_name || ''),
      raw_ocr_text: getLiveCustomerValue('raw_ocr_text', selectedOcrDetails.raw_ocr_text || ''),
      biometric_hash: getLiveCustomerValue('biometric_hash', selectedCustomer?.biometric_hash || ''),
      identity_doc_url: getLiveCustomerValue('identity_doc_url', selectedCustomer?.identity_doc_url || ''),
      identity_doc_back_url: getLiveCustomerValue('identity_doc_back_url', selectedOcrDetails.identity_doc_back_url || ''),
      passport_photo_url: getLiveCustomerValue('passport_photo_url', selectedOcrDetails.passport_photo_url || selectedCustomer?.passport_photo_url || ''),
      signature_image_url: getLiveCustomerValue('signature_image_url', selectedOcrDetails.signature_image_url || selectedCustomer?.signature_image_url || ''),
    };
    const hasAnyLiveData = [
      liveCustomer.full_name,
      liveCustomer.cnic_passport_number,
      liveCustomer.identity_doc_url,
      liveCustomer.identity_doc_back_url,
      liveCustomer.passport_photo_url,
      liveCustomer.signature_image_url,
      liveCustomer.raw_ocr_text,
      liveCustomer.biometric_hash,
      liveFingerprint.thumb_image_url,
    ].some(Boolean);

    return (
      <aside className="sales-live-summary customer-live-summary">
        <div className="sales-live-summary-head">
          <span>Live customer preview</span>
          <strong>{liveCustomer.full_name || selectedCustomer?.full_name || 'Customer intake preview'}</strong>
        </div>

        {!hasAnyLiveData ? (
          <div className="employee-document-empty">Start typing or upload documents to build the customer preview.</div>
        ) : null}

        <div className="detail-grid sales-live-summary-grid">
          <div>
            <span className="meta-label">Full Name</span>
            <p className="meta-value">{liveCustomer.full_name || 'Not set'}</p>
          </div>
          <div>
            <span className="meta-label">Father Name</span>
            <p className="meta-value">{liveCustomer.father_name || 'Not set'}</p>
          </div>
          <div>
            <span className="meta-label">Date Of Birth</span>
            <p className="meta-value">{liveCustomer.date_of_birth || 'Not set'}</p>
          </div>
          <div>
            <span className="meta-label">Gender</span>
            <p className="meta-value">{liveCustomer.gender || 'Not set'}</p>
          </div>
          <div>
            <span className="meta-label">Document Type</span>
            <p className="meta-value">{liveCustomer.document_type || 'Not set'}</p>
          </div>
          <div>
            <span className="meta-label">CNIC / Passport</span>
            <p className="meta-value">{liveCustomer.cnic_passport_number || 'Not set'}</p>
          </div>
          <div>
            <span className="meta-label">Contact Email</span>
            <p className="meta-value">{liveCustomer.contact_email || 'Not set'}</p>
          </div>
          <div>
            <span className="meta-label">Contact Phone</span>
            <p className="meta-value">{liveCustomer.contact_phone || 'Not set'}</p>
          </div>
          <div>
            <span className="meta-label">Country</span>
            <p className="meta-value">{liveCustomer.country || 'Not set'}</p>
          </div>
          <div>
            <span className="meta-label">Assigned Dealer</span>
            <p className="meta-value">{selectedCustomer?.dealer_name || user?.dealer_name || 'Current dealer'}</p>
          </div>
          <div className="full-span">
            <span className="meta-label">Address</span>
            <p className="meta-value">{liveCustomer.address || 'Not set'}</p>
          </div>
        </div>

        <div className="feature-list">
          <span className="feature-pill">{liveCustomer.raw_ocr_text ? 'OCR Ready' : 'OCR Pending'}</span>
          <span className="feature-pill">{liveCustomer.identity_doc_url ? 'CNIC Front Ready' : 'CNIC Front Missing'}</span>
          <span className="feature-pill">{liveCustomer.identity_doc_back_url ? 'CNIC Back Ready' : 'CNIC Back Missing'}</span>
          <span className="feature-pill">{liveCustomer.passport_photo_url ? 'Photo Ready' : 'Photo Missing'}</span>
          <span className="feature-pill">{liveCustomer.signature_image_url ? 'Signature Ready' : 'Signature Missing'}</span>
          <span className="feature-pill">{liveCustomer.biometric_hash || liveFingerprint.thumb_image_url ? 'Fingerprint Ready' : 'Fingerprint Pending'}</span>
        </div>

        <div className="detail-grid sales-live-documents">
          <div className="full-span">
            <span className="meta-label">OCR Extracted Name</span>
            <p className="meta-value">{liveCustomer.extracted_name || 'Not extracted yet'}</p>
          </div>
          <div>
            <span className="meta-label">CNIC Front Preview</span>
            {renderLiveDocumentPreview(liveCustomer.identity_doc_url, 'CNIC Front', 'No CNIC front uploaded')}
          </div>
          <div>
            <span className="meta-label">CNIC Back Preview</span>
            {renderLiveDocumentPreview(liveCustomer.identity_doc_back_url, 'CNIC Back', 'No CNIC back uploaded')}
          </div>
          <div>
            <span className="meta-label">Customer Photo</span>
            {renderLiveDocumentPreview(liveCustomer.passport_photo_url, 'Customer Photo', 'No customer photo uploaded')}
          </div>
          <div>
            <span className="meta-label">Signature Preview</span>
            {renderLiveDocumentPreview(liveCustomer.signature_image_url, 'Signature', 'No signature uploaded')}
          </div>
          <div>
            <span className="meta-label">Thumb Preview</span>
            {renderLiveDocumentPreview(liveFingerprint.thumb_image_url, 'Thumb Preview', 'No thumb image uploaded')}
          </div>
          <div>
            <span className="meta-label">Fingerprint Status</span>
            <p className="meta-value">{liveFingerprint.status || 'NOT_CAPTURED'}</p>
          </div>
          <div>
            <span className="meta-label">Scanner Device</span>
            <p className="meta-value">{liveFingerprint.device || 'Not recorded'}</p>
          </div>
          <div>
            <span className="meta-label">Scan Quality</span>
            <p className="meta-value">{liveFingerprint.quality || 'Not recorded'}</p>
          </div>
          <div className="full-span">
            <span className="meta-label">OCR Text</span>
            <pre className="scan-box">{liveCustomer.raw_ocr_text || 'No OCR text captured yet.'}</pre>
          </div>
          <div className="full-span">
            <span className="meta-label">Biometric Hash</span>
            <pre className="scan-box">{liveCustomer.biometric_hash || 'No fingerprint hash stored yet.'}</pre>
          </div>
        </div>
      </aside>
    );
  };

if (!canOpenCustomers) {
                    return <div className="feedback-card error">Your account does not have customer onboarding access.</div>;
                }
                return (
                    <>
                        <div className="page-heading">
                            <h1>Customers</h1>
                            <p>Create, update, delete, view, and enrich customer profiles with OCR and fingerprint intake metadata.</p>
                        </div>

                        {canViewCustomerForm ? (
                        <div className="sales-workspace-actions customer-workspace-actions">
                            <button type="button" className="sales-workspace-action-card" onClick={openNewCustomerWorkspace}>
                                <span>Customer intake</span>
                                <strong>Create or update customer profile</strong>
                            </button>
                        </div>
                        ) : null}

                        {customerWorkspaceOpen ? (
                        <div className="receive-modal-backdrop sales-modal-backdrop customer-modal-backdrop" role="presentation">
                            <div className="receive-modal sales-workspace-modal customer-workspace-modal" role="dialog" aria-modal="true" aria-label="Customer profile workspace">
                                <div className="section-header customer-workspace-modal-header">
                                    <h3>{customerForm.id ? 'Update Customer Profile' : 'Customer Profile Creation'}</h3>
                                    <div className="inline-actions">
                                        {canViewCustomerForm ? (
                                            <button type="button" className="view-btn" onClick={resetCustomerForm}>
                                                Clear
                                            </button>
                                        ) : null}
                                        <button type="button" className="view-btn" onClick={() => setCustomerWorkspaceOpen(false)}>
                                            Close
                                        </button>
                                        {canViewCustomerForm ? (
                                            <button type="submit" form="customer-intake-form" className="primary-btn" disabled={savingCustomer}>
                                                {savingCustomer ? 'Saving...' : customerForm.id ? 'Update Customer' : 'Create Customer'}
                                            </button>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="customers-grid customer-modal-grid">
                            {canViewCustomerForm ? (
                            <form id="customer-intake-form" className="table-card customer-form-card" onSubmit={handleCustomerSubmit}>
                                <div className="section-header">
                                    <h3>{customerForm.id ? 'Update Customer' : 'New Customer Intake'}</h3>
                                </div>

                                {customerForm.id ? (
                                    <div className="notice-banner">
                                        {canUnlockCustomerOwnership
                                            ? 'Customer ownership is locked by default after creation. You have unlock permission, but ownership changes should stay exceptional for security and tracking.'
                                            : 'Customer ownership is locked after creation. Assigned dealer and created by stay fixed for security and tracking.'}
                                    </div>
                                ) : (
                                    <div className="notice-banner">
                                        {canUnlockCustomerOwnership
                                            ? 'Your account can set assigned dealer and created by during new customer creation because the ownership unlock feature is enabled.'
                                            : 'Assigned dealer and created by are preset and locked on new customer creation for security. Enable the unlock feature if you need to change them.'}
                                    </div>
                                )}

                                {customerMessage ? <div className="notice-banner">{customerMessage}</div> : null}

                                <div className="form-grid">
                                    <label className="field" hidden={!canEditCustomerField('Assigned Dealer')}>
                                        <span>Assigned Dealer</span>
                                        {canUnlockCustomerOwnership && canEditCustomerDealerDropdown && canEditCustomerField('Assigned Dealer') ? (
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
                                    <label className="field" hidden={!canEditCustomerField('Created By')}>
                                        <span>Created By</span>
                                        {canUnlockCustomerOwnership && canEditCustomerField('Created By') ? (
                                            <select name="created_by_agent" value={customerForm.created_by_agent} onChange={handleCustomerChange}>
                                                <option value="">Select owner</option>
                                                {customerOwnershipCandidates.map((staff) => (
                                                    <option key={`customer-owner-${staff.id}`} value={staff.id}>
                                                        {staff.full_name} {staff.job_title ? `- ${staff.job_title}` : ''} {staff.dealer_name ? `(${staff.dealer_name})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                value={customerForm.id ? getCustomerCreatedByLabel(selectedCustomer) : (String(user?.role_name || '').toUpperCase() === 'APPLICATION_ADMIN' ? (user?.dealer_name || user?.full_name || 'Current user') : (user?.full_name || 'Current user'))}
                                                disabled
                                            />
                                        )}
                                    </label>
                                    <label className="field" hidden={!canEditCustomerField('Full Name')}>
                                        <span>Full Name</span>
                                        <input name="full_name" value={customerForm.full_name} onChange={handleCustomerChange} placeholder="Customer legal name" />
                                    </label>
                                    <label className="field" hidden={!canEditCustomerField('Father Name')}>
                                        <span>Father Name</span>
                                        <input name="father_name" value={customerForm.father_name} onChange={handleCustomerChange} placeholder="Father name from CNIC" />
                                    </label>
                                    <label className="field" hidden={!canEditCustomerField('Date Of Birth')}>
                                        <span>Date Of Birth</span>
                                        <input type="date" name="date_of_birth" value={toDateInputValue(customerForm.date_of_birth)} onChange={handleCustomerChange} />
                                    </label>
                                    <label className="field" hidden={!canEditCustomerField('Gender')}>
                                        <span>Gender</span>
                                        <select name="gender" value={toGenderSelectValue(customerForm.gender)} onChange={handleCustomerChange}>
                                            <option value="">Select gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </label>
                                    <label className="field" hidden={!canEditCustomerField('Document Type')}>
                                        <span>Document Type</span>
                                        <select name="document_type" value={customerForm.document_type} onChange={handleCustomerChange}>
                                            <option value="CNIC">CNIC</option>
                                            <option value="PASSPORT">Passport</option>
                                        </select>
                                    </label>
                                    <label className="field" hidden={!canEditCustomerField('CNIC / Passport Number')}>
                                        <span>CNIC / Passport Number</span>
                                        <input
                                            name="cnic_passport_number"
                                            value={customerForm.cnic_passport_number}
                                            onChange={handleCustomerChange}
                                            placeholder={customerIdentityPlaceholder}
                                            pattern={customerIdentityPattern}
                                            title={customerIdentityTitle}
                                            maxLength={customerDocumentIsCnic ? 15 : 20}
                                        />
                                    </label>
                                    {showCustomerCnicFront ? (
                                    <>
                                    <label className="field">
                                        <span>CNIC Front Upload</span>
                                        <input type="file" accept="*/*" onChange={(event) => handleCustomerAssetUpload(event, 'identity_doc_url', 'CNIC front', 'CNIC_FRONT')} disabled={uploadingCustomerAsset} />
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
                                    </>
                                    ) : null}
                                    {showCustomerCnicBack ? (
                                    <>
                                    <label className="field">
                                        <span>CNIC Back Upload</span>
                                        <input type="file" accept="*/*" onChange={(event) => handleCustomerAssetUpload(event, 'identity_doc_back_url', 'CNIC back', 'CNIC_BACK')} disabled={uploadingCustomerAsset} />
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
                                    </>
                                    ) : null}
                                    {showCustomerPassportPhoto ? (
                                    <>
                                    <label className="field">
                                        <span>Customer Photo</span>
                                        <input type="file" accept="image/*" onChange={(event) => handleCustomerAssetUpload(event, 'passport_photo_url', 'Passport size photo', 'PASSPORT_PHOTO')} disabled={uploadingCustomerAsset} />
                                    </label>
                                    <div className="field full-span">
                                        <span className="meta-label">Customer Photo Preview</span>
                                        <div className="employee-document-preview">
                                            {customerForm.passport_photo_url ? (
                                                <img
                                                    src={buildAssetUrl(customerForm.passport_photo_url)}
                                                    alt="Customer photo"
                                                    className="employee-document-image"
                                                />
                                            ) : (
                                                <div className="employee-document-empty">No customer photo uploaded</div>
                                            )}
                                        </div>
                                    </div>
                                    </>
                                    ) : null}
                                    <label className="field" hidden={!canEditCustomerField('Contact Email')}>
                                        <span>Contact Email</span>
                                        <input name="contact_email" value={customerForm.contact_email} onChange={handleCustomerChange} placeholder="customer@example.com" />
                                    </label>
                                    <label className="field" hidden={!canEditCustomerField('Contact Phone')}>
                                        <span>Contact Phone</span>
                                        <input name="contact_phone" value={customerForm.contact_phone} onChange={handleCustomerChange} placeholder="+966..." />
                                    </label>
                                    <label className="field" hidden={!canEditCustomerField('Country')}>
                                        <span>Country</span>
                                        <input name="country" value={customerForm.country} onChange={handleCustomerChange} placeholder="Pakistan" />
                                    </label>
                                    <label className="field full-span" hidden={!canEditCustomerField('Address')}>
                                        <span>Address</span>
                                        <textarea name="address" value={customerForm.address} onChange={handleCustomerChange} rows="3" placeholder="Customer address from CNIC or entered manually" />
                                    </label>
                                    {showCustomerOcrExtractedName ? (
                                    <label className="field full-span">
                                        <span>OCR Extracted Name</span>
                                        <input name="extracted_name" value={customerForm.extracted_name} onChange={handleCustomerChange} placeholder="Autofilled from OCR or entered manually" />
                                    </label>
                                    ) : null}
                                    {showCustomerOcrScanText ? (
                                    <label className="field full-span">
                                        <span>OCR Scan Text</span>
                                        <textarea name="raw_ocr_text" value={customerForm.raw_ocr_text} onChange={handleCustomerChange} rows="7" placeholder="Paste OCR text from the CNIC image here, then click Process OCR." />
                                    </label>
                                    ) : null}
                                </div>
                                {canProcessCustomerOcr ? (
                                <div className="inline-actions spaced-top">
                                    <button type="button" className="secondary-btn" onClick={handleProcessOcr}>
                                        Process OCR
                                    </button>
                                </div>
                                ) : null}

                                {canViewCustomerFingerprint ? (
                                <div className="scanner-box">
                                    <div className="section-header">
                                        <h3>Fingerprint Intake</h3>
                                    {canScanCustomerFingerprint ? (
                                    <button type="button" className="secondary-btn" onClick={handleCaptureFingerprint} disabled={uploadingCustomerAsset}>
                                        {uploadingCustomerAsset ? 'Scanning...' : 'Scan Thumb Device'}
                                    </button>
                                    ) : null}
                                    </div>

                                    <div className="form-grid">
                                        <label className="field full-span" hidden={!canEditCustomerFingerprintFields || !canEditCustomerField('Fingerprint Scanner Output')}>
                                        <span>Fingerprint Scanner Output</span>
                                            <textarea name="fingerprint_seed" value={customerForm.fingerprint_seed} onChange={handleCustomerChange} rows="4" placeholder="Filled from the thumb device automatically, or paste enrollment seed here as a fallback." />
                                        </label>
                                        <label className="field" hidden={!canEditCustomerFingerprintFields || !canEditCustomerField('Scanner Device')}>
                                        <span>Scanner Device</span>
                                            <input name="fingerprint_device" value={customerForm.fingerprint_device} onChange={handleCustomerChange} placeholder="SecuGen / Mantra / Digital Persona" />
                                        </label>
                                        <label className="field" hidden={!canEditCustomerFingerprintFields || !canEditCustomerField('Scan Quality')}>
                                        <span>Scan Quality</span>
                                            <input name="fingerprint_quality" value={customerForm.fingerprint_quality} onChange={handleCustomerChange} placeholder="HIGH / MEDIUM / LOW" />
                                        </label>
                                        <label className="field" hidden={!canEditCustomerFingerprintFields || !canEditCustomerField('Fingerprint Status')}>
                                        <span>Fingerprint Status</span>
                                            <select name="fingerprint_status" value={customerForm.fingerprint_status} onChange={handleCustomerChange}>
                                                <option value="NOT_CAPTURED">Not Captured</option>
                                                <option value="PENDING">Pending</option>
                                                <option value="ENROLLED">Enrolled</option>
                                            </select>
                                        </label>
                                        <label className="field full-span" hidden={!canEditCustomerFingerprintFields || !canEditCustomerField('Biometric Hash')}>
                                        <span>Biometric Hash</span>
                                            <textarea name="biometric_hash" value={customerForm.biometric_hash} onChange={handleCustomerChange} rows="3" placeholder="Generated fingerprint hash appears here" />
                                        </label>
                                        <label className="field full-span" hidden={!canEditCustomerFingerprintFields || !canEditCustomerField('Thumb Upload')}>
                                        <span>Thumb Upload</span>
                                            <input type="file" accept="image/*" onChange={(event) => handleCustomerAssetUpload(event, 'fingerprint_thumb_url', 'Thumb image', 'THUMB')} disabled={!canEditCustomerFingerprintFields || uploadingCustomerAsset} />
                                        </label>
                                        <div className="field full-span" hidden={!canEditCustomerFingerprintFields || !canEditCustomerField('Thumb Upload')}>
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
                                        <label className="field full-span" hidden={!canEditCustomerField('Signature Upload')}>
                                        <span>Signature Upload</span>
                                            <input type="file" accept="image/*" onChange={(event) => handleCustomerAssetUpload(event, 'signature_image_url', 'Signature', 'SIGNATURE')} disabled={!canViewCustomerForm || uploadingCustomerAsset} />
                                        </label>
                                        <div className="field full-span" hidden={!canEditCustomerField('Signature Upload')}>
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

                            {renderCustomerLivePreview()}
                        </div>
                            </div>
                        </div>
                        ) : null}

                        {canViewCustomerRegister ? (
                        <div className="table-card">
                            <div className="section-header customer-registry-header">
                                <h3>Customer Registry</h3>
                                <div className="customer-registry-search-area">
                                    <span className="customer-registry-search-label">Customer Registry Search</span>
                                    <div className={`customer-registry-search-controls ${customerRegistrySearchOpen ? 'is-open' : ''}`}>
                                        <button
                                            type="button"
                                            className={`customer-registry-search-toggle ${customerRegistrySearchOpen ? 'is-active' : ''}`}
                                            onClick={() => setCustomerRegistrySearchOpen((current) => !current)}
                                            aria-label="Search customer registry"
                                            title="Search customer registry"
                                        >
                                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M10.8 18.1a7.3 7.3 0 1 1 5.1-2.1l4 4a1.2 1.2 0 0 1-1.7 1.7l-4-4a7.2 7.2 0 0 1-3.4.4Zm0-2.4a4.9 4.9 0 1 0 0-9.8 4.9 4.9 0 0 0 0 9.8Z" />
                                            </svg>
                                        </button>
                                        {customerRegistrySearchOpen ? (
                                            <>
                                                <input
                                                    type="search"
                                                    value={customerRegistrySearch}
                                                    onChange={(event) => setCustomerRegistrySearch(event.target.value)}
                                                    placeholder={`Live search by ${customerRegistrySearchFieldLabel}`}
                                                    autoFocus
                                                />
                                                <select
                                                    value={customerRegistrySearchField}
                                                    onChange={(event) => {
                                                        setCustomerRegistrySearchField(event.target.value);
                                                        setCustomerRegistrySearch('');
                                                    }}
                                                >
                                                    {customerRegistrySearchFields.map((field) => (
                                                        <option key={field.value} value={field.value}>{field.label}</option>
                                                    ))}
                                                </select>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                                <span className="section-caption">{customerRegisterRows.length} shown of {customerRegistryFilteredCustomers.length} customers</span>
                            </div>

                            {customerRegistryFilteredCustomers.length === 0 ? (
                                renderEmptyState(customerRegistrySearch ? 'No customers match the selected registry search.' : 'No customers found yet. Create the first customer intake record above.')
                            ) : (
                                <>
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
                                            <th>Created By</th>
                                            <th>OCR</th>
                                            <th>Fingerprint</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerRegisterRows.map((customer) => {
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
                                                        {getCustomerCreatedByLabel(customer)}
                                                        {customer.dealer_name ? (
                                                            <>
                                                                <br />
                                                                <span className="meta-inline">{customer.dealer_name}</span>
                                                            </>
                                                        ) : null}
                                                    </td>
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
                                                                <button type="button" className="view-btn" onClick={() => openCustomerViewWorkspace(customer)}>View</button>
                                                            ) : null}
                                                            {canEditCustomerRecord ? (
                                                                <button type="button" className="view-btn" onClick={() => openCustomerEditWorkspace(customer)}>Edit</button>
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
                                {customerRegistryFilteredCustomers.length > 5 ? (
                                    <div className="inline-actions spaced-top">
                                        <button
                                            type="button"
                                            className="view-btn"
                                            onClick={() => setCustomerRegisterOpen((current) => !current)}
                                        >
                                            {customerRegisterOpen ? 'View less' : 'View more'}
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
