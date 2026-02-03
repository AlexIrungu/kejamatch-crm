import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Home,
  Settings,
  RefreshCw,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle,
  MessageCircle,
  Users,
  LayoutGrid,
  Activity,
  Calendar,
  Bell,
} from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';
import agentService from '../services/agentService';
import AgentStats from '../components/agent/AgentStats';
import MyLeads from '../components/agent/MyLeads';
import AgentMessages from '../components/agent/AgentMessages';
import AgentPipeline from '../components/agent/AgentPipeline';
import FollowUpReminders from '../components/agent/FollowUpReminders';
import ActivityTimeline from '../components/agent/ActivityTimeline';
import ViewingScheduleWidget from '../components/agent/ViewingScheduleWidget';
import ProfileSettingsModal from '../components/admin/ProfileSettingsModal';
import LeadDetailModal from '../components/leads/LeadDetailModal';
import SEO from '../components/common/SEO';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeTab, setActiveTab] = useState('leads');
  const [unreadMessages, setUnreadMessages] = useState(0);

  const needsVerification = user && !user.isVerified;

  useEffect(() => {
    if (!needsVerification && user) {
      fetchAgentData();
    }
  }, [user, needsVerification]);

  const fetchAgentData = async () => {
    try {
      setLoading(true);
      const [leadsResponse, statsResponse, unreadResponse] = await Promise.all([
        agentService.getMyLeads(),
        agentService.getMyStats(),
        agentService.getUnreadCount().catch(() => ({ data: { count: 0 } })),
      ]);
      setLeads(leadsResponse.data || []);
      setStats(statsResponse.data || null);
      setUnreadMessages(unreadResponse.data?.count || 0);
    } catch (error) {
      console.error('Error fetching agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const handleLeadUpdate = (updatedLead) => {
    setLeads(prevLeads => prevLeads.map(l => l.id === updatedLead.id ? updatedLead : l));
    setSelectedLead(updatedLead);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBackToWebsite = () => {
    window.open('/', '_blank');
  };

  const handleGoToVerify = () => {
    navigate('/verify-email', { state: { email: user?.email, role: user?.role } });
  };

  if (needsVerification) {
    return (
      <>
        <SEO title="Verify Email - Kejamatch" description="Please verify your email" />
        <div className="min-h-screen bg-gradient-to-br from-primary to-dark flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verification Required</h2>
            <p className="text-gray-600 mb-6">
              Please verify your email address to access your dashboard. We've sent a verification code to <strong>{user?.email}</strong>.
            </p>
            <button onClick={handleGoToVerify} className="w-full px-6 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium mb-4">
              Verify Email Now
            </button>
            <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 text-sm">Sign out</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Agent Dashboard - Kejamatch" description="Agent dashboard" />

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-primary">Kejamatch Agent Portal</h1>
              <div className="flex items-center gap-3">
                <button onClick={handleBackToWebsite} className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors">
                  <Home className="w-4 h-4 mr-2" />
                  View Website
                </button>
                <button onClick={() => setShowSettingsModal(true)} className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-2">
                    <span className="text-white font-medium">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow-md p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h2>
                <p className="text-white/80">Here's an overview of your leads and performance</p>
              </div>
              <button onClick={fetchAgentData} className="hidden md:flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats && <AgentStats stats={stats} />}

          {/* Quick Stats Row */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full mr-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">New Today</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.todayLeads || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-full mr-4">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending Follow-up</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingFollowUp || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full mr-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalLeads > 0 ? Math.round((stats.convertedLeads / stats.totalLeads) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'leads'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Users className="w-5 h-5 mr-2" />
                  My Leads
                </button>
                <button
                  onClick={() => setActiveTab('pipeline')}
                  className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'pipeline'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5 mr-2" />
                  Pipeline
                </button>
                <button
                  onClick={() => setActiveTab('followups')}
                  className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'followups'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Bell className="w-5 h-5 mr-2" />
                  Follow-ups
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'activity'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Activity className="w-5 h-5 mr-2" />
                  Activity
                </button>
                <button
                  onClick={() => setActiveTab('viewings')}
                  className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'viewings'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Viewings
                </button>
                <button
                  onClick={() => { setActiveTab('messages'); setUnreadMessages(0); }}
                  className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'messages'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Messages
                  {unreadMessages > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                      {unreadMessages}
                    </span>
                  )}
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'leads' && (
            <>
              {/* My Leads Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">My Assigned Leads</h2>
                    <p className="text-gray-600">Manage and follow up with your assigned leads</p>
                  </div>
                  <button onClick={fetchAgentData} className="md:hidden flex items-center px-4 py-2 bg-primary text-white rounded-lg">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </button>
                </div>

                <MyLeads
                  leads={leads}
                  onStatusChange={handleViewDetails}
                  onAddNotes={handleViewDetails}
                  onViewDetails={handleViewDetails}
                  loading={loading}
                />
              </div>

              {/* Tips Section */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips for Success</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start"><span className="mr-2">•</span><span>Follow up with new leads within 24 hours for best conversion rates</span></li>
                  <li className="flex items-start"><span className="mr-2">•</span><span>Keep detailed notes about each interaction with clients</span></li>
                  <li className="flex items-start"><span className="mr-2">•</span><span>Update lead status regularly to keep the team informed</span></li>
                  <li className="flex items-start"><span className="mr-2">•</span><span>Schedule property viewings for qualified leads as soon as possible</span></li>
                </ul>
              </div>
            </>
          )}

          {activeTab === 'pipeline' && (
            <AgentPipeline onViewLead={handleViewDetails} />
          )}

          {activeTab === 'followups' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FollowUpReminders onViewLead={handleViewDetails} />
              <ViewingScheduleWidget />
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityTimeline />
              <FollowUpReminders onViewLead={handleViewDetails} />
            </div>
          )}

          {activeTab === 'viewings' && (
            <ViewingScheduleWidget />
          )}

          {activeTab === 'messages' && (
            <AgentMessages />
          )}
        </div>
      </div>

      {/* Modals */}
      <ProfileSettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} user={user} />
      <LeadDetailModal
        lead={selectedLead}
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedLead(null); }}
        onUpdate={handleLeadUpdate}
        isAgent={true}
        apiService={agentService}
      />
    </>
  );
};

export default AgentDashboard;