import { useEffect, useMemo, useRef, useState } from 'react';

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
    renderEmptyState,
    saleMessage,
    selectedInstallmentAuthorizedSignaturePath,
    selectedInstallmentCnicFrontPath,
    selectedInstallmentCustomerPhotoUrl,
    selectedInstallmentImageUrl,
    selectedInstallmentSale,
    selectedInstallmentSignaturePath,
    selectedInstallmentThumbUrl,
    setSelectedInstallmentSaleId,
    visibleSelectedInstallmentRows,
  } = ctx;

  const installmentDropdownRef = useRef(null);
  const [isInstallmentSaleDropdownOpen, setIsInstallmentSaleDropdownOpen] = useState(false);
  const [isInstallmentAdvancedSearchOpen, setIsInstallmentAdvancedSearchOpen] = useState(false);
  const [installmentSaleSearch, setInstallmentSaleSearch] = useState('');
  const [installmentSaleSearchField, setInstallmentSaleSearchField] = useState('customer_name');

  const installmentSaleSearchFields = [
    { value: 'customer_name', label: 'Customer Name' },
    { value: 'registration_number', label: 'Registration' },
    { value: 'engine_number', label: 'Engine' },
    { value: 'chassis_number', label: 'Chassis' },
    { value: 'cnic_passport_number', label: 'Customer CNIC' },
    { value: 'customer_mobile', label: 'Customer Mobile Number' },
  ];
  const normalizeSearchValue = (value) => String(value || '').trim().toLowerCase();
  const getCustomerMobile = (sale) => (
    sale.customer_mobile_number
    || sale.customer_contact_phone
    || sale.contact_phone
    || sale.customer_ocr_details?.contact_phone
    || sale.customer_ocr_details?.contactPhone
    || ''
  );
  const getInstallmentSaleSearchValue = (sale, field) => {
    if (field === 'customer_mobile') return getCustomerMobile(sale);
    return sale[field] || '';
  };
  const getInstallmentSalePickerLabel = (sale) => [
    sale.customer_name,
    [sale.brand, sale.model].filter(Boolean).join(' '),
    sale.agreement_number ? `Agreement ${sale.agreement_number}` : '',
    sale.cnic_passport_number,
    sale.dealer_name || 'No dealer',
  ].filter(Boolean).join(' - ');
  const selectedInstallmentSaleSearchFieldLabel = installmentSaleSearchFields.find((field) => field.value === installmentSaleSearchField)?.label || 'Customer Name';
  const filteredInstallmentSales = useMemo(() => {
    const term = normalizeSearchValue(installmentSaleSearch);
    if (!term) return installmentSales;

    const startsWithMatches = [];
    const containsMatches = [];
    installmentSales.forEach((sale) => {
      const fieldValue = normalizeSearchValue(getInstallmentSaleSearchValue(sale, installmentSaleSearchField));
      const labelValue = normalizeSearchValue(getInstallmentSalePickerLabel(sale));
      if (fieldValue.startsWith(term) || labelValue.startsWith(term)) {
        startsWithMatches.push(sale);
      } else if (fieldValue.includes(term) || labelValue.includes(term)) {
        containsMatches.push(sale);
      }
    });

    return [...startsWithMatches, ...containsMatches];
  }, [installmentSales, installmentSaleSearch, installmentSaleSearchField]);
  const selectedInstallmentSalePickerLabel = selectedInstallmentSale
    ? getInstallmentSalePickerLabel(selectedInstallmentSale)
    : '';
  const handleInstallmentSaleSelect = (saleId) => {
    setSelectedInstallmentSaleId(saleId);
    setInstallmentSaleSearch('');
    setIsInstallmentAdvancedSearchOpen(false);
    setIsInstallmentSaleDropdownOpen(false);
  };
  useEffect(() => {
    const handleInstallmentDropdownPointerDown = (event) => {
      if (installmentDropdownRef.current && !installmentDropdownRef.current.contains(event.target)) {
        setIsInstallmentSaleDropdownOpen(false);
        setIsInstallmentAdvancedSearchOpen(false);
        setInstallmentSaleSearch('');
      }
    };

    document.addEventListener('mousedown', handleInstallmentDropdownPointerDown);
    return () => document.removeEventListener('mousedown', handleInstallmentDropdownPointerDown);
  }, []);

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
                                        <>
                                            <img
                                                src={selectedInstallmentImageUrl}
                                                alt={`${selectedInstallmentSale.brand} ${selectedInstallmentSale.model}`}
                                                className="installment-hero-image"
                                                onError={(event) => {
                                                    event.currentTarget.hidden = true;
                                                    const fallback = event.currentTarget.nextElementSibling;
                                                    if (fallback) fallback.hidden = false;
                                                }}
                                            />
                                            <div className="installment-hero-image fallback" hidden>Vehicle image not available</div>
                                        </>
                                    ) : (
                                        <div className="installment-hero-image fallback">No vehicle image</div>
                                    )}
                                    <div className="installment-customer-photo-card" aria-label="Customer Photo">
                                        {selectedInstallmentCustomerPhotoUrl ? (
                                            <img src={selectedInstallmentCustomerPhotoUrl} alt="Customer" />
                                        ) : (
                                            <span>No photo</span>
                                        )}
                                    </div>
                                </div>
                                <div className="installment-hero-content">
                                    <div className="section-header installment-profile-header">
                                        <h3>{selectedInstallmentSale.brand} {selectedInstallmentSale.model}</h3>
                                        <div className="installment-header-tools">
                                            <div className="inline-actions">
                                                <div className="installment-sale-combobox no-print" ref={installmentDropdownRef}>
                                                    <button
                                                        type="button"
                                                        className="installment-sale-combobox-trigger"
                                                        onClick={() => setIsInstallmentSaleDropdownOpen((current) => !current)}
                                                        aria-expanded={isInstallmentSaleDropdownOpen}
                                                    >
                                                        <span>{selectedInstallmentSalePickerLabel || 'Select installment sale'}</span>
                                                        <span className="installment-sale-combobox-caret">v</span>
                                                    </button>
                                                    {isInstallmentSaleDropdownOpen ? (
                                                        <div className="installment-sale-dropdown-panel">
                                                            <div className={`installment-sale-search-row ${isInstallmentAdvancedSearchOpen ? 'is-advanced' : 'is-basic'}`}>
                                                                <button
                                                                    type="button"
                                                                    className={`installment-sale-search-toggle ${isInstallmentAdvancedSearchOpen ? 'is-active' : ''}`}
                                                                    onClick={() => setIsInstallmentAdvancedSearchOpen((current) => !current)}
                                                                    aria-label="Show installment search fields"
                                                                    title="Search fields"
                                                                >
                                                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                                                        <path d="M10.8 18.1a7.3 7.3 0 1 1 5.1-2.1l4 4a1.2 1.2 0 0 1-1.7 1.7l-4-4a7.2 7.2 0 0 1-3.4.4Zm0-2.4a4.9 4.9 0 1 0 0-9.8 4.9 4.9 0 0 0 0 9.8Z" />
                                                                    </svg>
                                                                </button>
                                                                <input
                                                                    type="search"
                                                                    value={installmentSaleSearch}
                                                                    onChange={(event) => setInstallmentSaleSearch(event.target.value)}
                                                                    placeholder={`Live search by ${selectedInstallmentSaleSearchFieldLabel}`}
                                                                    autoFocus
                                                                />
                                                                {isInstallmentAdvancedSearchOpen ? (
                                                                    <select
                                                                        value={installmentSaleSearchField}
                                                                        onChange={(event) => {
                                                                            setInstallmentSaleSearchField(event.target.value);
                                                                            setInstallmentSaleSearch('');
                                                                        }}
                                                                    >
                                                                        {installmentSaleSearchFields.map((field) => (
                                                                            <option key={field.value} value={field.value}>{field.label}</option>
                                                                        ))}
                                                                    </select>
                                                                ) : null}
                                                            </div>
                                                            <div className="installment-sale-options">
                                                                {filteredInstallmentSales.length === 0 ? (
                                                                    <div className="installment-sale-empty">No installment sale found.</div>
                                                                ) : (
                                                                    filteredInstallmentSales.map((sale) => (
                                                                        <button
                                                                            type="button"
                                                                            key={sale.id}
                                                                            className={`installment-sale-option ${sale.id === selectedInstallmentSale?.id ? 'is-selected' : ''}`}
                                                                            onClick={() => handleInstallmentSaleSelect(sale.id)}
                                                                        >
                                                                            <strong>{sale.customer_name || 'Customer'}</strong>
                                                                            <span>{[sale.registration_number, sale.engine_number, sale.chassis_number].filter(Boolean).join(' / ') || `${sale.brand || ''} ${sale.model || ''}`.trim() || 'Vehicle details not set'}</span>
                                                                            <small>{sale.cnic_passport_number || 'No CNIC'}{getCustomerMobile(sale) ? ` - ${getCustomerMobile(sale)}` : ''}</small>
                                                                        </button>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <button type="button" className="primary-btn no-print" onClick={handlePrintInvoice}>
                                                    Print Invoice
                                                </button>
                                            </div>
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
                            <div className="metric-card"><label>Received Months</label><div className="value success">{installmentSummary.receivedMonthLabel || `${installmentSummary.receivedCount} / ${selectedInstallmentSale.installment_months || 0}`}</div></div>
                            <div className="metric-card"><label>Pending Installments</label><div className="value warning">{installmentSummary.pendingCount}</div></div>
                            <div className="metric-card"><label>Received Cash</label><div className="value success">{formatCurrency(installmentSummary.receivedAmount)}</div></div>
                            <div className="metric-card">
                                <label>Total Remaining</label>
                                <div className="value warning">{formatCurrency(installmentSummary.totalRemainingAmount)}</div>
                                <div className="meta-inline">From total price balance</div>
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
