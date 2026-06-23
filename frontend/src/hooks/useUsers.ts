import { useState } from 'react';
import { apiClient } from '../lib/api-client';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  department?: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (params?: { keyword?: string; page?: number; size?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/users', {
        params: {
          keyword: params?.keyword || undefined,
          page: params?.page ?? 0,
          size: params?.size ?? 20,
        },
      });
      if (response.data?.success) {
        setUsers(response.data.data || []);
      }
    } catch (err) {
      console.error('Lỗi tải người dùng:', err);
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    await apiClient.delete(`/users/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return { users, loading, error, fetchUsers, deleteUser };
};
