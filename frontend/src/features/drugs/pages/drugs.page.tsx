import { useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import { AddButton } from "@/components/ui/AddButton";
import { DrugModal } from "@/components/ui-drugs/DrugModal";
import { DrugsTable } from "@/components/ui-drugs/DrugsTable";
import { FilterBar } from "@/components/ui-drugs/FilterBar";
import { StatsSection } from "@/components/ui-drugs/StatsSection";
import { TrendChart } from "@/components/ui-drugs/TrendChart";
import { useDrugs } from "@/hooks/useDrugs";
import { drugAPI } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Drug } from "@/services/drug.service";

type DrugFilters = {
  drugGroup: string;
  ingredient: string;
  status: string;
};

const initialFilters: DrugFilters = {
  drugGroup: "",
  ingredient: "",
  status: "",
};

export const DrugsPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<DrugFilters>(initialFilters);
  const [draftFilters, setDraftFilters] = useState<DrugFilters>(initialFilters);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isAddDrugOpen, setIsAddDrugOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState<Drug | null>(null);

  const advanced = useMemo(
    () => Boolean(filters.drugGroup || filters.ingredient || filters.status),
    [filters]
  );

  const { drugs, loading, totalPages, refetch } = useDrugs(page, searchQuery, {
    drugGroup: filters.drugGroup || undefined,
    ingredient: filters.ingredient || undefined,
    status: filters.status || undefined,
    advanced,
  });

  const applyAdvancedFilters = () => {
    setFilters({
      drugGroup: draftFilters.drugGroup.trim(),
      ingredient: draftFilters.ingredient.trim(),
      status: draftFilters.status.trim(),
    });
    setPage(0);
    setIsAdvancedOpen(false);
  };

  const clearAdvancedFilters = () => {
    setDraftFilters(initialFilters);
    setFilters(initialFilters);
    setPage(0);
  };

  const hasSearch = searchQuery.trim().length > 0;

  const deleteDrug = useMutation({
    mutationFn: async (drug: Drug) => {
      await drugAPI.delete(drug.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["drugs"] });
    },
  });

  const handleDeleteDrug = async (drug: Drug) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa thuốc "${drug.name}" không?`);
    if (!confirmed) return;

    try {
      await deleteDrug.mutateAsync(drug);
      await refetch();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.response?.data?.error || err.message
        : err instanceof Error
          ? err.message
          : "Không thể xóa thuốc.";
      window.alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản Lý Danh Mục Thuốc</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tìm nhanh theo tên, mã thuốc hoặc hoạt chất trong toàn bộ kho danh mục.
          </p>
        </div>
        <div className="hidden rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-right lg:block">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Kết quả hiện tại</p>
          <p className="text-lg font-black text-blue-700">{drugs.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="space-y-6 lg:col-span-3">
          <StatsSection />

          <AddButton label="Thêm thuốc mới" onClick={() => setIsAddDrugOpen(true)} />

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <FilterBar
              value={searchQuery}
              onSearch={(v) => {
                setSearchQuery(v);
                setPage(0);
              }}
              onClear={() => {
                setSearchQuery("");
                setPage(0);
              }}
            />

            <div className="mb-3 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-medium text-slate-500">
                {hasSearch ? `Đang lọc theo: "${searchQuery}"` : "Đang hiển thị toàn bộ danh mục"}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Trang {page + 1} / {totalPages || 1}</span>
                {advanced ? (
                  <span className="rounded-full bg-blue-50 px-2 py-1 font-semibold text-blue-600">
                    Đang áp dụng lọc nâng cao
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAdvancedOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                <Filter className="h-4 w-4" />
                Lọc nâng cao
              </button>
              {advanced ? (
                <button
                  type="button"
                  onClick={clearAdvancedFilters}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  <X className="h-4 w-4" />
                  Xóa bộ lọc
                </button>
              ) : null}
            </div>

            {isAdvancedOpen ? (
              <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Nhóm thuốc</span>
                    <input
                      value={draftFilters.drugGroup}
                      onChange={(e) => setDraftFilters((prev) => ({ ...prev, drugGroup: e.target.value }))}
                      placeholder="VD: ARB, PPI..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Hoạt chất</span>
                    <input
                      value={draftFilters.ingredient}
                      onChange={(e) => setDraftFilters((prev) => ({ ...prev, ingredient: e.target.value }))}
                      placeholder="VD: Paracetamol"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Trạng thái</span>
                    <select
                      value={draftFilters.status}
                      onChange={(e) => setDraftFilters((prev) => ({ ...prev, status: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Tất cả</option>
                      <option value="ACTIVE">Đang dùng</option>
                      <option value="INACTIVE">Ngừng lưu hành</option>
                    </select>
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={applyAdvancedFilters}
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Áp dụng bộ lọc
                  </button>
                  <button
                    type="button"
                    onClick={clearAdvancedFilters}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Xóa lọc
                  </button>
                </div>
              </div>
            ) : null}

            {loading ? (
              <div className="py-20 text-center text-slate-400">Đang tải dữ liệu...</div>
            ) : drugs.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                {hasSearch || advanced
                  ? "Không tìm thấy thuốc nào khớp với bộ lọc hiện tại."
                  : "Không tìm thấy kết quả nào."}
              </div>
            ) : (
              <DrugsTable
                drugs={drugs}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                onEdit={(drug) => setEditingDrug(drug)}
                onDelete={handleDeleteDrug}
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <TrendChart />
        </div>
      </div>

      <DrugModal
        isOpen={isAddDrugOpen}
        mode="create"
        onClose={() => setIsAddDrugOpen(false)}
        onSuccess={async () => {
          setIsAddDrugOpen(false);
          setPage(0);
          await refetch();
        }}
      />

      <DrugModal
        isOpen={Boolean(editingDrug)}
        mode="edit"
        drugId={editingDrug?.id}
        initialValues={editingDrug ? { ...editingDrug, status: editingDrug.status || "ACTIVE" } : undefined}
        onClose={() => setEditingDrug(null)}
        onSuccess={async () => {
          setEditingDrug(null);
          setPage(0);
          await refetch();
        }}
      />
    </div>
  );
};
