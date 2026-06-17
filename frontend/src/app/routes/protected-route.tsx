import { Navigate, Outlet } from "react-router-dom";
import { routePaths } from "./route-paths";
import { useAuthStore } from "../../features/auth/store/auth.store";

export const ProtectedRoute = () => {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm shadow-glow">
          Loading MediAI...
        </div>
      </div>
    );
  }

  return accessToken ? <Outlet /> : <Navigate to={routePaths.login} replace />;
};

