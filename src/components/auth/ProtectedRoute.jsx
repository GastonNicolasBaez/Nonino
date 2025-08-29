import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FullPageLoading } from "../common/LoadingSpinner";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <FullPageLoading />;
  }

  if (!isAuthenticated) {
    // Redirigir al login y recordar la página que intentaba acceder
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
