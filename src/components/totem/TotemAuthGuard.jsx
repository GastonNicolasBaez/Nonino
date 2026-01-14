import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSession } from '@/context/SessionProvider';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';

/**
 * TotemAuthGuard - Protege las rutas del totem
 *
 * - Verifica que haya una sesión activa
 * - Verifica que el usuario sea de tipo LOCAL
 * - Redirige al login si no cumple los requisitos
 */
export const TotemAuthGuard = ({ children }) => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    // Si está cargando, esperar
    if (session.loading) {
      return;
    }

    // Si no está autenticado, redirigir al login
    if (!session.isAuthenticated) {
      console.log('[TOTEM AUTH] No hay sesión activa - redirigiendo al login');
      navigate('/totem', { replace: true });
      return;
    }

    // Si el usuario no es LOCAL, no permitir acceso al totem
    if (session.userData && !session.userData.isLocal) {
      console.error('[TOTEM AUTH] Usuario no es LOCAL - acceso denegado');
      toast.error('Solo usuarios de LOCAL pueden usar el totem', {
        duration: 5000,
      });

      // Logout forzado y redirigir
      session.logoutForced();
      navigate('/totem', { replace: true });
      return;
    }

    // Si el usuario LOCAL no tiene sucursal asignada
    if (session.userData && session.userData.isLocal && !session.userData.sucursal) {
      console.error('[TOTEM AUTH] Usuario LOCAL sin sucursal asignada');
      toast.error('Tu usuario no tiene una sucursal asignada. Contacta al administrador.', {
        duration: 5000,
      });

      session.logoutForced();
      navigate('/totem', { replace: true });
      return;
    }

    // Todo OK - usuario autenticado y es LOCAL con sucursal
    console.log('[TOTEM AUTH] Acceso permitido -', session.userData.email);
  }, [session.isAuthenticated, session.loading, session.userData, navigate]);

  // Mostrar loading mientras verifica
  if (session.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-empanada-dark">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // Si no está autenticado o no es LOCAL, no mostrar nada (ya redirigió)
  if (!session.isAuthenticated || !session.userData?.isLocal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-empanada-dark">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // Usuario autenticado y es LOCAL - mostrar contenido
  return <>{children}</>;
};

export default TotemAuthGuard;
