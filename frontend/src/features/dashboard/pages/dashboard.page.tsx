import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { StatsOverview } from "@/components/Dashbord/StatsOverview";
import { RiskDistributionChart } from "@/components/Dashbord/RiskDistributionChart";
import { RecentActivity } from "@/components/Dashbord/RecentActivity";
import { PatientEvaluationTable, EvaluationRow } from "@/components/Dashbord/PatientEvaluationTable";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { dashboardKeys, useDashboard } from "@/hooks/useDashboard";

type EvaluationItem = {
  id: string | number;
  patientName?: string;
  date?: string;
  createdAt?: string;
  riskLevel?: string;
};

export const DashboardPage = () => {
  const { data: stats, isLoading: loadingStats } = useDashboard();
  const { activities, loading: loadingActivities } = useActivityLogs();

  const recentEvaluations = useQuery({
    queryKey: dashboardKeys.recentEvaluations,
    queryFn: async (): Promise<EvaluationRow[]> => {
      const response = await apiClient.get("/ai/evaluations", {
        params: { page: 0, size: 10, sort: "createdAt,desc" },
      });
      const body = response.data;
      const items: EvaluationItem[] = body.content ?? body.data ?? [];
      return items.map((e) => {
        const raw = (e.riskLevel ?? "LOW").toUpperCase();
        const riskLevel: EvaluationRow["riskLevel"] =
          raw === "HIGH" ? "HIGH" : raw === "MODERATE" || raw === "MEDIUM" ? "MEDIUM" : "LOW";
        return {
          id: String(e.id),
          patientName: e.patientName || "N/A",
          date: new Date(e.date ?? e.createdAt ?? "").toLocaleDateString("vi-VN"),
          riskLevel,
        };
      });
    },
  });

  const loading = loadingStats || loadingActivities || recentEvaluations.isLoading;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Bảng điều khiển tổng quan</h1>

      {loading ? (
        <div className="mb-4 flex items-center gap-2 text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Đang tải dữ liệu...</span>
        </div>
      ) : null}

      <StatsOverview
        totalPatients={stats?.patients ?? 0}
        totalEvaluations={stats?.evaluations ?? 0}
        totalWarnings={stats?.warningsCount ?? 0}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RiskDistributionChart />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity activities={activities} />
        </div>
      </div>

      <div className="mt-6">
        <PatientEvaluationTable rows={recentEvaluations.data ?? []} />
      </div>
    </div>
  );
};
