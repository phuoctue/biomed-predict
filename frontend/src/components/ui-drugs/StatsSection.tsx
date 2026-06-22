export const StatsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    {[
      { title: "Tổng mặt hàng", value: "1,284", color: "text-slate-900" },
      { title: "Sắp hết hàng", value: "24", color: "text-red-600" },
      { title: "Sắp hết hạn", value: "08", color: "text-amber-600" },
    ].map((item, idx) => (
      <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{item.title}</p>
        <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
      </div>
    ))}
  </div>
);