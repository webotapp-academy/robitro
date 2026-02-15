import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require JWT authentication.
 * Checks for valid JWT token in localStorage.
 * Redirects to login if not authenticated.
 * 
 * Usage:
 * <Route 
 *   path="/lms/dashboard" 
 *   element={
 *     <ProtectedRoute isAuthenticated={isAuthenticated}>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   } 
 * />
 */

export default function ProtectedRoute({ children, isAuthenticated }) {
  // Check if user has valid token
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  // If not authenticated or no token, redirect to login
  if (!isAuthenticated || !token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return children;
}

/**
 * Alternative: Higher Order Component (HOC) version
 * 
 * Usage:
 * export default withProtectedRoute(Dashboard);
 */

export function withProtectedRoute(Component) {
  return function ProtectedComponent(props) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      return <Navigate to="/login" replace />;
    }

    return <Component {...props} />;
  };
}

/**
 * Role-Based Protected Route
 * 
 * Protects routes based on user role
 * Useful for admin or instructor-only pages
 * 
 * Usage:
 * <RoleProtectedRoute requiredRoles={['instructor', 'admin']}>
 *   <AdminPanel />
 * </RoleProtectedRoute>
 */

export function RoleProtectedRoute({ children, requiredRoles = [] }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // Check if user role is in required roles
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  } catch (error) {
    console.error('Error parsing user:', error);
    return <Navigate to="/login" replace />;
  }
}

