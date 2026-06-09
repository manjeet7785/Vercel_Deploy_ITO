import api from './api';

export const leadService = {
  async createLead(leadData) {
    const response = await api.post('/leads/from-chat', leadData);
    return response.data;
  },

  async getLeads(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/leads${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  async getLeadById(id) {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  async addActivity(leadId, activityData) {
    const response = await api.post(`/leads/${leadId}/activity`, activityData);
    return response.data;
  },

  async updateStage(leadId, stageData) {
    const response = await api.patch(`/leads/${leadId}/stage`, stageData);
    return response.data;
  },

  async assignLead(leadId, assignData) {
    const response = await api.patch(`/leads/${leadId}/assign`, assignData);
    return response.data;
  }
};