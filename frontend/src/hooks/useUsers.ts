import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  department?: string;
}

type UsersResponse = {
  content?: User[];
  data?: User[];
  success?: boolean;
};

export const userKeys = {
  list: (params: { keyword?: string; page?: number; size?: number } = {}) => ["users", params] as const,
};

export const useUsers = (params?: { keyword?: string; page?: number; size?: number }) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async (): Promise<User[]> => {
      const response = await apiClient.get<UsersResponse>("/users", {
        params: {
          keyword: params?.keyword || undefined,
          page: params?.page ?? 0,
          size: params?.size ?? 20,
        },
      });
      return response.data.content ?? response.data.data ?? [];
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/users/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
