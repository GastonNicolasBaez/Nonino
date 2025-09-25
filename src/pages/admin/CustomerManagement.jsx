import { useState, useEffect } from "react";
// Removed framer-motion for simpler admin experience
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Filter,
  X,
  Save,
  User,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  ShoppingBag,
  CreditCard,
  Bell,
  BellOff,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { formatPrice } from "../../lib/utils";
import { toast } from "sonner";
import { generateCustomersReportPDF, downloadPDF } from "../../services/pdfService";
import { useConfirmModal } from "../../components/common/ConfirmModal";
import { Portal } from "../../components/common/Portal";
import { mockCustomers } from "../../lib/mockData";
import { SectionHeader, StatsCards, CustomSelect, BrandedModal, BrandedModalFooter } from "@/components/branding";

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Opciones para CustomSelect
  const statusFilterOptions = [
    { value: "all", label: "Todos los estados" },
    { value: "active", label: "Activos" },
    { value: "inactive", label: "Inactivos" }
  ];

  const customerStatusOptions = [
    { value: "active", label: "Activo" },
    { value: "inactive", label: "Inactivo" }
  ];

  // Hook para modal de confirmación
  const { openModal: openConfirmModal, ConfirmModalComponent } = useConfirmModal();

  // Cargar datos mock al inicializar
  useEffect(() => {
    setCustomers(mockCustomers);
    setLoading(false);
  }, []);

  // Cerrar modales con ESC
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        if (showAddModal) setShowAddModal(false);
        if (showEditModal) setShowEditModal(false);
        if (showDetailModal) setShowDetailModal(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [showAddModal, showEditModal, showDetailModal]);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteCustomer = (customerId) => {
    openConfirmModal({
      title: "Eliminar Cliente",
      message: "¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.",
      type: "danger",
      confirmText: "Eliminar",
      onConfirm: () => {
        setCustomers(prev => prev.filter(customer => customer.id !== customerId));
        toast.success("Cliente eliminado correctamente");
      }
    });
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  const handleAddCustomer = () => {
    setShowAddModal(true);
  };

  // Preparar datos para StatsCards - todas neutras
  const statsData = [
    {
      id: "total-clientes",
      label: "Total Clientes",
      value: customers.length,
      color: "gray",
      icon: <User className="w-5 h-5" />
    },
    {
      id: "clientes-activos",
      label: "Clientes Activos",
      value: customers.filter(customer => customer.status === 'active').length,
      color: "gray",
      icon: <Star className="w-5 h-5" />
    },
    {
      id: "ingresos-totales",
      label: "Ingresos Totales",
      value: formatPrice(customers.reduce((sum, customer) => sum + customer.totalSpent, 0)),
      color: "gray",
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: "promedio-cliente",
      label: "Promedio por Cliente",
      value: formatPrice(customers.length > 0 ? customers.reduce((sum, customer) => sum + customer.totalSpent, 0) / customers.length : 0),
      color: "gray",
      icon: <ShoppingBag className="w-5 h-5" />
    }
  ];

  const handleExportCustomers = () => {
    try {
      const stats = {
        total: customers.length,
        active: customers.filter(c => c.status === 'active').length,
        newThisMonth: customers.filter(c => {
          const customerDate = new Date(c.registrationDate);
          const now = new Date();
          return customerDate.getMonth() === now.getMonth() && customerDate.getFullYear() === now.getFullYear();
        }).length,
        vip: customers.filter(c => c.totalSpent > 10000).length
      };
      
      const doc = generateCustomersReportPDF(customers, stats);
      const filename = `reporte-clientes-${new Date().toISOString().split('T')[0]}.pdf`;
      downloadPDF(doc, filename);
      
      toast.success('Reporte de clientes exportado correctamente');
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error al generar el PDF. Inténtalo de nuevo.');
    }
  };

  // Preparar datos para SectionHeader
  const headerActions = [
    {
      label: "Nuevo Cliente",
      variant: "empanada",
      className: "h-9 px-4 text-sm font-medium",
      onClick: handleAddCustomer,
      icon: <Plus className="w-4 h-4 mr-2" />
    },
    {
      label: "Actualizar",
      variant: "outline",
      className: "h-9 px-4 text-sm font-medium",
      onClick: () => {
        toast.info("Actualizando clientes...");
        // Aquí se llamaría a la función de actualización
      },
      icon: <RefreshCw className="w-4 h-4 mr-2" />
    }
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header usando SectionHeader */}
      <SectionHeader
        title="Gestión de Clientes"
        subtitle="Administra tu base de clientes y analiza su comportamiento"
        icon={<Users className="w-6 h-6" />}
        actions={headerActions}
      />

      {/* Stats usando StatsCards */}
      <StatsCards stats={statsData} />

      {/* Tabla de Clientes con búsqueda integrada */}
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Clientes ({filteredCustomers.length} registros)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Barra de búsqueda integrada */}
          <div className="mb-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
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
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-16 rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Cliente</th>
                    <th className="text-left p-4 font-medium">Contacto</th>
                    <th className="text-left p-4 font-medium">Pedidos</th>
                    <th className="text-left p-4 font-medium">Total Gastado</th>
                    <th className="text-left p-4 font-medium">Estado</th>
                    <th className="text-left p-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b admin-table-row"
                    >
                      <td className="p-4">
                          <div>
                            <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Registrado: {new Date(customer.registrationDate).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{customer.totalOrders}</p>
                          <p className="text-sm text-muted-foreground">
                            Último: {new Date(customer.lastOrder).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{formatPrice(customer.totalSpent)}</span>
                      </td>
                      <td className="p-4">
                        <div className={`status-badge ${customer.status === 'active' ? 'status-badge-success' : 'status-badge-danger'}`}>
                          {getStatusText(customer.status)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewCustomer(customer)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      {showAddModal && (
        <NewCustomerModal
          onClose={() => setShowAddModal(false)}
          onSave={(newCustomer) => {
            setCustomers(prev => [...prev, newCustomer]);
            setShowAddModal(false);
            toast.success(`Cliente ${newCustomer.name} agregado correctamente`);
          }}
        />
      )}

      {showEditModal && selectedCustomer && (
        <EditCustomerModal
          customer={selectedCustomer}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCustomer(null);
          }}
          onSave={(updatedCustomer) => {
            setCustomers(prev => prev.map(customer => 
              customer.id === updatedCustomer.id ? updatedCustomer : customer
            ));
            setShowEditModal(false);
            setSelectedCustomer(null);
            toast.success(`Cliente ${updatedCustomer.name} actualizado correctamente`);
          }}
        />
      )}

      {showDetailModal && selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedCustomer(null);
          }}
        />
      )}

      {/* Modal Component */}
      <ConfirmModalComponent />
    </div>
  );
}

