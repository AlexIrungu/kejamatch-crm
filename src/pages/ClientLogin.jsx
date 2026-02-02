import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Info } from 'lucide-react';
import SEO from '../components/common/SEO';

const ClientLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setInfo('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/client/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and user data
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('user', JSON.stringify({
        ...data.data.client,
        role: 'client'
      }));

      // Check verification status
      if (data.data.requiresVerification) {
        navigate('/client/verify-email', { 
          state: { 
            email: formData.email,
            requiresVerification: true
          } 
        });
        return;
      }

      // Redirect to client portal
      navigate('/client/portal');
      
    } catch (err) {
      const errorMessage = err.message || 'Invalid email or password';
      
      // Handle specific error cases
      if (errorMessage.includes('pending approval')) {
        setInfo('Your account is pending admin approval. You\'ll receive an email once approved.');
      } else if (errorMessage.includes('suspended')) {
        setError('Your account has been suspended. Please contact support.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Client Login - Kejamatch Portal"
        description="Login to your Kejamatch client portal"
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-dark py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-block">
              <h1 className="text-4xl font-bold text-white mb-2">Kejamatch</h1>
            </Link>
            <h2 className="text-2xl font-semibold text-white">
              Client Portal Login
            </h2>
            <p className="mt-2 text-gray-300">
              Don't have an account?{' '}
              <Link
                to="/client/register"
                className="font-medium text-secondary hover:text-accent transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Info Message */}
              {info && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-600">{info}</p>
                </div>
              )}

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
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-secondary hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </a>
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
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In to Portal
                  </>
                )}
              </button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>👋 New to Kejamatch?</strong><br />
                Create an account to track your property inquiries, upload documents, and stay updated on your search.
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center space-y-2">
            <Link
              to="/"
              className="block text-sm text-gray-300 hover:text-white transition-colors"
            >
              ← Back to home
            </Link>
            <div className="text-xs text-gray-400">
              For admin/agent access, use{' '}
              <Link to="/login" className="text-secondary hover:text-accent">
                staff login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientLogin;