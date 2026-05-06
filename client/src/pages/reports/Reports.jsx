export default function Reports({ ctx }) {
  const {
    canManageSales,
    canManageStock,
    renderReportsSelector,
  } = ctx;

if (!canManageSales && !canManageStock) {
                    return <div className="feedback-card error">Your account does not have report access.</div>;
                }

                return renderReportsSelector();

}
