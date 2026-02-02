import React, { useState } from 'react';
import { X, Calendar, Users, Star, CheckCircle, AlertCircle } from 'lucide-react';

const BookingForm = ({ 
  isOpen, 
  onClose, 
  bnb, 
  onSubmit 
}) => {
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Backend API URL - Update this with your Render URL after deployment
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://kejamatch-backend.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    
    if (checkInDate >= checkOutDate) {
      alert('Check-out date must be after check-in date');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const payload = {
        propertyName: bnb.title,
        propertyLocation: bnb.location,
        name: bookingData.name,
        email: bookingData.email,
        phoneNumber: bookingData.phone,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        nights: getNights(),
        pricePerNight: bnb.price,
        totalCost: calculateTotalCost(),
        specialRequests: bookingData.specialRequests || ''
      };

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit booking');
      }

      setSubmitStatus('success');
      
      // Call parent onSubmit if provided
      if (onSubmit) {
        onSubmit(bookingData);
      }

      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
        // Reset form
        setBookingData({
          checkIn: '',
          checkOut: '',
          guests: 1,
          name: '',
          email: '',
          phone: '',
          specialRequests: ''
        });
        setSubmitStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Booking submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotalCost = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || !bnb) return 0;
    
    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    return nights > 0 ? nights * bnb.price : 0;
  };

  const getNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    
    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    return Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  };

  if (!isOpen || !bnb) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{bnb.title}</h3>
              <p className="text-gray-600">{bnb.location}</p>
              <div className="flex items-center mt-2">
                <Star size={16} className="text-yellow-500 fill-current mr-1" />
                <span className="text-sm">{bnb.rating} ({bnb.reviews} reviews)</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl p-2"
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
                  <p className="font-semibold text-green-800">Booking request sent successfully!</p>
                  <p className="text-sm text-green-700 mt-1">We'll contact you shortly to confirm your booking.</p>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dates and Guests */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Check-in
                </label>
                <input
                  type="date"
                  value={bookingData.checkIn}
                  onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Check-out
                </label>
                <input
                  type="date"
                  value={bookingData.checkOut}
                  onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                  min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users size={16} className="inline mr-1" />
                  Guests
                </label>
                <select
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                  required
                >
                  {[...Array(bnb.maxGuests)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Guest Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={bookingData.phone}
                onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                placeholder="+254 700 000 000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none resize-none"
                placeholder="Any special requests or requirements..."
              />
            </div>

            {/* Booking Summary */}
            {bookingData.checkIn && bookingData.checkOut && (
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-secondary">
                <h4 className="font-bold text-primary mb-3 text-lg">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate per night:</span>
                    <span className="font-semibold">KES {bnb.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nights:</span>
                    <span className="font-semibold">{getNights()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-semibold">{bookingData.guests}</span>
                  </div>
                  <hr className="my-2 border-gray-300" />
                  <div className="flex justify-between text-lg font-bold text-primary">
                    <span>Total:</span>
                    <span className="text-secondary">KES {calculateTotalCost().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  bnb.instantBook
                    ? 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg'
                    : 'bg-gradient-to-r from-secondary to-accent text-white hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>{bnb.instantBook ? 'Confirm Booking' : 'Send Request'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;