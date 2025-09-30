import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Star, Clock, Users, Heart, Flame } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { useCart } from "../../context/CartProvider";
import { formatPrice } from "../../lib/utils";
import { toast } from "sonner";

export function ProductModal({ product, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const { addItem } = useCart();

  // Reset quantity when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen, product]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    onClose();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removido de favoritos" : "Agregado a favoritos");
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (!product) return null;

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: "100%"
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 400,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: "100%",
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 400,
        duration: 0.3
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div
          className="modal-overlay bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center md:p-4"
          onClick={onClose}
        >
          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md mx-0 md:mx-auto bg-empanada-dark rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] md:max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Close Button */}
            <div className="relative flex-shrink-0">
              {/* Image */}
              <div className="relative h-64 rounded-t-3xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-4 right-4 h-10 w-10 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white rounded-full shadow-lg border border-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>

                {/* Like Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLike}
                  className="absolute top-4 left-4 h-10 w-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isLiked ? "fill-red-500 text-red-500" : "text-white"
                    }`}
                  />
                </Button>

                {/* Badges */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {product.isPopular && (
                    <Badge className="bg-orange-500 text-white">
                      <Flame className="w-3 h-3 mr-1" />
                      Más Popular
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge className="bg-green-500 text-white">
                      Nuevo
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto min-h-[300px]">
              <div className="p-6 space-y-6">
                {/* Product Name and Price */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-2xl font-bold text-empanada-golden">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-gray-300">por unidad</span>
                  </div>
                </div>


                {/* Description */}
                <div>
                  <h3 className="font-semibold text-white mb-3">Descripción</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {product.description || "Deliciosa empanada preparada con los mejores ingredientes seleccionados especialmente para ti. Una combinación perfecta de sabores tradicionales que te harán sentir como en casa."}
                  </p>

                  {/* Additional details section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-2 h-2 bg-empanada-golden rounded-full"></span>
                      <span>Masa artesanal preparada diariamente</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-2 h-2 bg-empanada-golden rounded-full"></span>
                      <span>Ingredientes frescos y de primera calidad</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-2 h-2 bg-empanada-golden rounded-full"></span>
                      <span>Horneadas al momento para máxima frescura</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer - Quantity and Add Button */}
            <div className="flex-shrink-0 p-6 bg-empanada-medium border-t border-empanada-light-gray pb-8 md:pb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-gray-300 block">Cantidad</span>
                  <div className="flex items-center gap-3 mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-10 w-10 rounded-full menu-category-button"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-xl font-bold w-8 text-center text-white">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={increaseQuantity}
                      className="h-10 w-10 rounded-full menu-category-button"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm text-gray-300 block">Total</span>
                  <span className="text-2xl font-bold text-empanada-golden">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full h-12 text-base font-semibold"
                variant="empanada"
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
              >
                {product.isAvailable
                  ? `Agregar al Carrito • ${formatPrice(product.price * quantity)}`
                  : "No Disponible"
                }
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}