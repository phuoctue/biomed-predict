import { Plus } from "lucide-react";

export const DrugSelector = () => {
  const drugs = ["Lisinopril 10mg", "Amlodipine 5mg", "Warfarin 2mg"];
  
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Danh sách thuốc hiện tại</h3>
      <div className="relative mb-4">
        <input 
          className="w-full pl-4 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
          placeholder="Thêm tên thuốc..."
        />
        <Plus className="absolute right-3 top-3 text-slate-400" size={20} />
      </div>
      <div className="flex flex-wrap gap-2">
        {drugs.map((d, i) => (
          <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100 flex items-center gap-2">
            {d} <span className="cursor-pointer font-bold">×</span>
          </span>
        ))}
      </div>
    </div>
  );
};