import api from './api';

export const cartService = {
  get: () => api.get('/cart/'),
  add: (data) => api.post('/cart/add/', data),
  updateItem: (itemId, data) => api.patch(`/cart/items/${itemId}/`, data),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}/remove/`),
  toggleSave: (itemId) => api.post(`/cart/items/${itemId}/save/`),
  applyCoupon: (code) => api.post('/cart/coupon/', { code }),
  clear: () => api.delete('/cart/clear/'),
};
