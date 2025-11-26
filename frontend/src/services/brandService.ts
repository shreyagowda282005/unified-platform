import api from '../utils/api';

export const brandService = {
  getProfile: () => api.get('/brands/profile'),
  updateProfile: (data: any) => api.put('/brands/profile', data),
  getDashboard: () => api.get('/brands/dashboard'),
  browseInfluencers: (filters?: any) => 
    api.get('/brands/browse-influencers', { params: filters }),
};







