import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  FileText,
  Download,
  RefreshCw,
  LogOut,
  Settings,
  Home,
  ShieldCheck,
  ShieldX,
  List,
  Columns,
} from "lucide-react";
import { useAuth } from "../components/auth/AuthContext";
import adminService from "../services/adminService";
import StatsCard from "../components/admin/StatsCard";
import LeadsList from "../components/admin/LeadsList";
import LeadPipeline from "../components/admin/LeadPipeline";
import LeadFilters from "../components/admin/LeadFilters";
import AssignModal from "../components/admin/AssignModal";
import UserManagement from "../components/admin/UserManagement";
import ProfileSettingsModal from "../components/admin/ProfileSettingsModal";
import LeadDetailModal from "../components/leads/LeadDetailModal";
import SEO from "../components/common/SEO";
import propertyService from "../services/propertyService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'pipeline'
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    type: "",
    startDate: "",
  });
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [properties, setProperties] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, leads]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, leadsRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllLeads(),
      ]);
      setStats(statsRes.data);
      setLeads(leadsRes.data);
      setFilteredLeads(leadsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      setPropertyLoading(true);
      const response = await propertyService.getAllProperties();
      setProperties(response.data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setPropertyLoading(false);
    }
  };

  // Call in useEffect
  useEffect(() => {
    fetchDashboardData();
    fetchProperties(); // ← ADD THIS
  }, []);

  const applyFilters = () => {
    let filtered = [...leads];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          (lead.phone && lead.phone.includes(filters.search)) ||
          (lead.phoneNumber && lead.phoneNumber.includes(filters.search)),
      );
    }

    if (filters.status) {
      filtered = filtered.filter((lead) => lead.status === filters.status);
    }

    if (filters.type) {
      filtered = filtered.filter((lead) => lead.type === filters.type);
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (lead) => new Date(lead.createdAt) >= new Date(filters.startDate),
      );
    }

    setFilteredLeads(filtered);
  };

  const handleResetFilters = () => {
    setFilters({ search: "", status: "", type: "", startDate: "" });
  };

  const handleStatusChange = async (lead, newStatus = null) => {
    if (newStatus) {
      // Called from pipeline drag-and-drop
      try {
        const response = await adminService.updateLeadStatus(
          lead.id || lead._id,
          newStatus,
        );
        if (response.success) {
          // Update local state
          setLeads((prevLeads) =>
            prevLeads.map((l) =>
              l.id === lead.id || l._id === lead._id
                ? { ...l, status: newStatus }
                : l,
            ),
          );
        }
      } catch (error) {
        console.error("Error updating lead status:", error);
        alert("Failed to update lead status");
      }
    } else {
      // Called from list view - open detail modal
      setSelectedLead(lead);
      setShowDetailModal(true);
    }
  };

  const handleAssignLead = (lead) => {
    setSelectedLead(lead);
    setShowAssignModal(true);
  };

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const handleLeadUpdate = (updatedLead) => {
    setLeads((prevLeads) =>
      prevLeads.map((l) =>
        (l.id || l._id) === (updatedLead.id || updatedLead._id)
          ? updatedLead
          : l,
      ),
    );
    setSelectedLead(updatedLead);
  };

  const handleExportLeads = async () => {
    try {
      await adminService.exportLeads();
    } catch (error) {
      console.error("Error exporting leads:", error);
      alert("Failed to export leads");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBackToWebsite = () => {
    window.open("/", "_blank");
  };

  return (
    <>
      <SEO title="Admin Dashboard - Kejamatch" description="Admin dashboard" />

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-primary">
                Kejamatch Admin
              </h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToWebsite}
                  className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <Home className="w-4 h-4 mr-2" />
                  View Website
                </button>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="text-right hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {[
                { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                { id: "leads", label: "Leads", icon: FileText },
                { id: "properties", label: "Properties", icon: Home }, // ← ADD THIS
                { id: "users", label: "Users", icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-b-2 border-secondary text-secondary"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {stats && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                      title="Total Leads"
                      value={stats.leads.total}
                      icon={FileText}
                      color="blue"
                    />
                    <StatsCard
                      title="Today"
                      value={stats.leads.today}
                      icon={TrendingUp}
                      color="green"
                    />
                    <StatsCard
                      title="This Week"
                      value={stats.leads.thisWeek}
                      icon={TrendingUp}
                      color="orange"
                    />
                    <StatsCard
                      title="Total Users"
                      value={stats.users.total}
                      icon={Users}
                      color="purple"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">
                            Verified Users
                          </p>
                          <p className="text-3xl font-bold text-green-600">
                            {stats.users.verified || 0}
                          </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                          <ShieldCheck className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">
                            Pending Verification
                          </p>
                          <p className="text-3xl font-bold text-yellow-600">
                            {stats.users.unverified || 0}
                          </p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                          <ShieldX className="w-8 h-8 text-yellow-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={fetchDashboardData}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Refresh Data
                  </button>
                  <button
                    onClick={handleExportLeads}
                    className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Export Leads
                  </button>
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Settings
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              {stats?.recentActivity?.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h2>
                  <div className="space-y-3">
                    {stats.recentActivity.map((activity) => (
                      <div
                        key={activity.id || activity._id}
                        onClick={() => handleViewDetails(activity)}
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {activity.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {activity.source?.replace(/_/g, " ") || "Lead"}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Leads Tab */}
          {activeTab === "leads" && (
            <div className="space-y-6">
              {/* View Mode Toggle */}
              <div className="flex justify-between items-center">
                <LeadFilters
                  filters={filters}
                  setFilters={setFilters}
                  onReset={handleResetFilters}
                />
                <div className="flex gap-2 bg-white rounded-lg shadow-md p-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <List className="w-4 h-4 mr-2" />
                    List View
                  </button>
                  <button
                    onClick={() => setViewMode("pipeline")}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                      viewMode === "pipeline"
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Columns className="w-4 h-4 mr-2" />
                    Pipeline View
                  </button>
                </div>
              </div>

              {/* Leads Display */}
              {viewMode === "list" ? (
                <LeadsList
                  leads={filteredLeads}
                  onStatusChange={handleStatusChange}
                  onAssign={handleAssignLead}
                  onViewDetails={handleViewDetails}
                  loading={loading}
                />
              ) : (
                <LeadPipeline
                  leads={filteredLeads}
                  onStatusChange={handleStatusChange}
                  onViewDetails={handleViewDetails}
                  loading={loading}
                />
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && <UserManagement />}

          {/* Properties Tab */}
          {activeTab === "properties" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Property Management
                </h2>
                <button
                  onClick={() => {
                    /* TODO: Open create property modal */
                  }}
                  className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Property
                </button>
              </div>

              {propertyLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCardSimple
                      key={property._id}
                      property={property}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AssignModal
        lead={selectedLead}
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onSuccess={fetchDashboardData}
      />
      <ProfileSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        user={user}
      />
      <LeadDetailModal
        lead={selectedLead}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedLead(null);
        }}
        onUpdate={handleLeadUpdate}
        apiService={adminService}
      />
    </>
  );
};

export default AdminDashboard;
