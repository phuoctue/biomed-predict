import { apiClient } from "../lib/api-client";

export interface Drug {
  id: string;           // UUID
  name: string;
  code: string;
  genericName?: string;
  drugGroup?: string;
  strength?: string;
  unit?: string;
  status?: string;
  stockQuantity?: number;
}

export interface FetchDrugsParams {
  page: number;
  size: number;
  search?: string;
}

export const fetchDrugs = async (params: FetchDrugsParams) => {
  const { search, ...rest } = params;
  const response = await apiClient.get("/drugs", {
    params: { ...rest, keyword: search || undefined },
  });
  // BE trả về PageResponse: { success, content, totalElements, totalPages, page, size, ... }
  const body = response.data;
  return {
    data: body.content ?? body.data ?? [],
    totalElements: body.totalElements ?? 0,
    totalPages: body.totalPages ?? 0,
  };
};