import api from './api';

export const quotationService = {
  async requestQuotation(data) {
    const response = await api.post('/quotations/request', data);
    return response.data;
  },

  async getPendingQuotations() {
    const response = await api.get('/quotations/pending');
    return response.data;
  },

  async approveQuotation(id, data) {
    const response = await api.patch(`/quotations/${id}/approve`, data);
    return response.data;
  },

  async rejectQuotation(id, data) {
    const response = await api.patch(`/quotations/${id}/reject`, data);
    return response.data;
  }
};