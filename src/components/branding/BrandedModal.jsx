import { Button } from "@/components/ui/button";
import { Portal } from "@/components/common/Portal";
import { X } from "lucide-react";

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
  if (!isOpen) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className={`bg-background border border-border rounded-lg shadow-xl ${maxWidth} w-full ${maxHeight} overflow-hidden`}>
          {/* Header del modal */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              {title && (
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {icon && <span className="text-empanada-golden">{icon}</span>}
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Contenido del modal */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer del modal */}
          {footer && (
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 dark:bg-gray-900">
              {footer}
            </div>
          )}
        </div>
      </div>
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
  isLoading = false
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
        className="bg-empanada-golden hover:bg-empanada-golden/90"
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