export const WeeklyTrendChart = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <h3 className="font-bold text-slate-800 mb-4">Xu hướng đánh giá hàng tuần</h3>
    <div className="h-40 bg-slate-50 rounded-lg flex items-end p-4 gap-2">
      {/* Thay thế bằng thư viện biểu đồ như Recharts */}
      <div className="w-full bg-blue-200 h-1/2 rounded-t-lg"></div>
      <div className="w-full bg-blue-600 h-3/4 rounded-t-lg"></div>
    </div>
  </div>
);