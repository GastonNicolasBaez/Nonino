import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, X } from 'lucide-react';
import { useCart } from '@/context/CartProvider';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export const TotemCart = ({ onClose }) => {
  const { items, total, itemCount, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (itemCount > 0) {
      if (onClose) onClose(); // Cerrar modal antes de navegar
      navigate('/totem/checkout');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="h-full flex flex-col bg-empanada-medium">
      {/* Header del carrito */}
      <div className="p-4 border-b border-empanada-light-gray bg-empanada-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-empanada-golden" />
            <h2 className="text-2xl font-bold text-white">Tu Pedido</h2>
            {itemCount > 0 && (
              <div className="bg-empanada-golden text-empanada-dark rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                {itemCount}
              </div>
            )}
          </div>

          {/* Botón de cerrar (solo visible en modal) */}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-empanada-medium h-10 w-10 p-0 rounded-full"
            >
              <X className="w-6 h-6" />
            </Button>
          )}
        </div>
      </div>

      {/* Items del carrito */}
      <ScrollArea className="flex-1 px-4">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full py-12 text-center"
            >
              <ShoppingCart className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">
                Tu carrito está vacío
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Agregá productos para comenzar
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3 py-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.isCombo ? item.id : `${item.id}-${JSON.stringify(item.customizations)}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-empanada-dark rounded-lg p-4 border border-empanada-light-gray"
                >
                  <div className="flex gap-3">
                    {/* Imagen */}
                    {item.image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-empanada-medium">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Detalles */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-base truncate">
                        {item.name}
                      </h3>

                      {/* Combo details */}
                      {item.isCombo && item.comboDetails && item.comboDetails.length > 0 && (
                        <div className="mt-1 text-xs text-gray-400">
                          {item.comboDetails.map((detail, idx) => (
                            <div key={idx}>
                              {detail.quantity}x {detail.name}
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-empanada-golden font-bold text-lg mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-empanada-light-gray">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.customizations, item.quantity - 1)}
                        className="h-10 w-10 p-0 bg-white hover:bg-gray-100 text-empanada-dark rounded-lg border-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>

                      <span className="text-white font-bold text-lg w-12 text-center">
                        {item.quantity}
                      </span>

                      <Button
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.customizations, item.quantity + 1)}
                        className="h-10 w-10 p-0 bg-empanada-golden hover:bg-empanada-golden/90 text-empanada-dark rounded-lg border-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.id, item.customizations)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Subtotal del item */}
                  <div className="mt-2 text-right">
                    <span className="text-gray-400 text-sm">Subtotal: </span>
                    <span className="text-white font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>

      {/* Footer con total y botón de pago */}
      <div className="p-6 border-t-2 border-empanada-golden bg-empanada-dark space-y-4">
        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">TOTAL</span>
          <span className="text-3xl font-bold text-empanada-golden">
            {formatPrice(total)}
          </span>
        </div>

        {/* Botón de checkout */}
        <Button
          size="lg"
          onClick={handleCheckout}
          disabled={itemCount === 0}
          className={cn(
            "w-full text-xl font-bold py-8 rounded-xl transition-all",
            itemCount > 0
              ? "bg-empanada-golden text-empanada-dark hover:bg-empanada-golden/90 hover:scale-105"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          )}
        >
          <span className="mr-2">IR A PAGAR</span>
          <ArrowRight className="w-6 h-6" />
        </Button>

        {itemCount === 0 && (
          <p className="text-center text-gray-500 text-sm">
            Agregá productos para continuar
          </p>
        )}
      </div>
    </div>
  );
};

export default TotemCart;
