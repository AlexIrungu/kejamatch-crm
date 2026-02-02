import { useState } from 'react';
import { X, Download, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

const DataExportModal = ({ isOpen, onClose, onRequest, type = 'export' }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!confirmed || (type === 'delete' && !understood)) {
      return;
    }

    try {
      setLoading(true);
      await onRequest();
      handleClose();
    } catch (error) {
      console.error('Request error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmed(false);
    setUnderstood(false);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  const isExport = type === 'export';
  const Icon = isExport ? Download : Trash2;
  const title = isExport ? 'Request Data Export' : 'Delete My Account';
  const buttonText = isExport ? 'Request Export' : 'Delete Account';
  const buttonClass = isExport ? 'bg-primary hover:bg-opacity-90' : 'bg-red-600 hover:bg-red-700';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative inline-block w-full max-w-lg p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${isExport ? 'bg-blue-100' : 'bg-red-100'} rounded-lg`}>
                <Icon className={`w-6 h-6 ${isExport ? 'text-primary' : 'text-red-600'}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Warning */}
            <div className={`${isExport ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
              <div className="flex items-start">
                <AlertTriangle className={`w-5 h-5 ${isExport ? 'text-blue-600' : 'text-red-600'} mr-2 flex-shrink-0 mt-0.5`} />
                <div>
                  <p className={`text-sm ${isExport ? 'text-blue-800' : 'text-red-800'} font-medium mb-2`}>
                    {isExport ? 'Data Export Information' : 'Important Warning'}
                  </p>
                  <div className={`text-sm ${isExport ? 'text-blue-700' : 'text-red-700'} space-y-2`}>
                    {isExport ? (
                      <>
                        <p>Your data export will include:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Personal information and profile details</li>
                          <li>Property preferences and inquiries</li>
                          <li>Document metadata (not the files themselves)</li>
                          <li>Activity history and communications</li>
                        </ul>
                        <p className="mt-3">
                          You will receive an email with a download link within 24-48 hours.
                          The link will be valid for 7 days.
                        </p>
                      </>
                    ) : (
                      <>
                        <p>Deleting your account will:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Permanently remove all your personal data</li>
                          <li>Delete all uploaded documents</li>
                          <li>Remove your property preferences and inquiries</li>
                          <li>Cancel any pending viewings or appointments</li>
                        </ul>
                        <p className="mt-3 font-semibold">
                          You will have 30 days to cancel this request before permanent deletion.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="confirmed"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded mt-1"
                />
                <label htmlFor="confirmed" className="ml-2 block text-sm text-gray-700">
                  {isExport ? (
                    <>
                      I understand that this export will contain my personal data and should be
                      handled securely.
                    </>
                  ) : (
                    <>
                      I understand that this action will permanently delete my account and all
                      associated data after the 30-day cancellation period.
                    </>
                  )}
                </label>
              </div>

              {!isExport && (
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="understood"
                    checked={understood}
                    onChange={(e) => setUnderstood(e.target.checked)}
                    className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="understood" className="ml-2 block text-sm text-gray-700">
                    I confirm that I want to delete my account and understand this cannot be
                    undone after 30 days.
                  </label>
                </div>
              )}
            </div>

            {/* GDPR Notice */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600">
                <strong>GDPR Compliance:</strong> This request is processed in accordance with the
                General Data Protection Regulation (GDPR) and your rights as a data subject.
                {!isExport && ' You have the right to cancel this deletion request within 30 days by contacting our support team.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !confirmed || (!isExport && !understood)}
                className={`flex-1 flex items-center justify-center px-4 py-3 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${buttonClass}`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Icon className="w-5 h-5 mr-2" />
                    {buttonText}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              {isExport ? (
                <>
                  Need help? Contact our support team at{' '}
                  <a href="mailto:support@kejamatch.com" className="text-secondary hover:underline">
                    support@kejamatch.com
                  </a>
                </>
              ) : (
                <>
                  Changed your mind? You can cancel this request within 30 days by emailing{' '}
                  <a href="mailto:support@kejamatch.com" className="text-secondary hover:underline">
                    support@kejamatch.com
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExportModal;