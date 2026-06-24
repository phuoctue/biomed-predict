import { useQuery } from "@tanstack/react-query";
import { Activity, AlertTriangle, CheckCircle2, LogIn } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface LogEntry {
  id: string;
  action: string;
  detail: string;
  time: string;
}

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
  const query = useQuery({
    queryKey: ["system-logs"],
    queryFn: async (): Promise<LogEntry[]> => {
      const res = await apiClient.get("/activity-logs", { params: { page: 0, size: 5, sort: "createdAt,desc" } });
      const items: any[] = res.data.content ?? res.data.data ?? [];
      return items.map((l) => ({
        id: String(l.id),
        action: l.action ?? l.actionType ?? "Hoạt động",
        detail: l.detail ?? l.details ?? "",
        time: l.createdAt ? new Date(l.createdAt).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : "",
      }));
    },
  });

  const logs = query.data ?? [];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Nhật ký Hệ thống</h3>
        <button className="text-xs font-bold text-blue-600">Xem tất cả</button>
      </div>
      {query.isLoading ? (
        <p className="py-4 text-center text-sm text-slate-400">Đang tải...</p>
      ) : logs.length === 0 ? (
        <p className="py-4 text-center text-sm italic text-slate-400">Chưa có nhật ký</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => {
            const Icon = getIcon(log.action);
            return (
              <div key={log.id} className="flex gap-4">
                <Icon size={20} className={getColor(log.action)} />
                <div>
                  <p className="text-sm font-bold leading-tight text-slate-800">{log.action}</p>
                  {log.detail ? <p className="mt-0.5 text-[10px] text-slate-500">{log.detail}</p> : null}
                  <p className="mt-0.5 text-[10px] text-slate-400">{log.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
