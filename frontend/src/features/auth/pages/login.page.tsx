import { useMutation } from "@tanstack/react-query";
import { ArrowRight, BadgeInfo, BrainCircuit, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { routePaths } from "../../../app/routes/route-paths";
import { loginApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

type LoginForm = z.infer<typeof loginSchema>;

const highlights = [
  "Drug suitability scoring",
  "Alternative medication suggestions",
  "Natural language clinical explanation"
];

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "doctor@mediai.local",
      password: "password123"
    }
  });

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      setAuth(response);
      navigate(routePaths.dashboard);
    }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.24),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_28%),linear-gradient(180deg,#020617_0%,#08111d_45%,#020617_100%)]" />
      <div className="absolute inset-0 -z-10 bg-hero-grid bg-[size:26px_26px] opacity-20" />

      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <section className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur-xl lg:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100">
              <BrainCircuit className="h-4 w-4" />
              MediAI clinical decision workspace
            </div>

            <h1 className="mt-8 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Safer medication decisions, faster patient context, clearer AI explanations.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Designed for physicians and pharmacists to review drug fit, compare alternatives, and explain
              results in plain language.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <article key={item} className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
                <ShieldCheck className="h-5 w-5 text-cyan-300" />
                <p className="mt-3 text-sm font-medium text-white">{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-glow backdrop-blur-xl">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Sign in</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Access the medical AI cockpit</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Enter your clinical account to review patients, drugs, and AI-generated assessments.
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
            >
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                  <Mail className="h-4 w-4 text-cyan-300" />
                  Email
                </span>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="doctor@mediai.local"
                  {...register("email")}
                />
                {errors.email ? <p className="mt-2 text-xs text-rose-300">{errors.email.message}</p> : null}
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                  <LockKeyhole className="h-4 w-4 text-cyan-300" />
                  Password
                </span>
                <input
                  type="password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password ? <p className="mt-2 text-xs text-rose-300">{errors.password.message}</p> : null}
              </label>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loginMutation.isPending ? "Signing in..." : "Enter MediAI"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
              <div className="flex items-start gap-3">
                <BadgeInfo className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  This base expects your Java API to expose <code>/auth/login</code> and return a JWT plus
                  user profile.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

