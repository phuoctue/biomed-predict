import { Clock } from "lucide-react";

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4">Hoạt động gần đây</h3>
      <ul className="space-y-4">
        {activities.length === 0 ? (
          <li className="text-sm text-slate-400 italic">Chưa có hoạt động nào</li>
        ) : (
          activities.map((act) => (
            <li key={act.id} className="flex gap-3 text-sm">
              <Clock size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-700">{act.title}</p>
                <p className="text-[10px] text-slate-400">{act.time}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
