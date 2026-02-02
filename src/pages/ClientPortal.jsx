import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, FileText, User, LogOut, Bell, CheckCircle, 
  AlertCircle, Clock, Upload, Download, Shield
} from 'lucide-react';
import ClientDashboard from '../components/client/ClientDashboard';
import InquiryTracker from '../components/client/InquiryTracker';
import DocumentUpload from '../components/client/DocumentUpload';
import DocumentList from '../components/client/DocumentList';
import ProfileSettings from '../components/client/ProfileSettings';

const ClientPortal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    documents: 0,
    verified: 0,
    pending: 0
  });

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

      const response = await fetch(`${API_URL}/api/client/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to fetch client data');
      }

      setClient(data.data.client);
      setStats({
        documents: data.data.documentSummary.total || 0,
        verified: data.data.documentSummary.verified || 0,
        pending: data.data.documentSummary.pending || 0
      });

    } catch (error) {
      console.error('Error fetching client data:', error);
      // If unauthorized, redirect to login
      if (error.message.includes('401')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/client/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/client/login');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'inquiry', label: 'My Inquiry', icon: FileText },
    { id: 'documents', label: 'Documents', icon: Upload },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  // Check approval status
  if (client?.status === 'pending_approval') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-dark flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Pending Approval
            </h2>
            <p className="text-gray-600 mb-6">
              Your account is awaiting admin approval. You'll receive an email notification once your account has been reviewed.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>📧 Email:</strong> {client?.email}<br />
                <strong>📅 Registered:</strong> {new Date(client?.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check email verification
  if (!client?.isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-dark flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verification Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please verify your email address to access the portal.
            </p>
            <button
              onClick={() => navigate('/client/verify-email', { state: { email: client?.email } })}
              className="w-full px-4 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors mb-3"
            >
              Verify Email
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Kejamatch</h1>
              <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                CLIENT PORTAL
              </span>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                <Bell className="w-6 h-6" />
                {stats.pending > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {stats.pending}
                  </span>
                )}
              </button>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{client?.name}</p>
                  <p className="text-xs text-gray-500">
                    {client?.status === 'approved' && (
                      <span className="inline-flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                        Verified
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-secondary text-secondary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {activeTab === 'dashboard' && (
            <ClientDashboard client={client} stats={stats} onRefresh={fetchClientData} />
          )}
          {activeTab === 'inquiry' && (
            <InquiryTracker clientId={client?.id} />
          )}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <DocumentUpload clientId={client?.id} onUploadSuccess={fetchClientData} />
              <DocumentList clientId={client?.id} />
            </div>
          )}
          {activeTab === 'profile' && (
            <ProfileSettings client={client} onUpdate={fetchClientData} />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2024 Kejamatch Properties. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <a href="#" className="text-sm text-gray-500 hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary">
                Terms of Service
              </a>
              <a href="/contact" className="text-sm text-gray-500 hover:text-primary">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientPortal;