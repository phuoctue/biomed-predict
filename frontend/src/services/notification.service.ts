import { apiClient } from '../lib/api-client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  status: string;
  createdAt: string;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await apiClient.get('/notifications');
  if (response.data?.success) return response.data.data || [];
  return [];
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await apiClient.put(`/notifications/${id}/read`);
};
