import { Plus } from "lucide-react";

interface AddButtonProps {
  onClick?: () => void;
  label?: string; // Thêm prop label để tùy biến nội dung
}

export const AddButton = ({ onClick, label = "Thêm mới" }: AddButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-xl transition-all font-medium text-sm shadow-sm hover:shadow-md whitespace-nowrap"
    >
      <Plus size={18} />
      {label}
    </button>
  );
};