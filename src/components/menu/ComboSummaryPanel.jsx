import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, ChevronRight, Package, AlertTriangle, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function ComboSummaryPanel({
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
  if (!selectedCombo) {
    return (
      <div className="bg-empanada-medium rounded-lg border border-empanada-light-gray p-6">
        <div className="text-center text-gray-400">
          <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>Seleccioná un combo para comenzar</p>
        </div>
      </div>
    );
  }

  // Obtener cantidad requerida por categoryId desde selectionSpec.rules
  const getRequiredQuantity = (categoryId) => {
    if (!selectedCombo.selectionSpec?.rules) return 0;
    
    return selectedCombo.selectionSpec.rules
      .filter(rule => rule.categoryId === categoryId)
      .reduce((sum, rule) => sum + rule.units, 0);
  };

  // Obtener nombre de la categoría por ID
  const getCategoryName = (categoryId) => {
    if (!selectedCombo.selectionSpec?.categoryIds || !selectedCombo.selectionSpec?.categoryNames) {
      return `Categoría ${categoryId}`;
    }
    
    const index = selectedCombo.selectionSpec.categoryIds.findIndex(id => id === categoryId);
    return index !== -1 ? selectedCombo.selectionSpec.categoryNames[index] : `Categoría ${categoryId}`;
  };

  // Obtener icono según el nombre de la categoría
  const getCategoryIcon = (categoryId) => {
    const categoryName = getCategoryName(categoryId).toLowerCase();
    
    if (categoryName.includes('empanada') || categoryName.includes('tradicional') || categoryName.includes('especial')) {
      return '🥟';
    }
    if (categoryName.includes('bebida')) {
      return '🥤';
    }
    if (categoryName.includes('postre')) {
      return '🍰';
    }
    return '📦';
  };

  // Calcular info del paso por categoryId
  const getStepInfo = (categoryId) => {
    return {
      label: getCategoryName(categoryId),
      icon: getCategoryIcon(categoryId),
      required: getRequiredQuantity(categoryId)
    };
  };

  // Contar selecciones por paso
  const getSelectionCount = (categoryId) => {
    if (!selections[categoryId]) return 0;
    return Object.values(selections[categoryId]).reduce((sum, qty) => sum + qty, 0);
  };

  // Verificar si un paso está completo
  const isStepComplete = (categoryId) => {
    const required = getRequiredQuantity(categoryId);
    const count = getSelectionCount(categoryId);
    return count >= required;
  };

  // Lista de productos seleccionados agrupados
  const getGroupedSelections = () => {
    const grouped = [];
    
    Object.keys(selections).forEach(categoryIdStr => {
      const categoryId = parseInt(categoryIdStr);
      const stepInfo = getStepInfo(categoryId);
      const items = selections[categoryIdStr];
      
      if (items && Object.keys(items).length > 0) {
        grouped.push({
          categoryType: categoryIdStr,
          label: stepInfo.label,
          icon: stepInfo.icon,
          items: Object.entries(items)
            .filter(([_, qty]) => qty > 0)
            .map(([productId, quantity]) => {
              const product = products.find(p => p.id === parseInt(productId));
              return {
                productId,
                productName: product?.name || `Producto #${productId}`,
                quantity
              };
            })
        });
      }
    });
    
    return grouped;
  };

  const groupedSelections = getGroupedSelections();
  const totalItems = groupedSelections.reduce((sum, group) => {
    return sum + group.items.reduce((s, item) => s + item.quantity, 0);
  }, 0);

  // Precio del combo (fijo)
  const totalPrice = selectedCombo.price;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-empanada-medium rounded-lg border-2 border-empanada-light-gray p-6 space-y-6 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto"
    >
      {/* Header del combo */}
      <div>
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 bg-empanada-golden/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-empanada-golden" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-white leading-tight">
              {selectedCombo.name}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {selectedCombo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Indicadores de progreso por paso */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Progreso del Combo
        </p>
        
        {requiredSteps.map((categoryId) => {
          const stepInfo = getStepInfo(categoryId);
          if (stepInfo.required === 0) return null;

          const count = getSelectionCount(categoryId);
          const complete = isStepComplete(categoryId);
          const isCurrent = currentStep === categoryId;

          return (
            <motion.div
              key={categoryId}
              layout
              className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-all",
                isCurrent
                  ? "bg-empanada-golden/10 border border-empanada-golden"
                  : complete
                  ? "bg-green-900/20 border border-green-600"
                  : "bg-empanada-dark border border-empanada-light-gray"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{stepInfo.icon}</span>
                <span className={cn(
                  "text-sm font-medium",
                  isCurrent ? "text-empanada-golden" : complete ? "text-green-400" : "text-gray-400"
                )}>
                  {stepInfo.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-sm font-bold",
                  isCurrent ? "text-empanada-golden" : complete ? "text-green-400" : "text-gray-400"
                )}>
                  {count}/{stepInfo.required}
                </span>
                {complete && (
                  <Check className="w-4 h-4 text-green-400" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lista de productos seleccionados */}
      {groupedSelections.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Tu Selección
          </p>
          
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {groupedSelections.map((group) => (
                <motion.div
                  key={group.categoryType}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-empanada-dark rounded-lg p-3"
                >
                  <p className="text-xs font-semibold text-empanada-golden mb-2">
                    {group.icon} {group.label}
                  </p>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <motion.li
                        key={item.productId}
                        layout
                        className="text-sm text-gray-300 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-empanada-golden rounded-full"></span>
                          <span className="text-xs">{item.productName}</span>
                        </span>
                        <Badge variant="outline" className="text-xs border-empanada-golden text-empanada-golden">
                          {item.quantity}x
                        </Badge>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Separador */}
      <div className="border-t border-empanada-light-gray"></div>

      {/* Resumen de precio */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Productos seleccionados</span>
          <span className="text-white font-medium">{totalItems}</span>
        </div>
        <div className="border-t border-empanada-light-gray pt-2"></div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-white">Total</span>
          <span className="text-2xl font-bold text-empanada-golden">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="space-y-3">
        {/* Botón Continuar - Aparece si no está completo */}
        {!isComplete && (
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
        )}

        {/* Botón Agregar al Carrito - Aparece cuando está completo */}
        {isComplete && (
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

        {/* Botón Volver */}
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

      {/* Mensaje informativo */}
      {!isComplete && (
        <div className="text-xs text-gray-400 text-center p-3 bg-empanada-dark rounded-lg">
          💡 Completá todos los pasos para agregar tu combo al carrito
        </div>
      )}
    </motion.div>
  );
}

