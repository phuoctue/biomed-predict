import { BrainCircuit, ChevronLeft, FlaskConical, LayoutDashboard, LogOut, Stethoscope, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { routePaths } from "../../app/routes/route-paths";
import { useAuthStore } from "../../features/auth/store/auth.store";
import { useUiStore } from "../../features/ui/store/ui.store";
import { cn } from "../../lib/cn";

const navigation = [
  { label: "Dashboard", to: routePaths.dashboard, icon: LayoutDashboard },
  { label: "Patients", to: routePaths.patients, icon: Users },
  { label: "Drugs", to: routePaths.drugs, icon: Stethoscope },
  { label: "Evaluations", to: routePaths.evaluations, icon: BrainCircuit }
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    clearAuth();
    navigate(routePaths.login);
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex h-screen flex-col border-r border-white/10 bg-slate-950/95 px-4 py-5 backdrop-blur-xl transition-all duration-300 md:sticky md:translate-x-0",
        sidebarOpen ? "translate-x-0 w-[280px]" : "-translate-x-full w-[280px] md:w-[96px] md:translate-x-0"
      )}
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-400 to-emerald-400 text-slate-950 shadow-glow">
            <FlaskConical className="h-6 w-6" />
          </div>
          {sidebarOpen ? (
            <div>
              <p className="text-lg font-semibold text-white">MediAI</p>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Clinical AI Suite</p>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarOpen ? "rotate-0" : "rotate-180")} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition",
                  isActive
                    ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-100 shadow-glow"
                    : "border-transparent bg-white/0 text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {sidebarOpen ? <span>{item.label}</span> : <span className="sr-only">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/10 to-emerald-400/10 p-4">
        {sidebarOpen ? (
          <>
            <p className="text-sm font-semibold text-white">Daily safety summary</p>
            <p className="mt-2 text-xs leading-5 text-slate-300">
              Review renal dosage flags, duplicate therapy, and interaction alerts before sign-off.
            </p>
          </>
        ) : null}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        {sidebarOpen ? <span>Sign out</span> : <span className="sr-only">Sign out</span>}
      </button>
    </aside>
  );
};
