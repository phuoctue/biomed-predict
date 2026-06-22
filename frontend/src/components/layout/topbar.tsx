import React from 'react';
import { useLocation } from 'react-router-dom';
import { routePaths } from '../../app/routes/route-paths';
import { UserCircle } from 'lucide-react';
import { SearchBar } from '@/components/layout/SearchBar';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/layout/NotificationBell';

export const Topbar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const getPageTitle = (path: string): string => {
    switch (path) {
      case routePaths.dashboard: return 'Bảng điều khiển tổng quan';
      case routePaths.patients: return 'Quản lý hồ sơ bệnh nhân';
      case routePaths.drugs: return 'Kho danh mục dược phẩm';
      case routePaths.evaluations: return 'Hệ thống đánh giá lâm sàng AI';
      default: return 'Hệ thống MedEval';
    }
  };

  const renderSearchBar = () => {
    if (location.pathname === routePaths.patients) {
      return <SearchBar placeholder="Tìm bệnh nhân..." onSearch={(val) => console.log('Search Patients:', val)} />;
    }
    if (location.pathname === routePaths.drugs) {
      return <SearchBar placeholder="Tìm dược phẩm..." onSearch={(val) => console.log('Search Drugs:', val)} />;
    }
    if (location.pathname === routePaths.dashboard) {
    return <SearchBar placeholder="Tìm kiếm nhanh thông tin..." onSearch={(val) => console.log('Search Dashboard:', val)} />;
    }
    if (location.pathname === routePaths.evaluations) {
    return <SearchBar placeholder="Tìm kiếm nhanh thông tin..." onSearch={(val) => console.log('Search Evaluations:', val)} />;
    }
    if (location.pathname === routePaths.history) {
    return <SearchBar placeholder="Tìm kiếm nhanh thông tin..." onSearch={(val) => console.log('Search History:', val)} />;
    }
     if (location.pathname === routePaths.settings) {
    return <SearchBar placeholder="Tìm kiếm nhanh thông tin..." onSearch={(val) => console.log('Search Settings:', val)} />;
    }
    return null;
  };

  return (
    <header className="h-16 border-b border-slate-100 bg-white px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm/50 font-sans text-xs">
      <div className="flex items-center gap-8">
        <h2 className="text-sm font-black text-slate-800 tracking-tight whitespace-nowrap">
          {getPageTitle(location.pathname)}
        </h2>
        {renderSearchBar()}
      </div>

      <div className="flex items-center gap-4">
        {/* Component chuông đã nối */}
        <NotificationBell />

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="font-bold text-slate-800">{user?.fullName || 'Người dùng'}</p>
            <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-0.5 w-fit ml-auto">
              {user?.department || 'Chưa cập nhật'}
            </p>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center">
            <UserCircle className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
};