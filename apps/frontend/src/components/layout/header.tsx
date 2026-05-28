import { Menu, Moon, Sun } from "lucide-react";

type Props = { onToggleSidebar: () => void; dark: boolean; toggleDark: () => void };

export const Header = ({ onToggleSidebar, dark, toggleDark }: Props) => {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <button onClick={onToggleSidebar} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
        <Menu className="h-5 w-5" />
      </button>
      <button onClick={toggleDark} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
        {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    </header>
  );
};
