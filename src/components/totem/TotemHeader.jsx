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
import { Loader2 } from "lucide-react";
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
      // Validar contraseña con el backend usando el email del usuario actual
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.userData?.email,
          password: password,
        }),
      });

      if (response.ok) {
        // Contraseña correcta - cerrar sesión
        clearCart();
        session.logoutForced();
        setShowLogoutDialog(false);
        setPassword('');
        navigate('/totem');
      } else {
        // Contraseña incorrecta
        setPasswordError('Contraseña incorrecta');
      }
    } catch (error) {
      console.error('[TOTEM] Error validating password:', error);
      setPasswordError('Error al validar contraseña');
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
        <div className="px-4 py-3">
          {/* Logo y Nombre centrados */}
          <button
            onClick={handleLogoClick}
            className="flex items-center justify-center space-x-3 hover:opacity-80 transition-opacity w-full"
          >
            <img
              src={logoNonino}
              alt="Nonino Empanadas"
              className="w-10 h-10"
            />
            <div className="flex flex-col items-center">
              <h1 className="text-lg font-bold text-empanada-golden leading-tight">
                NONINO
              </h1>
              {sucursalSeleccionada && (
                <p className="text-xs text-gray-300 leading-tight">
                  {selectedStoreName}
                </p>
              )}
            </div>
          </button>
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
              Ingresá tu contraseña para cerrar sesión
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
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
              placeholder="Contraseña"
              className="bg-empanada-medium text-white border-empanada-light-gray text-lg h-14"
              autoFocus
            />
            {passwordError && (
              <p className="text-red-400 text-sm mt-2">{passwordError}</p>
            )}
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

      {/* Spacer - Header height */}
      <div className="h-14" />
    </>
  );
};

export default TotemHeader;
