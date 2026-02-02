import { useState } from 'react';
import { X, User, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import authService from '../../services/authService';

const ProfileSettingsModal = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  if (!isOpen) return null;

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.updateProfile({
        name: profileData.name,
        email: profileData.email,
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate new password
    const passwordError = validatePassword(passwordData.newPassword);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    // Check if new password is different from current
    if (passwordData.currentPassword === passwordData.newPassword) {
      setError('New password must be different from current password');
      setLoading(false);
      return;
    }

    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('profile');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 flex items-center justify-center px-4 py-3 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'border-b-2 border-secondary text-secondary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </button>
          <button
            onClick={() => {
              setActiveTab('password');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 flex items-center justify-center px-4 py-3 font-medium transition-colors ${
              activeTab === 'password'
                ? 'border-b-2 border-secondary text-secondary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lock className="w-4 h-4 mr-2" />
            Password
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Min 8 characters, 1 uppercase letter, 1 number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Changing Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsModal;