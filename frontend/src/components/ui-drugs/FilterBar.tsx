import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface FilterBarProps {
  value?: string;
  onSearch: (val: string) => void;
  onClear?: () => void;
}

export const FilterBar = ({ value = "", onSearch, onClear }: FilterBarProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => onSearch(localValue.trim()), 220);
    return () => window.clearTimeout(timeoutId);
  }, [localValue, onSearch]);

  const handleClear = () => {
    setLocalValue("");
    onClear?.();
    onSearch("");
  };

  return (
    <div className="mb-6 flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder="Tìm theo tên, mã, hoạt chất..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        {localValue ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Xóa tìm kiếm"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <button
        type="button"
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 transition hover:bg-slate-50"
      >
        <SlidersHorizontal className="h-4 w-4" /> Lọc nâng cao
      </button>
    </div>
  );
};
