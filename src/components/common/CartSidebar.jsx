import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useCart } from "../../context/CartProvider";
import { formatPrice } from "../../lib/utils";
import { Link } from "react-router";
import { StoreSelector } from "./StoreSelector";

export function CartSidebar() {
  const {
    isOpen,
    setIsOpen,
    items,
    updateQuantity,
    removeItem,
    subtotal,
    discount,
    deliveryFee,
    total,
    itemCount,
    promoCode,
    removePromoCode,
    selectedStore,
    updateStore,
  } = useCart();

  const sidebarVariants = {
    closed: { x: "100%" },
    open: { x: 0 },
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] md:hidden"
          />

          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-2xl z-[101] flex flex-col md:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-empanada-cream to-empanada-wheat">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-empanada-golden" />
                Tu Carrito
                {itemCount > 0 && (
                  <Badge variant="empanada" className="ml-2 text-xs sm:text-sm">
                    {itemCount > 99 ? '99+' : itemCount}
                  </Badge>
                )}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="hover:bg-empanada-golden/20"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="p-4 sm:p-6 text-center">
                  <div className="text-5xl sm:text-6xl mb-4">🥟</div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                    ¡Agrega algunas deliciosas empanadas!
                  </p>
                  <Link to="/pedir" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="empanada"
                      className="w-full py-3 sm:py-4 text-sm sm:text-base"
                    >
                      Explorar Menú
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  {/* Items */}
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)}
                        </p>
                        {item.customizations &&
                          Object.keys(item.customizations).length > 0 && (
                            <div className="text-xs text-muted-foreground mt-1 truncate">
                              {Object.entries(item.customizations)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")}
                            </div>
                          )}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.customizations,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="w-2 h-2 sm:w-3 sm:h-3" />
                        </Button>
                        <span className="text-xs sm:text-sm w-6 sm:w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.customizations,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="w-2 h-2 sm:w-3 sm:h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-700"
                          onClick={() => removeItem(item.id, item.customizations)}
                        >
                          <Trash2 className="w-2 h-2 sm:w-3 sm:h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50">
                {/* Promo Code */}
                {promoCode && (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-green-800 block truncate">
                        Código: {promoCode.code}
                      </span>
                      <p className="text-xs text-green-600 truncate">
                        {promoCode.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removePromoCode}
                      className="text-green-600 hover:text-green-800 ml-2 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Summary */}
                <div className="space-y-2 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  {deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Envío</span>
                      <span>{formatPrice(deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg sm:text-xl border-t pt-2">
                    <span>Total</span>
                    <span className="text-empanada-golden">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Store Selection */}
                {selectedStore ? (
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Sucursal para el pedido:</div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-green-600 text-sm">✓</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-green-800">{selectedStore.name}</div>
                          <div className="text-xs text-green-600">{selectedStore.address}</div>
                          <div className="text-xs text-green-700 mt-1 font-medium">
                            {selectedStore.deliveryTime} • Min: {formatPrice(selectedStore.minOrder)}
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedStore.minOrder && subtotal < selectedStore.minOrder && (
                      <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                        ⚠️ Pedido mínimo: {formatPrice(selectedStore.minOrder)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Sucursal para el pedido:</div>
                    <StoreSelector
                      selectedStore={selectedStore}
                      onStoreSelect={updateStore}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  <Link to="/carrito" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full py-3 sm:py-4 text-sm sm:text-base">
                      Ver Carrito Completo
                    </Button>
                  </Link>
                  <Link to="/checkout" onClick={() => setIsOpen(false)}>
                    <Button 
                      variant="empanada" 
                      className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold"
                      disabled={!selectedStore}
                    >
                      {selectedStore ? "Proceder al Pago" : "Selecciona una Sucursal"}
                    </Button>
                  </Link>
                </div>

                {/* Quick Info */}
                <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
                  <p className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    Envío gratis en pedidos &gt; $3000
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    Tiempo estimado: 30-45 min
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
