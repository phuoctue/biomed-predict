// src/hooks/useNotifications.ts
import { useState, useEffect } from "react";
import { fetchNotifications, Notification } from "@/services/notification.service";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    fetchNotifications().then(setNotifications).catch(console.error);
  }, []);

  // Tính số lượng chưa đọc
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return { notifications, unreadCount };
};