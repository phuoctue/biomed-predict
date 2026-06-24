import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-5 py-4 bg-white border-t border-slate-100">
      {/* Hiển thị thông tin trang */}
      <div className="text-sm text-slate-700 font-medium">
        Hiển thị <span className="font-bold">{startItem}</span> - <span className="font-bold">{endItem}</span> trong số <span className="font-bold">{totalItems}</span> đánh giá
      </div>
      
      {/* Các nút điều hướng */}
      <div className="flex items-center gap-1">
        <button 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          &lt;
        </button>
        
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`px-3 py-1 text-sm font-semibold rounded border transition-all ${
              currentPage === i + 1 
                ? 'bg-blue-700 text-white border-blue-700 shadow-sm' 
                : 'text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;