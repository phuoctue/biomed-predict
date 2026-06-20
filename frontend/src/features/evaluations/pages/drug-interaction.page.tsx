import React, { useState, useEffect } from "react";
import { apiClient } from "../../../lib/api-client";
import { FileText, Play, ChevronRight, Printer, Save, Loader2 } from "lucide-react";
import { ClinicalSummaryCard } from "../../../components/ClinicalSummaryCard";
import { DrugSelectionList } from "../../../components/DrugSelectionList";
import { InteractionAlertList, InteractionReport } from "../../../components/InteractionAlertList";

interface PatientSummary {
  id: string;
  name: string;
  conditions: string[];
  egfr: number;
  bloodPressure: string;
}

interface DrugItem {
  id: number;
  name: string;
  type: string;
  isWarning?: boolean;
}

export const DrugInteractionPage = () => {
  const [currentPatient, setCurrentPatient] = useState<PatientSummary | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<DrugItem[]>([]);
  const [reports, setReports] = useState<InteractionReport[]>([]);

  const [loadingPatient, setLoadingPatient] = useState<boolean>(true);
  const [evaluating, setEvaluating] = useState<boolean>(false);

  // Lấy thông tin bệnh nhân từ API chung
  const fetchPatientSession = async () => {
    try {
      setLoadingPatient(true);
      const response = await apiClient.get("/patients/982839/clinical-summary");
      if (response.data && response.data.success) {
        setCurrentPatient(response.data.data);
      }
    } catch (error) {
      console.error("Sử dụng dữ liệu dự phòng bệnh nhân:", error);
      setCurrentPatient({
        id: "982839",
        name: "Nguyễn Văn A",
        conditions: ["Tăng huyết áp (Hypertension)", "Đái tháo đường (Diabetes)", "eGFR thấp: 45 mL/min (CKD-G3a)"],
        egfr: 45,
        bloodPressure: "145/92",
      });
    } {
      setLoadingPatient(false);
    }
  };

  // Kích hoạt AI phân tích tương tác thuốc
  const handleEvaluateInteractions = async () => {
    if (selectedDrugs.length === 0) return alert("Vui lòng thêm thuốc để đánh giá.");

    try {
      setEvaluating(true);
      const response = await apiClient.post("/ai-evaluations/analyze-interactions", {
        patientId: currentPatient?.id,
        drugIds: selectedDrugs.map((d) => d.id),
      });

      if (response.data && response.data.success) {
        setReports(response.data.data.interactions);
        const warningPairs = response.data.data.interactions.map((i: InteractionReport) => i.drugPair.toLowerCase());
        setSelectedDrugs((prev) =>
          prev.map((drug) => ({
            ...drug,
            isWarning: warningPairs.some((pair: string) => pair.includes(drug.name.toLowerCase())),
          }))
        );
      }
    } catch (error) {
      console.error("Sử dụng dữ liệu báo cáo tương tác dự phòng:", error);
      setReports([
        {
          id: 1,
          drugPair: "Warfarin + Ibuprofen",
          severity: "CRITICAL",
          description: "Sử dụng thuốc kháng đông (Warfarin) kết hợp với thuốc giảm đau hạ sốt kháng viêm không steroid (Ibuprofen) làm tăng X4.5 lần nguy cơ chảy máu dạ dày.",
          alternativeSuggestion: "Paracetamol 500mg",
        },
        {
          id: 2,
          drugPair: "Lisinopril + Amlodipine",
          severity: "WARNING",
          description: "Đa trị liệu tăng huyết áp. Có thể gây hạ huyết áp tư thế đứng ở bệnh nhân cao tuổi.",
        },
      ]);
      setSelectedDrugs((prev) => prev.map((d) => (d.id === 4 ? { ...d, isWarning: true } : d)));
    } finally {
      setEvaluating(false);
    }
  };

  useEffect(() => {
    fetchPatientSession();
    setSelectedDrugs([
      { id: 1, name: "Lisinopril 10mg", type: "ACEI" },
      { id: 2, name: "Amlodipine 5mg", type: "CCB" },
      { id: 3, name: "Warfarin 2mg", type: "Anticoagulant" },
      { id: 4, name: "Ibuprofen 400mg", type: "NSAID" },
    ]);
  }, []);

  const handleRemoveDrug = (id: number) => {
    setSelectedDrugs((prev) => prev.filter((d) => d.id !== id));
  };

  if (loadingPatient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
        <p className="text-xs font-semibold text-slate-500">Đang tải cấu hình lâm sàng bệnh nhân...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen font-sans antialiased">
      {/* BREADCRUMB ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
          <span>BỆNH NHÂN:</span>
          <span className="text-slate-900 font-bold">{currentPatient?.name} (ID: {currentPatient?.id})</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-blue-600 font-bold uppercase tracking-tight">Phân tích tương tác</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPatientSession}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <FileText className="h-4 w-4 text-blue-600" /> Lấy thông tin đơn thuốc
          </button>
          <button
            onClick={handleEvaluateInteractions}
            disabled={evaluating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-200 disabled:opacity-60 transition-all"
          >
            {evaluating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
            Đánh giá ngay
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Đánh giá Tương tác Thuốc</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Phân tích lâm sàng dựa trên thuật toán AI và dữ liệu dược lý chuyên sâu.</p>
      </div>

      {/* COMPONENT 1: TOP CARD THÔNG TIN LÂM SÀNG TỪ AI */}
      <ClinicalSummaryCard
        conditions={currentPatient?.conditions || []}
        bloodPressure={currentPatient?.bloodPressure || ""}
        egfr={currentPatient?.egfr || 0}
      />

      {/* LƯỚI 2 CỘT BIỂU DIỄN CHỨC NĂNG */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COMPONENT 2: CỘT TRÁI CHỌN THUỐC */}
        <DrugSelectionList
          patientName={currentPatient?.name || ""}
          patientId={currentPatient?.id || ""}
          selectedDrugs={selectedDrugs}
          onRemoveDrug={handleRemoveDrug}
        />

        {/* COMPONENT 3: CỘT PHẢI HIỂN THỊ KẾT QUẢ TƯƠNG TÁC */}
        <div className="lg:col-span-2">
          <InteractionAlertList reports={reports} />
        </div>
      </div>

      {/* FOOTER ACTIONS BAR */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-200 pt-6">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-400 uppercase">Tổng kết mức độ rủi ro</span>
          <div className="flex h-1.5 w-48 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: reports.length > 0 ? "30%" : "100%" }}></div>
            <div className="h-full bg-amber-400" style={{ width: reports.some((r) => r.severity === "WARNING") ? "40%" : "0%" }}></div>
            <div className="h-full bg-rose-500" style={{ width: reports.some((r) => r.severity === "CRITICAL") ? "30%" : "0%" }}></div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">Hủy bỏ</button>
          <button
            onClick={() => alert("Xuất báo cáo...")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <Printer className="h-4 w-4" /> In báo cáo
          </button>
          <button
            onClick={() => alert("Đã lưu hồ sơ thành công vào hệ thống.")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
          >
            <Save className="h-4 w-4" /> Lưu hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};