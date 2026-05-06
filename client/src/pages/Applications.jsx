export default function Applications({
  canViewApplications,
  adMessage,
  canManageAds,
  handleAdSubmit,
  adForm,
  handleAdChange,
  handleAdUpload,
  resetAdForm,
  savingAd,
  adPreviewUrl,
  applicationAds,
  dashboardData,
  buildAssetUrl,
  handleAdEdit,
  handleAdDelete,
  canViewApplicationsList,
  filteredApplications,
  renderEmptyState,
  getVisibleRows,
  getStatusClass,
  formatCurrency,
  renderTableLimitControl,
}) {
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
