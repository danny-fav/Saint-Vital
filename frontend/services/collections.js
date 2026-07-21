import api from './api';

export const collectionService = {
  list: () => api.get('/collections/'),
  detail: (slug) => api.get(`/collections/${slug}/`),
  featured: () => api.get('/collections/featured/'),
};
