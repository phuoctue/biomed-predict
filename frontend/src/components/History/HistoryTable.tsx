import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

interface EvalRow {
  id: string;
  patientName: string;
  mrn: string;
  riskLevel: string;
  createdAt: string;
}

const riskLabel: Record<string, { text: string; cls: string }> = {
  high:     { text: "CAO",       cls: "bg-rose-100 text-rose-600" },
  moderate: { text: "TRUNG BÌNH",cls: "bg-amber-100 text-amber-700" },
  low:      { text: "THẤP",      cls: "bg-emerald-100 text-emerald-600" },
};

export const HistoryTable = () => {
  const [rows, setRows] = useState<EvalRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/ai/evaluations?page=0&size=10&sort=createdAt,desc")
      .then((res) => {
        const items: any[] = res.data.content ?? res.data.data ?? [];
        setRows(items.map((e) => ({
          id: String(e.id),
          patientName: e.patientName ?? "—",
          mrn: String(e.patientId ?? "").slice(0, 8),
          riskLevel: (e.riskLevel ?? "low").toLowerCase(),
          createdAt: e.createdAt
            ? new Date(e.createdAt).toLocaleDateString("vi-VN")
            : "—",
        })));
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center text-slate-400 text-sm">
      Đang tải...
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50/50 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
          <tr>
            <th className="p-5 text-left">Bệnh nhân</th>
            <th className="p-5 text-left">Mã hồ sơ</th>
            <th className="p-5 text-left">Ngày đánh giá</th>
            <th className="p-5 text-left">Chỉ số rủi ro</th>
            <th className="p-5 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                Chưa có dữ liệu đánh giá nào
              </td>
            </tr>
          ) : rows.map((row) => {
            const risk = riskLabel[row.riskLevel] ?? { text: row.riskLevel, cls: "bg-slate-100 text-slate-600" };
            return (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-5 font-semibold text-slate-900">{row.patientName}</td>
                <td className="p-5 text-slate-600 font-medium font-mono">#{row.mrn}</td>
                <td className="p-5 text-slate-600">{row.createdAt}</td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${risk.cls}`}>
                    {risk.text}
                  </span>
                </td>
                <td className="p-5 text-blue-600 font-bold cursor-pointer hover:underline text-xs">
                  Xem chi tiết →
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
