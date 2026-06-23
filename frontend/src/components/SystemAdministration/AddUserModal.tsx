import React from 'react';
import { X, User, Shield, Mail, Lock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddUserModal = ({ isOpen, onClose, onSuccess }: Props) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý API tại đây
    onSuccess();
  };

  // Cập nhật inputClass: Thêm text-slate-900 và font-medium để chữ rõ nét
  const inputClass = "w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none";
  const iconClass = "absolute left-3 top-2.5 text-slate-400";

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Thêm người dùng mới</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Người dùng */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Người dùng</label>
            <div className="relative">
              <User className={iconClass} size={18} />
              <input type="text" required className={inputClass} placeholder="Họ và tên" />
            </div>
          </div>

          {/* Vai trò */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vai trò</label>
            <div className="relative">
              <Shield className={iconClass} size={18} />
              <select className={inputClass}>
                <option value="doctor">Bác sĩ</option>
                <option value="pharmacist">Dược sĩ</option>
                <option value="admin">Quản trị</option>
              </select>
            </div>
          </div>

          {/* Gmail */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className={iconClass} size={18} />
              <input type="email" required className={inputClass} placeholder="example@medeval.vn" />
            </div>
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <Lock className={iconClass} size={18} />
              <input type="password" required className={inputClass} placeholder="••••••••" />
            </div>
          </div>

          {/* Xác nhận MK */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu</label>
            <div className="relative">
              <Lock className={iconClass} size={18} />
              <input type="password" required className={inputClass} placeholder="••••••••" />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              Hủy
            </button>
            <button type="submit" className="flex-1 py-2 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
              Thêm người dùng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};