import React, { useState } from "react";
import { Activity, BarChart3, Eye, FileClock, Pill, RefreshCw } from "lucide-react";
import { UsageChartItem } from "@/services/usage-statistics.service";
import { useUsageStatistics } from "@/hooks/useUsageStatistics";

const icons = [Pill, Eye, BarChart3, Activity];

const BarList = ({ title, items }: { title: string; items: UsageChartItem[] }) => {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-sm font-bold text-slate-800">{title}</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between gap-3 text-xs">
              <span className="truncate font-bold text-slate-600">{item.label}</span>
              <span className="font-black text-slate-800">{item.value.toLocaleString("vi-VN")}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${Math.max(6, (item.value / maxValue) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const UsageStatisticsPage = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const { metrics, pageViews, drugViews, actions, logs, loading, error, refetch } = useUsageStatistics({
    dateFrom,
    dateTo
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">DSE-106</p>
          <h1 className="text-2xl font-bold text-slate-800">Thống kê sử dụng</h1>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi lượt xem thuốc, trang truy cập nhiều và các hành động người dùng trong hệ thống.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:flex-row">
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-slate-400">
            Từ ngày
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-700 outline-none focus:border-blue-400"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-slate-400">
            Đến ngày
            <input
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-700 outline-none focus:border-blue-400"
            />
          </label>
          <button
            onClick={refetch}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={16} />
            Tải lại
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = icons[index] ?? Activity;
          return (
            <div key={metric.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Icon size={22} />
                </div>
                {loading && <span className="text-[10px] font-bold uppercase text-slate-300">Đang tải</span>}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{metric.label}</p>
              <p className="mt-1 text-3xl font-black text-slate-900">{metric.value.toLocaleString("vi-VN")}</p>
            </div>
          );
        })}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <BarList title="Trang truy cập nhiều" items={pageViews} />
        <BarList title="Thuốc được xem nhiều" items={drugViews} />
        <BarList title="Hành động người dùng" items={actions} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 p-5">
          <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
            <FileClock size={18} />
          </div>
          <h2 className="text-sm font-bold text-slate-800">Hoạt động gần đây</h2>
        </div>
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">Đang tải hoạt động...</div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">Chưa có dữ liệu hoạt động trong khoảng lọc.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <tr>
                <th className="p-4">Người dùng</th>
                <th className="p-4">Hành động</th>
                <th className="p-4">Đối tượng</th>
                <th className="p-4">Thời gian</th>
                <th className="p-4">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="transition hover:bg-slate-50">
                  <td className="p-4 text-sm font-bold text-slate-800">{log.userName ?? "--"}</td>
                  <td className="p-4 text-sm text-slate-600">{log.action ?? "--"}</td>
                  <td className="p-4 text-sm text-slate-600">{log.entityType ?? log.page ?? "--"}</td>
                  <td className="p-4 text-sm text-slate-500">
                    {log.createdAt ? new Date(log.createdAt).toLocaleString("vi-VN") : "--"}
                  </td>
                  <td className="p-4 text-sm text-slate-500">{log.ipAddress ?? "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
