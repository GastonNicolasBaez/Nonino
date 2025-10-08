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
  loading,
  requiredSteps = []
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
        initial={false}
        animate={{
          bottom: 0,
          height: isExpanded ? '75vh' : 'auto'
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 300,
          duration: 0.3
        }}
        style={{
          overflow: 'hidden'
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
        <div className="px-4 pb-3">
          {/* Información del paso actual */}
          <div className="mb-2">
            {/* Header del paso */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xl">{getStepInfo(currentStep).icon}</span>
                <span className="text-xs text-gray-400">
                  Paso {requiredSteps.indexOf(currentStep) + 1} de {requiredSteps.filter(s => getStepInfo(s).required > 0).length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white h-8 w-8"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Título y descripción */}
            <h3 className="font-bold text-white text-base mb-0.5">
              Seleccioná tus {getStepInfo(currentStep).label}
            </h3>
            <p className="text-xs text-gray-400 mb-2">
              Elegí los sabores que más te gusten
            </p>

            {/* Contador grande */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className={cn(
                  "text-3xl font-bold transition-colors",
                  getSelectionCount(currentStep) > getStepInfo(currentStep).required
                    ? "text-red-500"
                    : isStepComplete(currentStep)
                    ? "text-green-500"
                    : "text-empanada-golden"
                )}>
                  {getSelectionCount(currentStep)}/{getStepInfo(currentStep).required}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {getSelectionCount(currentStep) > getStepInfo(currentStep).required ? (
                    <span className="text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {getSelectionCount(currentStep) - getStepInfo(currentStep).required} de más
                    </span>
                  ) : isStepComplete(currentStep) ? (
                    <span className="text-green-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Completado
                    </span>
                  ) : (
                    `Faltan ${getStepInfo(currentStep).required - getSelectionCount(currentStep)}`
                  )}
                </p>
              </div>
            </div>

            {/* Barra de progreso del paso actual */}
            <div className="w-full bg-empanada-dark rounded-full h-1.5 overflow-hidden mb-2">
              <motion.div
                className={cn(
                  "h-full rounded-full transition-colors",
                  getSelectionCount(currentStep) > getStepInfo(currentStep).required
                    ? "bg-gradient-to-r from-red-600 to-red-400"
                    : isStepComplete(currentStep)
                    ? "bg-gradient-to-r from-green-600 to-green-400"
                    : "bg-gradient-to-r from-empanada-golden to-empanada-warm"
                )}
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((getSelectionCount(currentStep) / getStepInfo(currentStep).required) * 100, 100)}%`
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

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
        {isExpanded && (
          <div className="px-4 pb-6 overflow-y-auto max-h-[calc(75vh-140px)]">

              {/* Nombre del combo y precio */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-empanada-light-gray">
                <div className="flex items-center gap-2.5">
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
                <div className="text-right">
                  <p className="text-xl font-bold text-empanada-golden">
                    {formatPrice(totalPrice)}
                  </p>
                </div>
              </div>

              {/* Indicadores de progreso por paso */}
              <div className="space-y-2 mb-4">
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
                        "flex items-center justify-between p-2.5 rounded-lg transition-all",
                        "border",
                        isCurrent
                          ? "bg-empanada-golden/10 border-empanada-golden"
                          : complete
                          ? "bg-green-900/20 border-green-600"
                          : "bg-empanada-dark border-empanada-light-gray"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{stepInfo.icon}</span>
                        <span
                          className={cn(
                            "text-xs font-medium",
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
                            "text-xs font-bold",
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
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lista de productos seleccionados */}
              {groupedSelections.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Tu Selección
                  </p>

                  <div className="space-y-1.5">
                    {groupedSelections.map((group) => (
                      <div
                        key={group.categoryType}
                        className="bg-empanada-dark rounded-lg p-2.5"
                      >
                        <p className="text-xs font-semibold text-empanada-golden mb-1.5">
                          {group.icon} {group.label}
                        </p>
                        <ul className="space-y-0.5">
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
              <div className="space-y-2">
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
                <div className="text-xs text-gray-400 text-center p-2.5 bg-empanada-dark rounded-lg mt-3">
                  💡 Completá todos los pasos para agregar tu combo al carrito
                </div>
              )}
          </div>
        )}
      </motion.div>
    </>
  );
}
