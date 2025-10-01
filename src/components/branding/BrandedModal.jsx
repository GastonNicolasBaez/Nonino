import { Button } from "@/components/ui/button";
import { Portal } from "@/components/common/Portal";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export function BrandedModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = "max-w-4xl",
  maxHeight = "max-h-[90vh]"
}) {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Manejar tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Portal>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay bg-black/60 backdrop-blur-sm flex items-center justify-center"
          style={{padding: '1rem'}}
        >
          {/* Backdrop clickeable */}
          <div className="absolute inset-0" onClick={handleClose} />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`relative bg-background border-2 border-empanada-golden/20 rounded-lg shadow-xl ${maxWidth} w-full ${maxHeight} overflow-hidden flex flex-col`}
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-empanada-light-gray bg-gray-50 dark:bg-empanada-dark">
              <div className="flex items-center space-x-3">
                {icon && (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-empanada-golden/10">
                    <span className="text-empanada-golden">{icon}</span>
                  </div>
                )}
                <div>
                  {title && (
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-empanada-medium"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 flex-1 overflow-y-auto">
              {children}
            </div>

            {/* Footer del modal */}
            {footer && (
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-empanada-light-gray bg-gray-50 dark:bg-empanada-dark flex-shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
}

// Componente de Footer predefinido para casos comunes
export function BrandedModalFooter({
  onCancel,
  onConfirm,
  cancelText = "Cancelar",
  confirmText = "Confirmar",
  confirmIcon,
  isConfirmDisabled = false,
  isLoading = false,
  confirmButtonClass
}) {
  return (
    <>
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        {cancelText}
      </Button>
      <Button
        onClick={onConfirm}
        className={confirmButtonClass || "bg-empanada-golden hover:bg-empanada-golden/90"}
        disabled={isConfirmDisabled || isLoading}
      >
        {isLoading ? (
          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        ) : (
          confirmIcon && <span className="w-4 h-4 mr-2">{confirmIcon}</span>
        )}
        {confirmText}
      </Button>
    </>
  );
}