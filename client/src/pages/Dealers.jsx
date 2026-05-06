export default function Dealers({
  canManageDealers,
  canViewDealerForm,
  handleDealerSubmit,
  dealerForm,
  resetDealerForm,
  savingDealer,
  dealerMessage,
  handleDealerChange,
  handleDealerLogoUpload,
  handleDealerSignatureUpload,
  renderAssetPreview,
  dashboardThemes,
  dealerCountryOptions,
  dashboardData,
  setDealerForm,
  canViewDealerSummary,
  canViewDealerDirectory,
  filteredDealers,
  renderEmptyState,
  buildAssetUrl,
  getStatusClass,
  handleEditDealer,
  handleDeleteDealer,
}) {
  return (
    <>
      <div className="page-heading">
        <h1>Dealer Applications</h1>
        <p>Create a fresh dealer profile with its own branding, country-aware contact details, and currency setup.</p>
      </div>

      {!canManageDealers ? (
        <div className="feedback-card error">Only the super admin can create and configure dealer applications.</div>
      ) : null}

      <div className="customers-grid">
        {canViewDealerForm ? (
        <form className="table-card customer-form-card" onSubmit={handleDealerSubmit}>
          <div className="section-header">
            <h3>{dealerForm.id ? 'Edit Dealer' : 'New Dealer'}</h3>
            <div className="inline-actions">
              {dealerForm.id ? (
                <button type="button" className="view-btn" onClick={resetDealerForm}>
                  Cancel Edit
                </button>
              ) : null}
              <button type="submit" className="primary-btn" disabled={!canManageDealers || savingDealer}>
                {savingDealer ? 'Saving...' : dealerForm.id ? 'Update Dealer' : 'Create Dealer'}
              </button>
            </div>
          </div>
          {dealerMessage ? <div className="notice-banner">{dealerMessage}</div> : null}
          <div className="form-grid">
            <label className="field"><span>Dealer Name</span><input name="dealer_name" value={dealerForm.dealer_name} onChange={handleDealerChange} /></label>
            <label className="field"><span>Dealer CNIC</span><input name="dealer_cnic" value={dealerForm.dealer_cnic} onChange={handleDealerChange} /></label>
            <label className="field full-span"><span>Dealer Address</span><textarea rows="3" name="dealer_address" value={dealerForm.dealer_address} onChange={handleDealerChange} /></label>
            <label className="field full-span"><span>Dealer Logo</span><input type="file" accept="image/*" onChange={handleDealerLogoUpload} /></label>
            <label className="field full-span"><span>Uploaded Logo URL</span><input name="dealer_logo_url" value={dealerForm.dealer_logo_url} onChange={handleDealerChange} readOnly /></label>
            <label className="field full-span"><span>Dealer Signature Image</span><input type="file" accept="image/*" onChange={handleDealerSignatureUpload} required={!dealerForm.id && !dealerForm.dealer_signature_url} /></label>
            <label className="field full-span"><span>Uploaded Signature URL</span><input name="dealer_signature_url" value={dealerForm.dealer_signature_url} onChange={handleDealerChange} readOnly /></label>
            <div className="field full-span">
              <span>Signature Preview</span>
              {renderAssetPreview(dealerForm.dealer_signature_url, 'Upload dealer signature to continue onboarding.', 'Dealer Signature')}
            </div>
            <label className="field"><span>Application Theme</span><select name="theme_key" value={dealerForm.theme_key} onChange={handleDealerChange}>{dashboardThemes.map((theme) => <option key={theme.key} value={theme.key}>{theme.label}</option>)}</select></label>
            <label className="field"><span>Mobile Country</span><select name="mobile_country" value={dealerForm.mobile_country} onChange={handleDealerChange}>{dealerCountryOptions.map((country) => <option key={country.value} value={country.value}>{country.label}</option>)}</select></label>
            <label className="field"><span>Country Code</span><input name="mobile_country_code" value={dealerForm.mobile_country_code} readOnly /></label>
            <label className="field"><span>Mobile Number</span><input name="mobile_number" value={dealerForm.mobile_number} onChange={handleDealerChange} placeholder="Example: 30000000" /></label>
            <label className="field"><span>Currency</span><select name="currency_code" value={dealerForm.currency_code} onChange={handleDealerChange}><option value="QAR">QAR</option><option value="PKR">PKR</option><option value="SAR">SAR</option><option value="AED">AED</option><option value="USD">USD</option></select></label>
            <label className="field"><span>Contact Email</span><input name="contact_email" value={dealerForm.contact_email} onChange={handleDealerChange} type="email" /></label>
            <label className="field"><span>Dealer Admin Name</span><input name="admin_full_name" value={dealerForm.admin_full_name} onChange={handleDealerChange} /></label>
            <label className="field"><span>Dealer Admin Email</span><input name="admin_email" value={dealerForm.admin_email} onChange={handleDealerChange} type="email" /></label>
            <label className="field">
              <span>Dealer Admin Role</span>
              <select name="admin_role_id" value={dealerForm.admin_role_id} onChange={handleDealerChange}>
                {(dashboardData.roles || []).filter((role) => role.role_name !== 'SUPER_ADMIN').map((role) => (
                  <option key={`dealer-admin-role-${role.id}`} value={role.id}>{role.role_name}</option>
                ))}
              </select>
            </label>
            <label className="field"><span>Dealer Admin Password</span><input name="admin_password" value={dealerForm.admin_password} onChange={handleDealerChange} type="password" /></label>
            <label className="field full-span"><span>Backup Directory</span><input name="backup_directory" value={dealerForm.backup_directory} onChange={handleDealerChange} placeholder="Example: C:\\Backups\\Dealers (leave blank for server default)" /></label>
            <label className="field">
              <span>Dealer Status</span>
              <select name="is_active" value={String(dealerForm.is_active)} onChange={(event) => setDealerForm((current) => ({ ...current, is_active: event.target.value === 'true' }))}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
            <label className="field full-span"><span>Setup Notes</span><textarea rows="4" name="notes" value={dealerForm.notes} onChange={handleDealerChange} placeholder="Anything special for this dealer's new application setup..." /></label>
          </div>
        </form>
        ) : null}

        {canViewDealerSummary ? (
        <div className="table-card">
          <h3>Fresh Start Summary</h3>
          <div className="detail-grid">
            <div><span className="meta-label">Platform Scope</span><p className="meta-value">Multi-dealer ready</p></div>
            <div><span className="meta-label">Selected Country</span><p className="meta-value">{dealerCountryOptions.find((country) => country.value === dealerForm.mobile_country)?.label || dealerForm.mobile_country} ({dealerForm.mobile_country_code})</p></div>
            <div><span className="meta-label">Selected Theme</span><p className="meta-value">{dashboardThemes.find((theme) => theme.key === dealerForm.theme_key)?.label || 'Sandstone Pro'}</p></div>
            <div><span className="meta-label">New Dealer State</span><p className="meta-value">Fresh Start</p></div>
            <div><span className="meta-label">Data Baseline</span><p className="meta-value">0 customers, 0 employees, 0 products, 0 sales</p></div>
            <div><span className="meta-label">Provisioned Login</span><p className="meta-value">Application Admin</p></div>
            <div><span className="meta-label">Clone Setup</span><p className="meta-value">DB backup label + clone profile</p></div>
            <div><span className="meta-label">Backup Directory</span><p className="meta-value">{dealerForm.backup_directory.trim() || 'Server default backup folder'}</p></div>
          </div>
          <div className="feature-list spaced-top">
            <span className="feature-pill">Branding Ready</span>
            <span className="feature-pill">Theme Ready</span>
            <span className="feature-pill">Currency Ready</span>
            <span className="feature-pill">Dealer Profile Ready</span>
          </div>
          <p className="meta-inline">
            Each new dealer created here starts as a clean dealer profile so you can later attach its own users, products, customers, and transactions.
          </p>
        </div>
        ) : null}
      </div>

      {canViewDealerDirectory ? (
      <div className="table-card">
        <div className="section-header">
          <h3>Dealer Directory</h3>
          <span className="section-caption">{filteredDealers.length} dealer profiles</span>
        </div>
        {filteredDealers.length === 0 ? (
          renderEmptyState('No dealer applications have been created yet.')
        ) : (
          <table className="pro-table">
            <thead>
                <tr>
                    <th>Logo</th>
                    <th>Dealer</th>
                    <th>Contact</th>
                    <th>Currency</th>
                    <th>Theme</th>
                    <th>Application</th>
                    <th>App Status</th>
                    <th>Created By</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
              {filteredDealers.map((dealer) => (
                <tr key={dealer.id}>
                  <td>
                    {dealer.dealer_logo_url ? (
                      <img src={buildAssetUrl(dealer.dealer_logo_url)} alt={dealer.dealer_name} className="product-thumb" />
                    ) : (
                      <span className="feature-pill muted">No logo</span>
                    )}
                  </td>
                  <td>
                    {dealer.dealer_name}
                    <br />
                    {dealer.dealer_code}
                  </td>
                  <td>
                    {dealer.mobile_country_code} {dealer.mobile_number}
                    <br />
                    {dealer.dealer_cnic}
                  </td>
                  <td>{dealer.currency_code}</td>
                  <td>{dashboardThemes.find((theme) => theme.key === dealer.theme_key)?.label || 'Sandstone Pro'}</td>
                  <td>
                    {dealer.application_slug || 'Pending'}
                    <br />
                    {dealer.db_backup_label || 'No backup label'}
                  </td>
                  <td>
                    <span className={getStatusClass(dealer.is_active ? 'ACTIVE' : 'DRAFT')}>
                      {dealer.provisioning_status || dealer.app_status || 'FRESH_START'}
                    </span>
                    </td>
                    <td>{dealer.created_by_name || 'System'}</td>
                    <td>
                        <div className="table-actions">
                            <button type="button" className="view-btn" onClick={() => handleEditDealer(dealer)}>Edit</button>
                            <button type="button" className="danger-btn" onClick={() => handleDeleteDealer(dealer)}>Delete</button>
                        </div>
                    </td>
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
