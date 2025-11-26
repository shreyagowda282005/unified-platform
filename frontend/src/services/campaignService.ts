import api from '../utils/api';

export const campaignService = {
  createCampaign: (data: any) => api.post('/campaigns', data),
  getCampaigns: (filters?: any) => api.get('/campaigns', { params: filters }),
  getCampaign: (id: string) => api.get(`/campaigns/${id}`),
  updateCampaign: (id: string, data: any) => api.put(`/campaigns/${id}`, data),
  deleteCampaign: (id: string) => api.delete(`/campaigns/${id}`),
  browseCampaigns: (filters?: any) => 
    api.get('/campaigns/browse', { params: filters }),
};







