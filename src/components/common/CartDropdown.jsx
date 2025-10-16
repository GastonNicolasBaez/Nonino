import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useCart } from "../../context/CartProvider";
import { usePublicData } from "@/context/PublicDataProvider";
import { formatPrice } from "../../lib/utils";
import { Link } from "react-router";
import { Portal } from "./Portal";

export function CartDropdown({ isOpen, onClose }) {
  const { sucursalSeleccionada } = usePublicData();
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  // Calcular posición del dropdown cuando se abre
  useEffect(() => {
    if (isOpen) {
      // Buscar el botón del carrito para calcular la posición
      const cartButton = document.querySelector('[aria-label*="Carrito de compras"]');
      if (cartButton) {
        const rect = cartButton.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 8, // 8px de margen
          right: window.innerWidth - rect.right + 16 // 16px de offset desde la derecha
        });
      }
    }
  }, [isOpen]);
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    total,
    itemCount,
  } = useCart();

  const dropdownVariants = {
    closed: {
      opacity: 0,
      y: -10,
      scale: 0.95
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          {/* Overlay invisible para cerrar */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Dropdown */}
          <motion.div
              variants={dropdownVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.2 }}
              className="fixed w-96 bg-empanada-dark rounded-2xl shadow-2xl border border-empanada-light-gray z-50 overflow-hidden"
              style={{
                top: `${dropdownPosition.top}px`,
                right: `${dropdownPosition.right}px`
              }}
            >
            {/* Header */}
            <div className="p-4 border-b border-empanada-light-gray bg-empanada-dark">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2 text-white">
                  <ShoppingBag className="w-4 h-4 text-empanada-golden" />
                  Carrito
                  {itemCount > 0 && (
                    <Badge variant="empanada" className="text-xs">
                      {itemCount > 99 ? '99+' : itemCount}
                    </Badge>
                  )}
                </h3>
                <span className="text-sm text-empanada-golden font-medium">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-80 overflow-y-auto bg-black">
              {items.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-4xl mb-3">🥟</div>
                  <p className="text-sm text-gray-400 mb-4">
                    Tu carrito está vacío
                  </p>
                  <Link to={sucursalSeleccionada ? "/menu" : "/pedir"} onClick={onClose}>
                    <Button variant="empanada" size="sm" className="px-4">
                      Explorar Menú
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="p-3 space-y-3">
                  {items.slice(0, 4).map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-empanada-medium transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate text-white">{item.name}</h4>
                        <p className="text-xs text-empanada-golden">
                          {formatPrice(item.price)}
                        </p>
                        {item.customizations && Object.keys(item.customizations).length > 0 && (
                          <p className="text-xs text-gray-400 truncate">
                            {Object.values(item.customizations).join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 cart-quantity-button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.customizations,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm w-6 text-center font-medium text-white">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 cart-quantity-button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.customizations,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500 hover:text-red-300 hover:bg-red-900/20"
                          onClick={() => removeItem(item.id, item.customizations)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}

                  {items.length > 4 && (
                    <div className="text-center py-2 border-t border-empanada-light-gray">
                      <p className="text-xs text-gray-400">
                        +{items.length - 4} productos más
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-empanada-light-gray p-4 bg-empanada-dark">
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-medium text-white">Subtotal</span>
                  <span className="font-semibold text-empanada-golden">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link to="/carrito" onClick={onClose} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full text-sm py-2 h-auto cart-secondary-button"
                    >
                      Ver Carrito
                    </Button>
                  </Link>
                  <Link to="/checkout" onClick={onClose} className="flex-1">
                    <Button
                      variant="empanada"
                      className="w-full text-sm py-2 h-auto font-semibold"
                    >
                      Pagar
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
}