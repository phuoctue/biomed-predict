import { apiClient } from "../lib/api-client";

// Định nghĩa kiểu dữ liệu cho thuốc để tránh lỗi 'any'
export interface Drug {
  id: number;
  name: string;
  code: string;
  stockQuantity: number;
  unit: string;
}

export interface FetchDrugsParams {
  page: number;
  size: number;
  search?: string; // Thêm search là tùy chọn
}

export const fetchDrugs = async (params: FetchDrugsParams) => {
  const response = await apiClient.get("/drugs", { params });
  return response.data; // Giả sử response có dạng { data: Drug[], totalPages: number, totalElements: number }
};