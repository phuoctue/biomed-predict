import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

interface RoleCount { role: string; count: number; }

const ROLE_LABEL: Record<string, string> = {
  DOCTOR: "Bác sĩ", PHARMACIST: "Dược sĩ",
  ADMIN: "Quản trị", MEDICAL_STAFF: "Nhân viên",
};
const ROLE_COLOR: Record<string, string> = {
  DOCTOR: "bg-blue-600", PHARMACIST: "bg-emerald-600",
  ADMIN: "bg-violet-600", MEDICAL_STAFF: "bg-slate-400",
};

export const RoleDistributionChart = () => {
  const [roles, setRoles]   = useState<RoleCount[]>([]);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/users?page=0&size=200")
      .then((res) => {
        const users: any[] = res.data.content ?? res.data.data ?? [];
        const map: Record<string, number> = {};
        users.forEach((u) => { const r = u.role ?? "MEDICAL_STAFF"; map[r] = (map[r] ?? 0) + 1; });
        setRoles(Object.entries(map).map(([role, count]) => ({ role, count })));
        setTotal(users.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-900 text-sm">Phân bổ Vai trò</h3>
      <p className="text-[10px] text-slate-500 mb-6 font-medium">Tỷ lệ nhân sự theo chức năng chuyên môn.</p>
      <div className="flex justify-center my-6">
        <div className="h-32 w-32 rounded-full border-[10px] border-blue-600 flex flex-col items-center justify-center">
          <span className="font-black text-3xl text-slate-900">{loading ? "..." : total}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tổng</span>
        </div>
      </div>
      <div className="space-y-3 text-xs text-slate-700 font-medium">
        {loading ? (
          <p className="text-slate-400 text-center text-xs">Đang tải...</p>
        ) : roles.map(({ role, count }) => (
          <div key={role} className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${ROLE_COLOR[role] ?? "bg-slate-400"}`}></span>
              {ROLE_LABEL[role] ?? role}
            </span>
            <span className="font-bold text-slate-900">
              {total > 0 ? `${Math.round((count / total) * 100)}%` : "0%"}
              <span className="text-slate-400 font-normal ml-1">({count})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
