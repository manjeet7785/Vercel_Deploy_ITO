import api from './api';

export const adminService = {
  async getDashboardSummary() {
    const response = await api.get('/admin/dashboard/summary');
    return response.data;
  },

  async getPipeline() {
    const response = await api.get('/admin/dashboard/pipeline');
    return response.data;
  },

  async getEmployeePerformance() {
    const response = await api.get('/admin/dashboard/employee-performance');
    return response.data;
  },

  async getSecurityAlerts() {
    const response = await api.get('/admin/dashboard/security-alerts');
    return response.data;
  },

  async getQuotationQueue() {
    const response = await api.get('/admin/dashboard/quotation-queue');
    return response.data;
  },

  async assignLead(leadId, assignData) {
    const response = await api.patch(`/admin/leads/${leadId}/assign`, assignData);
    return response.data;
  },

  async deactivateUser(userId) {
    const response = await api.patch(`/admin/users/${userId}/deactivate`);
    return response.data;
  },

  async updateExportPermission(userId, exportPermission) {
    const response = await api.patch(`/admin/export-permission/${userId}`, { exportPermission });
    return response.data;
  },

  async getUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  }
};