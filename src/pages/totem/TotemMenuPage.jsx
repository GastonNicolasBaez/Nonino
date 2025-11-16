import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { usePublicData } from '@/context/PublicDataProvider';
import { useTotem } from '@/hooks/useTotem';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { TotemCategoryTab } from '@/components/totem/TotemCategoryTab';
import { TotemProductCard } from '@/components/totem/TotemProductCard';
import { TotemProductModal } from '@/components/totem/TotemProductModal';
import { TotemCart } from '@/components/totem/TotemCart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package } from 'lucide-react';

export const TotemMenuPage = () => {
  const navigate = useNavigate();
  const { productos, categorias, publicDataLoading, sucursalSeleccionada } = usePublicData();
  const { config } = useTotem();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Redirigir si no hay sucursal seleccionada
  useEffect(() => {
    if (!publicDataLoading && !sucursalSeleccionada) {
      navigate('/totem');
    }
  }, [sucursalSeleccionada, publicDataLoading, navigate]);

  // Seleccionar primera categoría por defecto
  useEffect(() => {
    if (categorias && categorias.length > 0 && !selectedCategory) {
      setSelectedCategory(categorias[0].id);
    }
  }, [categorias, selectedCategory]);

  // Filtrar productos por categoría seleccionada
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return productos;
    return productos.filter(p => p.category === selectedCategory);
  }, [productos, selectedCategory]);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  if (publicDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-empanada-dark">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex bg-empanada-dark">
      {/* Contenido principal - 70% */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs de categorías */}
        <div className="bg-empanada-medium border-b-2 border-empanada-golden px-6 py-4">
          <ScrollArea className="w-full">
            <div className="flex gap-3 pb-2">
              {categorias.map((category) => (
                <TotemCategoryTab
                  key={category.id}
                  category={category}
                  isActive={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Grid de productos */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {filteredProducts.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TotemProductCard
                      product={product}
                      onSelect={handleProductSelect}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full py-20"
              >
                <Package className="w-20 h-20 text-gray-600 mb-4" />
                <p className="text-gray-400 text-2xl">
                  No hay productos en esta categoría
                </p>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Carrito lateral - 30% */}
      <div className="w-[30%] min-w-[380px] max-w-[500px]">
        <TotemCart />
      </div>

      {/* Modal de producto */}
      <TotemProductModal
        product={selectedProduct}
        isOpen={showProductModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default TotemMenuPage;
