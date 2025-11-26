import api from '../utils/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password?: string;
  userType: 'influencer' | 'brand';
  name?: string; // ✅ Added this line
}

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};