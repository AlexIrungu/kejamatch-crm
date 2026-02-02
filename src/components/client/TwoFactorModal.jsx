import { useState, useEffect, useRef } from 'react';
import { X, Shield, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import clientService from '../../services/clientService';

const TwoFactorModal = ({ isOpen, onClose, onVerify, clientId }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [codeSent, setCodeSent] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Request code when modal opens
      handleRequestCode();
      // Focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // Reset state when modal closes
      setCode('');
      setError('');
      setTimeLeft(300);
      setCodeSent(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const handleRequestCode = async () => {
    try {
      setRequesting(true);
      setError('');
      const response = await clientService.request2FACode();
      
      if (response.success) {
        setCodeSent(true);
        setTimeLeft(300); // Reset timer
      } else {
        setError(response.message || 'Failed to send verification code');
      }
    } catch (err) {
      console.error('Request code error:', err);
      setError(err.message || 'Failed to send verification code');
    } finally {
      setRequesting(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await clientService.verify2FACode(code);
      
      if (response.success) {
        onVerify();
      } else {
        setError(response.message || 'Invalid verification code');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative inline-block w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary bg-opacity-10 rounded-lg">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Two-Factor Authentication
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Info Message */}
            {codeSent && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">
                    Verification Code Sent
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    We've sent a 6-digit code to your registered email address.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 6-Digit Code
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={handleCodeChange}
                  maxLength={6}
                  placeholder="000000"
                  className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  disabled={loading || requesting}
                />
              </div>

              {/* Timer */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {timeLeft > 0 ? (
                    <>Code expires in <span className="font-medium text-secondary">{formatTime(timeLeft)}</span></>
                  ) : (
                    <span className="text-red-600 font-medium">Code expired</span>
                  )}
                </span>
                {timeLeft <= 0 && (
                  <button
                    type="button"
                    onClick={handleRequestCode}
                    disabled={requesting}
                    className="flex items-center text-secondary hover:text-primary transition-colors font-medium disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 mr-1 ${requesting ? 'animate-spin' : ''}`} />
                    Request New Code
                  </button>
                )}
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
                  disabled={loading || code.length !== 6 || timeLeft <= 0}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    'Verify'
                  )}
                </button>
              </div>
            </form>

            {/* Resend Option */}
            {timeLeft > 0 && codeSent && (
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleRequestCode}
                    disabled={requesting}
                    className="text-secondary hover:text-primary transition-colors font-medium disabled:opacity-50"
                  >
                    {requesting ? 'Sending...' : 'Resend'}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorModal;