import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./protected-route";
import { routePaths } from "./route-paths";
import { AppShell } from "../../components/layout/app-shell";
import { LoginPage } from "../../features/auth/pages/login.page";
import { RegisterPage } from "../../features/auth/pages/register.page";
import { DashboardPage } from "../../features/dashboard/pages/dashboard.page";
import { PatientsPage } from "../../features/patients/pages/patients.page";
import { DrugsPage } from "../../features/drugs/pages/drugs.page";
import { BookmarkedDrugsPage } from "../../features/drugs/pages/bookmarked-drugs.page";
import { UsageStatisticsPage } from "../../features/statistics/pages/usage-statistics.page";
import { EvaluationPage } from "../../features/evaluations/pages/EvaluationPage";
import { HistoryPage } from "../../features/history/HistoryPage";
import { SettingsPage } from "../../features/settings/SettingsPage";




export const router = createBrowserRouter([
  {
    path: routePaths.login,
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: "/",
            element: <Navigate to={routePaths.dashboard} replace />
          },
          {
            path: routePaths.dashboard,
            element: <DashboardPage />
          },
          {
            path: routePaths.patients,
            element: <PatientsPage />
          },
          {
            path: routePaths.drugs,
            element: <DrugsPage />
          },
          {
            path: routePaths.bookmarkedDrugs,
            element: <BookmarkedDrugsPage />
            path: routePaths.usageStatistics,
            element: <UsageStatisticsPage />
          },
          {
            path: routePaths.evaluations,
            element: <EvaluationPage />
          },
          {
            path: routePaths.history,
            element: <HistoryPage />
          },
          {
            path: routePaths.settings,
            element: <SettingsPage />
          }
        ]
      }
    ]
  }
]);

