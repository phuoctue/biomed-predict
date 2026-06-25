import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import { PatientInfo, Interaction, PrescribedDrug } from "../types/evaluation";

interface EvaluationData {
  patient: PatientInfo | null;
  interactions: Interaction[];
  drugs: PrescribedDrug[];
}

export const evaluationKeys = {
  latest: (mrn: string) => ["evaluation", "latest", mrn] as const,
};

export const useEvaluation = (mrn: string | null) => {
  const query = useQuery({
    queryKey: mrn ? evaluationKeys.latest(mrn) : ["evaluation", "latest", "empty"],
    queryFn: async (): Promise<EvaluationData> => {
      if (!mrn) {
        return { patient: null, interactions: [], drugs: [] };
      }

      const response = await apiClient.get("/ai-evaluations/latest", {
        params: { patientId: mrn },
      });

      const payload = response.data?.data;
      return {
        patient: payload?.patient ?? null,
        interactions: payload?.interactions ?? [],
        drugs: payload?.drugs ?? [],
      };
    },
    enabled: !!mrn,
  });

  return {
    patient: query.data?.patient ?? null,
    interactions: query.data?.interactions ?? [],
    drugs: query.data?.drugs ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  };
};
