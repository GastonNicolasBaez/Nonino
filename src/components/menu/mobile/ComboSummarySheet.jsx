import { useState } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
  Package,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Check,
  AlertTriangle,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { CATEGORY_TYPES } from '@/config/constants';

/**
 * Bottom Sheet colapsable para resumen del combo en mobile
 * Patrón UberEats/Rappi: Peek view colapsable con swipe
 */

export function ComboSummarySheet({
  selectedCombo,
  currentStep,
  selections,
  products = [],
  onContinue,
  onAddToCart,
  onBack,
  isComplete,
  loading
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dragControls = useDragControls();

  if (!selectedCombo) return null;

  // Calcular totales por categoría
  const getStepInfo = (step) => {
    const stepData = {
      EMPANADAS: {
        label: 'Empanadas',
        icon: '🥟',
        required: selectedCombo.components?.filter(c =>
          CATEGORY_TYPES.EMPANADAS.includes(c.categoryId)
        ).reduce((sum, c) => sum + c.quantity, 0) || 0
      },
      BEBIDAS: {
        label: 'Bebidas',
        icon: '🥤',
        required: selectedCombo.components?.filter(c =>
          CATEGORY_TYPES.BEBIDAS.includes(c.categoryId)
        ).reduce((sum, c) => sum + c.quantity, 0) || 0
      },
      POSTRES: {
        label: 'Postres',
        icon: '🍰',
        required: selectedCombo.components?.filter(c =>
          CATEGORY_TYPES.POSTRES.includes(c.categoryId)
        ).reduce((sum, c) => sum + c.quantity, 0) || 0
      }
    };
    return stepData[step] || {};
  };

  const getSelectionCount = (step) => {
    if (!selections[step]) return 0;
    return Object.values(selections[step]).reduce((sum, qty) => sum + qty, 0);
  };

  const isStepComplete = (step) => {
    const stepInfo = getStepInfo(step);
    const count = getSelectionCount(step);
    return count >= stepInfo.required;
  };

  // Lista de productos seleccionados
  const getGroupedSelections = () => {
    const grouped = [];

    Object.keys(selections).forEach(categoryType => {
      const stepInfo = getStepInfo(categoryType);
      const items = selections[categoryType];

      if (items && Object.keys(items).length > 0) {
        grouped.push({
          categoryType,
          label: stepInfo.label,
          icon: stepInfo.icon,
          items: Object.entries(items)
            .filter(([_, qty]) => qty > 0)
            .map(([productId, quantity]) => ({
              productId,
              quantity
            }))
        });
      }
    });

    return grouped;
  };

  const groupedSelections = getGroupedSelections();
  const totalItems = groupedSelections.reduce((sum, group) => {
    return sum + group.items.reduce((s, item) => s + item.quantity, 0);
  }, 0);

  const totalPrice = selectedCombo.price;

  // Handle para drag
  const handleDragEnd = (event, info) => {
    if (info.offset.y > 50) {
      setIsExpanded(false);
    } else if (info.offset.y < -50) {
      setIsExpanded(true);
    }
  };

  return (
    <>
      {/* Backdrop cuando está expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Bottom Sheet */}
      <motion.div
        drag="y"
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={{
          bottom: 0,
          height: isExpanded ? '80vh' : 'auto'
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 300
        }}
        className="fixed left-0 right-0 z-50 bg-empanada-medium rounded-t-3xl shadow-2xl border-t-2 border-empanada-golden"
      >
        {/* Handle para drag */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="w-12 h-1 bg-empanada-light-gray rounded-full" />
        </div>

        {/* Peek View - Siempre visible */}
        <div
          className="px-4 pb-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-empanada-golden/10 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-empanada-golden" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  {selectedCombo.name}
                </h3>
                <p className="text-xs text-gray-400">
                  {totalItems} {totalItems === 1 ? 'producto' : 'productos'} seleccionados
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xl font-bold text-empanada-golden">
                  {formatPrice(totalPrice)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Progress bar inline */}
          {!isExpanded && (
            <div className="flex items-center gap-2 mb-3">
              {['EMPANADAS', 'BEBIDAS', 'POSTRES'].map((step) => {
                const stepInfo = getStepInfo(step);
                if (stepInfo.required === 0) return null;

                const complete = isStepComplete(step);
                const isCurrent = currentStep === step;

                return (
                  <div
                    key={step}
                    className={cn(
                      "flex-1 h-1.5 rounded-full transition-all",
                      isCurrent
                        ? "bg-empanada-golden"
                        : complete
                        ? "bg-green-600"
                        : "bg-empanada-dark"
                    )}
                  />
                );
              })}
            </div>
          )}

          {/* Botón CTA principal - Peek view */}
          {!isExpanded && (
            <div className="flex gap-2">
              {!isComplete ? (
                <Button
                  variant="empanada"
                  size="lg"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onContinue();
                  }}
                  disabled={!isStepComplete(currentStep)}
                >
                  {isStepComplete(currentStep) ? (
                    <>
                      Continuar
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Completá este paso
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="empanada"
                  size="lg"
                  className="flex-1 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart();
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Agregando...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Agregar al Carrito
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Expanded View - Solo cuando está expandido */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-4 pb-6 overflow-y-auto max-h-[calc(80vh-180px)]"
            >
              {/* Indicadores de progreso por paso */}
              <div className="space-y-3 mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Progreso del Combo
                </p>

                {['EMPANADAS', 'BEBIDAS', 'POSTRES'].map((step) => {
                  const stepInfo = getStepInfo(step);
                  if (stepInfo.required === 0) return null;

                  const count = getSelectionCount(step);
                  const complete = isStepComplete(step);
                  const isCurrent = currentStep === step;

                  return (
                    <div
                      key={step}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg transition-all",
                        "border-2",
                        isCurrent
                          ? "bg-empanada-golden/10 border-empanada-golden"
                          : complete
                          ? "bg-green-900/20 border-green-600"
                          : "bg-empanada-dark border-empanada-light-gray"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{stepInfo.icon}</span>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isCurrent
                              ? "text-empanada-golden"
                              : complete
                              ? "text-green-400"
                              : "text-gray-400"
                          )}
                        >
                          {stepInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm font-bold",
                            isCurrent
                              ? "text-empanada-golden"
                              : complete
                              ? "text-green-400"
                              : "text-gray-400"
                          )}
                        >
                          {count}/{stepInfo.required}
                        </span>
                        {complete && (
                          <Check className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lista de productos seleccionados */}
              {groupedSelections.length > 0 && (
                <div className="space-y-3 mb-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Tu Selección
                  </p>

                  <div className="space-y-2">
                    {groupedSelections.map((group) => (
                      <div
                        key={group.categoryType}
                        className="bg-empanada-dark rounded-lg p-3"
                      >
                        <p className="text-xs font-semibold text-empanada-golden mb-2">
                          {group.icon} {group.label}
                        </p>
                        <ul className="space-y-1">
                          {group.items.map((item) => (
                            <li
                              key={item.productId}
                              className="text-sm text-gray-300 flex items-center justify-between"
                            >
                              <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-empanada-golden rounded-full"></span>
                                <span className="text-xs">Producto #{item.productId}</span>
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs border-empanada-golden text-empanada-golden"
                              >
                                {item.quantity}x
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="space-y-3">
                {!isComplete ? (
                  <Button
                    variant="empanada"
                    size="lg"
                    className="w-full"
                    onClick={onContinue}
                    disabled={!isStepComplete(currentStep)}
                  >
                    {isStepComplete(currentStep) ? (
                      <>
                        Continuar
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Completá este paso
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="empanada"
                    size="lg"
                    className="w-full shadow-lg"
                    onClick={onAddToCart}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Agregando...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Agregar al Carrito
                      </>
                    )}
                  </Button>
                )}

                {onBack && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={onBack}
                  >
                    Volver
                  </Button>
                )}
              </div>

              {!isComplete && (
                <div className="text-xs text-gray-400 text-center p-3 bg-empanada-dark rounded-lg mt-4">
                  💡 Completá todos los pasos para agregar tu combo al carrito
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
