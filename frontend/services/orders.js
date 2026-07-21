import api from './api';

export const orderService = {
  list: () => api.get('/orders/'),
  create: (data) => api.post('/orders/', data),
  detail: (id) => api.get(`/orders/${id}/`),
  history: () => api.get('/orders/history/'),
};
