import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useCart } from "@/context/CartProvider";
import { usePublicData } from "@/context/PublicDataProvider";
import { useSession } from "@/context/SessionProvider";
import { useTotem } from "@/hooks/useTotem";
import logoNonino from '@/assets/logos/nonino.png';
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
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
  const clickTimeoutRef = useRef(null);

  // Obtener nombre de la sucursal del usuario autenticado
  const userStore = session.userData?.sucursal;
  const selectedStoreName = userStore ? sucursales.find(s => s.id === userStore)?.name || 'Nonino' : 'Nonino';

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

  const handleLogoutSubmit = () => {
    // Primero limpiar todo
    clearCart();
    localStorage.removeItem('totem_session_persistent');
    setShowLogoutDialog(false);

    // Hacer logout y navegar
    session.logoutForced();

    // Pequeño delay para asegurar que el logout se complete
    setTimeout(() => {
      navigate('/totem');
    }, 100);
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
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
                {userStore && (
                  <p className="text-sm text-gray-300 leading-tight">
                    {selectedStoreName}
                  </p>
                )}
              </div>
            </button>

            {/* Botón Menú a la derecha - más sutil */}
            <Button
              onClick={() => navigate('/totem/welcome')}
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
              ¿Estás seguro que querés cerrar sesión del totem?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl p-4">
              <p className="text-yellow-300 text-base">
                Esto eliminará la configuración actual del totem y tendrás que volver a iniciar sesión.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-3 mt-2">
            <Button
              variant="outline"
              size="lg"
              onClick={handleCancelLogout}
              className="bg-empanada-medium text-base px-6 py-6 border-empanada-light-gray text-gray-300 hover:bg-empanada-dark"
            >
              Cancelar
            </Button>
            <Button
              size="lg"
              onClick={handleLogoutSubmit}
              className="bg-red-600 hover:bg-red-700 text-white text-base px-6 py-6"
            >
              Cerrar sesión
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
