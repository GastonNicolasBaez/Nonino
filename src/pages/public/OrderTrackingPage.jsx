import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import { Clock, MapPin, Phone, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { orderService } from "@/services/api";
import { formatPrice, formatDateTime } from "@/lib/utils";

import { usePublicData } from "@/context/PublicDataProvider";
import { useCart } from "@/context/CartProvider";

export function OrderTrackingPage() {

    const {
        callPublicOrderById,
        callPublicOrderByIdLoading,
    } = usePublicData();

    const { clearCart } = useCart();

    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trackingInfo, setTrackingInfo] = useState(null);

    // Función para traducir estados al español
    const getStatusLabel = (status) => {
        const statusLabels = {
            'CREATED': 'Creado',
            'AWAITING_PAYMENT': 'Esperando Pago',
            'PAID': 'Pagado',
            'PENDING': 'Pendiente',
            'PREPARING': 'Preparando',
            'READY': 'Listo',
            'IN_DELIVERY': 'En Camino',
            'DELIVERED': 'Entregado',
            'CANCELLED': 'Cancelado',
            'FAILED': 'Fallido'
        };
        return statusLabels[status?.toUpperCase()] || statusLabels[status] || status;
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await callPublicOrderById(orderId);

                // Leer info adicional del localStorage (guardada al crear el pedido)
                const savedTrackingInfo = JSON.parse(localStorage.getItem('orderTrackingInfo') || '{}');
                const orderInfo = savedTrackingInfo[orderId] || null;
                setTrackingInfo(orderInfo);

                setOrder(response);
                setLoading(false);
                
                // Verificar si ya limpiamos el carrito para esta orden
                const clearedOrders = JSON.parse(localStorage.getItem('clearedOrderCarts') || '[]');
                const alreadyCleared = clearedOrders.includes(orderId);

                // Limpiar carrito solo si el pago fue exitoso Y no lo hemos limpiado antes
                if (response.status === 'PAID' && !alreadyCleared) {
                    console.log('✅ [OrderTracking] Payment confirmed, clearing cart and pending payment totals');
                    clearCart(); // Esto también limpia los totales guardados
                    // Marcar esta orden como procesada
                    clearedOrders.push(orderId);
                    localStorage.setItem('clearedOrderCarts', JSON.stringify(clearedOrders));
                } else if (response.status === 'PAID' && alreadyCleared) {
                    console.log('ℹ️ [OrderTracking] Payment confirmed but cart already cleared for this order');
                } else if (response.status === 'CANCELLED' || response.status === 'FAILED') {
                    // Si el pago fue cancelado o falló, limpiar los totales guardados
                    console.log(`❌ [OrderTracking] Payment ${response.status}, clearing pending totals`);
                    localStorage.removeItem('pendingPaymentTotals');
                } else {
                    console.log(`⏳ [OrderTracking] Payment status is ${response.status}, NOT clearing cart`);
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            }
        };

        fetchOrder();
    }, [orderId]);

    const statusSteps = [
        { key: "CREATED", label: "Pendiente", icon: "⏳" },
        { key: "AWAITING_PAYMENT", label: "Confirmado", icon: "✅" },
        { key: "preparing", label: "Preparando", icon: "👨‍🍳" },
        { key: "ready", label: "Listo", icon: "📦" },
        { key: "inDelivery", label: "En camino", icon: "🚚" },
        { key: "delivered", label: "Entregado", icon: "🎉" },
    ];

    const getCurrentStepIndex = (status) => {
        return statusSteps.findIndex(step => step.key === status);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <p>Buscando tu pedido...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold mb-2">Pedido no encontrado</h1>
                    <p className="text-gray-600">El pedido #{order.orderNumber} no existe o no tienes acceso a él.</p>
                </div>
            </div>
        );
    }

    const currentStep = getCurrentStepIndex(order.status);

    return (
        <div className="min-h-screen bg-black py-8">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2 text-white/80">Estado de tu Pedido</h1>
                        <h2 className="text-2xl font-bold mb-2 text-white">{getStatusLabel(order.status)}</h2>
                    </div>

                    {/* Status Timeline */}
                    <Card className="mb-8 hidden">
                        <CardHeader>
                            <CardTitle>Seguimiento del Pedido n° {order.orderNumber}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                {/* Progress Line */}
                                <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-200">
                                    <div
                                        className="h-full bg-empanada-golden transition-all duration-500"
                                        style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                                    />
                                </div>

                                {/* Status Steps */}
                                <div className="relative flex justify-between">
                                    {statusSteps.map((step, index) => {
                                        const isCompleted = index <= currentStep;
                                        const isCurrent = index === currentStep;

                                        return (
                                            <div key={step.key} className="flex flex-col items-center">
                                                <div
                                                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-4 ${isCompleted
                                                        ? "bg-empanada-golden border-empanada-golden text-white"
                                                        : "bg-white border-gray-300 text-gray-400"
                                                        } ${isCurrent ? "ring-4 ring-empanada-golden/30" : ""}`}
                                                >
                                                    {step.icon}
                                                </div>
                                                <div className="mt-2 text-center">
                                                    <div
                                                        className={`text-sm font-medium ${isCompleted ? "text-empanada-golden" : "text-gray-500"
                                                            }`}
                                                    >
                                                        {step.label}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Current Status Info */}
                            <div className="mt-8 p-4 bg-empanada-golden/10 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-5 h-5 text-empanada-golden" />
                                    <span className="font-medium">Estado actual: {statusSteps[currentStep]?.label}</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {order.status === "preparing" && "Nuestros chefs están preparando tu pedido con cuidado"}
                                    {order.status === "ready" && "Tu pedido está listo para entrega"}
                                    {order.status === "inDelivery" && "Tu pedido está en camino"}
                                    {order.status === "delivered" && "¡Tu pedido ha sido entregado! ¡Que lo disfrutes!"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Order Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalles del Pedido</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">Productos</h4>
                                    <div className="space-y-2">
                                        {order.items && order.items.length > 0 ? (
                                            order.items.map((item, index) => (
                                                <div key={index} className="flex justify-between text-sm">
                                                    <span>{item.quantity}x {item.name}</span>
                                                    {item.unitPrice !== undefined && (
                                                        <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400">No hay productos en esta orden</p>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span className="text-empanada-golden">{formatPrice(order.totalAmount)}</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Información del Pedido</h4>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p>Pedido realizado: {formatDateTime(order.createdAt)}</p>
                                        {/* <p>Tiempo estimado: {order.estimatedDelivery}</p> */}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información de Entrega</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Información para DELIVERY */}
                                {trackingInfo?.fulfillment === 'DELIVERY' && order.deliveryAddress && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-empanada-golden mt-1" />
                                        <div>
                                            <h4 className="font-medium">Dirección de Entrega</h4>
                                            <p className="text-sm text-gray-600">
                                                {order.deliveryAddress.street} {order.deliveryAddress.number}
                                                {order.deliveryAddress.apartment && `, Depto ${order.deliveryAddress.apartment}`}
                                            </p>
                                            {order.deliveryAddress.neighborhood && (
                                                <p className="text-sm text-gray-600">{order.deliveryAddress.neighborhood}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Información para PICKUP */}
                                {trackingInfo?.fulfillment === 'PICKUP' && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-empanada-golden mt-1" />
                                        <div>
                                            <h4 className="font-medium">Retiro en Sucursal</h4>
                                            <p className="text-sm text-white">{trackingInfo.storeName}</p>
                                            <p className="text-sm text-gray-400">{trackingInfo.storeAddress}</p>
                                        </div>
                                    </div>
                                )}

                                {/* <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-empanada-golden mt-1" />
                                    <div>
                                        <h4 className="font-medium">Contacto del Local</h4>
                                        <p className="text-sm text-gray-600">{order.store.phone}</p>
                                    </div>
                                </div> */}

                                {order.status === "inDelivery" && (
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-medium mb-2 flex items-center gap-2">
                                            <span className="text-2xl">🚚</span>
                                            Tu pedido está en camino
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Nuestro repartidor está llegando a tu dirección
                                        </p>
                                        <Button variant="outline" className="w-full">
                                            Llamar al Repartidor
                                        </Button>
                                    </div>
                                )}

                                {order.status === "delivered" && (
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h4 className="font-medium mb-2 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            ¡Pedido Entregado!
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Esperamos que disfrutes tu pedido. ¡Gracias por elegirnos!
                                        </p>
                                        <Button variant="empanada" className="w-full">
                                            Calificar Pedido
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
