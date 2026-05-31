import { useState } from 'react';

export default function Stock({
  canManageStock,
  canViewStockOrderForm,
  handleStockOrderSubmit,
  savingStock,
  stockMessage,
  stockOrderForm,
  handleStockOrderChange,
  dashboardData,
  handleBankSlipUpload,
  uploadingBankSlip,
  canViewStockReceived,
  receivedStockOrders,
  renderEmptyState,
  getStatusClass,
  canViewStockRegister,
  pendingStockOrders,
  formatCurrency,
  buildAssetUrl,
  openStockReceiveModal,
  canReceiveStock,
  canUpdateStockOrder,
  canDeleteStockOrder,
  canUpdateReceivedStock,
  canDeleteReceivedStock,
  handleEditStockOrder,
  handleDeleteStockOrder,
  resetStockOrderForm,
}) {
  const [receivedRegisterPage, setReceivedRegisterPage] = useState(1);
  const [stockRegisterPage, setStockRegisterPage] = useState(1);
  const registerPageSize = 10;
  const paginateRows = (rows = [], page = 1, pageSize = registerPageSize) => {
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const pageRows = rows.slice(startIndex, startIndex + pageSize);

    return {
      pageRows,
      totalPages,
      safePage,
      firstRow: rows.length === 0 ? 0 : startIndex + 1,
      lastRow: Math.min(startIndex + pageRows.length, rows.length),
    };
  };
  const receivedPagination = paginateRows(receivedStockOrders, receivedRegisterPage, 10);
  const stockPagination = paginateRows(pendingStockOrders, stockRegisterPage, registerPageSize);
  const receivedRegisterRows = receivedPagination.pageRows;
  const stockRegisterRows = stockPagination.pageRows;
  const renderVehicleCell = (order) => (
    <>
      {[order.brand || order.product_brand, order.model || order.product_model].filter(Boolean).join(' ') || 'Vehicle'}
      <br />
      {order.vehicle_type || order.product_vehicle_type || 'No type'}{order.product_color ? ` / ${order.product_color}` : order.color ? ` / ${order.color}` : ''}
      <br />
      {order.product_description || 'No description'}
    </>
  );
  const renderReceivedIdentity = (value) => value || 'Not set';

  const renderPagination = ({ totalRows, pageSize, pagination, setPage, label }) => {
    if (totalRows <= pageSize) return null;

    return (
      <div className="table-pagination">
        <span className="table-pagination-summary">
          Showing {pagination.firstRow}-{pagination.lastRow} of {totalRows} {label}
        </span>
        <div className="table-pagination-actions">
          <button type="button" className="view-btn" onClick={() => setPage(1)} disabled={pagination.safePage === 1}>
            &lt;&lt; First
          </button>
          <button type="button" className="view-btn" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={pagination.safePage === 1}>
            &lt; Prev
          </button>
          <span className="table-pagination-current">
            Page {pagination.safePage} of {pagination.totalPages}
          </span>
          <button type="button" className="view-btn" onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))} disabled={pagination.safePage === pagination.totalPages}>
            Next &gt;
          </button>
          <button type="button" className="view-btn" onClick={() => setPage(pagination.totalPages)} disabled={pagination.safePage === pagination.totalPages}>
            Last &gt;&gt;
          </button>
        </div>
      </div>
    );
  };

  if (!canManageStock) {
    return <div className="feedback-card error">Your account does not have stock and fleet management access.</div>;
  }

  return (
    <>
      <div className="page-heading">
        <h1>Stock Orders</h1>
        <p>Order stock against product masters, attach the bank online slip, email the supplier, and track what has been received.</p>
      </div>

      <div className="customers-grid stock-page-grid">
        {canViewStockOrderForm ? (
        <form className="table-card customer-form-card stock-order-form-card" onSubmit={handleStockOrderSubmit}>
          <div className="section-header">
            <h3>{stockOrderForm.id ? 'Update Stock Order' : 'Order Stock'}</h3>
            <button type="submit" className="primary-btn" disabled={savingStock}>
              {savingStock ? 'Processing...' : (stockOrderForm.id ? 'Update Order' : 'Create Order')}
            </button>
              {stockOrderForm.id ? (
                <button type="button" className="view-btn" onClick={resetStockOrderForm} disabled={savingStock}>Cancel</button>
              ) : null}
          </div>
          {stockMessage ? <div className="notice-banner">{stockMessage}</div> : null}
          <div className="form-grid">
            <label className="field">
              <span>Company Profile</span>
              <select name="company_profile_id" value={stockOrderForm.company_profile_id} onChange={handleStockOrderChange}>
                <option value="">Select company</option>
                {(dashboardData.companies || []).map((company) => (
                  <option key={`stock-company-${company.id}`} value={company.id}>
                    {company.company_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field"><span>Company Name</span><input name="company_name" value={stockOrderForm.company_name} onChange={handleStockOrderChange} readOnly /></label>
            <label className="field"><span>Company Email</span><input name="company_email" type="email" value={stockOrderForm.company_email} onChange={handleStockOrderChange} placeholder="supplier@company.com" readOnly /></label>
            <label className="field full-span">
              <span>Product Vehicle</span>
              <select name="product_id" value={stockOrderForm.product_id} onChange={handleStockOrderChange}>
                <option value="">Select product vehicle</option>
                {(dashboardData.products || []).map((product) => (
                  <option key={`stock-product-${product.id}`} value={product.id}>
                    {[product.brand, product.vehicle_type, product.model].filter(Boolean).join(' - ')}
                  </option>
                ))}
              </select>
            </label>
            <label className="field"><span>Vehicle Type</span><input name="vehicle_type" value={stockOrderForm.vehicle_type} onChange={handleStockOrderChange} readOnly /></label>
            <label className="field"><span>Brand</span><input name="brand" value={stockOrderForm.brand} onChange={handleStockOrderChange} readOnly /></label>
            <label className="field"><span>Model</span><input name="model" value={stockOrderForm.model} onChange={handleStockOrderChange} readOnly /></label>
            <label className="field"><span>Color</span><input name="color" value={stockOrderForm.color || ''} onChange={handleStockOrderChange} readOnly /></label>
            <label className="field full-span"><span>Product Description</span><textarea name="product_description" value={stockOrderForm.product_description || ''} onChange={handleStockOrderChange} rows="3" readOnly /></label>
            <label className="field"><span>Unit Price</span><input type="number" min="0" step="0.01" name="unit_price" value={stockOrderForm.unit_price} onChange={handleStockOrderChange} /></label>
            <label className="field"><span>Total Amount</span><input type="number" min="0" step="0.01" name="total_amount" value={stockOrderForm.total_amount} onChange={handleStockOrderChange} readOnly /></label>
            <label className="field"><span>Order Date</span><input type="date" name="expected_delivery_date" value={stockOrderForm.expected_delivery_date} onChange={handleStockOrderChange} /></label>
            <label className="field full-span"><span>Bank Online Slip</span><input type="file" accept="application/pdf,image/*" onChange={handleBankSlipUpload} /></label>
            <label className="field full-span"><span>Uploaded Slip URL</span><input name="bank_slip_url" value={stockOrderForm.bank_slip_url} onChange={handleStockOrderChange} readOnly={uploadingBankSlip} /></label>
            <label className="field full-span"><span>Notes</span><textarea rows="4" name="notes" value={stockOrderForm.notes} onChange={handleStockOrderChange} placeholder="Payment reference, supplier note, or bank transaction details" /></label>
          </div>
        </form>
        ) : null}

        {canViewStockRegister ? (
        <div className="table-card stock-register-card">
          <h3>Stock Ordering Register</h3>
          {pendingStockOrders.length === 0 ? (
            renderEmptyState('No stock orders have been created yet.')
          ) : (
            <>
            <div className="stock-table-wrap">
            <table className="pro-table stock-register-table">
              <colgroup>
                <col className="stock-col-company" />
                <col className="stock-col-vehicle" />
                <col className="stock-col-amount" />
                <col className="stock-col-date" />
                <col className="stock-col-slip" />
                <col className="stock-col-status" />
                <col className="stock-col-action" />
              </colgroup>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Vehicle</th>
                  <th>Amount</th>
                  <th>Order Date</th>
                  <th>Slip</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stockRegisterRows.map((order) => (
                  <tr key={order.id}>
                    <td>{order.company_name}<br />{order.company_email || 'No email'}</td>
                    <td>{renderVehicleCell(order)}</td>
                    <td>{formatCurrency(order.total_amount)}</td>
                    <td>{order.expected_delivery_date || 'Not set'}</td>
                    <td>{order.bank_slip_url ? <a href={buildAssetUrl(order.bank_slip_url)} target="_blank" rel="noreferrer">View Slip</a> : 'No slip'}</td>
                    <td><span className={getStatusClass(order.order_status)}>{order.order_status}</span></td>
                    <td>
                      {order.is_locked_by_sale ? (
                        <span className="feature-pill">Locked after sale</span>
                      ) : (
                        <div className="inline-actions">
                          {canReceiveStock ? <button type="button" className="view-btn" onClick={() => openStockReceiveModal(order)} disabled={savingStock}>Receive Stock</button> : null}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            {renderPagination({
              totalRows: pendingStockOrders.length,
              pageSize: registerPageSize,
              pagination: stockPagination,
              setPage: setStockRegisterPage,
              label: 'orders',
            })}
            </>
          )}
        </div>
        ) : null}
      </div>

      {canViewStockReceived ? (
      <div className="table-card stock-register-card">
        <h3>Stock Received From Company</h3>
        {receivedStockOrders.length === 0 ? (
          renderEmptyState('No stock has been marked as received yet.')
        ) : (
          <>
          <div className="stock-table-wrap">
          <table className="pro-table stock-received-table">
            <colgroup>
              <col className="stock-col-company" />
              <col className="stock-col-vehicle" />
              <col className="stock-col-received" />
              <col className="stock-col-identity" />
              <col className="stock-col-identity" />
              <col className="stock-col-identity" />
              <col className="stock-col-date" />
              <col className="stock-col-status" />
              <col className="stock-col-action" />
            </colgroup>
            <thead>
              <tr>
                <th>Company</th>
                <th>Vehicle</th>
                <th>Vehicle Received</th>
                <th>Registration</th>
                <th>Chassis</th>
                <th>Engine</th>
                <th>Received Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {receivedRegisterRows.map((order) => (
                <tr key={order.id}>
                  <td>{order.company_name}</td>
                  <td>{renderVehicleCell(order)}</td>
                  <td>{Number(order.received_quantity || 0) > 0 ? 'Yes' : 'Pending'}</td>
                  <td>{renderReceivedIdentity(order.registration_number)}</td>
                  <td>{renderReceivedIdentity(order.chassis_number)}</td>
                  <td>{renderReceivedIdentity(order.engine_number)}</td>
                  <td>{order.received_at ? new Date(order.received_at).toLocaleDateString('en-PK') : 'Pending'}</td>
                  <td><span className={getStatusClass(order.order_status)}>{order.order_status}</span></td>
                  <td>
                    {order.is_locked_by_sale ? (
                      <span className="feature-pill">Locked after sale</span>
                    ) : (
                      <div className="inline-actions">
                        {canUpdateReceivedStock ? <button type="button" className="view-btn" onClick={() => handleEditStockOrder(order)} disabled={savingStock}>Update</button> : null}
                        {canDeleteReceivedStock ? <button type="button" className="danger-btn" onClick={() => handleDeleteStockOrder(order)} disabled={savingStock}>Delete</button> : null}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {renderPagination({
            totalRows: receivedStockOrders.length,
            pageSize: 10,
            pagination: receivedPagination,
            setPage: setReceivedRegisterPage,
            label: 'received records',
          })}
          </>
        )}
      </div>
      ) : null}
    </>
  );
}
