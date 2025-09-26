import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useCart } from "../../context/CartProvider";
import { formatPrice } from "../../lib/utils";
import { Link } from "react-router";

export function CartDropdown({ isOpen, onClose }) {
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
        <>
          {/* Overlay invisible para cerrar */}
          <div
            className="fixed inset-0 z-[99998]"
            onClick={onClose}
          />

          {/* Dropdown */}
          <motion.div
            variants={dropdownVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.2 }}
            className="absolute -right-4 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[99999] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-empanada-cream/20 to-empanada-wheat/20">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
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
            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-4xl mb-3">🥟</div>
                  <p className="text-sm text-gray-500 mb-4">
                    Tu carrito está vacío
                  </p>
                  <Link to="/pedir" onClick={onClose}>
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
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-empanada-golden">
                          {formatPrice(item.price)}
                        </p>
                        {item.customizations && Object.keys(item.customizations).length > 0 && (
                          <p className="text-xs text-gray-500 truncate">
                            {Object.values(item.customizations).join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
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
                        <span className="text-sm w-6 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
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
                          className="h-6 w-6 text-red-500 hover:text-red-700"
                          onClick={() => removeItem(item.id, item.customizations)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}

                  {items.length > 4 && (
                    <div className="text-center py-2 border-t">
                      <p className="text-xs text-gray-500">
                        +{items.length - 4} productos más
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 bg-gray-50/50">
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold text-empanada-golden">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link to="/carrito" onClick={onClose} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full text-sm py-2 h-auto"
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

                {/* Quick Info */}
                <p className="text-xs text-gray-500 text-center mt-3">
                  Envío gratis en pedidos &gt; $3000
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}