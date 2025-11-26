import api from '../utils/api';

export const applicationService = {
  applyToCampaign: (campaignId: string, message?: string) =>
    api.post('/applications', { campaignId, message }),
  getApplications: (campaignId?: string) =>
    api.get('/applications', { params: { campaignId } }),
  updateApplicationStatus: (id: string, status: string) =>
    api.put(`/applications/${id}/status`, { status }),
};







