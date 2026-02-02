import { useState } from 'react';
import { Mail, Phone, Calendar, User, Eye, Edit } from 'lucide-react';
import StatusBadge from './StatusBadge';

const LeadsList = ({ leads, onStatusChange, onAssign, onViewDetails, loading }) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">No leads found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('name')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Name
              </th>
              <th
                onClick={() => handleSort('email')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Contact
              </th>
              <th
                onClick={() => handleSort('type')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Type
              </th>
              <th
                onClick={() => handleSort('status')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Status
              </th>
              <th
                onClick={() => handleSort('createdAt')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                  {lead.propertyName && (
                    <div className="text-sm text-gray-500">{lead.propertyName}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-3 h-3 mr-1" />
                      {lead.email}
                    </div>
                    {lead.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-3 h-3 mr-1" />
                        {lead.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {lead.type === 'contact' ? 'Contact' : 'Booking'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(lead.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.assignedToName ? (
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-3 h-3 mr-1" />
                      {lead.assignedToName}
                    </div>
                  ) : (
                    <button
                      onClick={() => onAssign(lead)}
                      className="text-sm text-secondary hover:text-primary transition-colors"
                    >
                      Assign
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onViewDetails(lead)}
                      className="text-primary hover:text-secondary transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onStatusChange(lead)}
                      className="text-gray-600 hover:text-secondary transition-colors"
                      title="Update Status"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsList;