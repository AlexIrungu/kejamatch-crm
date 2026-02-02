import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import authService from '../services/authService';
import SEO from '../components/common/SEO';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'agent',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await authService.register(registerData);
      
      // Redirect to email verification page
      navigate('/verify-email', { 
        state: { 
          email: formData.email,
          role: registerData.role,
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
        title="Register - Kejamatch Real Estate"
        description="Create your Kejamatch account"
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-dark py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-block">
              <h1 className="text-4xl font-bold text-white mb-2">Kejamatch</h1>
            </Link>
            <h2 className="text-2xl font-semibold text-white">
              Create your account
            </h2>
            <p className="mt-2 text-gray-300">
              Already have an account?{' '}
              <Link
                to="/login"
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

              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Role Selection - Hidden for regular users */}
              <input type="hidden" name="role" value="agent" />

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                {/* Password Strength Indicator */}
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

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
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

              {/* Terms and Conditions */}
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{' '}
                  <a href="#" className="text-secondary hover:text-primary">
                    Terms and Conditions
                  </a>
                </label>
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
                    Create Account
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

export default Register;