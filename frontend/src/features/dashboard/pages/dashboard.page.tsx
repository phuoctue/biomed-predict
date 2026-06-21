import React from 'react';
import { StatsOverview } from '@/components/Dashbord/StatsOverview';
import { RiskDistributionChart } from '@/components/Dashbord/RiskDistributionChart';
import { RecentActivity } from '@/components/Dashbord/RecentActivity';
import { PatientEvaluationTable } from '@/components/Dashbord/PatientEvaluationTable';

export const DashboardPage = () => {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Bảng điều khiển tổng quan</h1>

      {/* 1. Hàng thống kê */}
      <StatsOverview />

      {/* 2. Grid Biểu đồ & Hoạt động */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Biểu đồ chiếm 2 phần */}
        <div className="lg:col-span-2">
          <RiskDistributionChart />
        </div>
        
        {/* Hoạt động gần đây chiếm 1 phần */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      {/* 3. Bảng dữ liệu chi tiết */}
      <div className="mt-6">
        <PatientEvaluationTable />
      </div>
    </div>
  );
};