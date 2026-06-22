import { useState } from "react";
import { Plus, X } from "lucide-react";

export interface DrugSelectorItem {
  id: string;
  name: string;
  dosage?: string;
}

interface DrugSelectorProps {
  drugs: DrugSelectorItem[];
  onRemove?: (id: string) => void;
}

export const DrugSelector = ({ drugs, onRemove }: DrugSelectorProps) => {
  const [input, setInput] = useState("");

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">
        Danh sách thuốc hiện tại
      </h3>

      {/* Input thêm thuốc */}
      <div className="relative mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full pl-4 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm"
          placeholder="Thêm tên thuốc..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setInput("");
            }
          }}
        />
        <Plus
          className="absolute right-3 top-3 text-slate-400 cursor-pointer hover:text-blue-600"
          size={20}
        />
      </div>

      {/* Danh sách thuốc */}
      <div className="flex flex-wrap gap-2">
        {drugs.length === 0 ? (
          <span className="text-xs text-slate-400 italic">
            Chưa có thuốc nào được kê
          </span>
        ) : (
          drugs.map((d) => (
            <span
              key={d.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100"
            >
              {d.name}
              {d.dosage && (
                <span className="text-[10px] text-blue-500 font-semibold">
                  {d.dosage}
                </span>
              )}
              {onRemove && (
                <button
                  onClick={() => onRemove(d.id)}
                  className="hover:text-blue-900 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </span>
          ))
        )}
      </div>
    </div>
  );
};
