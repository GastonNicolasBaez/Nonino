import PropTypes from 'prop-types';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

/**
 * EmptyState - Componente reutilizable para estados vacíos
 * 
 * @param {Object} props
 * @param {string} props.title - Título del estado vacío
 * @param {string} props.message - Mensaje descriptivo
 * @param {React.ReactNode} props.icon - Icono del estado vacío
 * @param {React.ReactNode} props.action - Acción opcional (botón, etc.)
 * @param {string} props.className - Clases CSS adicionales
 */
export function EmptyState({
    title,
    message,
    icon,
    action,
    className = ""
}) {
    return (
        <Card className={className}>
            <CardContent className="p-12 text-center">
                {icon || <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {title}
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-4">
                    {message}
                </p>
                {action && action}
            </CardContent>
        </Card>
    );
}

EmptyState.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    icon: PropTypes.node,
    action: PropTypes.node,
    className: PropTypes.string
};

