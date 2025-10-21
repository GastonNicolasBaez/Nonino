import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
    CreditCard, MapPin, Clock, Phone, User, Store,
    Check, ChevronRight, ChevronLeft, ShoppingBag,
    AlertCircle, Truck, Home, Edit2, ArrowRight,
    Shield, Package, ArrowLeft, Star, Info,
    Banknote, MessageSquare, Loader2
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
import { useIsMobile } from "@/hooks/useMediaQuery";

export function CheckoutPage() {
    const { items, total, subtotal, discount, deliveryFee, clearCart, selectedStore, savePendingPaymentTotals } = useCart();
    const {
        productos,
        callPublicCreateOrder,
        publicDataCreatingOrderLoading: loading,
        callPublicCreatePreference,
        callPublicCreatePrintJob,
        callPublicOrderById,
    } = usePublicData();
    const isMobile = useIsMobile();


    const session = useSession();
    const user = session?.userData;
    const navigate = useNavigate();

    // Estados modernos para UX mejorada
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState(new Set());
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Recuperar totales guardados si existen (durante redirección a pago)
    const [pendingPaymentTotals, setPendingPaymentTotals] = useState(null);
    const [validatingPendingOrder, setValidatingPendingOrder] = useState(false);

    useEffect(() => {
        const validatePendingOrder = async () => {
            const savedTotals = localStorage.getItem('pendingPaymentTotals');
            if (!savedTotals) return;

            try {
                const parsed = JSON.parse(savedTotals);

                // Si hay un orderId, verificar si la orden sigue pendiente
                if (parsed.orderId) {
                    setValidatingPendingOrder(true);
                    try {
                        const orderStatus = await callPublicOrderById(parsed.orderId);

                        // Solo mantener los totales si la orden sigue pendiente de pago
                        if (orderStatus.status === 'AWAITING_PAYMENT' || orderStatus.status === 'CREATED') {
                            console.log('✅ [Checkout] Pending order found, restoring totals');
                            setPendingPaymentTotals(parsed);
                        } else {
                            console.log('⚠️ [Checkout] Order is no longer pending, clearing totals');
                            localStorage.removeItem('pendingPaymentTotals');
                        }
                    } catch (error) {
                        console.error('Error validating pending order:', error);
                        // Si hay error al validar, limpiar los totales por seguridad
                        localStorage.removeItem('pendingPaymentTotals');
                    }
                    setValidatingPendingOrder(false);
                } else {
                    // Si no hay orderId (totales viejos), limpiarlos
                    console.log('⚠️ [Checkout] No orderId in pending totals, clearing');
                    localStorage.removeItem('pendingPaymentTotals');
                }
            } catch (e) {
                console.error('Error parsing pending payment totals:', e);
                localStorage.removeItem('pendingPaymentTotals');
            }
        };

        validatePendingOrder();
    }, []);

    // Scroll hacia arriba al cargar la página
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Usar totales guardados SOLO si hay un pedido pendiente válido y el carrito está vacío
    const shouldUseStoredTotals = items.length === 0 && pendingPaymentTotals && pendingPaymentTotals.orderId;
    const displaySubtotal = shouldUseStoredTotals ? pendingPaymentTotals.subtotal : subtotal;
    const displayDiscount = shouldUseStoredTotals ? pendingPaymentTotals.discount : discount;
    const displayDeliveryFee = shouldUseStoredTotals ? pendingPaymentTotals.deliveryFee : deliveryFee;
    const displayTotal = shouldUseStoredTotals ? pendingPaymentTotals.total : total;

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

    console.log(orderData);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validar sucursal seleccionada
            if (!selectedStore) {
                // Solo mostrar toast en desktop
                if (!isMobile) {
                    toast.error("Por favor selecciona una sucursal");
                }
                return;
            }

            // Validar datos requeridos
            if (!orderData.customerInfo.name || !orderData.customerInfo.phone) {
                // Solo mostrar toast en desktop
                if (!isMobile) {
                    toast.error("Por favor completa tu nombre y teléfono");
                }
                return;
            }

            if (orderData.deliveryType === "delivery") {
                if (!orderData.address.street || !orderData.address.number) {
                    // Solo mostrar toast en desktop
                    if (!isMobile) {
                        toast.error("Por favor completa la dirección de entrega");
                    }
                    return;
                }
            }

            if (items.length === 0) {
                // Solo mostrar toast en desktop
                if (!isMobile) {
                    toast.error("Tu carrito está vacío");
                }
                return;
            }

            // Validar pedido mínimo de la sucursal
            if (selectedStore && selectedStore.minOrder && subtotal < selectedStore.minOrder) {
                // Solo mostrar toast en desktop
                if (!isMobile) {
                    toast.error(`El pedido mínimo para ${selectedStore.name} es de ${formatPrice(selectedStore.minOrder)}`);
                }
                return;
            }

            const prodCateMap = new Map(productos.map(p => [p.id, p.category]));
            const prodSkuMap = new Map(productos.map(p => [p.id, p.sku]));

            const newItems = [];

            items.forEach(item => {
                // If it's a combo → expand comboDetails
                if (item.isCombo && Array.isArray(item.comboDetails)) {
                    item.comboDetails.forEach(detail => {
                        newItems.push({
                            productId: detail.productId,
                            name: detail.name,
                            //unitPrice: 0,     // 👈 unit price of combo (adjust if you split per item)
                            quantity: detail.quantity,
                            sku: detail.sku ?? "",     // optional if not available
                            hasRecipe: item.hasRecipe,
                        });
                    });
                } else {
                    // Regular item
                    newItems.push({
                        productId: item.id,
                        name: item.name,
                        unitPrice: item.price,
                        quantity: item.quantity,
                        sku: item.sku ?? "",
                        hasRecipe: item.hasRecipe,
                    });
                }
            });

            console.log(newItems);

            const newDeliveryAddress = {
                contactName: orderData.customerInfo.name,
                contactPhone: orderData.customerInfo.phone,
                street: orderData.address.street,
                number: orderData.address.number,
                apartment: orderData.address.apartment,
                neighborhood: orderData.address.neighborhood,
                city: 'CABA',
                notes: orderData.notes,
                references: orderData.references,
            }

            const newOrder = {
                storeId: selectedStore.id,
                items: newItems,
                paymentMethod: orderData.paymentMethod == 'mercadopago' ? 'MERCADO_PAGO' : 'CASH',
                fulfillment: orderData.deliveryType == 'delivery' ? 'DELIVERY' : 'PICKUP',
                deliveryAddress: orderData.deliveryType == 'delivery' ? newDeliveryAddress : null,
                totalAmount: total,
            }

            console.log(newOrder);

            // crear la orden aca
            const createdOrder = await callPublicCreateOrder(newOrder);

            const dA = createdOrder.deliveryShort;

            const shortAddress = dA.street + ' ' + dA.number + ' (' + dA.neighborhood + ')';
            const shortAddressSpecs = "DTO: " + dA.apartment;
            const shortWho = dA.contactName;
            const shortPhone = dA.contactPhone;
            const shortNote = dA.notes;

            // crear orden de impresión
            const printableOrder = {
                id: createdOrder.id,
                orderNumber: createdOrder.orderNumber,
                time: createdOrder.orderDate || createdOrder.date || new Date().toISOString(),
                total: createdOrder.totalAmount,
                fulfillment: createdOrder.fullfillment,
                payment: createdOrder.paymentMethod || 'Efectivo',
                deliveryTo: shortAddress,
                deliveryToSpec: shortAddressSpecs,
                deliveryWho: shortWho,
                deliveryPhone: shortPhone,
                deliveryNotes: shortNote,
                deliveryReferences: orderData.references, // cambiar esto
                fullfillment: createdOrder.fullfillment,
                totalUnits: createdOrder.items.length,
                items: createdOrder.items.map(item => ({
                    qty: item.quantity || item.qty || 1,
                    name: item.name,
                    notes: item.notes || '',
                    sku: prodSkuMap.get(item.productId) ?? null,
                    categoryId: prodCateMap.get(item.productId) ?? null,
                })),
            };

            const ticketJsoned = JSON.stringify(printableOrder);

            const encryptedId = btoa("AmiAmig0Fr4nki3L3GustalANaveg");

            const constructedPrintJob = {
                dataB64: ticketJsoned,
                basic: encryptedId,
                storeId: selectedStore.id,
                orderId: createdOrder.id,
                origin: 'public', // no se guarda. si public, chequear si existe. si existe, no meter. si es admin, meter si o si
                status: createdOrder.paymentMethod == 'MERCADO_PAGO' ? 'PENDIENTE' : 'PARA_IMPRIMIR',
            }

            await callPublicCreatePrintJob(constructedPrintJob);

            // Si el método de pago es MercadoPago, aquí el backend se encargará
            // de generar el link de pago y redirigir al usuario
            if (orderData.paymentMethod === "mercadopago") {
                const createdPreference = await callPublicCreatePreference({
                    _orderId: createdOrder.id,
                    _proof: createdOrder.proof
                });

                // Guardar los totales ANTES de redirigir para mantenerlos durante la redirección
                savePendingPaymentTotals(createdOrder.id);

                // Solo mostrar toast en desktop
                if (!isMobile) {
                    toast.success("¡Pedido creado! Serás redirigido al pago...");
                }
                // No limpiar carrito - se limpiará en OrderTrackingPage cuando el pago sea exitoso
                window.location.href = createdPreference.initPoint;
            } else {
                // Para pagos en efectivo, limpiar totales guardados también
                localStorage.removeItem('pendingPaymentTotals');
                clearCart();
                // Solo mostrar toast en desktop
                if (!isMobile) {
                    toast.success("¡Pedido realizado exitosamente!");
                }
                navigate(`/tracking/${createdOrder.id}`);
            }
        } catch (error) {
            console.error("Error al procesar el pedido:", error);
            // Solo mostrar toast en desktop
            if (!isMobile) {
                toast.error("Error al procesar el pedido. Intenta nuevamente.");
            }
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

        // Clear error when user starts typing
        setErrors(prev => ({ ...prev, [`${section}.${field}`]: null }));
        setTouched(prev => ({ ...prev, [`${section}.${field}`]: true }));
    };

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
            // Scroll hacia arriba al cambiar de paso
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
            // Scroll hacia arriba al ir al paso anterior
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentStep]);

    // Step components - Compactos
    const DeliveryStep = useMemo(() => (
        <div className="space-y-4">
            {/* Store Selection */}
            {selectedStore ? (
                <div className="bg-empanada-medium border border-empanada-light-gray rounded-lg p-4">
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
                <div className="bg-empanada-medium border border-red-600 rounded-lg p-4 text-center">
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
                            "p-4 rounded-lg border-2 text-left transition-colors duration-200",
                            orderData.deliveryType === "delivery"
                                ? "border-empanada-golden bg-empanada-golden/5"
                                : "border-empanada-light-gray bg-empanada-medium/30 hover:border-empanada-golden/50"
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
                                <h4 className="font-semibold text-white text-sm mb-1">Envíos a domicilio</h4>
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
                            "p-4 rounded-lg border-2 text-left transition-colors duration-200",
                            orderData.deliveryType === "pickup"
                                ? "border-empanada-golden bg-empanada-golden/5"
                                : "border-empanada-light-gray bg-empanada-medium/30 hover:border-empanada-golden/50"
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

                <div className="space-y-3">
                    <label className={cn(
                        "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200",
                        orderData.paymentMethod === "mercadopago"
                            ? "border-empanada-golden bg-empanada-golden/5"
                            : "border-empanada-light-gray bg-empanada-medium/30 hover:border-empanada-golden/50"
                    )}>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="mercadopago"
                            checked={orderData.paymentMethod === "mercadopago"}
                            onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                            className="mt-1"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <CreditCard className="w-4 h-4 text-empanada-golden" />
                                <span className="font-semibold text-white text-sm">Mercado Pago</span>
                                <span className="bg-empanada-golden/10 text-empanada-golden text-xs px-2 py-1 rounded-full">Seguro</span>
                            </div>
                            <p className="text-xs text-gray-300">Paga con tarjeta, efectivo o transferencia</p>
                        </div>
                    </label>

                    <label className={cn(
                        "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200",
                        orderData.paymentMethod === "cash"
                            ? "border-empanada-golden bg-empanada-golden/5"
                            : "border-empanada-light-gray bg-empanada-medium/30 hover:border-empanada-golden/50"
                    )}>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={orderData.paymentMethod === "cash"}
                            onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                            className="mt-1"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Banknote className="w-4 h-4 text-empanada-golden" />
                                <span className="font-semibold text-white text-sm">Efectivo</span>
                                <span className="bg-empanada-golden/10 text-empanada-golden text-xs px-2 py-1 rounded-full">Rápido</span>
                            </div>
                            <p className="text-xs text-gray-300">Paga cuando recibas tu pedido</p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Observations */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                    Observaciones para tu pedido
                </label>
                <textarea
                    value={orderData.observations}
                    onChange={(e) => handleInputChange("observations", e.target.value)}
                    className="w-full px-3 py-2 border border-empanada-light-gray bg-empanada-medium text-white placeholder-gray-400 focus:border-empanada-golden rounded-lg transition-colors resize-none text-sm"
                    rows={3}
                    placeholder="Ej: Sin cebolla, extra salsa, etc."
                />
            </div>
        </div>
    ), [orderData.paymentMethod, orderData.observations, handleInputChange]);

    const ConfirmStep = useMemo(() => (
        <div className="space-y-4">
            {/* Resumen de datos */}
            <div className="space-y-3">
                {/* Información de contacto */}
                <div className="bg-empanada-medium border border-empanada-light-gray rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-empanada-golden" />
                        <h5 className="font-semibold text-white text-sm">Contacto</h5>
                    </div>
                    <p className="text-sm text-white">{orderData.customerInfo.name}</p>
                    <p className="text-xs text-gray-300">{orderData.customerInfo.phone}</p>
                </div>

                {/* Información de entrega */}
                <div className="bg-empanada-medium border border-empanada-light-gray rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                        {orderData.deliveryType === "delivery" ? (
                            <Truck className="w-4 h-4 text-empanada-golden" />
                        ) : (
                            <Home className="w-4 h-4 text-empanada-golden" />
                        )}
                        <h5 className="font-semibold text-white text-sm">Entrega</h5>
                    </div>
                    <p className="text-sm text-white">
                        {orderData.deliveryType === "delivery" ? "Envío a domicilio" : "Retiro en sucursal"}
                    </p>
                    {orderData.deliveryType === "delivery" && orderData.address.street && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-300">
                                {orderData.address.street} {orderData.address.number}
                                {orderData.address.floor && `, Piso ${orderData.address.floor}`}
                                {orderData.address.apartment && `, Depto ${orderData.address.apartment}`}
                            </p>
                            {orderData.address.neighborhood && (
                                <p className="text-xs text-gray-300">{orderData.address.neighborhood}</p>
                            )}
                        </div>
                    )}
                    {orderData.deliveryType === "pickup" && selectedStore && (
                        <div className="mt-2">
                            <p className="text-sm text-white">{selectedStore.name}</p>
                            <p className="text-xs text-gray-300">{selectedStore.address}</p>
                        </div>
                    )}
                </div>

                {/* Método de pago */}
                <div className="bg-empanada-medium border border-empanada-light-gray rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4 text-empanada-golden" />
                        <h5 className="font-semibold text-white text-sm">Pago</h5>
                    </div>
                    <p className="text-sm text-white">
                        {orderData.paymentMethod === "mercadopago" ? "Mercado Pago" : "Efectivo"}
                    </p>
                </div>

                        {/* Observaciones - Si existen */}
                        {orderData.observations && (
                            <div className="bg-empanada-medium border border-empanada-light-gray rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="w-4 h-4 text-empanada-golden" />
                                    <h5 className="font-semibold text-white text-sm">Observaciones</h5>
                                </div>
                                <p className="text-sm text-gray-300">{orderData.observations}</p>
                            </div>
                        )}

                        {/* Productos */}
                        <div className="bg-empanada-medium border border-empanada-light-gray rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-3">
                                <Package className="w-4 h-4 text-empanada-golden" />
                                <h5 className="font-semibold text-white text-sm">Productos</h5>
                                <div className="ml-auto text-xs text-gray-300">
                                    {items.length} {items.length === 1 ? 'producto' : 'productos'}
                                </div>
                            </div>

                            <div className="space-y-2">
                                {items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-2 bg-empanada-dark/50 rounded-lg"
                                    >
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-empanada-golden text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h6 className="font-medium text-white text-sm truncate">{item.name}</h6>
                                            <p className="text-xs text-gray-300">{formatPrice(item.price)} c/u</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="font-semibold text-empanada-golden text-sm">
                                                {formatPrice(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Resumen de precios */}
                        <div className="bg-empanada-medium border border-empanada-light-gray rounded-lg p-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-300">Subtotal</span>
                                    <span className="text-white">{formatPrice(displaySubtotal)}</span>
                                </div>
                                {displayDiscount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Descuento</span>
                                        <span className="text-green-400">-{formatPrice(displayDiscount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-300">Envío</span>
                                    <span className={cn(displayDeliveryFee === 0 && "text-green-400")}>
                                        {displayDeliveryFee > 0 ? formatPrice(displayDeliveryFee) : "GRATIS"}
                                    </span>
                                </div>

                                <div className="border-t border-empanada-light-gray pt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-semibold text-white">Total</span>
                                        <span className="text-lg font-bold text-empanada-golden">
                                            {formatPrice(displayTotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
            </div>

            {/* Confirmación final */}
            <div className="text-center py-4">
                <p className="text-sm text-gray-300">
                    Al confirmar, tu pedido será procesado y recibirás una confirmación.
                    {orderData.paymentMethod === "mercadopago" && " Serás redirigido a Mercado Pago para completar el pago."}
                </p>
            </div>
        </div>
    ), [orderData, items, displaySubtotal, displayDiscount, displayDeliveryFee, displayTotal, selectedStore, formatPrice]);


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
                                {/* Progress Indicator - Simplificado */}
                                <div className="mb-6 pb-4 border-b border-empanada-light-gray">
                                    {/* Mobile Progress - Compacto */}
                                    <div className="md:hidden">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "flex items-center justify-center w-10 h-10 rounded-full border-2",
                                                    "bg-empanada-golden text-white border-empanada-golden"
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
                                        <div className="w-full bg-empanada-medium rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-empanada-golden to-empanada-wheat h-3 rounded-full transition-all duration-500"
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

                                {/* Navigation Buttons */}
                                <div className="flex justify-between items-center pt-6 mt-6 border-t border-empanada-light-gray">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={prevStep}
                                        disabled={currentStep === 1}
                                        className={cn(
                                            "flex items-center gap-2",
                                            currentStep === 1 && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Anterior
                                    </Button>

                                    {currentStep < steps.length ? (
                                        <Button
                                            type="button"
                                            variant="empanada"
                                            onClick={nextStep}
                                            className="flex items-center gap-2"
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
                                            className={cn(
                                                "flex items-center gap-2 bg-green-600 hover:bg-green-700",
                                                loading && "opacity-70 cursor-not-allowed"
                                            )}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Procesando...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Shield className="w-4 h-4" />
                                                    <span>Confirmar Pedido</span>
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