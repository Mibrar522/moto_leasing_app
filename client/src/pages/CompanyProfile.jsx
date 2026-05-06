export default function CompanyProfile({
  canManageStock,
  canViewCompanyForm,
  handleCompanySubmit,
  companyForm,
  resetCompanyForm,
  savingCompany,
  companyMessage,
  handleCompanyChange,
  canViewCompanyDirectory,
  dashboardData,
  renderEmptyState,
  handleEditCompany,
  handleDeleteCompany,
}) {
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
