import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Portal } from '@/components/common/Portal';
import { cn } from '@/lib/utils';

/**
 * Tooltip simple y directo que se posiciona correctamente sobre el botón +
 */
export function SimpleTooltip({
  children,
  content,
  isVisible = false,
  triggerElement = null,
  className = '',
  isMobile = false
}) {
  if (!isVisible || !triggerElement) {
    return children;
  }

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !triggerElement) {
      return;
    }

    const updatePosition = () => {
      const rect = triggerElement.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const gap = 12; // espacio entre tooltip y botón
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Si el tooltip ya está renderizado, usar sus dimensiones reales
      if (tooltipRef.current) {
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        
        // Calcular posición ideal (centrada sobre el botón)
        let x = rect.left + scrollX + (rect.width / 2) - (tooltipRect.width / 2);
        let y = rect.top + scrollY - tooltipRect.height - gap;
        
        // Detectar colisiones horizontales
        if (x < 10) {
          x = 10; // Margen mínimo del borde izquierdo
        } else if (x + tooltipRect.width > viewportWidth - 10) {
          x = viewportWidth - tooltipRect.width - 10; // Margen mínimo del borde derecho
        }
        
        // Detectar colisiones verticales
        if (y < 10) {
          y = rect.bottom + scrollY + gap; // Posicionar abajo del botón si no cabe arriba
        } else if (y + tooltipRect.height > viewportHeight - 10) {
          y = viewportHeight - tooltipRect.height - 10; // Ajustar al borde inferior
        }
        
        setPosition({ x, y });
      } else {
        // Usar dimensiones estimadas para el cálculo inicial
        const estimatedTooltipHeight = isMobile ? 45 : 60; // altura estimada en px
        const estimatedTooltipWidth = isMobile ? 250 : 320; // ancho estimado basado en max-w
        
        // Calcular posición ideal
        let x = rect.left + scrollX + (rect.width / 2) - (estimatedTooltipWidth / 2);
        let y = rect.top + scrollY - estimatedTooltipHeight - gap;
        
        // Detectar colisiones horizontales
        if (x < 10) {
          x = 10;
        } else if (x + estimatedTooltipWidth > viewportWidth - 10) {
          x = viewportWidth - estimatedTooltipWidth - 10;
        }
        
        // Detectar colisiones verticales
        if (y < 10) {
          y = rect.bottom + scrollY + gap; // Posicionar abajo del botón
        } else if (y + estimatedTooltipHeight > viewportHeight - 10) {
          y = viewportHeight - estimatedTooltipHeight - 10;
        }
        
        setPosition({ x, y });
      }
    };

    // Usar setTimeout para asegurar que el DOM se haya actualizado
    const timeoutId = setTimeout(updatePosition, 0);
    
    // También actualizar después de que el tooltip se renderice completamente
    const timeoutId2 = setTimeout(updatePosition, 10);
    
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, triggerElement]);

  return (
    <>
      {children}
      <Portal>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ 
              duration: 0.2,
              ease: [0.4, 0.0, 0.2, 1]
            }}
            className="fixed pointer-events-none z-[99999]"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`
            }}
          >
            <div
              ref={tooltipRef}
              className={cn(
                'relative rounded-lg shadow-2xl backdrop-blur-sm',
                'bg-gray-800/95 border border-gray-600/50 text-white',
                'text-center',
                isMobile 
                  ? 'px-3 py-2 max-w-[250px]' 
                  : 'px-4 py-3 min-w-[280px] max-w-[320px]',
                className
              )}
            >
              {/* Contenido del tooltip */}
              <div className={cn(
                'leading-relaxed',
                isMobile ? 'text-xs' : 'text-sm'
              )}>
                {typeof content === 'string' ? (
                  <p className={isMobile ? 'whitespace-normal' : 'whitespace-nowrap'}>
                    {content}
                  </p>
                ) : (
                  content
                )}
              </div>

              {/* Flecha apuntando hacia abajo */}
              <div className="absolute left-1/2 top-full -translate-x-1/2 -mt-px">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-800/95"></div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Portal>
    </>
  );
}
