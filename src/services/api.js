/**
 * Centralized API Service for Kejamatch
 * Handles all HTTP requests to backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://kejamatch-backend.onrender.com';

/**
 * Generic fetch wrapper with error handling
 */
const fetchWithError = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * API endpoints
 */
export const api = {
  /**
   * Contact Form Submission
   */
  contact: {
    submit: async (formData) => {
      return fetchWithError(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        body: JSON.stringify(formData),
      });
    },
  },

  /**
   * Booking Form Submission
   */
  bookings: {
    submit: async (bookingData) => {
      return fetchWithError(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
    },
  },

  /**
   * Property Status (CRM Integration)
   */
  properties: {
    getStatus: async (propertyId) => {
      return fetchWithError(`${API_BASE_URL}/api/properties/${propertyId}/status`);
    },
  },

  /**
   * Health Check
   */
  health: {
    check: async () => {
      return fetchWithError(`${API_BASE_URL}/health`);
    },
  },
};

export default api;