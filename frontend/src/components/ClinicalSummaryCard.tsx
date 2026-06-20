import React from "react";
import { Stethoscope, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface ClinicalSummaryProps {
  conditions: string[];
  bloodPressure: string;
  egfr: number;
}

export const ClinicalSummaryCard: React.FC<ClinicalSummaryProps> = ({
  conditions,
  bloodPressure,
  egfr,
}) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden mb-8">
      <div className="bg-blue-600 h-1 w-full"></div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Stethoscope className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase">Thông tin Lâm sàng từ AI</h2>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold">
            <span className="text-slate-400 uppercase">Kết quả sơ bộ:</span>
            <span className="text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Sẵn sàng
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Danh sách bệnh lý */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Tóm tắt tình trạng lâm sàng</p>
            <ul className="space-y-2.5 text-xs font-bold text-slate-700">
              {conditions.map((condition, idx) => {
                const isRisk = condition.includes("thấp") || condition.includes("nguy cơ");
                return (
                  <li key={idx} className="flex items-center justify-between">
                    <span className={isRisk ? "text-rose-600" : ""}>{condition}</span>
                    {isRisk ? (
                      <AlertCircle className="h-4 w-4 text-rose-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Hộp khuyến nghị AI */}
          <div className="bg-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-100">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Info className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wide">AI LƯU Ý & KHUYẾN NGHỊ</h4>
                <p className="text-xs font-medium mt-1.5 leading-relaxed opacity-90">
                  Nguy cơ loét dạ dày <span className="font-bold underline">RẤT CAO</span> vì huyết áp hiện tại là {bloodPressure} mmHg. Thay thế Ibuprofen bằng <span className="font-bold">Celecoxib 200mg</span> nếu cần giảm đau.
                </p>
                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-2 py-1 rounded">
                  <AlertCircle className="h-3 w-3" />
                  Khuyến nghị thay đổi liều: Giảm bớt liều xuống 25% cho các thuốc thải qua thận (eGFR: {egfr}).
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};