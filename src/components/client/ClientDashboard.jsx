import { useEffect, useState } from 'react';
import { FileText, CheckCircle, Clock, Upload, Eye, Activity } from 'lucide-react';
import clientService from '../../services/clientService';

const ClientDashboard = ({ client, onRefresh }) => {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    verifiedDocuments: 0,
    pendingDocuments: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [documentsRes] = await Promise.all([
        clientService.getMyDocuments(),
      ]);

      if (documentsRes.success) {
        const documents = documentsRes.data || [];
        const verified = documents.filter(d => d.status === 'verified').length;
        const pending = documents.filter(d => d.status === 'pending').length;

        setStats({
          totalDocuments: documents.length,
          verifiedDocuments: verified,
          pendingDocuments: pending,
        });

        // Get recent activity (last 5 documents)
        const recent = documents
          .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
          .slice(0, 5);
        setRecentActivity(recent);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-dark text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {client?.name || 'Client'}!
        </h2>
        <p className="text-gray-200">
          Here's an overview of your account and recent activity.
        </p>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Email Verification</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              client?.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {client?.emailVerified ? 'Verified' : 'Pending'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Account Approval</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(client?.status)}`}>
              {client?.status?.charAt(0).toUpperCase() + client?.status?.slice(1) || 'Pending'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Member Since</span>
            <span className="text-gray-900 font-medium">
              {client?.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Documents</p>
              <p className="text-3xl font-bold text-primary">{stats.totalDocuments}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Verified</p>
              <p className="text-3xl font-bold text-green-600">{stats.verifiedDocuments}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingDocuments}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onRefresh && onRefresh('documents')}
            className="flex items-center justify-center px-4 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Document
          </button>
          <button
            onClick={() => onRefresh && onRefresh('inquiry')}
            className="flex items-center justify-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <Eye className="w-5 h-5 mr-2" />
            View My Inquiry
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((doc) => (
              <div
                key={doc._id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.originalName}</p>
                    <p className="text-sm text-gray-600">{doc.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                    doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;