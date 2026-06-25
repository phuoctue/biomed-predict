import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { historyKeys } from "./HistoryStats";

type TrendPoint = { label: string; count: number };

export const WeeklyTrendChart = () => {
  const query = useQuery({
    queryKey: historyKeys.trend,
    queryFn: async (): Promise<TrendPoint[]> => {
      const res = await apiClient.get("/ai/evaluations", { params: { page: 0, size: 200, sort: "createdAt,desc" } });
      const items: any[] = res.data.content ?? res.data.data ?? [];
      const buckets = new Map<string, number>();
      items.forEach((item) => {
        const date = item.createdAt ? new Date(item.createdAt) : null;
        if (!date || Number.isNaN(date.getTime())) return;
        const key = date.toLocaleDateString("vi-VN", { weekday: "short" });
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
      });
      return Array.from(buckets.entries()).map(([label, count]) => ({ label, count }));
    },
  });

  const data = query.data ?? [];
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-bold text-slate-800">Xu hướng đánh giá hàng tuần</h3>
      {query.isLoading ? (
        <div className="flex h-40 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-400">Đang tải...</div>
      ) : data.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-400">Chưa có dữ liệu xu hướng</div>
      ) : (
        <div className="flex h-40 items-end gap-2 rounded-lg bg-slate-50 p-4">
          {data.map((d) => (
            <div key={d.label} className="flex h-full w-full flex-col items-center justify-end gap-2">
              <div className="w-full rounded-t-lg bg-blue-600 transition-all hover:bg-blue-700" style={{ height: `${Math.max((d.count / max) * 100, 12)}%` }} />
              <span className="text-[10px] font-semibold text-slate-500">{d.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
