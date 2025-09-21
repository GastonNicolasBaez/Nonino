import { useState } from 'react';
import { X, MapPin, Building2, Clock, Check, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CustomSelect } from '../branding';
import { Portal } from '../common/Portal';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

/**
 * Modal para agregar nuevos locales
 * Sigue la estética de los otros modales del proyecto
 */
export function AddStoreModal({
    isOpen,
    onClose,
    onSave,
    isLoading = false
}) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'local', // 'local' o 'franquicia'
        street: '',
        number: '',
        barrio: '',
        lat: '',
        lng: '',
        supportsPickup: true,
        supportsDelivery: true,
        timezone: 'America/Argentina/Buenos_Aires'
    });

    const [errors, setErrors] = useState({});

    // Opciones de tipo de local
    const storeTypeOptions = [
        { value: "local", label: "Local" },
        { value: "franquicia", label: "Franquicia" }
    ];

    // Opciones de zona horaria
    //   const timezoneOptions = [
    //     { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires (UTC-3)" },
    //     { value: "America/Argentina/Cordoba", label: "Córdoba (UTC-3)" },
    //     { value: "America/Argentina/Mendoza", label: "Mendoza (UTC-3)" },
    //     { value: "America/Argentina/Salta", label: "Salta (UTC-3)" },
    //     { value: "America/Argentina/Tucuman", label: "Tucumán (UTC-3)" },
    //     { value: "America/Argentina/Ushuaia", label: "Ushuaia (UTC-3)" }
    //   ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre del local es requerido';
        }

        if (!formData.type) {
            newErrors.type = 'El tipo de local es requerido';
        }

        if (!formData.street.trim()) {
            newErrors.street = 'La calle es requerida';
        }

        if (!formData.number.trim()) {
            newErrors.number = 'El número es requerido';
        }

        if (!formData.barrio.trim()) {
            newErrors.barrio = 'El barrio es requerido';
        }

        if (!formData.lat || isNaN(Number(formData.lat))) {
            newErrors.lat = 'La latitud debe ser un número válido';
        } else if (Number(formData.lat) < -90 || Number(formData.lat) > 90) {
            newErrors.lat = 'La latitud debe estar entre -90 y 90';
        }

        if (!formData.lng || isNaN(Number(formData.lng))) {
            newErrors.lng = 'La longitud debe ser un número válido';
        } else if (Number(formData.lng) < -180 || Number(formData.lng) > 180) {
            newErrors.lng = 'La longitud debe estar entre -180 y 180';
        }

        if (!formData.timezone) {
            newErrors.timezone = 'La zona horaria es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) {
            toast.error('Por favor, corrige los errores en el formulario');
            return;
        }

        const storeData = {
            name: formData.name.trim(),
            code: formData.type.trim(),
            street: formData.street.trim(),
            number: formData.number.trim(),
            barrio: formData.barrio.trim(),
            lat: Number(formData.lat),
            lng: Number(formData.lng),
            supportsPickup: formData.supportsPickup,
            supportsDelivery: formData.supportsDelivery,
            timezone: 'America/Argentina/Buenos_Aires',
        };

        onSave(storeData);
    };

    const handleClose = () => {
        // Resetear formulario al cerrar
        setFormData({
            name: '',
            type: 'local',
            street: '',
            number: '',
            barrio: '',
            lat: '',
            lng: '',
            supportsPickup: true,
            supportsDelivery: true,
            timezone: 'America/Argentina/Buenos_Aires'
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Portal>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.96, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="relative w-full max-w-4xl"
                    >
                        <Card className="shadow-xl border-2 border-empanada-golden/20">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-empanada-golden/10">
                                            <Building2 className="w-6 h-6 text-empanada-golden" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg text-gray-800 dark:text-gray-200">
                                                Agregar Nuevo Local
                                            </CardTitle>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Completa la información del local
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClose}
                                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        disabled={isLoading}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Grid principal con 3 columnas */}
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
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                placeholder="Ej: Nonino Empanadas - Centro"
                                                className={`admin-input text-sm ${errors.name ? 'border-red-500' : ''}`}
                                                disabled={isLoading}
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                                Tipo *
                                            </label>
                                            <CustomSelect
                                                value={formData.type}
                                                onChange={(value) => handleInputChange('type', value)}
                                                options={storeTypeOptions}
                                                placeholder="Seleccionar tipo"
                                                disabled={isLoading}
                                            />
                                            {errors.type && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    {errors.type}
                                                </p>
                                            )}
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
                                                value={formData.street}
                                                onChange={(e) => handleInputChange('street', e.target.value)}
                                                placeholder="Ej: Av. San Martín"
                                                className={`admin-input text-sm ${errors.street ? 'border-red-500' : ''}`}
                                                disabled={isLoading}
                                            />
                                            {errors.street && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    {errors.street}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                                    Número *
                                                </label>
                                                <Input
                                                    value={formData.number}
                                                    onChange={(e) => handleInputChange('number', e.target.value)}
                                                    placeholder="123"
                                                    className={`admin-input text-sm ${errors.number ? 'border-red-500' : ''}`}
                                                    disabled={isLoading}
                                                />
                                                {errors.number && (
                                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        {errors.number}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                                    Barrio *
                                                </label>
                                                <Input
                                                    value={formData.barrio}
                                                    onChange={(e) => handleInputChange('barrio', e.target.value)}
                                                    placeholder="Centro"
                                                    className={`admin-input text-sm ${errors.barrio ? 'border-red-500' : ''}`}
                                                    disabled={isLoading}
                                                />
                                                {errors.barrio && (
                                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        {errors.barrio}
                                                    </p>
                                                )}
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
                                                    value={formData.lat}
                                                    onChange={(e) => handleInputChange('lat', e.target.value)}
                                                    placeholder="-34.6037"
                                                    className={`admin-input text-sm ${errors.lat ? 'border-red-500' : ''}`}
                                                    disabled={isLoading}
                                                />
                                                {errors.lat && (
                                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        {errors.lat}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                                    Longitud *
                                                </label>
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    value={formData.lng}
                                                    onChange={(e) => handleInputChange('lng', e.target.value)}
                                                    placeholder="-58.3816"
                                                    className={`admin-input text-sm ${errors.lng ? 'border-red-500' : ''}`}
                                                    disabled={isLoading}
                                                />
                                                {errors.lng && (
                                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        {errors.lng}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Columna 3: Configuración */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Configuración
                                        </h3>

                                        {/* <div>
                                            <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                                Zona Horaria *
                                            </label>
                                            <CustomSelect
                                                value={formData.timezone}
                                                onChange={(value) => handleInputChange('timezone', value)}
                                                options={timezoneOptions}
                                                placeholder="Seleccionar zona horaria"
                                                disabled={isLoading}
                                            />
                                            {errors.timezone && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" />
                                                {errors.timezone}
                                                </p>
                                            )}
                                            </div> */}

                                        <div className="space-y-2">
                                            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                Servicios Disponibles
                                            </h4>
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.supportsPickup}
                                                        onChange={(e) => handleInputChange('supportsPickup', e.target.checked)}
                                                        className="rounded border-gray-300 text-empanada-golden focus:ring-empanada-golden"
                                                        disabled={isLoading}
                                                    />
                                                    <span className="text-xs text-gray-700 dark:text-gray-300">
                                                        Soporta Retiro en Local
                                                    </span>
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.supportsDelivery}
                                                        onChange={(e) => handleInputChange('supportsDelivery', e.target.checked)}
                                                        className="rounded border-gray-300 text-empanada-golden focus:ring-empanada-golden"
                                                        disabled={isLoading}
                                                    />
                                                    <span className="text-xs text-gray-700 dark:text-gray-300">
                                                        Soporta Delivery
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Botones de Acción */}
                                <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Button
                                        variant="outline"
                                        onClick={handleClose}
                                        disabled={isLoading}
                                        className="min-w-[80px] text-sm"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="empanada"
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="min-w-[100px] text-sm"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-3 h-3 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-3 h-3 mr-2" />
                                                Guardar Local
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </Portal>
    );
}
