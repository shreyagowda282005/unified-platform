import { Navigate } from 'react-router-dom';
// (auth gating uses centralized authStore)
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes?: ('influencer' | 'brand' | 'admin')[];
}

export const ProtectedRoute = ({ children, allowedTypes }: ProtectedRouteProps) => {

  // Prefer the central auth store for auth status
  const { isAuthenticated, user } = useAuthStore();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const currentUserType = user.userType as 'influencer' | 'brand' | 'admin';

  // Check if user type is allowed
  if (allowedTypes && currentUserType && !allowedTypes.includes(currentUserType)) {
    // Redirect based on user type
    if (currentUserType === 'influencer') {
      return <Navigate to="/influencer/dashboard" replace />;
    } else if (currentUserType === 'brand') {
      return <Navigate to="/brand/dashboard" replace />;
    } else if (currentUserType === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};







