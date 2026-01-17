/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

// CORE
import { useState, useEffect, useRef, useMemo } from "react";

// EXTERNO
import { toast } from "sonner";

// COMPONENTES
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Portal } from "@/components/common/Portal";
import { SectionHeader } from "@/components/branding";
import { useConfirmModal } from "@/components/common/ConfirmModal";

// ICONOS
import {
    ShoppingCart,
    RefreshCw,
    Eye,
    Printer,
    DollarSign,
    Check,
    Activity,
    ShoppingBag,
    Search,
    X,
    User,
    Package,
    Mail,
    Phone,
    MapPin
} from "lucide-react";

// PROVIDERS
import { useAdminData } from "@/context/AdminDataProvider";
import { useSession } from "@/context/SessionProvider";

// UTILIDADES Y SERVICIOS
import { formatPrice } from "@/lib/utils";

// ------------------ CONSTANTES ------------------ //
const statuses = {
    PENDING: 'AWAITING_PAYMENT',
    PREPARING: 'PAID',
    CREATED: 'CREATED',
    READY: '',
    DELIVERED: 'CLOSED',
    COMPLETED: 'CLOSED',
    CANCELLED: 'CANCELED',
    REJECTED: 'REJECTED',
}

// Función helper para obtener label de status
function getStatusLabel(status) {
    switch (status) {
        case statuses.PENDING: return 'Pago pendiente';
        case statuses.PREPARING: return 'Preparando';
        case statuses.READY: return 'Listo';
        case statuses.DELIVERED: return 'Entregado';
        case statuses.COMPLETED: return 'Completado';
        case statuses.CANCELLED: return 'Cancelado';
        case statuses.CREATED: return 'Creado';
        default: return status;
    }
}

// Función helper para obtener clases CSS del estado
function getStatusClass(status) {
    const base = 'px-2 py-1.5 rounded text-sm text-nowrap ';
    switch (status) {
        case statuses.CREATED:
        case statuses.PENDING:
            return base + 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-100';
        case statuses.PREPARING:
            return base + 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-100';
        case statuses.READY:
            return base + 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-100';
        case statuses.DELIVERED:
        case statuses.COMPLETED:
            return base + 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-100';
        case statuses.CANCELLED:
            return base + 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-100';
        default:
            return base + 'bg-gray-50 text-gray-800 border-gray-200 dark:bg-empanada-dark/50 dark:text-gray-100';
    }
}

