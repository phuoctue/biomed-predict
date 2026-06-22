interface StatsCardProps { title: string; value: string; trend?: string; color: string; }

export const StatsCard = ({ title, value, trend, color }: StatsCardProps) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
    <h3 className="text-3xl font-black text-slate-800 mt-2">{value}</h3>
    {trend && <p className={`text-xs font-bold mt-1 ${color}`}>{trend}</p>}
  </div>
);