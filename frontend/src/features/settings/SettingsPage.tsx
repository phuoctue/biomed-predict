import React from 'react';
import { UserTable } from '@/components/SystemAdministration/UserTable';
import { RuleCard } from '@/components/SystemAdministration/RuleCard';
import { RoleDistributionChart } from '@/components/SystemAdministration/StatsCard';
import { SystemLogs } from '@/components/SystemAdministration/SystemLogs'; // Đảm bảo bạn đã import component này

export const SettingsPage = () => {
  return (
    <div className="p-8 bg-slate-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Quản trị Hệ thống</h1>
          <p className="text-sm text-slate-500">Quản lý người dùng, phân quyền vai trò và giám sát hoạt động hệ thống.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 shadow-sm hover:bg-slate-50">
            Xuất báo cáo
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-sm shadow-blue-200 hover:bg-blue-700">
            + Thêm người dùng
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CỘT TRÁI (2/3): Dữ liệu trọng tâm (Người dùng & Cấu hình) */}
        <div className="lg:col-span-2 space-y-6">
          <UserTable />
          
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Cấu hình Quy tắc Đánh giá</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RuleCard title="Tương tác Thuốc" desc="Tự động chặn đơn thuốc nếu phát hiện tương tác..." />
              <RuleCard title="Cảnh báo Suy thận" desc="Yêu cầu điều chỉnh liều nếu độ thanh thải..." />
              <RuleCard title="Phân tầng Phê duyệt" desc="Đơn thuốc có giá trị trên 50 triệu cần phê duyệt..." />
            </div>
          </div>
        </div>
        
        {/* CỘT PHẢI (1/3): Chỉ số & Hoạt động thời gian thực */}
        <div className="space-y-6">
          <RoleDistributionChart />
          <SystemLogs /> 
        </div>

      </div>
    </div>
  );
};