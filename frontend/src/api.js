import axios from 'axios';

const API_BASE = import.meta.env.DEV ? 'http://localhost:8080/api/v1' : '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
};

export const sessionAPI = {
  book: (data) => api.post('/bookSession', data),
  view: () => api.get('/view'),
  edit: (data) => api.put('/edit', data),
  delete: (data) => api.delete('/delete', data),
  available: (data) => api.post('/available', data),
};

export const workoutAPI = {
  create: (data) => api.post('/workout', data),
};

export const adminAPI = {
  report: (data) => api.get('/report', { data }),
  generateQR: () => api.get('/generate-qr'),
};

export default api;
