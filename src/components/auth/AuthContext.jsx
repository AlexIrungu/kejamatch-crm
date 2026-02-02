import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = authService.getToken();
      const storedUser = authService.getUser();
      
      console.log('🔍 Checking auth - Token exists:', !!token);
      console.log('🔍 Checking auth - User exists:', !!storedUser);
      
      if (token && storedUser) {
        // If we have both token and user in localStorage, use them
        setUser(storedUser);
        setIsAuthenticated(true);
        console.log('✅ Auth restored from localStorage:', storedUser);
      } else {
        // No valid auth data - but DON'T clear localStorage
        // The user might be in the process of logging in
        console.log('ℹ️  No auth data found in state');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login with:', email);
      const response = await authService.login({ email, password });
      console.log('✅ Full login response:', response);
      
      // authService already saves to localStorage
      const userData = authService.getUser();
      console.log('👤 User data from storage:', userData);
      
      if (!userData) {
        throw new Error('Failed to retrieve user data after login');
      }
      
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('✅ Auth state updated successfully');
      
      // Return user data in the expected format
      return { user: userData, success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      // Extract error message from different possible formats
      const errorMessage = error.message || error.error || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Attempting registration...');
      const response = await authService.register(userData);
      console.log('✅ Registration response:', response);
      
      // Get user from localStorage after registration
      const registeredUser = authService.getUser();
      
      if (!registeredUser) {
        throw new Error('Failed to retrieve user data after registration');
      }
      
      setUser(registeredUser);
      setIsAuthenticated(true);
      
      return { user: registeredUser, success: true };
    } catch (error) {
      console.error('❌ Registration error:', error);
      const errorMessage = error.message || error.error || 'Registration failed';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData) => {
    try {
      console.log('🔄 Updating profile...');
      const response = await authService.updateProfile(profileData);
      
      // Get updated user from localStorage
      const updatedUser = authService.getUser();
      
      if (updatedUser) {
        setUser(updatedUser);
        console.log('✅ Profile updated:', updatedUser);
      }
      
      return { user: updatedUser, success: true };
    } catch (error) {
      console.error('❌ Update profile error:', error);
      const errorMessage = error.message || error.error || 'Failed to update profile';
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;