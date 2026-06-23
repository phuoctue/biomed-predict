import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

interface RiskCount { label: string; count: number; color: string; }

export const RiskDistributionChart = () => {
  const [data, setData] = useState<RiskCount[]>([
    { label: "Cao",        count: 0, color: "bg-rose-500" },
    { label: "Trung bình", count: 0, color: "bg-amber-500" },
    { label: "Thấp",       count: 0, color: "bg-emerald-600" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy tất cả evaluations (tối đa 200 để đếm risk)
    apiClient.get("/ai/evaluations?page=0&size=200")
      .then((res) => {
        const items: any[] = res.data.content ?? res.data.data ?? [];
        let high = 0, moderate = 0, low = 0;
        items.forEach((e) => {
          const r = (e.riskLevel ?? "").toLowerCase();
          if (r === "high")           high++;
          else if (r === "moderate")  moderate++;
          else                        low++;
        });
        setData([
          { label: "Cao",        count: high,     color: "bg-rose-500" },
          { label: "Trung bình", count: moderate, color: "bg-amber-500" },
          { label: "Thấp",       count: low,      color: "bg-emerald-600" },
        ]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800">Phân bổ Rủi ro Đánh giá</h3>
        <span className="text-xs text-slate-400 font-medium">Tất cả thời gian</span>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Đang tải...</div>
      ) : (
        <div className="h-64 flex items-end gap-6 px-4">
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
