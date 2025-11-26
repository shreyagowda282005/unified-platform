import api from '../utils/api';

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (filters?: any) => api.get('/admin/users', { params: filters }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getCampaigns: () => api.get('/admin/campaigns'),
  deleteCampaign: (id: string) => api.delete(`/admin/campaigns/${id}`),
  getPayments: () => api.get('/admin/payments'),
};







