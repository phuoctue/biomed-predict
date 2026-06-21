import { Users, ClipboardCheck, AlertTriangle } from "lucide-react";

export const StatsOverview = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={24} /></div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase">Tổng số bệnh nhân</p>
        <h3 className="text-2xl font-black text-slate-800">1,284</h3>
      </div>
    </div>
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><ClipboardCheck size={24} /></div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase">Đánh giá hôm nay</p>
        <h3 className="text-2xl font-black text-slate-800">42</h3>
      </div>
    </div>
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle size={24} /></div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase">Cảnh báo nghiêm trọng</p>
        <h3 className="text-2xl font-black text-slate-800">07</h3>
      </div>
    </div>
  </div>
);