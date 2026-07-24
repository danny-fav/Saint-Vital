import api from './api';

export const paymentService = {
  history: () => api.get('/payments/'),
  initiate: (orderId, data) => api.post(`/payments/${orderId}/initiate/`, data),
  verify: (data) => api.post('/payments/verify/', data),
};
