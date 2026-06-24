import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle, Download, Loader2 } from "lucide-react";
import { AIAnalysisStatus } from "@/components/evaluations/AIAnalysisStatus";
import { ActionFooter } from "@/components/evaluations/ActionFooter";
import { ClinicalSummary } from "@/components/evaluations/ClinicalSummary";
import { DrugSelector, DrugSelectorItem } from "@/components/evaluations/DrugSelector";
import { PatientInfo } from "@/components/evaluations/PatientInfo";
import { RiskAlert } from "@/components/evaluations/RiskAlert";
import { usePatients } from "@/hooks/usePatients";
import { apiClient } from "@/lib/api-client";

type EvaluationResult = {
  drugName: string;
  dosage?: string;
  summary?: string;
  alternatives?: string[];
  warnings?: string[];
  riskLevel?: "low" | "medium" | "high";
  suitabilityScore?: number;
  confidenceScore?: number;
};

type ClinicalSummaryData = {
  conditions?: string[];
  egfr?: number;
  bloodPressure?: string;
  sex?: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  latestTest?: string;
};

const getPatientContext = (patient: any | null) => {
  if (!patient) {
    return "";
  }

  const parts = [patient.diagnosis, patient.allergies || patient.allergy].filter(Boolean);
  return parts.join(" | ");
};

