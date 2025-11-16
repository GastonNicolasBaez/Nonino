import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTotem } from '@/hooks/useTotem';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export const TotemInactivityMonitor = () => {
  const { showInactivityWarning, lastActivityTime, config, resetSession } = useTotem();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!showInactivityWarning) {
      setCountdown(config?.autoResetTimeout || 30);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = (now - lastActivityTime) / 1000;
      const timeUntilReset = config.inactivityTimeout - timeSinceLastActivity;

      setCountdown(Math.max(0, Math.ceil(timeUntilReset)));
    }, 100);

    return () => clearInterval(interval);
  }, [showInactivityWarning, lastActivityTime, config]);

  return (
    <AnimatePresence>
      {showInactivityWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-empanada-dark border-2 border-empanada-golden rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
          >
            <Clock className="w-16 h-16 text-empanada-golden mx-auto mb-4" />

            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Seguís con tu pedido?
            </h2>

            <p className="text-xl text-gray-300 mb-6">
              Tu sesión se cerrará en
            </p>

            <div className="bg-empanada-golden/20 rounded-lg p-4 mb-6">
              <span className="text-6xl font-bold text-empanada-golden">
                {countdown}
              </span>
              <span className="text-xl text-gray-300 ml-2">
                segundos
              </span>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              Tocá cualquier parte de la pantalla para continuar
            </p>

            <Button
              size="lg"
              onClick={() => {
                // El toque ya resetea el timer por el monitor de actividad
                // Este botón es solo visual para mejor UX
              }}
              className="bg-empanada-golden text-empanada-dark hover:bg-empanada-golden/90 text-xl px-8 py-6 font-bold w-full"
            >
              CONTINUAR CON MI PEDIDO
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TotemInactivityMonitor;
