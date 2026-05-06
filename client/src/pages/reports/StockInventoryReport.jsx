export default function StockInventoryReport({ ctx }) {
  const {
    formatCurrency,
    getVisibleRows,
    renderEmptyState,
    renderReportFilters,
    renderTableLimitControl,
    reportDateFrom,
    reportDateTo,
    reportStockInventoryRows,
  } = ctx;

return (
                    <>
                        <div className="page-heading">
                            <h1>Stock Inventory Report</h1>
                            <p>See opening stock on floor, bikes still in transit, sales during the selected period, and the remaining closing stock.</p>
                        </div>
                        {renderReportFilters({
                            title: 'Stock Inventory Filters',
                            showDateRange: true,
                            showBranch: true,
                            showAgent: false,
                            showMode: true,
                            statusOptions: [
                                { value: 'ALL', label: 'All' },
                                { value: 'OPENING', label: 'Opening Stock' },
                                { value: 'INTRANSIT', label: 'In Transit' },
                                { value: 'CASH_SALES', label: 'Cash Sales' },
                                { value: 'INSTALLMENT_SALES', label: 'Installment Sales' },
                                { value: 'CLOSING', label: 'Closing Stock' },
                            ],
                            searchPlaceholder: 'Search vehicle, serial, registration, chassis, engine, company, branch...',
                        })}
                        <div className="table-card">
                            <div className="section-header">
                                <h3>Stock Inventory</h3>
                                <span className="section-caption">{reportDateFrom} to {reportDateTo}</span>
                            </div>
                            {reportStockInventoryRows.length === 0 ? renderEmptyState('No stock inventory records match the selected filters.') : (
                                <>
                                    <table className="pro-table">
                                        <thead>
                                            <tr>
                                                <th>Branch</th>
                                                <th>Company</th>
                                                <th>Vehicle</th>
                                                <th>Type</th>
                                                <th>Color</th>
                                                <th>Description</th>
                                                <th>Opening Stock</th>
                                                <th>In Transit</th>
                                                <th>Sales</th>
                                                <th>Closing Stock</th>
                                                <th>Closing Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getVisibleRows('report-stock-inventory', reportStockInventoryRows).map((row) => (
                                                <tr key={row.key}>
                                                    <td>{row.branch_name}</td>
                                                    <td>{row.company_name || 'Not set'}</td>
                                                    <td>{row.brand} {row.model}<br />{row.serial_number || row.registration_number || 'No serial'}</td>
                                                    <td>{row.vehicle_type}</td>
                                                    <td>{row.color || 'Not set'}</td>
                                                    <td>{row.product_description || 'No description'}</td>
                                                    <td>{row.opening_quantity}</td>
                                                    <td>{row.intransit_quantity}</td>
                                                    <td>{row.total_sales_quantity}</td>
                                                    <td>{row.closing_quantity}</td>
                                                    <td>{formatCurrency(row.closing_value || 0)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {renderTableLimitControl('report-stock-inventory', reportStockInventoryRows.length)}
                                </>
                            )}
                        </div>
                    </>
                );

}
