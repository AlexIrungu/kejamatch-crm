import { useState, useEffect } from 'react';
import {
  X, Mail, Phone, Calendar, MapPin, User, Clock, MessageSquare,
  PhoneCall, Send, Eye, Home, FileText, Plus, CheckCircle, ArrowRight
} from 'lucide-react';

const LeadDetailModal = ({ lead, isOpen, onClose, onUpdate, isAgent = false, apiService }) => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableProperties, setAvailableProperties] = useState([]);
  
  // Action modals
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showViewingModal, setShowViewingModal] = useState(false);
  
  // Form states
  const [noteText, setNoteText] = useState('');
  const [callData, setCallData] = useState({ outcome: '', duration: '', notes: '' });
  const [viewingData, setViewingData] = useState({ propertyName: '', scheduledDate: '', scheduledTime: '', notes: '' });
  
  // Fetch properties when modal opens
useEffect(() => {
  if (isOpen) {
    fetchAvailableProperties();
  }
}, [isOpen]);

const fetchAvailableProperties = async () => {
  try {
    const response = await propertyService.getAllProperties({ status: 'available' });
    setAvailableProperties(response.data || []);
  } catch (error) {
    console.error('Error fetching properties:', error);
  }
};
  
  useEffect(() => {
    if (lead && isOpen) {
      setActivities(lead.activities || []);
    }
  }, [lead, isOpen]);

  if (!isOpen || !lead) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getActivityIcon = (type) => {
    const icons = {
      lead_created: <FileText className="w-4 h-4" />,
      status_change: <ArrowRight className="w-4 h-4" />,
      note_added: <MessageSquare className="w-4 h-4" />,
      assigned: <User className="w-4 h-4" />,
      call_logged: <PhoneCall className="w-4 h-4" />,
      email_sent: <Send className="w-4 h-4" />,
      viewing_scheduled: <Eye className="w-4 h-4" />,
      viewing_completed: <CheckCircle className="w-4 h-4" />,
      property_interested: <Home className="w-4 h-4" />,
    };
    return icons[type] || <FileText className="w-4 h-4" />;
  };

  const getActivityColor = (type) => {
    const colors = {
      lead_created: 'bg-blue-100 text-blue-600',
      status_change: 'bg-purple-100 text-purple-600',
      note_added: 'bg-gray-100 text-gray-600',
      assigned: 'bg-indigo-100 text-indigo-600',
      call_logged: 'bg-green-100 text-green-600',
      email_sent: 'bg-cyan-100 text-cyan-600',
      viewing_scheduled: 'bg-orange-100 text-orange-600',
      viewing_completed: 'bg-emerald-100 text-emerald-600',
      property_interested: 'bg-pink-100 text-pink-600',
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-purple-100 text-purple-800',
      viewing: 'bg-orange-100 text-orange-800',
      negotiating: 'bg-indigo-100 text-indigo-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const handleAddNote = async () => {
    if (!noteText.trim() || !apiService) return;
    setLoading(true);
    try {
      const response = await apiService.addNote(lead.id, noteText.trim());
      if (response.success) {
        setActivities(response.data.activities || []);
        setNoteText('');
        setShowNoteModal(false);
        if (onUpdate) onUpdate(response.data);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
    setLoading(false);
  };

  const handleLogCall = async () => {
    if (!callData.outcome || !apiService) return;
    setLoading(true);
    try {
      const response = await apiService.logCall(lead.id, callData);
      if (response.success) {
        setActivities(response.data.activities || []);
        setCallData({ outcome: '', duration: '', notes: '' });
        setShowCallModal(false);
        if (onUpdate) onUpdate(response.data);
      }
    } catch (error) {
      console.error('Error logging call:', error);
    }
    setLoading(false);
  };

  const handleScheduleViewing = async () => {
    if (!viewingData.scheduledDate || !viewingData.scheduledTime || !apiService) return;
    setLoading(true);
    try {
      const response = await apiService.scheduleViewing(lead.id, viewingData);
      if (response.success) {
        setActivities(response.data.activities || []);
        setViewingData({ propertyName: '', scheduledDate: '', scheduledTime: '', notes: '' });
        setShowViewingModal(false);
        if (onUpdate) onUpdate(response.data);
      }
    } catch (error) {
      console.error('Error scheduling viewing:', error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white flex-shrink-0">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">{lead.name}</h2>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(lead.createdAt)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(lead.status)}`}>
                    {lead.status?.toUpperCase()}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Contact Info Bar */}
          <div className="bg-gray-50 px-6 py-3 border-b flex flex-wrap gap-4 flex-shrink-0">
            <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
              <Mail className="w-4 h-4" /> {lead.email}
            </a>
            {(lead.phoneNumber || lead.phone) && (
              <a href={`tel:${lead.phoneNumber || lead.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
                <Phone className="w-4 h-4" /> {lead.phoneNumber || lead.phone}
              </a>
            )}
            {lead.assignedToName && (
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" /> Assigned to: {lead.assignedToName}
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b px-6 flex-shrink-0">
            <div className="flex gap-6">
              {['timeline', 'details', 'viewings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-secondary text-secondary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div>
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setShowNoteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <MessageSquare className="w-4 h-4" /> Add Note
                  </button>
                  <button
                    onClick={() => setShowCallModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                  >
                    <PhoneCall className="w-4 h-4" /> Log Call
                  </button>
                  <button
                    onClick={() => setShowViewingModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" /> Schedule Viewing
                  </button>
                </div>

                {/* Activity Timeline */}
                <div className="relative">
                  {activities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No activities yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity, index) => (
                        <div key={activity.id || index} className="flex gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
                            <p className="text-gray-900">{activity.description}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span>{formatDateTime(activity.createdAt)}</span>
                              {activity.userName && (
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" /> {activity.userName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Subject</h3>
                  <p className="text-gray-600">{lead.subject || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Message</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{lead.message || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Source</h3>
                    <p className="text-gray-600">{lead.source?.replace(/_/g, ' ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Created</h3>
                    <p className="text-gray-600">{formatDate(lead.createdAt)}</p>
                  </div>
                </div>
                {lead.interestedProperties && lead.interestedProperties.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Interested Properties</h3>
                    <div className="space-y-2">
                      {lead.interestedProperties.map((prop, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-600">
                          <Home className="w-4 h-4 text-gray-400" />
                          {prop.propertyName || prop.propertyId}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Viewings Tab */}
            {activeTab === 'viewings' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Scheduled Viewings</h3>
                  <button
                    onClick={() => setShowViewingModal(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" /> Schedule
                  </button>
                </div>
                {!lead.viewings || lead.viewings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No viewings scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lead.viewings.map((viewing, idx) => (
                      <div key={viewing.id || idx} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{viewing.propertyName || 'Property Viewing'}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {viewing.scheduledDate} at {viewing.scheduledTime}
                            </p>
                            {viewing.notes && <p className="text-sm text-gray-500 mt-1">{viewing.notes}</p>}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            viewing.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {viewing.status}
                          </span>
                        </div>
                        {viewing.status === 'completed' && viewing.outcome && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm"><span className="font-medium">Outcome:</span> {viewing.outcome}</p>
                            {viewing.completedNotes && <p className="text-sm text-gray-600">{viewing.completedNotes}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Add Note</h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter your note..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
              rows={4}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => { setShowNoteModal(false); setNoteText(''); }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim() || loading}
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Log Call</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outcome *</label>
                <select
                  value={callData.outcome}
                  onChange={(e) => setCallData({ ...callData, outcome: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Select outcome</option>
                  <option value="Connected - Interested">Connected - Interested</option>
                  <option value="Connected - Not Interested">Connected - Not Interested</option>
                  <option value="Connected - Call Back">Connected - Call Back</option>
                  <option value="No Answer">No Answer</option>
                  <option value="Voicemail">Voicemail</option>
                  <option value="Wrong Number">Wrong Number</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={callData.duration}
                  onChange={(e) => setCallData({ ...callData, duration: e.target.value })}
                  placeholder="e.g., 5"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={callData.notes}
                  onChange={(e) => setCallData({ ...callData, notes: e.target.value })}
                  placeholder="Call notes..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => { setShowCallModal(false); setCallData({ outcome: '', duration: '', notes: '' }); }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleLogCall}
                disabled={!callData.outcome || loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Log Call'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Viewing Modal */}
      {showViewingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Schedule Viewing</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property *</label>
                <select
    value={viewingData.propertyId}
    onChange={(e) => {
      const property = availableProperties.find(p => p._id === e.target.value);
      setViewingData({
        ...viewingData,
        propertyId: e.target.value,
        propertyName: property ? property.title : ''
      });
    }}
    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
  >
    <option value="">Select a property</option>
    {availableProperties.map((property) => (
      <option key={property._id} value={property._id}>
        {property.title} - {property.location.city}
      </option>
    ))}
  </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={viewingData.scheduledDate}
                    onChange={(e) => setViewingData({ ...viewingData, scheduledDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input
                    type="time"
                    value={viewingData.scheduledTime}
                    onChange={(e) => setViewingData({ ...viewingData, scheduledTime: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={viewingData.notes}
                  onChange={(e) => setViewingData({ ...viewingData, notes: e.target.value })}
                  placeholder="Any special instructions..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => { setShowViewingModal(false); setViewingData({ propertyName: '', scheduledDate: '', scheduledTime: '', notes: '' }); }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleViewing}
                disabled={!viewingData.scheduledDate || !viewingData.scheduledTime || loading}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Scheduling...' : 'Schedule Viewing'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeadDetailModal;