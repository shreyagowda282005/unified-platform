import api from '../utils/api';

export const aiService = {
  chat: (message: string, context?: any) =>
    api.post('/ai/chat', { message, context }),
};







