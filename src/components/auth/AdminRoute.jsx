import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FullPageLoading } from "../common/LoadingSpinner";

export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <FullPageLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
