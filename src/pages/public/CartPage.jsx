import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../lib/utils";

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

  const handlePromoCode = (e) => {
    e.preventDefault();
    const code = e.target.promoCode.value;
    if (code.trim()) {
      applyPromoCode(code.trim());
      e.target.reset();
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
            <p className="text-gray-600 mb-8">
              ¡Agrega algunas deliciosas empanadas para empezar!
            </p>
            <Link to="/menu">
              <Button variant="empanada" size="lg">
                Explorar Menú
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/menu">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Seguir Comprando
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Tu Carrito</h1>
            <p className="text-gray-600">
              {itemCount} {itemCount === 1 ? "producto" : "productos"} en tu carrito
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full sm:w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {formatPrice(item.price)} c/u
                        </p>
                        {item.customizations &&
                          Object.keys(item.customizations).length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {Object.entries(item.customizations).map(([key, value]) => (
                                <Badge key={key} variant="outline" className="text-xs">
                                  {key}: {value}
                                </Badge>
                              ))}
                            </div>
                          )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
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
                            <span className="font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
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
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-lg text-empanada-golden">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => removeItem(item.id, item.customizations)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vaciar Carrito
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Promo Code */}
                <div>
                  <h4 className="font-medium mb-3">Código Promocional</h4>
                  {promoCode ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-green-800">
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
                        className="text-green-600 hover:text-green-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handlePromoCode} className="flex gap-2">
                      <Input
                        name="promoCode"
                        placeholder="Ingresa tu código"
                        className="flex-1"
                      />
                      <Button type="submit" variant="outline" size="icon">
                        <Tag className="w-4 h-4" />
                      </Button>
                    </form>
                  )}
                </div>

                {/* Order Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} productos)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>
                      {deliveryFee > 0 ? formatPrice(deliveryFee) : "GRATIS"}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-empanada-golden">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link to="/checkout" className="block w-full">
                  <Button variant="empanada" className="w-full">
                    Proceder al Pago
                  </Button>
                </Link>

                {/* Continue Shopping */}
                <Link to="/menu" className="block w-full">
                  <Button variant="outline" className="w-full">
                    Seguir Comprando
                  </Button>
                </Link>

                {/* Order Info */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>✓ Envío gratis en pedidos mayores a $3000</p>
                  <p>✓ Tiempo estimado: 30-45 minutos</p>
                  <p>✓ Garantía de calidad</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
