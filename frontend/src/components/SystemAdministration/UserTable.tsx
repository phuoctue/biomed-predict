import React, { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Pagination from '@/components/ui/Pagination';

export const UserTable = () => {
  const users = [
    { name: "BS. Trần Hoàng", email: "hoang.tran@medeval.vn", role: "Bác sĩ", status: "Hoạt động" },
    { name: "DS. Lê Minh", email: "minh.le@medeval.vn", role: "Dược sĩ", status: "Hoạt động" },
    { name: "Phạm Thu", email: "thu.pham@medeval.vn", role: "Quản trị", status: "Ngoại tuyến" },
    { name: "BS. Nguyễn An", email: "an.nguyen@medeval.vn", role: "Bác sĩ", status: "Hoạt động" },
  ];

  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Tính toán dữ liệu hiển thị cho phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-6 text-base">Danh sách Người dùng</h3>
      
      <table className="w-full text-sm">
        <thead className="text-slate-500 text-[11px] uppercase font-bold tracking-wider">
          <tr className="border-b border-slate-100">
            <th className="pb-4 text-left">Người dùng</th>
            <th className="pb-4 text-left">Vai trò</th>
            <th className="pb-4 text-left">Trạng thái</th>
            <th className="pb-4 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {currentUsers.map((u, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors relative">
              <td className="py-4">
                <div className="font-bold text-slate-900">{u.name}</div>
                <div className="text-[11px] text-slate-400">{u.email}</div>
              </td>
              <td className="py-4 text-slate-700 font-medium">{u.role}</td>
              <td className="py-4">
                <span className={`flex items-center gap-1.5 text-xs font-medium ${u.status === 'Hoạt động' ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${u.status === 'Hoạt động' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  {u.status}
                </span>
              </td>
              <td className="py-4 relative">
                <button 
                  onClick={() => setOpenMenuIndex(openMenuIndex === i ? null : i)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
                {openMenuIndex === i && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl border border-slate-100 shadow-lg z-10 py-1">
                    <button onClick={() => alert(`Sửa ${u.name}`)} className="flex items-center gap-2 w-full px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">
                      <Pencil className="h-3.5 w-3.5" /> Sửa
                    </button>
                    <button onClick={() => alert(`Xóa ${u.name}`)} className="flex items-center gap-2 w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50">
                      <Trash2 className="h-3.5 w-3.5" /> Xóa
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalItems={users.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};