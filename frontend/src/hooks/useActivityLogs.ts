import { useState, useEffect } from "react";
import { apiClient } from "../lib/api-client";
import type { ActivityItem } from "../components/Dashbord/RecentActivity";

export const useActivityLogs = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // BE trả PageResponse: { content, totalElements, ... }
        const response = await apiClient.get("/activity-logs", {
          params: { page: 0, size: 8, sort: "createdAt,desc" },
        });
        if (cancelled) return;
        const body = response.data;
        const logs: any[] = body.content ?? body.data ?? [];
        const mapped: ActivityItem[] = logs.map((log) => {
          const time = log.createdAt
            ? new Date(log.createdAt).toLocaleString("vi-VN", {
                hour: "2-digit", minute: "2-digit",
                day: "2-digit", month: "2-digit",
              })
            : "";
          // BE trả về action / actionType tuỳ controller
          const action = log.action ?? log.actionType ?? "Hoạt động";
          const detail = log.detail ?? log.details ?? "";
          return {
            id: String(log.id),
            title: detail ? `${action}: ${detail}` : action,
            time,
          };
        });
        setActivities(mapped);
      } catch {
        if (!cancelled) setActivities([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchLogs();
    return () => { cancelled = true; };
  }, []);

  return { activities, loading };
};
