import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, Heart, Star } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { ProductImage } from './OptimizedImage';
import { formatPrice } from '../../lib/utils';

export const CartProductItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  onToggleFavorite,
  index = 0,
  isMobile = false 
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
    // Pequeño delay para la animación
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
      y: 20, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        delay: index * 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: -100, 
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeOut"
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

  if (isMobile) {
    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        className="mb-4"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className={`
          relative bg-gradient-to-br from-empanada-dark to-empanada-darker 
          rounded-3xl border border-empanada-light-gray/20 p-5 
          shadow-lg hover:shadow-2xl transition-all duration-300
          ${isRemoving ? 'opacity-50 scale-95' : ''}
          ${isHovered ? 'border-empanada-golden/30 shadow-empanada-golden/10' : ''}
        `}>
          {/* Header con acciones */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Imagen del producto */}
              <motion.div 
                className="relative w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-empanada-light-gray/30"
                variants={imageVariants}
                whileHover="hover"
              >
                <ProductImage
                  product={item}
                  className="w-full h-full"
                  priority={index < 2}
                  quality="high"
                />
                {/* Badge de cantidad */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-empanada-golden text-black text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                  {item.quantity}
                </div>
              </motion.div>

              {/* Información del producto */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg leading-tight mb-2 line-clamp-2">
                  {item.name}
                </h3>
                
                {/* Precio unitario */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-empanada-golden font-bold text-lg">
                    {formatPrice(item.price)}
                  </span>
                  <span className="text-gray-400 text-sm">c/u</span>
                </div>

                {/* Rating y tiempo */}
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{item.rating || 4.8}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>{item.preparationTime || 15} min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de eliminar */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemove}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all duration-200"
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Personalizaciones */}
          {item.customizations && Object.keys(item.customizations).length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {Object.entries(item.customizations).map(([key, value]) => (
                  <Badge 
                    key={key} 
                    variant="secondary" 
                    className="text-xs px-3 py-1 bg-empanada-golden/20 text-empanada-golden border border-empanada-golden/30 rounded-full"
                  >
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Controles de cantidad y total */}
          <div className="flex items-center justify-between">
            {/* Controles de cantidad */}
            <div className="flex items-center gap-3">
              <motion.button
                variants={quantityVariants}
                whileTap="tap"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="w-10 h-10 bg-empanada-medium hover:bg-empanada-golden text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              
              <div className="w-12 text-center">
                <span className="text-xl font-bold text-white">{item.quantity}</span>
              </div>
              
              <motion.button
                variants={quantityVariants}
                whileTap="tap"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="w-10 h-10 bg-empanada-golden hover:bg-empanada-golden/80 text-black rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Total del item */}
            <div className="text-right">
              <div className="text-2xl font-bold text-empanada-golden">
                {formatPrice(item.price * item.quantity)}
              </div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
          </div>

          {/* Indicador de hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-3xl border-2 border-empanada-golden/30 pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // Versión Desktop
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="mb-6"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className={`
        relative bg-gradient-to-br from-empanada-dark to-empanada-darker 
        rounded-2xl border border-empanada-light-gray/20 p-6 
        shadow-lg hover:shadow-2xl transition-all duration-300
        ${isRemoving ? 'opacity-50 scale-95' : ''}
        ${isHovered ? 'border-empanada-golden/30 shadow-empanada-golden/10' : ''}
      `}>
        <div className="flex gap-6">
          {/* Imagen del producto */}
          <motion.div 
            className="relative w-32 h-32 rounded-2xl overflow-hidden ring-2 ring-empanada-light-gray/30 flex-shrink-0"
            variants={imageVariants}
            whileHover="hover"
          >
            <ProductImage
              product={item}
              className="w-full h-full"
              priority={index < 2}
              quality="high"
            />
            {/* Badge de cantidad */}
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-empanada-golden text-black text-sm font-bold rounded-full flex items-center justify-center shadow-lg">
              {item.quantity}
            </div>
          </motion.div>

          {/* Contenido principal */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {item.name}
                </h3>
                
                {/* Precio y detalles */}
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-empanada-golden font-bold text-xl">
                    {formatPrice(item.price)}
                  </span>
                  <span className="text-gray-400 text-sm">por unidad</span>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-400 text-sm">{item.rating || 4.8}</span>
                  </div>
                </div>

                {/* Personalizaciones */}
                {item.customizations && Object.keys(item.customizations).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Object.entries(item.customizations).map(([key, value]) => (
                      <Badge 
                        key={key} 
                        variant="secondary" 
                        className="text-sm px-3 py-1 bg-empanada-golden/20 text-empanada-golden border border-empanada-golden/30 rounded-full"
                      >
                        {value}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Botón de eliminar */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemove}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all duration-200"
              >
                <Trash2 className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Controles de cantidad y total */}
            <div className="flex items-center justify-between">
              {/* Controles de cantidad */}
              <div className="flex items-center gap-4">
                <motion.button
                  variants={quantityVariants}
                  whileTap="tap"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  className="w-12 h-12 bg-empanada-medium hover:bg-empanada-golden text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
                >
                  <Minus className="w-5 h-5" />
                </motion.button>
                
                <div className="w-16 text-center">
                  <span className="text-2xl font-bold text-white">{item.quantity}</span>
                </div>
                
                <motion.button
                  variants={quantityVariants}
                  whileTap="tap"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  className="w-12 h-12 bg-empanada-golden hover:bg-empanada-golden/80 text-black rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Total del item */}
              <div className="text-right">
                <div className="text-3xl font-bold text-empanada-golden">
                  {formatPrice(item.price * item.quantity)}
                </div>
                <div className="text-sm text-gray-400">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl border-2 border-empanada-golden/30 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
