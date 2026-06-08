import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/authContext.jsx';

export default function ProtectedRoute({ element, requiredRole }) {
  const { user } = useAuth();

  // If user is not logged in or role doesn't match, redirect to home
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.userType !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return element;
}
