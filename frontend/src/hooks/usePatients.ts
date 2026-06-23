import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../lib/api-client";

interface Patient {
  id: string;
  mrn: string;
  fullName: string;
  diagnosis?: string;
}

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get("/patients", {
        params: {
          page: 0,
          size: 100,
          sort: "fullName,asc"
        }
      });

      if (response.data && response.data.success) {
        setPatients(response.data.content || []); // Backend uses 'content' not 'data'
      }
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      setError("Không thể tải danh sách bệnh nhân");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return { patients, loading, error, refetch: fetchPatients };
};
