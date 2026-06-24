import { Navigate, Outlet } from "react-router-dom";
import { routePaths } from "./route-paths";
import { useAuthStore } from "../../features/auth/store/auth.store";

/**
 * AdminRoute - Chỉ cho phép role ADMIN truy cập
 * Nếu không phải ADMIN -> redirect về dashboard
 */
export const AdminRoute = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to={routePaths.login} replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to={routePaths.dashboard} replace />;
  }

  return <Outlet />;
};
