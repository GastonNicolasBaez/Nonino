import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * ScrollIndicator - Indicador visual de progreso de scroll
 * 
 * Este componente muestra una línea fina en la parte superior
 * que indica el progreso de scroll de la página.
 * Es especialmente útil en dispositivos móviles donde no hay scrollbars visibles.
 */
export function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  
  // Convertir a progreso suave para mejor UX
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Solo mostrar cuando hay contenido para hacer scroll
  useEffect(() => {
    const checkScrollability = () => {
      const hasScrollableContent = document.body.scrollHeight > window.innerHeight;
      setIsVisible(hasScrollableContent);
    };

    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    window.addEventListener('load', checkScrollability);

    return () => {
      window.removeEventListener('resize', checkScrollability);
      window.removeEventListener('load', checkScrollability);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Línea de progreso */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-empanada-golden z-[999] origin-left"
        style={{ scaleX }}
      />
      
      {/* Glow effect opcional para mejor visibilidad */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-empanada-golden to-empanada-golden/50 z-[999] origin-left blur-sm"
        style={{ 
          scaleX,
          width: '100px',
          opacity: 0.7
        }}
      />
    </>
  );
}
