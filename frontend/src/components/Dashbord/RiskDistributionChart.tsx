interface RiskCategory {
  label: string;
  count: number;
  color: string;
}

interface RiskDistributionChartProps {
  categories?: RiskCategory[];
}

const DEFAULT_CATEGORIES: RiskCategory[] = [
  { label: "Tim mạch", count: 0, color: "bg-blue-600" },
  { label: "Nội tiết", count: 0, color: "bg-emerald-600" },
  { label: "Thần kinh", count: 0, color: "bg-amber-500" },
  { label: "Nhi khoa", count: 0, color: "bg-rose-500" },
];

export const RiskDistributionChart = ({ categories }: RiskDistributionChartProps) => {
  const data = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800">Phân bổ rủi ro lâm sàng</h3>
        <select className="text-xs border rounded-lg p-1 text-slate-500">
          <option>Tháng này</option>
        </select>
      </div>

      <div className="h-64 flex items-end gap-4">
        {data.map((cat) => (
          <div key={cat.label} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-slate-600">{cat.count}</span>
            <div
              className={`w-full ${cat.color} rounded-t-lg transition-all duration-500`}
              style={{
                height: `${Math.max((cat.count / maxCount) * 200, cat.count > 0 ? 16 : 4)}px`,
              }}
            />
            <span className="text-[10px] font-bold text-slate-400">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
