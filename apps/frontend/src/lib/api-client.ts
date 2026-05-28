import { useAuthStore } from "../features/auth/store/auth.store";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      try {
        const refresh = await apiClient.post("/auth/refresh");
        useAuthStore.getState().setAccessToken(refresh.data.accessToken);
        original.headers.Authorization = `Bearer ${refresh.data.accessToken}`;
        return apiClient(original);
      } catch {
        useAuthStore.getState().clearAuth();
      }
    }

    return Promise.reject(error);
  }
);

