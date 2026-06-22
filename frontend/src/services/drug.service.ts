import { apiClient } from "../lib/api-client";

export interface Drug {
  id: number;
  name: string;
  code: string;
  stockQuantity?: number;
  unit?: string;
  bookmarked?: boolean;
}

export interface FetchDrugsParams {
  page: number;
  size: number;
  search?: string;
  keyword?: string;
}

export const fetchDrugs = async (params: FetchDrugsParams) => {
  const response = await apiClient.get("/drugs", {
    params: {
      ...params,
      keyword: params.keyword ?? params.search
    }
  });
  return response.data;
};

export interface DrugBookmark extends Drug {
  bookmarkId?: number;
  bookmarkedAt?: string;
  note?: string;
}

export interface FetchBookmarkedDrugsParams {
  page: number;
  size: number;
  keyword?: string;
}

export const fetchBookmarkedDrugs = async (params: FetchBookmarkedDrugsParams) => {
  const response = await apiClient.get("/drugs/bookmarks", { params });
  return response.data;
};

export const bookmarkDrug = async (drugId: number) => {
  const response = await apiClient.post(`/drugs/${drugId}/bookmark`);
  return response.data;
};

export const removeDrugBookmark = async (drugId: number) => {
  const response = await apiClient.delete(`/drugs/${drugId}/bookmark`);
  return response.data;
};
