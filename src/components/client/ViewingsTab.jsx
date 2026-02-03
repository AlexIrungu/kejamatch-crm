import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import clientService from '../../services/clientService';

const statusConfig = {
  scheduled: { label: 'Scheduled', badgeClass: 'bg-blue-100 text-blue-800', icon: Clock },
  completed: { label: 'Completed', badgeClass: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', badgeClass: 'bg-red-100 text-red-800', icon: XCircle },
  rescheduled: { label: 'Rescheduled', badgeClass: 'bg-yellow-100 text-yellow-800', icon: Clock },
};

const ViewingsTab = () => {
  const [viewings, setViewings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchViewings();
  }, []);

  const fetchViewings = async () => {
    try {
      const res = await clientService.getMyViewings();
      setViewings(res.data || []);
    } catch (err) {
      console.error('Failed to load viewings:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'all'
    ? viewings
    : viewings.filter((v) => v.status === filter);

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (viewings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Viewings Yet</h3>
        <p className="text-gray-500">
          When your agent schedules property viewings, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-secondary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No {filter} viewings found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((viewing, idx) => {
            const config = statusConfig[viewing.status] || statusConfig.scheduled;
            const StatusIcon = config.icon;
            const date = viewing.scheduledDate
              ? new Date(viewing.scheduledDate).toLocaleDateString('en-KE', {
                  weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                })
              : 'TBD';

            return (
              <div key={viewing._id || idx} className="bg-white rounded-lg shadow-md p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {viewing.propertyName || 'Property Viewing'}
                    </h4>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {date}
                      </span>
                      {viewing.scheduledTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {viewing.scheduledTime}
                        </span>
                      )}
                      {viewing.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {viewing.location}
                        </span>
                      )}
                    </div>
                    {viewing.outcome && (
                      <p className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Outcome:</span> {viewing.outcome}
                      </p>
                    )}
                    {viewing.notes && (
                      <p className="mt-1 text-sm text-gray-500">{viewing.notes}</p>
                    )}
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.badgeClass}`}>
                    <StatusIcon className="w-3 h-3" />
                    {config.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewingsTab;
