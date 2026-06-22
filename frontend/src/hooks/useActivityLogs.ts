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

        const response = await apiClient.get("/activity-logs", {
          params: { page: 0, size: 5, sort: "createdAt,desc" },
        });

        if (cancelled) return;

        if (response.data && response.data.success) {
          const logs = response.data.data || [];
          const mapped: ActivityItem[] = logs.map((log: any) => {
            const time = new Date(log.createdAt).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
            });
            return {
              id: log.id,
              title: `${log.actionType} - ${log.entityType} bởi ${log.userName}`,
              time,
            };
          });
          setActivities(mapped);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch activity logs:", err);
          setActivities([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchLogs();
    return () => {
      cancelled = true;
    };
  }, []);

  return { activities, loading };
};
