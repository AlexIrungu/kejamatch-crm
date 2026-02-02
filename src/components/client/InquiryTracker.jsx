import { useEffect, useState } from 'react';
import { Mail, Phone, MessageSquare, Calendar, User, MapPin, Home, CheckCircle, Clock, XCircle } from 'lucide-react';
import clientService from '../../services/clientService';

const InquiryTracker = ({ clientId }) => {
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInquiry();
  }, [clientId]);

  const fetchInquiry = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await clientService.getMyInquiry();
      
      if (response.success) {
        setInquiry(response.data);
      } else {
        setError(response.message || 'No inquiry found');
      }
    } catch (err) {
      console.error('Error fetching inquiry:', err);
      setError(err.message || 'Failed to load inquiry');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      new: { label: 'New', color: 'blue', icon: Clock },
      contacted: { label: 'Contacted', color: 'purple', icon: Phone },
      qualified: { label: 'Qualified', color: 'indigo', icon: CheckCircle },
      viewing: { label: 'Viewing Scheduled', color: 'orange', icon: Calendar },
      won: { label: 'Successful', color: 'green', icon: CheckCircle },
      lost: { label: 'Closed', color: 'red', icon: XCircle },
    };
    return statusMap[status] || statusMap.new;
  };

  const getStatusSteps = () => {
    return ['new', 'contacted', 'qualified', 'viewing', 'won'];
  };

  const getCurrentStepIndex = () => {
    const steps = getStatusSteps();
    const currentIndex = steps.indexOf(inquiry?.status);
    return currentIndex >= 0 ? currentIndex : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No Inquiry Found
        </h3>
        <p className="text-gray-500">
          {error || "You don't have any active inquiries at the moment."}
        </p>
      </div>
    );
  }

  const statusInfo = getStatusInfo(inquiry.status);
  const StatusIcon = statusInfo.icon;
  const currentStep = getCurrentStepIndex();
  const steps = getStatusSteps();

  return (
    <div className="space-y-6">
      {/* Inquiry Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">My Inquiry</h3>
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
            <StatusIcon className="w-4 h-4 mr-2" />
            {statusInfo.label}
          </span>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{inquiry.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{inquiry.email}</p>
            </div>
          </div>

          {inquiry.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{inquiry.phone}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Submitted</p>
              <p className="font-medium text-gray-900">
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        {inquiry.message && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Message:</p>
            <p className="text-gray-600">{inquiry.message}</p>
          </div>
        )}
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Progress Timeline</h3>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-0 top-0 h-full w-1 bg-gray-200"></div>
          <div 
            className="absolute left-0 top-0 w-1 bg-secondary transition-all duration-500"
            style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>

          {/* Steps */}
          <div className="space-y-8 relative">
            {steps.map((step, index) => {
              const stepInfo = getStatusInfo(step);
              const StepIcon = stepInfo.icon;
              const isComplete = index <= currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={step} className="flex items-start gap-4">
                  <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isComplete ? 'bg-secondary' : 'bg-gray-300'
                  } ${isCurrent ? 'ring-4 ring-secondary ring-opacity-30' : ''}`}>
                    <StepIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className={`font-semibold ${isComplete ? 'text-gray-900' : 'text-gray-500'}`}>
                      {stepInfo.label}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {step === 'new' && 'Your inquiry has been received'}
                      {step === 'contacted' && 'Our team has reached out to you'}
                      {step === 'qualified' && 'Your requirements have been assessed'}
                      {step === 'viewing' && 'Property viewing arranged'}
                      {step === 'won' && 'Successfully matched with a property'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interested Properties */}
      {inquiry.interestedProperties && inquiry.interestedProperties.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties of Interest</h3>
          <div className="space-y-3">
            {inquiry.interestedProperties.map((property, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Home className="w-5 h-5 text-secondary" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{property.title || property.name}</p>
                  {property.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="w-3 h-3" />
                      {property.location}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assigned Agent */}
      {inquiry.assignedAgent && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Agent</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
              {inquiry.assignedAgent.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{inquiry.assignedAgent.name}</p>
              <p className="text-sm text-gray-600">{inquiry.assignedAgent.email}</p>
            </div>
            {inquiry.assignedAgent.phone && (
              <a
                href={`tel:${inquiry.assignedAgent.phone}`}
                className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </a>
            )}
          </div>
        </div>
      )}

      {/* Activity History */}
      {inquiry.activities && inquiry.activities.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity History</h3>
          <div className="space-y-3">
            {inquiry.activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-secondary mt-2"></div>
                <div className="flex-1">
                  <p className="text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
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

export default InquiryTracker;