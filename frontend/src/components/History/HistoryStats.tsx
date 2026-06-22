export const HistoryStats = () => (
  <div className="grid grid-cols-4 gap-6">
    {[
      { label: "TỔNG SỐ ĐÁNH GIÁ", value: "1,248", trend: "+12%" },
      { label: "RỦI RO CAO", value: "42", desc: "tháng này" },
      { label: "TRUNG BÌNH", value: "156" },
      { label: "ỔN ĐỊNH", value: "1,050" },
    ].map((item, i) => (
      <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-[10px] font-bold text-slate-600">{item.label}</p>
        <h3 className="text-3xl font-black text-slate-800 mt-2">{item.value}</h3>
        {item.trend && <span className="text-emerald-600 text-xs font-bold">{item.trend}</span>}
      </div>
    ))}
  </div>
);