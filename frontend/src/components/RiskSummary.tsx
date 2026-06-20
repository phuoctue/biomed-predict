import { Dna } from "lucide-react";

export const RiskSummary = () => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-5">
    <h3 className="text-sm font-bold text-slate-900">Rủi ro theo cá thể</h3>
    {/* Các thanh progress bar rủi ro ở đây... */}
    <div className="pt-4 border-t">
      <div className="bg-blue-50 p-3 rounded-xl flex gap-2">
        <Dna className="h-4 w-4 text-blue-600" />
        <p className="text-xs text-blue-900 font-bold">CYP2C19 *2 Allele - Giảm chuyển hóa</p>
      </div>
    </div>
  </div>
);