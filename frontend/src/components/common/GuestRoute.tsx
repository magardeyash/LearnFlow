import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface GuestRouteProps {
  children: React.ReactElement;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    if (!user.isVerified) {
      return <Navigate to="/verify-email" replace />;
    }
    if (user.role === 'INSTRUCTOR') {
      return <Navigate to="/instructor/dashboard" replace />;
    }
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
