import { useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  const [open, setOpen] = useState(true);
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <div className="flex min-h-screen text-slate-800 dark:text-slate-100">
      <Sidebar open={open} />
      <div className="flex flex-1 flex-col">
        <Header onToggleSidebar={() => setOpen((v) => !v)} dark={dark} toggleDark={toggleDark} />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