export const EvaluationPage = () => {
  const { patients, loading: loadingPatients } = usePatients({ page: 0, size: 100 });
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<DrugSelectorItem[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const patientOptions = useMemo(
    () =>
      patients.map((p) => ({
        id: p.id,
        name: p.fullName,
        summary: p.diagnosis || "Chưa có chẩn đoán",
      })),
    [patients]
  );

  const selectedOption = selectedPatient ? patientOptions.find((p) => p.id === selectedPatient.id) : null;

  const clinicalSummaryQuery = useQuery({
    queryKey: ["patient-clinical-summary", selectedPatient?.mrn],
    queryFn: async (): Promise<ClinicalSummaryData> => {
      if (!selectedPatient?.mrn) {
        return {};
      }

      const response = await apiClient.get(`/patients/clinical-summary/${selectedPatient.mrn}`);
      const body = response.data?.data ?? response.data;
      return {
        conditions: body?.conditions ?? [],
        egfr: body?.egfr,
        bloodPressure: body?.bloodPressure,
        sex: body?.sex,
        age: body?.age,
        heightCm: body?.heightCm,
        weightKg: body?.weightKg,
        latestTest: body?.latestTest,
      };
    },
    enabled: Boolean(selectedPatient?.mrn),
  });

  const evaluateMutation = useMutation({
    mutationFn: async (payload: { patientId: string; drugs: DrugSelectorItem[] }) => {
      const labs = {
        ...(clinicalSummaryQuery.data?.egfr !== undefined ? { egfr: String(clinicalSummaryQuery.data.egfr) } : {}),
        ...(clinicalSummaryQuery.data?.bloodPressure ? { bloodPressure: clinicalSummaryQuery.data.bloodPressure } : {}),
        ...(selectedPatient?.diagnosis ? { diagnosis: selectedPatient.diagnosis } : {}),
        ...(selectedPatient?.allergies ? { allergies: selectedPatient.allergies } : {}),
        ...(clinicalSummaryQuery.data?.sex ? { sex: clinicalSummaryQuery.data.sex } : {}),
        ...(clinicalSummaryQuery.data?.age !== undefined ? { age: String(clinicalSummaryQuery.data.age) } : {}),
        ...(clinicalSummaryQuery.data?.heightCm !== undefined ? { height: String(clinicalSummaryQuery.data.heightCm) } : {}),
        ...(clinicalSummaryQuery.data?.weightKg !== undefined ? { weight: String(clinicalSummaryQuery.data.weightKg) } : {}),
        ...(clinicalSummaryQuery.data?.latestTest ? { latestTest: clinicalSummaryQuery.data.latestTest } : {}),
      };

      const responses = await Promise.all(
        payload.drugs.map((drug) =>
          apiClient.post("/ai/evaluate", {
            patientId: payload.patientId,
            drugId: drug.id,
            dosage: drug.dosage || "100mg",
            labs,
          })
        )
      );
      return responses.map((res) => res.data?.content || res.data?.data).filter(Boolean) as EvaluationResult[];
    },
    onSuccess: (results) => {
      setEvaluationResult(results);
      setError(null);
      setInfoMessage(null);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Không thể thực hiện đánh giá AI";
      setError(message);
    },
  });

  const saveHistoryMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPatient || !evaluationResult) {
        return;
      }

      await apiClient.post("/ai/evaluations", {
        patientId: selectedPatient.id,
        results: evaluationResult,
        evaluatedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      setInfoMessage("Đã lưu lịch sử đánh giá chi tiết.");
    },
    onError: () => {
      setError("Không thể lưu lịch sử chi tiết");
    },
  });

  const handleEvaluate = () => {
    if (!selectedPatient || selectedDrugs.length === 0) {
      setError("Vui lòng chọn bệnh nhân và ít nhất một loại thuốc");
      return;
    }
    setError(null);
    setInfoMessage(null);
    evaluateMutation.mutate({ patientId: selectedPatient.id, drugs: selectedDrugs });
  };

  const handleSaveToHistory = async () => {
    if (!selectedPatient || !evaluationResult) {
      setError("Cần có kết quả đánh giá trước khi lưu lịch sử");
      return;
    }
    setError(null);
    await saveHistoryMutation.mutateAsync();
  };

  const handlePrintReport = () => {
    if (!selectedPatient || !evaluationResult) {
      setError("Cần có kết quả đánh giá trước khi in báo cáo");
      return;
    }

    const reportLines = [
      "BÁO CÁO ĐÁNH GIÁ TƯƠNG TÁC THUỐC",
      `Bệnh nhân: ${selectedPatient.name ?? selectedPatient.fullName ?? "N/A"}`,
      `Thời gian: ${new Date().toLocaleString("vi-VN")}`,
      "",
      ...evaluationResult.flatMap((result) => [
        `Thuốc: ${result.drugName}`,
        `Liều: ${result.dosage ?? "100mg"}`,
        `Mức rủi ro: ${result.riskLevel ?? "low"}`,
        `Tóm tắt: ${result.summary ?? "Đánh giá AI"}`,
        "",
      ]),
    ];

    const blob = new Blob([reportLines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evaluation-report-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveProfile = () => {
    handleEvaluate();
  };

  const progress = evaluateMutation.isPending ? 50 : evaluationResult ? 100 : 0;

  return (
    <div className="mx-auto min-h-screen max-w-6xl bg-slate-50 px-6 py-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Đánh giá Tương tác Thuốc</h1>
        <button
          type="button"
          onClick={handlePrintReport}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          Xuất báo cáo
        </button>
      </div>

      {loadingPatients ? (
        <div className="mb-4 flex items-center gap-2 text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Đang tải danh sách bệnh nhân...</span>
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      ) : null}

      {infoMessage ? (
        <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
          {infoMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 space-y-5 lg:col-span-4">
          <PatientInfo
            patients={patientOptions}
            selectedPatient={selectedOption || { id: "", name: "Chọn bệnh nhân", summary: "Chưa chọn bệnh nhân nào" }}
            onSelect={(option) => {
              const fullPatient = patients.find((p) => p.id === option.id);
              setSelectedPatient(fullPatient || null);
            }}
          />
          <DrugSelector
            drugs={selectedDrugs}
            onAdd={(drug) => setSelectedDrugs((prev) => [...prev, drug])}
            onRemove={(id) => setSelectedDrugs((prev) => prev.filter((d) => d.id !== id))}
          />

          <button
            type="button"
            onClick={handleEvaluate}
            disabled={!selectedPatient || selectedDrugs.length === 0 || evaluateMutation.isPending}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {evaluateMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang phân tích...
              </span>
            ) : (
              "Lưu vào hồ sơ"
            )}
          </button>
        </div>

        <div className="col-span-12 space-y-5 lg:col-span-8">
          <AIAnalysisStatus progress={progress} />

          {!selectedPatient ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-slate-400 shadow-sm">
              <p className="text-sm">Vui lòng chọn một bệnh nhân để xem kết quả phân tích AI</p>
            </div>
          ) : evaluateMutation.isPending ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-slate-500 shadow-sm">
              <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-blue-600" />
              <p className="text-sm font-medium">Đang phân tích hồ sơ bệnh nhân...</p>
            </div>
          ) : evaluationResult ? (
            <div className="space-y-4">
              {evaluationResult.map((result, index) => (
                <ClinicalSummary
                  key={index}
                  drugName={result.drugName}
                  dosage={result.dosage ?? "Chưa có liều"}
                  patientContext={getPatientContext(selectedPatient)}
                  clinicalSignals={clinicalSummaryQuery.data?.conditions || []}
                  eGFR={
                    clinicalSummaryQuery.data?.egfr !== undefined
                      ? `${clinicalSummaryQuery.data.egfr} mL/min`
                      : undefined
                  }
                  bloodPressure={clinicalSummaryQuery.data?.bloodPressure}
                  sex={clinicalSummaryQuery.data?.sex}
                  age={clinicalSummaryQuery.data?.age}
                  heightCm={clinicalSummaryQuery.data?.heightCm}
                  weightKg={clinicalSummaryQuery.data?.weightKg}
                  latestTest={clinicalSummaryQuery.data?.latestTest}
                  suitabilityScore={result.suitabilityScore}
                  riskLevel={result.riskLevel}
                  aiLogic={result.summary || "Đánh giá AI"}
                  recommendation={result.alternatives || []}
                  warnings={result.warnings || []}
                  note={result.warnings?.length ? undefined : "Không phát hiện rủi ro cao hoặc tương tác thuốc nghiêm trọng từ hồ sơ."}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-slate-400 shadow-sm">
              <p className="text-sm">Chọn thuốc và nhấn "Lưu vào hồ sơ" để thực hiện đánh giá AI</p>
            </div>
          )}
        </div>

        {evaluationResult ? (
          <div className="col-span-12 mt-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm font-medium text-slate-500">
                Đánh giá được thực hiện bởi hệ thống AI hỗ trợ lâm sàng.
              </p>
              <ActionFooter
                onPrintReport={handlePrintReport}
                onSaveProfile={handleSaveProfile}
                onSaveHistory={handleSaveToHistory}
                isSaving={saveHistoryMutation.isPending}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
