import { useEffect, useState } from "react";
import { CheckCircle2, LogIn, AlertTriangle, Activity } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface LogEntry { id: string; action: string; detail: string; time: string; }

const getIcon = (action: string) => {
  if (action.includes("đăng nhập") || action.includes("Login")) return LogIn;
  if (action.includes("cảnh báo") || action.includes("Alert")) return AlertTriangle;
  if (action.includes("Cập nhật") || action.includes("Update")) return CheckCircle2;
  return Activity;
};
const getColor = (action: string) => {
  if (action.includes("cảnh báo") || action.includes("Alert")) return "text-red-600";
  if (action.includes("đăng nhập") || action.includes("Login")) return "text-blue-600";
  return "text-emerald-600";
};

export const SystemLogs = () => {
  const [logs, setLogs]     = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/activity-logs?page=0&size=5&sort=createdAt,desc")
      .then((res) => {
        const items: any[] = res.data.content ?? res.data.data ?? [];
        setLogs(items.map((l) => ({
          id: String(l.id),
          action: l.action ?? l.actionType ?? "Hoạt động",
          detail: l.detail ?? l.details ?? "",
          time: l.createdAt
            ? new Date(l.createdAt).toLocaleString("vi-VN", { hour:"2-digit", minute:"2-digit", day:"2-digit", month:"2-digit" })
            : "",
        })));
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800">Nhật ký Hệ thống</h3>
        <button className="text-xs text-blue-600 font-bold">Xem tất cả</button>
      </div>
      {loading ? (
        <p className="text-sm text-slate-400 text-center py-4">Đang tải...</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-slate-400 italic text-center py-4">Chưa có nhật ký</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => {
            const Icon = getIcon(log.action);
            return (
              <div key={log.id} className="flex gap-4">
                <Icon size={20} className={getColor(log.action)} />
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-tight">{log.action}</p>
                  {log.detail && <p className="text-[10px] text-slate-500 mt-0.5">{log.detail}</p>}
                  <p className="text-[10px] text-slate-400 mt-0.5">{log.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
