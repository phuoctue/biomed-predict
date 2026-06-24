import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchDashboardCharts,
  fetchDashboardStatistics,
  fetchUsageAuditLogs,
  UsageChartItem,
  UsageLogItem,
  UsageMetric,
  UsageStatisticsParams
} from "@/services/usage-statistics.service";

// Sử dụng unknown để đảm bảo an toàn kiểu dữ liệu
const unwrap = (response: unknown) => {
  const res = response as { data?: unknown };
  return res?.data ?? response ?? {};
};

const toNumber = (value: unknown): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

// Interface mô tả cấu trúc dữ liệu trả về từ API Charts
interface ApiChartItem {
  label?: string;
  name?: string;
  page?: string;
  action?: string;
  value?: unknown;
  count?: unknown;
  total?: unknown;
}

const toChartItems = (items: unknown, fallbackLabels: string[]): UsageChartItem[] => {
  const source = Array.isArray(items) ? (items as ApiChartItem[]) : [];
  
  if (source.length > 0) {
    return source.map((item, index) => ({
      label: item.label ?? item.name ?? item.page ?? item.action ?? fallbackLabels[index] ?? `Mục ${index + 1}`,
      value: toNumber(item.value ?? item.count ?? item.total)
    }));
  }

  return fallbackLabels.map((label) => ({ label, value: 0 }));
};

const toLogItems = (response: unknown): UsageLogItem[] => {
  const data = response as { content?: UsageLogItem[]; items?: UsageLogItem[] };
  const items = data.content ?? data.items ?? [];
  return Array.isArray(items) ? items : [];
};

export const useUsageStatistics = (params: UsageStatisticsParams) => {
  const [metrics, setMetrics] = useState<UsageMetric[]>([]);
  const [pageViews, setPageViews] = useState<UsageChartItem[]>([]);
  const [drugViews, setDrugViews] = useState<UsageChartItem[]>([]);
  const [actions, setActions] = useState<UsageChartItem[]>([]);
  const [logs, setLogs] = useState<UsageLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(
    () => ({
      dateFrom: params.dateFrom || undefined,
      dateTo: params.dateTo || undefined
    }),
    [params.dateFrom, params.dateTo]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [statisticsResponse, chartsResponse, logsResponse] = await Promise.all([
        fetchDashboardStatistics(query),
        fetchDashboardCharts(query),
        fetchUsageAuditLogs({ ...query, page: 0, size: 8 })
      ]);

      const statistics = unwrap(statisticsResponse) as Record<string, unknown>;
      const charts = unwrap(chartsResponse) as Record<string, unknown>;

      setMetrics([
        { label: "Lượt xem thuốc", value: toNumber(statistics.drugViews ?? statistics.totalDrugViews) },
        { label: "Trang được truy cập", value: toNumber(statistics.pageViews ?? statistics.totalPageViews) },
        { label: "Lượt đánh giá AI", value: toNumber(statistics.aiEvaluations ?? statistics.totalAiEvaluations) },
        { label: "Hành động người dùng", value: toNumber(statistics.userActions ?? statistics.totalUserActions) }
      ]);
      
      setPageViews(toChartItems(charts.pageViews ?? charts.pages, ["Dashboard", "Thuốc", "Bệnh nhân", "Đánh giá AI"]));
      setDrugViews(toChartItems(charts.drugViews ?? charts.topDrugs, ["Paracetamol", "Amoxicillin", "Metformin", "Aspirin"]));
      setActions(toChartItems(charts.actions ?? charts.userActions, ["VIEW", "CREATE", "UPDATE", "DELETE"]));
      setLogs(toLogItems(logsResponse));
      
    } catch (requestError) {
      console.error("Cannot load usage statistics:", requestError);
      setError("Không thể tải dữ liệu thống kê sử dụng.");
      // Reset về giá trị mặc định khi lỗi
      setMetrics([]);
      setPageViews([]);
      setDrugViews([]);
      setActions([]);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    metrics,
    pageViews,
    drugViews,
    actions,
    logs,
    loading,
    error,
    refetch: loadData
  };
};