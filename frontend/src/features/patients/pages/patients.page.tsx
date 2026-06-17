import { Plus, Search, Syringe } from "lucide-react";

const patients = [
  { name: "Nguyen Van A", age: 56, diagnosis: "Type 2 diabetes", status: "Monitoring" },
  { name: "Tran Thi B", age: 64, diagnosis: "Hypertension", status: "Review" },
  { name: "Le Minh C", age: 39, diagnosis: "Post-op infection", status: "Stable" }
];

export const PatientsPage = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Patients</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Clinical context and medication history</h2>
            <p className="mt-2 text-sm text-slate-400">
              Keep patient context ready for AI evaluation and safer medication decisions.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950">
            <Plus className="h-4 w-4" />
            New patient
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
          <Search className="h-4 w-4 text-cyan-300" />
          <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder="Search patients, MRN, diagnosis..." />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {patients.map((patient) => (
          <article key={patient.name} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-white">{patient.name}</p>
                <p className="text-sm text-slate-400">
                  {patient.age} years old · {patient.diagnosis}
                </p>
              </div>
              <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
                <Syringe className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
              {patient.status}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

