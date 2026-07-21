import api from './api';

export const wishlistService = {
  get: () => api.get('/wishlist/'),
  add: (productId) => api.post('/wishlist/add/', { product_id: productId }),
  remove: (itemId) => api.delete(`/wishlist/items/${itemId}/remove/`),
  count: () => api.get('/wishlist/count/'),
};
