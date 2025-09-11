import { Navigate } from "react-router";
import { useSession } from "../../context/SessionProvider";
import { FullPageLoading } from "../common/LoadingSpinner";

/**
 * Componente para proteger rutas administrativas
 * Requiere autenticación y permisos de administrador
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos a proteger
 * @returns {React.ReactElement} - Componente protegido o redirección
 */
export function AdminRoute({ children }) {
  const { isAuthenticated, userData, loading } = useSession();


  if (loading) {
    return <FullPageLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/intranet/admin/login" replace />;
  }

  // Verificar si el usuario es admin
  const isAdmin = userData?.role === 'ADMIN';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
