import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export const AppShell = () => {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* 1. THANH MENU SIDEBAR CỐ ĐỊNH BÊN TRÁI */}
      <Sidebar />

      {/* 2. KHU VỰC CHỨA NỘI DUNG CHÍNH BÊN PHẢI */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* THANH TOPBAR PHÍA TRÊN */}
        <Topbar />

        {/* RUỘT THAY ĐỔI ĐỘNG CỦA CÁC TRANG (DASHBOARD, PATIENTS, DRUGS...) */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};