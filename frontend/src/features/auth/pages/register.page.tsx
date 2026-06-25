import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../../lib/api-client";
import { RoleTabs, RoleType } from "../../../components/layout/role-tabs";
import { LoginInput } from "../../../components/layout/login-input";

export function RegisterPage() {
  const [role, setRole] = useState<RoleType>("doctor");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseId, setLicenseId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/users", {
        fullName,
        email,
        password,
        role: role === "doctor" ? "DOCTOR" : role === "pharmacist" ? "PHARMACIST" : "MEDICAL_STAFF",
        department: licenseId,
        phone,
      });
      return response.data;
    },
    onSuccess: () => {
      alert("Tạo tài khoản thành công!");
      navigate("/login", { replace: true });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Đăng ký thất bại";
      alert(msg);
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không trùng khớp!");
      return;
    }
    if (!acceptTerms) {
      alert("Bạn cần đồng ý với điều khoản sử dụng.");
      return;
    }
    registerMutation.mutate();
  };

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-slate-50 font-sans antialiased">
      <div className="absolute inset-0 flex h-full w-full select-none pointer-events-none">
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-tr from-blue-50/40 to-white" />
        <div
          className="w-full bg-cover bg-center opacity-90 lg:w-1/2 lg:opacity-100"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0.15) 100%), url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-100/80 bg-white p-6 shadow-2xl backdrop-blur-sm sm:p-8">
          <div className="mb-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-2xl font-bold tracking-wide text-blue-600">
              <span className="rounded border-2 border-blue-600 p-0.5 text-xs font-black">✚</span>
              <span>MedEval</span>
            </div>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-slate-400">
              Hệ thống hỗ trợ lâm sàng thông minh
            </p>
          </div>

          <h2 className="mb-5 text-xl font-bold text-slate-800 sm:text-2xl">Đăng ký tài khoản chuyên gia</h2>
          <RoleTabs activeRole={role} onChange={setRole} />

          <form onSubmit={handleRegister} className="mt-2 w-full space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-4">
                <LoginInput label="Họ và tên" type="text" required placeholder="Bác sĩ Nguyễn Văn A" value={fullName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} icon={<User className="h-4 w-4" />} />
                <LoginInput label="Địa chỉ Email" type="email" required placeholder="doctor@medeval.vn" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} icon={<Mail className="h-4 w-4" />} />
                <LoginInput label="Số điện thoại" type="tel" required placeholder="0901 234 567" value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} icon={<Phone className="h-4 w-4" />} />
              </div>

              <div className="space-y-4">
                <LoginInput label="Mã số hành nghề (CCHN)" type="text" required placeholder="012345/BYT-CCHN" value={licenseId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLicenseId(e.target.value)} icon={<ShieldCheck className="h-4 w-4" />} />
                <LoginInput label="Mật khẩu" type={showPassword ? "text" : "password"} required placeholder="••••••••" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} icon={<Lock className="h-4 w-4" />} />
                <LoginInput
                  label="Xác nhận mật khẩu"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                  rightElement={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="flex items-center justify-center text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
              </div>
            </div>

            <div className="flex items-start pt-2">
              <input
                id="accept-terms"
                type="checkbox"
                required
                checked={acceptTerms}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 cursor-pointer rounded border border-slate-300 bg-white text-blue-600 transition-colors hover:border-slate-400 focus:ring-slate-200 focus:ring-offset-0 checked:border-slate-300 checked:bg-white"
              />
              <label htmlFor="accept-terms" className="ml-2 block cursor-pointer select-none text-xs font-medium leading-normal text-slate-500">
                Tôi đồng ý với <a href="#terms" className="font-semibold text-blue-600 hover:underline">Điều khoản sử dụng</a> và cam kết bảo mật thông tin bệnh án.
              </label>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 disabled:opacity-70"
            >
              <span>{registerMutation.isPending ? "Đang xử lý tạo tài khoản..." : "Đăng ký tài khoản"}</span>
              {!registerMutation.isPending && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
            </button>
          </form>

          <div className="mt-6 text-xs font-medium text-slate-500">
            Đã có tài khoản chuyên gia?{" "}
            <Link to="/login" className="font-bold text-blue-600 hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
