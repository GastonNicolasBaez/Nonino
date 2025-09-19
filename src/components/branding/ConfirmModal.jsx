import PropTypes from 'prop-types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, RefreshCw } from 'lucide-react';

/**
 * ConfirmModal - Componente reutilizable para modales de confirmación flotantes
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {string} props.title - Título del modal
 * @param {string} props.message - Mensaje descriptivo
 * @param {string} props.confirmLabel - Texto del botón de confirmación
 * @param {string} props.cancelLabel - Texto del botón de cancelación
 * @param {function} props.onConfirm - Función a ejecutar al confirmar
 * @param {function} props.onCancel - Función a ejecutar al cancelar
 * @param {boolean} props.isLoading - Estado de carga
 * @param {React.ReactNode} props.icon - Icono del modal
 * @param {string} props.count - Contador o información adicional
 * @param {string} props.className - Clases CSS adicionales
 */
export function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    onConfirm,
    onCancel,
    isLoading = false,
    icon,
    count,
    className = ""
}) {
    if (!isOpen) return null;

    return (
        <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
            <Card className="shadow-2xl border-2 border-empanada-golden bg-white dark:bg-gray-800">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        {icon && (
                            <div className="text-center">
                                <div className="w-12 h-12 bg-empanada-golden rounded-full flex items-center justify-center mb-2">
                                    {icon}
                                </div>
                                {count && (
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        {count}
                                    </p>
                                )}
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="font-bold text-base text-gray-900 dark:text-white">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {message}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onCancel}
                                disabled={isLoading}
                                className="h-9 px-3"
                            >
                                <X className="w-3 h-3 mr-1" />
                                {cancelLabel}
                            </Button>
                            <Button
                                variant="empanada"
                                size="sm"
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="h-9 px-4 font-semibold"
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    confirmLabel
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

ConfirmModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    confirmLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    icon: PropTypes.node,
    count: PropTypes.string,
    className: PropTypes.string
};

