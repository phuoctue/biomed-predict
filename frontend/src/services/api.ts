import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const patientAPI = {
  create: (data: any) => apiClient.post('/patients', data),
  getById: (id: number) => apiClient.get(`/patients/${id}`),
  update: (id: number, data: any) => apiClient.put(`/patients/${id}`, data),
  delete: (id: number) => apiClient.delete(`/patients/${id}`),
};

export const medicalRecordAPI = {
  create: (data: any) => apiClient.post('/medical-records', data),
  getById: (id: number) => apiClient.get(`/medical-records/${id}`),
  update: (id: number, data: any) => apiClient.put(`/medical-records/${id}`, data),
};

export const prescriptionAPI = {
  create: (data: any) => apiClient.post('/prescriptions', data),
  getById: (id: number) => apiClient.get(`/prescriptions/${id}`),
};

export const drugAPI = {
  create: (data: any) => apiClient.post('/drugs', data),
  getById: (id: number) => apiClient.get(`/drugs/${id}`),
};

export const aiEvaluationAPI = {
  create: (data: any) => apiClient.post('/ai/evaluations', data),
  getById: (id: number) => apiClient.get(`/ai/evaluations/${id}`),
};

export const vitalSignAPI = {
  create: (data: any) => apiClient.post('/vital-signs', data),
};

export const labResultAPI = {
  create: (data: any) => apiClient.post('/lab-results', data),
  getById: (id: number) => apiClient.get(`/lab-results/${id}`),
};

export default apiClient;
