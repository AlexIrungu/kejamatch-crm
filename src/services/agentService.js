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

const agentService = {
  // Stats
  async getMyStats() {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/agent/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get stats' };
    }
  },

  // Leads
  async getMyLeads(filters = {}) {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/agent/leads', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get leads' };
    }
  },

  async getLead(id) {
    try {
      const api = createAuthApi();
      const response = await api.get(`/api/agent/leads/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get lead' };
    }
  },

  async updateLeadStatus(leadId, status) {
    try {
      const api = createAuthApi();
      const response = await api.put(`/api/agent/leads/${leadId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update lead status' };
    }
  },

  // Activities
  async getLeadActivities(leadId) {
    try {
      const api = createAuthApi();
      const response = await api.get(`/api/agent/leads/${leadId}/activities`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get activities' };
    }
  },

  async addNote(leadId, note) {
    try {
      const api = createAuthApi();
      const response = await api.post(`/api/agent/leads/${leadId}/notes`, { note });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to add note' };
    }
  },

  async logCall(leadId, callData) {
    try {
      const api = createAuthApi();
      const response = await api.post(`/api/agent/leads/${leadId}/calls`, callData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to log call' };
    }
  },

  async logEmail(leadId, emailData) {
    try {
      const api = createAuthApi();
      const response = await api.post(`/api/agent/leads/${leadId}/emails`, emailData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to log email' };
    }
  },

  // Viewings
  async scheduleViewing(leadId, viewingData) {
    try {
      const api = createAuthApi();
      const response = await api.post(`/api/agent/leads/${leadId}/viewings`, viewingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to schedule viewing' };
    }
  },

  async completeViewing(leadId, viewingId, outcome, notes) {
    try {
      const api = createAuthApi();
      const response = await api.put(`/api/agent/leads/${leadId}/viewings/${viewingId}/complete`, { outcome, notes });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to complete viewing' };
    }
  },

  // Property Interest
  async addPropertyInterest(leadId, propertyData) {
    try {
      const api = createAuthApi();
      const response = await api.post(`/api/agent/leads/${leadId}/property-interest`, propertyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to add property interest' };
    }
  },
};

export default agentService;