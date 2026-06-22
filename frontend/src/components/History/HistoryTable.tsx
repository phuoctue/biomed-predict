import React, { useState } from "react";
import Pagination from "@/components/ui/Pagination"; // Đảm bảo đường dẫn đúng

export const HistoryTable = () => {
  // Giả sử đây là toàn bộ dữ liệu (tăng số lượng để test phân trang)
  const allData = [
    {
      name: "Lê Văn Việt",
      age: 64,
      mrn: "88219",
      risk: "CAO",
      color: "bg-rose-100 text-rose-600"
    },
    {
      name: "Nguyễn Thị Thu",
      age: 42,
      mrn: "99102",
      risk: "THẤP",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      name: "Phạm Hoàng Nam",
      age: 55,
      mrn: "77341",
      risk: "TRUNG BÌNH",
      color: "bg-amber-100 text-amber-700"
    },
    {
      name: "Phạm Hoàng Nam",
      age: 55,
      mrn: "77341",
      risk: "TRUNG BÌNH",
      color: "bg-amber-100 text-amber-700"
    },
    {
      name: "Phạm Hoàng Nam",
      age: 55,
      mrn: "77341",
      risk: "TRUNG BÌNH",
      color: "bg-amber-100 text-amber-700"
    },
    {
      name: "Phạm Hoàng Nam",
      age: 55,
      mrn: "77341",
      risk: "TRUNG BÌNH",
      color: "bg-amber-100 text-amber-700"
    },
    {
      name: "Phạm Hoàng Nam",
      age: 55,
      mrn: "77341",
      risk: "TRUNG BÌNH",
      color: "bg-amber-100 text-amber-700"
    },
    {
      name: "Phạm Hoàng Nam",
      age: 55,
      mrn: "77341",
      risk: "TRUNG BÌNH",
      color: "bg-amber-100 text-amber-700"
    },
    {
      name: "Phạm Hoàng Nam",
      age: 55,
      mrn: "77341",
      risk: "TRUNG BÌNH",
      color: "bg-amber-100 text-amber-700"
    },
    {
      name: "Phạm Hoàng Nam",
      age: 55,
      mrn: "77341",
      risk: "TRUNG BÌNH",
      color: "bg-amber-100 text-amber-700"
    },
    {
      name: "Phạm Hoàng Nam",
      age: 55,
      mrn: "77341",
      risk: "TRUNG BÌNH",
      color: "bg-amber-100 text-amber-700"
    },
    {
      name: "Phạm Hoàng Nam",
      age: 55,
      mrn: "77341",
      risk: "TRUNG BÌNH",
      color: "bg-amber-100 text-amber-700"
    },
    {
      name: "Phạm Hoàng Nam",
      age: 55,
      mrn: "77341",
      risk: "TRUNG BÌNH",
      color: "bg-amber-100 text-amber-700"
    }
    // ... thêm nhiều data để test
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = allData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/50 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
            <tr>
              <th className="p-5 text-left">Bệnh nhân</th>
              <th className="p-5 text-left">Mã hồ sơ</th>
              <th className="p-5 text-left">Chỉ số rủi ro</th>
              <th className="p-5 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentData.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-5 font-semibold text-slate-900">
                  {row.name}
                  <span className="text-slate-400 font-normal ml-1">
                    , {row.age} tuổi
                  </span>
                </td>
                <td className="p-5 text-slate-600 font-medium font-mono">
                  #{row.mrn}
                </td>
                <td className="p-5">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${row.color}`}
                  >
                    {row.risk}
                  </span>
                </td>
                <td className="p-5 text-blue-600 font-bold cursor-pointer hover:underline text-xs">
                  Xem chi tiết →
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Component Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalItems={allData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
