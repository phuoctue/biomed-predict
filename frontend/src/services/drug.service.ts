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
  drugGroup?: string;
  ingredient?: string;
  status?: string;
  advanced?: boolean;
}

export const fetchDrugs = async (params: FetchDrugsParams) => {
  const { search, advanced, ...rest } = params;
  const endpoint = advanced ? "/drugs/search/advanced" : "/drugs";
  const response = await apiClient.get(endpoint, {
    params: {
      ...rest,
      keyword: search || undefined,
    },
  });
  // BE trả về PageResponse: { success, content, totalElements, totalPages, page, size, ... }
  const body = response.data;
  return {
    data: body.content ?? body.data ?? [],
    totalElements: body.totalElements ?? 0,
    totalPages: body.totalPages ?? 0,
  };
};

export interface DrugBookmark extends Drug {
  bookmarkedAt?: string;
}

export const fetchBookmarkedDrugs = async (params: { page: number; size: number; keyword?: string }) => {
  const response = await apiClient.get("/bookmarks", { params });
  return response.data;
};

export const bookmarkDrug = async (drugId: string | number) => {
  const response = await apiClient.post(`/bookmarks/drugs/${drugId}`);
  return response.data;
};

export const removeDrugBookmark = async (drugId: string | number) => {
  const response = await apiClient.delete(`/bookmarks/drugs/${drugId}`);
  return response.data;
};

