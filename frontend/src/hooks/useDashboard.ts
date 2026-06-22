import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DashboardQuery,
  fetchDashboardCharts,
  fetchDashboardOverview,
  fetchDashboardStatistics
} from "@/services/dashboard.service";

export interface DashboardMetric {
  key: string;
  label: string;
  value: number;
  helper: string;
}

export interface DashboardChartItem {
  label: string;
  value: number;
}

export interface DashboardActivity {
  id: string | number;
  title: string;
  description?: string;
  time?: string;
  severity?: "LOW" | "MEDIUM" | "HIGH" | string;
}

export interface DashboardEvaluation {
  id: string | number;
  patientName: string;
  doctorName?: string;
  evaluatedAt?: string;
  riskLevel?: string;
  suitabilityScore?: number;
  recommendation?: string;
}

const unwrap = (response: any) => response?.data ?? response ?? {};

const numberValue = (...values: unknown[]) => {
  for (const value of values) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
};

const listValue = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.content)) return value.content;
  return [];
};

const normalizeChart = (value: any, fallback: DashboardChartItem[]): DashboardChartItem[] => {
  const items = listValue(value);
  if (items.length === 0) return fallback;

  return items.map((item, index) => ({
    label: item.label ?? item.name ?? item.status ?? item.riskLevel ?? item.type ?? `Mục ${index + 1}`,
    value: numberValue(item.value, item.count, item.total, item.quantity)
  }));
};

const normalizeActivities = (value: any): DashboardActivity[] =>
  listValue(value).slice(0, 6).map((item, index) => ({
    id: item.id ?? index,
    title: item.title ?? item.action ?? item.message ?? "Hoạt động hệ thống",
    description: item.description ?? item.entityType ?? item.userName,
    time: item.time ?? item.createdAt ?? item.timestamp,
    severity: item.severity ?? item.riskLevel
  }));

const normalizeEvaluations = (value: any): DashboardEvaluation[] =>
  listValue(value).slice(0, 6).map((item, index) => ({
    id: item.id ?? index,
    patientName: item.patientName ?? item.patient?.fullName ?? item.patient ?? "Chưa có tên",
    doctorName: item.doctorName ?? item.doctor?.fullName,
    evaluatedAt: item.evaluatedAt ?? item.createdAt ?? item.date,
    riskLevel: item.riskLevel ?? item.risk,
    suitabilityScore: item.suitabilityScore ?? item.score,
    recommendation: item.recommendation ?? item.overallRecommendation
  }));

export const useDashboard = (query: DashboardQuery) => {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [riskDistribution, setRiskDistribution] = useState<DashboardChartItem[]>([]);
  const [prescriptionStatus, setPrescriptionStatus] = useState<DashboardChartItem[]>([]);
  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [evaluations, setEvaluations] = useState<DashboardEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(
    () => ({
      dateFrom: query.dateFrom || undefined,
      dateTo: query.dateTo || undefined
    }),
    [query.dateFrom, query.dateTo]
  );

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [overviewResponse, statisticsResponse, chartsResponse] = await Promise.all([
        fetchDashboardOverview(),
        fetchDashboardStatistics(params),
        fetchDashboardCharts(params)
      ]);

      const overview = unwrap(overviewResponse);
      const statistics = unwrap(statisticsResponse);
      const charts = unwrap(chartsResponse);

      setMetrics([
        {
          key: "patients",
          label: "Tổng bệnh nhân",
          value: numberValue(overview.totalPatients, statistics.totalPatients),
          helper: "Hồ sơ đang quản lý"
        },
        {
          key: "prescriptions",
          label: "Tổng đơn thuốc",
          value: numberValue(overview.totalPrescriptions, statistics.totalPrescriptions),
          helper: "Đơn thuốc trong hệ thống"
        },
        {
          key: "aiEvaluations",
          label: "Lượt đánh giá AI",
          value: numberValue(overview.totalAiEvaluations, statistics.totalAiEvaluations, statistics.aiEvaluations),
          helper: "Phân tích CDSS đã thực hiện"
        },
        {
          key: "highRiskAlerts",
          label: "Cảnh báo mức cao",
          value: numberValue(overview.highRiskAlerts, statistics.highRiskAlerts),
          helper: "Cần ưu tiên theo dõi"
        },
        {
          key: "dispensed",
          label: "Đã cấp phát",
          value: numberValue(overview.dispensedPrescriptions, statistics.dispensedPrescriptions),
          helper: "Đơn thuốc đã hoàn tất"
        },
        {
          key: "medicalRecords",
          label: "Hồ sơ bệnh án",
          value: numberValue(overview.totalMedicalRecords, statistics.totalMedicalRecords),
          helper: "Lượt khám được ghi nhận"
        }
      ]);

      setRiskDistribution(
        normalizeChart(charts.riskDistribution ?? statistics.riskDistribution, [
          { label: "Thấp", value: 0 },
          { label: "Trung bình", value: 0 },
          { label: "Cao", value: 0 },
          { label: "Nghiêm trọng", value: 0 }
        ])
      );
      setPrescriptionStatus(
        normalizeChart(charts.prescriptionStatus ?? charts.prescriptionsByStatus ?? statistics.prescriptionStatus, [
          { label: "AI đánh giá", value: 0 },
          { label: "Đã xác nhận", value: 0 },
          { label: "Đã cấp phát", value: 0 },
          { label: "Đã hủy", value: 0 }
        ])
      );
      setActivities(normalizeActivities(statistics.recentActivities ?? charts.recentActivities));
      setEvaluations(normalizeEvaluations(statistics.recentEvaluations ?? charts.recentEvaluations));
    } catch (requestError) {
      console.error("Cannot load dashboard:", requestError);
      setError("Không thể tải dữ liệu dashboard từ API.");
      setMetrics([
        { key: "patients", label: "Tổng bệnh nhân", value: 0, helper: "Hồ sơ đang quản lý" },
        { key: "prescriptions", label: "Tổng đơn thuốc", value: 0, helper: "Đơn thuốc trong hệ thống" },
        { key: "aiEvaluations", label: "Lượt đánh giá AI", value: 0, helper: "Phân tích CDSS đã thực hiện" },
        { key: "highRiskAlerts", label: "Cảnh báo mức cao", value: 0, helper: "Cần ưu tiên theo dõi" },
        { key: "dispensed", label: "Đã cấp phát", value: 0, helper: "Đơn thuốc đã hoàn tất" },
        { key: "medicalRecords", label: "Hồ sơ bệnh án", value: 0, helper: "Lượt khám được ghi nhận" }
      ]);
      setRiskDistribution([
        { label: "Thấp", value: 0 },
        { label: "Trung bình", value: 0 },
        { label: "Cao", value: 0 },
        { label: "Nghiêm trọng", value: 0 }
      ]);
      setPrescriptionStatus([
        { label: "AI đánh giá", value: 0 },
        { label: "Đã xác nhận", value: 0 },
        { label: "Đã cấp phát", value: 0 },
        { label: "Đã hủy", value: 0 }
      ]);
      setActivities([]);
      setEvaluations([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    metrics,
    riskDistribution,
    prescriptionStatus,
    activities,
    evaluations,
    loading,
    error,
    refetch: loadDashboard
  };
};
