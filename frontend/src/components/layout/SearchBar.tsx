import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (val: string) => void;
  placeholder: string;
}

export const SearchBar = ({ onSearch, placeholder }: SearchBarProps) => {
  return (
    <div className="relative w-full md:w-72 group">
      {/* Icon màu đen, chuyển sang đậm hơn khi focus */}
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-black transition-colors" />
      
      <input
        type="text"
        placeholder={placeholder}
        className="
          w-full pl-10 pr-4 py-2 
          bg-white border-2 border-black 
          rounded-xl text-xs text-black
          placeholder:text-slate-400
          focus:ring-2 focus:ring-black/10 
          outline-none transition-all duration-200
        "
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};