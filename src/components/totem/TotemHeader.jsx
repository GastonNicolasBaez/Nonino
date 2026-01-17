import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useCart } from "@/context/CartProvider";
import { usePublicData } from "@/context/PublicDataProvider";
import { useSession } from "@/context/SessionProvider";
import { useTotem } from "@/hooks/useTotem";
import logoNonino from '@/assets/logos/nonino.png';
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const TotemHeader = () => {
  const { resetSession } = useTotem();
  const session = useSession();
  const { clearCart } = useCart();
  const { sucursalSeleccionada, sucursales } = usePublicData();
  const navigate = useNavigate();

  // Estado para logout secreto
  const [clickCount, setClickCount] = useState(0);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const clickTimeoutRef = useRef(null);

  // Encontrar el nombre del local seleccionado
  const selectedStoreName = sucursales.find(s => s.id === sucursalSeleccionada)?.name || 'Nonino';

  // Reset contador de clics después de 2 segundos de inactividad
  useEffect(() => {
    if (clickCount > 0) {
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2000);
    }
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [clickCount]);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 4) {
      // Abrir modal de logout secreto
      setShowLogoutDialog(true);
      setClickCount(0);
    } else if (newCount < 4) {
      // Navegar al menú si no es el 4to clic
      navigate('/totem/menu');
    }
  };

  const handleLogoutSubmit = async () => {
    if (!password.trim()) {
      setPasswordError('Por favor ingresá tu contraseña');
      return;
    }

    setIsValidating(true);
    setPasswordError('');

    try {
      // Intentar hacer login nuevamente para validar la contraseña
      // Si el login es exitoso, significa que la contraseña es correcta
      const currentEmail = session.userData?.email;

      if (!currentEmail) {
        setPasswordError('No se pudo obtener el email del usuario');
        setIsValidating(false);
        return;
      }

      // Usar el método de login del SessionProvider
      await session.login({
        email: currentEmail,
        password: password,
      });

      // Si llegamos aquí, la contraseña es correcta
      clearCart();
      session.logoutForced();
      localStorage.removeItem('totem_session_persistent');
      setShowLogoutDialog(false);
      setPassword('');
      navigate('/totem');
    } catch (error) {
      console.error('[TOTEM] Error validating password:', error);
      setPasswordError('Contraseña incorrecta');
    } finally {
      setIsValidating(false);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
    setPassword('');
    setPasswordError('');
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-20 bg-empanada-dark shadow-lg border-b-2 border-empanada-golden"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Espacio vacío a la izquierda */}
            <div className="w-32"></div>

            {/* Logo y Nombre centrados */}
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-4 hover:opacity-80 transition-opacity absolute left-1/2 transform -translate-x-1/2"
            >
              <img
                src={logoNonino}
                alt="Nonino Empanadas"
                className="w-14 h-14"
              />
              <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold text-empanada-golden leading-tight">
                  NONINO
                </h1>
                {sucursalSeleccionada && (
                  <p className="text-sm text-gray-300 leading-tight">
                    {selectedStoreName}
                  </p>
                )}
              </div>
            </button>

            {/* Botón Menú a la derecha - más sutil */}
            <Button
              onClick={() => navigate('/totem/menu')}
              variant="ghost"
              className="text-gray-300 hover:text-empanada-golden hover:bg-empanada-golden/10 text-base px-4 h-10"
            >
              <Menu className="w-4 h-4 mr-2" />
              Menú
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Dialog de logout secreto */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="bg-empanada-dark border-empanada-golden text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-empanada-golden">
              🔒 Cerrar sesión del totem
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-base">
              Confirmá tu identidad para cerrar sesión
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Mostrar email del usuario */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Usuario
              </label>
              <Input
                type="text"
                value={session.userData?.email || ''}
                disabled
                className="bg-empanada-dark text-gray-400 border-empanada-light-gray text-base h-12 cursor-not-allowed"
              />
            </div>

            {/* Input de contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Contraseña
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLogoutSubmit();
                  }
                }}
                placeholder="Ingresá tu contraseña"
                className="bg-empanada-medium text-white border-empanada-light-gray text-base h-12"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-400 text-sm mt-2">{passwordError}</p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-3 mt-2">
            <Button
              variant="outline"
              size="lg"
              onClick={handleCancelLogout}
              disabled={isValidating}
              className="text-base px-6 py-6"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={handleLogoutSubmit}
              disabled={isValidating}
              className="bg-red-600 hover:bg-red-700 text-base px-6 py-6"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Validando...
                </>
              ) : (
                'Cerrar sesión'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Spacer - Header height aumentado */}
      <div className="h-20" />
    </>
  );
};

export default TotemHeader;
