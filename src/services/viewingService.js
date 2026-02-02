/**
 * Viewing Service
 * Handles all viewing-related API operations
 */

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

const createPublicApi = () => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const viewingService = {
  /**
   * Request a viewing (Public - from property details page)
   */
  async requestViewing(viewingData) {
    try {
      const api = createPublicApi();
      const response = await api.post('/api/viewings/request', viewingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to submit viewing request' };
    }
  },

  /**
   * Get all viewings (Admin - for calendar)
   */
  async getAllViewings(filters = {}) {
    try {
      const api = createAuthApi();
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);
      
      const response = await api.get(`/api/viewings?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get viewings' };
    }
  },

  /**
   * Get viewing statistics (Admin)
   */
  async getViewingStats() {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/viewings/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get viewing stats' };
    }
  },

  /**
   * Get agent's viewings
   */
  async getMyViewings(filters = {}) {
    try {
      const api = createAuthApi();
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);
      
      const response = await api.get(`/api/viewings/my?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get viewings' };
    }
  },

  /**
   * Schedule a viewing for a lead (Admin/Agent)
   */
  async scheduleViewing(leadId, viewingData) {
    try {
      const api = createAuthApi();
      const response = await api.post(`/api/viewings/${leadId}/schedule`, viewingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to schedule viewing' };
    }
  },

  /**
   * Complete a viewing (Admin/Agent)
   */
  async completeViewing(leadId, viewingId, data) {
    try {
      const api = createAuthApi();
      const response = await api.put(`/api/viewings/${leadId}/${viewingId}/complete`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to complete viewing' };
    }
  },

  /**
   * Cancel a viewing (Admin/Agent)
   */
  async cancelViewing(leadId, viewingId, reason = '') {
    try {
      const api = createAuthApi();
      const response = await api.put(`/api/viewings/${leadId}/${viewingId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to cancel viewing' };
    }
  },
};

export default viewingService;