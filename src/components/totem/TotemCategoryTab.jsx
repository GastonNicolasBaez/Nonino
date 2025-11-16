import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const TotemCategoryTab = ({ category, isActive, onClick }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative px-8 py-5 rounded-xl font-bold text-lg transition-all duration-300 whitespace-nowrap",
        "border-2 min-h-[70px] flex items-center justify-center",
        isActive
          ? "bg-empanada-golden text-empanada-dark border-empanada-golden shadow-lg shadow-empanada-golden/30"
          : "bg-empanada-medium text-gray-300 border-empanada-light-gray hover:border-empanada-golden/50 hover:text-white"
      )}
    >
      {category.name}

      {/* Indicador de categoría activa */}
      {isActive && (
        <motion.div
          layoutId="activeCategory"
          className="absolute inset-0 bg-empanada-golden rounded-xl -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.button>
  );
};

export default TotemCategoryTab;
