import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import type { ActivityItem } from "../components/Dashbord/RecentActivity";
import { dashboardKeys } from "./useDashboard";

export const useActivityLogs = () => {
  const query = useQuery({
    queryKey: dashboardKeys.activities,
    queryFn: async (): Promise<ActivityItem[]> => {
      const response = await apiClient.get("/activity-logs", {
        params: { page: 0, size: 8, sort: "createdAt,desc" },
      });
      const body = response.data;
      const logs: any[] = body.content ?? body.data ?? [];
      return logs.map((log) => {
        const time = log.createdAt
          ? new Date(log.createdAt).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
            })
          : "";
        const action = log.action ?? log.actionType ?? "Hoạt động";
        const detail = log.detail ?? log.details ?? "";
        return {
          id: String(log.id),
          title: detail ? `${action}: ${detail}` : action,
          time,
        };
      });
    },
  });

  return { activities: query.data ?? [], loading: query.isLoading, error: query.error };
};
