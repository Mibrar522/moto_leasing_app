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
  handleResendStockOrderEmail,
  canReceiveStock,
  canUpdateStockOrder,
  canDeleteStockOrder,
  canUpdateReceivedStock,
  canDeleteReceivedStock,
  handleEditStockOrder,
  handleDeleteStockOrder,
  resetStockOrderForm,
}) {
  const [receivedRegisterOpen, setReceivedRegisterOpen] = useState(false);
  const [stockRegisterOpen, setStockRegisterOpen] = useState(false);
  const receivedRegisterRows = receivedRegisterOpen ? receivedStockOrders : receivedStockOrders.slice(0, 5);
  const stockRegisterRows = stockRegisterOpen ? pendingStockOrders : pendingStockOrders.slice(0, 5);

  const getStockEmailStatus = (order) => {
    if (order.email_sent) {
      return 'Sent';
    }

    const message = String(order.email_error || '').trim();
    if (!message) {
      return 'Pending email send';
    }

    if (message.toLowerCase().includes('resend email failed (403)')) {
      return 'Previous email failed. Click Resend Email after Render redeploy.';
    }

    return message;
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

      <div className="customers-grid">
        {canViewStockOrderForm ? (
        <form className="table-card customer-form-card" onSubmit={handleStockOrderSubmit}>
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

        {canViewStockReceived ? (
        <div className="table-card">
          <h3>Stock Received From Company</h3>
          {receivedStockOrders.length === 0 ? (
            renderEmptyState('No stock has been marked as received yet.')
          ) : (
            <table className="pro-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Vehicle</th>
                  <th>Vehicle Received</th>
                  <th>Received Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {receivedRegisterRows.map((order) => (
                  <tr key={order.id}>
                    <td>{order.company_name}</td>
                    <td>{order.brand} {order.model}<br />{order.vehicle_type}{order.product_color ? ` / ${order.product_color}` : ''}<br />{order.product_description || 'No description'}</td>
                    <td>{Number(order.received_quantity || 0) > 0 ? 'Yes' : 'Pending'}</td>
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
          )}
        </div>
        ) : null}
      </div>

      {canViewStockRegister ? (
      <div className="table-card">
        <h3>Stock Ordering Register</h3>
        {pendingStockOrders.length === 0 ? (
          renderEmptyState('No stock orders have been created yet.')
        ) : (
          <table className="pro-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Vehicle</th>
                <th>Amount</th>
                <th>Order Date</th>
                <th>Email</th>
                <th>Slip</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stockRegisterRows.map((order) => (
                <tr key={order.id}>
                    <td>{order.company_name}<br />{order.company_email || 'No email'}</td>
                  <td>{order.brand} {order.model}<br />{order.vehicle_type}{order.product_color ? ` / ${order.product_color}` : ''}<br />{order.product_description || 'No description'}</td>
                  <td>{formatCurrency(order.total_amount)}</td>
                  <td>{order.expected_delivery_date || 'Not set'}</td>
                  <td>
                    <div>{getStockEmailStatus(order)}</div>
                    {!order.email_sent && handleResendStockOrderEmail ? (
                      <button type="button" className="view-btn compact-action" onClick={() => handleResendStockOrderEmail(order.id)} disabled={savingStock}>
                        Resend Email
                      </button>
                    ) : null}
                  </td>
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
        )}
      </div>
      ) : null}
    </>
  );
}