import { Bell, Menu, MoonStar, Search, SunMedium } from "lucide-react";
import { useAuthStore } from "../../features/auth/store/auth.store";
import { useUiStore } from "../../features/ui/store/ui.store";

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const theme = useUiStore((state) => state.theme);
  const toggleTheme = useUiStore((state) => state.toggleTheme);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-4 md:px-6 lg:px-8">
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10 md:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <label className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 shadow-glow">
          <Search className="h-4 w-4 text-cyan-300" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            placeholder="Search patients, drug names, dosage, interaction notes..."
          />
        </label>

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </button>

        <button
          type="button"
          className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 md:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-sm font-semibold text-slate-950">
            {user?.fullName?.slice(0, 1) ?? "M"}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-white">{user?.fullName ?? "Medical operator"}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{user?.role ?? "Doctor"}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

