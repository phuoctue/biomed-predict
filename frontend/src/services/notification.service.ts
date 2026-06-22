// src/services/notification.service.ts
export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const fetchNotifications = async () => {
  const response = await fetch("/api/notifications"); // Thay URL của bạn
  return response.json();
};