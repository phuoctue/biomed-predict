import { apiClient } from "../lib/api-client";

export interface UsageStatisticsParams {
  dateFrom?: string;
  dateTo?: string;
}

export interface UsageMetric {
  label: string;
  value: number;
  change?: number;
}

export interface UsageChartItem {
  label: string;
  value: number;
}

export interface UsageLogItem {
  id: number | string;
  userName?: string;
  role?: string;
  action?: string;
  entityType?: string;
  page?: string;
  createdAt?: string;
  ipAddress?: string;
}

export const fetchDashboardStatistics = async (params: UsageStatisticsParams) => {
  const response = await apiClient.get("/stats/dashboard", { params });
  return response.data;
};

export const fetchDashboardCharts = async (params: UsageStatisticsParams) => {
  const response = await apiClient.get("/stats/charts", { params });
  return response.data;
};

export const fetchUsageAuditLogs = async (params: UsageStatisticsParams & { page: number; size: number }) => {
  const response = await apiClient.get("/activity-logs", { params });
  return response.data;
};
