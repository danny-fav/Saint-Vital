import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: (refreshToken) => api.post('/auth/logout/', { refresh: refreshToken }),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
  deleteAccount: () => api.delete('/auth/profile/delete/'),
  changePassword: (data) => api.post('/auth/profile/change-password/', data),
  getAddresses: () => api.get('/auth/addresses/'),
  createAddress: (data) => api.post('/auth/addresses/', data),
  updateAddress: (id, data) => api.patch(`/auth/addresses/${id}/`, data),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}/`),
  getPreferences: () => api.get('/auth/preferences/'),
  updatePreferences: (data) => api.patch('/auth/preferences/', data),
};
