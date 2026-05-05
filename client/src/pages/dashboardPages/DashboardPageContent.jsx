import React, { Suspense, lazy } from 'react';

const OverviewPages = lazy(() => import('./content/OverviewPages'));
const BusinessPages = lazy(() => import('./content/BusinessPages'));
const AdminPages = lazy(() => import('./content/AdminPages'));
const ReportPages = lazy(() => import('./content/ReportPages'));

const businessPages = new Set(['customers', 'products', 'companies', 'stock', 'sales', 'transactions', 'installments']);
const adminPages = new Set(['workflow', 'user-tasks', 'employees', 'access', 'dealers']);

export default function DashboardPageContent({ ctx }) {
    const { activePage } = ctx;
    const normalizedPage = activePage || 'dashboard';
    let PageGroup = OverviewPages;

    if (businessPages.has(normalizedPage)) {
        PageGroup = BusinessPages;
    } else if (adminPages.has(normalizedPage)) {
        PageGroup = AdminPages;
    } else if (normalizedPage === 'reports' || normalizedPage.startsWith('report-')) {
        PageGroup = ReportPages;
    }

    return (
        <Suspense fallback={<div className="feedback-card">Loading page...</div>}>
            <PageGroup pageKey={normalizedPage} ctx={ctx} />
        </Suspense>
    );
}
