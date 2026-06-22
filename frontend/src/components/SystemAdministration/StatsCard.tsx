export const RoleDistributionChart = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    {/* Tăng độ đậm của tiêu đề chính */}
    <h3 className="font-bold text-slate-900 text-sm">Phân bổ Vai trò</h3>
    
    {/* Đổi slate-400 thành slate-500 để tăng độ tương phản */}
    <p className="text-[10px] text-slate-500 mb-6 font-medium">Tỷ lệ nhân sự theo chức năng chuyên môn.</p>
    
    <div className="flex justify-center my-6">
      <div className="h-32 w-32 rounded-full border-[10px] border-emerald-600 flex flex-col items-center justify-center">
        {/* Số liệu quan trọng cần độ đen tuyệt đối */}
        <span className="font-black text-3xl text-slate-900">128</span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tổng</span>
      </div>
    </div>
    
    {/* Sử dụng text-slate-700 thay vì mặc định để chữ rõ nét hơn */}
    <div className="space-y-3 text-xs text-slate-700 font-medium">
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span> Bác sĩ
        </span> 
        <span className="font-bold text-slate-900">45%</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Dược sĩ
        </span> 
        <span className="font-bold text-slate-900">35%</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-300"></span> Quản trị
        </span> 
        <span className="font-bold text-slate-900">20%</span>
      </div>
    </div>
  </div>
);