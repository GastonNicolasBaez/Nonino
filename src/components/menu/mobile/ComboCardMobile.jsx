import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Package, TrendingUp, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

/**
 * Carrusel de combos estilo Tinder/Bumble para mobile
 * Muestra un combo a la vez con navegación swipeable
 */

export function ComboCarousel({ combos = [], onSelectCombo, onShowInfo }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!combos || combos.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-30" />
        <p className="text-gray-400">No hay combos disponibles</p>
      </div>
    );
  }

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % combos.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + combos.length) % combos.length);
  };

  const handleSwipe = (offsetX) => {
    // Swipe derecha (offsetX positivo) = ir al anterior
    // Swipe izquierda (offsetX negativo) = ir al siguiente
    if (offsetX > 0) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  const currentCombo = combos[currentIndex];

  return (
    <div className="relative px-4 py-6">
      {/* Cards con animación */}
      <div className="relative h-[480px] mb-6">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <ComboCard
            key={`${currentCombo.id}-${currentIndex}`}
            combo={currentCombo}
            onSwipe={handleSwipe}
            onSelect={onSelectCombo}
            onShowInfo={onShowInfo}
            direction={direction}
          />
        </AnimatePresence>
      </div>

      {/* Indicadores de navegación (dots) */}
      <div className="flex justify-center gap-2 mb-4">
        {combos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentIndex
                ? "w-8 bg-empanada-golden"
                : "w-2 bg-empanada-light-gray hover:bg-empanada-golden/50"
            )}
            aria-label={`Ir al combo ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
}

/**
 * Card individual de combo con swipe gestures
 */
function ComboCard({ combo, onSwipe, onSelect, onShowInfo, direction }) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);

  const calculateDiscount = () => {
    if (!combo.components || combo.components.length === 0) return 0;

    const originalPrice = combo.components.reduce((sum, component) => {
      return sum + (component.price * component.quantity);
    }, 0);

    return originalPrice - combo.price;
  };

  const calculateDiscountPercentage = () => {
    if (!combo.components || combo.components.length === 0) return 0;

    const originalPrice = combo.components.reduce((sum, component) => {
      return sum + (component.price * component.quantity);
    }, 0);

    if (originalPrice === 0) return 0;

    return Math.round(((originalPrice - combo.price) / originalPrice) * 100);
  };

  const discount = calculateDiscount();
  const discountPercentage = calculateDiscountPercentage();

  const handleDragEnd = (event, info) => {
    const threshold = 100; // Reducido para más sensibilidad
    const velocity = Math.abs(info.velocity.x);

    // Detectar swipe por distancia o velocidad
    if (Math.abs(info.offset.x) > threshold || velocity > 500) {
      onSwipe(info.offset.x);
    }
  };

  // Animación de entrada - Solo slide horizontal, sin rotación ni escala
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 35,
        mass: 0.8,
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: {
        duration: 0.15,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="absolute inset-0"
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.7}
      dragDirectionLock
      onDragEnd={handleDragEnd}
      style={{
        x,
        opacity,
      }}
    >
      <Card className="h-full overflow-hidden bg-empanada-dark border-2 border-empanada-light-gray shadow-2xl">
        {/* Imagen del combo */}
        <div className="relative h-56 bg-gradient-to-br from-empanada-medium to-empanada-dark overflow-hidden">
          {combo.imageBase64 ? (
            <img
              src={combo.imageBase64.startsWith('data:') ? combo.imageBase64 : `data:image/webp;base64,${combo.imageBase64}`}
              alt={combo.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-24 h-24 text-empanada-golden opacity-20" />
            </div>
          )}

          {/* Badge de descuento */}
          {discount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="absolute top-4 right-4"
            >
              <Badge className="bg-gradient-to-r from-empanada-golden to-empanada-warm text-white px-4 py-2 text-base font-bold shadow-2xl">
                <TrendingUp className="w-5 h-5 mr-1 inline" />
                {discountPercentage}% OFF
              </Badge>
            </motion.div>
          )}

          {/* Botón de info */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onShowInfo && onShowInfo(combo);
            }}
            className="absolute top-4 left-4 w-10 h-10 bg-empanada-dark/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            onPointerDown={(e) => e.stopPropagation()}
            whileTap={{ scale: 0.9 }}
          >
            <Info className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        <CardContent className="p-6 flex flex-col justify-between h-[calc(100%-224px)]">
          {/* Nombre y descripción */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
              {combo.name}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2">
              {combo.description || "Combo personalizable a tu gusto"}
            </p>
          </div>

          {/* Precios y ahorro */}
          <div className="mb-4">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold text-empanada-golden">
                {formatPrice(combo.price)}
              </span>
              {discount > 0 && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(combo.price + discount)}
                </span>
              )}
            </div>
            {discount > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-green-400 font-medium"
              >
                ✨ Ahorrás {formatPrice(discount)}
              </motion.p>
            )}
          </div>

          {/* Botón CTA */}
          <Button
            variant="empanada"
            size="lg"
            className="w-full text-lg shadow-xl group"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(combo);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Package className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Armar este Combo
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>

    </motion.div>
  );
}
