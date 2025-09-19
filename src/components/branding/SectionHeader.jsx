import PropTypes from 'prop-types';
import { Button } from '@/components/ui/button';

/**
 * SectionHeader - Componente reutilizable para headers de sección
 * 
 * @param {Object} props
 * @param {string} props.title - Título principal de la sección
 * @param {string} props.subtitle - Subtítulo descriptivo
 * @param {React.ReactNode} props.icon - Icono opcional para el título
 * @param {Array} props.actions - Array de acciones (botones) para el header
 * @param {string} props.className - Clases CSS adicionales
 */
export function SectionHeader({ 
    title, 
    subtitle, 
    icon, 
    actions = [], 
    className = "" 
}) {
    return (
        <div className={`flex justify-between items-center ${className}`}>
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    {icon && <span className="text-empanada-golden">{icon}</span>}
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm text-muted-foreground">
                        {subtitle}
                    </p>
                )}
            </div>
            {actions.length > 0 && (
                <div className="flex gap-2">
                    {actions.map((action, index) => (
                        <Button
                            key={index}
                            variant={action.variant || "outline"}
                            size={action.size || "sm"}
                            onClick={action.onClick}
                            disabled={action.disabled}
                            className={action.className}
                        >
                            {action.icon && <span className="mr-1">{action.icon}</span>}
                            {action.label}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}

SectionHeader.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    icon: PropTypes.node,
    actions: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        variant: PropTypes.string,
        size: PropTypes.string,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        icon: PropTypes.node
    })),
    className: PropTypes.string
};

