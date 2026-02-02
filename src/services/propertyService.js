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

const propertyService = {
  // Public endpoints
  async getFeaturedProperties(limit = 6) {
    try {
      const api = createPublicApi();
      const response = await api.get(`/api/properties/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get featured properties' };
    }
  },

  async searchProperties(filters = {}) {
    try {
      const api = createPublicApi();
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const response = await api.get(`/api/properties/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to search properties' };
    }
  },

  async getProperty(id) {
    try {
      const api = createPublicApi();
      const response = await api.get(`/api/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get property' };
    }
  },

  async getPropertiesByCategory(category, type = null) {
    try {
      const api = createPublicApi();
      const url = type 
        ? `/api/properties/category/${category}?type=${type}`
        : `/api/properties/category/${category}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get properties' };
    }
  },

  // Admin endpoints
  async getAllProperties(filters = {}) {
    try {
      const api = createAuthApi();
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const response = await api.get(`/api/properties?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get properties' };
    }
  },

  async createProperty(propertyData) {
    try {
      const api = createAuthApi();
      const response = await api.post('/api/properties', propertyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to create property' };
    }
  },

  async updateProperty(id, updates) {
    try {
      const api = createAuthApi();
      const response = await api.put(`/api/properties/${id}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update property' };
    }
  },

  async deleteProperty(id) {
    try {
      const api = createAuthApi();
      const response = await api.delete(`/api/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to delete property' };
    }
  },

  async updatePropertyStatus(id, status) {
    try {
      const api = createAuthApi();
      const response = await api.put(`/api/properties/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update status' };
    }
  },

  async toggleFeatured(id) {
    try {
      const api = createAuthApi();
      const response = await api.put(`/api/properties/${id}/featured`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to toggle featured' };
    }
  },

  async updatePropertyImages(id, images) {
    try {
      const api = createAuthApi();
      const response = await api.put(`/api/properties/${id}/images`, { images });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update images' };
    }
  },

  async getPropertyStats() {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/properties/stats/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get statistics' };
    }
  },
};

export default propertyService;