import React, { useMemo, useState } from "react";
import { PatientInfo } from "@/components/evaluations/PatientInfo";
import { DrugSelector, DrugSelectorItem } from "@/components/evaluations/DrugSelector";
import { ClinicalSummary } from "@/components/evaluations/ClinicalSummary";
import { RiskAlert } from "@/components/evaluations/RiskAlert";
import { ActionFooter } from "@/components/evaluations/ActionFooter";
import { AIAnalysisStatus } from "@/components/evaluations/AIAnalysisStatus";
import { usePatients } from "@/hooks/usePatients";
import apiClient from "@/lib/api-client";
import { Loader2, AlertCircle } from "lucide-react";

export const EvaluationPage = () => {
  const { patients, loading: loadingPatients } = usePatients();

  const [selectedPatient, setSelectedPatient] = React.useState<any | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<DrugSelectorItem[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patientOptions = useMemo(
    () =>
      patients.map((p) => ({
        id: p.id, // Use UUID instead of MRN
        name: p.fullName,
        summary: p.diagnosis || "Chưa có chẩn đoán",
      })),
    [patients]
  );

  const selectedOption = selectedPatient 
    ? patientOptions.find((p) => p.id === selectedPatient.id) 
    : null;

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setEvaluationResult(null);
    setError(null);
  };

  const handleAddDrug = (drug: DrugSelectorItem) => {
    if (!selectedDrugs.find(d => d.id === drug.id)) {
      setSelectedDrugs([...selectedDrugs, drug]);
    }
  };

  const handleRemoveDrug = (drugId: string) => {
    setSelectedDrugs(selectedDrugs.filter(d => d.id !== drugId));
  };

  const handleEvaluate = async () => {
    if (!selectedPatient || selectedDrugs.length === 0) {
      setError("Vui lòng chọn bệnh nhân và ít nhất một loại thuốc");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call AI evaluation for each drug
      const evaluations = await Promise.all(
        selectedDrugs.map(drug => 
          apiClient.post("/ai/evaluate", {
            patientId: selectedPatient.id,
            drugId: drug.id,
            dosage: drug.dosage || "100mg",
            labs: {}
          })
        )
      );

      // Combine results
      const results = evaluations.map(res => res.data?.content || res.data?.data);
      setEvaluationResult(results);

    } catch (err: any) {
      console.error("Failed to evaluate:", err);
      setError(err.response?.data?.message || "Không thể thực hiện đánh giá AI");
    } finally {
      setLoading(false);
    }
  };

  const progress = loading ? 50 : evaluationResult ? 100 : 0;

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
            onSelect={handleSelectPatient}
          />
          <DrugSelector 
            drugs={selectedDrugs}
            onAdd={handleAddDrug}
            onRemove={handleRemoveDrug}
          />
          
          {/* Nút đánh giá */}
          <button
            onClick={handleEvaluate}
            disabled={!selectedPatient || selectedDrugs.length === 0 || loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-sm disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang phân tích...
              </span>
            ) : (
              "Lưu vào hồ sơ"
            )}
          </button>
        </div>

        {/* Cột phải */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <AIAnalysisStatus progress={progress} />

          {/* Clinical Summary */}
          {!selectedPatient ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center text-slate-400">
              <p className="text-sm">
                Vui lòng chọn một bệnh nhân để xem kết quả phân tích AI
              </p>
            </div>
          ) : loading ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center text-slate-500">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Đang phân tích hồ sơ bệnh nhân...</p>
            </div>
          ) : evaluationResult ? (
            <>
              {evaluationResult.map((result: any, index: number) => (
                <div key={index} className="space-y-4">
                  <ClinicalSummary
                    conditions={[result.drugName, result.dosage]}
                    eGFR="90 mL/min (bình thường)"
                    aiLogic={result.summary || "Đánh giá AI"}
                    recommendation={result.alternatives?.join(", ") || "Theo dõi định kỳ"}
                  />

                  {/* Risk Alerts */}
                  {result.riskLevel !== "low" && (
                    <RiskAlert
                      type={result.riskLevel === "high" ? "danger" : "warning"}
                      title={`Rủi ro ${result.riskLevel === "high" ? "Cao" : "Trung bình"}: ${result.drugName}`}
                      reason={result.summary}
                      recommendations={result.warnings || []}
                    />
                  )}

                  {result.riskLevel === "low" && (
                    <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 text-emerald-700 text-sm font-medium text-center">
                      ✅ {result.drugName}: Không phát hiện rủi ro cao
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center text-slate-400">
              <p className="text-sm">
                Chọn thuốc và nhấn "Lưu vào hồ sơ" để thực hiện đánh giá AI
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {evaluationResult && (
          <div className="col-span-12 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 font-medium">
                Đánh giá được thực hiện bởi hệ thống AI hỗ trợ lâm sàng.
              </p>
              <ActionFooter />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
