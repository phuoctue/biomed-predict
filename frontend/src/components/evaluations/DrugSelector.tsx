import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { apiClient } from "@/lib/api-client";

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

type DrugRecord = {
  id: string;
  name: string;
  genericName?: string;
  strength?: string;
  recommendedDose?: string;
};

const PAGE_SIZE = 8;

export const DrugSelector = ({ drugs, onAdd, onRemove }: DrugSelectorProps) => {
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedInput(input.trim());
      setPage(0);
    }, 180);
    return () => window.clearTimeout(timeoutId);
  }, [input]);

  const query = useQuery({
    queryKey: ["drug-search", debouncedInput, page],
    queryFn: async () => {
      const response = await apiClient.get("/drugs", {
        params: { keyword: debouncedInput || undefined, page, size: PAGE_SIZE },
      });
      const body = response.data;
      return {
        drugs: (body.content ?? body.data ?? []) as DrugRecord[],
        totalPages: body.totalPages ?? 0,
        totalElements: body.totalElements ?? 0,
      };
    },
    enabled: isOpen,
    placeholderData: (previous) => previous,
  });

  const drugsPage = query.data?.drugs ?? [];
  const totalPages = query.data?.totalPages ?? 0;

  const handleSelectDrug = (drug: DrugRecord) => {
    onAdd?.({
      id: drug.id,
      name: drug.name,
      dosage: drug.strength || drug.recommendedDose || "",
    });
    setInput("");
    setDebouncedInput("");
    setPage(0);
    setIsOpen(false);
  };

  const canGoPrevious = page > 0;
  const canGoNext = totalPages > 0 && page < totalPages - 1;

  const subtitle = useMemo(() => {
    if (!query.data) {
      return "Đang tải danh sách thuốc...";
    }
    if (debouncedInput) {
      return `Kết quả cho: "${debouncedInput}"`;
    }
    return `Đang hiển thị ${query.data.totalElements || drugsPage.length} thuốc`;
  }, [debouncedInput, drugsPage.length, query.data]);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Danh sách thuốc hiện tại</h3>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-white"
        >
          {isOpen ? "Đóng danh sách" : "Mở danh sách"}
        </button>
      </div>

      <div className="relative mb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Tìm và thêm thuốc..."
        />
        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
      </div>

      {isOpen ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <p className="text-xs font-medium text-slate-500">{subtitle}</p>
            <button
              type="button"
              onClick={() => {
                setInput("");
                setDebouncedInput("");
                setPage(0);
                setIsOpen(true);
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Xem tất cả
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {query.isLoading ? (
              <div className="px-4 py-6 text-center text-sm text-slate-400">Đang tải danh sách thuốc...</div>
            ) : drugsPage.length > 0 ? (
              drugsPage.map((drug) => (
                <button
                  key={drug.id}
                  type="button"
                  onClick={() => handleSelectDrug(drug)}
                  className="block w-full border-b border-slate-50 px-4 py-3 text-left transition hover:bg-blue-50 last:border-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{drug.name}</p>
                      <p className="text-xs text-slate-500">
                        {drug.genericName ? `${drug.genericName} • ` : ""}
                        {drug.strength || drug.recommendedDose || "Chưa có liều"}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Chọn
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-slate-400">Không tìm thấy thuốc phù hợp</div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <button
              type="button"
              disabled={!canGoPrevious}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              Trước
            </button>

            <div className="text-xs font-medium text-slate-500">
              Trang {totalPages > 0 ? page + 1 : 0} / {totalPages || 0}
            </div>

            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => setPage((current) => current + 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sau
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {drugs.length === 0 ? (
          <span className="text-xs italic text-slate-400">Chưa có thuốc nào được kê</span>
        ) : (
          drugs.map((d) => (
            <span
              key={d.id}
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
            >
              {d.name}
              {d.dosage ? <span className="text-[10px] font-semibold text-blue-500">{d.dosage}</span> : null}
              {onRemove ? (
                <button
                  type="button"
                  aria-label={`Xóa ${d.name}`}
                  onClick={() => onRemove(d.id)}
                  className="transition-colors hover:text-blue-900"
                >
                  <X size={14} />
                </button>
              ) : null}
            </span>
          ))
        )}
      </div>
    </div>
  );
};
