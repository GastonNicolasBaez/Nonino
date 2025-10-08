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
          {/* Modal Desktop/Mobile - Estructura igual a ProductModal */}
          <motion.div
            variants={isMobile ? mobileModalVariants : desktopModalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={handleDragEnd}
            className="relative w-full max-w-md bg-empanada-dark rounded-2xl md:rounded-2xl rounded-b-none md:rounded-b-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle/Indicator de cierre - Solo mobile */}
            {isMobile && (
              <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-gray-400 rounded-full"></div>
              </div>
            )}

            {/* Header con imagen - IGUAL A ProductModal */}
            <div className="relative flex-shrink-0">
              {/* Image */}
              <div className="relative h-48 md:h-64 rounded-t-2xl overflow-hidden">
                {combo.imageBase64 ? (
                  <img
                    src={combo.imageBase64.startsWith('data:') ? combo.imageBase64 : `data:image/webp;base64,${combo.imageBase64}`}
                    alt={combo.name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-empanada-medium to-empanada-dark">
                    <Package className="w-32 h-32 text-empanada-golden opacity-20" />
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badge de descuento */}
                {discount > 0 && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-empanada-golden to-empanada-warm text-white px-4 py-2 text-base font-bold shadow-2xl">
                      <TrendingUp className="w-5 h-5 mr-1 inline" />
                      {discountPercentage}% OFF
                    </Badge>
                  </div>
                )}

                {/* Botón cerrar */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-4 left-4 h-10 w-10 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white rounded-full shadow-lg border border-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>

                {/* Nombre del combo superpuesto sobre la imagen */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-lg">
                    {combo.name}
                  </h2>
                </div>
              </div>
            </div>

            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {/* Descripción y demás contenido */}
                <div>
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
                {combo.components && combo.components.length > 0 && (
                  <div>
                    <h3 className="text-sm md:text-base font-semibold text-white mb-2 md:mb-3">Este combo incluye:</h3>
                    <div className="space-y-2 md:space-y-3">
                      {combo.components.map((component, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-empanada-golden rounded-full flex-shrink-0"></span>
                            <span>{component.productName || `Producto ${idx + 1}`}</span>
                          </div>
                          <Badge variant="outline" className="border-empanada-golden text-empanada-golden text-xs">
                            {component.quantity}x
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer - IGUAL A ProductModal */}
            <div className="border-t border-empanada-light-gray px-4 md:px-6 py-3 md:py-4 bg-empanada-dark flex-shrink-0">
              <Button
                variant="empanada"
                size="lg"
                className="w-full group"
                onClick={handleArmarCombo}
              >
                <Package className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:scale-110 transition-transform" />
                Armar este Combo
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
