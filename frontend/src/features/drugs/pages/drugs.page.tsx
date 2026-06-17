import { Pill, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const drugSearchSchema = z.object({
  keyword: z.string().min(2, "Type at least 2 characters")
});

type DrugSearchForm = z.infer<typeof drugSearchSchema>;

const drugs = [
  { name: "Metformin", className: "Antidiabetic", status: "Stable profile" },
  { name: "Warfarin", className: "Anticoagulant", status: "Interaction-sensitive" },
  { name: "Amoxicillin", className: "Antibiotic", status: "Commonly used" }
];

export const DrugsPage = () => {
  const { register, handleSubmit, formState } = useForm<DrugSearchForm>({
    resolver: zodResolver(drugSearchSchema),
    defaultValues: { keyword: "" }
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Drugs</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Drug reference and AI suitability checks</h2>
            <p className="mt-2 text-sm text-slate-400">
              Search medications, inspect classes, and link to evaluation workflows.
            </p>
          </div>

          <form
            className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3"
            onSubmit={handleSubmit(() => undefined)}
          >
            <Search className="h-4 w-4 text-cyan-300" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              placeholder="Search a drug name..."
              {...register("keyword")}
            />
            {formState.errors.keyword ? <span className="text-xs text-rose-300">{formState.errors.keyword.message}</span> : null}
          </form>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {drugs.map((drug) => (
          <article key={drug.name} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-white">{drug.name}</p>
                <p className="text-sm text-slate-400">{drug.className}</p>
              </div>
              <Pill className="h-5 w-5 text-cyan-300" />
            </div>
            <p className="mt-5 text-sm text-slate-300">{drug.status}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

