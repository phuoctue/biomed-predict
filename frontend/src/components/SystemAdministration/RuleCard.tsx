import React, { useState } from 'react';

// Giả định bạn dùng Lucide React cho icon
import { Settings } from 'lucide-react'; 

export const RuleCard = ({ title, desc }: { title: string, desc: string }) => {
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <div className={`p-4 border rounded-xl transition-all cursor-pointer ${isEnabled ? 'border-blue-500 bg-blue-50/10' : 'border-slate-200'} hover:border-blue-500`}>
      {/* Header card */}
      <div className="flex justify-between items-start mb-3">
        <Settings size={20} className={isEnabled ? "text-blue-600" : "text-slate-400"} />
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${isEnabled ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
          {isEnabled ? 'Đang bật' : 'Đã tắt'}
        </span>
      </div>

      {/* Nội dung */}
      <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{desc}</p>
      
      {/* Footer */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-[10px] text-slate-400 font-medium">Cập nhật: 2 tuần trước</span>
        
        {/* Toggle Switch */}
        <button 
          onClick={() => setIsEnabled(!isEnabled)}
          className={`w-10 h-5 rounded-full relative transition-colors ${isEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
        >
          <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
        </button>
      </div>
    </div>
  );
};