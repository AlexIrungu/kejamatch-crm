import { useEffect, useState } from 'react';
import { FileText, Download, Trash2, Filter, Search, AlertCircle, FileCheck, FileClock, FileX } from 'lucide-react';
import clientService from '../../services/clientService';
import TwoFactorModal from './TwoFactorModal';

const DocumentList = ({ clientId }) => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, [clientId]);

  useEffect(() => {
    applyFilters();
  }, [documents, searchQuery, categoryFilter, statusFilter]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await clientService.getMyDocuments();
      
      if (response.success) {
        setDocuments(response.data || []);
      } else {
        setError(response.message || 'Failed to load documents');
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...documents];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.originalName?.toLowerCase().includes(query) ||
          doc.category?.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter((doc) => doc.category === categoryFilter);
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((doc) => doc.status === statusFilter);
    }

    setFilteredDocuments(filtered);
  };

  const handleDownload = async (documentId, requiresTwoFactor) => {
    if (requiresTwoFactor) {
      setSelectedDocumentId(documentId);
      setShowTwoFactorModal(true);
      return;
    }

    try {
      const blob = await clientService.downloadDocument(documentId);
      const document = documents.find((d) => d._id === documentId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = document?.originalName || 'document';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert(err.message || 'Failed to download document');
    }
  };

  const handleTwoFactorVerified = async () => {
    if (selectedDocumentId) {
      await handleDownload(selectedDocumentId, false);
      setShowTwoFactorModal(false);
      setSelectedDocumentId(null);
    }
  };

  const handleDelete = async (documentId) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(documentId);
      const response = await clientService.deleteDocument(documentId);
      
      if (response.success) {
        setDocuments((prev) => prev.filter((d) => d._id !== documentId));
      } else {
        alert(response.message || 'Failed to delete document');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Failed to delete document');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FileCheck className="w-3 h-3 mr-1" />
            Verified
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FileX className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FileClock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
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

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
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

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(searchQuery || categoryFilter || statusFilter) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('');
              setStatusFilter('');
            }}
            className="mt-3 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <>
          <p className="text-sm text-gray-600">
            Showing {filteredDocuments.length} of {documents.length} documents
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div key={doc._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <FileText className="w-10 h-10 text-secondary" />
                  {getStatusBadge(doc.status)}
                </div>

                <h4 className="font-semibold text-gray-900 mb-2 truncate" title={doc.originalName}>
                  {doc.originalName}
                </h4>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-gray-900">{getCategoryLabel(doc.category)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium text-gray-900">{formatFileSize(doc.fileSize)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Uploaded:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {doc.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{doc.description}</p>
                )}

                {doc.rejectionReason && doc.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-xs font-medium text-red-800 mb-1">Rejection Reason:</p>
                    <p className="text-xs text-red-600">{doc.rejectionReason}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(doc._id, doc.requiresTwoFactor)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    disabled={deleteLoading === doc._id}
                    className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                  >
                    {deleteLoading === doc._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {documents.length === 0 ? 'No Documents Yet' : 'No Documents Found'}
          </h3>
          <p className="text-gray-500">
            {documents.length === 0
              ? 'Upload your first document to get started.'
              : 'No documents match your current filters.'}
          </p>
        </div>
      )}

      {/* Two-Factor Modal */}
      <TwoFactorModal
        isOpen={showTwoFactorModal}
        onClose={() => {
          setShowTwoFactorModal(false);
          setSelectedDocumentId(null);
        }}
        onVerify={handleTwoFactorVerified}
        clientId={clientId}
      />
    </div>
  );
};

export default DocumentList;