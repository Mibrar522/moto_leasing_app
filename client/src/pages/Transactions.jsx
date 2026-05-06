export default function Transactions({ ctx }) {
  const {
    canManageSales,
    canViewTransactionRegister,
    formatCurrency,
    formatSaleAgentIdentity,
    formatSaleDealerIdentity,
    getStatusClass,
    handleOpenInstallmentPage,
    handlePrintTransaction,
    handleViewTransaction,
    renderEmptyState,
    setTransactionActionState,
    summarizeSaleInstallments,
    transactionActionState,
    transactionSales,
  } = ctx;

if (!canManageSales) {
                    return <div className="feedback-card error">Your account does not have sales transaction access.</div>;
                }

                return (
                    <>
                        <div className="page-heading">
                            <h1>Adhoc Sales</h1>
                            <p>See cash sales, print them, and review collected cash transactions.</p>
                        </div>

                        {canViewTransactionRegister ? (
                        <div className="table-card">
                            <h3>Cash Sales Register</h3>
                            {transactionSales.length === 0 ? (
                                renderEmptyState('No cash sales are available yet.')
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
