  import { useState, useEffect } from "react";
  import { apiClient } from "../lib/api-client";
  import { PatientInfo, Interaction, PrescribedDrug } from "../types/evaluation";

  export const useEvaluation = (patientId: string) => {
    const [data, setData] = useState<{
      patient: PatientInfo | null;
      interactions: Interaction[];
      drugs: PrescribedDrug[];
    }>({ patient: null, interactions: [], drugs: [] });
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await apiClient.get(`/ai-evaluations/latest`, { params: { patientId } });
          setData(response.data.data);
        } catch (error) {
          console.error("API Error", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [patientId]);

    return { ...data, loading };
  };