import { Clock } from "lucide-react";

export const RecentActivity = () => {
  const activities = [
    { title: "Đánh giá mới: Bệnh nhân #0921", time: "5 phút trước" },
    { title: "Cảnh báo tương tác thuốc", time: "12 phút trước" },
    { title: "Cập nhật phác đồ điều trị", time: "45 phút trước" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4">Hoạt động gần đây</h3>
      <ul className="space-y-4">
        {activities.map((act, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <Clock size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-700">{act.title}</p>
              <p className="text-[10px] text-slate-400">{act.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};