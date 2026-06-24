import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { historyKeys } from "./HistoryStats";

export const CompletionStatus = () => {
  const query = useQuery({
    queryKey: historyKeys.completion,
    queryFn: async (): Promise<number> => {
      const res = await apiClient.get("/ai/evaluations", { params: { page: 0, size: 50, sort: "createdAt,desc" } });
      const items: any[] = res.data.content ?? res.data.data ?? [];
      if (items.length === 0) return 0;
      const completed = items.filter((item) => item.status === "COMPLETED" || item.status === "approved" || item.riskLevel).length;
      return Math.round((completed / items.length) * 100);
    },
  });

  const percent = query.data ?? 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-bold text-slate-800">Trạng thái hoàn thành hồ sơ</h3>
      <div className="flex items-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-emerald-500 text-xl font-black text-slate-400">
          {query.isLoading ? "..." : `${percent}%`}
        </div>
        <p className="text-xs text-slate-500">
          {query.isLoading ? "Đang tính toán..." : `Tỷ lệ hồ sơ đánh giá hoàn thành từ dữ liệu AI hiện có.`}
        </p>
      </div>
    </div>
  );
};
