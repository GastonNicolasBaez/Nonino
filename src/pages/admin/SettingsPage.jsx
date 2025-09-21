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
    AlertTriangle,
    Building2,
    Tag,
    History,
    Plus,
    Edit,
    Trash
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { generateSystemConfigReportPDF, downloadPDF } from "../../services/pdfService";
import { toast } from "sonner";
import { SectionHeader, CustomSelect, EmptyState } from "@/components/branding";
import { useAdminData } from "@/context/AdminDataProvider";
import { AddStoreModal } from "../../components/admin/AddStoreModal";
import { useSession } from "@/context/SessionProvider";

export function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);
    const [isAddingStore, setIsAddingStore] = useState(false);

    // Obtener datos del AdminDataProvider
    const {
        sucursales: stores,
        sucursalSeleccionada: selectedStore,
        adminDataLoading: loading,
        callCrearSucursal,
        callSucursales,
    } = useAdminData();

    const session = useSession();

    // Opciones para CustomSelect
    const currencyOptions = [
        { value: "ARS", label: "Peso Argentino (ARS)" },
        { value: "USD", label: "Dólar (USD)" },
        { value: "EUR", label: "Euro (EUR)" }
    ];

    const timezoneOptions = [
        { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires (UTC-3)" },
        { value: "America/Argentina/Cordoba", label: "Córdoba (UTC-3)" },
        { value: "America/Argentina/Mendoza", label: "Mendoza (UTC-3)" }
    ];

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
        },
        stores: [
            {
                id: 1,
                name: "Nonino Empanadas - Centro",
                address: "Av. San Martín 123, Centro, CABA",
                phone: "+54 11 1234-5678",
                coordinates: { lat: -34.6037, lng: -58.3816 },
                hours: {
                    monday: { open: "09:00", close: "22:00" },
                    tuesday: { open: "09:00", close: "22:00" },
                    wednesday: { open: "09:00", close: "22:00" },
                    thursday: { open: "09:00", close: "22:00" },
                    friday: { open: "09:00", close: "23:00" },
                    saturday: { open: "10:00", close: "23:00" },
                    sunday: { open: "10:00", close: "21:00" }
                },
                deliveryTime: "30-45 min",
                minOrder: 2000,
                rating: 4.8,
                isOpen: true
            },
            {
                id: 2,
                name: "Nonino Empanadas - Norte",
                address: "Av. Santa Fe 456, Palermo, CABA",
                phone: "+54 11 2345-6789",
                coordinates: { lat: -34.5889, lng: -58.3974 },
                hours: {
                    monday: { open: "09:00", close: "22:00" },
                    tuesday: { open: "09:00", close: "22:00" },
                    wednesday: { open: "09:00", close: "22:00" },
                    thursday: { open: "09:00", close: "22:00" },
                    friday: { open: "09:00", close: "23:00" },
                    saturday: { open: "10:00", close: "23:00" },
                    sunday: { open: "10:00", close: "21:00" }
                },
                deliveryTime: "25-40 min",
                minOrder: 1800,
                rating: 4.9,
                isOpen: true
            }
        ],
        promotions: [
            {
                id: 1,
                title: "Descuento Bienvenida",
                description: "10% de descuento en tu primera compra",
                discount: 10,
                code: "BIENVENIDO10",
                validFrom: "2024-01-01",
                validUntil: "2024-12-31",
                minOrderAmount: 0,
                maxUses: 1000,
                isActive: true
            },
            {
                id: 2,
                title: "Envío Gratis",
                description: "Envío gratis en pedidos superiores a $2500",
                discount: 0,
                code: "ENVIOGRATIS",
                validFrom: "2024-01-01",
                validUntil: "2024-12-31",
                minOrderAmount: 2500,
                maxUses: 500,
                isActive: true
            }
        ],
        companyHistory: {
            foundedYear: 1995,
            founderName: "Carlos Nonino",
            companyDescription: "Una tradición familiar que comenzó hace más de 25 años con el sueño de compartir el auténtico sabor de las empanadas argentinas",
            story: "Todo comenzó en 1995 cuando Don Carlos Nonino decidió cumplir su sueño de abrir su propia empanadora. Con las recetas heredadas de su abuela y una gran pasión por la cocina, abrió el primer local en el centro de la ciudad.",
            milestones: [
                { year: "1995", event: "Fundación de Nonino Empanadas", description: "Don Carlos Nonino abre el primer local familiar" },
                { year: "2000", event: "Segundo Local", description: "Expansión a la zona norte de la ciudad" },
                { year: "2010", event: "Delivery Online", description: "Lanzamiento de nuestro servicio de delivery" },
                { year: "2020", event: "App Mobile", description: "Desarrollo de nuestra aplicación móvil" },
                { year: "2024", event: "25 Años de Tradición", description: "Celebramos nuestro aniversario con nuevas recetas" }
            ],
            values: [
                { title: "Pasión", description: "Cada empanada está hecha con amor y dedicación, manteniendo las recetas familiares que nos han acompañado por generaciones." },
                { title: "Calidad", description: "Seleccionamos cuidadosamente cada ingrediente para garantizar el mejor sabor y frescura en todos nuestros productos." },
                { title: "Familia", description: "Somos una empresa familiar que valora las relaciones humanas y el trato cercano con cada uno de nuestros clientes." },
                { title: "Tradición", description: "Respetamos las técnicas tradicionales de elaboración mientras innovamos para satisfacer los gustos modernos." }
            ],
            stats: {
                yearsExperience: 29,
                happyCustomers: 15000,
                empanadasSold: 100000,
                averageRating: 4.8
            }
        }
    });

    const tabs = [
        { id: "general", label: "General", icon: Settings },
        { id: "store", label: "Tienda", icon: Store },
        { id: "stores", label: "Locales", icon: Building2 },
        { id: "promotions", label: "Promociones", icon: Tag },
        { id: "history", label: "Nuestra Historia", icon: History },
        { id: "notifications", label: "Notificaciones", icon: Bell },
        { id: "payment", label: "Pagos", icon: CreditCard },
        { id: "export-import", label: "Exportación/Importación", icon: Database },
        { id: "security", label: "Seguridad", icon: Shield }
    ];

    const saveSettings = async () => {
        // Simular guardado
        setTimeout(() => {
            toast.success("Configuración guardada correctamente");
        }, 1500);
    };

    const addStore = () => {
        setIsAddStoreModalOpen(true);
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

    // agregar sucursal ACTUALIZADO
    const handleSaveStore = async (storeData) => {

        setIsAddingStore(true);

        try {
            await callCrearSucursal({
                _store: storeData,
                _accessToken: session.userData.accessToken,
            });

            toast.success(`Local "${storeData.name}" agregado correctamente`);
            await callSucursales(session.userData.accessToken);
            setIsAddStoreModalOpen(false);

        } catch (error) {
            console.error('Error al agregar local:', error);
            toast.error('Error al agregar el local. Inténtalo de nuevo.');
        } finally {
            setIsAddingStore(false);
        }
    };

    const updateStore = (storeId, key, value) => {
        setSettings(prev => ({
            ...prev,
            stores: prev.stores.map(store =>
                store.id === storeId ? { ...store, [key]: value } : store
            )
        }));
    };

    const deleteStore = (storeId) => {
        setSettings(prev => ({
            ...prev,
            stores: prev.stores.filter(store => store.id !== storeId)
        }));
    };

    const addPromotion = () => {
        const newPromotion = {
            id: Date.now(),
            title: "",
            description: "",
            discount: 0,
            code: "",
            validFrom: new Date().toISOString().split('T')[0],
            validUntil: new Date().toISOString().split('T')[0],
            minOrderAmount: 0,
            maxUses: 100,
            isActive: true
        };
        setSettings(prev => ({
            ...prev,
            promotions: [...prev.promotions, newPromotion]
        }));
    };

    const updatePromotion = (promotionId, key, value) => {
        setSettings(prev => ({
            ...prev,
            promotions: prev.promotions.map(promotion =>
                promotion.id === promotionId ? { ...promotion, [key]: value } : promotion
            )
        }));
    };

    const deletePromotion = (promotionId) => {
        setSettings(prev => ({
            ...prev,
            promotions: prev.promotions.filter(promotion => promotion.id !== promotionId)
        }));
    };

    const updateHistorySetting = (key, value) => {
        setSettings(prev => ({
            ...prev,
            companyHistory: {
                ...prev.companyHistory,
                [key]: value
            }
        }));
    };

    // Preparar datos para SectionHeader
    const headerActions = [
        {
            label: loading ? "Guardando..." : "Guardar Cambios",
            variant: "empanada",
            onClick: saveSettings,
            disabled: loading,
            className: "min-w-[120px]",
            icon: loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Save className="w-4 h-4 mr-2" />
            )
        },
        {
            label: loading ? "Guardando..." : "Agregar local",
            variant: "empanada",
            onClick: addStore,
            disabled: loading,
            className: "min-w-[120px]",
            icon: loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Save className="w-4 h-4 mr-2" />
            )
        }
    ];

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
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <Input
                                type="email"
                                value={settings.general.businessEmail}
                                onChange={(e) => updateSetting("general", "businessEmail", e.target.value)}
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Teléfono</label>
                            <Input
                                value={settings.general.businessPhone}
                                onChange={(e) => updateSetting("general", "businessPhone", e.target.value)}
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Moneda</label>
                            <CustomSelect
                                value={settings.general.currency}
                                onChange={(value) => updateSetting("general", "currency", value)}
                                options={currencyOptions}
                                placeholder="Seleccionar moneda"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Dirección</label>
                        <Input
                            value={settings.general.businessAddress}
                            onChange={(e) => updateSetting("general", "businessAddress", e.target.value)}
                            placeholder="Dirección completa del negocio"
                            className="admin-input"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Zona Horaria</label>
                            <CustomSelect
                                value={settings.general.timezone}
                                onChange={(value) => updateSetting("general", "timezone", value)}
                                options={timezoneOptions}
                                placeholder="Seleccionar zona horaria"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tasa de IVA (%)</label>
                            <Input
                                type="number"
                                value={settings.general.taxRate}
                                onChange={(e) => updateSetting("general", "taxRate", Number(e.target.value))}
                                min="0"
                                max="50"
                                className="admin-input"
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
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Costo de Envío</label>
                            <Input
                                type="number"
                                value={settings.store.deliveryFee}
                                onChange={(e) => updateSetting("store", "deliveryFee", Number(e.target.value))}
                                placeholder="Costo base de envío"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Envío Gratis desde</label>
                            <Input
                                type="number"
                                value={settings.store.freeDeliveryThreshold}
                                onChange={(e) => updateSetting("store", "freeDeliveryThreshold", Number(e.target.value))}
                                placeholder="Monto para envío gratuito"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tiempo de Preparación (min)</label>
                            <Input
                                type="number"
                                value={settings.store.preparationTime}
                                onChange={(e) => updateSetting("store", "preparationTime", Number(e.target.value))}
                                placeholder="Tiempo promedio de preparación"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Radio de Delivery (km)</label>
                            <Input
                                type="number"
                                value={settings.store.deliveryRadius}
                                onChange={(e) => updateSetting("store", "deliveryRadius", Number(e.target.value))}
                                placeholder="Radio máximo de entrega"
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Pedidos Máximos por Hora</label>
                            <Input
                                type="number"
                                value={settings.store.maxOrdersPerHour}
                                onChange={(e) => updateSetting("store", "maxOrdersPerHour", Number(e.target.value))}
                                placeholder="Capacidad máxima"
                                className="admin-input"
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
                        <Button
                            variant="outline"
                            className="w-full justify-start text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => {
                                try {
                                    const doc = generateSystemConfigReportPDF(settings);
                                    const filename = `configuracion-sistema-${new Date().toISOString().split('T')[0]}.pdf`;
                                    downloadPDF(doc, filename);

                                    toast.success('Configuración del sistema exportada correctamente');
                                } catch (error) {
                                    console.error('Error generando PDF:', error);
                                    toast.error('Error al generar el PDF. Inténtalo de nuevo.');
                                }
                            }}
                        >
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

    const StoresSettings = () => {
        // Si hay una sucursal seleccionada, mostrar solo esa sucursal
        const storesToShow = selectedStore
            ? stores.filter(store => store.id === selectedStore)
            : settings.stores;

        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                {selectedStore ? 'Configuración de Local' : 'Gestión de Locales'}
                            </CardTitle>
                        </div>
                        {selectedStore && (
                            <div className="mt-2 p-2 bg-empanada-golden/10 rounded-md border border-empanada-golden/20">
                                <p className="text-sm text-empanada-golden font-medium">
                                    <Building2 className="w-4 h-4 inline mr-1" />
                                    Configurando: {stores.find(s => s.id === selectedStore)?.name || `Sucursal ${selectedStore}`}
                                </p>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!selectedStore ? (
                            <EmptyState
                                title="Selecciona una Sucursal"
                                message="Elige una sucursal para comenzar a gestionar su configuración"
                                icon={<Building2 className="w-12 h-12 text-muted-foreground" />}
                            />
                        ) : storesToShow.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No se encontró información de esta sucursal
                            </div>
                        ) : (
                            storesToShow.map((store) => (
                                <Card key={store.id} className="border-2">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-semibold">{store.name || "Nuevo Local"}</h3>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                {!selectedStore && (
                                                    <Button variant="outline" size="sm" onClick={() => deleteStore(store.id)}>
                                                        <Trash className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Nombre del Local</label>
                                                <Input
                                                    value={store.name || ''}
                                                    onChange={(e) => updateStore(store.id, "name", e.target.value)}
                                                    placeholder="Ej: Nonino Empanadas - Centro"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Teléfono</label>
                                                <Input
                                                    value={store.phone || ''}
                                                    onChange={(e) => updateStore(store.id, "phone", e.target.value)}
                                                    placeholder="+54 11 1234-5678"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-1">Dirección</label>
                                                <Input
                                                    value={store.address || ''}
                                                    onChange={(e) => updateStore(store.id, "address", e.target.value)}
                                                    placeholder="Dirección completa del local"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Tiempo de Delivery</label>
                                                <Input
                                                    value={store.deliveryTime || ''}
                                                    onChange={(e) => updateStore(store.id, "deliveryTime", e.target.value)}
                                                    placeholder="30-45 min"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Pedido Mínimo</label>
                                                <Input
                                                    type="number"
                                                    value={store.minOrder || ''}
                                                    onChange={(e) => updateStore(store.id, "minOrder", Number(e.target.value))}
                                                    placeholder="2000"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Latitud</label>
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    value={store.coordinates?.lat || ''}
                                                    onChange={(e) => updateStore(store.id, "coordinates", { ...store.coordinates, lat: Number(e.target.value) })}
                                                    placeholder="-34.6037"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Longitud</label>
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    value={store.coordinates?.lng || ''}
                                                    onChange={(e) => updateStore(store.id, "coordinates", { ...store.coordinates, lng: Number(e.target.value) })}
                                                    placeholder="-58.3816"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={store.isOpen || false}
                                                    onChange={(e) => updateStore(store.id, "isOpen", e.target.checked)}
                                                />
                                                <span className="text-sm">Local abierto</span>
                                            </label>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    };

    const PromotionsSettings = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                            <Tag className="w-5 h-5" />
                            Gestión de Promociones
                        </CardTitle>
                        <Button onClick={addPromotion} variant="empanada" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Promoción
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {settings.promotions.map((promotion) => (
                        <Card key={promotion.id} className="border-2">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold">{promotion.title || "Nueva Promoción"}</h3>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => deletePromotion(promotion.id)}>
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Título</label>
                                        <Input
                                            value={promotion.title}
                                            onChange={(e) => updatePromotion(promotion.id, "title", e.target.value)}
                                            placeholder="Ej: Descuento Bienvenida"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Código</label>
                                        <Input
                                            value={promotion.code}
                                            onChange={(e) => updatePromotion(promotion.id, "code", e.target.value)}
                                            placeholder="BIENVENIDO10"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-1">Descripción</label>
                                        <Input
                                            value={promotion.description}
                                            onChange={(e) => updatePromotion(promotion.id, "description", e.target.value)}
                                            placeholder="Descripción de la promoción"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Descuento (%)</label>
                                        <Input
                                            type="number"
                                            value={promotion.discount}
                                            onChange={(e) => updatePromotion(promotion.id, "discount", Number(e.target.value))}
                                            placeholder="10"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Pedido Mínimo</label>
                                        <Input
                                            type="number"
                                            value={promotion.minOrderAmount}
                                            onChange={(e) => updatePromotion(promotion.id, "minOrderAmount", Number(e.target.value))}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Válido Desde</label>
                                        <Input
                                            type="date"
                                            value={promotion.validFrom}
                                            onChange={(e) => updatePromotion(promotion.id, "validFrom", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Válido Hasta</label>
                                        <Input
                                            type="date"
                                            value={promotion.validUntil}
                                            onChange={(e) => updatePromotion(promotion.id, "validUntil", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Usos Máximos</label>
                                        <Input
                                            type="number"
                                            value={promotion.maxUses}
                                            onChange={(e) => updatePromotion(promotion.id, "maxUses", Number(e.target.value))}
                                            placeholder="1000"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={promotion.isActive}
                                            onChange={(e) => updatePromotion(promotion.id, "isActive", e.target.checked)}
                                        />
                                        <span className="text-sm">Promoción activa</span>
                                    </label>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    );

    const HistorySettings = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Información de la Empresa
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Año de Fundación</label>
                            <Input
                                type="number"
                                value={settings.companyHistory.foundedYear}
                                onChange={(e) => updateHistorySetting("foundedYear", Number(e.target.value))}
                                placeholder="1995"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Nombre del Fundador</label>
                            <Input
                                value={settings.companyHistory.founderName}
                                onChange={(e) => updateHistorySetting("founderName", e.target.value)}
                                placeholder="Carlos Nonino"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Descripción de la Empresa</label>
                        <textarea
                            className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-empanada-golden"
                            rows="3"
                            value={settings.companyHistory.companyDescription}
                            onChange={(e) => updateHistorySetting("companyDescription", e.target.value)}
                            placeholder="Descripción general de la empresa"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Historia de la Empresa</label>
                        <textarea
                            className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-empanada-golden"
                            rows="4"
                            value={settings.companyHistory.story}
                            onChange={(e) => updateHistorySetting("story", e.target.value)}
                            placeholder="Historia detallada de la empresa"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Estadísticas de la Empresa
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Años de Experiencia</label>
                            <Input
                                type="number"
                                value={settings.companyHistory.stats.yearsExperience}
                                onChange={(e) => updateHistorySetting("stats", { ...settings.companyHistory.stats, yearsExperience: Number(e.target.value) })}
                                placeholder="29"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Clientes Felices</label>
                            <Input
                                type="number"
                                value={settings.companyHistory.stats.happyCustomers}
                                onChange={(e) => updateHistorySetting("stats", { ...settings.companyHistory.stats, happyCustomers: Number(e.target.value) })}
                                placeholder="15000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Empanadas Vendidas</label>
                            <Input
                                type="number"
                                value={settings.companyHistory.stats.empanadasSold}
                                onChange={(e) => updateHistorySetting("stats", { ...settings.companyHistory.stats, empanadasSold: Number(e.target.value) })}
                                placeholder="100000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Calificación Promedio</label>
                            <Input
                                type="number"
                                step="0.1"
                                value={settings.companyHistory.stats.averageRating}
                                onChange={(e) => updateHistorySetting("stats", { ...settings.companyHistory.stats, averageRating: Number(e.target.value) })}
                                placeholder="4.8"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const ExportImportSettings = () => (
        <div className="space-y-6">
            {/* Exportación de Datos */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Exportación de Datos
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                toast.info("Exportando productos...");
                                // Aquí se llamaría a la función de exportación de productos
                            }}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Exportar Productos
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                toast.info("Exportando clientes...");
                                // Aquí se llamaría a la función de exportación de clientes
                            }}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Exportar Clientes
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                toast.info("Exportando pedidos...");
                                // Aquí se llamaría a la función de exportación de pedidos
                            }}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Exportar Pedidos
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                toast.info("Exportando inventario...");
                                // Aquí se llamaría a la función de exportación de inventario
                            }}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Exportar Inventario
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                toast.info("Exportando reportes...");
                                // Aquí se llamaría a la función de exportación de reportes
                            }}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Exportar Reportes
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                try {
                                    generateSystemConfigReportPDF();
                                    toast.success("Configuración del sistema exportada correctamente");
                                } catch (error) {
                                    console.error('Error generando PDF:', error);
                                    toast.error('Error al generar el PDF. Inténtalo de nuevo.');
                                }
                            }}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Exportar Configuración del Sistema
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Importación de Datos */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Importación de Datos
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                toast.info("Funcionalidad de importación de productos próximamente");
                            }}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Importar Productos
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                toast.info("Funcionalidad de importación de clientes próximamente");
                            }}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Importar Clientes
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                toast.info("Funcionalidad de importación de pedidos próximamente");
                            }}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Importar Pedidos
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                toast.info("Funcionalidad de importación de inventario próximamente");
                            }}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Importar Inventario
                        </Button>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                                    Importante sobre la Importación
                                </h4>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                    La funcionalidad de importación está en desarrollo. Los archivos deben estar en formato CSV con las columnas correctas.
                                    Se recomienda hacer una copia de seguridad antes de importar datos masivos.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Respaldo y Restauración */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Respaldo y Restauración
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                toast.info("Creando respaldo completo del sistema...");
                            }}
                        >
                            <Database className="w-4 h-4 mr-2" />
                            Crear Respaldo Completo
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full justify-start text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => {
                                toast.info("Funcionalidad de restauración próximamente");
                            }}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Restaurar desde Respaldo
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header usando SectionHeader */}
            <SectionHeader
                title="Configuración del Sistema"
                subtitle="Administra la configuración general de tu aplicación"
                icon={<Settings className="w-6 h-6" />}
                actions={headerActions}
            />


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
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
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
                        {activeTab === "stores" && <StoresSettings />}
                        {activeTab === "promotions" && <PromotionsSettings />}
                        {activeTab === "history" && <HistorySettings />}
                        {activeTab === "notifications" && <NotificationSettings />}
                        {activeTab === "payment" && <PaymentSettings />}
                        {activeTab === "export-import" && <ExportImportSettings />}
                        {activeTab === "security" && <SecuritySettings />}
                    </div>
                </div>
            </div>

            {/* Modal para agregar locales */}
            <AddStoreModal
                isOpen={isAddStoreModalOpen}
                onClose={() => setIsAddStoreModalOpen(false)}
                onSave={handleSaveStore}
                isLoading={isAddingStore}
            />
        </div>
    );
}