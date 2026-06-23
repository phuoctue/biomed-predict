import React, { useState, useRef } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { apiClient } from '../../lib/api-client';

// Định nghĩa kiểu dữ liệu cho User và Props
export interface EditableUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  department?: string;
}

interface Props {
  isOpen: boolean;
  user: EditableUser | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditUserModal = ({ isOpen, user, onClose, onSuccess }: Props) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    try {
      const payload: Record<string, string> = {
        fullName: fullNameRef.current?.value ?? user.fullName,
        email: emailRef.current?.value ?? user.email,
      };
      if (isChangingPassword && newPasswordRef.current?.value) {
        payload.password = newPasswordRef.current.value;
      }
      await apiClient.put(`/users/${user.id}`, payload);
      onSuccess();
    } catch (err: unknown) {
      alert(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Không thể cập nhật người dùng'
      );
    }
  };

  // Class dùng chung cho các input để đảm bảo đồng bộ giao diện
  const inputClass = "w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none";
  const iconClass = "absolute left-3 top-2.5 text-slate-400";

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Sửa thông tin người dùng</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Tên */}
          <div className="relative">
            <User className={iconClass} size={18} />
            <input ref={fullNameRef} defaultValue={user.fullName} className={inputClass} placeholder="Họ và tên" />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className={iconClass} size={18} />
            <input ref={emailRef} defaultValue={user.email} className={inputClass} placeholder="Email" />
          </div>
          
          {/* Checkbox Đổi MK */}
          <div className="mt-4 border-t pt-4">
            <label className="flex items-center gap-2 text-sm font-medium text-blue-600 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isChangingPassword}
                onChange={(e) => setIsChangingPassword(e.target.checked)} 
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Đổi mật khẩu
            </label>
          </div>

          {/* Trường đổi MK */}
          {isChangingPassword && (
            <div className="space-y-4 mt-2">
              <div className="relative">
                <Lock className={iconClass} size={18} />
                <input ref={newPasswordRef} type="password" placeholder="Mật khẩu mới" className={inputClass} />
              </div>
              <div className="relative">
                <Lock className={iconClass} size={18} />
                <input type="password" placeholder="Xác nhận mật khẩu mới" className={inputClass} />
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleSave}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
        >
          Cập nhật
        </button>
      </div>
    </div>
  );
};
