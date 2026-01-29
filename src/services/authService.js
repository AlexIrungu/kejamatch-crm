import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Register new user
  async register(userData) {
    try {
      const response = await api.post('/api/auth/register', userData);
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Registration failed' };
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/api/auth/login', credentials);
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Login failed' };
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get user data' };
    }
  },

  // Update profile
  async updateProfile(userData) {
    try {
      const response = await api.put('/api/auth/profile', userData);
      if (response.data.success && response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update profile' };
    }
  },

  // Change password
  async changePassword(passwords) {
    try {
      const response = await api.put('/api/auth/change-password', passwords);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to change password' };
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  // Get user from local storage
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is admin
  isAdmin() {
    const user = this.getUser();
    return user?.role === 'admin';
  },

  // Check if user is agent
  isAgent() {
    const user = this.getUser();
    return user?.role === 'agent';
  },
};

export default authService;