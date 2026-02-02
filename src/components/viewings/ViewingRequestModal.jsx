import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import viewingService from '../../services/viewingService';

const ViewingRequestModal = ({ 
  isOpen, 
  onClose, 
  property 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    alternateDate: '',
    alternateTime: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.preferredDate || !formData.preferredTime) {
      alert('Please select a preferred date and time');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const payload = {
        propertyId: property._id || property.id,
        propertyName: property.title,
        propertyLocation: property.location?.city || property.location?.address || '',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        alternateDate: formData.alternateDate || null,
        alternateTime: formData.alternateTime || null,
        message: formData.message || ''
      };

      const response = await viewingService.requestViewing(payload);

      if (response.success) {
        setSubmitStatus('success');
        
        // Close modal after delay
        setTimeout(() => {
          onClose();
          setFormData({
            name: '',
            email: '',
            phone: '',
            preferredDate: '',
            preferredTime: '',
            alternateDate: '',
            alternateTime: '',
            message: ''
          });
          setSubmitStatus(null);
        }, 3000);
      } else {
        throw new Error(response.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Viewing request error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-primary">Schedule a Viewing</h3>
              <p className="text-gray-600 mt-1">{property.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X size={24} />
            </button>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800">Viewing request sent successfully!</p>
                  <p className="text-sm text-green-700 mt-1">We'll contact you shortly to confirm your appointment.</p>
                </div>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">Something went wrong</p>
                  <p className="text-sm text-red-700 mt-1">Please try again or contact us directly.</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <User size={18} className="mr-2 text-secondary" />
                Your Information
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail size={14} className="inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone size={14} className="inline mr-1" />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                    placeholder="+254 700 000 000"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Preferred Date/Time */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Calendar size={18} className="mr-2 text-secondary" />
                Preferred Viewing Time
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={today}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock size={14} className="inline mr-1" />
                    Time *
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Alternative Date/Time */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 text-sm">
                Alternative Time (Optional)
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="date"
                    name="alternateDate"
                    value={formData.alternateDate}
                    onChange={handleChange}
                    min={today}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                    placeholder="Alternative date"
                  />
                </div>
                <div>
                  <select
                    name="alternateTime"
                    value={formData.alternateTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MessageSquare size={14} className="inline mr-1" />
                Additional Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none resize-none"
                placeholder="Any questions or special requirements..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-secondary to-accent text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Calendar size={18} />
                    Request Viewing
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewingRequestModal;