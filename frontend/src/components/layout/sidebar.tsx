import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { routePaths } from '../../app/routes/route-paths';
import { 
  LayoutDashboard, 
  Users, 
  Pill, 
  ShieldAlert, 
  LogOut,
  Activity,
  History,       // Thêm icon Lịch sử
  Settings
} from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: routePaths.dashboard, label: 'Tổng quan', icon: <LayoutDashboard className="h-4 w-4" /> },
    { path: routePaths.patients, label: 'Hồ sơ bệnh nhân', icon: <Users className="h-4 w-4" /> },
    { path: routePaths.drugs, label: 'Danh mục thuốc', icon: <Pill className="h-4 w-4" /> },
    { path: routePaths.evaluations, label: 'Đánh giá AI (CDSS)', icon: <ShieldAlert className="h-4 w-4" /> },
    { path: routePaths.history, label: 'Lịch sử', icon: <History className="h-4 w-4" /> }, // Mới
    { path: routePaths.settings, label: 'Quản trị', icon: <Settings className="h-4 w-4" /> }, // Mới
  ];

  const handleLogout = () => {
    // Xử lý xóa Token khi đăng xuất theo thiết kế hệ thống
    localStorage.removeItem('token');
    window.location.href = routePaths.login;
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-400 border-r border-slate-800 flex flex-col h-screen sticky top-0 font-sans text-xs">
      {/* LOGO HỆ THỐNG */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-2.5 text-white">
        <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
          <Activity className="h-4 w-4 text-white animate-pulse" />
        </div>
        <span className="text-sm font-black tracking-wider uppercase">MedEval CDSS</span>
      </div>

      {/* DANH SÁCH MENU ĐIỀU HƯỚNG */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                  : 'hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* NÚT ĐĂNG XUẤT DƯỚI CHÂN MENU */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold hover:bg-rose-500/10 hover:text-rose-400 transition-all text-left"
        >
          <LogOut className="h-4 w-4" />
          <span>Đăng xuất tài khoản</span>
        </button>
      </div>
    </aside>
  );
};