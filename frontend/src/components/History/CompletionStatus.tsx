// CompletionStatus.tsx (Trạng thái hoàn thành)
export const CompletionStatus = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <h3 className="font-bold text-slate-800 mb-4">Trạng thái hoàn thành hồ sơ</h3>
    <div className="flex items-center gap-6">
      <div className="w-24 text-slate-400 h-24 rounded-full border-8 border-emerald-500 flex items-center justify-center font-black text-xl">90%</div>
      <p className="text-xs text-slate-500">Tất cả các đánh giá trong 24h qua đã được phê duyệt.</p>
    </div>
  </div>
);