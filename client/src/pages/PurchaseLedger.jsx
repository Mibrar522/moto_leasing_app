import { useMemo, useState } from 'react';
import API from '../api/axios';

export default function PurchaseLedger({ ctx }) {
    const {
        dashboardData,
        formatCurrency,
        buildAssetUrl,
        renderEmptyState,
        loadDashboard,
    } = ctx;
    const [page, setPage] = useState(1);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('company_name');
    const [paymentRow, setPaymentRow] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [paymentMessage, setPaymentMessage] = useState('');
    const [savingPayment, setSavingPayment] = useState(false);
    const rows = dashboardData.purchaseLedger || [];
    const searchFields = [
        { value: 'company_name', label: 'Company' },
        { value: 'customer_name', label: 'Customer Name' },
        { value: 'customer_mobile', label: 'Customer Mobile' },
        { value: 'customer_cnic', label: 'Customer CNIC' },
        { value: 'registration_number', label: 'Registration' },
        { value: 'chassis_number', label: 'Chassis' },
        { value: 'engine_number', label: 'Engine' },
    ];
    const sortedRows = useMemo(() => [...rows].sort((left, right) => {
        const leftRemaining = Number(left.remaining_amount || 0);
        const rightRemaining = Number(right.remaining_amount || 0);
        if (leftRemaining > 0 && rightRemaining <= 0) return -1;
        if (leftRemaining <= 0 && rightRemaining > 0) return 1;
        return new Date(right.purchase_date || right.updated_at || 0) - new Date(left.purchase_date || left.updated_at || 0);
    }), [rows]);
    const getSearchValue = (row, field) => {
        if (field === 'customer_mobile') return row.customer_mobile || '';
        return row[field] || '';
    };
    const filteredRows = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return sortedRows;
        const startsWithMatches = [];
        const containsMatches = [];
        sortedRows.forEach((row) => {
            const fieldValue = String(getSearchValue(row, searchField) || '').trim().toLowerCase();
            const combinedValue = [
            row.vehicle_label,
            row.company_name,
                row.customer_name,
                row.customer_mobile,
                row.customer_cnic,
            row.contact_person,
            row.company_phone,
            row.company_email,
            row.registration_number,
            row.chassis_number,
            row.engine_number,
            row.paid_amount,
            row.remaining_amount,
            ].filter(Boolean).join(' ').toLowerCase();

            if (fieldValue.startsWith(query) || combinedValue.startsWith(query)) {
                startsWithMatches.push(row);
            } else if (fieldValue.includes(query) || combinedValue.includes(query)) {
                containsMatches.push(row);
            }
        });
        return [...startsWithMatches, ...containsMatches];
    }, [sortedRows, searchTerm, searchField]);
    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const visibleRows = filteredRows.slice(startIndex, startIndex + pageSize);
    const firstRow = filteredRows.length === 0 ? 0 : startIndex + 1;
    const lastRow = Math.min(startIndex + visibleRows.length, filteredRows.length);

    const openPaymentModal = (row) => {
        const remaining = Number(row.remaining_amount || 0);
        setPaymentRow(row);
        setPaymentAmount(remaining > 0 ? String(remaining) : '');
        setPaymentDate(new Date().toISOString().slice(0, 10));
        setPaymentMessage('');
    };

    const closePaymentModal = () => {
        if (savingPayment) return;
        setPaymentRow(null);
        setPaymentAmount('');
        setPaymentMessage('');
    };

    const submitPayment = async (event) => {
        event.preventDefault();
        if (!paymentRow) return;

        const amount = Number(paymentAmount || 0);
        const remaining = Number(paymentRow.remaining_amount || 0);
        if (!amount || amount <= 0) {
            setPaymentMessage('Payment amount must be greater than zero.');
            return;
        }
        if (amount > remaining) {
            setPaymentMessage(`Payment amount cannot be greater than ${formatCurrency(remaining)}.`);
            return;
        }

        try {
            setSavingPayment(true);
            setPaymentMessage('');
            await API.post(`/stock/orders/${paymentRow.stock_order_id}/payment`, {
                payment_amount: amount,
                payment_date: paymentDate ? `${paymentDate}T12:00:00.000Z` : undefined,
            });
            await loadDashboard({ page: 'purchase-ledger' });
            closePaymentModal();
        } catch (error) {
            setPaymentMessage(error.response?.data?.message || 'Unable to record purchase payment.');
        } finally {
            setSavingPayment(false);
        }
    };

    return (
        <>
            <div className="page-heading">
                <h1>Purchase Ledger</h1>
                <p>Track company purchases, vehicle identity, paid amount, and remaining balances from received stock.</p>
            </div>
            <div className="table-card">
                <div className="section-header">
                    <h3>Company Purchase Ledger</h3>
                    <span className="section-caption">{filteredRows.length} shown of {rows.length} purchase records</span>
                </div>
                <div className="registry-search-center">
                    <div className="registry-search-title">PURCHASE LEDGER SEARCH</div>
                    <button type="button" className="registry-search-icon" onClick={() => setSearchOpen((current) => !current)} aria-label="Search purchase ledger">
                        &#128269;
                    </button>
                    {searchOpen ? (
                        <div className="registry-search-controls">
                            <select
                                value={searchField}
                                onChange={(event) => {
                                    setSearchField(event.target.value);
                                    setPage(1);
                                }}
                                aria-label="Search by"
                            >
                                {searchFields.map((field) => (
                                    <option key={field.value} value={field.value}>{field.label}</option>
                                ))}
                            </select>
                            <input
                                className="registry-search-input"
                                value={searchTerm}
                                onChange={(event) => {
                                    setSearchTerm(event.target.value);
                                    setPage(1);
                                }}
                                placeholder={`Search by ${searchFields.find((field) => field.value === searchField)?.label || 'Company'}...`}
                                autoFocus
                            />
                        </div>
                    ) : null}
                </div>
                {filteredRows.length === 0 ? renderEmptyState('No purchase ledger entries have been created yet.') : (
                    <>
                        <table className="pro-table purchase-ledger-table">
                            <thead>
                                <tr>
                                    <th>Vehicle</th>
                                    <th>Company</th>
                                    <th>Customer</th>
                                    <th>Identity</th>
                                    <th>Purchase Date</th>
                                    <th>Paid</th>
                                    <th>Remaining</th>
                                    <th>Paid Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleRows.map((row) => (
                                    <tr key={row.id}>
                                        <td>
                                            {row.vehicle_image_url ? (
                                                <img className="product-thumb" src={buildAssetUrl(row.vehicle_image_url)} alt={row.vehicle_label || 'Vehicle'} />
                                            ) : null}
                                            <strong>{row.vehicle_label || 'Vehicle'}</strong><br />
                                            <span className="muted-text">{row.color || 'No color'}</span>
                                        </td>
                                        <td>
                                            <strong>{row.company_name}</strong><br />
                                            <span className="muted-text">{row.contact_person || 'No owner'} / {row.company_phone || 'No phone'}</span><br />
                                            <span className="muted-text">{row.company_email || 'No email'}</span>
                                        </td>
                                        <td>
                                            <strong>{row.customer_name || 'Not sold yet'}</strong><br />
                                            <span className="muted-text">{row.customer_mobile || 'No mobile'}</span><br />
                                            <span className="muted-text">{row.customer_cnic || 'No CNIC'}</span>
                                        </td>
                                        <td>
                                            Reg: {row.registration_number || 'Not set'}<br />
                                            Chassis: {row.chassis_number || 'Not set'}<br />
                                            Engine: {row.engine_number || 'Not set'}
                                        </td>
                                        <td>{row.purchase_date ? new Date(row.purchase_date).toLocaleDateString('en-PK') : 'Not set'}</td>
                                        <td>{formatCurrency(row.paid_amount)}</td>
                                        <td>{formatCurrency(row.remaining_amount)}</td>
                                        <td>{row.payment_date ? new Date(row.payment_date).toLocaleDateString('en-PK') : 'Not paid'}</td>
                                        <td>
                                            {Number(row.remaining_amount || 0) > 0 ? (
                                                <button type="button" className="view-btn" onClick={() => openPaymentModal(row)}>
                                                    Pay Balance
                                                </button>
                                            ) : (
                                                <span className="status-pill received">Paid</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="table-pagination">
                            <span className="table-pagination-summary">
                                Showing {firstRow}-{lastRow} of {filteredRows.length} ledger records
                            </span>
                            <div className="table-pagination-actions">
                                <button type="button" className="view-btn" onClick={() => setPage(1)} disabled={safePage === 1}>&lt;&lt; First</button>
                                <button type="button" className="view-btn" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage === 1}>&lt; Prev</button>
                                <span className="table-pagination-current">Page {safePage} of {totalPages}</span>
                                <button type="button" className="view-btn" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={safePage === totalPages}>Next &gt;</button>
                                <button type="button" className="view-btn" onClick={() => setPage(totalPages)} disabled={safePage === totalPages}>Last &gt;&gt;</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {paymentRow ? (
                <div className="modal-backdrop">
                    <form className="modal-card compact-modal" onSubmit={submitPayment}>
                        <div className="modal-header">
                            <div>
                                <h3>Pay Stock Invoice Balance</h3>
                                <p>{paymentRow.company_name} / {paymentRow.vehicle_label}</p>
                            </div>
                            <button type="button" className="view-btn" onClick={closePaymentModal}>Close</button>
                        </div>
                        {paymentMessage ? <div className="form-message error">{paymentMessage}</div> : null}
                        <div className="summary-grid two-column">
                            <div>
                                <span className="summary-label">Registration</span>
                                <strong>{paymentRow.registration_number || 'Not set'}</strong>
                            </div>
                            <div>
                                <span className="summary-label">Remaining Balance</span>
                                <strong>{formatCurrency(paymentRow.remaining_amount)}</strong>
                            </div>
                        </div>
                        <label>
                            Payment Amount
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                max={Number(paymentRow.remaining_amount || 0)}
                                value={paymentAmount}
                                onChange={(event) => setPaymentAmount(event.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Paid Date
                            <input
                                type="date"
                                value={paymentDate}
                                onChange={(event) => setPaymentDate(event.target.value)}
                                required
                            />
                        </label>
                        <div className="modal-actions">
                            <button type="button" className="view-btn" onClick={closePaymentModal} disabled={savingPayment}>Cancel</button>
                            <button type="submit" className="primary-btn" disabled={savingPayment}>
                                {savingPayment ? 'Saving...' : 'Record Payment'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}
        </>
    );
}
