import { useState, useEffect } from "react";
import { apiClient } from "../lib/api-client";
import { PatientInfo, Interaction, PrescribedDrug } from "../types/evaluation";

interface EvaluationData {
  patient: PatientInfo | null;
  interactions: Interaction[];
  drugs: PrescribedDrug[];
}

export const useEvaluation = (mrn: string | null) => {
  const [data, setData] = useState<EvaluationData>({
    patient: null,
    interactions: [],
    drugs: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mrn) {
      setData({ patient: null, interactions: [], drugs: [] });
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get("/ai-evaluations/latest", {
          params: { patientId: mrn },
        });

        if (cancelled) return;

        // Backend returns ApiResponse.ok() → { success, message, data: { patient, interactions, drugs } }
        const payload = response.data?.data;
        if (payload) {
          setData({
            patient: payload.patient ?? null,
            interactions: payload.interactions ?? [],
            drugs: payload.drugs ?? [],
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch evaluation:", err);
          setError("Không thể tải kết quả đánh giá");
          setData({ patient: null, interactions: [], drugs: [] });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [mrn]);

  return { ...data, loading, error };
};
