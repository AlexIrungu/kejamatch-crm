import { useState } from 'react';
import { X, MessageSquare, AlertCircle } from 'lucide-react';
import adminService from '../../services/adminService';

const LeadNotesModal = ({ lead, isOpen, onClose, onSuccess }) => {
  const [notes, setNotes] = useState(lead?.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !lead) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminService.updateLeadStatus(lead.id, lead.status, notes);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save notes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Lead Notes</h2>
            <p className="text-sm text-gray-500 mt-1">{lead.name} - {lead.email}</p>
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

          {/* Lead Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Lead Message</h3>
            <p className="text-sm text-gray-600">
              {lead.message || 'No message provided'}
            </p>
            {lead.subject && (
              <p className="text-xs text-gray-500 mt-2">
                Subject: {lead.subject}
              </p>
            )}
          </div>

          {/* Notes Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
              placeholder="Add your notes about this lead...

Example:
- Called on 02/01, left voicemail
- Interested in 2BR apartments
- Budget: 50k-80k per month
- Preferred areas: Westlands, Kilimani"
            />
            <p className="text-xs text-gray-500 mt-2">
              Keep track of your interactions and important details about this lead.
            </p>
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
                  Saving...
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Save Notes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadNotesModal;