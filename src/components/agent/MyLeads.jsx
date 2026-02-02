import { useState } from 'react';
import { Mail, Phone, Calendar, MapPin, Home, Eye } from 'lucide-react';
import StatusBadge from '../admin/StatusBadge';

const MyLeads = ({ leads, onStatusChange, onAddNotes, onViewDetails, loading }) => {
  const [filter, setFilter] = useState('all');

  const filteredLeads = leads.filter((lead) => {
    if (filter === 'all') return true;
    return lead.status === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'new', label: 'New' },
          { key: 'contacted', label: 'Contacted' },
          { key: 'qualified', label: 'Qualified' },
          { key: 'viewing', label: 'Viewing' },
          { key: 'negotiating', label: 'Negotiating' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === tab.key
                ? 'bg-secondary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label} ({tab.key === 'all' ? leads.length : leads.filter((l) => l.status === tab.key).length})
          </button>
        ))}
      </div>

      {/* Leads Grid */}
      {filteredLeads.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500 text-lg">No leads found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{lead.name}</h3>
                </div>
                <StatusBadge status={lead.status} />
              </div>

              {/* Lead Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <a href={`mailto:${lead.email}`} className="hover:text-secondary truncate">{lead.email}</a>
                </div>

                {(lead.phoneNumber || lead.phone) && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <a href={`tel:${lead.phoneNumber || lead.phone}`} className="hover:text-secondary">
                      {lead.phoneNumber || lead.phone}
                    </a>
                  </div>
                )}

                {lead.propertyName && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Home className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{lead.propertyName}</span>
                  </div>
                )}

                {lead.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{lead.location}</span>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{formatDate(lead.createdAt)}</span>
                </div>
              </div>

              {/* Message Preview */}
              {lead.message && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{lead.message}</p>
                </div>
              )}

              {/* Activity Count */}
              {lead.activities && lead.activities.length > 0 && (
                <div className="mb-4 text-xs text-gray-500">
                  {lead.activities.length} activities logged
                </div>
              )}

              {/* Actions */}
              <button
                onClick={() => onViewDetails ? onViewDetails(lead) : onStatusChange(lead)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLeads;