import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import authService from '../services/authService';
import SEO from '../components/common/SEO';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const userRole = location.state?.role || 'agent';
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const inputRefs = useRef([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (value && index === 5 && newCode.every(digit => digit !== '')) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);

    // Focus last filled input or submit
    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();

    if (pastedData.length === 6) {
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (codeString = code.join('')) => {
    if (codeString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.verifyEmail(email, codeString);
      setSuccess('Email verified successfully!');
      
      // Update local storage user data
      const user = authService.getUser();
      if (user) {
        user.isVerified = true;
        localStorage.setItem('user', JSON.stringify(user));
      }

      // Redirect to appropriate dashboard after short delay
      setTimeout(() => {
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/agent/dashboard');
        }
      }, 1500);
    } catch (err) {
      setError(err.message || 'Invalid verification code');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setResending(true);
    setError('');

    try {
      await authService.resendVerificationCode(email);
      setSuccess('New verification code sent!');
      setCountdown(60); // 60 second cooldown
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <SEO
        title="Verify Email - Kejamatch"
        description="Verify your email to complete registration"
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-dark py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-block">
              <h1 className="text-4xl font-bold text-white mb-2">Kejamatch</h1>
            </Link>
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="text-2xl font-semibold text-white">
              Verify Your Email
            </h2>
            <p className="mt-2 text-gray-300">
              We've sent a 6-digit code to
            </p>
            <p className="text-secondary font-medium">{email}</p>
          </div>

          {/* Verification Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Code Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 text-center mb-4">
                Enter verification code
              </label>
              <div className="flex justify-center gap-2 sm:gap-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={() => handleSubmit()}
              disabled={loading || code.some(d => d === '')}
              className="w-full flex items-center justify-center px-4 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Verify Email
                </>
              )}
            </button>

            {/* Resend Code */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResend}
                disabled={resending || countdown > 0}
                className="inline-flex items-center text-secondary hover:text-primary font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  `Resend code in ${countdown}s`
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Resend Code
                  </>
                )}
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Check your spam folder if you don't see the email.
                The code expires in 10 minutes.
              </p>
            </div>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;