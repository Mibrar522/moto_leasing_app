import { lazy } from 'react';

const DashboardWorkspace = lazy(() => import('../DashboardWorkspace'));

export default function DashboardRoutePage({ pageKey = 'dashboard', PageComponent }) {
  return <DashboardWorkspace pageKey={pageKey} PageComponent={PageComponent} />;
}
