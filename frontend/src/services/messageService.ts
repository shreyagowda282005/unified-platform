import api from '../utils/api';

export const messageService = {
  sendMessage: (data: any) => api.post('/messages', data),
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId: string) => api.get(`/messages/${userId}`),
};







