import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Bottom Sheet para filtros de categoría
 * Patrón común en apps de delivery (UberEats, Rappi, Google Maps)
 */

export function FilterBottomSheet({
  isOpen,
  onClose,
  categories = [],
  selectedCategory,
  onSelectCategory,
  appliedFiltersCount = 0
}) {
  if (!isOpen) return null;

  // Agregar categoría "Todas"
  const allCategories = [
    { id: 'all', name: 'Todas las categorías', icon: '🍽️' },
    ...categories
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300
            }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-empanada-dark rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden"
          >
            {/* Handle para swipe */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-empanada-light-gray rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-empanada-light-gray">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-empanada-golden/10 rounded-full flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5 text-empanada-golden" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Filtros</h2>
                  {appliedFiltersCount > 0 && (
                    <p className="text-xs text-gray-400">
                      {appliedFiltersCount} filtro{appliedFiltersCount > 1 ? 's' : ''} aplicado{appliedFiltersCount > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Contenido scrolleable */}
            <div className="overflow-y-auto overscroll-contain max-h-[calc(85vh-180px)] px-6 py-6 space-y-8">
              {/* Sección Categorías */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  Categorías
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {allCategories.map((category) => {
                    const isSelected = selectedCategory === category.id;

                    return (
                      <motion.button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id)}
                        className={cn(
                          "relative flex items-center gap-3 p-4 rounded-xl transition-all",
                          "border-2",
                          isSelected
                            ? "bg-empanada-golden/10 border-empanada-golden"
                            : "bg-empanada-medium border-empanada-light-gray hover:border-empanada-golden/50"
                        )}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="text-2xl">{category.icon}</span>
                        <div className="flex-1 text-left">
                          <p className={cn(
                            "text-sm font-medium",
                            isSelected ? "text-empanada-golden" : "text-white"
                          )}>
                            {category.name}
                          </p>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 bg-empanada-golden rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer con botones */}
            <div className="border-t border-empanada-light-gray px-6 py-4 bg-empanada-medium">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    onSelectCategory('all');
                  }}
                >
                  Limpiar Filtros
                </Button>
                <Button
                  variant="empanada"
                  className="flex-1"
                  onClick={onClose}
                >
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Botón flotante para abrir filtros
 * Muestra badge con cantidad de filtros aplicados
 */
export function FilterButton({ onClick, appliedFiltersCount = 0 }) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="relative flex items-center gap-2 bg-empanada-dark border-empanada-light-gray hover:border-empanada-golden text-white"
    >
      <SlidersHorizontal className="w-4 h-4" />
      <span>Filtros</span>
      {appliedFiltersCount > 0 && (
        <Badge className="absolute -top-2 -right-2 bg-empanada-golden text-white w-6 h-6 flex items-center justify-center p-0 rounded-full">
          {appliedFiltersCount}
        </Badge>
      )}
    </Button>
  );
}
