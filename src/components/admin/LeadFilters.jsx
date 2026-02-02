import { Search, Filter } from 'lucide-react';

const LeadFilters = ({ filters, setFilters, onReset }) => {
  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-secondary hover:text-primary transition-colors"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={filters.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="contact">Contact Form</option>
            <option value="booking">Booking Request</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            placeholder="Start Date"
          />
        </div>
      </div>
    </div>
  );
};

export default LeadFilters;