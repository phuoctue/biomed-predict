import React, { useState } from "react";
import { BookmarkCheck, RefreshCw, Search, Trash2 } from "lucide-react";
import { useDrugBookmarks } from "@/hooks/useDrugBookmarks";

export const BookmarkedDrugsPage = () => {
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const { bookmarks, loading, savingId, total, totalPages, refetch, toggleBookmark } =
    useDrugBookmarks(page, keyword);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600">Danh sách cá nhân</p>
          <h1 className="text-2xl font-bold text-slate-800">Thuốc đã lưu</h1>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi nhanh các thuốc người dùng quan tâm hoặc cần kiểm tra lại.
          </p>
        </div>

        <div className="flex w-full gap-3 lg:w-auto">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm lg:w-80">
            <Search size={16} className="shrink-0" />
            <input
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
                setPage(0);
              }}
              placeholder="Tìm thuốc đã lưu"
              className="min-w-0 flex-1 bg-transparent text-slate-700 outline-none"
            />
          </label>
          <button
            onClick={refetch}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
            title="Tải lại"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tổng thuốc đã lưu</p>
          <p className="text-3xl font-black text-slate-900">{total}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Đang hiển thị</p>
          <p className="text-3xl font-black text-blue-600">{bookmarks.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Trang hiện tại</p>
          <p className="text-3xl font-black text-amber-600">{page + 1}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-400">Đang tải danh sách thuốc đã lưu...</div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center text-slate-400">
            <BookmarkCheck size={32} />
            <p className="text-sm font-semibold">Chưa có thuốc nào trong danh sách lưu.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <tr>
                <th className="p-4">Tên thuốc</th>
                <th className="p-4">Mã số</th>
                <th className="p-4">Thời điểm lưu</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookmarks.map((drug) => (
                <tr key={drug.id} className="transition hover:bg-slate-50">
                  <td className="p-4 text-sm font-bold text-slate-800">{drug.name}</td>
                  <td className="p-4 text-sm font-medium text-slate-500">{drug.code}</td>
                  <td className="p-4 text-sm text-slate-500">
                    {drug.bookmarkedAt ? new Date(drug.bookmarkedAt).toLocaleDateString("vi-VN") : "--"}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleBookmark(drug.id, false)}
                      disabled={savingId === drug.id}
                      className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      title="Bỏ lưu"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Trang {page + 1} / {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 transition hover:border-slate-300 disabled:opacity-40"
            >
              Trước
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 transition hover:border-slate-300 disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
