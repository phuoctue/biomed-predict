import { Bookmark, BookmarkCheck, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface Drug {
  id: number;
  name: string;
  code: string;
  bookmarked?: boolean;
}

interface DrugsTableProps {
  drugs: Drug[];
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  bookmarkedIds?: Set<number>;
  savingBookmarkId?: number | null;
  onToggleBookmark?: (drug: Drug, nextBookmarked: boolean) => void;
}

export const DrugsTable = ({
  drugs,
  page,
  totalPages,
  setPage,
  bookmarkedIds,
  savingBookmarkId,
  onToggleBookmark
}: DrugsTableProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
          <tr>
            <th className="p-4">Tên thuốc</th>
            <th className="p-4">Mã số</th>
            <th className="p-4 text-center">Thao tác</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {drugs.length > 0 ? (
            drugs.map((drug) => {
              const bookmarked = drug.bookmarked || bookmarkedIds?.has(drug.id) || false;
              const BookmarkIcon = bookmarked ? BookmarkCheck : Bookmark;

              return (
                <tr key={drug.id} className="hover:bg-slate-50 transition-colors duration-200">
                  <td className="p-4 font-bold text-sm text-slate-800">{drug.name}</td>
                  <td className="p-4 text-slate-500 text-sm font-medium">{drug.code}</td>
                  <td className="p-4 flex justify-center gap-2">
                    {onToggleBookmark && (
                      <button
                        aria-label={bookmarked ? "Bỏ lưu thuốc" : "Lưu thuốc"}
                        title={bookmarked ? "Bỏ lưu thuốc" : "Lưu thuốc"}
                        disabled={savingBookmarkId === drug.id}
                        onClick={() => onToggleBookmark(drug, !bookmarked)}
                        className={`p-1 rounded transition-all disabled:opacity-50 ${
                          bookmarked
                            ? "text-amber-600 hover:bg-amber-50"
                            : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                        }`}
                      >
                        <BookmarkIcon size={16} />
                      </button>
                    )}
                    <button className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-all">
                      <Pencil size={16} />
                    </button>
                    <button className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className="p-8 text-center text-slate-400 text-sm">
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
