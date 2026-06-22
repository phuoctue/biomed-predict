import React, { useMemo } from "react";
import { PatientInfo } from "@/components/evaluations/PatientInfo";
import { DrugSelector } from "@/components/evaluations/DrugSelector";
import { ClinicalSummary } from "@/components/evaluations/ClinicalSummary";
import { RiskAlert } from "@/components/evaluations/RiskAlert";
import { ActionFooter } from "@/components/evaluations/ActionFooter";
import { AIAnalysisStatus } from "@/components/evaluations/AIAnalysisStatus";
import { usePatients } from "@/hooks/usePatients";
import { useEvaluation } from "@/hooks/useEvaluation";
import { Loader2, AlertCircle } from "lucide-react";

export const EvaluationPage = () => {
  const { patients, loading: loadingPatients } = usePatients();

  const [selectedMrn, setSelectedMrn] = React.useState<string | null>(null);

  const patientOptions = useMemo(
    () =>
      patients.map((p) => ({
        id: p.mrn,
        name: p.fullName,
        summary: p.diagnosis || "Chưa có chẩn đoán",
      })),
    [patients]
  );

  const selectedOption = patientOptions.find((p) => p.id === selectedMrn) || null;

  const { patient, interactions, drugs, loading: loadingEval, error } = useEvaluation(selectedMrn);

  // Map drugs cho DrugSelector
  const drugItems = useMemo(
    () =>
      drugs.map((d) => ({
        id: String(d.id),
        name: d.name,
        dosage: d.dosage,
      })),
    [drugs]
  );

  // Map interactions cho RiskAlert
  const dangerAlerts = interactions.filter(
    (i) => i.severity === "HIGH" || i.severity === "MEDIUM"
  );

  // Clinical summary data
  const conditions = patient?.diagnosis
    ? patient.diagnosis.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean)
    : [];

  const progress = loadingEval ? 40 : selectedMrn ? 100 : 0;

  return (
    <div className="p-8 bg-slate-50 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Đánh giá Tương tác Thuốc
      </h1>

      {/* Loading state */}
      {loadingPatients && (
        <div className="flex items-center gap-2 text-slate-500 mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Đang tải danh sách bệnh nhân...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl mb-4">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Cột trái */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <PatientInfo
            patients={patientOptions}
            selectedPatient={selectedOption || { id: "", name: "Chọn bệnh nhân", summary: "Chưa chọn bệnh nhân nào" }}
            onSelect={(p) => setSelectedMrn(p.id)}
          />
          <DrugSelector drugs={drugItems} />
        </div>

        {/* Cột phải */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <AIAnalysisStatus progress={progress} />

          {/* Clinical Summary */}
          {!selectedMrn ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center text-slate-400">
              <p className="text-sm">
                Vui lòng chọn một bệnh nhân để xem kết quả phân tích AI
              </p>
            </div>
          ) : loadingEval ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center text-slate-500">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Đang phân tích hồ sơ bệnh nhân...</p>
            </div>
          ) : (
            <>
              <ClinicalSummary
                conditions={conditions}
                eGFR="90 mL/min (bình thường)"
                aiLogic="Hệ thống AI phân tích dựa trên thông tin lâm sàng, tương tác thuốc và tiền sử bệnh nhân để đưa ra khuyến nghị phù hợp."
                recommendation="Theo dõi định kỳ và đánh giá lại khi có thay đổi về thuốc hoặc tình trạng lâm sàng."
              />

              {/* Risk Alerts */}
              {dangerAlerts.length === 0 ? (
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 text-emerald-700 text-sm font-medium text-center">
                  ✅ Không phát hiện tương tác thuốc nguy hiểm
                </div>
              ) : (
                <div className="space-y-4">
                  {dangerAlerts.map((i) => (
                    <RiskAlert
                      key={i.id}
                      type={i.severity === "HIGH" ? "danger" : "warning"}
                      title={`${i.severity === "HIGH" ? "Tương tác Nguy hiểm" : "Tương tác Trung bình"}: ${i.drugPair}`}
                      reason={i.description}
                      recommendations={
                        i.recommendation
                          ? i.recommendation.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean)
                          : ["Theo dõi chặt chẽ"]
                      }
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="col-span-12 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">
              Đánh giá được thực hiện bởi hệ thống AI hỗ trợ lâm sàng.
            </p>
            <ActionFooter />
          </div>
        </div>
      </div>
    </div>
  );
};
