import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Loader2 } from 'lucide-react';
import agentService from '../../services/agentService';

const ViewingScheduleWidget = () => {
  const [viewings, setViewings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchViewings();
  }, []);

  const fetchViewings = async () => {
    try {
      const res = await agentService.getUpcomingViewings();
      setViewings(res.data || []);
    } catch (err) {
      console.error('Failed to load viewings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (viewings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-green-500" />
          Upcoming Viewings
        </h3>
        <div className="text-center py-8 text-gray-500">
          <p>No upcoming viewings scheduled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-green-500" />
        Upcoming Viewings
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
          {viewings.length}
        </span>
      </h3>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {viewings.map((viewing, idx) => {
          const viewingDate = new Date(viewing.scheduledDate);
          const isToday = viewingDate.toDateString() === new Date().toDateString();
          const isTomorrow = viewingDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

          return (
            <div
              key={viewing._id || idx}
              className={`p-4 rounded-lg border ${
                isToday ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {viewing.propertyName || 'Property Viewing'}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                    <User className="w-3 h-3" />
                    {viewing.leadName}
                    {viewing.leadPhone && ` • ${viewing.leadPhone}`}
                  </div>
                </div>
                {isToday && (
                  <span className="px-2 py-1 text-xs font-semibold bg-green-500 text-white rounded">
                    Today
                  </span>
                )}
                {isTomorrow && (
                  <span className="px-2 py-1 text-xs font-semibold bg-blue-500 text-white rounded">
                    Tomorrow
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {viewingDate.toLocaleDateString('en-KE', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                {viewing.scheduledTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {viewing.scheduledTime}
                  </span>
                )}
              </div>
              {viewing.notes && (
                <p className="mt-2 text-sm text-gray-600 bg-white p-2 rounded border border-gray-100">
                  {viewing.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewingScheduleWidget;
