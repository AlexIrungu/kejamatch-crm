import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, User, Mail, Phone, Calendar, Search, Filter } from 'lucide-react';
import clientService from '../../services/clientService';

const ClientApproval = () => {
  const [pendingClients, setPendingClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingClients();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [pendingClients, searchQuery]);

  const fetchPendingClients = async () => {
    try {
      setLoading(true);
      const response = await clientService.getPendingClients();
      
      if (response.success) {
        setPendingClients(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching pending clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...pendingClients];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          client.name?.toLowerCase().includes(query) ||
          client.email?.toLowerCase().includes(query) ||
          client.phone?.includes(query)
      );
    }

    setFilteredClients(filtered);
  };

  const handleApprove = async (clientId) => {
    if (!confirm('Are you sure you want to approve this client?')) {
      return;
    }

    try {
      setActionLoading(clientId);
      const response = await clientService.approveClient(clientId);
      
      if (response.success) {
        setPendingClients((prev) => prev.filter((c) => c._id !== clientId));
      } else {
        alert(response.message || 'Failed to approve client');
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert(error.message || 'Failed to approve client');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectClick = (client) => {
    setSelectedClient(client);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();

    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(selectedClient._id);
      const response = await clientService.rejectClient(selectedClient._id, rejectionReason);
      
      if (response.success) {
        setPendingClients((prev) => prev.filter((c) => c._id !== selectedClient._id));
        setShowRejectModal(false);
        setSelectedClient(null);
        setRejectionReason('');
      } else {
        alert(response.message || 'Failed to reject client');
      }
    } catch (error) {
      console.error('Rejection error:', error);
      alert(error.message || 'Failed to reject client');
    } finally {
      setActionLoading(null);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pending Client Approvals</h2>
          <p className="text-gray-600 mt-1">
            {pendingClients.length} client{pendingClients.length !== 1 ? 's' : ''} waiting for approval
          </p>
        </div>
      </div>

      {/* Search */}
      {pendingClients.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Clients Grid */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClients.map((client) => (
            <div key={client._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              {/* Client Info */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                    {client.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{client.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                      Pending Approval
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{client.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    Registered {new Date(client.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Property Preferences */}
              {client.propertyPreferences && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Property Preferences:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    {client.propertyPreferences.type && (
                      <div>
                        <span className="font-medium">Type:</span> {client.propertyPreferences.type}
                      </div>
                    )}
                    {client.propertyPreferences.minBudget && (
                      <div>
                        <span className="font-medium">Budget:</span> KES{' '}
                        {client.propertyPreferences.minBudget.toLocaleString()} -{' '}
                        {client.propertyPreferences.maxBudget.toLocaleString()}
                      </div>
                    )}
                    {client.propertyPreferences.bedrooms && (
                      <div>
                        <span className="font-medium">Bedrooms:</span> {client.propertyPreferences.bedrooms}
                      </div>
                    )}
                    {client.propertyPreferences.preferredLocations?.length > 0 && (
                      <div className="col-span-2">
                        <span className="font-medium">Locations:</span>{' '}
                        {client.propertyPreferences.preferredLocations.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(client._id)}
                  disabled={actionLoading === client._id}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                >
                  {actionLoading === client._id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleRejectClick(client)}
                  disabled={actionLoading === client._id}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {pendingClients.length === 0 ? 'No Pending Approvals' : 'No Clients Found'}
          </h3>
          <p className="text-gray-500">
            {pendingClients.length === 0
              ? 'All client registrations have been processed.'
              : 'No clients match your search criteria.'}
          </p>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowRejectModal(false)}
            />
            
            <div className="relative inline-block w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Reject Client Registration
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                You are about to reject <strong>{selectedClient?.name}</strong>'s registration.
                Please provide a reason that will be sent to them via email.
              </p>

              <form onSubmit={handleRejectSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Rejection *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="Provide a clear reason for rejection..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectModal(false);
                      setSelectedClient(null);
                      setRejectionReason('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? 'Rejecting...' : 'Reject Client'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientApproval;