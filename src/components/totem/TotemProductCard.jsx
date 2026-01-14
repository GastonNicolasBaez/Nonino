import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export const TotemProductCard = ({ product, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(product)}
      className={cn(
        "relative group bg-empanada-dark rounded-xl overflow-hidden",
        "border-2 border-empanada-light-gray hover:border-empanada-golden",
        "transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-empanada-golden/20",
        "flex flex-col h-full"
      )}
    >
      {/* Imagen del producto */}
      <div className="relative w-full h-36 bg-empanada-medium overflow-hidden flex-shrink-0">
        {product.image && !imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-empanada-medium">
            <div className="text-empanada-golden text-6xl font-bold opacity-20">
              {product.name.charAt(0)}
            </div>
          </div>
        )}

        {/* Overlay hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-empanada-golden rounded-full p-4"
          >
            <Plus className="w-8 h-8 text-empanada-dark" />
          </motion.div>
        </div>
      </div>

      {/* Información del producto */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <h3 className="text-white font-bold text-lg mb-1.5 line-clamp-2 text-left leading-tight">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-gray-400 text-xs line-clamp-2 text-left">
              {product.description}
            </p>
          )}
        </div>

        {/* Precio */}
        <div className="mt-3 pt-3 border-t border-empanada-light-gray">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-empanada-golden">
              {formatPrice(product.price)}
            </span>

            <div className="bg-empanada-golden rounded-full p-1.5 group-hover:scale-110 transition-transform flex-shrink-0">
              <Plus className="w-5 h-5 text-empanada-dark" />
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de toque activo */}
      <motion.div
        className="absolute inset-0 bg-empanada-golden/10 opacity-0 group-active:opacity-100 transition-opacity pointer-events-none"
      />
    </motion.button>
  );
};

export default TotemProductCard;
