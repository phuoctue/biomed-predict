import { useState, useEffect } from "react";
import { Plus, X, Search } from "lucide-react";
import apiClient from "@/lib/api-client";

export interface DrugSelectorItem {
  id: string;
  name: string;
  dosage?: string;
}

interface DrugSelectorProps {
  drugs: DrugSelectorItem[];
  onAdd?: (drug: DrugSelectorItem) => void;
  onRemove?: (id: string) => void;
}

export const DrugSelector = ({ drugs, onAdd, onRemove }: DrugSelectorProps) => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Search drugs from backend
  useEffect(() => {
    if (input.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/drugs", {
          params: { search: input, page: 0, size: 10 }
        });
        const results = response.data?.content || [];
        setSearchResults(results);
        setShowDropdown(true);
      } catch (error) {
        console.error("Failed to search drugs:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [input]);

  const handleSelectDrug = (drug: any) => {
    if (onAdd) {
      onAdd({
        id: drug.id,
        name: drug.name,
        dosage: drug.strength || drug.recommendedDose || ""
      });
    }
    setInput("");
    setShowDropdown(false);
    setSearchResults([]);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">
        Danh sách thuốc hiện tại
      </h3>

      {/* Input thêm thuốc với search */}
      <div className="relative mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm"
          placeholder="Tìm và thêm thuốc..."
        />
        <Search
          className="absolute left-3 top-3 text-slate-400"
          size={20}
        />

        {/* Dropdown search results */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
            {searchResults.map((drug) => (
              <div
                key={drug.id}
                onClick={() => handleSelectDrug(drug)}
                className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0"
              >
                <p className="font-bold text-slate-800 text-sm">{drug.name}</p>
                <p className="text-xs text-slate-500">
                  {drug.genericName && `${drug.genericName} • `}
                  {drug.strength || drug.recommendedDose || ""}
                </p>
              </div>
            ))}
          </div>
        )}

        {showDropdown && searchResults.length === 0 && !loading && input.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 text-center text-slate-400 text-sm">
            Không tìm thấy thuốc phù hợp
          </div>
        )}
      </div>

      {/* Danh sách thuốc đã chọn */}
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
