import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Tag, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { IntegratedCartItem } from "../../components/ui/IntegratedCartItem";
import { useCart } from "../../context/CartProvider";
import { formatPrice } from "../../lib/utils";
import { useState } from "react";
import { toast } from "sonner";

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-empanada-dark rounded-2xl p-6 w-full max-w-sm"
      >
        <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">
            Cancelar
          </Button>
          <Button variant="empanada" onClick={onConfirm} className="flex-1 rounded-xl">
            Confirmar
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
export function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    discount,
    deliveryFee,
    total,
    itemCount,
    promoCode,
    applyPromoCode,
    removePromoCode,
    isOpen: isCartSidebarOpen,
  } = useCart();

  const [showPromoInput, setShowPromoInput] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handlePromoCode = (e) => {
    e.preventDefault();
    const code = e.target.promoCode.value;
    if (code.trim()) {
      applyPromoCode(code.trim());
      e.target.reset();
      setShowPromoInput(false);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-empanada-darker dark">
        {/* Header */}
        <div className="sticky top-0 bg-empanada-dark/95 backdrop-blur-sm border-b border-empanada-light-gray z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/menu">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-semibold">Mi Carrito</h1>
            <div className="w-9" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 px-6 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-empanada-medium rounded-full flex items-center justify-center mb-6 mx-auto">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-300 mb-8 max-w-sm">
              Agrega algunas empanadas deliciosas para comenzar tu pedido
            </p>
            <Link to="/menu">
              <Button variant="empanada" className="px-8 py-3 rounded-full">
                Explorar Menú
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-empanada-darker dark">
      {/* MOBILE HEADER - Simplificado y compacto */}
      <div className="md:hidden fixed top-16 left-0 right-0 bg-empanada-dark/98 backdrop-blur-lg border-b border-empanada-light-gray/30 z-30 shadow-lg">
        <div className="flex items-center justify-between px-4 py-2.5">
          <Link to="/menu">
            <Button variant="ghost" size="sm" className="p-2 hover:bg-empanada-medium rounded-full">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-white text-base">Mi Carrito</h1>
            <div className="w-5 h-5 bg-empanada-golden text-black text-xs font-bold rounded-full flex items-center justify-center">
              {itemCount}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(true)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-full">
            <Trash2 className="w-4.5 h-4.5" />
          </Button>
        </div>
      </div>

      {/* DESKTOP HEADER - Solo visible en desktop */}
      <div className="hidden md:block pt-8 pb-7">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-2">
            <Link to="/menu" className="flex items-center gap-2 text-white hover:text-empanada-golden transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Continuar comprando</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Vaciar carrito
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-white">Tu Carrito</h1>
          <p className="text-gray-300 mt-1">{itemCount} {itemCount === 1 ? 'producto' : 'productos'} en tu carrito</p>
        </div>
      </div>

      {/* MOBILE CONTENT - Diseño integrado sin cards con animaciones mejoradas */}
      <motion.div
        className="md:hidden absolute top-[120px] left-0 right-0"
        style={{
          height: items.length > 3 ? `calc(100vh - 120px - ${isCartSidebarOpen ? '0px' : '220px'})` : 'auto',
          overflow: items.length > 3 ? 'auto' : 'visible',
          touchAction: items.length > 3 ? 'auto' : 'none',
          overscrollBehavior: items.length > 3 ? 'auto' : 'none',
          transition: 'height 0.3s ease-in-out'
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Contenedor de lista integrada con glassmorphism */}
        <motion.div
          className="bg-gradient-to-b from-empanada-dark/90 to-empanada-darker/90 backdrop-blur-sm rounded-t-3xl mx-3 overflow-hidden shadow-2xl border border-empanada-light-gray/10"
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring', damping: 25 }}
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <IntegratedCartItem
                key={`${item.id}-${index}`}
                item={item}
                index={index}
                isMobile={true}
                isLast={index === items.length - 1}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* DESKTOP CONTENT - Layout de 2 columnas */}
      <div className="hidden md:block">
        <div className="container mx-auto px-6 pb-12">
          <div className="grid grid-cols-12 gap-8">
            {/* Columna izquierda - Lista integrada sin cards */}
            <div className="col-span-8">
              {/* Contenedor de lista integrada para desktop */}
              <div className="bg-gradient-to-b from-empanada-dark to-empanada-darker rounded-2xl overflow-hidden shadow-2xl">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <IntegratedCartItem
                      key={`${item.id}-${index}`}
                      item={item}
                      index={index}
                      isMobile={false}
                      isLast={index === items.length - 1}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Columna derecha - Resumen sticky */}
            <div className="col-span-4">
              <div className="sticky top-24">
                <div className="bg-empanada-dark rounded-xl border border-empanada-light-gray p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-white">Resumen del pedido</h3>

                  {/* Promo Code Section */}
                  <AnimatePresence>
                    {promoCode ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4"
                      >
                        <div className="flex items-center justify-between p-3 bg-empanada-dark border border-green-600 rounded-lg">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-green-400 block">
                              {promoCode.code}
                            </span>
                            <p className="text-xs text-green-300">
                              {promoCode.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removePromoCode}
                            className="text-green-400 hover:text-green-300 p-1"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ) : showPromoInput ? (
                      <motion.form
                        onSubmit={handlePromoCode}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-2 mb-4"
                      >
                        <Input
                          name="promoCode"
                          placeholder="Código promocional"
                          className="flex-1"
                          autoFocus
                        />
                        <Button type="submit" variant="outline" size="sm">
                          Aplicar
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPromoInput(false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.form>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() => toast.info("Próximamente podrás usar códigos promocionales", { duration: 3000 })}
                        className="mb-4 w-full justify-start text-gray-300 hover:bg-empanada-medium"
                      >
                        <Tag className="w-4 h-4 mr-2" />
                        ¿Tienes un código promocional?
                      </Button>
                    )}
                  </AnimatePresence>

                  {/* Summary */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Subtotal</span>
                      <span className="font-medium text-white">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Descuento</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-300">Envío</span>
                      <span className="font-medium text-white">{formatPrice(deliveryFee)}</span>
                    </div>
                    <div className="border-t border-empanada-light-gray pt-3">
                      <div className="flex justify-between font-bold text-xl">
                        <span className="text-white">Total</span>
                        <span className="text-empanada-golden">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link to="/checkout" className="block w-full mb-4">
                    <Button variant="empanada" className="w-full py-3 font-semibold text-lg">
                      Proceder al Pago
                    </Button>
                  </Link>

                  {/* Continue Shopping */}
                  <Link to="/menu" className="block w-full">
                    <Button variant="outline" className="w-full menu-category-button">
                      <Plus className="w-4 h-4 mr-2" />
                      ¿Deseas añadir más productos?
                    </Button>
                  </Link>

                  {/* Trust indicators */}
                  <div className="mt-6 pt-4 border-t border-empanada-light-gray text-xs text-gray-300 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Tiempo estimado: 30-45 min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Pago 100% seguro</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE FOOTER - Integrado y siempre visible */}
      <motion.div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${isCartSidebarOpen ? 'translate-y-full' : 'translate-y-0'}`}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, type: 'spring', damping: 25 }}
      >
        <div className="bg-gradient-to-t from-empanada-dark via-empanada-dark/98 to-empanada-dark/95 backdrop-blur-xl border-t border-empanada-light-gray/20 shadow-2xl">
          <div className="px-4 pt-3 pb-6">
            {/* Promo Code Section - Compacto */}
            <AnimatePresence>
              {promoCode ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3"
                >
                  <div className="flex items-center justify-between p-2.5 bg-green-900/20 border border-green-600/40 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Tag className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-green-400 block truncate">
                          {promoCode.code}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removePromoCode}
                      className="text-green-400 hover:text-green-300 p-1.5 h-auto rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ) : showPromoInput ? (
                <motion.form
                  onSubmit={handlePromoCode}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2 mb-3"
                >
                  <Input
                    name="promoCode"
                    placeholder="Código"
                    className="flex-1 rounded-xl border-empanada-light-gray/40 bg-empanada-medium/50 text-white backdrop-blur-sm h-9 text-sm"
                    autoFocus
                  />
                  <Button type="submit" variant="outline" size="sm" className="px-3 rounded-xl h-9 text-xs">
                    Aplicar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPromoInput(false)}
                    className="p-2 rounded-full h-9 w-9"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </motion.form>
              ) : (
                <button
                  onClick={() => toast.info("Próximamente podrás usar códigos promocionales", { duration: 3000 })}
                  className="mb-3 w-full flex items-center justify-start gap-2 py-2 px-3 text-xs text-gray-400 hover:text-gray-300 hover:bg-empanada-medium/40 rounded-xl transition-all duration-200"
                >
                  <Tag className="w-3.5 h-3.5" />
                  ¿Tienes un código promocional?
                </button>
              )}
            </AnimatePresence>

            {/* Desglose de Precios - Siempre visible */}
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Descuento</span>
                  <span className="text-green-400 font-medium">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Envío</span>
                <span className="text-white font-medium">{formatPrice(deliveryFee)}</span>
              </div>

              {/* Separador sutil */}
              <div className="h-px bg-gradient-to-r from-transparent via-empanada-light-gray/30 to-transparent my-2"></div>

              {/* Total destacado */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm text-gray-300 font-medium">Total a pagar</span>
                <span className="text-2xl font-black text-empanada-golden drop-shadow-lg">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Button Hero */}
            <Link to="/checkout" className="block w-full mb-2.5">
              <Button variant="empanada" className="w-full py-3.5 rounded-xl font-bold text-base shadow-lg shadow-empanada-golden/20 hover:shadow-xl hover:shadow-empanada-golden/30 transition-all duration-300">
                Proceder al Pago
              </Button>
            </Link>

            {/* Add More Products Button - Secundario */}
            <Link to="/menu" className="block w-full">
              <Button variant="outline" className="w-full py-2.5 rounded-xl border-empanada-light-gray/30 hover:bg-empanada-medium/40 text-sm">
                <Plus className="w-3.5 h-3.5 mr-2" />
                Añadir más productos
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearCart}
        title="Vaciar Carrito"
        message="¿Estás seguro que deseas eliminar todos los productos de tu carrito?"
      />
    </div>
  );
}
