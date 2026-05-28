import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./protected-route";
import { MainLayout } from "../../components/layout/main-layout";
import { LoginPage } from "../../features/auth/pages/login.page";

const Dashboard = () => <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">Welcome to MediAI dashboard.</div>;

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [{ index: true, element: <Dashboard /> }]
      }
    ]
  }
]);
