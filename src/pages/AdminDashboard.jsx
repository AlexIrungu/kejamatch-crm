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
  Plus,
  Search,
  Filter,
  Calendar,
  BarChart,
  FileCheck
} from "lucide-react";
import { useAuth } from "../components/auth/AuthContext";
import adminService from "../services/adminService";
import propertyService from "../services/propertyService";
import StatsCard from "../components/admin/StatsCard";
import LeadsList from "../components/admin/LeadsList";
import LeadPipeline from "../components/admin/LeadPipeline";
import LeadFilters from "../components/admin/LeadFilters";
import AssignModal from "../components/admin/AssignModal";
import UserManagement from "../components/admin/UserManagement";
import ProfileSettingsModal from "../components/admin/ProfileSettingsModal";
import LeadDetailModal from "../components/leads/LeadDetailModal";
import PropertyCardSimple from "../components/admin/PropertyCardSimple";
import PropertyFormModal from "../components/admin/PropertyFormModal";
import DeleteConfirmModal from "../components/admin/DeleteConfirmModal";
import SEO from "../components/common/SEO";
import ViewingCalendar from "../components/admin/ViewingCalendar";
import AnalyticsDashboard from "../components/admin/analytics/AnalyticsDashboard";
import ClientApproval from "../components/admin/ClientApproval";
import ClientManagement from "../components/admin/ClientManagement";
import DocumentVerification from "../components/admin/DocumentVerification";

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

  // Property state
  const [properties, setProperties] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyFormLoading, setPropertyFormLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [propertySearchQuery, setPropertySearchQuery] = useState("");
  const [propertyFilter, setPropertyFilter] = useState({
    type: "",
    status: "",
    category: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, leads]);

  // Fetch properties when tab changes to properties
  useEffect(() => {
    if (activeTab === "properties") {
      fetchProperties();
    }
  }, [activeTab]);

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
      alert("Failed to fetch properties. Please try again.");
    } finally {
      setPropertyLoading(false);
    }
  };

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
      try {
        const response = await adminService.updateLeadStatus(
          lead.id || lead._id,
          newStatus,
        );
        if (response.success) {
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

  // Property handlers
  const handleAddProperty = () => {
    setSelectedProperty(null);
    setShowPropertyModal(true);
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const handleViewProperty = (property) => {
    window.open(`/properties/${property._id}`, "_blank");
  };

  const handleDeleteProperty = (property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };

  const confirmDeleteProperty = async () => {
    if (!propertyToDelete) return;

    try {
      setDeleteLoading(true);
      const response = await propertyService.deleteProperty(
        propertyToDelete._id,
      );

      if (response.success) {
        setProperties((prev) =>
          prev.filter((p) => p._id !== propertyToDelete._id),
        );
        setShowDeleteModal(false);
        setPropertyToDelete(null);
      } else {
        alert(response.message || "Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Failed to delete property. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePropertySubmit = async (propertyData) => {
    try {
      setPropertyFormLoading(true);

      let response;
      if (selectedProperty) {
        // Update existing property
        response = await propertyService.updateProperty(
          selectedProperty._id,
          propertyData,
        );
      } else {
        // Create new property
        response = await propertyService.createProperty(propertyData);
      }

      if (response.success) {
        if (selectedProperty) {
          // Update in list
          setProperties((prev) =>
            prev.map((p) =>
              p._id === selectedProperty._id ? response.data : p,
            ),
          );
        } else {
          // Add to list
          setProperties((prev) => [response.data, ...prev]);
        }
        setShowPropertyModal(false);
        setSelectedProperty(null);
      } else {
        alert(response.message || "Failed to save property");
      }
    } catch (error) {
      console.error("Error saving property:", error);
      alert("Failed to save property. Please try again.");
    } finally {
      setPropertyFormLoading(false);
    }
  };

  const handleToggleFeatured = async (property) => {
    try {
      const response = await propertyService.toggleFeatured(property._id);
      if (response.success) {
        setProperties((prev) =>
          prev.map((p) =>
            p._id === property._id ? { ...p, featured: !p.featured } : p,
          ),
        );
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
      alert("Failed to update featured status");
    }
  };

  const handleUpdatePropertyStatus = async (property, status) => {
    try {
      const response = await propertyService.updatePropertyStatus(
        property._id,
        status,
      );
      if (response.success) {
        setProperties((prev) =>
          prev.map((p) => (p._id === property._id ? { ...p, status } : p)),
        );
      }
    } catch (error) {
      console.error("Error updating property status:", error);
      alert("Failed to update property status");
    }
  };

  // Filter properties
  const getFilteredProperties = () => {
    let filtered = [...properties];

    if (propertySearchQuery) {
      const query = propertySearchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.location?.city?.toLowerCase().includes(query) ||
          p.location?.address?.toLowerCase().includes(query),
      );
    }

    if (propertyFilter.type) {
      filtered = filtered.filter((p) => p.type === propertyFilter.type);
    }

    if (propertyFilter.status) {
      filtered = filtered.filter((p) => p.status === propertyFilter.status);
    }

    if (propertyFilter.category) {
      filtered = filtered.filter((p) => p.category === propertyFilter.category);
    }

    return filtered;
  };

  const filteredProperties = getFilteredProperties();

  return (
    <>
      <SEO title="Admin Dashboard - Kejamatch" description="Admin dashboard" />

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <img
                  src="/clearblackbg.svg"
                  alt="KejaMatch"
                  className="h-12 w-auto"
                />
                <span className="text-2xl font-bold text-primary">Admin</span>
              </div>
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
                { id: "properties", label: "Properties", icon: Home },
                { id: "viewings", label: "Viewings", icon: Calendar },
                { id: "clients", label: "Clients", icon: Users },
                { id: "documents", label: "Documents", icon: FileCheck },
                { id: "analytics", label: "Analytics", icon: BarChart },
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

          {activeTab === "viewings" && <ViewingCalendar />}

          {activeTab === "clients" && (
            <div className="space-y-6">
              <ClientApproval />
              <ClientManagement />
            </div>
          )}

          {activeTab === "documents" && <DocumentVerification />}

          {/* Analytics Tab */}
          {activeTab === "analytics" && <AnalyticsDashboard />}

          {/* Properties Tab */}
          {activeTab === "properties" && (
            <div className="space-y-6">
              {/* Header with Add Button */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Property Management
                </h2>
                <button
                  onClick={handleAddProperty}
                  className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Property
                </button>
              </div>

              {/* Search and Filters */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={propertySearchQuery}
                      onChange={(e) => setPropertySearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex gap-2">
                    <select
                      value={propertyFilter.type}
                      onChange={(e) =>
                        setPropertyFilter((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      <option value="Rent">For Rent</option>
                      <option value="Buy">For Sale</option>
                    </select>

                    <select
                      value={propertyFilter.status}
                      onChange={(e) =>
                        setPropertyFilter((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    >
                      <option value="">All Status</option>
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                      <option value="sold">Sold</option>
                      <option value="rented">Rented</option>
                    </select>

                    <select
                      value={propertyFilter.category}
                      onChange={(e) =>
                        setPropertyFilter((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      <option value="apartments">Apartments</option>
                      <option value="houses">Houses</option>
                      <option value="land">Land</option>
                      <option value="commercial">Commercial</option>
                    </select>

                    {(propertySearchQuery ||
                      propertyFilter.type ||
                      propertyFilter.status ||
                      propertyFilter.category) && (
                      <button
                        onClick={() => {
                          setPropertySearchQuery("");
                          setPropertyFilter({
                            type: "",
                            status: "",
                            category: "",
                          });
                        }}
                        className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Properties Grid */}
              {propertyLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
                </div>
              ) : filteredProperties.length > 0 ? (
                <>
                  <p className="text-sm text-gray-600">
                    Showing {filteredProperties.length} of {properties.length}{" "}
                    properties
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                      <PropertyCardSimple
                        key={property._id}
                        property={property}
                        onEdit={() => handleEditProperty(property)}
                        onView={() => handleViewProperty(property)}
                        onDelete={() => handleDeleteProperty(property)}
                        onToggleFeatured={() => handleToggleFeatured(property)}
                        onStatusChange={(status) =>
                          handleUpdatePropertyStatus(property, status)
                        }
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Properties Found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {properties.length === 0
                      ? "Get started by adding your first property listing."
                      : "No properties match your current filters."}
                  </p>
                  {properties.length === 0 && (
                    <button
                      onClick={handleAddProperty}
                      className="inline-flex items-center px-6 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Your First Property
                    </button>
                  )}
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
      <PropertyFormModal
        isOpen={showPropertyModal}
        onClose={() => {
          setShowPropertyModal(false);
          setSelectedProperty(null);
        }}
        onSubmit={handlePropertySubmit}
        property={selectedProperty}
        loading={propertyFormLoading}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPropertyToDelete(null);
        }}
        onConfirm={confirmDeleteProperty}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone and will remove all associated data."
        itemName={propertyToDelete?.title}
        loading={deleteLoading}
      />
    </>
  );
};

export default AdminDashboard;
