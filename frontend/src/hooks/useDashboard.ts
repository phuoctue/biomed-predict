import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";

export interface DashboardStats {
  users: number;
  patients: number;
  evaluations: number;
  warningsCount: number;
}

type DashboardResponse = {
  success?: boolean;
  data?: {
    users?: number;
    patients?: number;
    evaluations?: number;
    warningsCount?: number;
    warnings?: number;
  };
};

export const dashboardKeys = {
  stats: ["dashboard", "stats"] as const,
  activities: ["dashboard", "activities"] as const,
  recentEvaluations: ["dashboard", "recent-evaluations"] as const,
  riskDistribution: ["dashboard", "risk-distribution"] as const,
};

export const useDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: async (): Promise<DashboardStats> => {
      const [patientsRes, evalsRes, statsRes] = await Promise.allSettled([
        apiClient.get("/patients", { params: { page: 0, size: 1 } }),
        apiClient.get("/ai/evaluations", { params: { page: 0, size: 1 } }),
        apiClient.get<DashboardResponse>("/stats/dashboard"),
      ]);

      let patients = 0;
      let evaluations = 0;
      let warningsCount = 0;
      let users = 0;

      if (patientsRes.status === "fulfilled") {
        const body = patientsRes.value.data;
        patients = body.totalElements ?? body.data?.totalElements ?? 0;
      }

      if (evalsRes.status === "fulfilled") {
        const body = evalsRes.value.data;
        evaluations = body.totalElements ?? body.data?.totalElements ?? 0;
      }

      if (statsRes.status === "fulfilled" && statsRes.value.data?.success) {
        const d = statsRes.value.data.data;
        users = d?.users ?? 0;
        patients = d?.patients ?? patients;
        evaluations = d?.evaluations ?? evaluations;
        warningsCount = d?.warningsCount ?? d?.warnings ?? 0;
      }

      return { users, patients, evaluations, warningsCount };
    },
  });
};
