export default function AccessControl({
  canManageAccess,
  accessMessage,
  dashboardData,
  savingAccess,
  handleSaveRolePermissions,
  ACCESS_PAGE_GROUPS,
  getUniqueFeatures,
  featureByKey,
  roleAssignments,
  openAccessPopup,
}) {
  return (
    <>
      <div className="page-heading">
        <h1>Roles and Features</h1>
        <p>Only the super admin can assign role permissions and control which features managers and employees can use.</p>
      </div>

      {!canManageAccess ? (
        <div className="feedback-card error">Only the super admin can manage access control.</div>
      ) : null}

      {accessMessage ? <div className="notice-banner">{accessMessage}</div> : null}

      <div className="access-role-grid">
        {(dashboardData.roles || []).map((role) => (
          <div key={role.id} className="table-card">
            <div className="section-header">
              <h3>{role.role_name}</h3>
              <button
                type="button"
                className="primary-btn"
                disabled={!canManageAccess || savingAccess}
                onClick={() => handleSaveRolePermissions(role.id)}
              >
                {savingAccess ? 'Saving...' : 'Save Role'}
              </button>
            </div>
            <p className="section-caption">Open a page to enable or disable its available functions for this role.</p>
            <div className="access-page-grid">
              {ACCESS_PAGE_GROUPS.map((group) => {
                const availableFeatures = getUniqueFeatures(
                  group.featureKeys
                    .map((featureKey) => featureByKey[featureKey])
                    .filter(Boolean)
                );
                const enabledCount = availableFeatures.filter((feature) => (roleAssignments[role.id] || []).includes(Number(feature.id))).length;

                return (
                  <button
                    key={`${role.id}-${group.key}`}
                    type="button"
                    className="access-page-card"
                    onClick={() => openAccessPopup(role.id, group.key)}
                    disabled={!canManageAccess || availableFeatures.length === 0}
                  >
                    <span className="access-page-title">{group.label}</span>
                    <span className="access-page-meta">{enabledCount} / {availableFeatures.length} enabled</span>
                    <span className="access-page-description">{group.description}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
