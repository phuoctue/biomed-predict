export const RoleDistributionChart = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <h3 className="font-bold text-slate-900">Phân bổ Vai trò</h3>
    <p className="text-[10px] text-slate-500 mb-6">Tỷ lệ nhân sự theo chức năng chuyên môn.</p>
    
    {/* Vùng biểu đồ */}
    <div className="flex justify-center my-4">
      <div className="w-32 h-32 rounded-full border-[10px] border-emerald-600 flex flex-col items-center justify-center shadow-inner">
        <span className="text-2xl font-black text-slate-900">128</span>
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tổng</span>
      </div>
    </div>

    {/* Danh sách chú thích */}
    <div className="space-y-3 mt-6">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div> 
          <span>Bác sĩ</span>
        </div>
        <span className="text-slate-900">45%</span>
      </div>
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-600"></div> 
          <span>Dược sĩ</span>
        </div>
        <span className="text-slate-900">35%</span>
      </div>
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-300"></div> 
          <span>Quản trị</span>
        </div>
        <span className="text-slate-900">20%</span>
      </div>
    </div>
  </div>
);