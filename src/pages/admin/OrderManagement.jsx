/**
 * ORDER MANAGEMENT - NONINO EMPANADAS
 * Gestión de pedidos con datos mock funcionales
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
  Trash2
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
import { useOrders } from "@/context/OrdersContext";
import { SectionHeader, CustomSelect } from "@/components/branding";
import { TicketPreview } from "../../components/common/TicketPreview";

// Función para generar HTML de la comanda básica
function generateTicketHTML(order) {
  const orderTime = new Date(order.time || order.orderDate || Date.now());

  return `
    <div style="width: 384px; font-family: monospace; font-size: 14px; line-height: 1.4; color: #000; background-color: #fff;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 16px;">
        <div style="font-size: 16px; font-weight: bold;">COMANDA DE COCINA</div>
        <div style="font-size: 12px;">NONINO EMPANADAS</div>
        <div style="border-bottom: 1px solid #000; margin: 8px 0;"></div>
      </div>

      <!-- Información del pedido -->
      <div style="margin-bottom: 16px;">
        <div style="font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 8px;">
          PEDIDO: ${order.id}
        </div>
        <div style="text-align: center; margin-bottom: 8px;">
          ${orderTime.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
        </div>
        ${order.deliveryType === 'delivery' ? `
        <div style="text-align: center; font-weight: bold;">
          *** DELIVERY ***
        </div>` : ''}
      </div>

      <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; margin: 16px 0; padding: 8px 0;"></div>

      <!-- Items -->
      <div style="margin-bottom: 16px;">
        ${order.items && order.items.map((item, index) => `
          <div style="margin-bottom: 12px;">
            <div style="font-size: 16px; font-weight: bold;">
              ${item.qty || item.quantity || 1}x ${item.name}
            </div>
            ${item.notes ? `
            <div style="font-size: 13px; margin-left: 16px; font-style: italic;">
              - ${item.notes}
            </div>` : ''}
          </div>
        `).join('') || ''}
      </div>

      <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; margin: 16px 0; padding: 8px 0;"></div>

      <!-- Total -->
      <div style="text-align: center; margin-bottom: 16px;">
        <div style="font-size: 16px; font-weight: bold;">
          TOTAL: ${order.items ? order.items.reduce((total, item) => total + (item.qty || item.quantity || 1), 0) : 0} items
        </div>
      </div>

      <!-- Notas especiales del pedido -->
      ${order.notes ? `
      <div style="margin-bottom: 16px;">
        <div style="font-size: 14px; font-weight: bold;">Notas:</div>
        <div style="font-size: 13px;">${order.notes}</div>
      </div>` : ''}

      <!-- Control -->
      <div style="border-top: 1px dashed #000; padding-top: 12px;">
        <div style="font-size: 12px;">
          <div style="margin-bottom: 4px;">PREPARADO: _____________</div>
          <div style="margin-bottom: 4px;">REVISADO:  _____________</div>
          <div style="margin-bottom: 4px;">ENTREGADO: _____________</div>
        </div>
      </div>

      <!-- Espacio para corte -->
      <div style="height: 24px;"></div>
    </div>
  `;
}

// Función helper para obtener variante de status
function getStatusVariant(status) {
  switch (status) {
    case 'pending': return 'yellow';
    case 'preparing': return 'blue';
    case 'ready': return 'purple';
    case 'delivered': return 'green';
    case 'completed': return 'green';
    case 'cancelled': return 'red';
    default: return 'gray';
  }
}

// Función helper para obtener label de status
function getStatusLabel(status) {
  switch (status) {
    case 'pending': return 'Pendiente';
    case 'preparing': return 'Preparando';
    case 'ready': return 'Listo';
    case 'delivered': return 'Entregado';
    case 'completed': return 'Completado';
    case 'cancelled': return 'Cancelado';
    default: return status;
  }
}

// Función helper para obtener clases CSS del selector de estado con mejor contraste
function getStatusSelectClasses(status) {
  switch (status) {
    case 'pending':
      return 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 focus:ring-amber-400 dark:bg-amber-900/50 dark:text-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/70';
    case 'preparing':
      return 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 focus:ring-blue-400 dark:bg-blue-900/50 dark:text-blue-100 dark:border-blue-700 dark:hover:bg-blue-900/70';
    case 'ready':
      return 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 focus:ring-purple-400 dark:bg-purple-900/50 dark:text-purple-100 dark:border-purple-700 dark:hover:bg-purple-900/70';
    case 'delivered':
    case 'completed':
      return 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100 focus:ring-green-400 dark:bg-green-900/50 dark:text-green-100 dark:border-green-700 dark:hover:bg-green-900/70';
    case 'cancelled':
      return 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100 focus:ring-red-400 dark:bg-red-900/50 dark:text-red-100 dark:border-red-700 dark:hover:bg-red-900/70';
    default:
      return 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100 focus:ring-gray-400 dark:bg-gray-800/50 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-800/70';
  }
}

// Componente para modal de vista de pedido
function OrderViewModal({ order, onClose }) {
  if (!order) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999999] flex items-center justify-center p-4">
        <div
          className="w-full max-w-7xl h-[95vh] flex flex-col"
        >
          <Card className="shadow-2xl h-full flex flex-col ">
            <CardHeader className="pb-4 flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Detalles del Pedido #{order.id}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`status-badge ${
                      order.status === 'completed' || order.status === 'delivered' ? 'status-badge-success' :
                      order.status === 'preparing' ? 'status-badge-info' :
                      order.status === 'ready' ? 'status-badge-warning' :
                      order.status === 'cancelled' ? 'status-badge-danger' :
                      'status-badge-warning'
                    }`}>
                      {getStatusLabel(order.status)}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDateTime(order.orderDate || order.date)}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto px-6 py-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
                {/* Columna izquierda y central: Información del pedido */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Información del Cliente */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                        <User className="w-4 h-4" />
                        Información del Cliente
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-900 dark:text-white"><strong className="text-gray-700 dark:text-gray-300">Nombre:</strong> {order.customerName}</p>
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
                        Detalles del Pedido
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-900 dark:text-white"><strong className="text-gray-700 dark:text-gray-300">Tipo:</strong> {order.deliveryType === 'delivery' ? 'Delivery' : 'Retiro'}</p>
                        <p className="text-gray-900 dark:text-white"><strong className="text-gray-700 dark:text-gray-300">Pago:</strong> {order.paymentMethod || 'Efectivo'}</p>
                        <p className="text-gray-900 dark:text-white"><strong className="text-gray-700 dark:text-gray-300">Items:</strong> {Array.isArray(order.items) ? order.items.length : 0} productos</p>
                        {order.notes && <p className="text-gray-900 dark:text-white"><strong className="text-gray-700 dark:text-gray-300">Notas:</strong> {order.notes}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Items del Pedido */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Productos</h3>
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="text-left p-3 text-gray-700 dark:text-gray-300">Producto</th>
                            <th className="text-center p-3 text-gray-700 dark:text-gray-300">Cantidad</th>
                            <th className="text-right p-3 text-gray-700 dark:text-gray-300">Precio Unit.</th>
                            <th className="text-right p-3 text-gray-700 dark:text-gray-300">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(order.items) ? (
                            order.items.map((item, index) => (
                              <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                                <td className="p-3 text-gray-900 dark:text-white">{item.name}</td>
                                <td className="text-center p-3 text-gray-900 dark:text-white">{item.quantity}</td>
                                <td className="text-right p-3 text-gray-900 dark:text-white">{formatPrice(item.price)}</td>
                                <td className="text-right p-3 text-gray-900 dark:text-white">{formatPrice(item.total || item.quantity * item.price)}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center p-6 text-gray-500 dark:text-gray-400">
                                No hay productos en este pedido
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
            <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose} className="hover:bg-gray-200 dark:hover:bg-gray-700">
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingOrder, setEditingOrder] = useState(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);

  // Opciones para CustomSelect
  const statusFilterOptions = [
    { value: "all", label: "Todos los estados" },
    { value: "pending", label: "Pendiente" },
    { value: "preparing", label: "Preparando" },
    { value: "ready", label: "Listo" },
    { value: "completed", label: "Completado" },
    { value: "delivered", label: "Entregado" },
    { value: "cancelled", label: "Cancelado" }
  ];

  const orderStatusOptions = [
    { value: "pending", label: "Pendiente" },
    { value: "preparing", label: "Preparando" },
    { value: "ready", label: "Listo" },
    { value: "completed", label: "Completado" },
    { value: "delivered", label: "Entregado" },
    { value: "cancelled", label: "Cancelado" }
  ];

  // Hook para modales de confirmación
  const { openModal: openConfirmModal, ConfirmModalComponent } = useConfirmModal();

  // Usar el contexto de pedidos
  const { 
    orders, 
    loading, 
    updateOrderStatus, 
    deleteOrder, 
    addOrder, 
    getFilteredOrders 
  } = useOrders();

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

  // Filtrar pedidos usando el contexto
  const filteredOrders = getFilteredOrders(searchTerm, statusFilter);

  const handleStatusChange = (order, newStatus) => {
    updateOrderStatus(order.id, newStatus);
    toast.success(`Estado del pedido ${order.id} actualizado a ${getStatusLabel(newStatus)}`);
  };

  const handleViewOrder = (order) => {
    setViewingOrder(order);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
  };

  const handleDeleteOrder = (orderId) => {
    openConfirmModal({
      title: "Eliminar Pedido",
      message: "¿Estás seguro de que quieres eliminar este pedido? Esta acción no se puede deshacer.",
      onConfirm: () => {
        deleteOrder(orderId);
        toast.success("Pedido eliminado correctamente");
      }
    });
  };

  const handlePrintOrder = async (order) => {
    try {
      // Crear un componente temporal para la impresión
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '384px';
      tempDiv.style.fontFamily = 'monospace';
      tempDiv.style.fontSize = '12px';
      tempDiv.style.lineHeight = '1.4';
      tempDiv.style.color = '#000';
      tempDiv.style.backgroundColor = '#fff';

      // Convertir orden al formato esperado por el sistema de impresión
      const printableOrder = {
        id: order.id,
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
      const ticketHTML = generateTicketHTML(printableOrder);
      tempDiv.innerHTML = ticketHTML;
      document.body.appendChild(tempDiv);

      // Crear referencia para el elemento
      const elementRef = { current: tempDiv };

      const { printOrder } = await import("../../services/printerSender");
      const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';

      await printOrder(printableOrder, { mode, elementRef });

      // Limpiar elemento temporal
      document.body.removeChild(tempDiv);

      if (mode === 'dev') {
        toast.success("PDF del ticket descargado correctamente");
      } else {
        toast.success("Ticket enviado a impresora");
      }
    } catch (error) {
      console.error('Error al imprimir:', error);
      toast.error("Error al procesar la impresión");
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Pedidos actualizados");
    }, 1000);
  };

  const handleMoreFilters = () => {
    toast.info("Filtros avanzados próximamente");
  };

  const handleExportOrders = () => {
    try {
      const filters = {
        status: statusFilter,
        searchTerm: searchTerm,
        dateRange: 'current'
      };
      
      const doc = generateOrdersReportPDF(filteredOrders, filters);
      const filename = `reporte-pedidos-${new Date().toISOString().split('T')[0]}.pdf`;
      downloadPDF(doc, filename);
      
      toast.success('Reporte de pedidos exportado correctamente');
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error al generar el PDF. Inténtalo de nuevo.');
    }
  };

  const handleNewOrder = () => {
    setShowNewOrderModal(true);
  };

  // Preparar datos para SectionHeader
  const headerActions = [
    {
      label: "Nuevo Pedido",
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
        toast.info("Actualizando pedidos...");
        // Aquí se llamaría a la función de actualización
      },
      icon: <RefreshCw className="w-4 h-4 mr-2" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header usando SectionHeader */}
      <SectionHeader
        title="Gestión de Pedidos"
        subtitle="Administra y monitorea todos los pedidos"
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
                placeholder="Buscar por cliente o ID de pedido..."
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left p-4">ID</th>
                  <th className="text-left p-4">Cliente</th>
                  <th className="text-left p-4">Fecha</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-left p-4">Items</th>
                  <th className="text-right p-4">Total</th>
                  <th className="text-center p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.id}
                    className="border-b admin-table-row"
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm">{order.id}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        {order.customerEmail && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{order.customerEmail}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{formatDateTime(order.orderDate)}</span>
                    </td>
                    <td className="p-4">
                      <CustomSelect
                        value={order.status}
                        onChange={(value) => handleStatusChange(order, value)}
                        options={orderStatusOptions}
                        placeholder="Seleccionar estado"
                        variant="status"
                        className="min-w-[140px]"
                      />
                    </td>
                    <td className="p-4">
                      <span className="text-sm">
                        {Array.isArray(order.items) ? order.items.length : 0} items
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-bold">{formatPrice(order.total)}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditOrder(order)}
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePrintOrder(order)}
                          title="Imprimir"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No se encontraron pedidos con los filtros aplicados' 
                    : 'No hay pedidos registrados'
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
            toast.success(`Pedido ${updatedOrder.id} actualizado correctamente`);
          }}
        />
      )}

      {showNewOrderModal && (
        <NewOrderModal
          onClose={() => setShowNewOrderModal(false)}
          onSave={(newOrder) => {
            setOrders(prev => [newOrder, ...prev]);
            setShowNewOrderModal(false);
            toast.success(`Nuevo pedido ${newOrder.id} creado correctamente`);
          }}
        />
      )}

      {/* Modal de confirmación */}
      <ConfirmModalComponent />
    </div>
  );
}
