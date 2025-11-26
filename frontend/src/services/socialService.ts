import api from '../utils/api';

export const socialService = {
  connectInstagram: () => api.get('/social/instagram/connect'),
  connectYouTube: () => api.get('/social/youtube/connect'),
  getStatus: () => api.get('/social/status'),
};

