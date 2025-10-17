import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { formatPrice } from "../../lib/utils";
import { useNavigate } from "react-router";
import { useIsMobile } from "@/hooks/useMediaQuery";

export function ComboModal({ combo, isOpen, onClose }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  console.log(combo);

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

  const calculateDiscount = () => {
    if (!combo?.components || combo.components.length === 0) return 0;

    const originalPrice = combo.components.reduce((sum, component) => {
      return sum + (component.price * component.quantity);
    }, 0);

    return originalPrice - combo.price;
  };

  const calculateDiscountPercentage = () => {
    if (!combo?.components || combo.components.length === 0) return 0;

    const originalPrice = combo.components.reduce((sum, component) => {
      return sum + (component.price * component.quantity);
    }, 0);

    if (originalPrice === 0) return 0;

    return Math.round(((originalPrice - combo.price) / originalPrice) * 100);
  };

  const handleArmarCombo = () => {
    onClose();
    navigate(`/menu/combo-builder?comboId=${combo.id}`);
  };

  if (!combo) return null;

  const discount = calculateDiscount();
  const discountPercentage = calculateDiscountPercentage();

  // Animaciones (iguales a ProductModal)
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
        damping: 25,
        stiffness: 300,
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: '100%',
      transition: {
        duration: 0.2
      }
    }
  };

  const handleDragEnd = (event, info) => {
    // Cerrar modal si se arrastra más de 150px hacia abajo
    if (info.offset.y > 150) {
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
                {combo.imageBase64 ? (
                  <img
                    src={combo.imageBase64}
                    alt={combo.name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-empanada-medium to-empanada-dark">
                    <Package className="w-32 h-32 text-empanada-golden opacity-20" />
                  </div>
                )}

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

                {/* Badge de descuento */}
                {discount > 0 && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-orange-500 text-white">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {discountPercentage}% OFF
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {/* Combo Name and Price */}
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">
                    {combo.name}
                  </h2>
                  <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                    <span className="text-xl md:text-2xl font-bold text-empanada-golden">
                      {formatPrice(combo.price)}
                    </span>
                    {discount > 0 && (
                      <span className="text-base md:text-lg text-gray-500 line-through">
                        {formatPrice(combo.price + discount)}
                      </span>
                    )}
                  </div>
                  {discount > 0 && (
                    <div className="inline-block bg-green-900/20 border border-green-600 rounded-lg px-3 py-1.5">
                      <p className="text-xs md:text-sm text-green-400 font-medium">
                        ✨ Ahorrás {formatPrice(discount)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {combo.description && (
                  <div>
                    <h3 className="text-sm md:text-base font-semibold text-white mb-2 md:mb-3">Descripción</h3>
                    <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                      {combo.description}
                    </p>
                  </div>
                )}

                {/* Componentes incluidos */}
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-white mb-2 md:mb-3">Este combo incluye:</h3>
                  <div className="space-y-2 md:space-y-3">
                    {combo.selectionSpec.rules.map((component, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                          <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-empanada-golden rounded-full flex-shrink-0"></span>
                          <span>{component.categoryName || `Producto ${idx + 1}`}</span>
                        </div>
                        <Badge variant="outline" className="border-empanada-golden text-empanada-golden text-xs">
                          {component.units}x
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Quantity and Add Button */}
            <div className="flex-shrink-0 p-4 md:p-6 bg-empanada-medium border-t border-empanada-light-gray">
              <Button
                className="w-full h-11 md:h-12 text-sm md:text-base font-semibold"
                variant="empanada"
                onClick={handleArmarCombo}
              >
                <Package className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Armar este Combo
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
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
                {combo.imageBase64 ? (
                  <img
                    src={combo.imageBase64}
                    alt={combo.name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-empanada-medium to-empanada-dark">
                    <Package className="w-32 h-32 text-empanada-golden opacity-20" />
                  </div>
                )}

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

                {/* Badge de descuento */}
                {discount > 0 && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-orange-500 text-white text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {discountPercentage}% OFF
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Combo Name and Price */}
                <div>
                  <h2 className="text-lg font-bold text-white mb-2">
                    {combo.name}
                  </h2>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-bold text-empanada-golden">
                      {formatPrice(combo.price)}
                    </span>
                    {discount > 0 && (
                      <span className="text-base text-gray-500 line-through">
                        {formatPrice(combo.price + discount)}
                      </span>
                    )}
                  </div>
                  {discount > 0 && (
                    <div className="inline-block bg-green-900/20 border border-green-600 rounded-lg px-3 py-1.5">
                      <p className="text-xs text-green-400 font-medium">
                        ✨ Ahorrás {formatPrice(discount)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {combo.description && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-2">Descripción</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {combo.description}
                    </p>
                  </div>
                )}

                {/* Componentes incluidos */}
                <div>
                  <h3 className="text-base font-semibold text-white mb-2">Este combo incluye:</h3>
                  <div className="space-y-2">
                    {combo.selectionSpec.rules.map((component, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="w-2 h-2 bg-empanada-golden rounded-full flex-shrink-0"></span>
                          <span>{component.categoryName || `Producto ${idx + 1}`}</span>
                        </div>
                        <Badge variant="outline" className="border-empanada-golden text-empanada-golden text-xs">
                          {component.units}x
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Quantity and Add Button */}
            <div className="flex-shrink-0 p-4 bg-empanada-medium border-t border-empanada-light-gray pb-safe">
              <Button
                className="w-full h-12 text-base font-semibold"
                variant="empanada"
                onClick={handleArmarCombo}
              >
                <Package className="w-4 h-4 mr-2" />
                Armar este Combo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
