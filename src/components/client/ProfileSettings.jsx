import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Shield, Download, Trash2 } from 'lucide-react';
import clientService from '../../services/clientService';
import DataExportModal from './DataExportModal';

const ProfileSettings = ({ client, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    occupation: '',
    employerName: '',
    address: {
      street: '',
      city: '',
      county: '',
      postalCode: '',
    },
    propertyPreferences: {
      type: '',
      minBudget: '',
      maxBudget: '',
      preferredLocations: [],
      bedrooms: '',
      bathrooms: '',
    },
    marketingConsent: false,
    twoFactorEnabled: false,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDataModal, setShowDataModal] = useState(false);
  const [dataModalType, setDataModalType] = useState('export');

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        dateOfBirth: client.dateOfBirth ? client.dateOfBirth.split('T')[0] : '',
        occupation: client.occupation || '',
        employerName: client.employerName || '',
        address: {
          street: client.address?.street || '',
          city: client.address?.city || '',
          county: client.address?.county || '',
          postalCode: client.address?.postalCode || '',
        },
        propertyPreferences: {
          type: client.propertyPreferences?.type || '',
          minBudget: client.propertyPreferences?.minBudget || '',
          maxBudget: client.propertyPreferences?.maxBudget || '',
          preferredLocations: client.propertyPreferences?.preferredLocations || [],
          bedrooms: client.propertyPreferences?.bedrooms || '',
          bathrooms: client.propertyPreferences?.bathrooms || '',
        },
        marketingConsent: client.marketingConsent || false,
        twoFactorEnabled: client.twoFactorEnabled || false,
      });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    const locations = value.split(',').map(loc => loc.trim()).filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      propertyPreferences: {
        ...prev.propertyPreferences,
        preferredLocations: locations,
      },
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await clientService.updateProfile(formData);
      
      if (response.success) {
        setSuccess('Profile updated successfully!');
        if (onUpdate) {
          onUpdate(response.data);
        }
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setPasswordLoading(true);
      setError('');
      setSuccess('');

      const response = await clientService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      if (response.success) {
        setSuccess('Password changed successfully!');
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Password change error:', err);
      setError(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      const response = await clientService.enable2FA();
      if (response.success) {
        setFormData((prev) => ({
          ...prev,
          twoFactorEnabled: !prev.twoFactorEnabled,
        }));
        setSuccess('Two-factor authentication updated');
      }
    } catch (err) {
      setError(err.message || 'Failed to update 2FA settings');
    }
  };

  const handleDataRequest = (type) => {
    setDataModalType(type);
    setShowDataModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Personal Information */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occupation
            </label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employer Name
            </label>
            <input
              type="text"
              name="employerName"
              value={formData.employerName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mt-6">Address</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address
            </label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              County
            </label>
            <input
              type="text"
              name="address.county"
              value={formData.address.county}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              name="address.postalCode"
              value={formData.address.postalCode}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mt-6">Property Preferences</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <select
              name="propertyPreferences.type"
              value={formData.propertyPreferences.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="rent">Rent</option>
              <option value="buy">Buy</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                name="propertyPreferences.minBudget"
                value={formData.propertyPreferences.minBudget}
                onChange={handleChange}
                placeholder="Min"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
              <input
                type="number"
                name="propertyPreferences.maxBudget"
                value={formData.propertyPreferences.maxBudget}
                onChange={handleChange}
                placeholder="Max"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Locations (comma-separated)
            </label>
            <input
              type="text"
              value={formData.propertyPreferences.preferredLocations.join(', ')}
              onChange={handleLocationChange}
              placeholder="e.g., Nairobi, Mombasa, Kisumu"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <input
              type="number"
              name="propertyPreferences.bedrooms"
              value={formData.propertyPreferences.bedrooms}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <input
              type="number"
              name="propertyPreferences.bathrooms"
              value={formData.propertyPreferences.bathrooms}
              onChange={handleChange}
              min="0"
              step="0.5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mt-6">Preferences</h4>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="marketingConsent"
            name="marketingConsent"
            checked={formData.marketingConsent}
            onChange={handleChange}
            className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
          />
          <label htmlFor="marketingConsent" className="ml-2 block text-sm text-gray-700">
            I consent to receiving marketing communications
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={passwordLoading}
          className="w-full flex items-center justify-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {passwordLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Changing Password...
            </>
          ) : (
            'Change Password'
          )}
        </button>
      </form>

      {/* Security & Privacy */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Security & Privacy</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <button
              onClick={handleToggle2FA}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                formData.twoFactorEnabled
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {formData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="font-medium text-gray-900 mb-4">Data Management</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleDataRequest('export')}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Request Data Export
              </button>
              <button
                onClick={() => handleDataRequest('delete')}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Export/Delete Modal */}
      <DataExportModal
        isOpen={showDataModal}
        onClose={() => setShowDataModal(false)}
        onRequest={async () => {
          try {
            if (dataModalType === 'export') {
              await clientService.requestDataExport();
              setSuccess('Data export request submitted. You will receive an email shortly.');
            } else {
              await clientService.requestAccountDeletion();
              setSuccess('Account deletion request submitted. You have 30 days to cancel this request.');
            }
            setShowDataModal(false);
          } catch (err) {
            setError(err.message || 'Request failed');
          }
        }}
        type={dataModalType}
      />
    </div>
  );
};

export default ProfileSettings;