import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartProvider';
import { cn } from '@/lib/utils';

export const TotemProductModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen, product]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      onClose();
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 50));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-empanada-dark rounded-3xl max-w-2xl w-full overflow-hidden border-2 border-empanada-golden shadow-2xl"
          >
            {/* Header con botón cerrar */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Imagen */}
              <div className="w-full h-64 bg-empanada-medium overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-empanada-golden text-9xl font-bold opacity-20">
                      {product.name.charAt(0)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contenido */}
            <div className="p-8">
              {/* Nombre y descripción */}
              <h2 className="text-4xl font-bold text-white mb-4">
                {product.name}
              </h2>

              {product.description && (
                <p className="text-gray-300 text-lg mb-6">
                  {product.description}
                </p>
              )}

              {/* Precio unitario */}
              <div className="bg-empanada-medium rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-lg">Precio unitario:</span>
                  <span className="text-3xl font-bold text-empanada-golden">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>

              {/* Selector de cantidad */}
              <div className="bg-empanada-medium rounded-xl p-6 mb-6">
                <label className="text-white text-lg font-semibold mb-4 block text-center">
                  Cantidad:
                </label>

                <div className="flex items-center justify-center gap-4">
                  {/* Botón Menos */}
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className={cn(
                      "h-20 w-20 rounded-full flex items-center justify-center transition-all border-4",
                      quantity <= 1
                        ? "bg-gray-700 border-gray-600 cursor-not-allowed"
                        : "bg-gray-600 border-gray-500 hover:bg-gray-500 active:scale-95"
                    )}
                  >
                    <Minus className="w-10 h-10 text-white stroke-[3]" />
                  </button>

                  {/* Display de cantidad */}
                  <div className="bg-empanada-dark rounded-2xl px-12 py-6 min-w-[160px] border-4 border-empanada-golden/30">
                    <span className="text-6xl font-black text-white block text-center">
                      {quantity}
                    </span>
                  </div>

                  {/* Botón Más */}
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= 50}
                    className={cn(
                      "h-20 w-20 rounded-full flex items-center justify-center transition-all border-4",
                      quantity >= 50
                        ? "bg-gray-700 border-gray-600 cursor-not-allowed"
                        : "bg-empanada-golden border-empanada-golden/80 hover:bg-empanada-golden/90 active:scale-95"
                    )}
                  >
                    <Plus className="w-10 h-10 text-empanada-dark stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="bg-empanada-golden/20 rounded-xl p-6 mb-6 border-2 border-empanada-golden">
                <div className="flex items-center justify-between">
                  <span className="text-white text-2xl font-semibold">TOTAL:</span>
                  <span className="text-4xl font-bold text-empanada-golden">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>

              {/* Botón agregar al carrito */}
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="w-full bg-empanada-golden text-empanada-dark hover:bg-empanada-golden/90 text-2xl font-bold py-8 rounded-xl"
              >
                <ShoppingCart className="w-7 h-7 mr-3" />
                AGREGAR AL PEDIDO
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TotemProductModal;