// Modal de Detalle del Cliente
function CustomerDetailModal({ customer, onClose }) {
  return (
    <Portal>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4">
        <div
          className="w-full max-w-6xl h-[95vh] flex flex-col"
        >
          <Card className="shadow-2xl h-full flex flex-col ">
            {/* Header */}
            <CardHeader className="pb-4 flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Detalles del Cliente
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Información completa del cliente
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="flex-1 overflow-y-auto space-y-6 px-6 py-6">
              {/* Información Personal */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <User className="w-5 h-5" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Nombre Completo</label>
                      <p className="text-sm bg-white dark:bg-gray-700 p-3 rounded-md text-gray-900 dark:text-white">{customer.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
                      <p className="text-sm bg-white dark:bg-gray-700 p-3 rounded-md text-gray-900 dark:text-white">{customer.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Teléfono</label>
                      <p className="text-sm bg-white dark:bg-gray-700 p-3 rounded-md text-gray-900 dark:text-white">{customer.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Dirección</label>
                      <p className="text-sm bg-white dark:bg-gray-700 p-3 rounded-md text-gray-900 dark:text-white">{customer.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Fecha de Registro</label>
                      <p className="text-sm bg-white dark:bg-gray-700 p-3 rounded-md text-gray-900 dark:text-white">
                        {new Date(customer.registrationDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Estado</label>
                      <div className={`status-badge ${customer.status === 'active' ? 'status-badge-success' : 'status-badge-danger'}`}>
                        {customer.status === 'active' ? 'Activo' : 'Inactivo'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas de Pedidos */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <ShoppingBag className="w-5 h-5" />
                    Estadísticas de Pedidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{customer.totalOrders}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Pedidos</p>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{formatPrice(customer.totalSpent)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Gastado</p>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {formatPrice(customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Promedio por Pedido</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Último Pedido</label>
                    <p className="text-sm bg-white dark:bg-gray-700 p-3 rounded-md text-gray-900 dark:text-white">
                      {new Date(customer.lastOrder).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Preferencias */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Bell className="w-5 h-5" />
                    Preferencias de Comunicación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">Notificaciones</span>
                      <div className={`status-badge ${customer.preferences.notifications ? 'status-badge-success' : 'status-badge-danger'}`}>
                        {customer.preferences.notifications ? "Sí" : "No"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">Promociones</span>
                      <div className={`status-badge ${customer.preferences.promotions ? 'status-badge-success' : 'status-badge-danger'}`}>
                        {customer.preferences.promotions ? "Sí" : "No"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">Newsletter</span>
                      <div className={`status-badge ${customer.preferences.newsletter ? 'status-badge-success' : 'status-badge-danger'}`}>
                        {customer.preferences.newsletter ? "Sí" : "No"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notas */}
              {customer.notes && (
                <Card className="">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Notas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{customer.notes}</p>
                  </CardContent>
                </Card>
              )}
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

// Modal de Nuevo Cliente
function NewCustomerModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferences: {
      notifications: true,
      promotions: true,
      newsletter: false
    },
    notes: ''
  });

  const handleSave = () => {
    const newCustomer = {
      ...formData,
      id: `CUST-${Date.now()}`,
      registrationDate: new Date().toISOString(),
      status: 'active',
      totalOrders: 0,
      totalSpent: 0,
      lastOrder: null
    };
    onSave(newCustomer);
  };

  const isFormValid = formData.name && formData.email && formData.phone;

  return (
    <BrandedModal
      isOpen={true}
      onClose={onClose}
      title="Nuevo Cliente"
      subtitle="Agrega un nuevo cliente al sistema"
      icon={<User className="w-6 h-6" />}
      maxWidth="max-w-6xl"
      maxHeight="max-h-[95vh]"
      footer={
        <BrandedModalFooter
          onCancel={onClose}
          onConfirm={handleSave}
          cancelText="Cancelar"
          confirmText="Crear Cliente"
          confirmIcon={<Save className="w-4 h-4" />}
          isConfirmDisabled={!isFormValid}
        />
      }
    >
      <div className="space-y-6">
              {/* Información Básica */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <User className="w-5 h-5" />
                    Información Básica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Nombre Completo *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nombre completo del cliente"
                        required
                        className="admin-input"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email *</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@ejemplo.com"
                          required
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Teléfono *</label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+54 11 1234-5678"
                          required
                          className="admin-input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Dirección</label>
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Dirección completa"
                        className="admin-input"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preferencias */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Bell className="w-5 h-5" />
                    Preferencias de Comunicación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={formData.preferences.notifications}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, notifications: e.target.checked }
                        })}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm">Recibir notificaciones</span>
                    </label>
                    <label className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={formData.preferences.promotions}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, promotions: e.target.checked }
                        })}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm">Recibir promociones</span>
                    </label>
                    <label className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={formData.preferences.newsletter}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, newsletter: e.target.checked }
                        })}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm">Suscribirse al newsletter</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Notas */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Notas Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Notas adicionales sobre el cliente..."
                    className="w-full h-24 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-empanada-golden resize-none"
                  />
                </CardContent>
              </Card>
      </div>
    </BrandedModal>
  );
}

// Modal de Editar Cliente
function EditCustomerModal({ customer, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    status: customer.status,
    preferences: { ...customer.preferences },
    notes: customer.notes
  });

  // Opciones de estado para el modal
  const customerStatusOptions = [
    { value: "active", label: "Activo" },
    { value: "inactive", label: "Inactivo" }
  ];

  const handleSave = () => {
    const updatedCustomer = {
      ...customer,
      ...formData
    };
    onSave(updatedCustomer);
  };

  const isFormValid = formData.name && formData.email && formData.phone;

  return (
    <BrandedModal
      isOpen={true}
      onClose={onClose}
      title="Editar Cliente"
      subtitle="Modifica la información del cliente"
      icon={<User className="w-6 h-6" />}
      maxWidth="max-w-6xl"
      maxHeight="max-h-[95vh]"
      footer={
        <BrandedModalFooter
          onCancel={onClose}
          onConfirm={handleSave}
          cancelText="Cancelar"
          confirmText="Actualizar Cliente"
          confirmIcon={<Save className="w-4 h-4" />}
          isConfirmDisabled={!isFormValid}
        />
      }
    >
      <div className="space-y-6">
              {/* Información Básica */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <User className="w-5 h-5" />
                    Información Básica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Nombre Completo *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nombre completo del cliente"
                        required
                        className="admin-input"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email *</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@ejemplo.com"
                          required
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Teléfono *</label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+54 11 1234-5678"
                          required
                          className="admin-input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Dirección</label>
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Dirección completa"
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Estado</label>
                      <CustomSelect
                        value={formData.status}
                        onChange={(value) => setFormData({ ...formData, status: value })}
                        options={customerStatusOptions}
                        placeholder="Seleccionar estado"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preferencias */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Bell className="w-5 h-5" />
                    Preferencias de Comunicación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={formData.preferences.notifications}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, notifications: e.target.checked }
                        })}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm">Recibir notificaciones</span>
                    </label>
                    <label className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={formData.preferences.promotions}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, promotions: e.target.checked }
                        })}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm">Recibir promociones</span>
                    </label>
                    <label className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={formData.preferences.newsletter}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, newsletter: e.target.checked }
                        })}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm">Suscribirse al newsletter</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Notas */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Notas Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Notas adicionales sobre el cliente..."
                    className="w-full h-24 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-empanada-golden resize-none"
                  />
                </CardContent>
              </Card>
      </div>
    </BrandedModal>
  );
}