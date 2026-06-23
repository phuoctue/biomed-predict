import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

interface DrugStats {
  total: number;
}

export const StatsSection = () => {
  const [stats, setStats] = useState<DrugStats>({ total: 0 });

  useEffect(() => {
    apiClient.get("/drugs?page=0&size=1").then((res) => {
      setStats({ total: res.data.totalElements ?? 0 });
    }).catch(() => {});
  }, []);

  const items = [
    { title: "Tổng mặt hàng", value: stats.total.toLocaleString("vi-VN"), color: "text-slate-900" },
    { title: "Đang lưu hành", value: "—", color: "text-emerald-600" },
    { title: "Ngừng lưu hành", value: "—", color: "text-amber-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{item.title}</p>
          <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
};
