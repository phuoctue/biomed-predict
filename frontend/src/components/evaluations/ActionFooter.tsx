interface ActionFooterProps {
  onPrintReport?: () => void;
  onSaveProfile?: () => void;
  onSaveHistory?: () => void;
  isSaving?: boolean;
}

export const ActionFooter = ({ onPrintReport, onSaveProfile, onSaveHistory, isSaving }: ActionFooterProps) => (
  <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-6">
    <button
      type="button"
      onClick={onPrintReport}
      className="rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-300"
    >
      In báo cáo đánh giá
    </button>
    <button
      type="button"
      onClick={onSaveProfile}
      className="rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
    >
      Lưu vào hồ sơ
    </button>
    <button
      type="button"
      onClick={onSaveHistory}
      disabled={isSaving}
      className="rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {isSaving ? "Đang lưu..." : "Lưu lịch sử chi tiết"}
    </button>
  </div>
);
