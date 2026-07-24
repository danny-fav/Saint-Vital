import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('sv_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('sv_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken });
          const { access, refresh } = res.data;
          localStorage.setItem('sv_access_token', access);
          if (refresh) localStorage.setItem('sv_refresh_token', refresh);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('sv_access_token');
          localStorage.removeItem('sv_refresh_token');
          localStorage.removeItem('sv_user');
          if (typeof window !== 'undefined') {
            window.location.href = '/auth';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
