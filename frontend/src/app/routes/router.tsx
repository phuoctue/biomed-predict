import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./protected-route";
import { routePaths } from "./route-paths";
import { AppShell } from "../../components/layout/app-shell";
import { LoginPage } from "../../features/auth/pages/login.page";
import { RegisterPage } from "../../features/auth/pages/register.page";
import { DashboardPage } from "../../features/dashboard/pages/dashboard.page";
import { PatientsPage } from "../../features/patients/pages/patients.page";
import { DrugsPage } from "../../features/drugs/pages/drugs.page";
import { EvaluationsPage } from "../../features/evaluations/pages/evaluations.page";

export const router = createBrowserRouter([
  {
    path: routePaths.login,
    element: <LoginPage />
  },
  {
    path: "/register", // Định tuyến công khai cho trang Đăng ký
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
            path: routePaths.evaluations,
            element: <EvaluationsPage />
          }
        ]
      }
    ]
  }
]);

