import api from './api';

export const analyticsService = {
  dashboard: () => api.get('/analytics/dashboard/'),
  revenue: (days = 30) => api.get(`/analytics/dashboard/revenue/?days=${days}`),
};
