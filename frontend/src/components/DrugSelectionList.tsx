import React from "react";
import { Search, Plus, AlertCircle, Trash2 } from "lucide-react";

interface DrugItem {
  id: number;
  name: string;
  type: string;
  isWarning?: boolean;
}

interface DrugSelectionListProps {
  patientName: string;
  patientId: string;
  selectedDrugs: DrugItem[];
  onRemoveDrug: (id: number) => void;
}

export const DrugSelectionList: React.FC<DrugSelectionListProps> = ({
  patientName,
  patientId,
  selectedDrugs,
  onRemoveDrug,
}) => {
  return (
    <div className="space-y-6">
      {/* Chọn bệnh nhân */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase mb-3">Chọn bệnh nhân</h3>
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:border-blue-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
              {patientName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{patientName}</p>
              <p className="text-[10px] text-slate-400 font-bold">ID: {patientId}</p>
            </div>
          </div>
          <Search className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
        </div>
      </div>

      {/* Danh sách thuốc */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black text-slate-400 uppercase">Danh sách thuốc hiện tại</h3>
          <span className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">+ Nhập từ đơn cũ</span>
        </div>

        <div className="space-y-2">
          {selectedDrugs.map((drug) => (
            <div
              key={drug.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                drug.isWarning
                  ? "bg-rose-50 border-rose-200 text-rose-900 shadow-sm"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              <span className="text-xs font-bold">{drug.name}</span>
              <div className="flex items-center gap-2">
                {drug.isWarning && <AlertCircle className="h-3.5 w-3.5 text-rose-500" />}
                <Trash2
                  onClick={() => onRemoveDrug(drug.id)}
                  className="h-3.5 w-3.5 text-slate-300 hover:text-rose-500 cursor-pointer transition-colors"
                />
              </div>
            </div>
          ))}

          <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all group">
            <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Thêm thuốc vào danh sách...</span>
          </button>
        </div>
      </div>
    </div>
  );
};