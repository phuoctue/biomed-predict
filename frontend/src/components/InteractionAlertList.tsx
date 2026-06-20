import React from "react";
import { AlertCircle, Info, CheckCircle2 } from "lucide-react";

export interface InteractionReport {
  id: number;
  drugPair: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  description: string;
  alternativeSuggestion?: string;
}

interface InteractionAlertListProps {
  reports: InteractionReport[];
}

export const InteractionAlertList: React.FC<InteractionAlertListProps> = ({ reports }) => {
  if (reports.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400">
        <Info className="h-6 w-6 mx-auto text-slate-300 mb-1" />
        <p className="text-xs font-semibold">Nhấn nút "Đánh giá ngay" để tiến hành quét tương tác lâm sàng qua AI.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => {
        const isCritical = report.severity === "CRITICAL";
        return (
          <div key={report.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase">
                <AlertCircle className={`h-4 w-4 ${isCritical ? "text-rose-600" : "text-amber-500"}`} />
                Tương tác {isCritical ? "Nguy Hiểm (Rất Cao)" : "Trung Bình"}
              </h3>
              <span
                className={`px-3 py-1 rounded-lg text-[10px] font-black text-white uppercase shadow-sm ${
                  isCritical ? "bg-rose-600" : "bg-amber-400"
                }`}
              >
                {isCritical ? "Yêu cầu thay thế" : "Theo dõi sát"}
              </span>
            </div>

            <div
              className={`border rounded-xl p-4 ${
                isCritical ? "border-rose-100 bg-rose-50/30" : "border-amber-100 bg-amber-50/30"
              }`}
            >
              <p className="text-sm font-bold text-slate-900 mb-1">{report.drugPair}</p>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{report.description}</p>

              {report.alternativeSuggestion && (
                <div className="mt-4 pt-4 border-t border-rose-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Gợi ý thay thế an toàn từ AI:</p>
                  <div className="flex items-center justify-between bg-white border border-emerald-100 p-2.5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs font-bold text-slate-800">{report.alternativeSuggestion}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600">Được khuyên dùng cho bệnh nhân này</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};