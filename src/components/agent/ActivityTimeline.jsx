import { useState, useEffect } from 'react';
import { Activity, Phone, Mail, FileText, Calendar, MessageCircle, Loader2 } from 'lucide-react';
import agentService from '../../services/agentService';

const activityIcons = {
  call: Phone,
  email: Mail,
  note: FileText,
  viewing: Calendar,
  status_change: Activity,
  message: MessageCircle,
};

const activityColors = {
  call: 'bg-blue-100 text-blue-600',
  email: 'bg-purple-100 text-purple-600',
  note: 'bg-gray-100 text-gray-600',
  viewing: 'bg-green-100 text-green-600',
  status_change: 'bg-yellow-100 text-yellow-600',
  message: 'bg-pink-100 text-pink-600',
};

const ActivityTimeline = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await agentService.getActivityTimeline(15);
      setActivities(res.data || []);
    } catch (err) {
      console.error('Failed to load activities:', err);
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

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-primary" />
          Recent Activity
        </h3>
        <div className="text-center py-8 text-gray-500">
          <p>No recent activity to show.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-primary" />
        Recent Activity
      </h3>

      <div className="relative max-h-96 overflow-y-auto">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-4">
          {activities.map((activity, idx) => {
            const Icon = activityIcons[activity.type] || Activity;
            const colorClass = activityColors[activity.type] || 'bg-gray-100 text-gray-600';

            return (
              <div key={activity._id || idx} className="relative flex gap-4 pl-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description || activity.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.leadName} • {activity.performedByName || 'System'}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(activity.timestamp).toLocaleDateString('en-KE', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {activity.notes && (
                    <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {activity.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;
