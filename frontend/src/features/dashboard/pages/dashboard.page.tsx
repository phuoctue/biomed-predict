import { Activity, ArrowUpRight, BrainCircuit, Pill, ShieldAlert, Users } from "lucide-react";

const stats = [
  { label: "Patients monitored", value: "1,248", delta: "+12%", icon: Users },
  { label: "Evaluations today", value: "86", delta: "+18%", icon: BrainCircuit },
  { label: "High-risk flags", value: "14", delta: "-4%", icon: ShieldAlert },
  { label: "Drug references", value: "4,932", delta: "+7%", icon: Pill }
];

const evaluations = [
  { patient: "Nguyen Van A", drug: "Metformin", result: "Suitable", note: "Low interaction risk" },
  { patient: "Tran Thi B", drug: "Warfarin", result: "Review", note: "Potential bleed interaction" },
  { patient: "Le Minh C", drug: "Amoxicillin", result: "Suitable", note: "No allergy conflict found" }
];

export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-200">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.delta}
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">AI review queue</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Recent medication evaluations</h3>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              Live sample data
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Drug</th>
                  <th className="px-4 py-3 font-medium">Result</th>
                  <th className="px-4 py-3 font-medium">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {evaluations.map((row) => (
                  <tr key={`${row.patient}-${row.drug}`} className="bg-slate-950/50">
                    <td className="px-4 py-4 text-white">{row.patient}</td>
                    <td className="px-4 py-4 text-slate-300">{row.drug}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100">
                        {row.result}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-400">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 to-emerald-400/10 p-6 shadow-glow backdrop-blur">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-100">Clinical lens</p>
          <h3 className="mt-2 text-xl font-semibold text-white">What MediAI is optimized for</h3>
          <div className="mt-6 space-y-4">
            {[
              "Quick medication suitability checks with explainable output.",
              "Alternative drug recommendations when a conflict is detected.",
              "Patient-aware evaluation across allergy, renal, and diagnosis context.",
              "Reusable API contracts for the Java backend and Python AI layer."
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-200">
                <Activity className="mb-2 h-4 w-4 text-cyan-300" />
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

