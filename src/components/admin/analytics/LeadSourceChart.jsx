import { Globe, Mail, Phone, Users, Share2, MessageSquare } from 'lucide-react';

const LeadSourceChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.sources || data.sources.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Lead Sources</h3>
        <p className="text-gray-500 text-center py-8">No lead source data available</p>
      </div>
    );
  }

  const { sources, totalLeads } = data;

  // Icon mapping for different sources
  const getSourceIcon = (source) => {
    const lowerSource = source.toLowerCase();
    if (lowerSource.includes('website') || lowerSource.includes('contact')) return Globe;
    if (lowerSource.includes('email')) return Mail;
    if (lowerSource.includes('phone') || lowerSource.includes('call')) return Phone;
    if (lowerSource.includes('referral')) return Users;
    if (lowerSource.includes('social')) return Share2;
    if (lowerSource.includes('chat')) return MessageSquare;
    return Globe;
  };

  // Color palette for sources
  const colors = [
    { bg: 'bg-blue-100', text: 'text-blue-600', bar: 'bg-blue-500' },
    { bg: 'bg-purple-100', text: 'text-purple-600', bar: 'bg-purple-500' },
    { bg: 'bg-green-100', text: 'text-green-600', bar: 'bg-green-500' },
    { bg: 'bg-orange-100', text: 'text-orange-600', bar: 'bg-orange-500' },
    { bg: 'bg-pink-100', text: 'text-pink-600', bar: 'bg-pink-500' },
    { bg: 'bg-indigo-100', text: 'text-indigo-600', bar: 'bg-indigo-500' },
    { bg: 'bg-yellow-100', text: 'text-yellow-600', bar: 'bg-yellow-500' },
    { bg: 'bg-red-100', text: 'text-red-600', bar: 'bg-red-500' },
  ];

  // Sort sources by count
  const sortedSources = [...sources].sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Lead Sources</h3>
          <p className="text-sm text-gray-500 mt-1">
            Where your {totalLeads} leads are coming from
          </p>
        </div>
      </div>

      {/* Sources List */}
      <div className="space-y-4">
        {sortedSources.map((source, index) => {
          const color = colors[index % colors.length];
          const Icon = getSourceIcon(source.source);

          return (
            <div key={source.source} className="group hover:bg-gray-50 p-3 rounded-lg transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`${color.bg} p-2 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${color.text}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {source.source.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {source.count} leads ({source.percentage}%)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {source.conversionRate}% conv.
                    </p>
                    <p className="text-xs text-gray-500">{source.won} won</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`${color.bar} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${source.percentage}%` }}
                ></div>
              </div>

              {/* Detailed Stats (shown on hover) */}
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <div>
                  <span className="text-gray-500">Qualified:</span>{' '}
                  <span className="font-medium">{source.qualified}</span>
                </div>
                <div>
                  <span className="text-gray-500">Won:</span>{' '}
                  <span className="font-medium text-green-600">{source.won}</span>
                </div>
                <div>
                  <span className="text-gray-500">Lost:</span>{' '}
                  <span className="font-medium text-red-600">{source.lost}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Performer Badge */}
      {sortedSources.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 text-white p-2 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Top Performing Source: {sortedSources[0].source.replace(/_/g, ' ')}
              </p>
              <p className="text-xs text-gray-600">
                {sortedSources[0].conversionRate}% conversion rate with {sortedSources[0].count}{' '}
                leads
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadSourceChart;