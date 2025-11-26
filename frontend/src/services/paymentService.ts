import api from '../utils/api';

export const paymentService = {
  createPayment: (data: any) => api.post('/payments', data),
  getPayments: () => api.get('/payments'),
  updatePaymentStatus: (id: string, status: string) =>
    api.put(`/payments/${id}/status`, { status }),
};







