import React from 'react';
import { X, Pill, Tag, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDrugModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  const inputClass = "w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all";
  const iconClass = "absolute left-3 top-2.5 text-slate-400";

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Thêm thuốc mới</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4">
          {/* Tên thuốc */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên thuốc</label>
            <div className="relative">
              <Pill className={iconClass} size={18} />
              <input type="text" required className={inputClass} placeholder="VD: Paracetamol 500mg" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Mã thuốc */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mã thuốc</label>
              <div className="relative">
                <Tag className={iconClass} size={18} />
                <input type="text" required className={inputClass} placeholder="VD: TH-001" />
              </div>
            </div>
            {/* Hạn dùng */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hạn sử dụng</label>
              <input type="date" required className="w-full text-slate-400 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả / Chỉ định</label>
            <div className="relative">
              <FileText className={iconClass} size={18} />
              <textarea className={`${inputClass} min-h-[80px]`} placeholder="Nhập công dụng chính..." />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              Hủy
            </button>
            <button type="submit" className="flex-1 py-2 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
              Thêm thuốc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};