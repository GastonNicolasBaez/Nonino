import { useState, useEffect } from "react";
import {
    MapPin,
    Building2,
    Plus,
    Edit,
    Trash,
    Save,
    RefreshCw,
    Search,
    Filter,
    Truck,
    Clock,
    DollarSign,
    CheckCircle,
    XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { SectionHeader, CustomSelect, EmptyState } from "@/components/branding";
import { useAdminData } from "@/context/AdminDataProvider";
import { useSession } from "@/context/SessionProvider";

export function DeliveryManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [storeFilter, setStoreFilter] = useState("-1");
    const [neighborhoodFilter, setNeighborhoodFilter] = useState("-1");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingDelivery, setEditingDelivery] = useState(null);

    // Obtener datos del AdminDataProvider
    const {
        sucursales: stores,
        sucursalSeleccionada: selectedStore,
        adminDataLoading: loading,
    } = useAdminData();

    const session = useSession();

    // Datos mock para las zonas de delivery
    const [deliveryZones, setDeliveryZones] = useState([
        {
            id: 1,
            storeId: 1,
            storeName: "Nonino Empanadas - Centro",
            neighborhood: "Centro",
            deliveryTime: "30-45 min",
            deliveryFee: 500,
            minOrderAmount: 2000,
            isActive: true,
            coverageRadius: 5
        },
        {
            id: 2,
            storeId: 1,
            storeName: "Nonino Empanadas - Centro",
            neighborhood: "Palermo",
            deliveryTime: "45-60 min",
            deliveryFee: 800,
            minOrderAmount: 2500,
            isActive: true,
            coverageRadius: 8
        },
        {
            id: 3,
            storeId: 2,
            storeName: "Nonino Empanadas - Norte",
            neighborhood: "Villa Crespo",
            deliveryTime: "35-50 min",
            deliveryFee: 600,
            minOrderAmount: 2200,
            isActive: false,
            coverageRadius: 6
        }
    ]);

    // Opciones para CustomSelect
    const storeOptions = [
        { value: "-1", label: "Todos los locales" },
        ...stores.map(store => ({
            value: store.id,
            label: store.name
        }))
    ];

    const neighborhoodOptions = [
        { value: "-1", label: "Todos los barrios" },
        { value: "Centro", label: "Centro" },
        { value: "Palermo", label: "Palermo" },
        { value: "Villa Crespo", label: "Villa Crespo" },
        { value: "Belgrano", label: "Belgrano" },
        { value: "Recoleta", label: "Recoleta" },
        { value: "San Telmo", label: "San Telmo" },
        { value: "Puerto Madero", label: "Puerto Madero" }
    ];

    const filteredZones = deliveryZones.filter(zone => {
        const matchesSearch = zone.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
            zone.storeName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStore = storeFilter === '-1' || zone.storeId == storeFilter;
        const matchesNeighborhood = neighborhoodFilter === '-1' || zone.neighborhood === neighborhoodFilter;
        return matchesSearch && matchesStore && matchesNeighborhood;
    });

    const deliveryStats = {
        total: deliveryZones.length,
        active: deliveryZones.filter(z => z.isActive).length,
        inactive: deliveryZones.filter(z => !z.isActive).length,
        averageDeliveryTime: Math.round(deliveryZones.reduce((sum, z) => {
            const time = parseInt(z.deliveryTime.split('-')[0]);
            return sum + time;
        }, 0) / deliveryZones.length),
        averageFee: Math.round(deliveryZones.reduce((sum, z) => sum + z.deliveryFee, 0) / deliveryZones.length)
    };

    const toggleZoneStatus = async (zoneId) => {
        setDeliveryZones(prev => prev.map(zone => 
            zone.id === zoneId ? { ...zone, isActive: !zone.isActive } : zone
        ));
        toast.success("Estado de zona actualizado");
    };

    const deleteZone = (zoneId) => {
        const zone = deliveryZones.find(z => z.id === zoneId);
        if (confirm(`¿Estás seguro de que quieres eliminar la zona de delivery para ${zone?.neighborhood}?`)) {
            setDeliveryZones(prev => prev.filter(z => z.id !== zoneId));
            toast.success("Zona de delivery eliminada");
        }
    };

    // Preparar datos para StatsCards
    const statsData = [
        {
            id: "total-zonas",
            label: "Total Zonas",
            value: deliveryStats.total,
            color: "gray",
            icon: <MapPin className="w-5 h-5" />
        },
        {
            id: "zonas-activas",
            label: "Zonas Activas",
            value: deliveryStats.active,
            color: "green",
            icon: <CheckCircle className="w-5 h-5" />
        },
        {
            id: "zonas-inactivas",
            label: "Zonas Inactivas",
            value: deliveryStats.inactive,
            color: "red",
            icon: <XCircle className="w-5 h-5" />
        },
        {
            id: "tiempo-promedio",
            label: "Tiempo Promedio",
            value: `${deliveryStats.averageDeliveryTime} min`,
            color: "blue",
            icon: <Clock className="w-5 h-5" />
        }
    ];

    // Preparar datos para SectionHeader
    const headerActions = [
        {
            label: "Nueva Zona",
            variant: "empanada",
            className: "h-9 px-4 text-sm font-medium",
            onClick: () => setShowAddModal(true),
            icon: <Plus className="w-4 h-4 mr-2" />
        },
        {
            label: "Actualizar",
            variant: "outline",
            className: "h-9 px-4 text-sm font-medium",
            onClick: () => {
                toast.info("Actualizando zonas de delivery...");
            },
            icon: <RefreshCw className="w-4 h-4 mr-2" />
        }
    ];

    // Componente para el modal de agregar/editar zona
    const DeliveryZoneModal = ({ zone, onClose }) => {
        const [formData, setFormData] = useState(zone || {
            storeId: selectedStore || "",
            neighborhood: "",
            deliveryTime: "",
            deliveryFee: 0,
            minOrderAmount: 0,
            isActive: true,
            coverageRadius: 5
        });

        const handleSave = async () => {
            try {
                if (zone) {
                    // Editar existente
                    setDeliveryZones(prev => prev.map(z => 
                        z.id === zone.id ? { ...z, ...formData } : z
                    ));
                    toast.success("Zona de delivery actualizada correctamente");
                } else {
                    // Crear nueva
                    const newZone = {
                        id: Date.now(),
                        ...formData,
                        storeName: stores.find(s => s.id == formData.storeId)?.name || "Local desconocido"
                    };
                    setDeliveryZones(prev => [...prev, newZone]);
                    toast.success("Zona de delivery creada correctamente");
                }
                onClose();
            } catch (error) {
                console.error('Error al guardar zona:', error);
                toast.error("Error al guardar la zona de delivery");
            }
        };

        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999999] flex items-center justify-center p-4">
                <div className="w-full max-w-2xl">
                    <Card className="shadow-2xl">
                        <CardHeader className="pb-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                        {zone ? "Editar Zona de Delivery" : "Nueva Zona de Delivery"}
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {zone ? "Modifica la configuración de la zona" : "Configura una nueva zona de delivery"}
                                    </p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={onClose}>
                                    ✕
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Local *
                                    </label>
                                    <CustomSelect
                                        value={formData.storeId}
                                        onChange={(value) => setFormData(prev => ({ ...prev, storeId: value }))}
                                        options={storeOptions.filter(opt => opt.value !== "-1")}
                                        placeholder="Seleccionar local"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Barrio *
                                    </label>
                                    <CustomSelect
                                        value={formData.neighborhood}
                                        onChange={(value) => setFormData(prev => ({ ...prev, neighborhood: value }))}
                                        options={neighborhoodOptions.filter(opt => opt.value !== "-1")}
                                        placeholder="Seleccionar barrio"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Tiempo de Delivery
                                    </label>
                                    <Input
                                        value={formData.deliveryTime}
                                        onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                                        placeholder="30-45 min"
                                        className="admin-input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Costo de Envío
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.deliveryFee}
                                        onChange={(e) => setFormData(prev => ({ ...prev, deliveryFee: Number(e.target.value) }))}
                                        placeholder="500"
                                        className="admin-input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Pedido Mínimo
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.minOrderAmount}
                                        onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: Number(e.target.value) }))}
                                        placeholder="2000"
                                        className="admin-input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Radio de Cobertura (km)
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.coverageRadius}
                                        onChange={(e) => setFormData(prev => ({ ...prev, coverageRadius: Number(e.target.value) }))}
                                        placeholder="5"
                                        className="admin-input"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                        className="rounded border-gray-300 text-empanada-golden focus:ring-empanada-golden"
                                    />
                                    Zona activa
                                </label>
                            </div>
                        </CardContent>

                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <Button variant="outline" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button variant="empanada" onClick={handleSave}>
                                <Save className="w-4 h-4 mr-2" />
                                {zone ? "Actualizar" : "Crear"} Zona
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header usando SectionHeader */}
            <SectionHeader
                title="Gestión de Envíos"
                subtitle="Configura las zonas de delivery y sus parámetros"
                icon={<Truck className="w-6 h-6" />}
                actions={headerActions}
            />

            {/* Stats usando StatsCards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsData.map((stat) => (
                    <Card key={stat.id} className="border-2">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-2 rounded-lg ${
                                    stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                                    stat.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                                    stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                    'bg-gray-100 dark:bg-gray-800'
                                }`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Zonas de Delivery */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Zonas de Delivery ({filteredZones.length} zonas)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Barra de búsqueda y filtros */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Buscar por barrio o local..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="w-48">
                                <CustomSelect
                                    value={storeFilter}
                                    onChange={setStoreFilter}
                                    options={storeOptions}
                                    placeholder="Filtrar por local"
                                />
                            </div>
                            <div className="w-48">
                                <CustomSelect
                                    value={neighborhoodFilter}
                                    onChange={setNeighborhoodFilter}
                                    options={neighborhoodOptions}
                                    placeholder="Filtrar por barrio"
                                />
                            </div>
                        </div>
                    </div>

                    {!selectedStore ? (
                        <EmptyState
                            title="Selecciona una Sucursal"
                            message="Elige una sucursal para comenzar a gestionar sus zonas de delivery"
                            icon={<Truck className="w-12 h-12 text-muted-foreground" />}
                        />
                    ) : loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="border-2 rounded-lg p-4 animate-pulse">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                                            <div className="space-y-2">
                                                <div className="bg-gray-200 h-4 rounded w-32" />
                                                <div className="bg-gray-200 h-3 rounded w-24" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="bg-gray-200 h-8 rounded w-16" />
                                            <div className="bg-gray-200 h-8 rounded w-16" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredZones.length === 0 ? (
                        <EmptyState
                            title="No hay zonas de delivery"
                            message="No se encontraron zonas que coincidan con los filtros aplicados"
                            icon={<MapPin className="w-12 h-12 text-muted-foreground" />}
                        />
                    ) : (
                        <div className="space-y-4">
                            {filteredZones.map((zone) => (
                                <Card key={zone.id} className="border-2 hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-empanada-golden/10 rounded-lg flex items-center justify-center">
                                                    <MapPin className="w-6 h-6 text-empanada-golden" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {zone.neighborhood}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {zone.storeName}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={zone.isActive ? "empanada" : "secondary"}>
                                                    {zone.isActive ? "Activa" : "Inactiva"}
                                                </Badge>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setEditingDelivery(zone)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleZoneStatus(zone.id)}
                                                >
                                                    {zone.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => deleteZone(zone.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {zone.deliveryTime}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    ${zone.deliveryFee}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Min: ${zone.minOrderAmount}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {zone.coverageRadius} km
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modals */}
            {showAddModal && (
                <DeliveryZoneModal
                    onClose={() => setShowAddModal(false)}
                />
            )}
            {editingDelivery && (
                <DeliveryZoneModal
                    zone={editingDelivery}
                    onClose={() => setEditingDelivery(null)}
                />
            )}
        </div>
    );
}
