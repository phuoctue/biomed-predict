import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { routePaths } from "../../../app/routes/route-paths";
import { LoginInput } from "../../../components/layout/login-input";
import { RoleTabs, RoleType } from "../../../components/layout/role-tabs";
import { Spinner } from "@/components/ui/Spinner";
import { loginApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export function LoginPage() {
  const [role, setRole] = useState<RoleType>("doctor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (result) => {
      setAuth({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
      navigate(routePaths.dashboard, { replace: true });
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      setError(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate({ email, password });
  };

  const isSubmitting = loginMutation.isPending;

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

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4 sm:p-8">
        <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-slate-100/80 bg-white p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-1.5 text-2xl font-bold tracking-wide text-blue-600">
              <span className="rounded border-2 border-blue-600 p-0.5 text-xs font-black">✚</span>
              <span>MedEval</span>
            </div>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-slate-400">
              Hệ thống hỗ trợ lâm sàng thông minh
            </p>
          </div>

          <h2 className="mb-6 text-xl font-bold text-slate-800 sm:text-2xl">
            Chào mừng quay trở lại
          </h2>

          <RoleTabs activeRole={role} onChange={setRole} />

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            <LoginInput
              label="Email"
              type="email"
              required
              placeholder="doctor@mediai.local"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
            />

            <div className="relative">
              <div className="absolute right-0 top-0 z-10">
                <a href="#forgot" className="text-xs font-semibold text-blue-600 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
              <LoginInput
                label="Mật khẩu"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="flex items-center justify-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>

            <div className="flex items-center pt-1">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block cursor-pointer select-none text-xs font-medium text-slate-500"
              >
                Duy trì trạng thái đăng nhập
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 disabled:opacity-70"
            >
              {isSubmitting ? (
                <Spinner label="Đang xác thực..." className="text-white" />
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-xs font-medium text-slate-500">
            Chưa có tài khoản chuyên gia?{" "}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
