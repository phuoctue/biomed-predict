import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ClipboardCheck,
  FileText,
  Pill,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { DashboardChartItem, DashboardMetric, useDashboard } from "@/hooks/useDashboard";

const metricIcons = {
  patients: Users,
  prescriptions: Pill,
  aiEvaluations: Sparkles,
  highRiskAlerts: AlertTriangle,
  dispensed: ClipboardCheck,
  medicalRecords: FileText
};

const metricTone = {
  patients: "bg-blue-50 text-blue-600",
  prescriptions: "bg-violet-50 text-violet-600",
  aiEvaluations: "bg-cyan-50 text-cyan-600",
  highRiskAlerts: "bg-rose-50 text-rose-600",
  dispensed: "bg-emerald-50 text-emerald-600",
  medicalRecords: "bg-amber-50 text-amber-600"
};

const RiskBadge = ({ value }: { value?: string }) => {
  const normalized = (value ?? "--").toUpperCase();
  const className =
    normalized.includes("HIGH") || normalized.includes("CAO")
      ? "border-rose-100 bg-rose-50 text-rose-700"
      : normalized.includes("MEDIUM") || normalized.includes("TRUNG")
        ? "border-amber-100 bg-amber-50 text-amber-700"
        : "border-emerald-100 bg-emerald-50 text-emerald-700";

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${className}`}>
      {normalized}
    </span>
  );
};

const MetricCard = ({ metric, loading }: { metric: DashboardMetric; loading: boolean }) => {
  const Icon = metricIcons[metric.key as keyof typeof metricIcons] ?? Activity;
  const tone = metricTone[metric.key as keyof typeof metricTone] ?? "bg-slate-100 text-slate-600";

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className={`rounded-xl p-3 ${tone}`}>
          <Icon size={22} />
        </div>
        {loading && <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Đang tải</span>}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{metric.label}</p>
      <p className="mt-1 text-3xl font-black text-slate-900">{metric.value.toLocaleString("vi-VN")}</p>
      <p className="mt-2 text-xs font-medium text-slate-500">{metric.helper}</p>
    </div>
  );
};

const BarChart = ({ title, items }: { title: string; items: DashboardChartItem[] }) => {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-sm font-bold text-slate-800">{title}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Realtime
        </span>
      </div>
      <div className="flex h-64 items-end gap-4">
        {items.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-3">
            <div className="flex h-48 w-full items-end rounded-xl bg-slate-50 px-2 pt-2">
              <div
                className="w-full rounded-t-lg bg-blue-600 transition-all"
                style={{ height: `${Math.max(6, (item.value / maxValue) * 100)}%` }}
              />
            </div>
            <div className="w-full text-center">
              <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
              <p className="text-sm font-black text-slate-800">{item.value.toLocaleString("vi-VN")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const {
    metrics,
    riskDistribution,
    prescriptionStatus,
    activities,
    evaluations,
    loading,
    error,
    refetch
  } = useDashboard({ dateFrom, dateTo });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Clinical decision support</p>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard tổng quan</h1>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi bệnh nhân, đơn thuốc, cảnh báo AI và trạng thái cấp phát trong hệ thống.
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

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.key} metric={metric} loading={loading} />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <BarChart title="Phân bổ mức rủi ro lâm sàng" items={riskDistribution} />
        <BarChart title="Trạng thái đơn thuốc" items={prescriptionStatus} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm xl:col-span-1">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
              <Activity size={18} />
            </div>
            <h2 className="text-sm font-bold text-slate-800">Hoạt động gần đây</h2>
          </div>
          {loading ? (
            <div className="py-16 text-center text-sm text-slate-400">Đang tải hoạt động...</div>
          ) : activities.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">Chưa có hoạt động mới.</div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3 rounded-xl border border-slate-100 p-3">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">{activity.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{activity.description ?? "Không có mô tả"}</p>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {activity.time ? new Date(activity.time).toLocaleString("vi-VN") : "--"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center gap-3 border-b border-slate-100 p-5">
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <ShieldCheck size={18} />
            </div>
            <h2 className="text-sm font-bold text-slate-800">Đánh giá AI gần đây</h2>
          </div>
          {loading ? (
            <div className="py-16 text-center text-sm text-slate-400">Đang tải đánh giá...</div>
          ) : evaluations.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">Chưa có đánh giá AI gần đây.</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="p-4">Bệnh nhân</th>
                  <th className="p-4">Bác sĩ</th>
                  <th className="p-4">Thời gian</th>
                  <th className="p-4">Điểm</th>
                  <th className="p-4">Rủi ro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {evaluations.map((evaluation) => (
                  <tr key={evaluation.id} className="transition hover:bg-slate-50">
                    <td className="p-4 text-sm font-bold text-slate-800">{evaluation.patientName}</td>
                    <td className="p-4 text-sm text-slate-600">{evaluation.doctorName ?? "--"}</td>
                    <td className="p-4 text-sm text-slate-500">
                      {evaluation.evaluatedAt ? new Date(evaluation.evaluatedAt).toLocaleString("vi-VN") : "--"}
                    </td>
                    <td className="p-4 text-sm font-black text-slate-800">
                      {evaluation.suitabilityScore != null ? `${evaluation.suitabilityScore}%` : "--"}
                    </td>
                    <td className="p-4">
                      <RiskBadge value={evaluation.riskLevel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
