import React, { useState } from "react";
import { useDrugs } from "@/hooks/useDrugs";
import { StatsSection } from "@/components/ui-drugs/StatsSection";
import { FilterBar } from "@/components/ui-drugs/FilterBar";
import { DrugsTable } from "@/components/ui-drugs/DrugsTable";
import { TrendChart } from "@/components/ui-drugs/TrendChart";
import { AddButton } from "@/components/ui/AddButton";
import { AddDrugModal } from "@/components/ui-drugs/AddDrugModal"; // Đảm bảo đường dẫn import đúng

export const DrugsPage = () => {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [isAddDrugOpen, setIsAddDrugOpen] = useState(false); // State quản lý Modal

  const { drugs, loading, totalPages } = useDrugs(page, searchQuery);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Quản Lý Danh Mục Thuốc</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <StatsSection />
          
          <AddButton 
            label="Thêm thuốc mới" 
            onClick={() => setIsAddDrugOpen(true)} // Mở modal khi nhấn nút
          />

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            {/* Header: Thanh tìm kiếm */}
            <div className="flex items-center gap-3 mb-4 w-full">
              <div className="flex-1">
                <FilterBar 
                  onSearch={(v) => {
                    setSearchQuery(v);
                    setPage(0); 
                  }} 
                />
              </div>
            </div>
            
            {loading ? (
              <div className="py-20 text-center text-slate-400">Đang tải dữ liệu...</div>
            ) : drugs.length === 0 ? (
               <div className="py-20 text-center text-slate-400">Không tìm thấy kết quả nào.</div>
            ) : (
              <DrugsTable 
                drugs={drugs} 
                page={page} 
                setPage={setPage} 
                totalPages={totalPages} 
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <TrendChart />
        </div>
      </div>

      {/* Modal Thêm thuốc mới */}
      <AddDrugModal 
        isOpen={isAddDrugOpen} 
        onClose={() => setIsAddDrugOpen(false)} 
      />
    </div>
  );
};