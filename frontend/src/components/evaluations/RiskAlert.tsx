import { AlertTriangle, Info } from "lucide-react";

interface RiskAlertProps {
  type: 'danger' | 'warning';
  title: string;
  reason: string;
  recommendations: string[];
}

export const RiskAlert = ({ type, title, reason, recommendations }: RiskAlertProps) => {
  const isDanger = type === 'danger';
  
  return (
    <div className={`p-5 rounded-2xl border ${isDanger ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${isDanger ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
          {isDanger ? <AlertTriangle size={20} /> : <Info size={20} />}
        </div>
        <div className="flex-1">
          <h4 className={`font-bold ${isDanger ? 'text-red-900' : 'text-amber-900'}`}>{title}</h4>
          <p className="text-sm mt-1 text-slate-700 font-medium">{reason}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {recommendations.map((rec, idx) => (
              <span key={idx} className="text-xs font-bold px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-slate-700 shadow-sm">
                {rec}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};