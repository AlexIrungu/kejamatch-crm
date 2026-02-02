import { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import adminService from '../../services/adminService';

const LeadStatusModal = ({ lead, isOpen, onClose, onSuccess }) => {
  const [status, setStatus] = useState(lead?.status || 'new');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !lead) return null;

  const statuses = [
    { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'qualified', label: 'Qualified', color: 'bg-purple-100 text-purple-800' },
    { value: 'viewing', label: 'Viewing Scheduled', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'negotiating', label: 'Negotiating', color: 'bg-orange-100 text-orange-800' },
    { value: 'won', label: 'Won / Converted', color: 'bg-green-100 text-green-800' },
    { value: 'lost', label: 'Lost', color: 'bg-red-100 text-red-800' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminService.updateLeadStatus(lead.id, status, notes);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Update Lead Status</h2>
            <p className="text-sm text-gray-500 mt-1">{lead.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Status Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select New Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    status === s.value
                      ? 'border-secondary bg-secondary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${s.color}`}>
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
              placeholder="Add notes about this status change..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Update Status
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadStatusModal;