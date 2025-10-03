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
      <div className="min-h-screen bg-black dark">
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
    <div className="min-h-screen bg-black dark">
      {/* MOBILE HEADER - Solo visible en mobile */}
      <div className="md:hidden fixed top-16 left-0 right-0 bg-empanada-dark/95 backdrop-blur-sm border-b border-empanada-light-gray z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/menu">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="font-semibold text-white">Mi Carrito</h1>
            <p className="text-xs text-gray-300">{itemCount} productos</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(true)} className="p-2 text-red-500">
            <Trash2 className="w-5 h-5" />
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

      {/* MOBILE CONTENT - Diseño integrado sin cards */}
      <div
        className="md:hidden absolute top-32 left-0 right-0"
        style={{
          height: `calc(100vh - 128px - ${isCartSidebarOpen ? '0px' : '280px'})`,
          overflow: 'auto',
          touchAction: 'auto',
          overscrollBehavior: 'auto',
          transition: 'height 0.3s ease-in-out'
        }}
      >
        {/* Contenedor de lista integrada */}
        <div className="bg-gradient-to-b from-empanada-dark to-empanada-darker rounded-t-3xl mx-4 overflow-hidden shadow-2xl">
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
        </div>
      </div>

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
                        onClick={() => setShowPromoInput(true)}
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
                      <span className="font-medium text-white">{deliveryFee > 0 ? formatPrice(deliveryFee) : "GRATIS"}</span>
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
                      <span>Envío gratis en pedidos &gt; $3000</span>
                    </div>
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

      {/* MOBILE FOOTER - Solo visible en mobile, se oculta cuando el menú lateral está abierto */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-empanada-dark border-t border-empanada-light-gray z-40 transition-transform duration-300 ${isCartSidebarOpen ? 'translate-y-full' : 'translate-y-0'}`}>
        <div className="p-4 pb-16">
        {/* Promo Code Section */}
        <AnimatePresence>
          {promoCode ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="flex items-center justify-between p-3 bg-empanada-dark border border-green-600 rounded-xl">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-green-400 block truncate">
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
                  className="text-green-400 hover:text-green-300 p-1 h-auto"
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
                className="flex-1 rounded-xl border-empanada-light-gray bg-empanada-medium text-white"
                autoFocus
              />
              <Button type="submit" variant="outline" size="sm" className="px-4 rounded-xl">
                Aplicar
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPromoInput(false)}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.form>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPromoInput(true)}
              className="mb-4 w-full justify-start text-gray-300"
            >
              <Tag className="w-4 h-4 mr-2" />
              ¿Tienes un código promocional?
            </Button>
          )}
        </AnimatePresence>

        {/* Order Summary */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Subtotal</span>
            <span className="text-white font-medium">{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Descuento</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Envío</span>
            <span className="text-white font-medium">{deliveryFee > 0 ? formatPrice(deliveryFee) : "GRATIS"}</span>
          </div>
          <div className="border-t border-empanada-light-gray pt-2">
            <div className="flex justify-between font-bold text-lg">
              <span className="text-white">Total</span>
              <span className="text-empanada-golden">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <Link to="/checkout" className="block w-full mb-3">
          <Button variant="empanada" className="w-full py-4 rounded-xl font-semibold">
            Proceder al Pago
          </Button>
        </Link>

        {/* Add More Products Button */}
        <Link to="/menu" className="block w-full">
          <Button variant="outline" className="w-full py-4 rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            ¿Deseas añadir más productos?
          </Button>
        </Link>
        </div>
      </div>

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
