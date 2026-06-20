import React from "react";
import { PrescribedDrug } from "@/types/evaluation"; // Giả sử bạn đã có file type này

interface TableProps {
  drugs: PrescribedDrug[];
}

export const PrescribedDrugTable = ({ drugs = [] }: TableProps) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
    <h3 className="text-sm font-bold text-slate-900 mb-4">Danh mục thuốc đang dùng</h3>
    <table className="w-full text-sm">
      <thead>
        <tr className="text-slate-400 text-left border-b">
          <th className="pb-3">Tên thuốc</th>
          <th className="pb-3">Liều dùng</th>
          <th className="pb-3">Chỉ định</th>
        </tr>
      </thead>
      <tbody>
        {drugs?.map((drug) => (
          <tr key={drug.id} className="border-b last:border-0">
            <td className="py-3 font-bold">{drug.name}</td>
            <td className="py-3">{drug.dosage}</td>
            <td className="py-3">{drug.indication}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);