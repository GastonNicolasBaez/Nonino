import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, Heart, Star, Clock, Package, Sparkles } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { ProductImage } from './OptimizedImage';
import { formatPrice } from '../../lib/utils';

export const IntegratedCartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  onToggleFavorite,
  index = 0,
  isMobile = false,
  isLast = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      handleRemove();
      return;
    }
    onUpdateQuantity(item.id, item.customizations, newQuantity);
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(item.id, item.customizations);
    }, 200);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(item.id);
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -20,
      scale: 0.98
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        delay: index * 0.05
      }
    },
    exit: { 
      opacity: 0, 
      x: -100, 
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const quantityVariants = {
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  // Renderizado especial para combos
  if (item.isCombo) {
    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        className="relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {!isLast && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-empanada-light-gray/10" />
        )}

        <div className={`
          relative
          ${isMobile ? 'py-5 px-4' : 'py-6 px-6'}
          transition-opacity duration-300
          ${isRemoving ? 'opacity-50 scale-95' : ''}
        `}>
          {/* Fila 1: Icono + Nombre + Precio + Delete */}
          <div className="flex items-center gap-3 mb-3">
            {/* Icono de combo con glassmorphism */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative ${isMobile ? 'w-14 h-14' : 'w-16 h-16'} rounded-2xl bg-empanada-golden/10 flex items-center justify-center flex-shrink-0`}
            >
              <Package className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} text-empanada-golden drop-shadow-lg`} />
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-empanada-golden text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-2.5 h-2.5" />
              </div>
            </motion.div>

            {/* Nombre y badge */}
            <div className="flex-1 min-w-0">
              <div className="mb-1.5 flex items-center gap-1">
                <div className="w-2 h-2 bg-empanada-golden rounded-full"></div>
                <span className="text-empanada-golden text-[10px] font-semibold">
                  COMBO PERSONALIZADO
                </span>
              </div>
              <h3 className={`font-bold text-white ${isMobile ? 'text-base' : 'text-lg'} leading-tight line-clamp-1 drop-shadow-sm`}>
                {item.name}
              </h3>
            </div>

            {/* Precio y botón eliminar */}
            <div className="flex flex-col items-end gap-1">
              <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black text-empanada-golden drop-shadow-lg`}>
                {formatPrice(item.price)}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemove}
                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              >
                <Trash2 className={`${isMobile ? 'w-4 h-4' : 'w-4.5 h-4.5'}`} />
              </motion.button>
            </div>
          </div>

          {/* Fila 2: Chips horizontales scrollables con productos del combo */}
          {item.comboDetails && item.comboDetails.length > 0 && (
            <div className="relative">
              {/* Contenedor scrollable */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth snap-x snap-mandatory">
                {item.comboDetails.map((detail, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex-shrink-0 snap-start"
                  >
                    <div className="flex items-center gap-1.5 px-3 py-1.5">
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-empanada-golden`}>
                        {detail.quantity}x
                      </span>
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-white font-medium whitespace-nowrap`}>
                        {detail.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          )}

        </div>
      </motion.div>
    );
  }

  if (isMobile) {
    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        className="relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Línea separadora sutil */}
        {!isLast && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-empanada-light-gray/10" />
        )}
        
        <div className={`
          relative py-4 px-4 transition-opacity duration-300
          ${isRemoving ? 'opacity-50 scale-95' : ''}
        `}>
          <div className="flex items-center gap-4">
            {/* Imagen del producto */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <ProductImage
                product={item}
                className="w-full h-full"
                priority={index < 2}
                quality="high"
              />
              {/* Badge de cantidad */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-empanada-golden text-black text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                {item.quantity}
              </div>
            </div>

            {/* Información principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-base leading-tight mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  
                  {/* Precio unitario y detalles */}
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-empanada-golden font-semibold">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-gray-400">c/u</span>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-gray-400 text-xs">{item.rating || 4.8}</span>
                    </div>
                  </div>
                </div>

                {/* Total del item */}
                <div className="text-right ml-3">
                  <div className="text-lg font-bold text-empanada-golden">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>

              {/* Personalizaciones */}
              {item.customizations && Object.keys(item.customizations).length > 0 && (
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(item.customizations).map(([key, value]) => (
                    <span 
                      key={key} 
                      className="text-xs px-2 py-0.5 text-empanada-golden/80"
                    >
                      {value}
                    </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Controles de cantidad */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.button
                    variants={quantityVariants}
                    whileTap="tap"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    className="w-8 h-8 bg-empanada-medium hover:bg-empanada-golden text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
                  >
                    <Minus className="w-3 h-3" />
                  </motion.button>
                  
                  <div className="w-8 text-center">
                    <span className="text-sm font-semibold text-white">{item.quantity}</span>
                  </div>
                  
                  <motion.button
                    variants={quantityVariants}
                    whileTap="tap"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    className="w-8 h-8 bg-empanada-golden hover:bg-empanada-golden/80 text-black rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
                  >
                    <Plus className="w-3 h-3" />
                  </motion.button>
                </div>

                {/* Botón de eliminar */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRemove}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Versión Desktop - Lista horizontal integrada
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Línea separadora sutil */}
      {!isLast && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-empanada-light-gray/10" />
      )}
      
      <div className={`
        relative py-6 px-6 transition-opacity duration-300
        ${isRemoving ? 'opacity-50 scale-95' : ''}
      `}>
        <div className="flex items-center gap-6">
          {/* Imagen del producto */}
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <ProductImage
              product={item}
              className="w-full h-full"
              priority={index < 2}
              quality="high"
            />
            {/* Badge de cantidad */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-empanada-golden text-black text-sm font-bold rounded-full flex items-center justify-center shadow-lg">
              {item.quantity}
            </div>
          </div>

          {/* Información principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                  {item.name}
                </h3>
                
                {/* Precio y detalles */}
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-empanada-golden font-semibold text-lg">
                    {formatPrice(item.price)}
                  </span>
                  <span className="text-gray-400">por unidad</span>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-400">{item.rating || 4.8}</span>
                  </div>
                </div>
              </div>

              {/* Total del item */}
              <div className="text-right ml-6">
                <div className="text-2xl font-bold text-empanada-golden">
                  {formatPrice(item.price * item.quantity)}
                </div>
                <div className="text-sm text-gray-400">Total</div>
              </div>
            </div>

            {/* Personalizaciones */}
            {item.customizations && Object.keys(item.customizations).length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(item.customizations).map(([key, value]) => (
                    <span 
                      key={key} 
                      className="text-sm px-3 py-1 text-empanada-golden/80"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Controles de cantidad */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.button
                  variants={quantityVariants}
                  whileTap="tap"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  className="w-10 h-10 bg-empanada-medium hover:bg-empanada-golden text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                
                <div className="w-12 text-center">
                  <span className="text-lg font-semibold text-white">{item.quantity}</span>
                </div>
                
                <motion.button
                  variants={quantityVariants}
                  whileTap="tap"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  className="w-10 h-10 bg-empanada-golden hover:bg-empanada-golden/80 text-black rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Botón de eliminar */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemove}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all duration-200"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
