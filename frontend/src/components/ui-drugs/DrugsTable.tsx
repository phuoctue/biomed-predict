import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Drug } from "@/services/drug.service";

interface DrugsTableProps {
  drugs: Drug[];
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export const DrugsTable = ({ drugs, page, totalPages, setPage }: DrugsTableProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
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
              <tr key={d.id} className="hover:bg-slate-50 transition-colors duration-200">
                <td className="p-4 font-bold text-sm text-slate-800">{d.name}</td>
                <td className="p-4 text-slate-500 text-sm">{d.genericName || "—"}</td>
                <td className="p-4 text-slate-500 text-sm font-mono">{d.code}</td>
                <td className="p-4 text-slate-500 text-sm">{d.drugGroup || "—"}</td>
                <td className="p-4 text-slate-500 text-sm">{d.strength || "—"}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    d.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {d.status === "ACTIVE" ? "Đang dùng" : d.status || "—"}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  <button className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-all">
                    <Pencil size={16} />
                  </button>
                  <button className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-all">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-8 text-center text-slate-400 text-sm">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between p-4 bg-slate-50 border-t border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Trang {page + 1} / {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:border-slate-300 disabled:opacity-40 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:border-slate-300 disabled:opacity-40 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
