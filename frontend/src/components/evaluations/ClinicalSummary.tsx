import { AlertCircle, CheckCircle2 } from "lucide-react";

interface ClinicalSummaryProps {
  conditions: string[];
  eGFR: string; // Ví dụ: "45 mL/min (CKD G3a)"
  aiLogic: string;
  recommendation: string;
}

export const ClinicalSummary = ({ conditions, eGFR, aiLogic, recommendation }: ClinicalSummaryProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
      {/* Tab Header (nếu cần hiển thị như ảnh) */}
      <div className="flex justify-end gap-2 mb-6">
        {["Kết quả Lab", "Tiền sử bệnh", "Dữ liệu Di truyền"].map((tab) => (
          <button key={tab} className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cột trái: Tóm tắt tình trạng */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tóm tắt tình trạng lâm sàng</h4>
          <ul className="space-y-3">
            {conditions.map((cond, i) => (
              <li key={i} className="flex justify-between items-center text-sm text-slate-700 pb-2 border-b border-slate-50">
                {cond} <CheckCircle2 size={16} className="text-emerald-500" />
              </li>
            ))}
            <li className="flex justify-between items-center text-sm text-red-600 font-bold p-2 bg-red-50 rounded-lg">
              eGFR thấp: {eGFR} <AlertCircle size={16} />
            </li>
          </ul>
        </div>

        {/* Cột phải: AI Logic & Khuyến nghị */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Logic & Khuyến nghị</h4>
          <p className="text-xs text-slate-600 leading-relaxed italic">"{aiLogic}"</p>
          
          <div className="bg-blue-600 text-white p-4 rounded-xl shadow-sm">
            <p className="text-xs font-bold mb-1 flex items-center gap-2">
              <CheckCircle2 size={14} /> Khuyến nghị điều chỉnh liều:
            </p>
            <p className="text-xs leading-relaxed">{recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};