import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Tag, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
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
        className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm"
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
      <div className="min-h-screen bg-gray-900 dark">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/pedir">
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
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-400 mb-8 max-w-sm">
              Agrega algunas empanadas deliciosas para comenzar tu pedido
            </p>
            <Link to="/pedir">
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
    <div className="min-h-screen bg-gray-900 dark">
      {/* MOBILE HEADER - Solo visible en mobile */}
      <div className="md:hidden fixed top-16 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/pedir">
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
            <Link to="/pedir" className="flex items-center gap-2 text-white hover:text-empanada-golden transition-colors">
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
          <p className="text-gray-400 mt-1">{itemCount} {itemCount === 1 ? 'producto' : 'productos'} en tu carrito</p>
        </div>
      </div>

      {/* MOBILE CONTENT - Vista actual optimizada para mobile */}
      <div
        className="md:hidden absolute top-32 left-0 right-0 px-4"
        style={{
          height: 'calc(100vh - 128px - 280px)',
          overflow: 'hidden',
          touchAction: 'none',
          overscrollBehavior: 'none'
        }}
      >
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
              className="mb-4"
            >
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex gap-4">
                  {/* Image - más prominente */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-gray-600">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-base leading-tight mb-1 truncate">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-empanada-golden font-semibold text-sm">
                            {formatPrice(item.price)}
                          </p>
                          <span className="text-gray-400 text-xs">c/u</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 p-2 h-auto rounded-full transition-colors"
                        onClick={() => removeItem(item.id, item.customizations)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Customizations */}
                    {item.customizations && Object.keys(item.customizations).length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {Object.entries(item.customizations).map(([key, value]) => (
                          <Badge key={key} variant="secondary" className="text-xs px-2 py-1 bg-empanada-golden/20 text-empanada-golden border border-empanada-golden/30">
                            {value}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Quantity Controls & Total */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-gray-700 rounded-xl p-1 shadow-inner">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.customizations,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <div className="px-4 py-1 font-bold text-white min-w-[3rem] text-center">
                          {item.quantity}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.customizations,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-empanada-golden text-lg">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <div className="text-xs text-gray-400">Total</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* DESKTOP CONTENT - Layout de 2 columnas */}
      <div className="hidden md:block">
        <div className="container mx-auto px-6 pb-12">
          <div className="grid grid-cols-12 gap-8">
            {/* Columna izquierda - Lista de productos */}
            <div className="col-span-8">
              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex gap-6">
                        {/* Imagen más prominente para desktop */}
                        <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-gray-600">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Contenido expandido */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-2">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-3 mb-2">
                                <p className="text-empanada-golden font-bold text-lg">
                                  {formatPrice(item.price)}
                                </p>
                                <span className="text-gray-400 text-sm">por unidad</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 p-3 rounded-full transition-colors"
                              onClick={() => removeItem(item.id, item.customizations)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>

                          {/* Personalizaciones mejoradas */}
                          {item.customizations && Object.keys(item.customizations).length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {Object.entries(item.customizations).map(([key, value]) => (
                                <Badge key={key} variant="secondary" className="px-3 py-1 bg-empanada-golden/20 text-empanada-golden border border-empanada-golden/30">
                                  {value}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Controles de cantidad y precio mejorados */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center bg-gray-700 rounded-xl p-1 shadow-inner">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 w-10 p-0 rounded-lg hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.customizations,
                                    item.quantity - 1
                                  )
                                }
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <div className="px-6 py-2 font-bold text-white text-lg min-w-[4rem] text-center">
                                {item.quantity}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 w-10 p-0 rounded-lg hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.customizations,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="text-right">
                              <div className="text-2xl font-bold text-empanada-golden">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                              <div className="text-sm text-gray-400">
                                Total del producto
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Columna derecha - Resumen sticky */}
            <div className="col-span-4">
              <div className="sticky top-24">
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-sm">
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
                        <div className="flex items-center justify-between p-3 bg-gray-800 border border-green-600 rounded-lg">
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
                        className="mb-4 w-full justify-start text-gray-300 hover:bg-gray-700"
                      >
                        <Tag className="w-4 h-4 mr-2" />
                        ¿Tienes un código promocional?
                      </Button>
                    )}
                  </AnimatePresence>

                  {/* Summary */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="font-medium text-white">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Descuento</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Envío</span>
                      <span className="font-medium text-white">{deliveryFee > 0 ? formatPrice(deliveryFee) : "GRATIS"}</span>
                    </div>
                    <div className="border-t border-gray-600 pt-3">
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
                  <Link to="/pedir" className="block w-full">
                    <Button variant="outline" className="w-full">
                      Continuar comprando
                    </Button>
                  </Link>

                  {/* Trust indicators */}
                  <div className="mt-6 pt-4 border-t border-gray-600 text-xs text-gray-400 space-y-2">
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

      {/* MOBILE FOOTER - Solo visible en mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
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
              <div className="flex items-center justify-between p-3 bg-gray-800 border border-green-600 rounded-xl">
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
                className="flex-1 rounded-xl border-gray-600 bg-gray-700 text-white"
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
          <div className="border-t border-gray-600 pt-2">
            <div className="flex justify-between font-bold text-lg">
              <span className="text-white">Total</span>
              <span className="text-empanada-golden">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <Link to="/checkout" className="block w-full">
          <Button variant="empanada" className="w-full py-4 rounded-xl font-semibold">
            Proceder al Pago
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
