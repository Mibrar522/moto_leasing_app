import { useState } from 'react';

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
  const [companyRegisterPage, setCompanyRegisterPage] = useState(1);
  const companyRegisterPageSize = 10;
  const companyRows = dashboardData.companies || [];
  const companyRegisterTotalPages = Math.max(1, Math.ceil(companyRows.length / companyRegisterPageSize));
  const safeCompanyRegisterPage = Math.min(companyRegisterPage, companyRegisterTotalPages);
  const companyRegisterStartIndex = (safeCompanyRegisterPage - 1) * companyRegisterPageSize;
  const companyRegisterRows = companyRows.slice(companyRegisterStartIndex, companyRegisterStartIndex + companyRegisterPageSize);
  const companyRegisterFirstRow = companyRows.length === 0 ? 0 : companyRegisterStartIndex + 1;
  const companyRegisterLastRow = Math.min(companyRegisterStartIndex + companyRegisterRows.length, companyRows.length);

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
          {companyRows.length === 0 ? renderEmptyState('No company profiles created yet.') : (
            <>
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
                  {companyRegisterRows.map((company) => (
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
              <div className="table-pagination">
                <span className="table-pagination-summary">
                  Showing {companyRegisterFirstRow}-{companyRegisterLastRow} of {companyRows.length} companies
                </span>
                <div className="table-pagination-actions">
                  <button type="button" className="view-btn" onClick={() => setCompanyRegisterPage(1)} disabled={safeCompanyRegisterPage === 1}>&lt;&lt; First</button>
                  <button type="button" className="view-btn" onClick={() => setCompanyRegisterPage((current) => Math.max(1, current - 1))} disabled={safeCompanyRegisterPage === 1}>&lt; Prev</button>
                  <span className="table-pagination-current">Page {safeCompanyRegisterPage} of {companyRegisterTotalPages}</span>
                  <button type="button" className="view-btn" onClick={() => setCompanyRegisterPage((current) => Math.min(companyRegisterTotalPages, current + 1))} disabled={safeCompanyRegisterPage === companyRegisterTotalPages}>Next &gt;</button>
                  <button type="button" className="view-btn" onClick={() => setCompanyRegisterPage(companyRegisterTotalPages)} disabled={safeCompanyRegisterPage === companyRegisterTotalPages}>Last &gt;&gt;</button>
                </div>
              </div>
            </>
          )}
        </div>
        ) : null}
      </div>
    </>
  );
}
