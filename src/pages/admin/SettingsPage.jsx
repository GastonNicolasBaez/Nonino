import { useState, useEffect } from "react";
// Removed framer-motion for simpler admin experience
import { 
  Settings, 
  Store,
  Bell,
  Users,
  Mail,
  Smartphone,
  CreditCard,
  Shield,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Upload,
  Download,
  Clock,
  MapPin,
  Phone,
  Globe,
  Palette,
  Database,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      businessName: "Nonino Empanadas",
      businessEmail: "info@noninoempanadas.com",
      businessPhone: "+54 11 1234-5678",
      businessAddress: "Av. San Martín 123, Centro, CABA",
      timezone: "America/Argentina/Buenos_Aires",
      currency: "ARS",
      language: "es",
      taxRate: 21
    },
    store: {
      minOrderAmount: 2000,
      deliveryFee: 500,
      freeDeliveryThreshold: 3000,
      preparationTime: 30,
      deliveryRadius: 15,
      maxOrdersPerHour: 20,
      enablePickup: true,
      enableDelivery: true,
      autoAcceptOrders: false
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      newOrderAlert: true,
      lowStockAlert: true,
      customerFeedbackAlert: true,
      weeklyReports: true,
      monthlyReports: true
    },
    payment: {
      acceptCash: true,
      acceptCard: true,
      acceptTransfer: true,
      acceptMercadoPago: true,
      stripeEnabled: false,
      paypalEnabled: false,
      commissionRate: 5.5
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 60,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipWhitelist: false,
      auditLogs: true
    }
  });

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "store", label: "Tienda", icon: Store },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    { id: "payment", label: "Pagos", icon: CreditCard },
    { id: "security", label: "Seguridad", icon: Shield }
  ];

  const saveSettings = async () => {
    setLoading(true);
    // Simular guardado
    setTimeout(() => {
      setLoading(false);
      toast.success("Configuración guardada correctamente");
    }, 1500);
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const GeneralSettings = () => (
    <div className="space-y-6">
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Información del Negocio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Negocio</label>
              <Input
                value={settings.general.businessName}
                onChange={(e) => updateSetting("general", "businessName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={settings.general.businessEmail}
                onChange={(e) => updateSetting("general", "businessEmail", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <Input
                value={settings.general.businessPhone}
                onChange={(e) => updateSetting("general", "businessPhone", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Moneda</label>
              <select
                value={settings.general.currency}
                onChange={(e) => updateSetting("general", "currency", e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-empanada-golden"
              >
                <option value="ARS">Peso Argentino (ARS)</option>
                <option value="USD">Dólar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <Input
              value={settings.general.businessAddress}
              onChange={(e) => updateSetting("general", "businessAddress", e.target.value)}
              placeholder="Dirección completa del negocio"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Zona Horaria</label>
              <select
                value={settings.general.timezone}
                onChange={(e) => updateSetting("general", "timezone", e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-empanada-golden"
              >
                <option value="America/Argentina/Buenos_Aires">Buenos Aires (UTC-3)</option>
                <option value="America/Argentina/Cordoba">Córdoba (UTC-3)</option>
                <option value="America/Argentina/Mendoza">Mendoza (UTC-3)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tasa de IVA (%)</label>
              <Input
                type="number"
                value={settings.general.taxRate}
                onChange={(e) => updateSetting("general", "taxRate", Number(e.target.value))}
                min="0"
                max="50"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const StoreSettings = () => (
    <div className="space-y-6">
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Configuración de Tienda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pedido Mínimo</label>
              <Input
                type="number"
                value={settings.store.minOrderAmount}
                onChange={(e) => updateSetting("store", "minOrderAmount", Number(e.target.value))}
                placeholder="Monto mínimo de pedido"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Costo de Envío</label>
              <Input
                type="number"
                value={settings.store.deliveryFee}
                onChange={(e) => updateSetting("store", "deliveryFee", Number(e.target.value))}
                placeholder="Costo base de envío"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Envío Gratis desde</label>
              <Input
                type="number"
                value={settings.store.freeDeliveryThreshold}
                onChange={(e) => updateSetting("store", "freeDeliveryThreshold", Number(e.target.value))}
                placeholder="Monto para envío gratuito"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tiempo de Preparación (min)</label>
              <Input
                type="number"
                value={settings.store.preparationTime}
                onChange={(e) => updateSetting("store", "preparationTime", Number(e.target.value))}
                placeholder="Tiempo promedio de preparación"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Radio de Delivery (km)</label>
              <Input
                type="number"
                value={settings.store.deliveryRadius}
                onChange={(e) => updateSetting("store", "deliveryRadius", Number(e.target.value))}
                placeholder="Radio máximo de entrega"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pedidos Máximos por Hora</label>
              <Input
                type="number"
                value={settings.store.maxOrdersPerHour}
                onChange={(e) => updateSetting("store", "maxOrdersPerHour", Number(e.target.value))}
                placeholder="Capacidad máxima"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Opciones de Servicio</h4>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.store.enablePickup}
                  onChange={(e) => updateSetting("store", "enablePickup", e.target.checked)}
                />
                <span className="text-sm">Habilitar Retiro en Local</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.store.enableDelivery}
                  onChange={(e) => updateSetting("store", "enableDelivery", e.target.checked)}
                />
                <span className="text-sm">Habilitar Delivery</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.store.autoAcceptOrders}
                  onChange={(e) => updateSetting("store", "autoAcceptOrders", e.target.checked)}
                />
                <span className="text-sm">Auto-aceptar Pedidos</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Configuración de Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-medium">Canales de Notificación</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Notificaciones por Email</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => updateSetting("notifications", "emailNotifications", e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm">Notificaciones SMS</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.smsNotifications}
                  onChange={(e) => updateSetting("notifications", "smsNotifications", e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span className="text-sm">Notificaciones Push</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) => updateSetting("notifications", "pushNotifications", e.target.checked)}
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Alertas del Sistema</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm">Nuevos Pedidos</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.newOrderAlert}
                  onChange={(e) => updateSetting("notifications", "newOrderAlert", e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Stock Bajo</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.lowStockAlert}
                  onChange={(e) => updateSetting("notifications", "lowStockAlert", e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Comentarios de Clientes</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.customerFeedbackAlert}
                  onChange={(e) => updateSetting("notifications", "customerFeedbackAlert", e.target.checked)}
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Reportes Automáticos</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm">Reportes Semanales</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.weeklyReports}
                  onChange={(e) => updateSetting("notifications", "weeklyReports", e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Reportes Mensuales</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.monthlyReports}
                  onChange={(e) => updateSetting("notifications", "monthlyReports", e.target.checked)}
                />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PaymentSettings = () => (
    <div className="space-y-6">
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Métodos de Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-medium">Métodos Aceptados</h4>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center justify-between p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg admin-table-row">
                <span className="text-sm">Efectivo</span>
                <input
                  type="checkbox"
                  checked={settings.payment.acceptCash}
                  onChange={(e) => updateSetting("payment", "acceptCash", e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg admin-table-row">
                <span className="text-sm">Tarjetas</span>
                <input
                  type="checkbox"
                  checked={settings.payment.acceptCard}
                  onChange={(e) => updateSetting("payment", "acceptCard", e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg admin-table-row">
                <span className="text-sm">Transferencia</span>
                <input
                  type="checkbox"
                  checked={settings.payment.acceptTransfer}
                  onChange={(e) => updateSetting("payment", "acceptTransfer", e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg admin-table-row">
                <span className="text-sm">Mercado Pago</span>
                <input
                  type="checkbox"
                  checked={settings.payment.acceptMercadoPago}
                  onChange={(e) => updateSetting("payment", "acceptMercadoPago", e.target.checked)}
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Pasarelas de Pago</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg admin-table-row">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-medium">Stripe</p>
                    <p className="text-xs text-muted-foreground">Procesamiento internacional</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`status-badge ${settings.payment.stripeEnabled ? 'status-badge-success' : 'status-badge-info'}`}>
                    {settings.payment.stripeEnabled ? "Activo" : "Inactivo"}
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg admin-table-row">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                    P
                  </div>
                  <div>
                    <p className="text-sm font-medium">PayPal</p>
                    <p className="text-xs text-muted-foreground">Pagos globales</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`status-badge ${settings.payment.paypalEnabled ? 'status-badge-success' : 'status-badge-info'}`}>
                    {settings.payment.paypalEnabled ? "Activo" : "Inactivo"}
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tasa de Comisión (%)</label>
            <Input
              type="number"
              value={settings.payment.commissionRate}
              onChange={(e) => updateSetting("payment", "commissionRate", Number(e.target.value))}
              placeholder="Comisión por transacción"
              step="0.1"
              min="0"
              max="20"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SecuritySettings = () => (
    <div className="space-y-6">
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Configuración de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-medium">Autenticación</h4>
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Autenticación de Dos Factores</p>
                <p className="text-xs text-muted-foreground">Agrega una capa extra de seguridad</p>
              </div>
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => updateSetting("security", "twoFactorAuth", e.target.checked)}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Timeout de Sesión (min)</label>
              <Input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting("security", "sessionTimeout", Number(e.target.value))}
                min="5"
                max="480"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiración de Contraseña (días)</label>
              <Input
                type="number"
                value={settings.security.passwordExpiry}
                onChange={(e) => updateSetting("security", "passwordExpiry", Number(e.target.value))}
                min="30"
                max="365"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Intentos de Login Máximos</label>
              <Input
                type="number"
                value={settings.security.loginAttempts}
                onChange={(e) => updateSetting("security", "loginAttempts", Number(e.target.value))}
                min="3"
                max="10"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Lista Blanca de IPs</p>
                <p className="text-xs text-muted-foreground">Restringir acceso a IPs específicas</p>
              </div>
              <input
                type="checkbox"
                checked={settings.security.ipWhitelist}
                onChange={(e) => updateSetting("security", "ipWhitelist", e.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Logs de Auditoría</p>
                <p className="text-xs text-muted-foreground">Registrar todas las acciones del sistema</p>
              </div>
              <input
                type="checkbox"
                checked={settings.security.auditLogs}
                onChange={(e) => updateSetting("security", "auditLogs", e.target.checked)}
              />
            </label>
          </div>
        </CardContent>
      </Card>

      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            Zona de Peligro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start text-red-500 border-red-200 hover:bg-red-50">
              <Download className="w-4 h-4 mr-2" />
              Exportar Datos del Sistema
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-500 border-red-200 hover:bg-red-50">
              <RefreshCw className="w-4 h-4 mr-2" />
              Restablecer Configuración
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar Todos los Datos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
          <p className="text-muted-foreground">
            Administra la configuración general de tu aplicación
          </p>
        </div>
        <Button 
          variant="empanada" 
          onClick={saveSettings}
          disabled={loading}
          className="min-w-[120px]"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de navegación */}
        <div className="lg:col-span-1">
          <Card className="">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id 
                        ? "bg-empanada-golden text-white" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3">
          <div
            key={activeTab}
          >
            {activeTab === "general" && <GeneralSettings />}
            {activeTab === "store" && <StoreSettings />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "payment" && <PaymentSettings />}
            {activeTab === "security" && <SecuritySettings />}
          </div>
        </div>
      </div>
    </div>
  );
}