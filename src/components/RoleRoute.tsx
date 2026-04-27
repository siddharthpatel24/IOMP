import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../services/firebase';

interface RoleRouteProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  redirectTo?: string;
}

const RoleRoute: React.FC<RoleRouteProps> = ({
  children,
  requiredRole,
  redirectTo,
}) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role !== requiredRole) {
    const fallback =
      redirectTo ?? (role === 'authority' ? '/authority/dashboard' : '/user/home');
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
