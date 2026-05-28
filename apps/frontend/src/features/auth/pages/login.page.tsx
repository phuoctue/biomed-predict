import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Tối thiểu 8 ký tự")
});

type LoginInput = z.infer<typeof schema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(schema)
  });

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      navigate("/");
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-100 via-white to-emerald-100 px-4 dark:from-slate-900 dark:via-slate-950 dark:to-cyan-950">
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <h1 className="mb-2 text-2xl font-bold text-cyan-700 dark:text-cyan-300">MediAI Sign In</h1>
        <p className="mb-6 text-sm text-slate-500">AI-powered Drug-Biomedical Decision Support</p>
        <div className="mb-4">
          <input {...register("email")} placeholder="Email" className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div className="mb-4">
          <input type="password" {...register("password")} placeholder="Password" className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800" />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <button type="submit" className="w-full rounded-lg bg-cyan-700 py-2 font-semibold text-white hover:bg-cyan-800 disabled:opacity-50" disabled={mutation.isPending}>
          {mutation.isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};
