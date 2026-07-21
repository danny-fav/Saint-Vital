import api from './api';

export const notificationService = {
  list: () => api.get('/notifications/'),
  unreadCount: () => api.get('/notifications/unread-count/'),
  markRead: (id) => api.patch(`/notifications/${id}/read/`),
  markAllRead: () => api.post('/notifications/mark-all-read/'),
  getPreferences: () => api.get('/notifications/preferences/'),
  updatePreferences: (data) => api.patch('/notifications/preferences/', data),
};
