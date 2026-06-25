import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Drug } from "@/services/drug.service";

interface DrugsTableProps {
  drugs: Drug[];
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  onEdit?: (drug: Drug) => void;
  onDelete?: (drug: Drug) => void;
}

export const DrugsTable = ({ drugs, page, totalPages, setPage, onEdit, onDelete }: DrugsTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <tr>
            <th className="p-4">Tên thuốc</th>
            <th className="p-4">Hoạt chất</th>
            <th className="p-4">Mã số</th>
            <th className="p-4">Nhóm</th>
            <th className="p-4">Hàm lượng</th>
            <th className="p-4">Trạng thái</th>
            <th className="p-4 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {drugs.length > 0 ? (
            drugs.map((d) => (
              <tr key={d.id} className="transition-colors duration-200 hover:bg-slate-50">
                <td className="p-4 text-sm font-bold text-slate-800">{d.name}</td>
                <td className="p-4 text-sm text-slate-500">{d.genericName || "—"}</td>
                <td className="p-4 font-mono text-sm text-slate-500">{d.code}</td>
                <td className="p-4 text-sm text-slate-500">{d.drugGroup || "—"}</td>
                <td className="p-4 text-sm text-slate-500">{d.strength || "—"}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                      d.status === "ACTIVE"
                        ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                        : "border-slate-200 bg-slate-100 text-slate-500"
                    }`}
                  >
                    {d.status === "ACTIVE" ? "Đang dùng" : d.status || "—"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(d)}
                      className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                      aria-label={`Sửa ${d.name}`}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete?.(d)}
                      className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`Xóa ${d.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-8 text-center text-sm text-slate-400">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Trang {page + 1} / {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
