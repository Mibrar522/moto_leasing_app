export default function Customers({ ctx }) {
  const {
    buildAssetUrl,
    canCreateCustomerBiometric,
    canDeleteCustomerRecord,
    canEditCustomerDealerDropdown,
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
    renderCustomerDetails,
    renderEmptyState,
    resetCustomerForm,
    savingCustomer,
    selectedCustomer,
    setSelectedCustomerId,
    uploadingCustomerAsset,
    user,
  } = ctx;

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
                                        <button type="submit" className="primary-btn" disabled={savingCustomer}>
                                            {savingCustomer ? 'Saving...' : customerForm.id ? 'Update Customer' : 'Create Customer'}
                                        </button>
                                    </div>
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
                                            <input
                                                value={customerForm.id ? getCustomerCreatedByLabel(selectedCustomer) : (String(user?.role_name || '').toUpperCase() === 'APPLICATION_ADMIN' ? (user?.dealer_name || user?.full_name || 'Current user') : (user?.full_name || 'Current user'))}
                                                disabled
                                            />
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
                                        <input name="date_of_birth" value={customerForm.date_of_birth} onChange={handleCustomerChange} placeholder="16.06.1994" />
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
                                    <label className="field full-span">
                                        <span>OCR Scan Text</span>
                                        <textarea name="raw_ocr_text" value={customerForm.raw_ocr_text} onChange={handleCustomerChange} rows="7" placeholder="Paste OCR text from the CNIC image here, then click Process OCR." />
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
                                            <th>Created By</th>
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
