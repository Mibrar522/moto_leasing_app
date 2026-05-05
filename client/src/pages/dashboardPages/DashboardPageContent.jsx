import React, { Suspense, lazy } from 'react';
const ApplicationsContent = lazy(() => import('./content/ApplicationsContent'));
const ProductsContent = lazy(() => import('./content/ProductsContent'));
const CompaniesContent = lazy(() => import('./content/CompaniesContent'));
const WorkflowContent = lazy(() => import('./content/WorkflowContent'));
const UserTasksContent = lazy(() => import('./content/UserTasksContent'));
const SalesContent = lazy(() => import('./content/SalesContent'));
const TransactionsContent = lazy(() => import('./content/TransactionsContent'));
const ReportsContent = lazy(() => import('./content/ReportsContent'));
const ReportStockInventoryContent = lazy(() => import('./content/ReportStockInventoryContent'));
const ReportDailySalesContent = lazy(() => import('./content/ReportDailySalesContent'));
const ReportStockReceivedContent = lazy(() => import('./content/ReportStockReceivedContent'));
const ReportCustomersContent = lazy(() => import('./content/ReportCustomersContent'));
const ReportCustomerTransactionsContent = lazy(() => import('./content/ReportCustomerTransactionsContent'));
const ReportBusinessTransactionsContent = lazy(() => import('./content/ReportBusinessTransactionsContent'));
const ReportInvoiceViewContent = lazy(() => import('./content/ReportInvoiceViewContent'));
const ReportEmployeesContent = lazy(() => import('./content/ReportEmployeesContent'));
const ReportSalaryContent = lazy(() => import('./content/ReportSalaryContent'));
const ReportDealerInformationContent = lazy(() => import('./content/ReportDealerInformationContent'));
const ReportDealerEmployeesContent = lazy(() => import('./content/ReportDealerEmployeesContent'));
const StockContent = lazy(() => import('./content/StockContent'));
const InstallmentsContent = lazy(() => import('./content/InstallmentsContent'));
const CustomersContent = lazy(() => import('./content/CustomersContent'));
const EmployeesContent = lazy(() => import('./content/EmployeesContent'));
const AccessControlContent = lazy(() => import('./content/AccessControlContent'));
const DealersContent = lazy(() => import('./content/DealersContent'));
const DashboardHomeContent = lazy(() => import('./content/DashboardHomeContent'));

export default function DashboardPageContent({ ctx }) {
    const { activePage } = ctx;
    let PageComponent;

    switch (activePage) {
        case 'applications':
            PageComponent = ApplicationsContent;
            break;
        case 'products':
            PageComponent = ProductsContent;
            break;
        case 'companies':
            PageComponent = CompaniesContent;
            break;
        case 'workflow':
            PageComponent = WorkflowContent;
            break;
        case 'user-tasks':
            PageComponent = UserTasksContent;
            break;
        case 'sales':
            PageComponent = SalesContent;
            break;
        case 'transactions':
            PageComponent = TransactionsContent;
            break;
        case 'reports':
            PageComponent = ReportsContent;
            break;
        case 'report-stock-inventory':
            PageComponent = ReportStockInventoryContent;
            break;
        case 'report-daily-sales':
            PageComponent = ReportDailySalesContent;
            break;
        case 'report-stock-received':
            PageComponent = ReportStockReceivedContent;
            break;
        case 'report-customers':
            PageComponent = ReportCustomersContent;
            break;
        case 'report-customer-transactions':
            PageComponent = ReportCustomerTransactionsContent;
            break;
        case 'report-business-transactions':
            PageComponent = ReportBusinessTransactionsContent;
            break;
        case 'report-invoice-view':
            PageComponent = ReportInvoiceViewContent;
            break;
        case 'report-employees':
            PageComponent = ReportEmployeesContent;
            break;
        case 'report-salary':
            PageComponent = ReportSalaryContent;
            break;
        case 'report-dealer-information':
            PageComponent = ReportDealerInformationContent;
            break;
        case 'report-dealer-employees':
            PageComponent = ReportDealerEmployeesContent;
            break;
        case 'stock':
            PageComponent = StockContent;
            break;
        case 'installments':
            PageComponent = InstallmentsContent;
            break;
        case 'customers':
            PageComponent = CustomersContent;
            break;
        case 'employees':
            PageComponent = EmployeesContent;
            break;
        case 'access':
            PageComponent = AccessControlContent;
            break;
        case 'dealers':
            PageComponent = DealersContent;
            break;
        default:
            PageComponent = DashboardHomeContent;
            break;
    }

    return (
        <Suspense fallback={<div className="feedback-card">Loading page...</div>}>
            <PageComponent ctx={ctx} />
        </Suspense>
    );
}
