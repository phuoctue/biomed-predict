import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Lock, Mail, Shield, User, X } from "lucide-react";
import { apiClient } from "../../lib/api-client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const roleMap: Record<string, string> = {
  doctor: "DOCTOR",
  pharmacist: "PHARMACIST",
  admin: "ADMIN",
};

export const AddUserModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }
    setLoading(true);
    try {
      await apiClient.post("/users", { fullName, email, password, role: roleMap[role] });
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess();
    } catch (err: unknown) {
      alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Lỗi tạo người dùng");
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
          <h2 className="text-xl font-bold text-slate-800">Thêm người dùng mới</h2>
          <button onClick={onClose} className="text-slate-400 transition-colors hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Người dùng</label>
            <div className="relative">
              <User className={iconClass} size={18} />
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} placeholder="Họ và tên" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Vai trò</label>
            <div className="relative">
              <Shield className={iconClass} size={18} />
              <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
                <option value="doctor">Bác sĩ</option>
                <option value="pharmacist">Dược sĩ</option>
                <option value="admin">Quản trị</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail className={iconClass} size={18} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="example@medeval.vn" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Mật khẩu</label>
            <div className="relative">
              <Lock className={iconClass} size={18} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Xác nhận mật khẩu</label>
            <div className="relative">
              <Lock className={iconClass} size={18} />
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg bg-slate-100 py-2 font-bold text-slate-600 transition-colors hover:bg-slate-200">
              Hủy
            </button>
            <button type="submit" disabled={loading} className="flex-1 rounded-lg bg-blue-600 py-2 font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-70">
              {loading ? "Đang thêm..." : "Thêm người dùng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
