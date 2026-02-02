import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Home, FileText, Activity, Download } from 'lucide-react';
import clientService from '../../services/clientService';

const ClientDetailModal = ({ client, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && client) {
      fetchClientDetails();
    }
  }, [isOpen, client]);

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      const response = await clientService.getClient(client._id);
      if (response.success) {
        setDocuments(response.data.documents || []);
      }
    } catch (error) {
      console.error('Error fetching client details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (documentId) => {
    try {
      const blob = await clientService.downloadClientDocument(documentId);
      const document = documents.find((d) => d._id === documentId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = document?.originalName || 'document';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download document');
    }
  };

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative inline-block w-full max-w-4xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                {client.name?.charAt(0) || 'C'}
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">{client.name}</h3>
                <p className="text-sm text-gray-600">{client.email}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              {[
                { id: 'info', label: 'Client Info', icon: User },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'activity', label: 'Activity', icon: Activity },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-secondary text-secondary'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-h-96 overflow-y-auto">
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{client.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-block px-2 py-1 rounded text-sm ${
                      client.status === 'approved' ? 'bg-green-100 text-green-800' :
                      client.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Registered</p>
                    <p className="font-medium">{new Date(client.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {client.propertyPreferences && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Property Preferences</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {client.propertyPreferences.type && (
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <span className="ml-2 font-medium">{client.propertyPreferences.type}</span>
                        </div>
                      )}
                      {client.propertyPreferences.minBudget && (
                        <div>
                          <span className="text-gray-600">Budget:</span>
                          <span className="ml-2 font-medium">
                            KES {client.propertyPreferences.minBudget.toLocaleString()} - {client.propertyPreferences.maxBudget.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <div key={doc._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.originalName}</p>
                          <p className="text-sm text-gray-600">{doc.category}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadDocument(doc._id)}
                        className="flex items-center px-3 py-1 bg-primary text-white rounded-lg hover:bg-opacity-90"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No documents uploaded</p>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-3">
                {client.activities?.length > 0 ? (
                  client.activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 py-3 border-b">
                      <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
                      <div>
                        <p className="text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No activity recorded</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailModal;