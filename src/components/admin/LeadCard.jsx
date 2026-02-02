import { Mail, Phone, Calendar, User, MapPin, Home } from 'lucide-react';
import StatusBadge from './StatusBadge';

const LeadCard = ({ lead, onStatusChange, onAssign, onViewDetails }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{lead.name}</h3>
          <p className="text-sm text-gray-500">{lead.id}</p>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      {/* Lead Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2 text-gray-400" />
          <a href={`mailto:${lead.email}`} className="hover:text-secondary">
            {lead.email}
          </a>
        </div>

        {lead.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            <a href={`tel:${lead.phone}`} className="hover:text-secondary">
              {lead.phone}
            </a>
          </div>
        )}

        {lead.propertyName && (
          <div className="flex items-center text-sm text-gray-600">
            <Home className="w-4 h-4 mr-2 text-gray-400" />
            <span>{lead.propertyName}</span>
          </div>
        )}

        {lead.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{lead.location}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>{formatDate(lead.createdAt)}</span>
        </div>

        {lead.assignedToName && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            <span>Assigned to: {lead.assignedToName}</span>
          </div>
        )}
      </div>

      {/* Message Preview */}
      {lead.message && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">{lead.message}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onViewDetails(lead)}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
        >
          View Details
        </button>
        <button
          onClick={() => onStatusChange(lead)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Update Status
        </button>
      </div>
    </div>
  );
};

export default LeadCard;