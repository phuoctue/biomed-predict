import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Lock, Mail, User, X } from "lucide-react";
import { apiClient } from "../../lib/api-client";

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
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload: Record<string, string> = {
        fullName: fullNameRef.current?.value ?? user.fullName,
        email: emailRef.current?.value ?? user.email,
      };
      if (isChangingPassword && newPasswordRef.current?.value) {
        payload.password = newPasswordRef.current.value;
      }
      await apiClient.put(`/users/${user.id}`, payload);
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess();
    } catch (err: unknown) {
      alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Không thể cập nhật người dùng");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
  const iconClass = "absolute left-3 top-2.5 text-slate-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Sửa thông tin người dùng</h2>
          <button onClick={onClose} className="text-slate-400 transition-colors hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <User className={iconClass} size={18} />
            <input ref={fullNameRef} defaultValue={user.fullName} className={inputClass} placeholder="Họ và tên" />
          </div>
          <div className="relative">
            <Mail className={iconClass} size={18} />
            <input ref={emailRef} defaultValue={user.email} className={inputClass} placeholder="Email" />
          </div>

          <div className="mt-4 border-t pt-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-blue-600">
              <input
                type="checkbox"
                checked={isChangingPassword}
                onChange={(e) => setIsChangingPassword(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Đổi mật khẩu
            </label>
          </div>

          {isChangingPassword ? (
            <div className="mt-2 space-y-4">
              <div className="relative">
                <Lock className={iconClass} size={18} />
                <input ref={newPasswordRef} type="password" placeholder="Mật khẩu mới" className={inputClass} />
              </div>
              <div className="relative">
                <Lock className={iconClass} size={18} />
                <input type="password" placeholder="Xác nhận mật khẩu mới" className={inputClass} />
              </div>
            </div>
          ) : null}
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 py-2 font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-70"
        >
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>
      </div>
    </div>
  );
};
