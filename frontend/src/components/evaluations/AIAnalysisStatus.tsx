import { BrainCircuit } from "lucide-react";

interface AIAnalysisStatusProps {
  progress: number; // Từ 0 đến 100
}

export const AIAnalysisStatus = ({ progress }: AIAnalysisStatusProps) => {
  const isComplete = progress === 100;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <BrainCircuit size={20} className={isComplete ? "text-blue-600" : "text-slate-400"} />
          <span className="font-bold text-slate-800 text-sm">Thông tin Lâm sàng từ AI</span>
        </div>
        <span className={`text-xs font-bold ${isComplete ? "text-blue-600" : "text-slate-400"}`}>
          {isComplete ? "100% hoàn tất" : `${progress}% đang phân tích...`}
        </span>
      </div>
      
      {/* Thanh tiến trình */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out ${isComplete ? "bg-blue-600" : "bg-blue-400"}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {isComplete && (
        <p className="mt-2 text-[11px] text-blue-700 font-medium">
          Đã hoàn tất phân tích hồ sơ bệnh nhân.
        </p>
      )}
    </div>
  );
};