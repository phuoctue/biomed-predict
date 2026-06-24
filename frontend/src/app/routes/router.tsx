import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./protected-route";
import { AdminRoute } from "./admin-route";
import { routePaths } from "./route-paths";
import { AppShell } from "../../components/layout/app-shell";
import { Spinner } from "@/components/ui/Spinner";

const LoginPage = lazy(() => import("../../features/auth/pages/login.page").then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("../../features/auth/pages/register.page").then((m) => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import("../../features/dashboard/pages/dashboard.page").then((m) => ({ default: m.DashboardPage })));
const PatientsPage = lazy(() => import("../../features/patients/pages/patients.page").then((m) => ({ default: m.PatientsPage })));
const DrugsPage = lazy(() => import("../../features/drugs/pages/drugs.page").then((m) => ({ default: m.DrugsPage })));
const EvaluationPage = lazy(() => import("../../features/evaluations/pages/EvaluationPage").then((m) => ({ default: m.EvaluationPage })));
const HistoryPage = lazy(() => import("../../features/history/HistoryPage").then((m) => ({ default: m.HistoryPage })));
const SettingsPage = lazy(() => import("../../features/settings/SettingsPage").then((m) => ({ default: m.SettingsPage })));

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50">
    <Spinner label="Đang tải trang..." />
  </div>
);

const withSuspense = (node: React.ReactNode) => <Suspense fallback={<PageFallback />}>{node}</Suspense>;

export const router = createBrowserRouter([
  {
    path: routePaths.login,
    element: withSuspense(<LoginPage />),
  },
  {
    path: "/register",
    element: withSuspense(<RegisterPage />),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: "/",
            element: <Navigate to={routePaths.dashboard} replace />,
          },
          {
            path: routePaths.dashboard,
            element: withSuspense(<DashboardPage />),
          },
          {
            path: routePaths.patients,
            element: withSuspense(<PatientsPage />),
          },
          {
            path: routePaths.drugs,
            element: withSuspense(<DrugsPage />),
          },
          {
            path: routePaths.evaluations,
            element: withSuspense(<EvaluationPage />),
          },
          {
            path: routePaths.history,
            element: withSuspense(<HistoryPage />),
          },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            element: <AppShell />,
            children: [
              {
                path: routePaths.settings,
                element: withSuspense(<SettingsPage />),
              },
            ],
          },
        ],
      },
    ],
  },
]);
