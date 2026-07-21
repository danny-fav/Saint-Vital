import api from './api';

export const productService = {
  list: (params) => api.get('/products/', { params }),
  detail: (slug) => api.get(`/products/${slug}/`),
  featured: () => api.get('/products/featured/'),
  newArrivals: () => api.get('/products/new-arrivals/'),
  bestSellers: () => api.get('/products/best-sellers/'),
  categories: () => api.get('/products/categories/'),
  colors: () => api.get('/products/colors/'),
  sizes: () => api.get('/products/sizes/'),
};
