/**
 * CRM Service
 * Handles all CRM-related operations (leads, bookings, property status)
 */

import api from './api';

class CRMService {
  /**
   * Create a lead from contact form
   * @param {Object} formData - Contact form data
   * @returns {Promise<Object>} - API response
   */
  static async createLead(formData) {
    try {
      const result = await api.contact.submit(formData);
      
      if (result.success) {
        console.log('✅ Lead created successfully:', result.data);
        return { success: true, data: result.data };
      } else {
        console.error('❌ Failed to create lead:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('CRM Service Error (createLead):', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a booking (opportunity) from booking form
   * @param {Object} bookingData - Booking form data
   * @returns {Promise<Object>} - API response
   */
  static async createBooking(bookingData) {
    try {
      const result = await api.bookings.submit(bookingData);
      
      if (result.success) {
        console.log('✅ Booking created successfully:', result.data);
        return { success: true, data: result.data };
      } else {
        console.error('❌ Failed to create booking:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('CRM Service Error (createBooking):', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get property status from CRM
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} - Property status
   */
  static async getPropertyStatus(propertyId) {
    try {
      const result = await api.properties.getStatus(propertyId);
      
      if (result.success) {
        return result.data;
      } else {
        console.warn('Could not fetch property status:', result.error);
        return null;
      }
    } catch (error) {
      console.error('CRM Service Error (getPropertyStatus):', error);
      return null;
    }
  }

  /**
   * Check if backend API is healthy
   * @returns {Promise<boolean>} - Health status
   */
  static async checkHealth() {
    try {
      const result = await api.health.check();
      return result.success;
    } catch (error) {
      console.error('CRM Service Error (checkHealth):', error);
      return false;
    }
  }
}

export default CRMService;