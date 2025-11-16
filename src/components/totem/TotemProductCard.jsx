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
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(product)}
      className={cn(
        "relative group bg-empanada-dark rounded-2xl overflow-hidden",
        "border-2 border-empanada-light-gray hover:border-empanada-golden",
        "transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-empanada-golden/20",
        "flex flex-col h-full min-h-[280px]"
      )}
    >
      {/* Imagen del producto */}
      <div className="relative w-full h-40 bg-empanada-medium overflow-hidden">
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
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-white font-bold text-xl mb-2 line-clamp-2 text-left">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-gray-400 text-sm line-clamp-2 text-left">
              {product.description}
            </p>
          )}
        </div>

        {/* Precio */}
        <div className="mt-4 pt-4 border-t border-empanada-light-gray">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-empanada-golden">
              {formatPrice(product.price)}
            </span>

            <div className="bg-empanada-golden rounded-full p-2 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-empanada-dark" />
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
