import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="h-screen w-screen bg-slate-950 flex items-center justify-center text-white">Loading Auth...</div>;
  }

  if (!user) {
    // Redirect to login but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to select-college if user has no college assigned
  if (!user.college && location.pathname !== '/select-college') {
    return <Navigate to="/select-college" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Role not authorized, redirect to home or a generic dashboard
    const defaultPath = user.role === 'kitchen' ? '/kitchen/dashboard' : '/student/dashboard';
    return <Navigate to={defaultPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
