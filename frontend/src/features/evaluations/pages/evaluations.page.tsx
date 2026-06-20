import React from "react";
// Import các component thông qua alias @/ đã cấu hình
import { useEvaluation } from "@/hooks/useEvaluation";
import { PatientHeader } from "@/components/PatientHeader";
import { InteractionList } from "@/components/InteractionList";
import { RiskSummary } from "@/components/RiskSummary";
import { PrescribedDrugTable } from "@/components/PrescribedDrugTable";
import { ClinicalIndicators } from "@/components/ClinicalIndicators";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export const EvaluationsPage = () => {
  // 1. Gọi hook quản lý dữ liệu với ID bệnh nhân
  const { patient, interactions, drugs, loading } = useEvaluation("1002485");

  // 2. Trạng thái chờ xử lý từ AI
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* Tiêu đề trang */}
      <h1 className="text-xl font-bold mb-6 text-slate-800">
        Chi tiết Kết quả Đánh giá
      </h1>
      
      {/* Thông tin hành chính bệnh nhân */}
      {patient && <PatientHeader patient={patient} />}

      {/* Grid Layout 3 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Cột trái: Tương tác thuốc & Chỉ số lâm sàng (chiếm 2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <InteractionList interactions={interactions} />
          
          {/* Truyền dữ liệu thật từ API nếu backend cung cấp, 
              hoặc tính toán từ patient.metrics */}
          <ClinicalIndicators 
            eGFR={72} 
            bloodPressure="145/92" 
          />
        </div>

        {/* Cột phải: Phân tích rủi ro & Di truyền (chiếm 1/3) */}
        <div className="lg:col-span-1">
          <RiskSummary />
        </div>
      </div>

      {/* Bảng danh mục thuốc chi tiết */}
      <PrescribedDrugTable drugs={drugs} />
    </div>
  );
};