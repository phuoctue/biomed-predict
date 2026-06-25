import { apiClient } from "../lib/api-client";

export interface DashboardQuery {
  dateFrom?: string;
  dateTo?: string;
}

export const fetchDashboardOverview = async () => {
  const response = await apiClient.get("/dashboard/overview");
  return response.data;
};

export const fetchDashboardStatistics = async (params: DashboardQuery) => {
  const response = await apiClient.get("/dashboard/statistics", { params });
  return response.data;
};

export const fetchDashboardCharts = async (params: DashboardQuery) => {
  const response = await apiClient.get("/dashboard/charts", { params });
  return response.data;
};
