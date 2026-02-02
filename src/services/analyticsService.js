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

const analyticsService = {
  /**
   * Get conversion funnel data
   * @param {Object} params - { startDate, endDate }
   */
  async getConversionFunnel(params = {}) {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/analytics/funnel', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get conversion funnel' };
    }
  },

  /**
   * Get lead source breakdown
   * @param {Object} params - { startDate, endDate }
   */
  async getLeadSources(params = {}) {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/analytics/sources', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get lead sources' };
    }
  },

  /**
   * Get agent performance data
   * @param {Object} params - { startDate, endDate, agentId }
   */
  async getAgentPerformance(params = {}) {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/analytics/agents', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get agent performance' };
    }
  },

  /**
   * Get time-based trends
   * @param {Object} params - { period: 'daily'|'weekly'|'monthly', startDate, endDate }
   */
  async getTimeTrends(params = {}) {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/analytics/trends', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get time trends' };
    }
  },

  /**
   * Get property analytics
   * @param {Object} params - { startDate, endDate }
   */
  async getPropertyAnalytics(params = {}) {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/analytics/properties', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get property analytics' };
    }
  },

  /**
   * Get all dashboard analytics in one call
   * @param {Object} params - { period, daysBack }
   */
  async getDashboardAnalytics(params = {}) {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/analytics/dashboard', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get dashboard analytics' };
    }
  },
};

export default analyticsService;