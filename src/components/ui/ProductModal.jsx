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
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const { addItem } = useCart();

  // Detect responsive viewports
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsSmallMobile(width < 475);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

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
    // Toast removido para mejor fluidez de UX
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

  // Animaciones responsivas optimizadas
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const desktopModalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const mobileModalVariants = {
    hidden: {
      opacity: 0,
      y: '100%'
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
        duration: 0.36
      }
    },
    exit: {
      opacity: 0,
      y: '100%',
      transition: {
        duration: 0.25
      }
    }
  };

  const handleDragEnd = (e, info) => {
    const threshold = isSmallMobile ? 100 : 150;
    const velocity = Math.abs(info.velocity.y);
    
    if (info.offset.y > threshold || velocity > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[999999] flex items-end md:items-center justify-center md:p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Modal Desktop/Tablet (≥768px) */}
          <motion.div
            variants={desktopModalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="hidden md:flex relative w-full max-w-md bg-empanada-dark rounded-2xl shadow-2xl overflow-hidden flex-col max-h-[90dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header con imagen - Desktop */}
            <div className="relative flex-shrink-0">
              {/* Image */}
              <div className="relative h-48 md:h-64 rounded-t-2xl overflow-hidden">
                <img
                  src={product.image}
                  alt={`${product.name} - Empanada artesanal patagónica Nonino San Martín de los Andes`}
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
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {/* Product Name and Price */}
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                    <span className="text-xl md:text-2xl font-bold text-empanada-golden">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs md:text-sm text-gray-300">por unidad</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-white mb-2 md:mb-3">Descripción</h3>
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-3 md:mb-4">
                    {product.description || "Deliciosa empanada preparada con los mejores ingredientes seleccionados especialmente para ti. Una combinación perfecta de sabores tradicionales que te harán sentir como en casa."}
                  </p>

                  {/* Additional details section */}
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-empanada-golden rounded-full flex-shrink-0"></span>
                      <span>Masa artesanal preparada diariamente</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-empanada-golden rounded-full flex-shrink-0"></span>
                      <span>Ingredientes frescos y de primera calidad</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-empanada-golden rounded-full flex-shrink-0"></span>
                      <span>Horneadas al momento para máxima frescura</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Quantity and Add Button */}
            <div className="flex-shrink-0 p-4 md:p-6 bg-empanada-medium border-t border-empanada-light-gray">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div>
                  <span className="text-xs md:text-sm text-gray-300 block">Cantidad</span>
                  <div className="flex items-center gap-2 md:gap-3 mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-8 w-8 md:h-10 md:w-10 rounded-full menu-category-button"
                    >
                      <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                    <span className="text-lg md:text-xl font-bold w-6 md:w-8 text-center text-white">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={increaseQuantity}
                      className="h-8 w-8 md:h-10 md:w-10 rounded-full menu-category-button"
                    >
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs md:text-sm text-gray-300 block">Total</span>
                  <span className="text-xl md:text-2xl font-bold text-empanada-golden">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full h-11 md:h-12 text-sm md:text-base font-semibold"
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

          {/* Modal Mobile (<768px) */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.25 }}
            onDragEnd={handleDragEnd}
            variants={mobileModalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden absolute inset-x-0 bottom-0 bg-empanada-dark rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-gray-400 rounded-full"></div>
            </div>

            {/* Header con imagen - Mobile */}
            <div className="relative flex-shrink-0">

              {/* Image */}
              <div className="relative h-44 rounded-t-3xl overflow-hidden">
                <img
                  src={product.image}
                  alt={`${product.name} - Empanada artesanal patagónica Nonino San Martín de los Andes`}
                  className="w-full h-full object-cover object-center"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-4 right-4 h-8 w-8 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>

                {/* Like Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLike}
                  className="absolute top-4 left-4 h-8 w-8 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isLiked ? "fill-red-500 text-red-500" : "text-white"
                    }`}
                  />
                </Button>

                {/* Badges */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {product.isPopular && (
                    <Badge className="bg-orange-500 text-white text-xs">
                      <Flame className="w-3 h-3 mr-1" />
                      Más Popular
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge className="bg-green-500 text-white text-xs">
                      Nuevo
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Product Name and Price */}
                <div>
                  <h2 className="text-lg font-bold text-white mb-2">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-bold text-empanada-golden">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-gray-300">por unidad</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-base font-semibold text-white mb-2">Descripción</h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-3">
                    {product.description || "Deliciosa empanada preparada con los mejores ingredientes seleccionados especialmente para ti. Una combinación perfecta de sabores tradicionales que te harán sentir como en casa."}
                  </p>

                  {/* Additional details section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-2 h-2 bg-empanada-golden rounded-full flex-shrink-0"></span>
                      <span>Masa artesanal preparada diariamente</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-2 h-2 bg-empanada-golden rounded-full flex-shrink-0"></span>
                      <span>Ingredientes frescos y de primera calidad</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-2 h-2 bg-empanada-golden rounded-full flex-shrink-0"></span>
                      <span>Horneadas al momento para máxima frescura</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Quantity and Add Button */}
            <div className="flex-shrink-0 p-4 bg-empanada-medium border-t border-empanada-light-gray pb-safe">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-gray-300 block">Cantidad</span>
                  <div className="flex items-center gap-3 mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-9 w-9 rounded-full menu-category-button"
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
                      className="h-9 w-9 rounded-full menu-category-button"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm text-gray-300 block">Total</span>
                  <span className="text-xl font-bold text-empanada-golden">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}