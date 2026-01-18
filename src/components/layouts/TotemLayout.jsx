import { Outlet, useLocation } from "react-router";
import { TotemHeader } from "@/components/totem/TotemHeader";
import { TotemProvider } from "@/context/TotemProvider";
import { CartProvider } from "@/context/CartProvider";
import { TotemInactivityMonitor } from "@/components/totem/TotemInactivityMonitor";
import { useEffect } from "react";

const TotemLayout = () => {
  const location = useLocation();

  // Ocultar header en la página de login y welcome
  const showHeader = location.pathname !== '/totem/welcome' && location.pathname !== '/totem';

  // Prevenir zoom con gestos (importante para tablets)
  useEffect(() => {
    const preventZoom = (e) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const preventDoubleTapZoom = (e) => {
      e.preventDefault();
    };

    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('dblclick', preventDoubleTapZoom, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('dblclick', preventDoubleTapZoom);
    };
  }, []);

  return (
    <TotemProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-empanada-dark totem-container">
          {/* Monitor de inactividad */}
          <TotemInactivityMonitor />

          {/* Header fijo - oculto en welcome */}
          {showHeader && <TotemHeader />}

          {/* Contenido principal */}
          <main className="flex-1 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </CartProvider>
    </TotemProvider>
  );
};

export default TotemLayout;
