import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { dashboardKeys } from "@/hooks/useDashboard";

interface RiskCount {
  label: string;
  count: number;
  color: string;
}

export const RiskDistributionChart = () => {
  const query = useQuery({
    queryKey: dashboardKeys.riskDistribution,
    queryFn: async (): Promise<RiskCount[]> => {
      const res = await apiClient.get("/ai/evaluations", {
        params: { page: 0, size: 200, sort: "createdAt,desc" },
      });
      const items: any[] = res.data.content ?? res.data.data ?? [];
      let high = 0;
      let moderate = 0;
      let low = 0;
      items.forEach((e) => {
        const r = (e.riskLevel ?? "").toLowerCase();
        if (r === "high") high++;
        else if (r === "moderate" || r === "medium") moderate++;
        else low++;
      });
      return [
        { label: "Cao", count: high, color: "bg-rose-500" },
        { label: "Trung bình", count: moderate, color: "bg-amber-500" },
        { label: "Thấp", count: low, color: "bg-emerald-600" },
      ];
    },
  });

  const data = query.data ?? [
    { label: "Cao", count: 0, color: "bg-rose-500" },
    { label: "Trung bình", count: 0, color: "bg-amber-500" },
    { label: "Thấp", count: 0, color: "bg-emerald-600" },
  ];
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Phân bố Rủi ro Đánh giá</h3>
        <span className="text-xs font-medium text-slate-400">Tất cả thời gian</span>
      </div>

      {query.isLoading ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-400">Đang tải...</div>
      ) : (
        <div className="flex h-64 items-end gap-6 px-4">
          {data.map((cat) => (
            <div key={cat.label} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-sm font-black text-slate-700">{cat.count}</span>
              <div
                className={`w-full ${cat.color} rounded-t-lg transition-all duration-700`}
                style={{ height: `${Math.max((cat.count / maxCount) * 200, cat.count > 0 ? 20 : 4)}px` }}
              />
              <span className="text-xs font-bold text-slate-500">{cat.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
