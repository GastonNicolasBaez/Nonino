import { Button } from "@/components/ui/button";
import { Portal } from "@/components/common/Portal";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function BrandedModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = "max-w-4xl",
  maxHeight = "max-h-[90vh]",
  modalType = "default", // "default", "mobile-first", "product"
  showDragHandle = false,
  allowDragClose = true
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  // Detectar dispositivos
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsSmallMobile(width < 475);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

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
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Animaciones responsivas
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const desktopModalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2 }
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
        stiffness: 300,
        duration: 0.4
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

  const handleDragEnd = (e, info) => {
    if (!allowDragClose) return;
    
    const threshold = isSmallMobile ? 100 : 150;
    const velocity = Math.abs(info.velocity.y);
    
    if (info.offset.y > threshold || velocity > 500) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <AnimatePresence>
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[999999] flex items-end md:items-center justify-center md:p-4"
          onClick={handleClose}
        >
          {/* Modal Desktop/Tablet (≥768px) */}
          <motion.div
            variants={desktopModalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="hidden md:flex relative bg-background border-2 border-empanada-golden/20 rounded-2xl shadow-2xl overflow-hidden"
            style={{ maxWidth: maxWidth === "max-w-4xl" ? "42rem" : null, maxHeight, width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-empanada-light-gray bg-gray-50 dark:bg-empanada-dark flex-shrink-0">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                {icon && (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-empanada-golden/10 flex-shrink-0">
                    <span className="text-empanada-golden">{icon}</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {title && (
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-empanada-medium ml-2 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Contenido del modal */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {children}
              </div>
            </div>

            {/* Footer del modal */}
            {footer && (
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-empanada-light-gray bg-gray-50 dark:bg-empanada-dark flex-shrink-0">
                {footer}
              </div>
            )}
          </motion.div>

          {/* Modal Mobile (<768px) */}
          <motion.div
            {...(allowDragClose && {
              drag: "y",
              dragConstraints: { top: 0, bottom: 0 },
              dragElastic: { top: 0, bottom: 0.25 },
              onDragEnd: handleDragEnd
            })}
            variants={mobileModalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden absolute inset-x-0 bottom-0 bg-background rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            {(showDragHandle || allowDragClose) && (
              <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
              </div>
            )}

            {/* Header del modal mobile */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-empanada-light-gray bg-gray-50 dark:bg-empanada-dark flex-shrink-0">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                {icon && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-empanada-golden/10 flex-shrink-0">
                    <span className="text-empanada-golden text-sm">{icon}</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {title && (
                    <h2 className="text-base font-semibold text-gray-800 dark:text-white truncate">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-empanada-medium ml-2 flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Contenido del modal mobile */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 pb-safe">
                {children}
              </div>
            </div>

            {/* Footer del modal mobile */}
            {footer && (
              <div className="flex flex-col gap-2 p-4 border-t border-gray-200 dark:border-empanada-light-gray bg-gray-50 dark:bg-empanada-dark flex-shrink-0 pb-safe">
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