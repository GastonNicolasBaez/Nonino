import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, MapPin, Clock, Phone, User } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../lib/utils";
import { toast } from "sonner";

export function CheckoutPage() {
  const { items, total, subtotal, discount, deliveryFee, createOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [orderData, setOrderData] = useState({
    deliveryType: "delivery",
    customerInfo: {
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
    },
    address: {
      street: "",
      number: "",
      floor: "",
      apartment: "",
      neighborhood: "",
      references: "",
    },
    paymentMethod: "mercadopago",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular proceso de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const order = await createOrder();
      
      toast.success("¡Pedido realizado exitosamente!");
      navigate(`/tracking/${order.id}`);
    } catch (error) {
      toast.error("Error al procesar el pedido");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-8">Finalizar Pedido</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Delivery Type */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tipo de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setOrderData(prev => ({ ...prev, deliveryType: "delivery" }))}
                        className={`p-4 border-2 rounded-lg text-center ${
                          orderData.deliveryType === "delivery"
                            ? "border-empanada-golden bg-empanada-golden/10"
                            : "border-gray-300"
                        }`}
                      >
                        <div className="text-2xl mb-2">🚚</div>
                        <div className="font-medium">Delivery</div>
                        <div className="text-sm text-gray-600">30-45 min</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderData(prev => ({ ...prev, deliveryType: "pickup" }))}
                        className={`p-4 border-2 rounded-lg text-center ${
                          orderData.deliveryType === "pickup"
                            ? "border-empanada-golden bg-empanada-golden/10"
                            : "border-gray-300"
                        }`}
                      >
                        <div className="text-2xl mb-2">🏪</div>
                        <div className="font-medium">Retiro en Local</div>
                        <div className="text-sm text-gray-600">15-20 min</div>
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Información de Contacto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nombre *</label>
                        <Input
                          value={orderData.customerInfo.name}
                          onChange={(e) => handleInputChange("customerInfo", "name", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Teléfono *</label>
                        <Input
                          value={orderData.customerInfo.phone}
                          onChange={(e) => handleInputChange("customerInfo", "phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        value={orderData.customerInfo.email}
                        onChange={(e) => handleInputChange("customerInfo", "email", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Address */}
                {orderData.deliveryType === "delivery" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Dirección de Entrega
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-2">Calle *</label>
                          <Input
                            value={orderData.address.street}
                            onChange={(e) => handleInputChange("address", "street", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Número *</label>
                          <Input
                            value={orderData.address.number}
                            onChange={(e) => handleInputChange("address", "number", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Piso</label>
                          <Input
                            value={orderData.address.floor}
                            onChange={(e) => handleInputChange("address", "floor", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Depto/Casa</label>
                          <Input
                            value={orderData.address.apartment}
                            onChange={(e) => handleInputChange("address", "apartment", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Barrio</label>
                        <Input
                          value={orderData.address.neighborhood}
                          onChange={(e) => handleInputChange("address", "neighborhood", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Referencias</label>
                        <textarea
                          value={orderData.address.references}
                          onChange={(e) => handleInputChange("address", "references", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          rows={2}
                          placeholder="Ej: Casa con portón verde, timbre 2A"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Método de Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="mercadopago"
                          checked={orderData.paymentMethod === "mercadopago"}
                          onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="mr-3"
                        />
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">💳</div>
                          <div>
                            <div className="font-medium">Mercado Pago</div>
                            <div className="text-sm text-gray-600">Tarjetas, transferencias y más</div>
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={orderData.paymentMethod === "cash"}
                          onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="mr-3"
                        />
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">💵</div>
                          <div>
                            <div className="font-medium">Efectivo</div>
                            <div className="text-sm text-gray-600">Pago contra entrega</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Observaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={orderData.notes}
                      onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="Instrucciones especiales para tu pedido..."
                    />
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div>
                          <span>{item.quantity}x {item.name}</span>
                        </div>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
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
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-empanada-golden">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Time */}
                  <div className="bg-empanada-golden/10 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-empanada-golden" />
                      <span>
                        Tiempo estimado: {orderData.deliveryType === "delivery" ? "30-45" : "15-20"} min
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="empanada"
                    className="w-full"
                    disabled={loading}
                    onClick={handleSubmit}
                  >
                    {loading ? "Procesando..." : `Confirmar Pedido - ${formatPrice(total)}`}
                  </Button>

                  <div className="text-xs text-gray-500 text-center">
                    Al confirmar, aceptas nuestros términos y condiciones
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
