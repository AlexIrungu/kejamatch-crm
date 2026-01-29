import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create axios instance with auth token
const createAuthApi = () => {
  const token = localStorage.getItem('authToken');
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

const adminService = {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/admin/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get dashboard stats' };
    }
  },

  // Get all leads with optional filters
  async getAllLeads(filters = {}) {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/admin/leads', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get leads' };
    }
  },

  // Get single lead
  async getLead(id) {
    try {
      const api = createAuthApi();
      const response = await api.get(`/api/admin/leads/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get lead' };
    }
  },

  // Update lead status
  async updateLeadStatus(id, status, notes = '') {
    try {
      const api = createAuthApi();
      const response = await api.put(`/api/admin/leads/${id}/status`, { status, notes });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update lead status' };
    }
  },

  // Assign lead to agent
  async assignLead(leadId, agentId) {
    try {
      const api = createAuthApi();
      const response = await api.put(`/api/admin/leads/${leadId}/assign`, { agentId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to assign lead' };
    }
  },

  // Delete lead
  async deleteLead(id) {
    try {
      const api = createAuthApi();
      const response = await api.delete(`/api/admin/leads/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to delete lead' };
    }
  },

  // Export leads to CSV
  async exportLeads() {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/admin/leads/export/csv', {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `kejamatch-leads-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true, message: 'Leads exported successfully' };
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to export leads' };
    }
  },

  // Sync leads to Odoo
  async syncToOdoo(leadId = null) {
    try {
      const api = createAuthApi();
      const response = await api.post('/api/admin/sync/odoo', { leadId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to sync to Odoo' };
    }
  },

  // User management
  async getAllUsers() {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/admin/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get users' };
    }
  },

  async updateUser(id, userData) {
    try {
      const api = createAuthApi();
      const response = await api.put(`/api/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update user' };
    }
  },

  async deleteUser(id) {
    try {
      const api = createAuthApi();
      const response = await api.delete(`/api/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to delete user' };
    }
  },
};

export default adminService;