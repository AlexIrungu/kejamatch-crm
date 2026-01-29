/**
 * Form Validation Utilities
 */

export const validators = {
  /**
   * Validate email address
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number (Kenyan format)
   */
  isValidPhone: (phone) => {
    // Matches: +254XXXXXXXXX, 254XXXXXXXXX, 07XXXXXXXX, 01XXXXXXXX
    const phoneRegex = /^(\+?254|0)?[17]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  /**
   * Validate required field
   */
  isRequired: (value) => {
    return value && value.toString().trim().length > 0;
  },

  /**
   * Validate minimum length
   */
  minLength: (value, min) => {
    return value && value.toString().trim().length >= min;
  },

  /**
   * Validate maximum length
   */
  maxLength: (value, max) => {
    return value && value.toString().trim().length <= max;
  },

  /**
   * Validate date is not in the past
   */
  isValidFutureDate: (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  },

  /**
   * Validate date range
   */
  isValidDateRange: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return end > start;
  },
};

/**
 * Validate contact form
 */
export const validateContactForm = (formData) => {
  const errors = {};

  if (!validators.isRequired(formData.name)) {
    errors.name = 'Name is required';
  } else if (!validators.minLength(formData.name, 2)) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!validators.isRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!validators.isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validators.isRequired(formData.phoneNumber)) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!validators.isValidPhone(formData.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid Kenyan phone number';
  }

  if (!validators.isRequired(formData.subject)) {
    errors.subject = 'Subject is required';
  }

  if (!validators.isRequired(formData.message)) {
    errors.message = 'Message is required';
  } else if (!validators.minLength(formData.message, 10)) {
    errors.message = 'Message must be at least 10 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate booking form
 */
export const validateBookingForm = (bookingData) => {
  const errors = {};

  if (!validators.isRequired(bookingData.name)) {
    errors.name = 'Name is required';
  }

  if (!validators.isRequired(bookingData.email)) {
    errors.email = 'Email is required';
  } else if (!validators.isValidEmail(bookingData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validators.isRequired(bookingData.phone)) {
    errors.phone = 'Phone number is required';
  } else if (!validators.isValidPhone(bookingData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!validators.isRequired(bookingData.checkIn)) {
    errors.checkIn = 'Check-in date is required';
  } else if (!validators.isValidFutureDate(bookingData.checkIn)) {
    errors.checkIn = 'Check-in date cannot be in the past';
  }

  if (!validators.isRequired(bookingData.checkOut)) {
    errors.checkOut = 'Check-out date is required';
  } else if (!validators.isValidDateRange(bookingData.checkIn, bookingData.checkOut)) {
    errors.checkOut = 'Check-out must be after check-in';
  }

  if (!bookingData.guests || bookingData.guests < 1) {
    errors.guests = 'Please select number of guests';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default validators;