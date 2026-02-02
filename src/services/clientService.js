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

const clientService = {
  // =====================
  // AUTHENTICATION
  // =====================

  /**
   * Register new client
   */
  async register(data) {
    try {
      const response = await axios.post(`${API_URL}/api/client/register`, data);
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.client));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Registration failed' };
    }
  },

  /**
   * Login client
   */
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/api/client/login`, credentials);
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.client));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Login failed' };
    }
  },

  /**
   * Verify email with code
   */
  async verifyEmail(email, code) {
    try {
      const response = await axios.post(`${API_URL}/api/client/verify-email`, { email, code });
      if (response.data.success && response.data.data.client) {
        // Update stored user with verified status
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.email === email) {
          currentUser.emailVerified = true;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Verification failed' };
    }
  },

  /**
   * Resend verification code
   */
  async resendVerificationCode(email) {
    try {
      const response = await axios.post(`${API_URL}/api/client/resend-verification`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to resend code' };
    }
  },

  // =====================
  // PROFILE MANAGEMENT
  // =====================

  /**
   * Get current client profile
   */
  async getCurrentClient() {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/client/me');
      if (response.data.success && response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get profile' };
    }
  },

  /**
   * Update client profile
   */
  async updateProfile(updates) {
    try {
      const api = createAuthApi();
      const response = await api.put('/api/client/profile', updates);
      if (response.data.success && response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update profile' };
    }
  },

  /**
   * Change password
   */
  async changePassword(passwords) {
    try {
      const api = createAuthApi();
      const response = await api.put('/api/client/change-password', passwords);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to change password' };
    }
  },

  // =====================
  // DOCUMENT MANAGEMENT
  // =====================

  /**
   * Get all my documents
   */
  async getMyDocuments() {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/client/documents');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get documents' };
    }
  },

  /**
   * Upload document
   */
  async uploadDocument(file, category, description) {
    try {
      const api = createAuthApi();
      const formData = new FormData();
      formData.append('document', file);
      formData.append('category', category);
      if (description) {
        formData.append('description', description);
      }

      const response = await api.post('/api/client/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to upload document' };
    }
  },

  /**
   * Download document
   */
  async downloadDocument(documentId) {
    try {
      const api = createAuthApi();
      const response = await api.get(`/api/client/documents/${documentId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to download document' };
    }
  },

  /**
   * Delete document
   */
  async deleteDocument(documentId) {
    try {
      const api = createAuthApi();
      const response = await api.delete(`/api/client/documents/${documentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to delete document' };
    }
  },

  // =====================
  // TWO-FACTOR AUTHENTICATION
  // =====================

  /**
   * Request 2FA code
   */
  async request2FACode() {
    try {
      const api = createAuthApi();
      const response = await api.post('/api/client/2fa/request');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to request 2FA code' };
    }
  },

  /**
   * Verify 2FA code
   */
  async verify2FACode(code) {
    try {
      const api = createAuthApi();
      const response = await api.post('/api/client/2fa/verify', { code });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to verify 2FA code' };
    }
  },

  /**
   * Enable 2FA for documents
   */
  async enable2FA() {
    try {
      const api = createAuthApi();
      const response = await api.post('/api/client/2fa/enable');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to enable 2FA' };
    }
  },

  // =====================
  // INQUIRY & LEADS
  // =====================

  /**
   * Get my linked inquiry/lead
   */
  async getMyInquiry() {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/client/inquiry');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get inquiry' };
    }
  },

  // =====================
  // GDPR & PRIVACY
  // =====================

  /**
   * Request data export
   */
  async requestDataExport() {
    try {
      const api = createAuthApi();
      const response = await api.post('/api/client/data-export');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to request data export' };
    }
  },

  /**
   * Request account deletion
   */
  async requestAccountDeletion() {
    try {
      const api = createAuthApi();
      const response = await api.post('/api/client/delete-account');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to request account deletion' };
    }
  },

  // =====================
  // ADMIN FUNCTIONS
  // =====================

  /**
   * Get pending client approvals (Admin)
   */
  async getPendingClients() {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/admin/clients/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get pending clients' };
    }
  },

  /**
   * Get all clients (Admin)
   */
  async getAllClients(filters = {}) {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/admin/clients', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get clients' };
    }
  },

  /**
   * Get client details (Admin)
   */
  async getClient(clientId) {
    try {
      const api = createAuthApi();
      const response = await api.get(`/api/admin/clients/${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get client' };
    }
  },

  /**
   * Approve client (Admin)
   */
  async approveClient(clientId) {
    try {
      const api = createAuthApi();
      const response = await api.post(`/api/admin/clients/${clientId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to approve client' };
    }
  },

  /**
   * Reject client (Admin)
   */
  async rejectClient(clientId, reason) {
    try {
      const api = createAuthApi();
      const response = await api.post(`/api/admin/clients/${clientId}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to reject client' };
    }
  },

  /**
   * Assign agent to client (Admin)
   */
  async assignAgent(clientId, agentId) {
    try {
      const api = createAuthApi();
      const response = await api.post(`/api/admin/clients/${clientId}/assign-agent`, { agentId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to assign agent' };
    }
  },

  /**
   * Update client (Admin)
   */
  async updateClient(clientId, updates) {
    try {
      const api = createAuthApi();
      const response = await api.put(`/api/admin/clients/${clientId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update client' };
    }
  },

  /**
   * Delete client (Admin)
   */
  async deleteClient(clientId) {
    try {
      const api = createAuthApi();
      const response = await api.delete(`/api/admin/clients/${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to delete client' };
    }
  },

  /**
   * Get pending documents (Admin)
   */
  async getPendingDocuments() {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/admin/documents/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get pending documents' };
    }
  },

  /**
   * Verify document (Admin)
   */
  async verifyDocument(documentId) {
    try {
      const api = createAuthApi();
      const response = await api.post(`/api/admin/documents/${documentId}/verify`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to verify document' };
    }
  },

  /**
   * Reject document (Admin)
   */
  async rejectDocument(documentId, reason) {
    try {
      const api = createAuthApi();
      const response = await api.post(`/api/admin/documents/${documentId}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to reject document' };
    }
  },

  /**
   * Download client document (Admin)
   */
  async downloadClientDocument(documentId) {
    try {
      const api = createAuthApi();
      const response = await api.get(`/api/admin/documents/${documentId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to download document' };
    }
  },

  /**
   * Get client stats (Admin)
   */
  async getClientStats() {
    try {
      const api = createAuthApi();
      const response = await api.get('/api/admin/clients/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get client stats' };
    }
  },
};

export default clientService;