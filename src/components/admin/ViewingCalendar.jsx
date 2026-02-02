import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  User, 
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import viewingService from '../../services/viewingService';

const ViewingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewings, setViewings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedViewing, setSelectedViewing] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'list'
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchViewings();
    fetchStats();
  }, [currentDate, viewMode]);

  const fetchViewings = async () => {
    try {
      setLoading(true);
      
      // Calculate date range based on view mode
      let startDate, endDate;
      
      if (viewMode === 'month') {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      } else if (viewMode === 'week') {
        const dayOfWeek = currentDate.getDay();
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - dayOfWeek);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
      } else {
        // List view - show next 30 days
        startDate = new Date();
        endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
      }

      const response = await viewingService.getAllViewings({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      });

      if (response.success) {
        setViewings(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching viewings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await viewingService.getViewingStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCompleteViewing = async (viewing) => {
    const outcome = prompt('Enter viewing outcome (e.g., "Interested", "Not interested", "Needs follow-up"):');
    if (!outcome) return;

    const notes = prompt('Any additional notes?') || '';

    try {
      const response = await viewingService.completeViewing(
        viewing.leadId,
        viewing.viewingId,
        { outcome, notes }
      );

      if (response.success) {
        fetchViewings();
        fetchStats();
        setSelectedViewing(null);
        alert('Viewing marked as completed!');
      }
    } catch (error) {
      alert('Failed to complete viewing: ' + (error.message || 'Unknown error'));
    }
  };

  const handleCancelViewing = async (viewing) => {
    const reason = prompt('Reason for cancellation:');
    if (reason === null) return;

    try {
      const response = await viewingService.cancelViewing(
        viewing.leadId,
        viewing.viewingId,
        reason
      );

      if (response.success) {
        fetchViewings();
        fetchStats();
        setSelectedViewing(null);
        alert('Viewing cancelled');
      }
    } catch (error) {
      alert('Failed to cancel viewing: ' + (error.message || 'Unknown error'));
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const getViewingsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return viewings.filter(v => v.scheduledDate === dateStr);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusIcons = {
    scheduled: Clock,
    completed: CheckCircle,
    cancelled: XCircle
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Total Viewings</p>
            <p className="text-2xl font-bold text-primary">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Scheduled</p>
            <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">This Week</p>
            <p className="text-2xl font-bold text-secondary">{stats.upcomingThisWeek}</p>
          </div>
        </div>
      )}

      {/* Calendar Header */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-bold text-primary min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Today
            </button>
            <button
              onClick={fetchViewings}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              {['month', 'week', 'list'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-2 text-sm capitalize ${
                    viewMode === mode
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
          </div>
        ) : viewMode === 'list' ? (
          /* List View */
          <div className="space-y-3">
            {viewings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No viewings scheduled</p>
              </div>
            ) : (
              viewings.map((viewing, idx) => (
                <ViewingCard
                  key={idx}
                  viewing={viewing}
                  onComplete={() => handleCompleteViewing(viewing)}
                  onCancel={() => handleCancelViewing(viewing)}
                  onClick={() => setSelectedViewing(viewing)}
                />
              ))
            )}
          </div>
        ) : (
          /* Calendar Grid */
          <div>
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the 1st */}
              {[...Array(startingDay)].map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[100px] bg-gray-50 rounded-lg"></div>
              ))}

              {/* Days of the month */}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dayViewings = getViewingsForDate(date);
                const isToday = new Date().toDateString() === date.toDateString();

                return (
                  <div
                    key={day}
                    className={`min-h-[100px] border rounded-lg p-1 ${
                      isToday ? 'border-secondary bg-orange-50' : 'border-gray-200'
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-secondary' : 'text-gray-700'}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayViewings.slice(0, 3).map((viewing, idx) => {
                        const StatusIcon = statusIcons[viewing.status];
                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedViewing(viewing)}
                            className={`text-xs p-1 rounded cursor-pointer truncate border ${statusColors[viewing.status]}`}
                            title={`${viewing.scheduledTime} - ${viewing.propertyName}`}
                          >
                            <StatusIcon size={10} className="inline mr-1" />
                            {viewing.scheduledTime}
                          </div>
                        );
                      })}
                      {dayViewings.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayViewings.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Viewing Detail Modal */}
      {selectedViewing && (
        <ViewingDetailModal
          viewing={selectedViewing}
          onClose={() => setSelectedViewing(null)}
          onComplete={() => handleCompleteViewing(selectedViewing)}
          onCancel={() => handleCancelViewing(selectedViewing)}
        />
      )}
    </div>
  );
};

// Viewing Card Component for List View
const ViewingCard = ({ viewing, onComplete, onCancel, onClick }) => {
  const statusColors = {
    scheduled: 'border-l-blue-500 bg-blue-50',
    completed: 'border-l-green-500 bg-green-50',
    cancelled: 'border-l-red-500 bg-red-50'
  };

  return (
    <div
      className={`border-l-4 rounded-r-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${statusColors[viewing.status]}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-gray-500" />
            <span className="font-medium">{viewing.scheduledDate}</span>
            <Clock size={16} className="text-gray-500 ml-2" />
            <span>{viewing.scheduledTime}</span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs capitalize ${
              viewing.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
              viewing.status === 'completed' ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }`}>
              {viewing.status}
            </span>
          </div>
          <h4 className="font-semibold text-gray-900">{viewing.propertyName || 'Property'}</h4>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span className="flex items-center">
              <User size={14} className="mr-1" />
              {viewing.leadName}
            </span>
            {viewing.leadPhone && (
              <span className="flex items-center">
                <Phone size={14} className="mr-1" />
                {viewing.leadPhone}
              </span>
            )}
          </div>
        </div>

        {viewing.status === 'scheduled' && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onComplete}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Complete
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Viewing Detail Modal
const ViewingDetailModal = ({ viewing, onClose, onComplete, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-primary">Viewing Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Property</p>
            <p className="font-semibold text-lg">{viewing.propertyName || 'N/A'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <Calendar size={14} className="mr-1" /> Date
              </p>
              <p className="font-medium">{viewing.scheduledDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <Clock size={14} className="mr-1" /> Time
              </p>
              <p className="font-medium">{viewing.scheduledTime}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">Lead Information</p>
            <div className="space-y-2">
              <p className="flex items-center">
                <User size={16} className="mr-2 text-gray-400" />
                {viewing.leadName}
              </p>
              {viewing.leadEmail && (
                <p className="flex items-center">
                  <Mail size={16} className="mr-2 text-gray-400" />
                  {viewing.leadEmail}
                </p>
              )}
              {viewing.leadPhone && (
                <p className="flex items-center">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  {viewing.leadPhone}
                </p>
              )}
            </div>
          </div>

          {viewing.notes && (
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-gray-700">{viewing.notes}</p>
            </div>
          )}

          {viewing.outcome && (
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500">Outcome</p>
              <p className="text-gray-700">{viewing.outcome}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            {viewing.status === 'scheduled' ? (
              <>
                <button
                  onClick={onComplete}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle size={16} className="inline mr-1" />
                  Complete
                </button>
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <XCircle size={16} className="inline mr-1" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewingCalendar;