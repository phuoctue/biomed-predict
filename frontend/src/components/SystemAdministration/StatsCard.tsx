import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface RoleCount {
  role: string;
  count: number;
}

const ROLE_LABEL: Record<string, string> = {
  DOCTOR: "Bác sĩ",
  PHARMACIST: "Dược sĩ",
  ADMIN: "Quản trị",
  MEDICAL_STAFF: "Nhân viên",
};
const ROLE_COLOR: Record<string, string> = {
  DOCTOR: "bg-blue-600",
  PHARMACIST: "bg-emerald-600",
  ADMIN: "bg-violet-600",
  MEDICAL_STAFF: "bg-slate-400",
};

export const RoleDistributionChart = () => {
  const query = useQuery({
    queryKey: ["users", "role-distribution"],
    queryFn: async (): Promise<{ roles: RoleCount[]; total: number }> => {
      const res = await apiClient.get("/users", { params: { page: 0, size: 200 } });
      const users: any[] = res.data.content ?? res.data.data ?? [];
      const map: Record<string, number> = {};
      users.forEach((u) => {
        const r = u.role ?? "MEDICAL_STAFF";
        map[r] = (map[r] ?? 0) + 1;
      });
      return { roles: Object.entries(map).map(([role, count]) => ({ role, count })), total: users.length };
    },
  });

  const roles = query.data?.roles ?? [];
  const total = query.data?.total ?? 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900">Phân bố Vai trò</h3>
      <p className="mb-6 text-[10px] font-medium text-slate-500">Tỷ lệ nhân sự theo chức năng chuyên môn.</p>
      <div className="my-6 flex justify-center">
        <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-[10px] border-blue-600">
          <span className="text-3xl font-black text-slate-900">{query.isLoading ? "..." : total}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tổng</span>
        </div>
      </div>
      <div className="space-y-3 text-xs font-medium text-slate-700">
        {query.isLoading ? (
          <p className="text-center text-xs text-slate-400">Đang tải...</p>
        ) : (
          roles.map(({ role, count }) => (
            <div key={role} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${ROLE_COLOR[role] ?? "bg-slate-400"}`} />
                {ROLE_LABEL[role] ?? role}
              </span>
              <span className="font-bold text-slate-900">
                {total > 0 ? `${Math.round((count / total) * 100)}%` : "0%"}
                <span className="ml-1 font-normal text-slate-400">({count})</span>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
