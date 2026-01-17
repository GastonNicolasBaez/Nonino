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
import { cn } from '@/lib/utils';

export const TotemMenuPage = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { productos, categorias, publicDataLoading, sucursalSeleccionada, setSucursalSeleccionada } = usePublicData();
  const { config } = useTotem();
  const { items, clearCart } = useCart();

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

  // Calcular total del carrito
  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleClearCart = () => {
    if (window.confirm('¿Querés limpiar todo el pedido?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    if (cartItemCount > 0) {
      navigate('/totem/checkout');
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex bg-empanada-dark overflow-hidden">
      {/* Sidebar izquierdo - Categorías */}
      <div className="w-32 bg-empanada-golden/90 border-r-4 border-red-700 flex-shrink-0 flex flex-col">
        <div className="p-3 border-b-2 border-red-700">
          <h2 className="text-empanada-dark font-black text-sm text-center uppercase">
            Categorías
          </h2>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {categorias.map((category) => (
              <motion.button
                key={category.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "w-full p-3 rounded-lg font-bold text-sm transition-all text-center border-2",
                  selectedCategory === category.id
                    ? "bg-red-700 text-white border-red-900 shadow-lg"
                    : "bg-empanada-dark/20 text-empanada-dark border-empanada-dark/30 hover:bg-empanada-dark/30"
                )}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Área principal - Productos */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Grid de productos - Scrollable */}
        <ScrollArea className="flex-1">
          <div className="p-4 pb-32">
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

        {/* Footer fijo - Carrito */}
        <div className="bg-empanada-dark border-t-4 border-red-700 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            {/* Contador de productos */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="bg-red-700 text-white px-4 py-2 rounded-lg border-2 border-empanada-golden">
                <p className="text-sm font-semibold">
                  {cartItemCount} {cartItemCount === 1 ? 'producto' : 'productos'}
                </p>
              </div>

              {cartItemCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCart}
                  className="border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300 whitespace-nowrap"
                >
                  Limpiar pedido
                </Button>
              )}
            </div>

            {/* Total */}
            <div className="flex-1 text-center">
              <p className="text-3xl font-black text-empanada-golden">
                {formatPrice(cartTotal)}
              </p>
            </div>

            {/* Botón Ver pedido */}
            <Button
              size="lg"
              onClick={handleCheckout}
              disabled={cartItemCount === 0}
              className={cn(
                "h-14 px-8 text-xl font-bold whitespace-nowrap",
                cartItemCount > 0
                  ? "bg-white text-empanada-dark hover:bg-gray-100 border-2 border-empanada-golden shadow-lg shadow-empanada-golden/30"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              )}
            >
              Ver pedido
            </Button>
          </div>
        </div>
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
