import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface Stats {
  total: number;
  high: number;
  moderate: number;
  low: number;
}

export const historyKeys = {
  stats: ["history", "stats"] as const,
  list: ["history", "list"] as const,
  trend: ["history", "trend"] as const,
  completion: ["history", "completion"] as const,
};

export const HistoryStats = () => {
  const query = useQuery({
    queryKey: historyKeys.stats,
    queryFn: async (): Promise<Stats> => {
      const res = await apiClient.get("/ai/evaluations", { params: { page: 0, size: 200, sort: "createdAt,desc" } });
      const items: any[] = res.data.content ?? res.data.data ?? [];
      const total = res.data.totalElements ?? items.length;
      
      let high = 0;
      let moderate = 0;
      let low = 0;
      
      items.forEach(e => {
        const risk = (e.riskLevel ?? "").toUpperCase();
        if (risk === "HIGH" || risk === "CAO") high++;
        else if (risk === "MODERATE" || risk === "MEDIUM" || risk === "TRUNG BÌNH") moderate++;
        else if (risk === "LOW" || risk === "THẤP") low++;
      });

      return { total, high, moderate, low };
    },
  });

  const stats = query.data ?? { total: 0, high: 0, moderate: 0, low: 0 };
  const items = [
    { label: "TỔNG SỐ ĐÁNH GIÁ", value: query.isLoading ? "..." : stats.total.toLocaleString("vi-VN") },
    { label: "RỦI RO CAO", value: query.isLoading ? "..." : stats.high.toLocaleString("vi-VN") },
    { label: "TRUNG BÌNH", value: query.isLoading ? "..." : stats.moderate.toLocaleString("vi-VN") },
    { label: "ỔN ĐỊNH", value: query.isLoading ? "..." : stats.low.toLocaleString("vi-VN") },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {items.map((item, i) => (
        <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold text-slate-600">{item.label}</p>
          <h3 className="mt-2 text-3xl font-black text-slate-800">{item.value}</h3>
        </div>
      ))}
    </div>
  );
};
