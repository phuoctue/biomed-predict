import { TrendingUp } from "lucide-react";

export const TrendChart = () => (
  // Dùng shadow-sm nhẹ và bo góc rounded-2xl để đồng bộ với các component khác
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
    <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-slate-800">
      {/* Icon dùng màu blue-600 đậm hơn, trông sang trọng hơn blue-500 */}
      <div className="p-1.5 bg-blue-50 rounded-lg">
        <TrendingUp className="text-blue-600" size={16}/>
      </div>
      Xu Hướng Cấp Phát
    </h3>
    
    {/* Gợi ý thêm các đường gạch ngang (grid lines) hoặc placeholder để tạo cảm giác biểu đồ */}
    <div className="h-40 flex items-end justify-between gap-2 opacity-50">
      {[40, 60, 35, 75, 60, 90].map((h, i) => (
        <div 
          key={i} 
          className="w-full bg-blue-600 rounded-t-lg transition-all hover:bg-blue-700" 
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  </div>
);