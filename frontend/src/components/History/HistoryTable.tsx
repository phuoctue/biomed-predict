import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { historyKeys } from "./HistoryStats";

interface EvalRow {
  id: string;
  patientName: string;
  mrn: string;
  drugName: string;
  riskLevel: string;
  createdAt: string;
}

const riskLabel: Record<string, { text: string; cls: string }> = {
  high: { text: "CAO", cls: "bg-rose-100 text-rose-600" },
  moderate: { text: "TRUNG BÌNH", cls: "bg-amber-100 text-amber-700" },
  low: { text: "THẤP", cls: "bg-emerald-100 text-emerald-600" },
};

export const HistoryTable = () => {
  const query = useQuery({
    queryKey: historyKeys.list,
    queryFn: async (): Promise<EvalRow[]> => {
      const res = await apiClient.get("/ai/evaluations", {
        params: { page: 0, size: 10, sort: "createdAt,desc" },
      });
      const items: any[] = res.data.content ?? res.data.data ?? [];
      return items.map((e) => ({
        id: String(e.id),
        patientName: e.patientName ?? "—",
        mrn: String(e.patientId ?? "").slice(0, 8),
        drugName: e.drugName ?? "—",
        riskLevel: (e.riskLevel ?? "low").toLowerCase(),
        createdAt: e.createdAt ? new Date(e.createdAt).toLocaleDateString("vi-VN") : "—",
      }));
    },
  });

  if (query.isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-400 shadow-sm">
        Đang tải...
      </div>
    );
  }

  const rows = query.data ?? [];

  // Bỏ logic phân trang vì không sử dụng và gây lỗi

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="p-5 text-left">Bệnh nhân</th>
            <th className="p-5 text-left">Mã hồ sơ</th>
            <th className="p-5 text-left">Thuốc</th>
            <th className="p-5 text-left">Ngày đánh giá</th>
            <th className="p-5 text-left">Chỉ số rủi ro</th>
            <th className="p-5 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-8 text-center italic text-slate-400">
                Chưa có dữ liệu đánh giá nào
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const risk = riskLabel[row.riskLevel] ?? { text: row.riskLevel, cls: "bg-slate-100 text-slate-600" };
              return (
                <tr key={row.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="p-5 font-semibold text-slate-900">{row.patientName}</td>
                  <td className="p-5 font-mono font-medium text-slate-600">#{row.mrn}</td>
                  <td className="p-5 font-medium text-slate-700">{row.drugName}</td>
                  <td className="p-5 text-slate-600">{row.createdAt}</td>
                  <td className="p-5">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${risk.cls}`}>{risk.text}</span>
                  </td>
                  <td className="p-5 text-xs font-bold text-blue-600 hover:underline cursor-pointer">Xem chi tiết →</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
