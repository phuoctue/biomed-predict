import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { useUiStore } from "../../features/ui/store/ui.store";

export const AppShell = () => {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_28%),linear-gradient(180deg,#020617_0%,#07111f_50%,#020617_100%)]" />
      <div className="absolute inset-0 -z-10 bg-hero-grid bg-[size:24px_24px] opacity-30" />

      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => useUiStore.getState().setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-slate-950/60 backdrop-blur-sm md:hidden"
        />
      ) : null}

      <div className="flex">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Header />
          <main className="flex-1 px-4 pb-8 pt-4 md:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300 shadow-glow backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">MediAI clinical workspace</p>
                    <p className="text-slate-400">
                      Structured for drug lookup, patient context, and AI-assisted evaluation.
                    </p>
                  </div>
                  <div className="hidden rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-200 md:block">
                    {sidebarOpen ? "Navigation open" : "Navigation collapsed"}
                  </div>
                </div>
              </div>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
