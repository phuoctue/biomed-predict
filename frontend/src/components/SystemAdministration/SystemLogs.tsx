import { CheckCircle2, LogIn, AlertTriangle } from "lucide-react";

export const SystemLogs = () => {
  const logs = [
    { icon: CheckCircle2, color: "text-emerald-600", title: "Cập nhật bộ quy tắc v2.4", time: "10:45 SA - 24/10/2023" },
    { icon: LogIn, color: "text-blue-600", title: "Admin đã đăng nhập từ IP: 192.168.1.45", time: "09:12 SA - 24/10/2023" },
    { icon: AlertTriangle, color: "text-red-600", title: "Phát hiện truy cập bất thường", time: "Hôm qua - 23:30 CH" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800">Nhật ký HS thống</h3>
        <button className="text-xs text-blue-600 font-bold">Xem tất cả</button>
      </div>
      <div className="space-y-6">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-4">
            <log.icon size={20} className={log.color} />
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">{log.title}</p>
              <p className="text-[10px] text-slate-400 mt-1">{log.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};