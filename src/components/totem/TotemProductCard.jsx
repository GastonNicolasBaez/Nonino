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
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(product)}
      className={cn(
        "relative group bg-gray-800 rounded-2xl overflow-hidden",
        "border-3 border-gray-600 hover:border-empanada-golden",
        "transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-empanada-golden/30",
        "flex flex-col w-full"
      )}
      style={{ height: '360px' }}
    >
      {/* Imagen del producto - Altura fija con aspect ratio forzado */}
      <div className="relative w-full bg-empanada-dark overflow-hidden flex-shrink-0" style={{ height: '200px' }}>
        {product.image && !imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={handleImageError}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-empanada-dark">
            <div className="text-empanada-golden text-7xl font-bold opacity-20">
              {product.name.charAt(0)}
            </div>
          </div>
        )}

        {/* Badge de toque en hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-empanada-golden rounded-full p-5 shadow-2xl"
          >
            <Plus className="w-10 h-10 text-empanada-dark stroke-[3]" />
          </motion.div>
        </div>
      </div>

      {/* Información del producto - Altura fija para el resto */}
      <div className="bg-empanada-dark flex flex-col" style={{ height: '160px' }}>
        {/* Descripción - Ocupa espacio disponible */}
        <div className="flex-1 px-4 pt-4 pb-2 flex items-center justify-center min-h-0">
          {product.description ? (
            <p className="text-gray-300 text-sm line-clamp-3 text-center leading-snug">
              {product.description}
            </p>
          ) : (
            <p className="text-gray-500 text-sm text-center italic">
              Sin descripción
            </p>
          )}
        </div>

        {/* Precio y botón - Altura fija al fondo */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between gap-3 pt-3 border-t-2 border-empanada-golden/30">
            <span className="text-2xl font-black text-empanada-golden tracking-tight">
              {formatPrice(product.price)}
            </span>

            <div className="bg-empanada-golden rounded-full p-2 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300 flex-shrink-0 shadow-lg">
              <Plus className="w-6 h-6 text-empanada-dark stroke-[3]" />
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de toque activo */}
      <motion.div
        className="absolute inset-0 bg-empanada-golden/10 opacity-0 group-active:opacity-100 transition-opacity pointer-events-none rounded-2xl"
      />
    </motion.button>
  );
};

export default TotemProductCard;
