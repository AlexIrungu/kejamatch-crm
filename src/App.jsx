import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/common/ScrollToTop";
import PrivateRoute from "./components/auth/PrivateRoute";
import RoleGuard from "./components/auth/RoleGuard";
import ClientRegister from "./pages/ClientRegister";
import ClientLogin from "./pages/ClientLogin";
import ClientPortal from "./pages/ClientPortal";
import ClientVerifyEmail from "./pages/ClientVerifyEmail";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import BNBs from "./pages/BNBs";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import BlogDetail from "./pages/BlogDetail";

// Authentication pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";

// Protected pages
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:id" element={<PropertyDetails />} />
          <Route path="bnbs" element={<BNBs />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blog/:id" element={<BlogDetail />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Authentication Routes (No Layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Admin Dashboard (Protected - Admin Only) */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleGuard>
            </PrivateRoute>
          }
        />

        {/* Agent Dashboard (Protected - Agent & Admin) */}
        <Route
          path="/agent/dashboard"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={["agent", "admin"]}>
                <AgentDashboard />
              </RoleGuard>
            </PrivateRoute>
          }
        />

        {/* Client Portal Routes */}
        <Route path="/client/register" element={<ClientRegister />} />
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/client/verify-email" element={<ClientVerifyEmail />} />
        <Route
          path="/client/portal"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={["client"]}>
                <ClientPortal />
              </RoleGuard>
            </PrivateRoute>
          }
        />

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page not found</p>
                <a
                  href="/"
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
