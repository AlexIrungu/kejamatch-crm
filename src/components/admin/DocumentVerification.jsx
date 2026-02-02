import { useEffect, useState } from 'react';
import { FileText, CheckCircle, XCircle, Download, Search, Filter } from 'lucide-react';
import clientService from '../../services/clientService';

const DocumentVerification = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [documents, searchQuery, categoryFilter]);

  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);
      const response = await clientService.getPendingDocuments();
      if (response.success) {
        setDocuments(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...documents];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.originalName?.toLowerCase().includes(query) ||
          doc.client?.name?.toLowerCase().includes(query) ||
          doc.category?.toLowerCase().includes(query)
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((doc) => doc.category === categoryFilter);
    }

    setFilteredDocuments(filtered);
  };

  const handleVerify = async (documentId) => {
    if (!confirm('Are you sure you want to verify this document?')) {
      return;
    }

    try {
      setActionLoading(documentId);
      const response = await clientService.verifyDocument(documentId);
      
      if (response.success) {
        setDocuments((prev) => prev.filter((d) => d._id !== documentId));
      } else {
        alert(response.message || 'Failed to verify document');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert(error.message || 'Failed to verify document');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectClick = (document) => {
    setSelectedDocument(document);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();

    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(selectedDocument._id);
      const response = await clientService.rejectDocument(selectedDocument._id, rejectionReason);
      
      if (response.success) {
        setDocuments((prev) => prev.filter((d) => d._id !== selectedDocument._id));
        setShowRejectModal(false);
        setSelectedDocument(null);
        setRejectionReason('');
      } else {
        alert(response.message || 'Failed to reject document');
      }
    } catch (error) {
      console.error('Rejection error:', error);
      alert(error.message || 'Failed to reject document');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async (documentId) => {
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

  const getCategoryLabel = (category) => {
    const labels = {
      id: 'Identification',
      proof_of_address: 'Proof of Address',
      proof_of_income: 'Proof of Income',
      employment_letter: 'Employment Letter',
      bank_statement: 'Bank Statement',
      other: 'Other',
    };
    return labels[category] || category;
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Verification Queue</h2>
          <p className="text-gray-600 mt-1">{documents.length} documents pending review</p>
        </div>
      </div>

      {documents.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents or clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="id">Identification</option>
              <option value="proof_of_address">Proof of Address</option>
              <option value="proof_of_income">Proof of Income</option>
              <option value="employment_letter">Employment Letter</option>
              <option value="bank_statement">Bank Statement</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      )}

      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDocuments.map((doc) => (
            <div key={doc._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-10 h-10 text-secondary" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{doc.originalName}</h4>
                    <p className="text-sm text-gray-600">{getCategoryLabel(doc.category)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Client:</span>
                  <span className="font-medium">{doc.client?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uploaded:</span>
                  <span className="font-medium">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">{(doc.fileSize / 1024).toFixed(2)} KB</span>
                </div>
              </div>

              {doc.description && (
                <div className="bg-gray-50 rounded p-3 mb-4">
                  <p className="text-xs text-gray-600">{doc.description}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(doc._id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
                <button
                  onClick={() => handleVerify(doc._id)}
                  disabled={actionLoading === doc._id}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                >
                  {actionLoading === doc._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verify
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleRejectClick(doc)}
                  disabled={actionLoading === doc._id}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {documents.length === 0 ? 'No Pending Documents' : 'No Documents Found'}
          </h3>
          <p className="text-gray-500">
            {documents.length === 0
              ? 'All documents have been reviewed.'
              : 'No documents match your current filters.'}
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Reject Document</h3>
              
              <p className="text-sm text-gray-600 mb-4">
                Provide a reason for rejecting <strong>{selectedDocument?.originalName}</strong>
              </p>

              <form onSubmit={handleRejectSubmit} className="space-y-4">
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="Reason for rejection..."
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectModal(false);
                      setSelectedDocument(null);
                      setRejectionReason('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Rejecting...' : 'Reject Document'}
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

export default DocumentVerification;