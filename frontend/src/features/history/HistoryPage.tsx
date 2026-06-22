import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { HistoryStats } from '@/components/History/HistoryStats';
import { HistoryTable } from '@/components/History/HistoryTable';
import { WeeklyTrendChart } from '@/components/History/WeeklyTrendChart';
import { CompletionStatus } from '@/components/History/CompletionStatus';
import { Calendar, Download, Filter } from 'lucide-react';

export const HistoryPage = () => {
  // State quản lý khoảng thời gian chọn
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <div className="p-8 bg-slate-50 min-h-screen space-y-6">
      
      {/* 1. Tiêu đề và Bộ lọc */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Lịch sử Đánh Giá
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Xem lại và quản lý các đánh giá lâm sàng đã được thực hiện.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Component chọn ngày chuyên nghiệp */}
          <div className="relative group">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              placeholderText="mm/dd/yyyy - mm/dd/yyyy"
              className="pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm w-64 cursor-pointer font-bold text-slate-800"
              calendarClassName="shadow-xl border-none rounded-2xl p-2"
              dateFormat="MM/dd/yyyy"
            />
            <Calendar 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" 
              size={16} 
            />
            <Filter 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" 
              size={14} 
            />
          </div>

          {/* Nút Xuất báo cáo */}
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-sm shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
            <Download size={16} />
            Xuất Báo Cáo
          </button>
        </div>
      </div>

      {/* 2. Hàng chỉ số thống kê */}
      <HistoryStats />

      {/* 3. Bảng dữ liệu lịch sử */}
      <div className="mt-2">
        <HistoryTable />
      </div>

      {/* 4. Grid dưới cùng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyTrendChart />
        <CompletionStatus />
      </div>

    </div>
  );
};