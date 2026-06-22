import { useState, useEffect } from "react";
import { StatsOverview } from "@/components/Dashbord/StatsOverview";
import { RiskDistributionChart } from "@/components/Dashbord/RiskDistributionChart";
import { RecentActivity } from "@/components/Dashbord/RecentActivity";
import { PatientEvaluationTable, EvaluationRow } from "@/components/Dashbord/PatientEvaluationTable";
import { useDashboard } from "@/hooks/useDashboard";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export const DashboardPage = () => {
  const { stats, loading: loadingStats } = useDashboard();
  const { activities, loading: loadingActivities } = useActivityLogs();

  // Fetch recent evaluations
  const [recentEvals, setRecentEvals] = useState<EvaluationRow[]>([]);
  const [loadingEvals, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchEvals = async () => {
      try {
        const response = await apiClient.get("/stats/recent-evaluations", {
          params: { limit: 10 },
        });

        if (cancelled) return;

        if (response.data && response.data.success) {
          const rows: EvaluationRow[] = (response.data.data || []).map((e: any) => ({
            id: String(e.id),
            patientName: e.patientName || "N/A",
            date: new Date(e.date).toLocaleDateString("vi-VN"),
            riskLevel: (e.riskLevel as EvaluationRow["riskLevel"]) || "LOW",
          }));
          setRecentEvals(rows);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch recent evaluations:", err);
          setRecentEvals([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchEvals();
    return () => {
      cancelled = true;
    };
  }, []);

  const loading = loadingStats || loadingActivities || loadingEvals;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Bảng điều khiển tổng quan</h1>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <>
          {/* 1. Hàng thống kê */}
          <StatsOverview
            totalPatients={stats.patients}
            totalEvaluations={stats.evaluations}
            totalWarnings={stats.warningsCount}
          />

          {/* 2. Grid Biểu đồ & Hoạt động */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <RiskDistributionChart />
            </div>
            <div className="lg:col-span-1">
              <RecentActivity activities={activities} />
            </div>
          </div>

          {/* 3. Bảng dữ liệu chi tiết */}
          <div className="mt-6">
            <PatientEvaluationTable rows={recentEvals} />
          </div>
        </>
      )}
    </div>
  );
};
