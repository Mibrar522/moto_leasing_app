export default function Transactions({ ctx }) {
  const {
    canManageSales,
    canViewTransactionRegister,
    formatCurrency,
    formatSaleAgentIdentity,
    formatSaleDealerIdentity,
    getStatusClass,
    handleCloseTransactionInvoice,
    handleOpenInstallmentPage,
    handlePrintTransaction,
    handleViewTransaction,
    renderEmptyState,
    setTransactionActionState,
    selectedTransactionSale,
    summarizeSaleInstallments,
    transactionActionState,
    transactionSales,
  } = ctx;
  const isInvoiceOpen = transactionActionState.action === 'view' && selectedTransactionSale;
  const selectedInvoiceSummary = isInvoiceOpen ? summarizeSaleInstallments(selectedTransactionSale) : null;
  const selectedInvoiceIsInstallment = isInvoiceOpen && String(selectedTransactionSale.sale_mode || '').toUpperCase() === 'INSTALLMENT';

if (!canManageSales) {
                    return <div className="feedback-card error">Your account does not have sales transaction access.</div>;
                }

                return (
                    <>
                        <div className="page-heading">
                            <h1>Adhoc Sales</h1>
                            <p>See cash and installment sales, print them, and review collected transaction snapshots.</p>
                        </div>

                        {canViewTransactionRegister ? (
                        <div className="table-card">
                            <h3>Sales Transaction Register</h3>
                            {transactionSales.length === 0 ? (
                                renderEmptyState('No sales transactions are available yet.')
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
                                                        {String(sale.sale_mode || '').toUpperCase() === 'INSTALLMENT' ? (
                                                            <>
                                                                <strong>{summary.actualReceivedCount}/{summary.totalPlannedMonths} received</strong>
                                                                <br />
                                                                {summary.pendingCount} pending
                                                                <br />
                                                                Remaining {formatCurrency(summary.totalRemainingAmount)}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <strong>Cash sale</strong>
                                                                <br />
                                                                Cash collected
                                                            </>
                                                        )}
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

                        {isInvoiceOpen ? (
                            <div className="receive-modal-backdrop no-print" role="dialog" aria-modal="true" aria-label="Transaction invoice">
                                <div className="receive-modal transaction-invoice-modal">
                                    <div className="section-header">
                                        <div>
                                            <h3>{selectedInvoiceIsInstallment ? 'Installment Invoice' : 'Cash Sale Invoice'}</h3>
                                            <p className="section-caption">
                                                {selectedTransactionSale.customer_name || 'Customer'} - {[selectedTransactionSale.brand, selectedTransactionSale.model].filter(Boolean).join(' ') || 'Vehicle'}
                                            </p>
                                        </div>
                                        <div className="inline-actions">
                                            <button type="button" className="view-btn" onClick={() => handlePrintTransaction(selectedTransactionSale)}>
                                                Print
                                            </button>
                                            <button type="button" className="secondary-btn" onClick={handleCloseTransactionInvoice}>
                                                Close
                                            </button>
                                        </div>
                                    </div>

                                    <div className="transaction-invoice-summary">
                                        <div><span className="meta-label">Customer</span><p className="meta-value">{selectedTransactionSale.customer_name || 'Not set'}</p></div>
                                        <div><span className="meta-label">CNIC</span><p className="meta-value">{selectedTransactionSale.cnic_passport_number || 'Not set'}</p></div>
                                        <div><span className="meta-label">Dealer / Agent</span><p className="meta-value">{formatSaleDealerIdentity(selectedTransactionSale)}<br />{formatSaleAgentIdentity(selectedTransactionSale)}</p></div>
                                        <div><span className="meta-label">Agreement</span><p className="meta-value">{selectedTransactionSale.agreement_number || 'No number'}</p></div>
                                        <div><span className="meta-label">Vehicle</span><p className="meta-value">{[selectedTransactionSale.brand, selectedTransactionSale.model].filter(Boolean).join(' ') || 'Not set'}</p></div>
                                        <div><span className="meta-label">Mode</span><p className="meta-value">{selectedTransactionSale.sale_mode || 'Not set'}</p></div>
                                        <div><span className="meta-label">Total Price</span><p className="meta-value">{formatCurrency(selectedTransactionSale.vehicle_price)}</p></div>
                                        <div><span className="meta-label">Status</span><p className="meta-value"><span className={getStatusClass(selectedTransactionSale.status)}>{selectedTransactionSale.status}</span></p></div>
                                    </div>

                                    <div className="metrics-grid transaction-invoice-metrics">
                                        <div className="metric-card"><label>Received</label><div className="value success">{formatCurrency(selectedInvoiceIsInstallment ? selectedInvoiceSummary.receivedAmount : selectedTransactionSale.vehicle_price || 0)}</div></div>
                                        <div className="metric-card"><label>Pending</label><div className="value warning">{formatCurrency(selectedInvoiceIsInstallment ? selectedInvoiceSummary.totalRemainingAmount : 0)}</div></div>
                                        <div className="metric-card"><label>Installments</label><div className="value">{selectedInvoiceIsInstallment ? `${selectedInvoiceSummary.actualReceivedCount}/${selectedInvoiceSummary.totalPlannedMonths}` : 'Cash'}</div></div>
                                    </div>

                                    {selectedInvoiceIsInstallment ? (
                                        <div className="table-scroll">
                                            <table className="pro-table">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Due Date</th>
                                                        <th>Amount</th>
                                                        <th>Received</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(selectedTransactionSale.installments || []).map((row) => (
                                                        <tr key={row.id}>
                                                            <td>{row.installment_number}</td>
                                                            <td>{row.due_date || 'Not set'}</td>
                                                            <td>{formatCurrency(row.amount)}</td>
                                                            <td>{formatCurrency(row.received_amount || 0)}</td>
                                                            <td><span className={getStatusClass(row.status)}>{row.status}</span></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}
                    </>
                );

}
