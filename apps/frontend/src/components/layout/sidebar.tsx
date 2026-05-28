import { BrainCog, Pill, Users } from "lucide-react";

export const Sidebar = ({ open }: { open: boolean }) => {
  return (
    <aside className={`${open ? "w-64" : "w-0"} overflow-hidden border-r border-slate-200 bg-white transition-all dark:border-slate-800 dark:bg-slate-900`}>
      <div className="p-4 text-xl font-bold text-cyan-700 dark:text-cyan-300">MediAI</div>
      <nav className="space-y-1 p-3 text-sm">
        <a className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="#"><Users size={16} /> Patients</a>
        <a className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="#"><Pill size={16} /> Drugs</a>
        <a className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="#"><BrainCog size={16} /> AI Evaluation</a>
      </nav>
    </aside>
  );
};
