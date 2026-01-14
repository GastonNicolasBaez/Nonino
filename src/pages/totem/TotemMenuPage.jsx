import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { usePublicData } from '@/context/PublicDataProvider';
import { useSession } from '@/context/SessionProvider';
import { useTotem } from '@/hooks/useTotem';
import { useCart } from '@/context/CartProvider';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { TotemCategoryTab } from '@/components/totem/TotemCategoryTab';
import { TotemProductCard } from '@/components/totem/TotemProductCard';
import { TotemProductModal } from '@/components/totem/TotemProductModal';
import { TotemCart } from '@/components/totem/TotemCart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TotemMenuPage = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { productos, categorias, publicDataLoading, sucursalSeleccionada, setSucursalSeleccionada } = usePublicData();
  const { config } = useTotem();
  const { items } = useCart();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // Auto-seleccionar sucursal del usuario logeado
  useEffect(() => {
    if (session.isAuthenticated && session.userData?.sucursal && !sucursalSeleccionada) {
      console.log('[TOTEM MENU] Auto-seleccionando sucursal del usuario:', session.userData.sucursal);
      setSucursalSeleccionada(session.userData.sucursal);
    }
  }, [session.isAuthenticated, session.userData, sucursalSeleccionada, setSucursalSeleccionada]);

  // Redirigir si no hay sucursal seleccionada (después de intentar auto-seleccionar)
  useEffect(() => {
    if (!publicDataLoading && !sucursalSeleccionada && !session.loading) {
      console.log('[TOTEM MENU] No hay sucursal seleccionada - redirigiendo al login');
      navigate('/totem');
    }
  }, [sucursalSeleccionada, publicDataLoading, session.loading, navigate]);

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

  // Calcular cantidad total de items en el carrito
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-empanada-dark overflow-hidden">
      {/* Tabs de categorías - Fixed */}
      <div className="bg-empanada-medium border-b-2 border-empanada-golden px-4 py-3 flex-shrink-0">
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

      {/* Grid de productos - Scrollable */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 gap-4"
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

      {/* Botón flotante del carrito */}
      {cartItemCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-6 right-6 z-30"
        >
          <Button
            size="lg"
            onClick={() => setShowCart(true)}
            className="h-16 px-8 bg-empanada-golden hover:bg-empanada-golden/90 text-empanada-dark rounded-full shadow-2xl shadow-empanada-golden/50 text-lg font-bold"
          >
            <ShoppingCart className="w-6 h-6 mr-3" />
            <span>Ver Pedido</span>
            <div className="ml-3 bg-empanada-dark text-empanada-golden rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {cartItemCount}
            </div>
          </Button>
        </motion.div>
      )}

      {/* Modal de carrito (Bottom Sheet) */}
      <AnimatePresence>
        {showCart && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/60 z-40"
            />

            {/* Cart Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-empanada-dark rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
              </div>

              {/* Cart Content */}
              <div className="flex-1 overflow-hidden">
                <TotemCart onClose={() => setShowCart(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
