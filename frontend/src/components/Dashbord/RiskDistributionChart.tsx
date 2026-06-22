export const RiskDistributionChart = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-bold text-slate-800">Phân bổ rủi ro lâm sàng</h3>
      <select className="text-xs border rounded-lg p-1 text-slate-500">
        <option>Tháng này</option>
      </select>
    </div>
    <div className="h-64 flex items-end gap-4">
      {/* Giả lập biểu đồ cột bằng div */}
      {["Tim mạch", "Nội tiết", "Nhi khoa", "Thần kinh"].map((label, i) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full bg-blue-600 rounded-t-lg" style={{ height: `${(i + 1) * 40}px` }}></div>
          <span className="text-[10px] font-bold text-slate-400">{label}</span>
        </div>
      ))}
    </div>
  </div>
);