import api from './api';

export const integrationService = {
  status: () => api.get('/integrations/status/'),
  config: (provider) => api.get(`/integrations/${provider}/config/`),
  updateConfig: (provider, data) => api.patch(`/integrations/${provider}/config/`, data),
  triggerSync: (provider, syncType) => api.post(`/integrations/${provider}/sync/${syncType}/`),
};
