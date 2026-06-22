import { useState, useEffect } from "react";
import { apiClient } from "../lib/api-client";

interface DashboardStats {
  users: number;
  patients: number;
  evaluations: number;
}

interface DashboardData {
  stats: DashboardStats;
  warningsCount: number;
}

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData>({
    stats: { users: 0, patients: 0, evaluations: 0 },
    warningsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get("/stats/dashboard");

        if (cancelled) return;

        if (response.data && response.data.success) {
          const payload = response.data.data;
          setData({
            stats: {
              users: payload.users || 0,
              patients: payload.patients || 0,
              evaluations: payload.evaluations || 0,
            },
            warningsCount: payload.warningsCount || 0,
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch dashboard:", err);
          setError("Không thể tải thống kê");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...data, loading, error };
};
