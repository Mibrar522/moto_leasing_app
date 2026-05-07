export default function Installments({ ctx }) {
  const {
    appBrandAddress,
    appBrandContact,
    appBrandName,
    canManageInstallments,
    canViewInstallmentCollection,
    canViewInstallmentOverview,
    formatCurrency,
    formatSaleDealerIdentity,
    getStatusClass,
    handleInstallmentReceiptInputChange,
    handlePrintInstallmentReceipt,
    handlePrintInvoice,
    handleReceiveInstallment,
    installmentReceiptInputs,
    installmentSales,
    installmentSummary,
    receivingInstallmentId,
    renderAssetPreview,
    renderEmptyState,
    saleMessage,
    selectedInstallmentAuthorizedSignaturePath,
    selectedInstallmentCnicFrontPath,
    selectedInstallmentImageUrl,
    selectedInstallmentSale,
    selectedInstallmentSignaturePath,
    selectedInstallmentThumbUrl,
    setSelectedInstallmentSaleId,
    visibleSelectedInstallmentRows,
  } = ctx;

if (!canManageInstallments) {
                    return <div className="feedback-card error">Your account does not have installment management access.</div>;
                }
                if (!selectedInstallmentSale) {
                    return (
                        <div className="feedback-card">No installment sales are available yet.</div>
                    );
                }

                return (
                    <>
                        {saleMessage ? <div className="notice-banner">{saleMessage}</div> : null}

                        {canViewInstallmentOverview ? (
                        <div className="table-card installment-hero-card">
                            <div className="installment-hero">
                                <div className="installment-hero-image-wrap">
                                    {selectedInstallmentImageUrl ? (
                                        <img
                                            src={selectedInstallmentImageUrl}
                                            alt={`${selectedInstallmentSale.brand} ${selectedInstallmentSale.model}`}
                                            className="installment-hero-image"
                                        />
                                    ) : (
                                        <div className="installment-hero-image fallback">No vehicle image</div>
                                    )}
                                </div>
                                <div className="installment-hero-content">
                                    <div className="section-header">
                                        <h3>{selectedInstallmentSale.brand} {selectedInstallmentSale.model}</h3>
                                        <div className="inline-actions">
                                            <select
                                                value={selectedInstallmentSale.id}
                                                onChange={(event) => setSelectedInstallmentSaleId(event.target.value)}
                                                className="installment-sale-picker no-print"
                                            >
                                                {installmentSales.map((sale) => (
                                                    <option key={sale.id} value={sale.id}>
                                                        {sale.customer_name} - {sale.brand} {sale.model} - {sale.dealer_name || 'No dealer'}
                                                    </option>
                                                ))}
                                            </select>
                                            <button type="button" className="primary-btn no-print" onClick={handlePrintInvoice}>
                                                Print Invoice
                                            </button>
                                        </div>
                                    </div>
                                    <div className="detail-grid">
                                        <div><span className="meta-label">Customer</span><p className="meta-value">{selectedInstallmentSale.customer_name}</p></div>
                                        <div><span className="meta-label">CNIC</span><p className="meta-value">{selectedInstallmentSale.cnic_passport_number}</p></div>
                                        <div><span className="meta-label">Dealer</span><p className="meta-value">{formatSaleDealerIdentity(selectedInstallmentSale)}</p></div>
                                        <div><span className="meta-label">Recorded By</span><p className="meta-value">{selectedInstallmentSale.agent_name || 'System'}</p></div>
                                        <div><span className="meta-label">Agreement</span><p className="meta-value">{selectedInstallmentSale.agreement_number || 'No agreement number'}</p></div>
                                        <div><span className="meta-label">Purchase Date</span><p className="meta-value">{selectedInstallmentSale.purchase_date}</p></div>
                                        <div><span className="meta-label">Vehicle Type</span><p className="meta-value">{selectedInstallmentSale.vehicle_type || 'Not set'}</p></div>
                                        <div><span className="meta-label">Registration</span><p className="meta-value">{selectedInstallmentSale.registration_number || 'Not set'}</p></div>
                                        <div><span className="meta-label">Chassis Number</span><p className="meta-value">{selectedInstallmentSale.chassis_number || 'Not set'}</p></div>
                                        <div><span className="meta-label">Engine Number</span><p className="meta-value">{selectedInstallmentSale.engine_number || 'Not set'}</p></div>
                                        <div><span className="meta-label">Total Price</span><p className="meta-value">{formatCurrency(selectedInstallmentSale.vehicle_price)}</p></div>
                                        <div><span className="meta-label">Down Payment</span><p className="meta-value">{formatCurrency(selectedInstallmentSale.down_payment)}</p></div>
                                        <div><span className="meta-label">Monthly Installment</span><p className="meta-value">{formatCurrency(selectedInstallmentSale.monthly_installment)}</p></div>
                                        <div><span className="meta-label">Months</span><p className="meta-value">{selectedInstallmentSale.installment_months || 0}</p></div>
                                        <div><span className="meta-label">Witness 1</span><p className="meta-value">{selectedInstallmentSale.witness_name || 'Not set'}{selectedInstallmentSale.witness_cnic ? ` / ${selectedInstallmentSale.witness_cnic}` : ''}</p></div>
                                        <div><span className="meta-label">Witness 2</span><p className="meta-value">{selectedInstallmentSale.witness_two_name || 'Not set'}{selectedInstallmentSale.witness_two_cnic ? ` / ${selectedInstallmentSale.witness_two_cnic}` : ''}</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ) : null}

                        {canViewInstallmentOverview ? (
                        <div className="metrics-grid">
                            <div className="metric-card"><label>Received Installments</label><div className="value success">{installmentSummary.receivedCount}</div></div>
                            <div className="metric-card"><label>Pending Installments</label><div className="value warning">{installmentSummary.pendingCount}</div></div>
                            <div className="metric-card"><label>Received Cash</label><div className="value success">{formatCurrency(installmentSummary.receivedAmount)}</div></div>
                            <div className="metric-card">
                                <label>Next Payment</label>
                                <div className="value warning">{formatCurrency(installmentSummary.nextPaymentAmount)}</div>
                                <div className="meta-inline">{installmentSummary.nextPaymentDate || 'No pending installment'}</div>
                            </div>
                            <div className="metric-card">
                                <label>Total Remaining</label>
                                <div className="value warning">{formatCurrency(installmentSummary.totalRemainingAmount)}</div>
                                <div className="meta-inline">From total price balance</div>
                            </div>
                        </div>
                        ) : null}

                            {canViewInstallmentOverview ? (
                            <div className="table-card print-invoice">
                                <div className="invoice-header">
                                    <div>
                                        <p className="invoice-kicker">{appBrandName} Invoice</p>
                                        <h2>Installment Transaction Statement</h2>
                                        <p className="invoice-subtitle">Vehicle sale, customer details, and full payment history.</p>
                                        <p className="invoice-subtitle">{appBrandAddress}</p>
                                        <p className="invoice-subtitle">{appBrandContact}</p>
                                    </div>
                                    <div className="invoice-meta">
                                        <div><span className="meta-label">Agreement No.</span><p className="meta-value">{selectedInstallmentSale.agreement_number || 'Not set'}</p></div>
                                    <div><span className="meta-label">Printed On</span><p className="meta-value">{new Date().toLocaleDateString('en-PK')}</p></div>
                                    <div><span className="meta-label">Status</span><p className="meta-value">{selectedInstallmentSale.status}</p></div>
                                </div>
                            </div>

                            <div className="invoice-hero">
                                <div className="invoice-image-wrap">
                                    {selectedInstallmentImageUrl ? (
                                        <img
                                            src={selectedInstallmentImageUrl}
                                            alt={`${selectedInstallmentSale.brand} ${selectedInstallmentSale.model}`}
                                            className="invoice-image"
                                        />
                                    ) : (
                                        <div className="invoice-image fallback">No vehicle image</div>
                                    )}
                                </div>
                                <div className="invoice-grid">
                                    <div><span className="meta-label">Customer</span><p className="meta-value">{selectedInstallmentSale.customer_name}</p></div>
                                    <div><span className="meta-label">Customer CNIC</span><p className="meta-value">{selectedInstallmentSale.cnic_passport_number}</p></div>
                                    <div><span className="meta-label">Dealer</span><p className="meta-value">{formatSaleDealerIdentity(selectedInstallmentSale)}</p></div>
                                    <div><span className="meta-label">Recorded By</span><p className="meta-value">{selectedInstallmentSale.agent_name || 'System'}</p></div>
                                    <div><span className="meta-label">Vehicle</span><p className="meta-value">{selectedInstallmentSale.brand} {selectedInstallmentSale.model}</p></div>
                                    <div><span className="meta-label">Registration</span><p className="meta-value">{selectedInstallmentSale.registration_number || 'Not set'}</p></div>
                                    <div><span className="meta-label">Vehicle Type</span><p className="meta-value">{selectedInstallmentSale.vehicle_type || 'Not set'}</p></div>
                                    <div><span className="meta-label">Purchase Date</span><p className="meta-value">{selectedInstallmentSale.purchase_date}</p></div>
                                    <div><span className="meta-label">Chassis Number</span><p className="meta-value">{selectedInstallmentSale.chassis_number || 'Not set'}</p></div>
                                    <div><span className="meta-label">Engine Number</span><p className="meta-value">{selectedInstallmentSale.engine_number || 'Not set'}</p></div>
                                    <div><span className="meta-label">Total Price</span><p className="meta-value">{formatCurrency(selectedInstallmentSale.vehicle_price)}</p></div>
                                    <div><span className="meta-label">Down Payment</span><p className="meta-value">{formatCurrency(selectedInstallmentSale.down_payment)}</p></div>
                                    <div><span className="meta-label">Monthly Installment</span><p className="meta-value">{formatCurrency(selectedInstallmentSale.monthly_installment)}</p></div>
                                    <div><span className="meta-label">Total Remaining</span><p className="meta-value">{formatCurrency(installmentSummary.totalRemainingAmount)}</p></div>
                                    <div><span className="meta-label">Witness 1</span><p className="meta-value">{selectedInstallmentSale.witness_name || 'Not set'}{selectedInstallmentSale.witness_cnic ? ` / ${selectedInstallmentSale.witness_cnic}` : ''}</p></div>
                                    <div><span className="meta-label">Witness 2</span><p className="meta-value">{selectedInstallmentSale.witness_two_name || 'Not set'}{selectedInstallmentSale.witness_two_cnic ? ` / ${selectedInstallmentSale.witness_two_cnic}` : ''}</p></div>
                                </div>
                            </div>

                            <div className="invoice-summary-strip">
                                <div className="invoice-stat"><span className="meta-label">Received Cash</span><strong>{formatCurrency(installmentSummary.receivedAmount)}</strong></div>
                                <div className="invoice-stat"><span className="meta-label">Next Payment</span><strong>{formatCurrency(installmentSummary.nextPaymentAmount)}</strong></div>
                                <div className="invoice-stat"><span className="meta-label">Next Due Date</span><strong>{installmentSummary.nextPaymentDate || 'No pending installment'}</strong></div>
                                <div className="invoice-stat"><span className="meta-label">Pending Installments</span><strong>{installmentSummary.pendingCount}</strong></div>
                            </div>

                            <div className="scan-preview">
                                <div>
                                    <span className="meta-label">Biometric Thumb</span>
                                    <div className="employee-document-preview">
                                        {selectedInstallmentThumbUrl ? (
                                            <img
                                                src={selectedInstallmentThumbUrl}
                                                alt="Biometric thumb"
                                                className="employee-document-image"
                                            />
                                        ) : (
                                            <div className="employee-document-empty">Thumb not attached</div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <span className="meta-label">Customer CNIC Front</span>
                                    <div className="employee-document-preview">
                                        {renderAssetPreview(selectedInstallmentCnicFrontPath, 'CNIC front not attached', 'Customer CNIC front')}
                                    </div>
                                </div>
                                <div>
                                    <span className="meta-label">Customer Signature</span>
                                    <div className="employee-document-preview">
                                        {renderAssetPreview(selectedInstallmentSignaturePath, 'Signature not attached', 'Customer signature')}
                                    </div>
                                </div>
                                <div>
                                    <span className="meta-label">Authorized Signature</span>
                                    <div className="employee-document-preview">
                                        {renderAssetPreview(selectedInstallmentAuthorizedSignaturePath, 'Authorized signatory', 'Authorized signature')}
                                    </div>
                                    <p className="meta-value" style={{ marginTop: '10px', textAlign: 'center', fontWeight: 700 }}>
                                        {selectedInstallmentSale.agent_name || 'Authorized Officer'}
                                    </p>
                                </div>
                            </div>

                        </div>
                            ) : null}

                        {canViewInstallmentCollection ? (
                        <div className="table-card">
                            <h3>Monthly Installment Collection</h3>
                            {visibleSelectedInstallmentRows.length === 0 ? (
                                renderEmptyState('No installment schedule has been generated for this sale yet.')
                            ) : (
                                <table className="pro-table">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Due Date</th>
                                            <th>Amount</th>
                                            <th>Received Cash</th>
                                            <th>Carry Forward</th>
                                            <th>Status</th>
                                            <th>Received Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleSelectedInstallmentRows.map((row) => {
                                            const normalizedStatus = String(row.status || '').toUpperCase();
                                            const isReceived = normalizedStatus === 'RECEIVED' || normalizedStatus === 'PARTIAL' || Number(row.received_amount || 0) > 0;
                                            const receiptInputValue = installmentReceiptInputs[row.id] ?? '';
                                            const previewBalanceAdjustment = receiptInputValue
                                                ? Number(row.amount || 0) - Number(receiptInputValue || 0)
                                                : Number(row.carry_forward_amount || 0);
                                            return (
                                                <tr key={row.id}>
                                                    <td>{row.installment_number}</td>
                                                    <td>{row.due_date}</td>
                                                    <td>{formatCurrency(row.amount)}</td>
                                                    <td>
                                                        {isReceived ? (
                                                            formatCurrency(row.received_amount)
                                                        ) : (
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                className="table-inline-input"
                                                                value={receiptInputValue}
                                                                onChange={(event) => handleInstallmentReceiptInputChange(row.id, event.target.value)}
                                                                placeholder={String(row.amount || '')}
                                                                disabled={receivingInstallmentId === row.id}
                                                            />
                                                        )}
                                                    </td>
                                                    <td>{formatCurrency(isReceived ? row.carry_forward_amount : previewBalanceAdjustment)}</td>
                                                    <td>
                                                        <span className={getStatusClass(row.status)}>
                                                            {isReceived ? '✓ Received' : String(row.status || 'Pending')}
                                                        </span>
                                                    </td>
                                                    <td>{row.paid_date || 'Not received yet'}</td>
                                                    <td>
                                                        <div className="inline-actions">
                                                            <button
                                                                type="button"
                                                                className="view-btn"
                                                                onClick={() => handlePrintInstallmentReceipt(row)}
                                                            >
                                                                Print
                                                            </button>
                                                            {isReceived ? (
                                                                <span className="feature-pill">Cash Received</span>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    className="primary-btn"
                                                                    onClick={() => handleReceiveInstallment(row)}
                                                                    disabled={receivingInstallmentId === row.id}
                                                                >
                                                                    {receivingInstallmentId === row.id ? 'Saving...' : receiptInputValue ? 'Receive Amount' : 'Receive Full'}
                                                                </button>
                                                            )}
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
