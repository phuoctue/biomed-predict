import { ShieldAlert } from "lucide-react";

// 1. Định nghĩa Interface
interface Interaction {
  id: number;
  drugPair: string;
  description: string;
  recommendation: string;
}

interface InteractionListProps {
  interactions: Interaction[]; // Thay 'any[]' bằng mảng các object Interaction
}

export const InteractionList = ({ interactions }: InteractionListProps) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
      <ShieldAlert className="h-4 w-4 text-rose-500" /> Tương tác thuốc nghiêm trọng
    </h3>
    {interactions.map(item => (
      <div key={item.id} className="border rounded-xl p-4 mb-4 bg-rose-50/20">
        <p className="text-sm font-bold">{item.drugPair}</p>
        <p className="text-xs text-slate-500 mt-1">{item.description}</p>
        <button className="mt-3 text-xs bg-rose-600 text-white px-3 py-1 rounded-lg">{item.recommendation}</button>
      </div>
    ))}
  </div>
);