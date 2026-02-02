import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, AlertCircle, CheckCircle, Phone, Home } from 'lucide-react';
import SEO from '../components/common/SEO';

const ClientRegister = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    propertyType: 'Both',
    minBudget: '',
    maxBudget: '',
    preferredLocations: '',
    consentToDataProcessing: true,
    consentToMarketing: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');

    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number');
      return;
    }

    if (!formData.consentToDataProcessing) {
      setError('You must consent to data processing to register');
      return;
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      // Prepare property preferences
      const propertyPreferences = {
        type: formData.propertyType,
        minBudget: formData.minBudget ? parseInt(formData.minBudget) : null,
        maxBudget: formData.maxBudget ? parseInt(formData.maxBudget) : null,
        preferredLocations: formData.preferredLocations 
          ? formData.preferredLocations.split(',').map(loc => loc.trim())
          : []
      };

      const response = await fetch(`${API_URL}/api/client/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          propertyPreferences,
          consentToDataProcessing: formData.consentToDataProcessing,
          consentToMarketing: formData.consentToMarketing
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      // Save token
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.client));

      // Redirect to verification page
      navigate('/client/verify-email', { 
        state: { 
          email: formData.email,
          requiresVerification: true,
          requiresApproval: true
        } 
      });
      
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Register - Kejamatch Client Portal"
        description="Create your client account to track inquiries and manage documents"
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-dark py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-block">
              <h1 className="text-4xl font-bold text-white mb-2">Kejamatch</h1>
            </Link>
            <h2 className="text-2xl font-semibold text-white">
              Create Your Client Account
            </h2>
            <p className="mt-2 text-gray-300">
              Already have an account?{' '}
              <Link
                to="/client/login"
                className="font-medium text-secondary hover:text-accent transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Personal Information
                </h3>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </div>
              </div>

              {/* Property Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Property Preferences
                </h3>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I'm looking to:
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  >
                    <option value="Rent">Rent</option>
                    <option value="Buy">Buy</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                {/* Budget Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Budget (KES)
                    </label>
                    <input
                      name="minBudget"
                      type="number"
                      value={formData.minBudget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="e.g., 50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Budget (KES)
                    </label>
                    <input
                      name="maxBudget"
                      type="number"
                      value={formData.maxBudget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="e.g., 150000"
                    />
                  </div>
                </div>

                {/* Preferred Locations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Locations
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      name="preferredLocations"
                      type="text"
                      value={formData.preferredLocations}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="e.g., Westlands, Kilimani, Karen"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Separate multiple locations with commas</p>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Security
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Password strength:</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength <= 2 ? 'text-red-600' : 
                          passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Min 8 characters, 1 uppercase, 1 number
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="••••••••"
                    />
                    {formData.confirmPassword && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {formData.password === formData.confirmPassword ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Consent */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    id="consent"
                    name="consentToDataProcessing"
                    type="checkbox"
                    checked={formData.consentToDataProcessing}
                    onChange={handleChange}
                    className="h-4 w-4 mt-1 text-secondary focus:ring-secondary border-gray-300 rounded"
                  />
                  <label htmlFor="consent" className="ml-2 block text-sm text-gray-700">
                    I consent to the processing of my personal data in accordance with the{' '}
                    <a href="#" className="text-secondary hover:text-primary">
                      Privacy Policy
                    </a>{' '}
                    *
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    id="marketing"
                    name="consentToMarketing"
                    type="checkbox"
                    checked={formData.consentToMarketing}
                    onChange={handleChange}
                    className="h-4 w-4 mt-1 text-secondary focus:ring-secondary border-gray-300 rounded"
                  />
                  <label htmlFor="marketing" className="ml-2 block text-sm text-gray-700">
                    I would like to receive property updates and marketing communications
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Client Account
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientRegister;