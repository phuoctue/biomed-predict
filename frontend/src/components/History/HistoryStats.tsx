import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

interface Stats { total: number; high: number; moderate: number; low: number; }

export const HistoryStats = () => {
  const [stats, setStats] = useState<Stats>({ total: 0, high: 0, moderate: 0, low: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/ai/evaluations?page=0&size=1")
      .then((res) => {
        const total = res.data.totalElements ?? 0;
        setStats({ total, high: 0, moderate: 0, low: 0 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const items = [
    { label: "TỔNG SỐ ĐÁNH GIÁ", value: loading ? "..." : stats.total.toLocaleString("vi-VN"), trend: null },
    { label: "RỦI RO CAO",       value: loading ? "..." : "—", trend: null },
    { label: "TRUNG BÌNH",       value: loading ? "..." : "—", trend: null },
    { label: "ỔN ĐỊNH",          value: loading ? "..." : "—", trend: null },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {items.map((item, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-600">{item.label}</p>
          <h3 className="text-3xl font-black text-slate-800 mt-2">{item.value}</h3>
        </div>
      ))}
    </div>
  );
};
