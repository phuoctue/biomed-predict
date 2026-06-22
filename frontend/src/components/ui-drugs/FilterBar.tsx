import { SlidersHorizontal, Search } from "lucide-react";

interface FilterBarProps {
  onSearch: (val: string) => void;
}

export const FilterBar = ({ onSearch }: FilterBarProps) => (
  <div className="flex gap-4 mb-6">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-3 text-slate-400 h-4 w-4" />
      <input 
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Tìm kiếm tên thuốc, mã số..." 
        // Đã thêm: bg-white (nền trắng), text-slate-900 (chữ đen)
        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400"
      />
    </div>
    
    {/* Đã thêm: bg-white (nền trắng), text-slate-900 (chữ đen) */}
    <button className="flex items-center gap-2 px-4 border border-slate-200 rounded-xl text-sm font-bold bg-white text-slate-900 hover:bg-slate-50">
      <SlidersHorizontal className="h-4 w-4" /> Lọc nâng cao
    </button>
  </div>
);