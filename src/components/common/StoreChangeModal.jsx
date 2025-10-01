import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, MapPin } from 'lucide-react';
import { Button } from '../ui/button';

export function StoreChangeModal({ isOpen, onClose, onConfirm }) {
  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const mobileModalVariants = {
    hidden: {
      opacity: 0,
      y: '100%'
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      y: '100%',
      transition: {
        duration: 0.25
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay - Fuera del contenedor principal para cubrir toda la página */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <div className="pointer-events-auto">

          {/* Modal - Desktop/Tablet (≥768px) */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="hidden md:block relative w-full max-w-lg bg-empanada-dark rounded-2xl shadow-2xl border border-amber-500/30 my-auto max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header con ícono y close button */}
            <div className="relative bg-gradient-to-br from-amber-600/20 to-amber-800/20 border-b border-amber-500/30 px-6 pt-6 pb-5">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors group"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Warning Icon */}
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-amber-500/30 rounded-full flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-8 h-8 text-amber-400" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white text-center">
                ¿Cambiar de Sucursal?
              </h2>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-300 text-center mb-5 leading-relaxed text-base">
                Al cambiar de sucursal, <span className="text-amber-400 font-semibold">se eliminarán todos los productos</span> de tu carrito actual.
              </p>

              {/* Info Box */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Podrás seleccionar una nueva sucursal y comenzar tu pedido desde cero.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 py-3 text-base border-empanada-light-gray hover:bg-empanada-medium"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={onConfirm}
                  className="flex-1 py-3 text-base bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold shadow-lg"
                >
                  Cambiar Sucursal
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Modal - Mobile (<768px) */}
          <motion.div
            variants={mobileModalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden fixed inset-x-0 bottom-0 bg-empanada-dark rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col border-t border-empanada-light-gray"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-600 rounded-full"></div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 pb-8">
              {/* Warning Icon */}
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white text-center mb-3">
                ¿Cambiar de Sucursal?
              </h2>

              <p className="text-gray-300 text-center mb-5 leading-relaxed">
                Al cambiar de sucursal, <span className="text-amber-400 font-semibold">se eliminarán todos los productos</span> de tu carrito actual.
              </p>

              {/* Info Box */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">
                    Podrás seleccionar una nueva sucursal y comenzar tu pedido desde cero.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={onConfirm}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-base"
                >
                  Cambiar Sucursal
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full py-4 text-base"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
