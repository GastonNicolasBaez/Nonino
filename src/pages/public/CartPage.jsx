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
        className="bg-white rounded-2xl p-6 w-full max-w-sm"
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
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
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-10">
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
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-8 max-w-sm">
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
    <div className="min-h-screen bg-white">
      {/* 1. NAVBAR DEL CARRITO - DEBAJO DEL NAVBAR PRINCIPAL */}
      <div className="fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/pedir">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="font-semibold">Mi Carrito</h1>
            <p className="text-xs text-gray-500">{itemCount} productos</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(true)} className="p-2 text-red-500">
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 2. LISTVIEW COMPLETAMENTE ESTÁTICO - ALTURA FIJA */}
      <div
        className="absolute top-32 left-0 right-0 px-4"
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
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 truncate">
                          {item.name}
                        </h3>
                        <p className="text-empanada-rich font-medium text-sm">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-500 p-1 h-auto"
                        onClick={() => removeItem(item.id, item.customizations)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Customizations */}
                    {item.customizations && Object.keys(item.customizations).length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {Object.entries(item.customizations).map(([key, value]) => (
                          <Badge key={key} variant="secondary" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600">
                            {value}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Quantity & Total */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-gray-50 rounded-full p-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full hover:bg-white"
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
                        <span className="px-3 py-1 font-medium text-sm min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full hover:bg-white"
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

                      <div className="font-semibold text-empanada-golden">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 3. FOOTER ANCLADO AL FONDO */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
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
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-green-800 block truncate">
                    {promoCode.code}
                  </span>
                  <p className="text-xs text-green-600">
                    {promoCode.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removePromoCode}
                  className="text-green-600 hover:text-green-800 p-1 h-auto"
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
                className="flex-1 rounded-xl border-gray-200"
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
              className="mb-4 w-full justify-start text-empanada-rich"
            >
              <Tag className="w-4 h-4 mr-2" />
              ¿Tienes un código promocional?
            </Button>
          )}
        </AnimatePresence>

        {/* Order Summary */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Descuento</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Envío</span>
            <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : "GRATIS"}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
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
