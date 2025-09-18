import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, adminOnly }) => {
  const { isAuthenticated, loading, user } = useAuth();

  const isUserAdmin = user?.role === 'admin';

  console.log('ProtectedRoute (Dynamic Admin Check Debug): Is Authenticated?', isAuthenticated);
  console.log('ProtectedRoute (Dynamic Admin Check Debug): User role:', user?.role);
  console.log('ProtectedRoute (Dynamic Admin Check Debug): Is User Admin?', isUserAdmin);

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Loading...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute (Dynamic Admin Check Debug): Redirecting to login (not authenticated)');
    return <Navigate to="/login" replace />;
  }

  // Apply admin-only check dynamically
  if (adminOnly && !isUserAdmin) {
    console.log('ProtectedRoute (Dynamic Admin Check Debug): Redirecting to dashboard (non-admin trying to access admin route)');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute; 