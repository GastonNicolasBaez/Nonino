import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { FullPageLoading } from "../common/LoadingSpinner";

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos a proteger
 * @returns {React.ReactElement} - Componente protegido o redirección
 */
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
