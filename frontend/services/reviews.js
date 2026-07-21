import api from './api';

export const reviewService = {
  list: (productId) => api.get(`/reviews/product/${productId}/`),
  create: (productId, data) => api.post(`/reviews/product/${productId}/create/`, data),
};
