import React from 'react';
import { useLocation } from 'react-router-dom';
import { routePaths } from '../../app/routes/route-paths';
import { Bell, UserCircle } from 'lucide-react';

export const Topbar = () => {
  const location = useLocation();

  // Hàm chuyển đổi URL sang tiêu đề Tiếng Việt hiển thị động
  const getPageTitle = (path: string): string => {
    switch (path) {
      case routePaths.dashboard:
        return 'Bảng điều khiển tổng quan';
      case routePaths.patients:
        return 'Quản lý hồ sơ bệnh nhân';
      case routePaths.drugs:
        return 'Kho danh mục dược phẩm';
      case routePaths.evaluations:
        return 'Hệ thống đánh giá lâm sàng AI';
      default:
        return 'Hệ thống MedEval';
    }
  };

  return (
    <header className="h-16 border-b border-slate-100 bg-white px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm/50 font-sans text-xs">
      {/* TIÊU ĐỀ TRANG ĐỘNG */}
      <h2 className="text-sm font-black text-slate-800 tracking-tight">
        {getPageTitle(location.pathname)}
      </h2>

      {/* THÔNG BÁO & USER PROFILE */}
      <div className="flex items-center gap-4">
        {/* Chuông thông báo hệ thống */}
        <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500"></span>
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* Thông tin cá nhân bác sĩ */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="font-bold text-slate-800">BS. Nguyễn Văn Thắng</p>
            <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-0.5 w-fit ml-auto">Khoa Nội tổng hợp</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center">
            <UserCircle className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
};