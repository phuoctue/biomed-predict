import { Download, Filter } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { CompletionStatus } from "@/components/History/CompletionStatus";
import { HistoryStats, historyKeys } from "@/components/History/HistoryStats";
import { HistoryTable } from "@/components/History/HistoryTable";
import { WeeklyTrendChart } from "@/components/History/WeeklyTrendChart";
import { useState } from "react";

export const HistoryPage = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const exportQuery = useQuery({
    queryKey: [...historyKeys.list, "export"],
    queryFn: async () => {
      const res = await apiClient.get("/ai/evaluations", {
        params: { page: 0, size: 200, sort: "createdAt,desc" },
      });
      return (res.data.content ?? res.data.data ?? []) as any[];
    },
    enabled: false,
  });

  const handleExport = async () => {
    const rows = await exportQuery.refetch();
    const items = rows.data ?? [];
    const header = ["id", "patientName", "patientId", "riskLevel", "createdAt"];
    const csv = [
      header.join(","),
      ...items.map((item) =>
        [
          item.id ?? "",
          `"${String(item.patientName ?? "").replace(/"/g, '""')}"`,
          item.patientId ?? "",
          item.riskLevel ?? "",
          item.createdAt ?? "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `history-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-800">Lịch sử Đánh Giá</h1>
          <p className="text-sm font-medium text-slate-500">Xem lại và quản lý các đánh giá lâm sàng đã được thực hiện.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update as [Date | null, Date | null])}
              placeholderText="mm/dd/yyyy - mm/dd/yyyy"
              className="w-64 cursor-pointer rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              calendarClassName="rounded-2xl border-none p-2 shadow-xl"
              dateFormat="MM/dd/yyyy"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">📅</span>
            <Filter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          </div>

          <button onClick={handleExport} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95">
            <Download size={16} />
            Xuất Báo Cáo
          </button>
        </div>
      </div>

      <HistoryStats />
      <div className="mt-2">
        <HistoryTable />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WeeklyTrendChart />
        <CompletionStatus />
      </div>
    </div>
  );
};
