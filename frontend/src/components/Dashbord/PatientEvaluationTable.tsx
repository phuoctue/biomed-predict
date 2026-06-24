export interface EvaluationRow {
  id: string;
  patientName: string;
  date: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
}

interface PatientEvaluationTableProps {
  rows: EvaluationRow[];
}

const riskStyles: Record<EvaluationRow["riskLevel"], string> = {
  HIGH: "text-rose-700 bg-rose-50 border-rose-100",
  MEDIUM: "text-amber-700 bg-amber-50 border-amber-100",
  LOW: "text-emerald-700 bg-emerald-50 border-emerald-100",
};

export const PatientEvaluationTable = ({ rows }: PatientEvaluationTableProps) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-6">
    <table className="w-full text-sm">
      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
        <tr>
          <th className="p-4 text-left">Bệnh nhân</th>
          <th className="p-4 text-left">Ngày đánh giá</th>
          <th className="p-4 text-left">Rủi ro</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.length === 0 ? (
          <tr>
            <td colSpan={3} className="p-8 text-center text-slate-400 text-sm italic">
              Chưa có dữ liệu đánh giá nào
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-bold text-slate-900">{row.patientName}</td>
              <td className="p-4 text-slate-700 font-medium">{row.date}</td>
              <td className="p-4">
                <span
                  className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${riskStyles[row.riskLevel]}`}
                >
                  {row.riskLevel === "HIGH"
                    ? "CAO"
                    : row.riskLevel === "MEDIUM"
                    ? "TRUNG BÌNH"
                    : "THẤP"}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
