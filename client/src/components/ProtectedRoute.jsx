// [Riya] ProtectedRoute.jsx - Route guard with auth check & role-based access
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute wraps pages that require authentication.
 * - Redirects unauthenticated users to /login (preserving intended destination).
 * - Optionally enforces role-based access (e.g. requiredRole="staff").
 * - Shows a loading spinner while auth state is being resolved on first load.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The protected page component.
 * @param {string} [props.requiredRole] - Optional role restriction ('student' | 'staff').
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // 1. Auth state is still loading (e.g. verifying token on app mount)
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTopColor: '#f97316',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Verifying session...</p>

        {/* Inline keyframe for spinner animation */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 2. Not logged in — redirect to /login, saving current path for post-login redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 3. Role-based access: deny if user doesn't have required role
  if (requiredRole && user?.role !== requiredRole) {
    // Students trying to access staff dashboard → redirect to menu
    // Staff trying to access student pages → redirect to staff dashboard
    const fallback = user?.role === 'staff' ? '/staff-dashboard' : '/menu';
    return <Navigate to={fallback} replace />;
  }

  // 4. Authenticated & authorized — render the protected page
  return children;
};

export default ProtectedRoute;
