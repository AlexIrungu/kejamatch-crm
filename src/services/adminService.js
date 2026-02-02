import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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
  // Dashboard
  async getDashboardStats() {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/admin/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get dashboard stats' };
    }
  },

  // Leads CRUD
  async getAllLeads(filters = {}) {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/admin/leads', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get leads' };
    }
  },

  async getLead(id) {
    try {
      const api = createAuthApi();
      const response = await api.get(`/api/admin/leads/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get lead' };
    }
  },

  async updateLeadStatus(id, status) {
    try {
      const api = createAuthApi();
      const response = await api.put(`/api/admin/leads/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update lead status' };
    }
  },

  async assignLead(leadId, agentId) {
    try {
      const api = createAuthApi();
      const response = await api.put(`/api/admin/leads/${leadId}/assign`, { agentId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to assign lead' };
    }
  },

  async deleteLead(id) {
    try {
      const api = createAuthApi();
      const response = await api.delete(`/api/admin/leads/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to delete lead' };
    }
  },

  // Lead Activities
  async getLeadActivities(leadId) {
    try {
      const api = createAuthApi();
      const response = await api.get(`/api/admin/leads/${leadId}/activities`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get activities' };
    }
  },

  async addNote(leadId, note) {
    try {
      const api = createAuthApi();
      const response = await api.post(`/api/admin/leads/${leadId}/notes`, { note });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to add note' };
    }
  },

  async logCall(leadId, callData) {
    try {
      const api = createAuthApi();
      const response = await api.post(`/api/admin/leads/${leadId}/calls`, callData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to log call' };
    }
  },

  async logEmail(leadId, emailData) {
    try {
      const api = createAuthApi();
      const response = await api.post(`/api/admin/leads/${leadId}/emails`, emailData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to log email' };
    }
  },

  // Viewings
  async scheduleViewing(leadId, viewingData) {
    try {
      const api = createAuthApi();
      const response = await api.post(`/api/admin/leads/${leadId}/viewings`, viewingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to schedule viewing' };
    }
  },

  async completeViewing(leadId, viewingId, outcome, notes) {
    try {
      const api = createAuthApi();
      const response = await api.put(`/api/admin/leads/${leadId}/viewings/${viewingId}/complete`, { outcome, notes });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to complete viewing' };
    }
  },

  // Property Interest
  async addPropertyInterest(leadId, propertyData) {
    try {
      const api = createAuthApi();
      const response = await api.post(`/api/admin/leads/${leadId}/property-interest`, propertyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to add property interest' };
    }
  },

  // Export
  async exportLeads() {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/admin/leads/export/csv', { responseType: 'blob' });
      
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

  // Odoo Sync
  async syncToOdoo(leadId = null) {
    try {
      const api = createAuthApi();
      const response = await api.post('/api/admin/sync/odoo', { leadId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to sync to Odoo' };
    }
  },

  // Users
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

  async verifyUser(id) {
    try {
      const api = createAuthApi();
      const response = await api.put(`/api/admin/users/${id}/verify`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to verify user' };
    }
  },

  async getUnverifiedUsers() {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/admin/users/unverified');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get unverified users' };
    }
  },
};

export default adminService;