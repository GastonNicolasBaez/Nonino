import PropTypes from 'prop-types';
import { BrandedModal, BrandedModalFooter } from './BrandedModal';
import { AlertTriangle, Trash2, Info, HelpCircle } from 'lucide-react';

/**
 * ConfirmModal - Componente de confirmación usando BrandedModal
 * Se mantiene compatible con la API original pero usa el sistema de branding
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
    type = "warning", // warning, danger, info, question
    maxWidth = "max-w-md"
}) {
    // Definir iconos y estilos según el tipo
    const getTypeConfig = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: icon || <Trash2 className="w-5 h-5" />,
                    confirmVariant: 'destructive'
                };
            case 'info':
                return {
                    icon: icon || <Info className="w-5 h-5" />,
                    confirmVariant: 'default'
                };
            case 'question':
                return {
                    icon: icon || <HelpCircle className="w-5 h-5" />,
                    confirmVariant: 'default'
                };
            case 'warning':
            default:
                return {
                    icon: icon || <AlertTriangle className="w-5 h-5" />,
                    confirmVariant: 'default'
                };
        }
    };

    const typeConfig = getTypeConfig();

    return (
        <BrandedModal
            isOpen={isOpen}
            onClose={onCancel}
            title={title}
            subtitle={message}
            icon={typeConfig.icon}
            maxWidth={maxWidth}
            footer={
                <BrandedModalFooter
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                    cancelText={cancelLabel}
                    confirmText={confirmLabel}
                    isLoading={isLoading}
                    // Usar estilo personalizado para botón de confirmación según tipo
                    confirmButtonClass={type === 'danger' ? 'bg-red-600 hover:bg-red-700' : undefined}
                />
            }
        >
            {/* El mensaje ya se muestra como subtitle, pero podemos agregar contenido extra aquí si es necesario */}
        </BrandedModal>
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
    type: PropTypes.oneOf(['warning', 'danger', 'info', 'question']),
    maxWidth: PropTypes.string
};

/**
 * ConfirmModal flotante (estilo toast) - Mantiene la funcionalidad original
 * Para casos donde se necesita el comportamiento de toast flotante
 */
export function FloatingConfirmModal({
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
            <div className="shadow-2xl border-2 border-empanada-golden bg-white dark:bg-empanada-dark rounded-lg">
                <div className="p-4">
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
                            <button
                                onClick={onCancel}
                                disabled={isLoading}
                                className="h-9 px-3 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-1 text-sm"
                            >
                                {cancelLabel}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="h-9 px-4 bg-empanada-golden text-white rounded-md hover:bg-empanada-golden/90 flex items-center gap-1 text-sm font-semibold"
                            >
                                {isLoading ? "Procesando..." : confirmLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

