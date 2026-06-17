import { BrainCircuit, ClipboardList, Sparkles } from "lucide-react";

const evaluationCards = [
  {
    title: "Suitability score",
    value: "82/100",
    description: "Balanced risk profile with no known allergy conflict."
  },
  {
    title: "Suggested alternative",
    value: "Atorvastatin",
    description: "Alternative selected based on interaction and tolerance profile."
  },
  {
    title: "Explainability",
    value: "Ready",
    description: "Natural language summary available for the chart note."
  }
];

export const EvaluationsPage = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Evaluations</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">AI review results and clinical explanation</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          This page is wired for the /evaluate and /explain flows from the FastAPI service, while your Spring
          Boot API can orchestrate authorization and persistence.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {evaluationCards.map((card) => (
          <article key={card.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
                {card.title === "Suitability score" ? <ClipboardList className="h-5 w-5" /> : card.title === "Suggested alternative" ? <Sparkles className="h-5 w-5" /> : <BrainCircuit className="h-5 w-5" />}
              </div>
            </div>
            <p className="mt-5 text-sm uppercase tracking-[0.22em] text-slate-400">{card.title}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{card.value}</p>
            <p className="mt-2 text-sm text-slate-300">{card.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

