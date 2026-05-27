import { lazy } from 'react';

const DashboardWorkspace = lazy(() => import('../DashboardWorkspace'));

export default function DashboardRoutePage({ pageKey, PageComponent }) {
  return <DashboardWorkspace pageKey={pageKey} PageComponent={PageComponent} />;
}
