import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, AlertCircle, CheckCircle2, Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Portal } from "@/components/common/Portal";
import { SimpleTooltip } from "@/components/ui/SimpleTooltip";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CATEGORY_TYPES, CATEGORY_NAMES } from "@/config/constants";

export function ProductStepSelector({
  categoryType,
  products,
  maxQuantity,
  currentSelections,
  onProductAdd,
  onProductRemove,
  loading,
  isMobile = false
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const buttonRefs = useRef({});

  // Calcular cantidad total seleccionada
  const totalSelected = Object.values(currentSelections).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const remaining = maxQuantity - totalSelected;
  const isOverLimit = totalSelected > maxQuantity;
  const isComplete = totalSelected >= maxQuantity;

  // Lógica simple: mostrar tooltip cuando se hace hover y se alcanzó el límite (solo en desktop)
  const shouldShowTooltip = (productId) => {
    return !isMobile && hoveredProduct === productId && totalSelected >= maxQuantity;
  };

  // En móvil no mostramos tooltip, solo manejamos el estado para consistencia
  const handleTouchStart = (productId) => {
    // No hacer nada en móvil - el tooltip está deshabilitado
  };

  const handleTouchEnd = () => {
    // No hacer nada en móvil - el tooltip está deshabilitado
  };


  // Filtrar productos por tipo de categoría y búsqueda
  const filteredProducts = products.filter((product) => {
    const categoryIds = CATEGORY_TYPES[categoryType] || [];
    const matchesCategory = categoryIds.includes(product.category);
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Obtener nombre del tipo de categoría
  const getCategoryLabel = () => {
    switch (categoryType) {
      case 'EMPANADAS':
        return 'Empanadas';
      case 'BEBIDAS':
        return 'Bebidas';
      case 'POSTRES':
        return 'Postres';
      default:
        return 'Productos';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-empanada-golden"></div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">
          No hay {getCategoryLabel().toLowerCase()} disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", isMobile ? "px-4 py-6" : "")}>
      {/* Header con progreso - Solo Desktop */}
      {!isMobile && (
        <div className="bg-empanada-medium rounded-lg border border-empanada-light-gray p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Seleccioná tus {getCategoryLabel()}
              </h2>
              <p className="text-gray-400 text-sm">
                Elegí los sabores que más te gusten
              </p>
            </div>
            <div className="text-right">
              <div className={cn(
                "text-4xl font-bold transition-colors",
                isOverLimit ? "text-red-500" : isComplete ? "text-green-500" : "text-empanada-golden"
              )}>
                {totalSelected}/{maxQuantity}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {isOverLimit ? (
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {Math.abs(remaining)} de más
                  </span>
                ) : isComplete ? (
                  <span className="text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Completado
                  </span>
                ) : (
                  `Faltan ${remaining}`
                )}
              </p>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-empanada-dark rounded-full h-3 overflow-hidden">
            <motion.div
              className={cn(
                "h-full rounded-full transition-colors",
                isOverLimit
                  ? "bg-gradient-to-r from-red-600 to-red-400"
                  : isComplete
                  ? "bg-gradient-to-r from-green-600 to-green-400"
                  : "bg-gradient-to-r from-empanada-golden to-empanada-warm"
              )}
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((totalSelected / maxQuantity) * 100, 100)}%`
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder={`Buscar ${getCategoryLabel().toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 bg-empanada-dark border-empanada-light-gray text-white"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Grid de productos */}
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-2 gap-3" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      )}>
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, index) => {
            const quantity = currentSelections[product.id] || 0;
            const isSelected = quantity > 0;

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="relative"
              >
                <Card
                  className={cn(
                    "transition-all duration-300 h-full overflow-visible",
                    "bg-empanada-dark border-2",
                    isSelected
                      ? "border-empanada-golden shadow-lg shadow-empanada-golden/20"
                      : "border-empanada-light-gray hover:border-empanada-golden/50"
                  )}
                >
                  {/* Imagen del producto */}
                  <div className={cn(
                    "relative bg-empanada-medium overflow-hidden",
                    isMobile ? "h-28" : "h-32"
                  )}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-empanada-light-gray flex items-center justify-center">
                          <span className="text-2xl">🥟</span>
                        </div>
                      </div>
                    )}

                    {/* Badge de cantidad seleccionada */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2"
                      >
                        <Badge className="bg-empanada-golden text-white font-bold px-2 py-1 shadow-lg">
                          {quantity}x
                        </Badge>
                      </motion.div>
                    )}
                  </div>

                  <CardContent className={isMobile ? "p-2" : "p-3"}>
                    {/* Nombre y precio */}
                    <div className={cn("mb-3", isMobile ? "min-h-[50px]" : "min-h-[60px]")}>
                      <h3 className={cn(
                        "font-semibold text-white mb-1 line-clamp-2",
                        isMobile ? "text-xs" : "text-sm"
                      )}>
                        {product.name}
                      </h3>
                      <p className="text-xs text-empanada-golden">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-8 w-8 p-0 rounded-full flex-shrink-0",
                          "border-empanada-light-gray hover:border-empanada-golden",
                          "hover:bg-empanada-golden hover:text-white"
                        )}
                        onClick={() => onProductRemove(product)}
                        disabled={quantity === 0}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>

                      <div className="flex-1 text-center">
                        <motion.span
                          key={quantity}
                          initial={{ scale: 1.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={cn(
                            "text-lg font-bold",
                            isSelected ? "text-empanada-golden" : "text-gray-500"
                          )}
                        >
                          {quantity}
                        </motion.span>
                      </div>

                      <SimpleTooltip
                        isVisible={shouldShowTooltip(product.id)}
                        triggerElement={buttonRefs.current[product.id]}
                        content={isMobile ? "Completá el combo primero" : "Agrega al carrito para continuar comprando"}
                        isMobile={isMobile}
                      >
                        <div
                          onMouseEnter={() => {
                            if (totalSelected >= maxQuantity && !isMobile) {
                              setHoveredProduct(product.id);
                            }
                          }}
                          onMouseLeave={() => {
                            if (!isMobile) {
                              setHoveredProduct(null);
                            }
                          }}
                          onTouchStart={() => handleTouchStart(product.id)}
                          onTouchEnd={handleTouchEnd}
                        >
                          <Button
                            ref={(el) => buttonRefs.current[product.id] = el}
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-8 w-8 p-0 rounded-full flex-shrink-0",
                              "border-empanada-light-gray hover:border-empanada-golden",
                              "hover:bg-empanada-golden hover:text-white",
                              "transition-all duration-200",
                              totalSelected >= maxQuantity && "opacity-50 cursor-not-allowed"
                            )}
                            onClick={() => onProductAdd(product)}
                            disabled={totalSelected >= maxQuantity}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </SimpleTooltip>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Mensaje de advertencia si se pasa del límite */}
      <AnimatePresence>
        {isOverLimit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-semibold mb-1">
                Te pasaste del límite del combo
              </p>
              <p className="text-red-300 text-sm">
                Elegiste {totalSelected} productos, pero el combo incluye solo {maxQuantity}.
                Los productos adicionales podrían tener un costo extra.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

