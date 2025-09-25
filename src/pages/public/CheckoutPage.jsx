import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, MapPin, Clock, Phone, User, Store,
  Check, ChevronRight, ChevronLeft, ShoppingBag,
  AlertCircle, Truck, Home, Edit2, ArrowRight,
  Shield, Package
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useCart } from "../../context/CartProvider";
import { useSession } from "../../context/SessionProvider";
import { formatPrice, cn } from "../../lib/utils";
import { toast } from "sonner";

export function CheckoutPage() {
  const { items, total, subtotal, discount, deliveryFee, createOrder, selectedStore } = useCart();
  const session = useSession();
  const user = session?.userData;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estados modernos para UX mejorada
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  // Steps definition - memoized to prevent dependency changes
  const steps = useMemo(() => [
    { id: 1, title: "Entrega", icon: selectedStore ? Home : Truck, required: true },
    { id: 2, title: "Datos", icon: User, required: true },
    { id: 3, title: "Pago", icon: CreditCard, required: true },
    { id: 4, title: "Confirmar", icon: Check, required: false }
  ], [selectedStore]);

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
      // Validar sucursal seleccionada
      if (!selectedStore) {
        toast.error("Por favor selecciona una sucursal");
        setLoading(false);
        return;
      }

      // Validar datos requeridos
      if (!orderData.customerInfo.name || !orderData.customerInfo.phone) {
        toast.error("Por favor completa tu nombre y teléfono");
        setLoading(false);
        return;
      }

      if (orderData.deliveryType === "delivery") {
        if (!orderData.address.street || !orderData.address.number) {
          toast.error("Por favor completa la dirección de entrega");
          setLoading(false);
          return;
        }
      }

      if (items.length === 0) {
        toast.error("Tu carrito está vacío");
        setLoading(false);
        return;
      }

      // Validar pedido mínimo de la sucursal
      if (selectedStore && selectedStore.minOrder && subtotal < selectedStore.minOrder) {
        toast.error(`El pedido mínimo para ${selectedStore.name} es de ${formatPrice(selectedStore.minOrder)}`);
        setLoading(false);
        return;
      }

      // Crear la orden con toda la información
      const orderWithStore = {
        ...orderData,
        items,
        subtotal,
        discount,
        deliveryFee,
        total,
        selectedStore
      };
      const order = await createOrder(orderWithStore);
      
      // Si el método de pago es MercadoPago, aquí el backend se encargará
      // de generar el link de pago y redirigir al usuario
      if (orderData.paymentMethod === "mercadopago") {
        toast.success("¡Pedido creado! Serás redirigido al pago...");
        // En producción, el backend retornará el link de MercadoPago
        // window.location.href = order.paymentUrl;
      } else {
        toast.success("¡Pedido realizado exitosamente!");
      }
      
      navigate(`/tracking/${order.id}`);
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      toast.error("Error al procesar el pedido. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = useCallback((section, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Clear error when user starts typing - batched update
    if (errors[`${section}.${field}`] || !touched[`${section}.${field}`]) {
      setErrors(prev => ({ ...prev, [`${section}.${field}`]: null }));
      setTouched(prev => ({ ...prev, [`${section}.${field}`]: true }));
    }
  }, [errors, touched]);

  // Validation functions - Memoized
  const validateStep = useCallback((step) => {
    const newErrors = {};

    if (step === 1) {
      if (!selectedStore) {
        newErrors['store'] = 'Selecciona una sucursal';
      }
    }

    if (step === 2) {
      if (!orderData.customerInfo.name.trim()) {
        newErrors['customerInfo.name'] = 'El nombre es requerido';
      }
      if (!orderData.customerInfo.phone.trim()) {
        newErrors['customerInfo.phone'] = 'El teléfono es requerido';
      }
      if (orderData.deliveryType === 'delivery') {
        if (!orderData.address.street.trim()) {
          newErrors['address.street'] = 'La calle es requerida';
        }
        if (!orderData.address.number.trim()) {
          newErrors['address.number'] = 'El número es requerido';
        }
      }
    }

    if (step === 3) {
      if (!orderData.paymentMethod) {
        newErrors['paymentMethod'] = 'Selecciona un método de pago';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [selectedStore, orderData]);

  // Step navigation - Memoized
  const goToStep = useCallback((step) => {
    if (validateStep(currentStep)) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(step);
    }
  }, [currentStep, validateStep]);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length) {
      goToStep(currentStep + 1);
    }
  }, [currentStep, steps.length, goToStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Step components - Memoized to prevent unnecessary re-renders
  const DeliveryStep = useMemo(() => (
    <div className="space-y-4">
      {/* Store Selection - Compact */}
      {selectedStore ? (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">{selectedStore.name}</p>
              <p className="text-sm text-green-600">{selectedStore.address}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
          <AlertCircle className="w-5 h-5 text-red-500 mx-auto mb-2" />
          <p className="text-red-800 font-medium">Selecciona una sucursal para continuar</p>
        </div>
      )}

      {/* Delivery Type - Compact */}
      <div>
        <label className="block text-sm font-medium mb-3 text-empanada-dark">Tipo de Entrega</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setOrderData(prev => ({ ...prev, deliveryType: "delivery" }))}
            className={cn(
              "p-3 rounded-lg border text-center transition-colors",
              orderData.deliveryType === "delivery"
                ? "border-empanada-golden bg-empanada-golden/10 text-empanada-dark"
                : "border-gray-200 hover:border-empanada-golden/50"
            )}
          >
            <Truck className="w-5 h-5 mx-auto mb-1 text-empanada-golden" />
            <div className="text-sm font-medium">Delivery</div>
            <div className="text-xs text-gray-600">30-45 min</div>
          </button>

          <button
            type="button"
            onClick={() => setOrderData(prev => ({ ...prev, deliveryType: "pickup" }))}
            className={cn(
              "p-3 rounded-lg border text-center transition-colors",
              orderData.deliveryType === "pickup"
                ? "border-empanada-golden bg-empanada-golden/10 text-empanada-dark"
                : "border-gray-200 hover:border-empanada-golden/50"
            )}
          >
            <Home className="w-5 h-5 mx-auto mb-1 text-empanada-golden" />
            <div className="text-sm font-medium">Retiro</div>
            <div className="text-xs text-gray-600">15-20 min</div>
          </button>
        </div>
      </div>
    </div>
  ), [selectedStore, orderData.deliveryType]);

  const CustomerInfoStep = useMemo(() => (
    <div className="space-y-4">
      {/* Customer Info - Compact */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-empanada-dark flex items-center gap-2">
          <User className="w-4 h-4 text-empanada-golden" />
          Información de Contacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-700">
              Nombre <span className="text-red-500">*</span>
            </label>
            <Input
              value={orderData.customerInfo.name}
              onChange={(e) => handleInputChange("customerInfo", "name", e.target.value)}
              className={cn(
                "h-9 text-sm",
                errors['customerInfo.name']
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-empanada-golden"
              )}
              placeholder="Tu nombre completo"
            />
            {errors['customerInfo.name'] && (
              <p className="text-red-500 text-xs mt-1">{errors['customerInfo.name']}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-700">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <Input
              value={orderData.customerInfo.phone}
              onChange={(e) => handleInputChange("customerInfo", "phone", e.target.value)}
              className={cn(
                "h-9 text-sm",
                errors['customerInfo.phone']
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-empanada-golden"
              )}
              placeholder="11 1234 5678"
            />
            {errors['customerInfo.phone'] && (
              <p className="text-red-500 text-xs mt-1">{errors['customerInfo.phone']}</p>
            )}
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-xs font-medium mb-1 text-gray-700">Email</label>
          <Input
            type="email"
            value={orderData.customerInfo.email}
            onChange={(e) => handleInputChange("customerInfo", "email", e.target.value)}
            className="h-9 text-sm border-gray-200 focus:border-empanada-golden"
            placeholder="tu@email.com"
          />
        </div>
      </div>

      {/* Address - Solo si es delivery, más compacto */}
      {orderData.deliveryType === "delivery" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div>
            <h3 className="text-sm font-medium mb-3 text-empanada-dark flex items-center gap-2">
              <MapPin className="w-4 h-4 text-empanada-golden" />
              Dirección de Entrega
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1 text-gray-700">
                  Calle <span className="text-red-500">*</span>
                </label>
                <Input
                  value={orderData.address.street}
                  onChange={(e) => handleInputChange("address", "street", e.target.value)}
                  className={cn(
                    "h-9 text-sm",
                    errors['address.street']
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-empanada-golden"
                  )}
                  placeholder="Av. Corrientes"
                />
                {errors['address.street'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['address.street']}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">
                  Número <span className="text-red-500">*</span>
                </label>
                <Input
                  value={orderData.address.number}
                  onChange={(e) => handleInputChange("address", "number", e.target.value)}
                  className={cn(
                    "h-9 text-sm",
                    errors['address.number']
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-empanada-golden"
                  )}
                  placeholder="1234"
                />
                {errors['address.number'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['address.number']}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">Piso</label>
                <Input
                  value={orderData.address.floor}
                  onChange={(e) => handleInputChange("address", "floor", e.target.value)}
                  className="h-9 text-sm border-gray-200 focus:border-empanada-golden"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">Depto</label>
                <Input
                  value={orderData.address.apartment}
                  onChange={(e) => handleInputChange("address", "apartment", e.target.value)}
                  className="h-9 text-sm border-gray-200 focus:border-empanada-golden"
                  placeholder="A"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">Barrio</label>
                <Input
                  value={orderData.address.neighborhood}
                  onChange={(e) => handleInputChange("address", "neighborhood", e.target.value)}
                  className="h-9 text-sm border-gray-200 focus:border-empanada-golden"
                  placeholder="Balvanera"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700">Referencias</label>
              <textarea
                value={orderData.address.references}
                onChange={(e) => handleInputChange("address", "references", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 focus:border-empanada-golden rounded-md text-sm transition-colors"
                rows={2}
                placeholder="Ej: Casa con portón verde, timbre 2A"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  ), [orderData.customerInfo, orderData.address, orderData.deliveryType, errors, handleInputChange]);

  const PaymentStep = useMemo(() => (
    <div className="space-y-4">
      {/* Payment Method - Compact */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-empanada-dark flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-empanada-golden" />
          Método de Pago
        </h3>
        <div className="space-y-2">
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="mercadopago"
              checked={orderData.paymentMethod === "mercadopago"}
              onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
              className="mr-3 w-4 h-4 text-empanada-golden"
            />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-sm text-empanada-dark">Mercado Pago</div>
                <div className="text-xs text-gray-600">Tarjetas, transferencias y más</div>
              </div>
            </div>
          </label>

          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={orderData.paymentMethod === "cash"}
              onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
              className="mr-3 w-4 h-4 text-empanada-golden"
            />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="text-lg">💵</div>
              </div>
              <div>
                <div className="font-medium text-sm text-empanada-dark">Efectivo</div>
                <div className="text-xs text-gray-600">Pago contra entrega</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Notes - Compact */}
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-700">
          Observaciones
        </label>
        <textarea
          value={orderData.notes}
          onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-200 focus:border-empanada-golden rounded-md text-sm transition-colors"
          rows={2}
          placeholder="Instrucciones especiales para tu pedido..."
        />
      </div>
    </div>
  ), [orderData.paymentMethod, orderData.notes]);

  const ConfirmStep = useMemo(() => (
    <div className="space-y-4">
      {/* Order Summary Details - Compact */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-3 text-empanada-dark">Resumen del Pedido</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Tipo:</span>
            <span>{orderData.deliveryType === "delivery" ? "🚚 Delivery" : "🏪 Retiro"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cliente:</span>
            <span>{orderData.customerInfo.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Teléfono:</span>
            <span>{orderData.customerInfo.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pago:</span>
            <span>{orderData.paymentMethod === "mercadopago" ? "💳 Mercado Pago" : "💵 Efectivo"}</span>
          </div>
          {orderData.deliveryType === "delivery" && orderData.address.street && (
            <div className="flex justify-between">
              <span className="text-gray-600">Dirección:</span>
              <span className="text-right">{orderData.address.street} {orderData.address.number}</span>
            </div>
          )}
          <div className="flex items-center justify-center gap-2 text-empanada-golden pt-2 border-t">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              Tiempo estimado: {orderData.deliveryType === "delivery" ? "30-45" : "15-20"} min
            </span>
          </div>
        </div>
      </div>
    </div>
  ), [orderData]);

  const StepIndicator = useMemo(() => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4 sticky top-20 z-10">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <button
              onClick={() => goToStep(step.id)}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                currentStep === step.id
                  ? "bg-empanada-golden text-white border-empanada-golden"
                  : completedSteps.has(step.id)
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-gray-400 border-gray-200"
              )}
            >
              {completedSteps.has(step.id) ? (
                <Check className="w-4 h-4" />
              ) : (
                <step.icon className="w-4 h-4" />
              )}
            </button>

            {/* Step title - always visible but smaller */}
            <div className="ml-2 flex-1">
              <div className={cn(
                "text-xs font-medium transition-colors",
                currentStep === step.id
                  ? "text-empanada-golden"
                  : completedSteps.has(step.id)
                  ? "text-green-600"
                  : "text-gray-500"
              )}>
                {step.title}
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className={cn(
                "h-0.5 w-6 mx-2 transition-colors duration-300",
                completedSteps.has(step.id)
                  ? "bg-green-500"
                  : currentStep > step.id
                  ? "bg-empanada-golden"
                  : "bg-gray-200"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  ), [steps, currentStep, completedSteps, goToStep]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Header - Compact */}
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-empanada-dark mb-1">Finalizar Pedido</h1>
            <p className="text-gray-600 text-sm">Completa tu información para continuar</p>
          </div>

          {StepIndicator}

          {/* Main Content - Single Row Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Steps Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-4 mb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentStep === 1 && DeliveryStep}
                    {currentStep === 2 && CustomerInfoStep}
                    {currentStep === 3 && PaymentStep}
                    {currentStep === 4 && ConfirmStep}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Buttons - Compact */}
              <div className="flex justify-between items-center bg-white rounded-lg p-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    variant="empanada"
                    size="sm"
                    onClick={nextStep}
                    className="flex items-center gap-1"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="empanada"
                    size="sm"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="flex items-center gap-1"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Confirmar
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar - Compact */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-4 sticky top-4">
                <h3 className="font-medium text-empanada-dark mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-empanada-golden" />
                  Tu Pedido
                </h3>

                {/* Items List - Compact */}
                <div className="space-y-2 mb-4">
                  {items.length > 0 ? (
                    items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div className="flex-1 truncate">
                          <span className="font-medium">{item.quantity}x</span> {item.name}
                        </div>
                        <span className="font-semibold text-empanada-golden ml-2">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <ShoppingBag className="w-6 h-6 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">Carrito vacío</p>
                    </div>
                  )}
                  {items.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      y {items.length - 3} artículos más
                    </div>
                  )}
                </div>

                {/* Price Breakdown - Compact */}
                {items.length > 0 && (
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Descuento</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Envío</span>
                      <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                        {deliveryFee > 0 ? formatPrice(deliveryFee) : "GRATIS"}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-empanada-golden">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Estimated Time - Compact */}
                <div className="bg-empanada-golden/10 p-3 rounded-lg mt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-empanada-golden" />
                    <div>
                      <div className="text-xs font-medium text-empanada-dark">Tiempo estimado</div>
                      <div className="text-xs text-empanada-golden font-semibold">
                        {orderData.deliveryType === "delivery" ? "30-45" : "15-20"} min
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
