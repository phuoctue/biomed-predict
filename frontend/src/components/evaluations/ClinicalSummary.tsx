import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  Stethoscope,
  Activity,
  Heart,
  Scale,
  Thermometer,
} from "lucide-react";

interface ClinicalSummaryProps {
  drugName: string;
  dosage: string;
  patientContext?: string;
  clinicalSignals?: string[];
  eGFR?: string;
  bloodPressure?: string;
  aiLogic: string;
  recommendation: string[];
  note?: string;
  // Enriched demographics and latest test results
  sex?: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  latestTest?: string;
  suitabilityScore?: number;
  riskLevel?: string;
  warnings?: string[];
}

export const ClinicalSummary = ({
  drugName,
  dosage,
  patientContext,
  clinicalSignals = [],
  eGFR,
  bloodPressure,
  aiLogic,
  recommendation,
  note,
  sex,
  age,
  heightCm,
  weightKg,
  latestTest,
  suitabilityScore = 80,
  riskLevel = "low",
  warnings = [],
}: ClinicalSummaryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getRiskBadgeStyles = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700 border-red-100";
      case "medium":
      case "moderate":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high":
        return "Nguy cơ cao";
      case "medium":
      case "moderate":
        return "Nguy cơ trung bình";
      default:
        return "Nguy cơ thấp";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Clickable Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex cursor-pointer select-none items-center justify-between p-4 transition-colors hover:bg-slate-50"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
            <Stethoscope className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              {drugName}
              <span className="text-xs font-normal text-slate-500">({dosage})</span>
            </h4>
            <p className="text-[11px] text-slate-400">Xem phân tích & cảnh báo lâm sàng</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Suitability Score */}
          <span className={`rounded-lg border px-2 py-1 text-xs font-bold ${getScoreColor(suitabilityScore)}`}>
            Phù hợp: {suitabilityScore}%
          </span>

          {/* Risk Level Badge */}
          <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${getRiskBadgeStyles(riskLevel)}`}>
            {getRiskLabel(riskLevel)}
          </span>

          {/* Toggle icon */}
          <div className="text-slate-400">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {/* Expandable Panel */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-4 transition-all">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Left Column: Input Data & Context */}
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Activity className="h-4 w-4 text-blue-500" />
                  Bối cảnh & Chỉ số bệnh nhân
                </div>
                <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2">
                    <span className="block text-slate-400">Tuổi & Giới tính</span>
                    <span className="font-bold text-slate-700">
                      {age ? `${age} tuổi` : "N/A"} • {sex || "N/A"}
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2">
                    <span className="block text-slate-400">Chiều cao & Cân nặng</span>
                    <span className="font-bold text-slate-700">
                      {heightCm ? `${heightCm} cm` : "N/A"} • {weightKg ? `${weightKg} kg` : "N/A"}
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2">
                    <span className="block text-slate-400">Huyết áp</span>
                    <span className="font-bold text-slate-700">{bloodPressure || "Chưa có dữ liệu"}</span>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2">
                    <span className="block text-slate-400">Độ lọc cầu thận (eGFR)</span>
                    <span className="font-bold text-slate-700">{eGFR || "Chưa có dữ liệu"}</span>
                  </div>
                </div>

                <div className="mt-2.5 rounded-lg bg-slate-50 p-2 text-xs">
                  <span className="block text-slate-400">Chẩn đoán</span>
                  <span className="font-medium text-slate-700">
                    {patientContext?.split(" | ")[0] || "Chưa có thông tin"}
                  </span>
                </div>

                {patientContext?.split(" | ")[1] && (
                  <div className="mt-1 rounded-lg bg-red-50 p-2 text-xs border border-red-100">
                    <span className="block text-red-500 font-bold">Dị ứng</span>
                    <span className="font-medium text-red-700">{patientContext.split(" | ")[1]}</span>
                  </div>
                )}
              </div>

              {/* Latest Test Result */}
              <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Heart className="h-4 w-4 text-emerald-500" />
                  Kết quả xét nghiệm gần nhất
                </div>
                <p className="mt-2 text-xs font-bold text-slate-700 bg-emerald-50/50 border border-emerald-100 rounded-lg p-2">
                  {latestTest || "Chưa có dữ liệu xét nghiệm gần đây"}
                </p>
              </div>

              {/* Warnings List */}
              {warnings.length > 0 && (
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    Cảnh báo rủi ro ({warnings.length})
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-red-800 list-disc pl-4">
                    {warnings.map((warn, index) => (
                      <li key={index} className="leading-5">
                        {warn}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: AI Logic & Recommendations */}
            <div className="space-y-3">
              {/* AI Reasoning */}
              <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  Lập luận từ AI
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-600">{aiLogic}</p>
              </div>

              {/* Alternatives / Recommendations */}
              <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-500 to-indigo-600 p-3.5 text-white shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4" />
                  Giải pháp & thuốc thay thế
                </div>
                <div className="mt-2 space-y-1.5">
                  {recommendation.length > 0 ? (
                    recommendation.map((rec, index) => (
                      <div key={index} className="rounded-lg bg-white/10 p-2 text-xs leading-4 flex items-start gap-2">
                        <span className="mt-0.5 rounded-full bg-white/20 px-1.5 text-[9px] font-bold">
                          {index + 1}
                        </span>
                        <span>{rec}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-blue-100">Không có thuốc thay thế được chỉ định.</p>
                  )}
                </div>
              </div>

              {note && (
                <div className="rounded-xl border border-slate-100 bg-white p-2.5 text-[11px] text-slate-400">
                  <Info className="inline mr-1 h-3.5 w-3.5 align-text-bottom" />
                  {note}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
