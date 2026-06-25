import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";

export interface Patient {
  id: string;
  mrn: string;
  fullName: string;
  diagnosis?: string;
  sex?: string;
  dateOfBirth?: string;
  citizenId?: string;
  phone?: string;
  address?: string;
  heightCm?: number;
  weightKg?: number;
  bloodType?: string;
  status?: string;
  allergies?: string;
  allergy?: string;
  latestTestName?: string;
  latestTestValue?: string;
  latestTestDate?: string;
  insuranceNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
}

type PatientsResponse = {
  content?: Patient[];
  data?: Patient[];
  totalPages?: number;
  totalElements?: number;
  success?: boolean;
};

export const patientKeys = {
  list: (params: { page: number; size: number; keyword?: string }) =>
    ["patients", params] as const,
};

export const usePatients = (params?: { page?: number; size?: number; keyword?: string }) => {
  const page = params?.page ?? 0;
  const size = params?.size ?? 100;
  const keyword = params?.keyword ?? "";

  const query = useQuery({
    queryKey: patientKeys.list({ page, size, keyword }),
    queryFn: async (): Promise<PatientsResponse> => {
      const response = await apiClient.get("/patients", {
        params: {
          page,
          size,
          sort: "fullName,asc",
          keyword: keyword || undefined,
        },
      });
      return response.data;
    },
  });

  return {
    patients: query.data?.content ?? query.data?.data ?? [],
    totalPages: query.data?.totalPages ?? 0,
    totalElements: query.data?.totalElements ?? (query.data?.content ?? query.data?.data ?? []).length,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  };
};
