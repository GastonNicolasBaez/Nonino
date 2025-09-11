/**
 * ORDER EDIT MODAL - NONINO EMPANADAS
 * Modal para editar pedidos existentes
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  X, 
  Save, 
  Plus, 
  Minus, 
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  ShoppingBag,
  DollarSign
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { formatPrice } from "../../../lib/utils";
import { toast } from "sonner";
import { Portal } from "../../../components/common/Portal";

// Datos mock de productos disponibles
const mockProducts = [
  { id: 1, name: "Empanada de Carne", price: 150 },
  { id: 2, name: "Empanada de Pollo", price: 150 },
  { id: 3, name: "Empanada de Jamón y Queso", price: 150 },
  { id: 4, name: "Empanada de Verdura", price: 150 },
  { id: 5, name: "Empanada de Humita", price: 150 },
  { id: 6, name: "Empanada de Caprese", price: 150 },
  { id: 7, name: "Empanada de Atún", price: 150 },
  { id: 8, name: "Empanada de Espinaca", price: 150 }
];

export function OrderEditModal({ order, onClose, onSave }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryType: 'delivery',
    paymentMethod: 'cash',
    status: 'pending',
    notes: '',
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    total: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showProductSearch, setShowProductSearch] = useState(false);

  // Inicializar datos del pedido
  useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customerName || '',
        customerEmail: order.customerEmail || '',
        customerPhone: order.customerPhone || '',
        deliveryAddress: order.deliveryAddress || '',
        deliveryType: order.deliveryType || 'delivery',
        paymentMethod: order.paymentMethod || 'cash',
        status: order.status || 'pending',
        notes: order.notes || '',
        items: Array.isArray(order.items) ? [...order.items] : [],
        subtotal: order.subtotal || 0,
        deliveryFee: order.deliveryFee || 0,
        total: order.total || 0
      });
    }
  }, [order]);

  // Calcular totales cuando cambian los items
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.total || item.price * item.quantity), 0);
    const deliveryFee = formData.deliveryType === 'delivery' ? 500 : 0;
    const total = subtotal + deliveryFee;

    setFormData(prev => ({
      ...prev,
      subtotal,
      deliveryFee,
      total
    }));
  }, [formData.items, formData.deliveryType]);

  // Filtrar productos para búsqueda
  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddItem = (product) => {
    const existingItem = formData.items.find(item => item.name === product.name);
    
    if (existingItem) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, {
          name: product.name,
          quantity: 1,
          price: product.price,
          total: product.price
        }]
      }));
    }
    
    setShowProductSearch(false);
    setSearchTerm('');
    toast.success(`${product.name} agregado al pedido`);
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) return;
    
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index
          ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
          : item
      )
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
    toast.success("Item eliminado del pedido");
  };

  const handleSave = () => {
    if (!formData.customerName.trim()) {
      toast.error("El nombre del cliente es obligatorio");
      return;
    }

    if (formData.items.length === 0) {
      toast.error("Debe agregar al menos un producto");
      return;
    }

    const updatedOrder = {
      ...order,
      ...formData,
      id: order.id, // Mantener el ID original
      orderDate: order.orderDate // Mantener la fecha original
    };

    onSave(updatedOrder);
    toast.success(`Pedido ${order.id} actualizado correctamente`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!order) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999999] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-6xl h-[95vh] flex flex-col"
        >
          <Card className="shadow-2xl h-full flex flex-col bg-white dark:bg-gray-900">
            {/* Header */}
            <CardHeader className="pb-4 flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Editar Pedido #{order.id}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Modifica los detalles del pedido
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="flex-1 overflow-y-auto space-y-6 px-6 py-6">
              {/* Información del Cliente */}
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <User className="w-5 h-5" />
                    Información del Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Nombre *</label>
                      <Input
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        placeholder="Nombre del cliente"
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
                      <Input
                        value={formData.customerEmail}
                        onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                        placeholder="email@ejemplo.com"
                        type="email"
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Teléfono</label>
                      <Input
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        placeholder="+54 11 1234-5678"
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Dirección de Entrega</label>
                      <Input
                        value={formData.deliveryAddress}
                        onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                        placeholder="Dirección completa"
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Configuración del Pedido */}
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Package className="w-5 h-5" />
                    Configuración del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tipo de Entrega</label>
                      <select
                        value={formData.deliveryType}
                        onChange={(e) => handleInputChange('deliveryType', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-empanada-golden"
                      >
                        <option value="delivery">Delivery</option>
                        <option value="pickup">Retiro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Método de Pago</label>
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-empanada-golden"
                      >
                        <option value="cash">Efectivo</option>
                        <option value="card">Tarjeta</option>
                        <option value="transfer">Transferencia</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Estado</label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-empanada-golden"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="preparing">Preparando</option>
                        <option value="ready">Listo</option>
                        <option value="completed">Completado</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Notas</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Notas adicionales del pedido..."
                      className="w-full h-24 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-empanada-golden resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Productos */}
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <ShoppingBag className="w-5 h-5" />
                      Productos
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowProductSearch(true)}
                      className="hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Producto
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Búsqueda de Productos */}
                  {showProductSearch && (
                    <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 mb-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Buscar producto..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="flex-1 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white"
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowProductSearch(false);
                            setSearchTerm('');
                          }}
                          className="hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer transition-colors"
                            onClick={() => handleAddItem(product)}
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{formatPrice(product.price)}</p>
                            </div>
                            <Button size="sm" variant="outline" className="hover:bg-gray-200 dark:hover:bg-gray-500">
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lista de Items */}
                  {formData.items.length > 0 ? (
                    <div className="space-y-2">
                      {formData.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{formatPrice(item.price)} c/u</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                              className="hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <span className="w-20 text-right font-medium text-gray-900 dark:text-white">
                              {formatPrice(item.total)}
                            </span>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No hay productos agregados</p>
                      <p className="text-sm">Haz clic en "Agregar Producto" para comenzar</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Resumen de Totales */}
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <DollarSign className="w-5 h-5" />
                    Resumen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Subtotal:</span>
                      <span>{formatPrice(formData.subtotal)}</span>
                    </div>
                    {formData.deliveryFee > 0 && (
                      <div className="flex justify-between text-gray-700 dark:text-gray-300">
                        <span>Envío:</span>
                        <span>{formatPrice(formData.deliveryFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-600 pt-2 text-gray-900 dark:text-white">
                      <span>Total:</span>
                      <span>{formatPrice(formData.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>

            {/* Footer */}
            <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                  Cancelar
                </Button>
                <Button variant="empanada" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </Portal>
  );
}
