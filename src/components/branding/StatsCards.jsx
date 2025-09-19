import PropTypes from 'prop-types';
import { Card, CardContent } from '@/components/ui/card';

/**
 * StatsCards - Componente reutilizable para mostrar métricas en cards
 * 
 * @param {Object} props
 * @param {Array} props.stats - Array de objetos con métricas
 * @param {string} props.className - Clases CSS adicionales
 * @param {string} props.gridCols - Clases de grid (ej: "grid-cols-1 md:grid-cols-4")
 */
export function StatsCards({ 
    stats = [], 
    className = "", 
    gridCols = "grid-cols-1 md:grid-cols-4" 
}) {
    return (
        <div className={`grid ${gridCols} gap-4 ${className}`}>
            {stats.map((stat, index) => {
                // Determinar si la card tiene contenido crítico
                const hasContent = stat.value && stat.value !== "0" && stat.value !== "$0,00" && stat.value !== 0;
                const isCritical = stat.color === 'red';
                
                // Texto blanco para cards no críticas con contenido, o mantener color original
                const textColor = !isCritical && hasContent ? 'text-white' : `text-${stat.color || 'gray'}-500`;
                const iconColor = !isCritical && hasContent ? 'text-white' : `text-${stat.color || 'gray'}-500`;
                
                return (
                    <Card 
                        key={stat.id || index} 
                        className={`border-l-4 border-l-${stat.color || 'gray'}-500 ${
                            isCritical ? 'bg-red-100 dark:bg-red-900/30' : ''
                        }`}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        {stat.label}
                                    </p>
                                    <p className={`text-xl font-bold ${textColor}`}>
                                        {stat.value}
                                    </p>
                                </div>
                                {stat.icon && (
                                    <span className={iconColor}>
                                        {stat.icon}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

StatsCards.propTypes = {
    stats: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        color: PropTypes.string,
        icon: PropTypes.node
    })),
    className: PropTypes.string,
    gridCols: PropTypes.string
};

