/**
 * ORDER MANAGEMENT - NONINO EMPANADAS
 * Gestión de órdenes con datos mock funcionales
 */

import { useState, useEffect } from "react";
// Removed framer-motion for simpler admin experience
import {
    Search,
    Filter,
    Eye,
    Edit,
    Printer,
    Phone,
    Mail,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    RefreshCw,
    ShoppingCart,
    Package,
    Truck,
    User,
    DollarSign,
    Download,
    X,
    Save,
    Plus,
    Minus,
    ShoppingBag,
    Trash2,
    Check
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { formatPrice, formatDateTime } from "../../lib/utils";
import { toast } from "sonner";
import { useConfirmModal } from "../../components/common/ConfirmModal";
import { Portal } from "../../components/common/Portal";
import { NewOrderModal } from "./components/NewOrderModal";
import { OrderEditModal } from "./components/OrderEditModal";
import { generateOrdersReportPDF, downloadPDF } from "../../services/pdfService";
import { SectionHeader, CustomSelect } from "@/components/branding";
import { TicketPreview } from "../../components/common/TicketPreview";

import { formatToEscPos } from "@/services/printFormatter";

import { useAdminData } from "@/context/AdminDataProvider";
import { useSession } from "@/context/SessionProvider";
import { usePublicData } from "@/context/PublicDataProvider";
import html2canvas from "html2canvas";

// Función para generar HTML de la comanda para cocina
// function generateTicketHTML(order) {
//     const orderTime = new Date(order.time || order.orderDate || Date.now());
//     const formattedDate = orderTime.toLocaleDateString('es-AR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//     });
//     const formattedTime = orderTime.toLocaleTimeString('es-AR', {
//         hour: '2-digit',
//         minute: '2-digit'
//     });

//     return `
//     <div style="width: 384px; font-family: 'Courier New', monospace; font-size: 16px; line-height: 1.6; color: #000; background-color: #fff;">
//       <!-- Header -->
//       <div style="text-align: center; margin-bottom: 24px;">
//         <div style="font-size: 26px; font-weight: bold; letter-spacing: 2px;">COMANDA DE COCINA</div>
//         <div style="font-size: 20px; font-weight: bold; margin-top: 8px;">NONINO EMPANADAS</div>
//       </div>

//       <div style="border-bottom: 2px solid #000; margin: 16px 0;"></div>

//       <!-- Número de Orden -->
//       <div style="margin-bottom: 16px;">
//         <div style="font-size: 20px; font-weight: bold; text-align: center; letter-spacing: 1px;">
//           ORDEN #
//         </div>
//         <div style="font-size: 80px; font-weight: bold; text-align: center; letter-spacing: 1px;">
//           ${order.id}
//         </div>
//       </div>

//       <div style="border-bottom: 2px solid #000; margin: 16px 0;"></div>

//       <!-- Fecha y Hora -->
//       <div style="margin-bottom: 24px;">
//         <div style="font-size: 20px; text-align: center; margin-bottom: 4px;">
//           <strong>${formattedDate} - ${formattedTime}</strong> 
//         </div>
//       </div>

//       <div style="border-bottom: 2px solid #000; margin: 16px 0;"></div>

//       <!-- Items de la orden -->
//       <div style="margin-bottom: 24px;">
//         ${order.items && order.items.map((item, index) => `
//           <div style="margin-bottom: 20px; padding: 12px 0; ${index > 0 ? 'border-top: 1px dashed #999;' : ''}">
//             <div style="font-size: 28px; font-weight: bold; margin-bottom: 8px;">
//               ${item.qty || item.quantity || 1}x ${item.name.toUpperCase()}
//             </div>
//             ${item.notes ? `
//             <div style="font-size: 18px; margin-left: 20px; font-style: italic; color: #333; margin-top: 8px;">
//               Nota: ${item.notes}
//             </div>` : ''}
//           </div>
//         `).join('') || ''}
//       </div>

//       <div style="border-bottom: 2px solid #000; margin: 16px 0;"></div>

//       <!-- Notas especiales generales -->
//       ${order.notes ? `
//       <div style="margin-bottom: 24px; padding: 12px; background-color: #f9f9f9; border: 2px solid #000;">
//         <div style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">⚠️ NOTAS ESPECIALES:</div>
//         <div style="font-size: 18px;">${order.notes}</div>
//       </div>` : ''}

//       <!-- Espacio para corte -->
//       <div style="height: 40px;"></div>
//     </div>
//   `;
// }

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

// Función helper para obtener variante de status
// function getStatusVariant(status) {
//     switch (status) {
//         case statuses.PENDING: return 'yellow';
//         case statuses.PREPARING: return 'blue';
//         case statuses.READY: return 'purple';
//         case statuses.DELIVERED: return 'green';
//         case statuses.COMPLETED: return 'green';
//         case statuses.CANCELLED: return 'red';
//         default: return 'gray';
//     }
// }

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

// Función helper para obtener clases CSS del selector de estado con mejor contraste
function getStatusClass(status) {
    const base = 'px-2 py-1.5 rounded text-sm text-nowrap ';
    switch (status) {
        case statuses.CREATED:
        case statuses.PENDING:
            return base + 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 focus:ring-amber-400 dark:bg-amber-900/50 dark:text-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/70';
        case statuses.PREPARING:
            return base + 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 focus:ring-blue-400 dark:bg-blue-900/50 dark:text-blue-100 dark:border-blue-700 dark:hover:bg-blue-900/70';
        case statuses.READY:
            return base + 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 focus:ring-purple-400 dark:bg-purple-900/50 dark:text-purple-100 dark:border-purple-700 dark:hover:bg-purple-900/70';
        case statuses.DELIVERED:
        case statuses.COMPLETED:
            return base + 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100 focus:ring-green-400 dark:bg-green-900/50 dark:text-green-100 dark:border-green-700 dark:hover:bg-green-900/70';
        case statuses.CANCELLED:
            return base + 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100 focus:ring-red-400 dark:bg-red-900/50 dark:text-red-100 dark:border-red-700 dark:hover:bg-red-900/70';
        default:
            return base + 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100 focus:ring-gray-400 dark:bg-empanada-dark/50 dark:text-gray-100 dark:border-empanada-light-gray dark:hover:bg-empanada-medium/70';
    }
}

// Componente para modal de vista de orden
function OrderViewModal({ order, onClose }) {
    if (!order) return null;

    return (
        <Portal>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4">
                <div
                    className="w-full max-w-7xl h-[95vh] flex flex-col"
                >
                    <Card className="shadow-2xl h-full flex flex-col ">
                        <CardHeader className="pb-4 flex-shrink-0 bg-gray-50 dark:bg-empanada-dark border-b border-gray-200 dark:border-empanada-light-gray">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Detalles de la Orden #{order.id}
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
                                            {formatDateTime(order.orderDate || order.date)}
                                        </span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-200 dark:hover:bg-empanada-medium">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-y-auto px-6 py-6">
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
                                {/* Columna izquierda y central: Información de la orden */}
                                <div className="xl:col-span-2 space-y-6">
                                    {/* Información del Cliente */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                                <User className="w-4 h-4" />
                                                Información del Cliente
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <p className="text-gray-900 dark:text-white"><strong className="text-gray-700 dark:text-white">Nombre:</strong> {order.customerName}</p>
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
                                                <p className="text-gray-900 dark:text-white"><strong className="text-gray-700 dark:text-white">Tipo:</strong> {order.deliveryType === 'delivery' ? 'Delivery' : 'Retiro'}</p>
                                                <p className="text-gray-900 dark:text-white"><strong className="text-gray-700 dark:text-white">Pago:</strong> {order.paymentMethod || 'Efectivo'}</p>
                                                <p className="text-gray-900 dark:text-white"><strong className="text-gray-700 dark:text-white">Items:</strong> {Array.isArray(order.items) ? order.items.length : 0} productos</p>
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
                                                    {Array.isArray(order.items) ? (
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
                                                Total: {formatPrice(order.total)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Columna derecha: Preview del ticket */}
                                <div className="xl:col-span-1">
                                    <div className="sticky top-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Printer className="w-4 h-4" />
                                            Preview de Impresión
                                        </h3>
                                        <TicketPreview
                                            order={order}
                                            showPreview={true}
                                            mode={process.env.NODE_ENV === 'development' ? 'dev' : 'prod'}
                                        />
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

// Componente principal
export function OrderManagement() {
    const {
        orders,
        sucursalSeleccionada,
        adminDataLoading: loading,
        callOrders,
        callCreateOrder,
        callOrderPayCash,
        callOrderClose,
        callPublicCreatePrintJob
    } = useAdminData();

    const session = useSession();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editingOrder, setEditingOrder] = useState(null);
    const [showNewOrderModal, setShowNewOrderModal] = useState(false);
    const [viewingOrder, setViewingOrder] = useState(null);

    const getFilteredOrders = (searchTerm = '', statusFilter = 'all') => {
        return orders.filter(order => {
            const matchesSearch =
                order.id.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    };

    // Opciones para CustomSelect
    const statusFilterOptions = [
        { value: "all", label: "Todos los estados" },
        { value: statuses.PENDING, label: "Pendiente" },
        { value: statuses.PREPARING, label: "Preparando" },
        { value: statuses.READY, label: "Listo" },
        { value: statuses.COMPLETED, label: "Completado" },
        { value: statuses.DELIVERED, label: "Entregado" },
        { value: statuses.CANCELLED, label: "Cancelado" }
    ];

    // const orderStatusOptions = [
    //     { value: statuses.PENDING, label: "Pendiente" },
    //     { value: statuses.PREPARING, label: "Preparando" },
    //     { value: statuses.READY, label: "Listo" },
    //     { value: statuses.COMPLETED, label: "Completado" },
    //     { value: statuses.DELIVERED, label: "Entregado" },
    //     { value: statuses.CANCELLED, label: "Cancelado" }
    // ];

    // Hook para modales de confirmación
    const { openModal: openConfirmModal, ConfirmModalComponent } = useConfirmModal();

    // Cerrar modales con ESC
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                if (editingOrder) setEditingOrder(null);
                if (showNewOrderModal) setShowNewOrderModal(false);
                if (viewingOrder) setViewingOrder(null);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [editingOrder, showNewOrderModal, viewingOrder]);

    // Filtrar órdenes usando el contexto
    const filteredOrders = getFilteredOrders(searchTerm, statusFilter);

    // const handleStatusChange = (order, newStatus) => {
    //     updateOrderStatus(order.id, newStatus);
    //     toast.success(`Estado de la orden ${order.id} actualizado a ${getStatusLabel(newStatus)}`);
    // };

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
                callOrders(session.userData.accessToken)
                toast.success("Orden cerrada correctamente");
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
                callOrders(session.userData.accessToken)
                toast.success("Orden cerrada correctamente");
            }
        });
    };

    const handlePrintOrder = async (order) => {
        const printingWidth = 384;

        // Crear un componente temporal para la impresión
        // const tempDiv = document.createElement('div');
        // tempDiv.style.position = 'absolute';
        // tempDiv.style.left = '-9999px';
        // tempDiv.style.width = `${printingWidth}px`;
        // tempDiv.style.fontFamily = 'monospace';
        // tempDiv.style.fontSize = '12px';
        // tempDiv.style.lineHeight = '1.4';
        // tempDiv.style.color = '#000';
        // tempDiv.style.backgroundColor = '#fff';

        // Convertir orden al formato esperado por el sistema de impresión
        const printableOrder = {
            id: order.orderNumber,
            table: order.table || `Cliente: ${order.customerName}`,
            waiter: order.waiter || 'Sistema',
            time: order.orderDate || order.date || new Date().toISOString(),
            items: Array.isArray(order.items) ? order.items.map(item => ({
                qty: item.quantity || item.qty || 1,
                name: item.name,
                notes: item.notes || ''
            })) : [],
            subtotal: order.subtotal,
            tax: order.tax,
            total: order.total,
            payment: order.paymentMethod || 'Efectivo'
        };

        // Generar HTML del ticket
        // const ticketHTML = generateTicketHTML(printableOrder);
        // tempDiv.innerHTML = ticketHTML;
        // document.body.appendChild(tempDiv);

        // const canvas = await html2canvas(tempDiv, { width: printingWidth, scale: 2 });
        // const ticketEncoded = canvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, "");

        const ticketJsoned = JSON.stringify(printableOrder);

        const encryptedId = btoa("AmiAmig0Fr4nki3L3GustalANaveg");

        const constructedPrintJob = {
            dataB64: ticketJsoned,
            basic: encryptedId,
            storeId: sucursalSeleccionada,
            orderId: order.id,
            origin: 'admin' // no se guarda. si public, chequear si existe. si existe, no meter. si es admin, meter si o si
        }

        try {
            await callPublicCreatePrintJob(constructedPrintJob);
            toast.success("Ticket enviado a impresora");
        } catch {
            toast.error("Error al procesar la impresión");
        }
    };

    const handleRefresh = () => {
        callOrders(session.userData.accessToken);
    };

    const handleMoreFilters = () => {
        toast.info("Filtros avanzados próximamente");
    };

    const handleNewOrder = () => {
        setShowNewOrderModal(true);
    };

    // Preparar datos para SectionHeader
    const headerActions = [
        {
            label: "Nueva Orden",
            variant: "empanada",
            className: "h-9 px-4 text-sm font-medium",
            onClick: handleNewOrder,
            icon: <Plus className="w-4 h-4 mr-2" />
        },
        {
            label: "Actualizar",
            variant: "outline",
            className: "h-9 px-4 text-sm font-medium",
            onClick: () => {
                toast.info("Actualizando órdenes...");
                // Aquí se llamaría a la función de actualización
            },
            icon: <RefreshCw className="w-4 h-4 mr-2" />
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header usando SectionHeader */}
            <SectionHeader
                title="Gestión de Órdenes"
                subtitle="Administra y monitorea todas las órdenes"
                icon={<ShoppingCart className="w-6 h-6" />}
                actions={headerActions}
            />

            {/* Card unificada con búsqueda y tabla */}
            <Card className="">
                {/* Header de la card con título */}
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                        <span>Lista de Pedidos</span>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{filteredOrders.length} pedidos encontrados</span>
                        </div>
                    </CardTitle>
                </CardHeader>

                {/* Barra de búsqueda y filtros integrada */}
                <CardContent className="pt-0 pb-4">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Buscar por cliente o ID de orden..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="w-48">
                            <CustomSelect
                                value={statusFilter}
                                onChange={setStatusFilter}
                                options={statusFilterOptions}
                                placeholder="Filtrar por estado"
                            />
                        </div>
                        <Button variant="outline" onClick={handleMoreFilters}>
                            <Filter className="w-4 h-4 mr-2" />
                            Más Filtros
                        </Button>
                        <Button variant="outline" onClick={handleRefresh}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Actualizar
                        </Button>
                    </div>
                </CardContent>

                {/* Tabla integrada */}
                <CardContent className="pt-0">
                    <div className="">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-empanada-dark border-b border-gray-200 dark:border-empanada-light-gray">
                                <tr>
                                    <th className="text-left p-4">N°</th>
                                    <th className="text-left p-4">Fecha</th>
                                    <th className="text-left p-4">Entrega</th>
                                    <th className="text-left p-4">Estado</th>
                                    <th className="text-left p-4">Items</th>
                                    <th className="text-right p-4">Total</th>
                                    <th className="text-center p-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => {
                                    const payCashEnabled = order.status == statuses.PENDING;
                                    const closeOrderEnabled = order.status != statuses.COMPLETED;
                                    const printEnabled = true;

                                    return (
                                        <tr
                                            key={order.id}
                                            className="border-b admin-table-row"
                                        >
                                            <td className="p-4">
                                                <span className="font-mono text-sm">{order.orderNumber}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm">{new Date(order.createdAt).toLocaleTimeString()}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm">{order.fulfillment}</span>
                                            </td>
                                            <td className="p-4">
                                                {/* <CustomSelect
                                                value={order.status}
                                                onChange={(value) => handleStatusChange(order, value)}
                                                options={orderStatusOptions}
                                                placeholder="Seleccionar estado"
                                                variant="status"
                                                className="min-w-[140px]"
                                            /> */}
                                                <span className={getStatusClass(order.status)}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm">
                                                    {order.itemsCount}
                                                </span>
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
                                    {searchTerm || statusFilter !== 'all'
                                        ? 'No se encontraron órdenes con los filtros aplicados'
                                        : 'No hay órdenes registradas'
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

            {editingOrder && (
                <OrderEditModal
                    order={editingOrder}
                    onClose={() => setEditingOrder(null)}
                    onSave={(updatedOrder) => {
                        setOrders(prev => prev.map(order =>
                            order.id === updatedOrder.id ? updatedOrder : order
                        ));
                        setEditingOrder(null);
                        toast.success(`Orden ${updatedOrder.id} actualizada correctamente`);
                    }}
                />
            )}

            {showNewOrderModal && (
                <NewOrderModal
                    onClose={() => setShowNewOrderModal(false)}
                    onSave={(newOrder) => {
                        setOrders(prev => [newOrder, ...prev]);
                        setShowNewOrderModal(false);
                        toast.success(`Nueva orden ${newOrder.id} creada correctamente`);
                    }}
                />
            )}

            {/* Modal de confirmación */}
            <ConfirmModalComponent />
        </div>
    );
}
