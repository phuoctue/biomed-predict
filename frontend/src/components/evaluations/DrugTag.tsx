import { X } from "lucide-react";

interface DrugTagProps {
  name: string;
  onRemove: () => void;
}

export const DrugTag = ({ name, onRemove }: DrugTagProps) => (
  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100 transition-all hover:bg-blue-100">
    {name}
    <button onClick={onRemove} className="hover:text-blue-900">
      <X size={14} />
    </button>
  </span>
);