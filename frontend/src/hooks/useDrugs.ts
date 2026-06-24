import { useQuery } from "@tanstack/react-query";
import { fetchDrugs, type Drug } from "@/services/drug.service";

export const drugKeys = {
  list: (params: { page: number; searchQuery: string; drugGroup?: string; ingredient?: string; status?: string; advanced?: boolean }) =>
    ["drugs", params] as const,
};

export const useDrugs = (
  page: number,
  searchQuery: string,
  filters?: { drugGroup?: string; ingredient?: string; status?: string; advanced?: boolean }
) => {
  const query = useQuery({
    queryKey: drugKeys.list({ page, searchQuery, ...filters }),
    queryFn: async () =>
      fetchDrugs({
        page,
        size: 10,
        search: searchQuery,
        drugGroup: filters?.drugGroup,
        ingredient: filters?.ingredient,
        status: filters?.status,
        advanced: filters?.advanced,
      }),
  });

  return {
    drugs: query.data?.data ?? [],
    loading: query.isLoading,
    total: query.data?.totalElements ?? 0,
    totalPages: query.data?.totalPages ?? 0,
    refetch: query.refetch,
  };
};

export type { Drug };
