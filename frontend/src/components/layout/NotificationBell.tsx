import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

export const NotificationBell = () => {
  const { notifications, unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false); // 1. State quản lý trạng thái mở/đóng

  return (
    <div className="relative"> {/* 2. Bao ngoài bằng div relative để menu nằm đúng vị trí */}
      <button 
        onClick={() => setIsOpen(!isOpen)} // 3. Bấm để đảo ngược trạng thái mở/đóng
        className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
        )}
      </button>

      {/* 4. Menu thông báo (Dropdown) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-100 z-50 p-4">
          <h3 className="font-bold text-slate-800 mb-2">Thông báo</h3>
          <div className="space-y-2">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div key={n.id} className="text-sm p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                  {n.message}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Không có thông báo mới.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};