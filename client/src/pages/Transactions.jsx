import { useMemo, useState } from 'react';

const escapePrintText = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getInstallmentSortValue = (row) => {
    const installmentNumber = Number(row?.installment_number);
    if (Number.isFinite(installmentNumber) && installmentNumber > 0) {
        return installmentNumber;
    }

    const dueTime = row?.due_date ? new Date(row.due_date).getTime() : Number.NaN;
    return Number.isFinite(dueTime) ? dueTime : Number.MAX_SAFE_INTEGER;
};

const sortInstallmentRows = (rows = []) => [...rows].sort((a, b) => {
    const numberDiff = getInstallmentSortValue(a) - getInstallmentSortValue(b);
    if (numberDiff !== 0) return numberDiff;
    return String(a?.due_date || '').localeCompare(String(b?.due_date || ''));
});

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
  const [transactionRegisterSearchOpen, setTransactionRegisterSearchOpen] = useState(false);
  const [transactionRegisterSearch, setTransactionRegisterSearch] = useState('');
  const [transactionRegisterSearchField, setTransactionRegisterSearchField] = useState('customer_name');
  const transactionRegisterSearchFields = [
    { value: 'customer_name', label: 'Customer Name' },
    { value: 'customer_mobile', label: 'Mobile Number' },
    { value: 'cnic_passport_number', label: 'CNIC' },
    { value: 'chassis_number', label: 'Chassis' },
    { value: 'engine_number', label: 'Engine' },
    { value: 'registration_number', label: 'Registration' },
    { value: 'agreement_number', label: 'Agreement' },
  ];
  const normalizeTransactionRegisterSearch = (value) => String(value || '').trim().toLowerCase();
  const getTransactionCustomerMobile = (sale) => (
    sale.customer_mobile_number
    || sale.customer_contact_phone
    || sale.contact_phone
    || sale.customer_ocr_details?.contact_phone
    || sale.customer_ocr_details?.contactPhone
    || ''
  );
  const getTransactionRegisterSearchValue = (sale, field) => {
    if (field === 'customer_mobile') return getTransactionCustomerMobile(sale);
    return sale[field] || '';
  };
  const transactionRegisterSearchFieldLabel = transactionRegisterSearchFields.find((field) => field.value === transactionRegisterSearchField)?.label || 'Customer Name';
  const filteredTransactionSales = useMemo(() => {
    const term = normalizeTransactionRegisterSearch(transactionRegisterSearch);
    if (!term) return transactionSales;

    const startsWithMatches = [];
    const containsMatches = [];
    transactionSales.forEach((sale) => {
      const fieldValue = normalizeTransactionRegisterSearch(getTransactionRegisterSearchValue(sale, transactionRegisterSearchField));
      const combinedValue = normalizeTransactionRegisterSearch([
        sale.customer_name,
        getTransactionCustomerMobile(sale),
        sale.cnic_passport_number,
        sale.chassis_number,
        sale.engine_number,
        sale.registration_number,
        sale.brand,
        sale.model,
        sale.serial_number,
        sale.agreement_number,
        sale.sale_mode,
      ].filter(Boolean).join(' '));

      if (fieldValue.startsWith(term) || combinedValue.startsWith(term)) {
        startsWithMatches.push(sale);
      } else if (fieldValue.includes(term) || combinedValue.includes(term)) {
        containsMatches.push(sale);
      }
    });

    return [...startsWithMatches, ...containsMatches];
  }, [transactionRegisterSearch, transactionRegisterSearchField, transactionSales]);
  const isInvoiceOpen = transactionActionState.action === 'view' && selectedTransactionSale;
  const selectedInvoiceSummary = isInvoiceOpen ? summarizeSaleInstallments(selectedTransactionSale) : null;
  const selectedInvoiceIsInstallment = isInvoiceOpen && String(selectedTransactionSale.sale_mode || '').toUpperCase() === 'INSTALLMENT';
  const selectedInstallmentRows = selectedInvoiceIsInstallment ? sortInstallmentRows(selectedTransactionSale.installments || []) : [];

  const handlePrintInstallmentPreview = () => {
    if (!selectedInvoiceIsInstallment || !selectedTransactionSale) {
      handlePrintTransaction(selectedTransactionSale);
      return;
    }

    const printWindow = window.open('', '_blank', 'width=980,height=720');
    if (!printWindow) {
      handlePrintTransaction(selectedTransactionSale);
      return;
    }

    const rowsHtml = selectedInstallmentRows.map((row) => `
      <tr>
        <td>${escapePrintText(row.installment_number || '')}</td>
        <td>${escapePrintText(row.due_date || 'Not set')}</td>
        <td>${escapePrintText(formatCurrency(row.amount || 0))}</td>
        <td>${escapePrintText(formatCurrency(row.received_amount || 0))}</td>
        <td>${escapePrintText(row.status || 'Not set')}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Installment Invoice ${escapePrintText(selectedTransactionSale.agreement_number || '')}</title>
          <style>
            @page { size: A4; margin: 14mm; }
            * { box-sizing: border-box; }
            body { margin: 0; color: #17233d; font-family: Arial, sans-serif; font-size: 12px; }
            .page { width: 100%; }
            .header { display: flex; justify-content: space-between; gap: 16px; padding-bottom: 14px; border-bottom: 2px solid #dbe6f5; margin-bottom: 16px; }
            h1 { margin: 0 0 6px; font-size: 24px; }
            .subtitle { margin: 0; color: #65758f; }
            .meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
            .box { border: 1px solid #dbe2ee; border-radius: 8px; padding: 10px; min-height: 52px; }
            .label { display: block; color: #718096; font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 5px; }
            .value { font-weight: 700; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 9px 10px; border-bottom: 1px solid #e6edf6; text-align: left; }
            th { background: #f4f7fb; color: #66758f; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; }
            .totals { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 16px 0; }
            .footer { margin-top: 20px; color: #718096; font-size: 11px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <div>
                <h1>Installment Invoice</h1>
                <p class="subtitle">${escapePrintText(selectedTransactionSale.customer_name || 'Customer')} - ${escapePrintText([selectedTransactionSale.brand, selectedTransactionSale.model].filter(Boolean).join(' ') || 'Vehicle')}</p>
              </div>
              <div>
                <span class="label">Printed On</span>
                <div class="value">${escapePrintText(new Date().toLocaleDateString('en-PK'))}</div>
              </div>
            </div>
            <div class="meta">
              <div class="box"><span class="label">Customer</span><div class="value">${escapePrintText(selectedTransactionSale.customer_name || 'Not set')}</div></div>
              <div class="box"><span class="label">CNIC</span><div class="value">${escapePrintText(selectedTransactionSale.cnic_passport_number || 'Not set')}</div></div>
              <div class="box"><span class="label">Agreement</span><div class="value">${escapePrintText(selectedTransactionSale.agreement_number || 'No number')}</div></div>
              <div class="box"><span class="label">Vehicle</span><div class="value">${escapePrintText([selectedTransactionSale.brand, selectedTransactionSale.model].filter(Boolean).join(' ') || 'Not set')}</div></div>
            </div>
            <div class="totals">
              <div class="box"><span class="label">Received</span><div class="value">${escapePrintText(formatCurrency(selectedInvoiceSummary.receivedAmount))}</div></div>
              <div class="box"><span class="label">Pending</span><div class="value">${escapePrintText(formatCurrency(selectedInvoiceSummary.totalRemainingAmount))}</div></div>
              <div class="box"><span class="label">Installments</span><div class="value">${escapePrintText(`${selectedInvoiceSummary.actualReceivedCount}/${selectedInvoiceSummary.totalPlannedMonths}`)}</div></div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Due Date</th>
                  <th>Amount</th>
                  <th>Received</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${rowsHtml || '<tr><td colspan="5">No installments found.</td></tr>'}</tbody>
            </table>
            <p class="footer">Generated from the installment invoice preview.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

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
                            <div className="section-header customer-registry-header">
                                <h3>Sales Transaction Register</h3>
                                <div className="customer-registry-search-area">
                                    <span className="customer-registry-search-label">Sales Register Search</span>
                                    <div className={`customer-registry-search-controls ${transactionRegisterSearchOpen ? 'is-open' : ''}`}>
                                        <button
                                            type="button"
                                            className={`customer-registry-search-toggle ${transactionRegisterSearchOpen ? 'is-active' : ''}`}
                                            onClick={() => setTransactionRegisterSearchOpen((current) => !current)}
                                            aria-label="Search sales transaction register"
                                            title="Search sales transaction register"
                                        >
                                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M10.8 18.1a7.3 7.3 0 1 1 5.1-2.1l4 4a1.2 1.2 0 0 1-1.7 1.7l-4-4a7.2 7.2 0 0 1-3.4.4Zm0-2.4a4.9 4.9 0 1 0 0-9.8 4.9 4.9 0 0 0 0 9.8Z" />
                                            </svg>
                                        </button>
                                        {transactionRegisterSearchOpen ? (
                                            <>
                                                <input
                                                    type="search"
                                                    value={transactionRegisterSearch}
                                                    onChange={(event) => setTransactionRegisterSearch(event.target.value)}
                                                    placeholder={`Live search by ${transactionRegisterSearchFieldLabel}`}
                                                    autoFocus
                                                />
                                                <select
                                                    value={transactionRegisterSearchField}
                                                    onChange={(event) => {
                                                        setTransactionRegisterSearchField(event.target.value);
                                                        setTransactionRegisterSearch('');
                                                    }}
                                                >
                                                    {transactionRegisterSearchFields.map((field) => (
                                                        <option key={field.value} value={field.value}>{field.label}</option>
                                                    ))}
                                                </select>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                                <span />
                            </div>
                            {filteredTransactionSales.length === 0 ? (
                                renderEmptyState(transactionRegisterSearch ? 'No sales transactions match the selected register search.' : 'No sales transactions are available yet.')
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
                                        {filteredTransactionSales.map((sale) => {
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
                                            <button type="button" className="view-btn" onClick={selectedInvoiceIsInstallment ? handlePrintInstallmentPreview : () => handlePrintTransaction(selectedTransactionSale)}>
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
                                                    {selectedInstallmentRows.map((row) => (
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
