import { lazy } from 'react';

const Dashboard = lazy(() => import('../Dashboard'));

export default function DashboardRoutePage() {
  return <Dashboard pageKey="dashboard" />;
}
