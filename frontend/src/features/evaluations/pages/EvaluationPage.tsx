import React, { useState } from 'react';
import { PatientInfo } from '@/components/evaluations/PatientInfo';
import { DrugSelector } from '@/components/evaluations/DrugSelector';
import { ClinicalSummary } from '@/components/evaluations/ClinicalSummary';
import { RiskAlert } from '@/components/evaluations/RiskAlert';
import { ActionFooter } from '@/components/evaluations/ActionFooter';
import { AIAnalysisStatus } from '@/components/evaluations/AIAnalysisStatus';

// Dữ liệu giả lập cho danh sách bệnh nhân
const ALL_PATIENTS = [
  { id: "992831", name: "Nguyễn Văn A", summary: "Tăng huyết áp vô căn, Suy tim độ II." },
  { id: "992832", name: "Trần Thị B", summary: "Đái tháo đường type 2, Rối loạn lipid máu." },
  { id: "992833", name: "Lê Văn C", summary: "Viêm khớp dạng thấp, Hen suyễn." },
];

export const EvaluationPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(ALL_PATIENTS[0]);

  return (
    <div className="p-8 bg-slate-50 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Đánh giá Tương tác Thuốc</h1>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Cột trái */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <PatientInfo 
            patients={ALL_PATIENTS}
            selectedPatient={selectedPatient}
            onSelect={setSelectedPatient}
          />
          <DrugSelector />
        </div>
        
        {/* Cột phải */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <AIAnalysisStatus progress={100} />
          
          <ClinicalSummary 
            conditions={["Tăng huyết áp (Hypertension)", "Đái tháo đường (Diabetes)"]}
            eGFR="45 mL/min (CKD G3a)"
            aiLogic="Dựa trên mức eGFR thấp, AI khuyến nghị hiệu chỉnh liều lượng thuốc thải trừ qua thận. Tránh dùng NSAIDs liều cao để ngăn ngừa tổn thương thận cấp tính tiến triển."
            recommendation="Giảm liều các thuốc thải trừ qua thận 25% do eGFR thấp (45 mL/min)."
          />
          
          <div className="space-y-4">
            <RiskAlert 
              type="danger" 
              title="Tương tác Nguy hiểm (Rất Cao)" 
              reason="Ibuprofen làm tăng nguy cơ chảy máu khi dùng chung với Warfarin..."
              recommendations={["Ngừng Ibuprofen", "Theo dõi INR"]}
            />
            <RiskAlert 
              type="warning" 
              title="Tương tác Trung bình" 
              reason="Hiệu ứng hiệp đồng hạ huyết áp giữa Lisinopril và Amlodipine..."
              recommendations={["Theo dõi HA 2 lần/ngày", "Uống cách nhau 4h"]}
            />
          </div>
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