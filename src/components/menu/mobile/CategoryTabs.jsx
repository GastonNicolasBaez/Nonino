import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Tabs horizontales scrollables para categorías
 * Patrón común en apps mobile (Instagram Stories, TikTok, etc)
 */

export function CategoryTabs({
  categories = [],
  selectedCategory,
  onSelectCategory,
  className = ''
}) {
  const scrollContainerRef = useRef(null);
  const selectedTabRef = useRef(null);

  // Auto-scroll al tab seleccionado
  useEffect(() => {
    if (selectedTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const tab = selectedTabRef.current;

      // Calcular posición para centrar el tab
      const containerWidth = container.offsetWidth;
      const tabLeft = tab.offsetLeft;
      const tabWidth = tab.offsetWidth;
      const scrollLeft = tabLeft - (containerWidth / 2) + (tabWidth / 2);

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [selectedCategory]);

  // Agregar categoría "Todas"
  const allCategories = [
    { id: 'all', name: 'Todas', icon: '🍽️' },
    ...categories
  ];

  return (
    <div className={cn("relative", className)}>
      {/* Gradient fade en los bordes para indicar scroll */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-empanada-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-empanada-dark to-transparent z-10 pointer-events-none" />

      {/* Contenedor scrolleable */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide overscroll-contain"
        style={{
          scrollSnapType: 'x proximity',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex gap-2 px-4 py-3">
          {allCategories.map((category) => {
            const isSelected = selectedCategory === category.id;

            return (
              <motion.button
                key={category.id}
                ref={isSelected ? selectedTabRef : null}
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-full",
                  "font-medium text-sm whitespace-nowrap transition-all duration-200",
                  "flex-shrink-0",
                  isSelected
                    ? "bg-empanada-golden text-white shadow-lg shadow-empanada-golden/20"
                    : "bg-empanada-medium text-gray-300 hover:bg-empanada-light-gray"
                )}
                whileTap={{ scale: 0.95 }}
                style={{ scrollSnapAlign: 'center' }}
              >
                {/* Icono */}
                <span className="text-lg">{category.icon}</span>

                {/* Nombre */}
                <span>{category.name}</span>

                {/* Indicador de selección */}
                {isSelected && (
                  <motion.div
                    layoutId="categoryIndicator"
                    className="absolute inset-0 bg-empanada-golden rounded-full"
                    style={{ zIndex: -1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
