import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RoleGuard = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user.role === 'agent') {
    return <Navigate to="/agent/dashboard" replace />;
  } else if (user.role === 'client') {
    return <Navigate to="/client/portal" replace />;  // ADD THIS
  }
  return <Navigate to="/" replace />;
}

  return children;
};

export default RoleGuard;