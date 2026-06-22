import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { routePaths } from '../../app/routes/route-paths';
import { 
  BarChart3, LayoutDashboard, Users, Pill, ShieldAlert, LogOut, Activity, History, Settings 
} from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: routePaths.dashboard, label: 'Tổng quan', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: routePaths.patients, label: 'Hồ sơ bệnh nhân', icon: <Users className="h-5 w-5" /> },
    { path: routePaths.drugs, label: 'Danh mục thuốc', icon: <Pill className="h-5 w-5" /> },
    { path: routePaths.usageStatistics, label: 'Thống kê sử dụng', icon: <BarChart3 className="h-5 w-5" /> },
    { path: routePaths.evaluations, label: 'Đánh giá AI (CDSS)', icon: <ShieldAlert className="h-5 w-5" /> },
    { path: routePaths.history, label: 'Lịch sử', icon: <History className="h-5 w-5" /> },
    { path: routePaths.settings, label: 'Quản trị', icon: <Settings className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.replace(routePaths.login);
  };

  return (
    // 'group' giúp kích hoạt hover cho toàn bộ sidebar
    <aside className="group w-20 hover:w-64 bg-slate-900 text-slate-400 border-r border-slate-800 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out overflow-hidden z-50">
      
      {/* LOGO */}
      <div className="p-6 flex items-center gap-4 text-white shrink-0">
        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <span className="text-sm font-black tracking-wider uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          MedEval CDSS
        </span>
      </div>

      {/* DANH SÁCH MENU */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                  : 'hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="shrink-0">{item.icon}</div>
              <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* NÚT ĐĂNG XUẤT */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold hover:bg-rose-500/10 hover:text-rose-400 transition-all text-left relative z-50"
        >
          <div className="shrink-0"><LogOut className="h-5 w-5" /></div>
          <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Đăng xuất
          </span>
        </button>
      </div>
    </aside>
  );
};
