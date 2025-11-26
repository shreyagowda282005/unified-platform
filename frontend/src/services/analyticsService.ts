import api from '../utils/api';

export const analyticsService = {
  getInfluencerAnalytics: () => api.get('/analytics/influencer'),
  getBrandAnalytics: () => api.get('/analytics/brand'),
};







