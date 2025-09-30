import { useState, useEffect } from "react";
import {
    Building2,
    MapPin,
    Save,
    RefreshCw,
    Plus,
    Trash,
    Settings,
    Store,
    X,
    Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SectionHeader, CustomSelect, EmptyState } from "@/components/branding";
import { useAdminData } from "@/context/AdminDataProvider";
import { AddStoreModal } from "@/components/admin/AddStoreModal";
import { ScheduleConfiguration } from "@/components/admin/ScheduleConfiguration";
import { Portal } from "@/components/common/Portal";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/context/SessionProvider";

// función de adaptación para mandar a backend
function transformSchedule(data, timezone = "America/Argentina/Buenos_Aires") {
    // Group by dayOfWeek
    const grouped = data.reduce((acc, item) => {
        const { dayOfWeek, slotIndex, openAt, closeAt } = item;
        if (!acc[dayOfWeek]) {
            acc[dayOfWeek] = [];
        }
        acc[dayOfWeek].push({ slotIndex, openAt, closeAt });
        return acc;
    }, {});

    // Build the target structure
    return {
        timezone,
        days: Object.entries(grouped).map(([dayOfWeek, slots]) => ({
            dayOfWeek: Number(dayOfWeek),
            slots
        }))
    };
}

export function BranchManagement() {
    const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);
    const [isAddingStore, setIsAddingStore] = useState(false);
    const [scheduleModalStore, setScheduleModalStore] = useState(null);
    const [newStoreSchedule, setNewStoreSchedule] = useState(null);

    // Obtener datos del AdminDataProvider
    const {
        sucursales: stores,
        sucursalSeleccionada: selectedStore,
        adminDataLoading: loading,
        horariosSucursal: schedule,
        callCrearSucursal,
        callActualizarSucursal,
        callSucursales,
        callSchedule,
        callUpdateSchedule,
    } = useAdminData();

    const session = useSession();

    // Si hay una sucursal seleccionada, mostrar solo esa sucursal
    const storesToShow = selectedStore
        ? stores.filter(store => store.id === selectedStore)
        : stores;

    const addStore = () => {
        setIsAddStoreModalOpen(true);
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

    const handleUpdateSchedule = async () => {
        try {
            setScheduleModalStore(null);

            if (newStoreSchedule) {
                const adaptedSchedule = transformSchedule(newStoreSchedule);

                await callUpdateSchedule({
                    _storeId: selectedStore,
                    _schedule: adaptedSchedule,
                    _accessToken: session.userData.accessToken,
                });
            }

            toast.success("Horarios guardados correctamente");
            await callSchedule({
                _storeId: selectedStore,
                _accessToken: session.userData.accessToken,
            });
        } catch (error) {
            console.error('Error al guardar horarios:', error);
            toast.error('Error al guardar los horarios');
        } finally {
            setNewStoreSchedule(null);
        }
    }

    // Preparar datos para SectionHeader
    const headerActions = [
        {
            label: loading ? "Guardando..." : "Agregar Local",
            variant: "empanada",
            onClick: addStore,
            disabled: loading,
            className: "min-w-[120px]",
            icon: loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Plus className="w-4 h-4 mr-2" />
            )
        }
    ];

    // Componente separado para el formulario de configuración de cada local
    const StoreConfigForm = ({ store }) => {
        const [localStore, setLocalStore] = useState({
            name: store.name || '',
            type: store.code || 'local',
            street: store.street || '',
            number: store.number || '',
            barrio: store.barrio || '',
            lat: store.lat || '',
            lng: store.lng || '',
            supportsPickup: store.supportsPickup || true,
            supportsDelivery: store.supportsDelivery || true,
            tel1: store.tel1 || '',
            tel2: store.tel2 || '',
        });

        // Actualizar el estado local cuando cambie el store prop
        useEffect(() => {
            setLocalStore({
                name: store.name || '',
                type: store.code || 'local',
                street: store.street || '',
                number: store.number || '',
                barrio: store.barrio || '',
                lat: store.lat || '',
                lng: store.lng || '',
                supportsPickup: store.supportsPickup || true,
                supportsDelivery: store.supportsDelivery || true,
                tel1: store.tel1 || '',
                tel2: store.tel2 || '',
            });
        }, [store]);

        const handleInputChange = (field, value) => {
            setLocalStore(prev => ({
                ...prev,
                [field]: value
            }));
        };

        // Opciones de tipo de local
        const storeTypeOptions = [
            { value: "local", label: "Local" },
            { value: "franquicia", label: "Franquicia" },
            { value: "fabrica", label: "Fábrica" }
        ];

        // Función para guardar cambios en el servidor
        const handleSaveChanges = async () => {
            try {
                const storeData = {
                    id: store.id,
                    name: localStore.name.trim(),
                    code: localStore.type,
                    street: localStore.street.trim(),
                    number: localStore.number.trim(),
                    barrio: localStore.barrio.trim(),
                    lat: Number(localStore.lat),
                    lng: Number(localStore.lng),
                    supportsPickup: localStore.supportsPickup,
                    supportsDelivery: localStore.supportsDelivery,
                    tel1: localStore.tel1.trim(),
                    tel2: localStore.tel2.trim(),
                    timezone: 'America/Argentina/Buenos_Aires',
                    // deliveryTime: localStore.deliveryTime.trim(),
                    // minOrder: Number(localStore.minOrder),
                    // isOpen: localStore.isOpen,
                    // coordinates: {
                    //     lat: Number(localStore.lat),
                    //     lng: Number(localStore.lng)
                    // }
                };

                await callActualizarSucursal({
                    _store: storeData,
                    _accessToken: session.userData.accessToken,
                });
                toast.success("Cambios guardados correctamente");
                // Recargar la lista de sucursales
                await callSucursales(session.userData.accessToken);
            } catch (error) {
                console.error('Error al actualizar sucursal:', error);
                toast.error('Error al guardar los cambios');
            }
        };

        return (
            <Card className="border-2">
                <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-empanada-golden/10 rounded-lg flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-empanada-golden" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">{localStore.name || "Nuevo Local"}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={localStore.isOpen ? "empanada" : "secondary"}>
                                        {localStore.isOpen ? "Abierto" : "Cerrado"}
                                    </Badge>
                                    <Badge variant="outline">
                                        {localStore.type === "local" ? "Local" : "Franquicia"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSaveChanges}
                                disabled={loading}
                            >
                                {loading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {loading ? "Guardando..." : "Guardar"}
                            </Button>
                            {!selectedStore && (
                                <Button variant="outline" size="sm" onClick={() => {
                                    // TODO: Implementar eliminación de sucursal desde AdminDataProvider
                                    toast.info("Funcionalidad de eliminación próximamente");
                                }}>
                                    <Trash className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Grid principal con 3 columnas como en el modal */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Columna 1: Información Básica */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                Información Básica
                            </h3>

                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                    Nombre del Local *
                                </label>
                                <Input
                                    value={localStore.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    placeholder="Ej: Nonino Empanadas - Centro"
                                    className="admin-input text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                    Tipo *
                                </label>
                                <CustomSelect
                                    value={localStore.type}
                                    onChange={(value) => handleInputChange("type", value)}
                                    options={storeTypeOptions}
                                    placeholder="Seleccionar tipo"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                    Teléfono
                                </label>
                                <Input
                                    value={localStore.tel1}
                                    onChange={(e) => handleInputChange("tel1", e.target.value)}
                                    placeholder="+54 11 1234-5678"
                                    className="admin-input text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                    WhatsApp
                                </label>
                                <Input
                                    value={localStore.tel2}
                                    onChange={(e) => handleInputChange("tel2", e.target.value)}
                                    placeholder="+54 11 1234-5678"
                                    className="admin-input text-sm"
                                />
                            </div>
                        </div>

                        {/* Columna 2: Ubicación */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Ubicación
                            </h3>

                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                    Calle *
                                </label>
                                <Input
                                    value={localStore.street}
                                    onChange={(e) => handleInputChange("street", e.target.value)}
                                    placeholder="Ej: Av. San Martín"
                                    className="admin-input text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        Número *
                                    </label>
                                    <Input
                                        value={localStore.number}
                                        onChange={(e) => handleInputChange("number", e.target.value)}
                                        placeholder="123"
                                        className="admin-input text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        Barrio *
                                    </label>
                                    <Input
                                        value={localStore.barrio}
                                        onChange={(e) => handleInputChange("barrio", e.target.value)}
                                        placeholder="Centro"
                                        className="admin-input text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        Latitud *
                                    </label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={localStore.lat}
                                        onChange={(e) => handleInputChange("lat", e.target.value)}
                                        placeholder="-34.6037"
                                        className="admin-input text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        Longitud *
                                    </label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={localStore.lng}
                                        onChange={(e) => handleInputChange("lng", e.target.value)}
                                        placeholder="-58.3816"
                                        className="admin-input text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Columna 3: Configuración */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                Configuración
                            </h3>

                            <div className="space-y-2">
                                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Servicios Disponibles
                                </h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={localStore.supportsPickup}
                                            onChange={(e) => handleInputChange("supportsPickup", e.target.checked)}
                                            className="rounded border-gray-300 text-empanada-golden focus:ring-empanada-golden"
                                        />
                                        <span className="text-xs text-gray-700 dark:text-gray-300">
                                            Soporta Retiro en Local
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={localStore.supportsDelivery}
                                            onChange={(e) => handleInputChange("supportsDelivery", e.target.checked)}
                                            className="rounded border-gray-300 text-empanada-golden focus:ring-empanada-golden"
                                        />
                                        <span className="text-xs text-gray-700 dark:text-gray-300">
                                            Soporta Delivery
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* <div className="mt-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={localStore.isOpen}
                                        onChange={(e) => handleInputChange("isOpen", e.target.checked)}
                                        className="rounded border-gray-300 text-empanada-golden focus:ring-empanada-golden"
                                    />
                                    <span className="text-xs text-gray-700 dark:text-gray-300">
                                        Local abierto
                                    </span>
                                </label>
                            </div> */}

                            {/* Botón de configuración de horarios */}
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setScheduleModalStore(store);
                                    }}
                                    className="flex items-center gap-2 text-sm border-empanada-golden/30 hover:bg-empanada-golden/10"
                                >
                                    <Clock className="w-4 h-4" />
                                    Configurar Horarios
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header usando SectionHeader */}
            <SectionHeader
                title="Gestión de Sucursales"
                subtitle="Administra la información y configuración de tus locales"
                icon={<Building2 className="w-6 h-6" />}
                actions={headerActions}
            />

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            {selectedStore ? 'Configuración de Local' : 'Gestión de Locales'}
                        </CardTitle>
                    </div>
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
                            <StoreConfigForm key={store.id} store={store} />
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Modal para agregar locales */}
            <AddStoreModal
                isOpen={isAddStoreModalOpen}
                onClose={() => setIsAddStoreModalOpen(false)}
                onSave={handleSaveStore}
                isLoading={isAddingStore}
            />

            {/* Modal de configuración de horarios */}
            {scheduleModalStore && (
                <Portal>
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
                        >
                            {/* Backdrop */}
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setScheduleModalStore(null)} />

                            {/* Modal */}
                            <motion.div
                                initial={{ scale: 0.96, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.96, opacity: 0 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                            >
                                <Card className="shadow-xl border-2 border-empanada-golden/20">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-empanada-golden/10">
                                                    <Clock className="w-6 h-6 text-empanada-golden" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg text-gray-800 dark:text-gray-200">
                                                        Configurar Horarios
                                                    </CardTitle>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {scheduleModalStore.name} - Horarios y excepciones
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setScheduleModalStore(null)}
                                                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <ScheduleConfiguration
                                            schedule={schedule}
                                            onScheduleChange={setNewStoreSchedule}
                                            className="max-h-[60vh] overflow-y-auto"
                                        />

                                        {/* Botones de acción */}
                                        <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <Button
                                                variant="outline"
                                                onClick={() => setScheduleModalStore(null)}
                                                className="min-w-[80px] text-sm"
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                variant="empanada"
                                                onClick={handleUpdateSchedule}
                                                className="min-w-[100px] text-sm"
                                            >
                                                <Save className="w-3 h-3 mr-2" />
                                                Guardar Horarios
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </Portal>
            )}
        </div>
    );
}
