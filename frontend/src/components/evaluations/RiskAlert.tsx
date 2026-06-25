import { AlertTriangle, Info, Target, BadgeAlert } from "lucide-react";

interface RiskAlertProps {
  type: 'danger' | 'warning';
  title: string;
  reason: string;
  recommendations: string[];
}

export const RiskAlert = ({ type, title, reason, recommendations }: RiskAlertProps) => {
  const isDanger = type === 'danger';
  
  return (
    <div className={`overflow-hidden rounded-2xl border ${isDanger ? 'border-red-200 bg-gradient-to-br from-red-50 to-white' : 'border-amber-200 bg-gradient-to-br from-amber-50 to-white'}`}>
      <div className={`flex items-center justify-between gap-3 border-b px-5 py-4 ${isDanger ? 'border-red-100' : 'border-amber-100'}`}>
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-2 ${isDanger ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
            {isDanger ? <AlertTriangle size={20} /> : <Info size={20} />}
          </div>
          <div>
            <h4 className={`font-bold ${isDanger ? 'text-red-900' : 'text-amber-900'}`}>{title}</h4>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Cảnh báo theo ngữ cảnh lâm sàng</p>
          </div>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs font-bold ${isDanger ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
          {isDanger ? 'Mức cao' : 'Mức trung bình'}
        </div>
      </div>

      <div className="p-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              <BadgeAlert className="h-4 w-4 text-slate-500" />
              Lý do chính
            </div>
            <p className="mt-2 text-sm leading-6 font-medium text-slate-700">{reason}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              <Target className="h-4 w-4 text-slate-500" />
              Hành động
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Ưu tiên rà soát thuốc đang dùng, chỉ số liên quan và theo dõi thay đổi sau can thiệp.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {recommendations.map((rec, idx) => (
            <span key={idx} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
              {rec}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
