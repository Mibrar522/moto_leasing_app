import { useState } from 'react';

export default function PurchaseLedger({ ctx }) {
    const {
        dashboardData,
        formatCurrency,
        buildAssetUrl,
        renderEmptyState,
    } = ctx;
    const [page, setPage] = useState(1);
    const rows = dashboardData.purchaseLedger || [];
    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const visibleRows = rows.slice(startIndex, startIndex + pageSize);
    const firstRow = rows.length === 0 ? 0 : startIndex + 1;
    const lastRow = Math.min(startIndex + visibleRows.length, rows.length);

    return (
        <>
            <div className="page-heading">
                <h1>Purchase Ledger</h1>
                <p>Track company purchases, vehicle identity, paid amount, and remaining balances from received stock.</p>
            </div>
            <div className="table-card">
                <div className="section-header">
                    <h3>Company Purchase Ledger</h3>
                    <span className="section-caption">{rows.length} purchase records</span>
                </div>
                {rows.length === 0 ? renderEmptyState('No purchase ledger entries have been created yet.') : (
                    <>
                        <table className="pro-table purchase-ledger-table">
                            <thead>
                                <tr>
                                    <th>Vehicle</th>
                                    <th>Company</th>
                                    <th>Identity</th>
                                    <th>Purchase Date</th>
                                    <th>Paid</th>
                                    <th>Remaining</th>
                                    <th>Paid Date</th>
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
                                            Reg: {row.registration_number || 'Not set'}<br />
                                            Chassis: {row.chassis_number || 'Not set'}<br />
                                            Engine: {row.engine_number || 'Not set'}
                                        </td>
                                        <td>{row.purchase_date ? new Date(row.purchase_date).toLocaleDateString('en-PK') : 'Not set'}</td>
                                        <td>{formatCurrency(row.paid_amount)}</td>
                                        <td>{formatCurrency(row.remaining_amount)}</td>
                                        <td>{row.payment_date ? new Date(row.payment_date).toLocaleDateString('en-PK') : 'Not paid'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="table-pagination">
                            <span className="table-pagination-summary">
                                Showing {firstRow}-{lastRow} of {rows.length} ledger records
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
        </>
    );
}
