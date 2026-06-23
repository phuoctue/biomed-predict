import axios from 'axios';
import { useAuthStore } from '../features/auth/store/auth.store';

// Vite exposes env vars via import.meta.env (not process.env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token from Zustand store to every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Clear auth state on 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);

export const patientAPI = {
  create: (data: unknown) => apiClient.post('/patients', data),
  getById: (id: number) => apiClient.get(`/patients/${id}`),
  update: (id: number, data: unknown) => apiClient.put(`/patients/${id}`, data),
  delete: (id: number) => apiClient.delete(`/patients/${id}`),
};

export const medicalRecordAPI = {
  create: (data: unknown) => apiClient.post('/medical-records', data),
  getById: (id: number) => apiClient.get(`/medical-records/${id}`),
  update: (id: number, data: unknown) => apiClient.put(`/medical-records/${id}`, data),
};

export const prescriptionAPI = {
  create: (data: unknown) => apiClient.post('/prescriptions', data),
  getById: (id: number) => apiClient.get(`/prescriptions/${id}`),
};

export const drugAPI = {
  create: (data: unknown) => apiClient.post('/drugs', data),
  getById: (id: number) => apiClient.get(`/drugs/${id}`),
};

export const aiEvaluationAPI = {
  evaluate: (data: unknown) => apiClient.post('/ai/evaluate', data),
  getById: (id: number) => apiClient.get(`/ai/evaluations/${id}`),
  list: (params?: { patientId?: number; drugId?: number; page?: number; size?: number }) =>
    apiClient.get('/ai/evaluations', { params }),
  getWarnings: (id: number) => apiClient.get(`/ai/evaluations/${id}/warnings`),
  getRecommendations: (id: number) => apiClient.get(`/ai/evaluations/${id}/recommendations`),
  reanalyze: (id: number) => apiClient.post(`/ai/evaluations/${id}/reanalyze`),
};

export const vitalSignAPI = {
  create: (data: unknown) => apiClient.post('/vital-signs', data),
};

export const labResultAPI = {
  create: (data: unknown) => apiClient.post('/lab-results', data),
  getById: (id: number) => apiClient.get(`/lab-results/${id}`),
};

export default apiClient;
