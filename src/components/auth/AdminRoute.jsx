import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FullPageLoading } from "../common/LoadingSpinner";

/**
 * Componente para proteger rutas administrativas
 * Requiere autenticación y permisos de administrador
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos a proteger
 * @returns {React.ReactElement} - Componente protegido o redirección
 */
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
