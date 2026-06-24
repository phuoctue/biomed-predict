import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface DrugStats {
  total: number;
}

export const StatsSection = () => {
  const query = useQuery({
    queryKey: ["drugs", "stats"],
    queryFn: async (): Promise<DrugStats> => {
      const res = await apiClient.get("/drugs", { params: { page: 0, size: 1 } });
      return { total: res.data.totalElements ?? res.data.data?.totalElements ?? 0 };
    },
  });

  const total = query.data?.total ?? 0;
  const items = [
    { title: "Tổng mặt hàng", value: total.toLocaleString("vi-VN"), color: "text-slate-900" },
    { title: "Đang lưu hành", value: "—", color: "text-emerald-600" },
    { title: "Ngừng lưu hành", value: "—", color: "text-amber-600" },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
      {items.map((item, idx) => (
        <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.title}</p>
          <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
};