// ------------------ COMPONENTE MODAL ------------------ //
function OrderViewModal({ order, onClose }) {
    if (!order) return null;

    return (
        <Portal>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4">
                <div className="w-full max-w-5xl h-[95vh] flex flex-col">
                    <Card className="shadow-2xl h-full flex flex-col">
                        <CardHeader className="pb-4 flex-shrink-0 bg-gray-50 dark:bg-empanada-dark border-b border-gray-200 dark:border-empanada-light-gray">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Detalles de la Orden #{order.orderNumber}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className={`status-badge ${order.status === statuses.COMPLETED || order.status === statuses.DELIVERED ? 'status-badge-success' :
                                            order.status === statuses.PREPARING ? 'status-badge-info' :
                                                order.status === statuses.READY ? 'status-badge-warning' :
                                                    order.status === statuses.CANCELLED ? 'status-badge-danger' :
                                                        'status-badge-warning'
                                            }`}>
                                            {getStatusLabel(order.status)}
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(order.createdAt).toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-200 dark:hover:bg-empanada-medium">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-y-auto px-6 py-6">
                            <div className="grid grid-cols-1 gap-6 h-full">
                                <div className="xl:col-span-2 space-y-6">
                                    {/* Información del Cliente */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                                <User className="w-4 h-4" />
                                                Información del Cliente
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <p className="text-gray-900 dark:text-white"><strong className="text-gray-700 dark:text-white">Nombre:</strong> {order.customerName || 'N/A'}</p>
                                                {order.customerEmail && (
                                                    <p className="flex items-center gap-2 text-gray-900 dark:text-white">
                                                        <Mail className="w-3 h-3" />
                                                        {order.customerEmail}
                                                    </p>
                                                )}
                                                {order.customerPhone && (
                                                    <p className="flex items-center gap-2 text-gray-900 dark:text-white">
                                                        <Phone className="w-3 h-3" />
                                                        {order.customerPhone}
                                                    </p>
                                                )}
                                                {order.deliveryAddress && (
                                                    <p className="flex items-center gap-2 text-gray-900 dark:text-white">
                                                        <MapPin className="w-3 h-3" />
                                                        {order.deliveryAddress}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                                <Package className="w-4 h-4" />
                                                Detalles de la Orden
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <p className="text-gray-900 dark:text-white"><strong className="text-gray-700 dark:text-white">Tipo:</strong> {order.fulfillment || 'N/A'}</p>
                                                <p className="text-gray-900 dark:text-white"><strong className="text-gray-700 dark:text-white">Pago:</strong> {order.paymentMethod || 'Efectivo'}</p>
                                                <p className="text-gray-900 dark:text-white"><strong className="text-gray-700 dark:text-white">Items:</strong> {order.itemsCount || 0} productos</p>
                                                {order.notes && <p className="text-gray-900 dark:text-white"><strong className="text-gray-700 dark:text-white">Notas:</strong> {order.notes}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items de la Orden */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Productos</h3>
                                        <div className="border border-gray-200 dark:border-empanada-light-gray rounded-lg overflow-hidden">
                                            <table className="w-full">
                                                <thead className="bg-gray-50 dark:bg-empanada-dark">
                                                    <tr>
                                                        <th className="text-left p-3 text-gray-700 dark:text-white">Producto</th>
                                                        <th className="text-center p-3 text-gray-700 dark:text-white">Cantidad</th>
                                                        <th className="text-right p-3 text-gray-700 dark:text-white">Precio Unit.</th>
                                                        <th className="text-right p-3 text-gray-700 dark:text-white">Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.isArray(order.items) && order.items.length > 0 ? (
                                                        order.items.map((item, index) => (
                                                            <tr key={index} className="border-t border-gray-200 dark:border-empanada-light-gray">
                                                                <td className="p-3 text-gray-900 dark:text-white">{item.name}</td>
                                                                <td className="text-center p-3 text-gray-900 dark:text-white">{item.quantity}</td>
                                                                <td className="text-right p-3 text-gray-900 dark:text-white">{formatPrice(item.unitPrice)}</td>
                                                                <td className="text-right p-3 text-gray-900 dark:text-white">{formatPrice(item.quantity * item.unitPrice)}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="text-center p-6 text-gray-500 dark:text-gray-400">
                                                                No hay productos en esta orden
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-end">
                                        <div className="text-right space-y-1">
                                            {order.subtotal && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Subtotal: {formatPrice(order.subtotal)}</p>
                                            )}
                                            {order.deliveryFee && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Envío: {formatPrice(order.deliveryFee)}</p>
                                            )}
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                Total: {formatPrice(order.totalAmount)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        {/* Footer */}
                        <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-empanada-light-gray bg-gray-50 dark:bg-empanada-dark">
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={onClose} className="hover:bg-gray-200 dark:hover:bg-empanada-medium">
                                    Cerrar
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Portal>
    );
}

// ------------------ COMPONENTE PRINCIPAL ------------------ //
export function LocalDashboard() {
    const {
        orders,
        adminDataLoading: loading,
        callOrderPayCash,
        callOrderClose,
        callPublicForcePrintJob,
        callOrders
    } = useAdminData();

    const session = useSession();
    const { openModal: openConfirmModal, ConfirmModalComponent } = useConfirmModal();

    const [searchTerm, setSearchTerm] = useState("");
    const [viewingOrder, setViewingOrder] = useState(null);
    const [newOrderIds, setNewOrderIds] = useState(new Set());
    const previousOrderIdsRef = useRef(new Set());
    const autoRefreshIntervalRef = useRef(null);
    const highlightTimeoutRef = useRef(null);

    // Filtrar órdenes según los criterios especificados - Optimizado con useMemo
    const filteredOrders = useMemo(() => {
        if (!orders || orders.length === 0) return [];

        return orders.filter(order => {
            // Filtro de búsqueda
            const matchesSearch = searchTerm === "" ||
                String(order.orderNumber).toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            // Caso 1: Esperando pago en efectivo (AWAITING_PAYMENT + CASH)
            const isAwaitingCashPayment =
                order.status === statuses.PENDING &&
                (order.paymentMethod === 'CASH' || order.paymentMethod === 'cash');

            // Caso 2: Ya pagadas (PAID - cualquier método de pago)
            const isPaid = order.status === statuses.PREPARING;

            return isAwaitingCashPayment || isPaid;
        });
    }, [orders, searchTerm]);

    // Detectar órdenes nuevas - Optimizado para mejor performance
    useEffect(() => {
        if (!orders || orders.length === 0) {
            previousOrderIdsRef.current = new Set();
            return;
        }

        const currentOrderIds = new Set(filteredOrders.map(order => order.id));

        // Solo procesar si hay cambios reales en los IDs
        const hasChanges = currentOrderIds.size !== previousOrderIdsRef.current.size ||
            [...currentOrderIds].some(id => !previousOrderIdsRef.current.has(id));

        if (!hasChanges) return;

        const newIds = new Set();

        // Detectar IDs nuevos solo si previousOrderIdsRef no está vacío (evita marcar todo como nuevo al cargar)
        if (previousOrderIdsRef.current.size > 0) {
            currentOrderIds.forEach(id => {
                if (!previousOrderIdsRef.current.has(id)) {
                    newIds.add(id);
                }
            });
        }

        if (newIds.size > 0) {
            // Limpiar timeout previo si existe
            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
            }

            setNewOrderIds(newIds);

            // Usar requestAnimationFrame para mejor performance
            highlightTimeoutRef.current = setTimeout(() => {
                requestAnimationFrame(() => {
                    setNewOrderIds(new Set());
                });
            }, 3000);
        }

        // Actualizar referencia de IDs previos
        previousOrderIdsRef.current = currentOrderIds;
    }, [orders, searchTerm]); // Dependencias optimizadas

    // Auto-actualización cada 5 minutos
    useEffect(() => {
        autoRefreshIntervalRef.current = setInterval(() => {
            if (callOrders && session?.userData?.accessToken) {
                callOrders(session.userData.accessToken);
            }
        }, 5 * 60 * 1000); // 5 minutos = 300,000 ms

        return () => {
            if (autoRefreshIntervalRef.current) {
                clearInterval(autoRefreshIntervalRef.current);
            }
            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
            }
        };
    }, [callOrders, session]);

    // Cerrar modal con ESC
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && viewingOrder) {
                setViewingOrder(null);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [viewingOrder]);

    // Handlers
    const handleViewOrder = (order) => {
        setViewingOrder(order);
    };

    const handlePayCashOrder = (order) => {
        openConfirmModal({
            title: "Pagar con efectivo",
            message: "¿Estás seguro de que quieres pagar esta orden con efectivo? Esta acción no se puede deshacer.",
            type: "warning",
            confirmText: "Pagar",
            onConfirm: () => {
                callOrderPayCash({
                    _orderId: order.id,
                    _accessToken: session.userData.accessToken,
                })
                toast.success("Orden pagada correctamente");
            }
        });
    };

    const handleCloseOrder = (orderId) => {
        openConfirmModal({
            title: "Cerrar Orden",
            message: "¿Estás seguro de que quieres cerrar esta orden? Esta acción no se puede deshacer.",
            type: "danger",
            confirmText: "Cerrar",
            onConfirm: () => {
                callOrderClose({
                    _orderId: orderId,
                    _accessToken: session.userData.accessToken,
                });
                toast.success("Orden cerrada correctamente");
            }
        });
    };

    const handlePrintOrder = async (order) => {
        try {
            await callPublicForcePrintJob(order.id);
            toast.success("Ticket enviado a impresora");
        } catch {
            toast.error("Error al procesar la impresión");
        }
    };

    const handleRefresh = () => {
        if (callOrders && session?.userData?.accessToken) {
            callOrders(session.userData.accessToken);
        }
        toast.info("Actualizando órdenes...");
    };

    // Header actions
    const headerActions = [
        {
            label: "Actualizar",
            variant: "outline",
            className: "h-9 px-4 text-sm font-medium",
            onClick: handleRefresh,
            icon: <RefreshCw className="w-4 h-4 mr-2" />
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-empanada-golden border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-empanada-golden/20 rounded-full mx-auto"></div>
                    </div>
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Cargando pedidos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <SectionHeader
                title="Órdenes activas"
                icon={<Activity className="w-6 h-6" />}
                actions={headerActions}
            />

            {/* Card con tabla de órdenes */}
            <Card>

                {/* Búsqueda */}
                <CardContent className="py-3">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Buscar por número de orden..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>

                {/* Tabla */}
                <CardContent className="pt-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-empanada-dark border-b border-gray-200 dark:border-empanada-light-gray">
                                <tr>
                                    <th className="text-left p-4">N°</th>
                                    <th className="text-left p-4">Hora</th>
                                    <th className="text-left p-4">Entrega</th>
                                    <th className="text-left p-4">Estado</th>
                                    <th className="text-left p-4">Items</th>
                                    <th className="text-right p-4">Total</th>
                                    <th className="text-center p-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => {
                                    const payCashEnabled = order.status === statuses.PENDING || order.status === statuses.CREATED;
                                    const closeOrderEnabled = order.status !== statuses.COMPLETED;
                                    const printEnabled = order.status !== statuses.CREATED;
                                    const isNewOrder = newOrderIds.has(order.id);

                                    return (
                                        <tr
                                            key={order.id}
                                            className={`border-b admin-table-row transition-all duration-1000 ${isNewOrder ? 'animate-highlight-fade' : ''
                                                }`}
                                        >
                                            <td className="p-4">
                                                <span className="font-mono text-sm">{order.orderNumber}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm">
                                                    {new Date(order.createdAt).toLocaleTimeString('es-AR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false
                                                    }).replace(':', ' : ')}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm">{order.fulfillment}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={getStatusClass(order.status)}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm">{order.itemsCount}</span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="font-bold">{formatPrice(order.totalAmount)}</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewOrder(order)}
                                                        title="Detalles"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handlePayCashOrder(order)}
                                                        title="Pagar con efectivo"
                                                        disabled={!payCashEnabled}
                                                    >
                                                        <DollarSign className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handlePrintOrder(order)}
                                                        title="Imprimir"
                                                        disabled={!printEnabled}
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleCloseOrder(order.id)}
                                                        title="Cerrar"
                                                        disabled={!closeOrderEnabled}
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredOrders.length === 0 && (
                            <div className="text-center py-12">
                                <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    {searchTerm
                                        ? 'No se encontraron órdenes con los filtros aplicados'
                                        : 'No hay órdenes activas (pendientes de pago en efectivo o pagadas)'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Modales */}
            {viewingOrder && (
                <OrderViewModal
                    order={viewingOrder}
                    onClose={() => setViewingOrder(null)}
                />
            )}

            <ConfirmModalComponent />

            {/* Estilos para la animación de highlight */}
            <style>{`
                @keyframes highlight-fade {
                    0% {
                        background-color: rgba(251, 191, 36, 0.35);
                        transform: translateZ(0);
                    }
                    15% {
                        background-color: rgba(251, 191, 36, 0.35);
                    }
                    100% {
                        background-color: transparent;
                        transform: translateZ(0);
                    }
                }

                .animate-highlight-fade {
                    animation: highlight-fade 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    will-change: background-color;
                    backface-visibility: hidden;
                    -webkit-font-smoothing: subpixel-antialiased;
                }

                /* Optimización para dark mode */
                .dark .animate-highlight-fade {
                    animation: highlight-fade-dark 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                @keyframes highlight-fade-dark {
                    0% {
                        background-color: rgba(251, 191, 36, 0.25);
                        transform: translateZ(0);
                    }
                    15% {
                        background-color: rgba(251, 191, 36, 0.25);
                    }
                    100% {
                        background-color: transparent;
                        transform: translateZ(0);
                    }
                }
            `}</style>
        </div>
    );
}
