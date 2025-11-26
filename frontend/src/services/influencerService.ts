import api from '../utils/api';

export const influencerService = {
  getProfile: () => api.get('/influencers/profile'),
  updateProfile: (data: any) => api.put('/influencers/profile', data),
  getDashboard: () => api.get('/influencers/dashboard'),
  uploadPortfolio: (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    return api.post('/influencers/portfolio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getApplications: () => api.get('/influencers/applications'),
  getEarnings: () => api.get('/influencers/earnings'),
};







