import { useState, useEffect, useRef } from 'react';

/**
 * Hook personalizado para calcular la posición óptima de dropdowns
 * Evita que se corten en modales y contenedores con overflow
 */
export function useDropdownPosition(triggerRef, isOpen, options = []) {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [shouldRenderAbove, setShouldRenderAbove] = useState(false);
  const positionRef = useRef(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Calcular altura estimada del dropdown
      const itemHeight = 40; // Altura aproximada por item
      const padding = 8; // Padding del dropdown
      const maxItems = 5; // Máximo de items visibles
      const dropdownHeight = Math.min(options.length * itemHeight + padding, maxItems * itemHeight + padding);
      
      // Calcular espacio disponible
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Determinar si mostrar arriba o abajo
      const renderAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
      setShouldRenderAbove(renderAbove);
      
      // Calcular posición vertical
      let top = rect.bottom + window.scrollY;
      if (renderAbove) {
        top = rect.top + window.scrollY - dropdownHeight;
      }
      
      // Calcular posición horizontal
      let left = rect.left + window.scrollX;
      const dropdownWidth = Math.max(rect.width, 200); // Ancho mínimo
      
      // Ajustar si se sale por la derecha
      if (left + dropdownWidth > viewportWidth + window.scrollX) {
        left = viewportWidth + window.scrollX - dropdownWidth - 10; // Margen de 10px
      }
      
      // Ajustar si se sale por la izquierda
      if (left < window.scrollX) {
        left = window.scrollX + 10; // Margen de 10px
      }
      
      setPosition({
        top,
        left,
        width: dropdownWidth,
        height: dropdownHeight
      });
    }
  }, [isOpen, options.length, triggerRef]);

  return {
    position,
    shouldRenderAbove,
    positionRef
  };
}
