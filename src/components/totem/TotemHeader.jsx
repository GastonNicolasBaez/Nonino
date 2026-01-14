import { motion } from "framer-motion";
import { X, Home, LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import { useTotem } from "@/hooks/useTotem";
import { useSession } from "@/context/SessionProvider";
import { useNavigate } from "react-router";
import { useCart } from "@/context/CartProvider";
import { usePublicData } from "@/context/PublicDataProvider";
import logoNonino from '@/assets/logos/nonino.png';
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const TotemHeader = () => {
  const { resetSession, config } = useTotem();
  const session = useSession();
  const { clearCart } = useCart();
  const { sucursalSeleccionada, sucursales } = usePublicData();
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Encontrar el nombre del local seleccionado
  const selectedStoreName = sucursales.find(s => s.id === sucursalSeleccionada)?.name || config?.storeName || 'Nonino';

  const handleCancelOrder = () => {
    setShowCancelDialog(true);
  };

  const confirmCancelOrder = () => {
    clearCart();
    resetSession();
    setShowCancelDialog(false);
  };

  const handleGoHome = () => {
    navigate('/totem/menu');
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    clearCart();
    session.logoutForced();
    setShowLogoutDialog(false);
    navigate('/totem');
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-20 bg-empanada-dark shadow-lg border-b-2 border-empanada-golden"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 py-2">
          {/* Primera fila: Logo, Nombre y Botones principales */}
          <div className="flex items-center justify-between">
            {/* Logo y Nombre del Local */}
            <button
              onClick={handleGoHome}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity flex-shrink-0"
            >
              <img
                src={logoNonino}
                alt="Nonino Empanadas"
                className="w-10 h-10"
              />
              <div className="flex flex-col">
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

            {/* Botones de acción */}
            <div className="flex items-center space-x-3">
              {/* Info del usuario logeado - Más compacto */}
              {session.isAuthenticated && session.userData && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-empanada-medium rounded-lg border border-empanada-light-gray">
                  <User className="w-4 h-4 text-empanada-golden" />
                  <span className="text-xs text-white font-medium truncate max-w-[120px]">
                    {session.userData.email}
                  </span>

                  {/* Botón de logout discreto */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-1 h-auto"
                    title="Cerrar sesión y reconfigurar totem"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}

              {/* Botón Inicio - Más compacto */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoHome}
                className="text-white hover:text-empanada-golden hover:bg-empanada-golden/10 text-sm px-3 h-9"
              >
                <Home className="w-5 h-5 mr-1.5" />
                <span className="hidden sm:inline">Menú</span>
              </Button>

              {/* Botón Cancelar Pedido - Más compacto */}
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancelOrder}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 h-9"
              >
                <X className="w-5 h-5 mr-1.5" />
                <span className="hidden sm:inline">Cancelar</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Dialog de confirmación - Cancelar pedido */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="bg-empanada-dark border-empanada-golden text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-empanada-golden">
              ¿Cancelar el pedido?
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-lg">
              Se perderán todos los productos seleccionados y tendrás que empezar de nuevo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 mt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowCancelDialog(false)}
              className="text-lg px-6 py-6"
            >
              No, continuar
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={confirmCancelOrder}
              className="bg-red-600 hover:bg-red-700 text-lg px-6 py-6"
            >
              Sí, cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación - Cerrar sesión */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="bg-empanada-dark border-empanada-golden text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-empanada-golden">
              ⚠️ Cerrar sesión del totem
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-lg">
              Esto cerrará la sesión del local y tendrás que volver a configurar el totem.
              <br /><br />
              <span className="text-yellow-400 font-semibold">
                Solo realiza esta acción si necesitas cambiar de local o reconfigurar la tablet.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 mt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowLogoutDialog(false)}
              className="text-lg px-6 py-6"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={confirmLogout}
              className="bg-red-600 hover:bg-red-700 text-lg px-6 py-6"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sí, cerrar sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Spacer - Ajustado para header más compacto */}
      <div className="h-14" />
    </>
  );
};

export default TotemHeader;
