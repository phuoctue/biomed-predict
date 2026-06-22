export const PatientEvaluationTable = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-6">
    <table className="w-full text-sm">
      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
        <tr>
          <th className="p-4 text-left">Bệnh nhân</th>
          <th className="p-4 text-left">Ngày đánh giá</th>
          <th className="p-4 text-left">Rủi ro</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        <tr className="hover:bg-slate-50 transition-colors">
          {/* Tăng độ đậm và màu cho tên bệnh nhân để dễ nhìn */}
          <td className="p-4 font-bold text-slate-900">Nguyễn Thị Thanh</td>
          
          {/* Màu xám đậm hơn một chút so với mặc định để tăng độ tương phản */}
          <td className="p-4 text-slate-700 font-medium">24/10/2023</td>
          
          <td className="p-4">
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold text-[10px] border border-emerald-100">
              THẤP
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);