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
import { Package, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const TotemMenuPage = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { productos, categorias, publicDataLoading, sucursalSeleccionada, setSucursalSeleccionada } = usePublicData();
  const { config } = useTotem();
  const { items, clearCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showClearCartDialog, setShowClearCartDialog] = useState(false);

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

  // Ordenar categorías según orden específico para totem
  const sortedCategorias = useMemo(() => {
    if (!categorias || categorias.length === 0) return [];

    const categoryOrder = ['Combos', 'Tradicionales', 'Especiales', 'Bebidas'];

    return [...categorias].sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.name);
      const indexB = categoryOrder.indexOf(b.name);

      // Si ambas están en el orden definido
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      // Si solo una está definida, esa va primero
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      // Las no definidas van al final, ordenadas alfabéticamente
      return a.name.localeCompare(b.name);
    });
  }, [categorias]);

  // Seleccionar primera categoría por defecto
  useEffect(() => {
    if (sortedCategorias && sortedCategorias.length > 0 && !selectedCategory) {
      setSelectedCategory(sortedCategorias[0].id);
    }
  }, [sortedCategorias, selectedCategory]);

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
    setShowClearCartDialog(true);
  };

  const handleConfirmClearCart = () => {
    clearCart();
    setShowClearCartDialog(false);
  };

  const handleViewCart = () => {
    if (cartItemCount > 0) {
      setShowCartModal(true);
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] bg-empanada-dark relative">
      <div className="h-full flex overflow-hidden pb-24">
        {/* Sidebar izquierdo - Categorías */}
        <div className="w-36 bg-empanada-golden/90 border-r-4 border-empanada-golden flex-shrink-0 flex flex-col">
          <div className="px-3 py-4 border-b-2 border-empanada-golden">
            <h2 className="text-empanada-dark font-black text-xs text-center uppercase tracking-wider">
              Categorías
            </h2>
          </div>

          <ScrollArea className="flex-1 py-3">
            <div className="px-3 space-y-3">
              {sortedCategorias.map((category) => (
                <motion.button
                  key={category.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "w-full px-3 py-4 rounded-xl font-bold text-xs transition-all text-center border-2 leading-tight",
                    selectedCategory === category.id
                      ? "bg-empanada-dark text-empanada-golden border-empanada-golden shadow-xl"
                      : "bg-empanada-dark/20 text-empanada-dark border-empanada-dark/30 hover:bg-empanada-dark/40"
                  )}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Área principal - Productos */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 pb-8">
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
        </div>
      </div>

      {/* Footer fijo - Carrito (ocupa todo el ancho, sobre el sidebar también) */}
      <div className="fixed bottom-0 left-0 right-0 bg-empanada-dark border-t-4 border-empanada-golden px-6 py-5 shadow-2xl z-30">
        <div className="flex items-center justify-between gap-4">
          {/* Contador de productos */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-empanada-golden/90 text-empanada-dark px-5 py-3 rounded-xl border-2 border-empanada-golden shadow-lg">
              <p className="text-base font-black">
                {cartItemCount} {cartItemCount === 1 ? 'producto' : 'productos'}
              </p>
            </div>

            {cartItemCount > 0 && (
              <Button
                size="sm"
                onClick={handleClearCart}
                className="bg-empanada-dark border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white whitespace-nowrap font-bold h-12"
              >
                Limpiar pedido
              </Button>
            )}
          </div>

          {/* Total */}
          <div className="flex-1 text-center">
            <p className="text-4xl font-black text-empanada-golden drop-shadow-lg">
              {formatPrice(cartTotal)}
            </p>
          </div>

          {/* Botón Ver pedido */}
          <Button
            size="lg"
            onClick={handleViewCart}
            disabled={cartItemCount === 0}
            className={cn(
              "h-14 px-10 text-xl font-black whitespace-nowrap rounded-xl shadow-xl transition-all",
              cartItemCount > 0
                ? "bg-empanada-golden text-empanada-dark hover:bg-empanada-golden/90 hover:scale-105 border-2 border-white/20"
                : "bg-gray-700 text-gray-500 cursor-not-allowed border-2 border-gray-600"
            )}
          >
            Ver pedido
          </Button>
        </div>
      </div>

      {/* Modal de producto */}
      <TotemProductModal
        product={selectedProduct}
        isOpen={showProductModal}
        onClose={handleCloseModal}
      />

      {/* Modal del carrito - desliza desde arriba */}
      <AnimatePresence>
        {showCartModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60"
              onClick={() => setShowCartModal(false)}
            />

            {/* Modal que se desliza desde arriba */}
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 right-0 z-50 bg-empanada-dark max-h-[90vh] overflow-hidden border-b-4 border-empanada-golden shadow-2xl"
            >
              <TotemCart onClose={() => setShowCartModal(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de confirmación para limpiar carrito */}
      <Dialog open={showClearCartDialog} onOpenChange={setShowClearCartDialog}>
        <DialogContent className="bg-white border-2 border-gray-200 text-gray-900 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-empanada-golden flex items-center gap-2">
              <Trash2 className="w-7 h-7" />
              Limpiar pedido
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-lg pt-2">
              ¿Estás seguro que querés eliminar todos los productos del pedido?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-3 mt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowClearCartDialog(false)}
              className="text-lg px-8 py-6 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              size="lg"
              onClick={handleConfirmClearCart}
              className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6"
            >
              Sí, limpiar pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TotemMenuPage;
