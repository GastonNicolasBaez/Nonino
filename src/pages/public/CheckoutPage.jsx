import { useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
    CreditCard, MapPin, Clock, Phone, User, Store,
    Check, ChevronRight, ChevronLeft, ShoppingBag,
    AlertCircle, Truck, Home, Edit2, ArrowRight,
    Shield, Package, ArrowLeft, Star, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/context/CartProvider";
import { formatPrice, cn } from "@/lib/utils";
import { toast } from "sonner";

import { useSession } from "@/context/SessionProvider";
import { usePublicData } from "@/context/PublicDataProvider";

export function CheckoutPage() {
    const { items, total, subtotal, discount, deliveryFee, createOrder, selectedStore } = useCart();
    const {
        callPublicCreateOrder,
        callPublicCreateOrderLoading
    } = usePublicData();

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
            const oldOrder = {
                ...orderData,
                items,
                subtotal,
                discount,
                deliveryFee,
                total,
                selectedStore
            };

            const newItems = items.map((item) => ({
                productId: item.id,
                comboId: 0,
                name: item.name,
                unitPrice: item.price,
                quantity: item.quantity
            }));

            const newDeliveryAddress = {
                contactName: orderData.customerInfo.name,
                contactPhone: orderData.customerInfo.phone,
                street: orderData.address.street,
                number: orderData.address.number,
                apartment: orderData.address.apartment,
                neighborhood: orderData.address.neighborhood,
                city: 'CABA',
                notes: orderData.notes
            }

            const newOrder = {
                storeId: selectedStore.id,
                items: newItems,
                paymentMethod: orderData.paymentMethod == 'mercadopago' ? 'MERCADO_PAGO' : 'CASH',
                fulfillment: orderData.deliveryType == 'delivery' ? 'DELIVERY' : 'PICKUP',
                deliveryAddress: newDeliveryAddress
            }

            // crear la orden aca
            const order = await callPublicCreateOrder(newOrder);

            console.log(order);

            // Si el método de pago es MercadoPago, aquí el backend se encargará
            // de generar el link de pago y redirigir al usuario
            if (orderData.paymentMethod === "mercadopago") {
                toast.success("¡Pedido creado! Serás redirigido al pago...");
                // En producción, el backend retornará el link de MercadoPago
                // window.location.href = order.paymentUrl;
            } else {
                toast.success("¡Pedido realizado exitosamente!");
            }

            //navigate(`/tracking/${order.id}`);
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

    // Step components - Compactos
    const DeliveryStep = useMemo(() => (
        <div className="space-y-4">
            {/* Store Selection */}
            {selectedStore ? (
                <div className="bg-empanada-dark border border-empanada-light-gray rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-green-400 text-sm mb-1">{selectedStore.name}</h3>
                            <p className="text-green-300 text-xs">{selectedStore.address}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-empanada-dark border border-red-600 rounded-lg p-4 text-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-red-400 text-sm mb-1">Selecciona una sucursal</h3>
                    <p className="text-red-300 text-xs">Necesitas elegir una sucursal para continuar</p>
                </div>
            )}

            {/* Delivery Type */}
            <div className="space-y-3">
                <h3 className="text-base font-semibold text-white">¿Cómo quieres recibir tu pedido?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setOrderData(prev => ({ ...prev, deliveryType: "delivery" }))}
                        className={cn(
                            "p-4 rounded-lg border-2 text-left transition-all",
                            orderData.deliveryType === "delivery"
                                ? "border-empanada-golden bg-empanada-golden/5"
                                : "border-empanada-light-gray hover:border-empanada-golden/50"
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                orderData.deliveryType === "delivery"
                                    ? "bg-empanada-golden text-white"
                                    : "bg-empanada-medium text-gray-300"
                            )}>
                                <Truck className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-white text-sm mb-1">Delivery a domicilio</h4>
                                <p className="text-xs text-gray-300 mb-1">Recibe tu pedido en casa</p>
                                <div className="flex items-center gap-1 text-xs text-empanada-golden">
                                    <Clock className="w-3 h-3" />
                                    <span>30-45 min</span>
                                </div>
                            </div>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setOrderData(prev => ({ ...prev, deliveryType: "pickup" }))}
                        className={cn(
                            "p-4 rounded-lg border-2 text-left transition-all",
                            orderData.deliveryType === "pickup"
                                ? "border-empanada-golden bg-empanada-golden/5"
                                : "border-empanada-light-gray hover:border-empanada-golden/50"
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                orderData.deliveryType === "pickup"
                                    ? "bg-empanada-golden text-white"
                                    : "bg-empanada-medium text-gray-300"
                            )}>
                                <Home className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-white text-sm mb-1">Retirar en sucursal</h4>
                                <p className="text-xs text-gray-300 mb-1">Pasa a buscar tu pedido</p>
                                <div className="flex items-center gap-1 text-xs text-empanada-golden">
                                    <Clock className="w-3 h-3" />
                                    <span>15-20 min</span>
                                </div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    ), [selectedStore, orderData.deliveryType]);

    const CustomerInfoStep = useMemo(() => (
        <div className="space-y-4">
            {/* Customer Info */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-empanada-golden/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-empanada-golden" />
                    </div>
                    <h3 className="text-base font-semibold text-white">Información de contacto</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-300">
                            Nombre completo <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={orderData.customerInfo.name}
                            onChange={(e) => handleInputChange("customerInfo", "name", e.target.value)}
                            className={cn(
                                "h-9 text-sm",
                                errors['customerInfo.name']
                                    ? "border-red-300 focus:border-red-500"
                                    : "border-empanada-light-gray bg-empanada-medium text-white placeholder-gray-400 focus:border-empanada-golden"
                            )}
                            placeholder="Tu nombre y apellido"
                        />
                        {errors['customerInfo.name'] && (
                            <p className="text-red-500 text-xs">{errors['customerInfo.name']}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-300">
                            Teléfono <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={orderData.customerInfo.phone}
                            onChange={(e) => handleInputChange("customerInfo", "phone", e.target.value)}
                            className={cn(
                                "h-9 text-sm",
                                errors['customerInfo.phone']
                                    ? "border-red-300 focus:border-red-500"
                                    : "border-empanada-light-gray bg-empanada-medium text-white placeholder-gray-400 focus:border-empanada-golden"
                            )}
                            placeholder="11 1234 5678"
                        />
                        {errors['customerInfo.phone'] && (
                            <p className="text-red-500 text-xs">{errors['customerInfo.phone']}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-300">Email (opcional)</label>
                    <Input
                        type="email"
                        value={orderData.customerInfo.email}
                        onChange={(e) => handleInputChange("customerInfo", "email", e.target.value)}
                        className="h-9 text-sm border-empanada-light-gray bg-empanada-medium text-white placeholder-gray-400 focus:border-empanada-golden"
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
                    className="space-y-3"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-empanada-golden/10 rounded-full flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-empanada-golden" />
                        </div>
                        <h3 className="text-base font-semibold text-white">Dirección de entrega</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-1">
                            <label className="block text-xs font-medium text-gray-300">
                                Calle <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={orderData.address.street}
                                onChange={(e) => handleInputChange("address", "street", e.target.value)}
                                className={cn(
                                    "h-9 text-sm",
                                    errors['address.street']
                                        ? "border-red-300 focus:border-red-500"
                                        : "border-empanada-light-gray bg-empanada-medium text-white placeholder-gray-400 focus:border-empanada-golden"
                                )}
                                placeholder="Av. Corrientes"
                            />
                            {errors['address.street'] && (
                                <p className="text-red-500 text-xs">{errors['address.street']}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-300">
                                Número <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={orderData.address.number}
                                onChange={(e) => handleInputChange("address", "number", e.target.value)}
                                className={cn(
                                    "h-9 text-sm",
                                    errors['address.number']
                                        ? "border-red-300 focus:border-red-500"
                                        : "border-empanada-light-gray bg-empanada-medium text-white placeholder-gray-400 focus:border-empanada-golden"
                                )}
                                placeholder="1234"
                            />
                            {errors['address.number'] && (
                                <p className="text-red-500 text-xs">{errors['address.number']}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-300">Piso</label>
                            <Input
                                value={orderData.address.floor}
                                onChange={(e) => handleInputChange("address", "floor", e.target.value)}
                                className="h-9 text-sm border-empanada-light-gray bg-empanada-medium text-white placeholder-gray-400 focus:border-empanada-golden"
                                placeholder="5"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-300">Depto</label>
                            <Input
                                value={orderData.address.apartment}
                                onChange={(e) => handleInputChange("address", "apartment", e.target.value)}
                                className="h-9 text-sm border-empanada-light-gray bg-empanada-medium text-white placeholder-gray-400 focus:border-empanada-golden"
                                placeholder="A"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-300">Barrio</label>
                            <Input
                                value={orderData.address.neighborhood}
                                onChange={(e) => handleInputChange("address", "neighborhood", e.target.value)}
                                className="h-9 text-sm border-empanada-light-gray bg-empanada-medium text-white placeholder-gray-400 focus:border-empanada-golden"
                                placeholder="Balvanera"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-300">Referencias</label>
                        <textarea
                            value={orderData.address.references}
                            onChange={(e) => handleInputChange("address", "references", e.target.value)}
                            className="w-full px-3 py-2 border border-empanada-light-gray bg-empanada-medium text-white placeholder-gray-400 focus:border-empanada-golden rounded-lg transition-colors resize-none text-sm"
                            rows={2}
                            placeholder="Ej: Casa con portón verde, timbre 2A"
                        />
                    </div>
                </motion.div>
            )}
        </div>
    ), [orderData.customerInfo, orderData.address, orderData.deliveryType, errors, handleInputChange]);

    const PaymentStep = useMemo(() => (
        <div className="space-y-4">
            {/* Payment Method */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-empanada-golden/10 rounded-full flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-empanada-golden" />
                    </div>
                    <h3 className="text-base font-semibold text-white">Método de pago</h3>
                </div>

                <div className="space-y-2">
                    <label className="flex items-start p-4 border-2 border-empanada-light-gray bg-empanada-dark rounded-lg cursor-pointer hover:bg-empanada-medium transition-colors">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="mercadopago"
                            checked={orderData.paymentMethod === "mercadopago"}
                            onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                            className="mt-0.5 w-4 h-4 text-empanada-golden"
                        />
                        <div className="ml-3 flex-1">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CreditCard className="w-4 h-4 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-white text-sm mb-1">Mercado Pago</h4>
                                    <p className="text-xs text-gray-300 mb-2">Tarjetas, transferencias y billeteras digitales</p>
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-3 h-3 text-green-600" />
                                        <span className="text-xs text-green-600 font-medium">Pago seguro</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </label>

                    <label className="flex items-start p-4 border-2 border-empanada-light-gray bg-empanada-dark rounded-lg cursor-pointer hover:bg-empanada-medium transition-colors">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={orderData.paymentMethod === "cash"}
                            onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                            className="mt-0.5 w-4 h-4 text-empanada-golden"
                        />
                        <div className="ml-3 flex-1">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <div className="text-lg">💵</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-white text-sm mb-1">Efectivo</h4>
                                    <p className="text-xs text-gray-300 mb-2">Paga en efectivo al recibir</p>
                                    <div className="flex items-center gap-1">
                                        <Info className="w-3 h-3 text-gray-300" />
                                        <span className="text-xs text-gray-300">Monto exacto preparado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-300">
                    Observaciones para tu pedido
                </label>
                <textarea
                    value={orderData.notes}
                    onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-empanada-light-gray bg-empanada-medium text-white placeholder-gray-400 focus:border-empanada-golden rounded-lg transition-colors resize-none text-sm"
                    rows={3}
                    placeholder="Instrucciones especiales, alergias, etc."
                />
            </div>
        </div>
    ), [orderData.paymentMethod, orderData.notes]);

    const ConfirmStep = useMemo(() => (
        <div className="space-y-4">
            {/* Unified Order Summary */}
            <div className="bg-empanada-dark rounded-lg p-6">
                <h4 className="font-semibold text-white mb-6 flex items-center gap-2 text-lg">
                    <ShoppingBag className="w-5 h-5 text-empanada-golden" />
                    Resumen de tu pedido
                </h4>

                {/* 1. Contact Information - Quién recibe */}
                <div className="mb-4">
                    <h5 className="font-medium text-gray-300 text-sm mb-2">Contacto</h5>
                    <p className="text-sm text-white font-medium">{orderData.customerInfo.name}</p>
                    <p className="text-sm text-gray-300">{orderData.customerInfo.phone}</p>
                </div>

                {/* 2. Delivery Details - Cómo y dónde se entrega */}
                <div className="mb-4">
                    <h5 className="font-medium text-gray-300 text-sm mb-2">Entrega</h5>
                    <div className="flex items-center gap-2 text-sm text-white mb-1">
                        {orderData.deliveryType === "delivery" ? (
                            <>
                                <Truck className="w-4 h-4 text-empanada-golden" />
                                <span>Delivery a domicilio</span>
                            </>
                        ) : (
                            <>
                                <Home className="w-4 h-4 text-empanada-golden" />
                                <span>Retiro en sucursal</span>
                            </>
                        )}
                    </div>
                    <p className="text-xs text-gray-300">
                        Tiempo estimado: {orderData.deliveryType === "delivery" ? "30-45" : "15-20"} min
                    </p>
                </div>

                {/* Address (if delivery) - Parte de los detalles de entrega */}
                {orderData.deliveryType === "delivery" && orderData.address.street && (
                    <div className="mb-4">
                        <h5 className="font-medium text-gray-300 text-sm mb-2">Dirección de entrega</h5>
                        <p className="text-sm text-white">
                            {orderData.address.street} {orderData.address.number}
                            {orderData.address.floor && `, Piso ${orderData.address.floor}`}
                            {orderData.address.apartment && `, Depto ${orderData.address.apartment}`}
                        </p>
                        {orderData.address.neighborhood && (
                            <p className="text-sm text-gray-300">{orderData.address.neighborhood}</p>
                        )}
                        {orderData.address.references && (
                            <p className="text-xs text-gray-300 mt-1">Ref: {orderData.address.references}</p>
                        )}
                    </div>
                )}

                {/* Store Info (if pickup) - Parte de los detalles de entrega */}
                {orderData.deliveryType === "pickup" && selectedStore && (
                    <div className="mb-4">
                        <h5 className="font-medium text-gray-300 text-sm mb-2">Sucursal para retiro</h5>
                        <p className="text-sm text-white font-medium">{selectedStore.name}</p>
                        <p className="text-sm text-gray-300">{selectedStore.address}</p>
                    </div>
                )}

                {/* 3. Payment Method - Cómo paga */}
                <div className="mb-4">
                    <h5 className="font-medium text-gray-300 text-sm mb-2">Método de pago</h5>
                    <div className="flex items-center gap-2 text-sm text-white">
                        <CreditCard className="w-4 h-4 text-empanada-golden" />
                        <span>
                            {orderData.paymentMethod === "mercadopago" ? "Mercado Pago" : "Efectivo"}
                        </span>
                    </div>
                </div>

                {/* 4. Additional Information - Información extra */}
                {orderData.notes && (
                    <div className="mb-6">
                        <h5 className="font-medium text-gray-300 text-sm mb-2">Observaciones</h5>
                        <p className="text-sm text-white">{orderData.notes}</p>
                    </div>
                )}

                {/* 5. FINAL: Products & Pricing - Confirmación final de lo que va a pagar */}
                <div className="mb-0 pt-4 border-t border-empanada-light-gray">
                    <h5 className="font-medium text-gray-300 text-sm mb-3">Productos</h5>
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-10 h-10 object-cover rounded-lg"
                                    />
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-empanada-golden text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {item.quantity}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h6 className="font-medium text-white text-sm truncate">{item.name}</h6>
                                    <p className="text-xs text-empanada-golden">{formatPrice(item.price)} c/u</p>
                                    {item.customizations && Object.keys(item.customizations).length > 0 && (
                                        <p className="text-xs text-gray-300 truncate">
                                            {Object.values(item.customizations).join(", ")}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className="font-semibold text-empanada-golden text-sm">
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Price Summary - Confirmación final */}
                    <div className="mt-4 pt-4 border-t border-empanada-light-gray space-y-2">
                        <div className="flex justify-between text-sm text-gray-300">
                            <span>Subtotal</span>
                            <span className="font-medium">{formatPrice(subtotal)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Descuento</span>
                                <span className="font-medium">-{formatPrice(discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm text-gray-300">
                            <span>Envío</span>
                            <span className={cn("font-medium", deliveryFee === 0 && "text-green-600")}>
                                {deliveryFee > 0 ? formatPrice(deliveryFee) : "GRATIS"}
                            </span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-empanada-light-gray">
                            <span>Total</span>
                            <span className="text-empanada-golden">{formatPrice(total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final confirmation */}
            <div className="bg-empanada-golden/5 border border-empanada-golden/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-empanada-golden/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-empanada-golden" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-empanada-golden text-sm mb-1">¡Casi listo!</h4>
                        <p className="text-xs text-gray-300">
                            Al confirmar recibirás una notificación con el estado de tu pedido.
                            {orderData.paymentMethod === "mercadopago" && " Serás redirigido a Mercado Pago."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    ), [orderData, items, subtotal, discount, deliveryFee, total, selectedStore, formatPrice]);


    return (
        <div className="min-h-screen bg-black dark">
            {/* DESKTOP HEADER - Compacto */}
            <div className="hidden md:block bg-empanada-dark border-b border-empanada-light-gray">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <Link to="/carrito" className="flex items-center gap-2 text-gray-300 hover:text-empanada-golden transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Volver al carrito</span>
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                            <Shield className="w-3 h-3" />
                            Checkout seguro
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Finalizar pedido</h1>
                        <p className="text-gray-300 text-sm">Completa tu información para procesar tu pedido</p>
                    </div>
                </div>
            </div>

            {/* MOBILE HEADER */}
            <div className="md:hidden bg-empanada-dark border-b border-empanada-light-gray sticky top-16 z-40">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link to="/carrito">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="text-center">
                        <h1 className="font-semibold text-white text-sm">{steps[currentStep - 1].title}</h1>
                        <p className="text-xs text-gray-300">Paso {currentStep} de {steps.length}</p>
                    </div>
                    {/* Indicador visual del progreso */}
                    <div className="w-10 flex justify-center">
                        <div className="w-6 h-6 rounded-full bg-empanada-golden/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-empanada-golden">{currentStep}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid gap-6 grid-cols-1">
                        {/* Main Content - Ocupa todo el ancho */}
                        <div className="w-full">
                            <div className="bg-empanada-dark rounded-lg border border-empanada-light-gray p-4 md:p-6 shadow-sm mb-4">
                                {/* Progress Indicator - Optimizado para mobile */}
                                <div className="mb-6 pb-4 border-b border-empanada-light-gray">
                                    {/* Mobile Progress - Optimizado */}
                                    <div className="md:hidden">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "flex items-center justify-center w-10 h-10 rounded-full border-2",
                                                    "bg-empanada-golden text-white border-empanada-golden shadow-sm"
                                                )}>
                                                    {(() => {
                                                        const IconComponent = steps[currentStep - 1].icon;
                                                        return <IconComponent className="w-5 h-5" />;
                                                    })()}
                                                </div>
                                                <div>
                                                    <div className="text-base font-semibold text-empanada-golden">
                                                        {steps[currentStep - 1].title}
                                                    </div>
                                                    <div className="text-xs text-gray-300">
                                                        Paso {currentStep} de {steps.length}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-300">
                                                    {Math.round(currentStep / steps.length * 100)}%
                                                </div>
                                                <div className="text-xs text-gray-300">completo</div>
                                            </div>
                                        </div>

                                        {/* Barra de progreso mobile - simplificada */}
                                        <div className="w-full bg-empanada-medium rounded-full h-3 shadow-inner">
                                            <div
                                                className="bg-gradient-to-r from-empanada-golden to-empanada-wheat h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                                                style={{ width: `${(currentStep / steps.length) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Desktop Progress - Completo */}
                                    <div className="hidden md:flex items-center justify-between">
                                        {steps.map((step, index) => (
                                            <div key={step.id} className="flex items-center flex-1">
                                                <button
                                                    onClick={() => goToStep(step.id)}
                                                    className={cn(
                                                        "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                                                        currentStep === step.id
                                                            ? "bg-empanada-golden text-white border-empanada-golden"
                                                            : completedSteps.has(step.id)
                                                                ? "bg-green-500 text-white border-green-500"
                                                                : "bg-empanada-medium text-gray-300 border-empanada-light-gray"
                                                    )}
                                                >
                                                    {completedSteps.has(step.id) ? (
                                                        <Check className="w-4 h-4" />
                                                    ) : (
                                                        <step.icon className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <div className="ml-2 flex-1">
                                                    <div className={cn(
                                                        "text-xs font-medium",
                                                        currentStep === step.id ? "text-empanada-golden" :
                                                            completedSteps.has(step.id) ? "text-green-600" : "text-gray-300"
                                                    )}>
                                                        {step.title}
                                                    </div>
                                                </div>
                                                {index < steps.length - 1 && (
                                                    <div className={cn(
                                                        "h-0.5 w-12 mx-2 rounded-full",
                                                        completedSteps.has(step.id) || currentStep > step.id ? "bg-empanada-golden" : "bg-empanada-medium"
                                                    )} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {currentStep === 1 && DeliveryStep}
                                        {currentStep === 2 && CustomerInfoStep}
                                        {currentStep === 3 && PaymentStep}
                                        {currentStep === 4 && ConfirmStep}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation Buttons - Integrados */}
                                <div className="flex justify-between items-center pt-6 mt-6 border-t border-empanada-light-gray">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={prevStep}
                                        disabled={currentStep === 1}
                                        className="flex items-center gap-2 px-4 py-2 menu-category-button"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Anterior
                                    </Button>

                                    {currentStep < steps.length ? (
                                        <Button
                                            type="button"
                                            variant="empanada"
                                            onClick={nextStep}
                                            className="flex items-center gap-2 px-6 py-2 font-semibold"
                                        >
                                            Siguiente
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            variant="empanada"
                                            disabled={loading}
                                            onClick={handleSubmit}
                                            className="flex items-center gap-2 px-6 py-2 font-semibold"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                                    Procesando...
                                                </>
                                            ) : (
                                                <>
                                                    <Shield className="w-4 h-4" />
                                                    Confirmar Pedido
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}