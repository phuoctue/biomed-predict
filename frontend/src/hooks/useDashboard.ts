import { useState, useEffect } from "react";
import { apiClient } from "../lib/api-client";

interface DashboardStats {
  users: number;
  patients: number;
  evaluations: number;
  warningsCount: number;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    users: 0, patients: 0, evaluations: 0, warningsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      try {
        setLoading(true);

        // Gọi song song 3 endpoints
        const [patientsRes, evalsRes, statsRes] = await Promise.allSettled([
          apiClient.get("/patients?page=0&size=1"),
          apiClient.get("/ai/evaluations?page=0&size=1"),
          apiClient.get("/stats/dashboard"),
        ]);

        if (cancelled) return;

        let patients = 0, evaluations = 0, warningsCount = 0, users = 0;

        if (patientsRes.status === "fulfilled") {
          patients = patientsRes.value.data.totalElements ?? 0;
        }
        if (evalsRes.status === "fulfilled") {
          evaluations = evalsRes.value.data.totalElements ?? 0;
        }
        if (statsRes.status === "fulfilled" && statsRes.value.data.success) {
          const d = statsRes.value.data.data;
          users         = d?.users         ?? 0;
          patients      = d?.patients      ?? patients;
          evaluations   = d?.evaluations   ?? evaluations;
          warningsCount = d?.warningsCount ?? d?.warnings ?? 0;
        }

        setStats({ users, patients, evaluations, warningsCount });
      } catch (err) {
        if (!cancelled) setError("Không thể tải thống kê");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return { stats, loading, error };
};
