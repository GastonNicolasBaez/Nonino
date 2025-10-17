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
      <div className="relative h-[260px] mb-6">
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
      className="absolute inset-0 cursor-pointer"
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.7}
      dragDirectionLock
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        // Solo abrir modal si no se clickeó el botón
        if (e.target.closest('button[data-action="select"]')) return;
        onShowInfo && onShowInfo(combo);
      }}
      style={{
        x,
        opacity,
      }}
    >
      <Card className="h-full overflow-hidden bg-empanada-dark border-2 border-empanada-light-gray shadow-2xl hover:border-empanada-golden transition-colors">
        {/* Imagen del combo */}
        <div className="relative h-32 bg-gradient-to-br from-empanada-medium to-empanada-dark overflow-hidden">
          {combo.imageBase64 ? (
            <img
              src={combo.imageBase64}
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
              className="absolute top-2 right-2"
            >
              <Badge className="bg-gradient-to-r from-empanada-golden to-empanada-warm text-white px-2 py-1 text-xs font-bold shadow-2xl">
                <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                {discountPercentage}% OFF
              </Badge>
            </motion.div>
          )}

          {/* Indicador de tap para ver detalles */}
          <div className="absolute top-2 left-2 bg-empanada-dark/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-lg">
            <Info className="w-3 h-3 text-empanada-golden" />
            <span className="text-xs text-white font-medium">Toca para ver detalles</span>
          </div>
        </div>

        <CardContent className="p-3 flex flex-col h-[calc(100%-128px)]">
          {/* Nombre */}
          <div className="mb-1.5">
            <h3 className="text-sm font-bold text-white leading-tight line-clamp-1 mb-0.5">
              {combo.name}
            </h3>
            <p className="text-gray-400 text-xs line-clamp-1">
              {combo.description || "Combo personalizable a tu gusto"}
            </p>
          </div>

          {/* Precio y ahorro */}
          <div className="mb-2 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-empanada-golden">
                {formatPrice(combo.price)}
              </span>
              {discount > 0 && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(combo.price + discount)}
                </span>
              )}
            </div>
            {discount > 0 && (
              <p className="text-xs text-green-400 font-medium">
                ✨ Ahorrás {formatPrice(discount)}
              </p>
            )}
          </div>

          {/* Botón CTA compacto */}
          <Button
            data-action="select"
            variant="empanada"
            size="sm"
            className="w-full text-xs py-1.5 shadow-xl group h-auto"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(combo);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Package className="w-3 h-3 mr-1 group-hover:scale-110 transition-transform" />
            Armar Combo
            <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>

    </motion.div>
  );
}
