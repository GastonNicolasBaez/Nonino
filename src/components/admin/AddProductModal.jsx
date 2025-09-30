import { useState } from 'react';
import {
  X, Package, CookingPot, Upload, Check, AlertTriangle,
  ChevronLeft, ChevronRight, Search, Plus, Trash2, Calculator, Image as ImageIcon
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CustomSelect } from '../branding';
import { Portal } from '../common/Portal';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ImageUpload } from '../ui/image-upload';

import { useAdminData } from '@/context/AdminDataProvider';

/**
 * Modal para agregar nuevos productos con sistema de pasos
 * Paso 1: Información básica
 * Paso 2: Receta e ingredientes
 * Paso 3: Imagen y configuración final
 */
export function AddProductModal({
    isOpen,
    onClose,
    onSave,
    isLoading = false,
    categories = []
}) {

    const {
        materiales: availableIngredients
    } = useAdminData();

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Paso 1: Información básica
        name: '',
        description: '',
        category: '',
        price: '',
        sku: '',

        // Paso 2: Receta
        recipe: [],
        preparationTime: '',

        // Paso 3: Configuración final
        imageUrl: '',
        minStock: '',
        isAvailable: true
    });

    const [errors, setErrors] = useState({});
    const [searchIngredient, setSearchIngredient] = useState('');
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [ingredientQuantity, setIngredientQuantity] = useState('');
    const [focusedQuantityIndex, setFocusedQuantityIndex] = useState(-1);

    // Opciones para categorías
    const categoryOptions = [
        { value: '', label: 'Seleccionar categoría' },
        ...categories.map(cat => ({
            value: cat.id,
            label: cat.name
        }))
    ];

    // Filtrar ingredientes según búsqueda
    const filteredIngredients = availableIngredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchIngredient.toLowerCase())
    );

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

    // Agregar ingrediente a la receta
    const handleAddIngredient = () => {
        if (!selectedIngredient || !ingredientQuantity) {
            toast.error('Selecciona un ingrediente y especifica la cantidad');
            return;
        }

        const ingredient = availableIngredients.find(ing => ing.id === selectedIngredient);
        if (!ingredient) return;

        const newIngredient = {
            id: ingredient.id,
            name: ingredient.name,
            quantity: parseFloat(ingredientQuantity),
            unit: ingredient.unit
        };

        // Verificar si ya existe
        const exists = formData.recipe.find(r => r.id === ingredient.id);
        if (exists) {
            toast.error('Este ingrediente ya está en la receta');
            return;
        }

        setFormData(prev => ({
            ...prev,
            recipe: [...prev.recipe, newIngredient]
        }));

        // Limpiar selección
        setSelectedIngredient('');
        setIngredientQuantity('');
        setSearchIngredient('');
        toast.success(`${ingredient.name} agregado a la receta`);
    };

    // Remover ingrediente de la receta
    const handleRemoveIngredient = (index) => {
        setFormData(prev => ({
            ...prev,
            recipe: prev.recipe.filter((_, i) => i !== index)
        }));
        toast.success('Ingrediente eliminado de la receta');
    };

    // Agregar ingrediente rápido (Enter o clic)
    const handleQuickAddIngredient = (ingredient) => {
        // Verificar si ya existe
        const exists = formData.recipe.find(r => r.id === ingredient.id);
        if (exists) {
            toast.error('Este ingrediente ya está en la receta');
            setSearchIngredient('');
            return;
        }

        const newIngredient = {
            id: ingredient.id,
            ingredientName: ingredient.name,
            quantity: '', // Sin cantidad por defecto
            unit: ingredient.unit
        };

        setFormData(prev => ({
            ...prev,
            recipe: [...prev.recipe, newIngredient]
        }));

        // Limpiar búsqueda y enfocar en la cantidad del nuevo ingrediente
        setSearchIngredient('');
        const newIndex = formData.recipe.length;
        setFocusedQuantityIndex(newIndex);

        // Enfocar el input de cantidad después de un pequeño delay para que se renderice
        setTimeout(() => {
            const quantityInput = document.querySelector(`#quantity-input-${newIndex}`);
            if (quantityInput) {
                quantityInput.focus();
                quantityInput.select();
            }
        }, 50);

        toast.success(`${ingredient.name} agregado. Especifica la cantidad.`);
    };

    // Actualizar cantidad de ingrediente en los chips
    const handleUpdateIngredientQuantity = (index, newQuantity) => {
        setFormData(prev => ({
            ...prev,
            recipe: prev.recipe.map((item, i) =>
                i === index ? { ...item, quantity: newQuantity } : item
            )
        }));
    };

    // Validaciones por paso
    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.category) {
            newErrors.category = 'La categoría es requerida';
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'El precio debe ser mayor a 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        if (formData.recipe.length === 0) {
            toast.error('Agrega al menos un ingrediente a la receta');
            return false;
        }
        return true;
    };

    const validateStep3 = () => {
        // Paso 3 es opcional (imagen), siempre válido
        return true;
    };

    const validateStep4 = () => {
        // const newErrors = {};

        // if (!formData.minStock || parseInt(formData.minStock) < 0) {
        //     newErrors.minStock = 'El stock mínimo debe ser mayor o igual a 0';
        // }

        // setErrors(newErrors);
        // return Object.keys(newErrors).length === 0;

        // solo confirmar, siempre valido
        return true;
    };

    // Navegación entre pasos
    const nextStep = () => {
        let isValid = false;

        switch (currentStep) {
            case 1:
                isValid = validateStep1();
                break;
            case 2:
                isValid = validateStep2();
                break;
            case 3:
                isValid = validateStep3();
                break;
            case 4:
                isValid = validateStep4();
                break;
            default:
                isValid = true;
        }

        if (isValid && currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Guardar producto
    const handleSave = () => {
        if (!validateStep4()) {
            return;
        }

        const productData = {
            sku: formData.sku || `SKU-${Date.now()}`,
            name: formData.name.trim(),
            description: formData.description.trim(),
            category: formData.category,
            price: parseFloat(formData.price),
            recipe: formData.recipe,
            preparationTime: parseInt(formData.preparationTime) || 0,
            imageUrl: formData.imageUrl,
            minStock: parseInt(formData.minStock),
            isAvailable: formData.isAvailable
        };

        onSave(productData);
    };

    // Cerrar y resetear
    const handleClose = () => {
        setFormData({
            name: '',
            description: '',
            category: '',
            price: '',
            sku: '',
            recipe: [],
            preparationTime: '',
            imageUrl: '',
            minStock: '',
            isAvailable: true
        });
        setErrors({});
        setCurrentStep(1);
        setSearchIngredient('');
        setSelectedIngredient('');
        setIngredientQuantity('');
        onClose();
    };

    // Títulos y descripciones por paso
    const stepInfo = {
        1: {
            title: 'Información Básica',
            description: 'Datos principales del producto',
            icon: <Package className="w-6 h-6 text-empanada-golden" />
        },
        2: {
            title: 'Receta del Producto',
            description: 'Ingredientes y preparación',
            icon: <CookingPot className="w-6 h-6 text-empanada-golden" />
        },
        3: {
            title: 'Imagen del Producto',
            description: 'Subir imagen (opcional)',
            icon: <Upload className="w-6 h-6 text-empanada-golden" />
        },
        4: {
            title: 'Configuración Final',
            description: 'Resumen y configuración de stock',
            icon: <Check className="w-6 h-6 text-empanada-golden" />
        }
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
                        className="relative w-full max-w-4xl max-h-[95vh]"
                    >
                        <Card className="shadow-xl border-2 border-empanada-golden/20">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {currentStep > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={prevStep}
                                                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-empanada-medium mr-2"
                                                disabled={isLoading}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-empanada-golden/10">
                                            {stepInfo[currentStep].icon}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg text-gray-800 dark:text-white">
                                                {stepInfo[currentStep].title}
                                            </CardTitle>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {stepInfo[currentStep].description} - Paso {currentStep} de 4
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClose}
                                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-empanada-medium"
                                        disabled={isLoading}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Progress bar */}
                                <div className="flex items-center mt-4 space-x-2">
                                    {[1, 2, 3, 4].map((step) => (
                                        <div key={step} className="flex-1">
                                            <div className={`h-2 rounded-full ${
                                                step <= currentStep
                                                    ? 'bg-empanada-golden'
                                                    : 'bg-gray-200 dark:bg-empanada-medium'
                                            }`} />
                                        </div>
                                    ))}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto">
                                {/* PASO 1: INFORMACIÓN BÁSICA */}
                                {currentStep === 1 && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                                                    Nombre del Producto *
                                                </label>
                                                <Input
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    placeholder="Ej: Empanada de Carne"
                                                    className={`admin-input ${errors.name ? 'border-red-500' : ''}`}
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
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                                                    Categoría *
                                                </label>
                                                <CustomSelect
                                                    value={formData.category}
                                                    onChange={(value) => handleInputChange('category', value)}
                                                    options={categoryOptions}
                                                    placeholder="Seleccionar categoría"
                                                    disabled={isLoading}
                                                />
                                                {errors.category && (
                                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        {errors.category}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                                                    Precio de Venta *
                                                </label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={formData.price}
                                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                                    placeholder="0.00"
                                                    className={`admin-input ${errors.price ? 'border-red-500' : ''}`}
                                                    disabled={isLoading}
                                                />
                                                {errors.price && (
                                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        {errors.price}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                                                    SKU/Código
                                                </label>
                                                <Input
                                                    value={formData.sku}
                                                    onChange={(e) => handleInputChange('sku', e.target.value)}
                                                    placeholder="Se generará automáticamente"
                                                    className="admin-input"
                                                    disabled={isLoading}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                                                    Descripción
                                                </label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                                    placeholder="Describe el producto..."
                                                    className="w-full h-32 border-2 border-gray-300 dark:border-empanada-light-gray bg-white dark:bg-empanada-dark text-gray-800 dark:text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-empanada-golden resize-none"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* PASO 2: RECETA E INGREDIENTES */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        {/* Buscador y agregar ingredientes */}
                                        <div className="bg-gray-50 dark:bg-empanada-dark p-4 rounded-lg">
                                            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
                                                Agregar Ingredientes
                                            </h3>

                                            {/* Buscador tipo Google con autocomplete */}
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                                                        <Input
                                                            value={searchIngredient}
                                                            onChange={(e) => setSearchIngredient(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' && filteredIngredients.length > 0) {
                                                                    e.preventDefault();
                                                                    const firstIngredient = filteredIngredients[0];
                                                                    handleQuickAddIngredient(firstIngredient);
                                                                }
                                                                if (e.key === 'Escape') {
                                                                    setSearchIngredient('');
                                                                }
                                                            }}
                                                            placeholder="Buscar ingrediente y presionar Enter para agregar..."
                                                            className="pl-10 pr-4 text-base"
                                                        />
                                                    </div>

                                                    {/* Sugerencias instantáneas */}
                                                    {searchIngredient.trim() && filteredIngredients.length > 0 && (
                                                        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-empanada-dark border border-gray-200 dark:border-empanada-light-gray rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                            {filteredIngredients.slice(0, 5).map((ingredient, index) => (
                                                                <button
                                                                    key={ingredient.id}
                                                                    type="button"
                                                                    onClick={() => handleQuickAddIngredient(ingredient)}
                                                                    className={`w-full text-left px-4 py-3 hover:bg-empanada-golden/10 dark:hover:bg-empanada-golden/20 flex items-center justify-between border-b border-gray-100 dark:border-empanada-light-gray last:border-b-0 transition-colors ${
                                                                        index === 0 ? 'bg-gray-50 dark:bg-empanada-medium/50' : ''
                                                                    }`}
                                                                >
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                                                            {ingredient.name}
                                                                        </span>
                                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                            Enter para agregar → especificar cantidad
                                                                        </span>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Mensaje si no hay resultados */}
                                                    {searchIngredient.trim() && filteredIngredients.length === 0 && (
                                                        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-empanada-dark border border-gray-200 dark:border-empanada-light-gray rounded-lg shadow-lg p-4 text-center text-gray-500 dark:text-gray-400">
                                                            No se encontró "{searchIngredient}"
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Ingredientes seleccionados como chips/tags editables */}
                                                {formData.recipe.length > 0 && (
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-700 dark:text-white mb-2">
                                                            Ingredientes agregados ({formData.recipe.length})
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {formData.recipe.map((recipeItem, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="inline-flex items-center gap-2 bg-empanada-golden/10 dark:bg-empanada-golden/20 border border-empanada-golden/30 rounded-lg px-3 py-2 text-sm"
                                                                >
                                                                    <span className="font-medium text-gray-800 dark:text-white">
                                                                        {recipeItem.ingredientName}
                                                                    </span>
                                                                    <input
                                                                        id={`quantity-input-${index}`}
                                                                        type="number"
                                                                        step="0.1"
                                                                        value={recipeItem.quantity}
                                                                        onChange={(e) => handleUpdateIngredientQuantity(index, e.target.value)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                // Volver al buscador después de especificar cantidad
                                                                                const searchInput = document.querySelector('input[placeholder*="Escribir ingrediente"]');
                                                                                if (searchInput) {
                                                                                    searchInput.focus();
                                                                                }
                                                                                setFocusedQuantityIndex(-1);
                                                                            }
                                                                        }}
                                                                        placeholder="0"
                                                                        className={`w-16 px-2 py-1 text-center bg-white dark:bg-empanada-medium border rounded text-xs font-medium transition-all ${
                                                                            focusedQuantityIndex === index
                                                                                ? 'border-empanada-golden ring-2 ring-empanada-golden/20'
                                                                                : 'border-gray-200 dark:border-empanada-light-gray'
                                                                        }`}
                                                                        autoFocus={focusedQuantityIndex === index}
                                                                    />
                                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                        {recipeItem.unit}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => handleRemoveIngredient(index)}
                                                                        className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                                                        title="Eliminar ingrediente"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>


                                        {/* Tiempo de preparación */}
                                        {/* <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Tiempo de Preparación (minutos)
                                            </label>
                                            <Input
                                                type="number"
                                                value={formData.preparationTime}
                                                onChange={(e) => handleInputChange('preparationTime', e.target.value)}
                                                placeholder="15"
                                                className="max-w-xs"
                                            />
                                        </div> */}
                                    </div>
                                )}

                                {/* PASO 3: IMAGEN DEL PRODUCTO (OPCIONAL) */}
                                {currentStep === 3 && (
                                    <div className="space-y-3 -mt-6">
                                        {/* Título compacto arriba */}
                                        <div className="text-center">
                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                                                <Upload className="w-4 h-4 text-empanada-golden" />
                                                Imagen (opcional)
                                            </h3>
                                        </div>

                                        {/* Contenedor principal optimizado */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
                                            {/* ImageUpload más compacto */}
                                            <div className="lg:col-span-2">
                                                <ImageUpload
                                                    value={formData.imageUrl}
                                                    onChange={(imageUrl) => {
                                                        handleInputChange('imageUrl', imageUrl || '');
                                                    }}
                                                    placeholder="Subir imagen del producto (opcional)"
                                                    className="w-full"
                                                />
                                                {errors.imageUrl && (
                                                    <p className="text-red-500 text-xs flex items-center gap-1 mt-2">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        {errors.imageUrl}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Panel informativo compacto */}
                                            <div className="space-y-3">
                                                {!formData.imageUrl ? (
                                                    <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded border border-blue-200 dark:border-blue-800">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">i</span>
                                                            <div>
                                                                <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                                                                    Sin imagen
                                                                </p>
                                                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                                                    Podrás agregarla después
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded border border-green-200 dark:border-green-800">
                                                        <div className="flex items-center gap-2">
                                                            <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                                                            <div>
                                                                <p className="text-xs font-medium text-green-900 dark:text-green-100">
                                                                    Imagen agregada
                                                                </p>
                                                                <p className="text-xs text-green-700 dark:text-green-300">
                                                                    Lista para guardar
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="bg-gray-50 dark:bg-empanada-dark p-2 rounded">
                                                    <p className="text-xs font-medium text-gray-700 dark:text-white mb-1">
                                                        💡 Tips:
                                                    </p>
                                                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                                                        <li>• Cuadrada (1:1)</li>
                                                        <li>• Min. 400x400px</li>
                                                        <li>• JPG o PNG, máx. 5MB</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* PASO 4: CONFIGURACIÓN FINAL Y RESUMEN */}
                                {currentStep === 4 && (
                                    <div className="grid grid-cols-1 gap-6">
                                        {/* Configuración de stock */}
                                        {/* <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                                Configuración de Inventario
                                            </h3>

                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                    Stock Mínimo *
                                                </label>
                                                <Input
                                                    type="number"
                                                    value={formData.minStock}
                                                    onChange={(e) => handleInputChange('minStock', e.target.value)}
                                                    placeholder="0"
                                                    className={`admin-input ${errors.minStock ? 'border-red-500' : ''}`}
                                                    disabled={isLoading}
                                                />
                                                {errors.minStock && (
                                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        {errors.minStock}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Cantidad mínima antes de mostrar advertencia de stock bajo
                                                </p>
                                            </div>

                                            <div>
                                                <label className="flex items-center gap-2 mt-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.isAvailable}
                                                        onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                                                        className="rounded border-gray-300 text-empanada-golden focus:ring-empanada-golden"
                                                        disabled={isLoading}
                                                    />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                        Disponible para venta
                                                    </span>
                                                </label>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 ml-6 mt-1">
                                                    Los clientes podrán ver y comprar este producto
                                                </p>
                                            </div>
                                        </div> */}

                                        {/* Resumen del producto */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                Resumen del Producto
                                            </h3>

                                            <div className="bg-empanada-golden/10 border border-empanada-golden/20 p-6 rounded-lg">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Nombre:</span>
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {formData.name || 'Sin especificar'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Precio:</span>
                                                        <span className="text-sm font-semibold text-empanada-golden">
                                                            ${formData.price || '0'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Categoría:</span>
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {categories.find(cat => cat.id === formData.category)?.name || 'Sin especificar'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingredientes:</span>
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {formData.recipe.length} ingredientes
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tiempo prep.:</span>
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {formData.preparationTime || '0'} min
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Imagen:</span>
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {formData.imageUrl ? '✓ Agregada' : 'Sin imagen'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Estado:</span>
                                                        <span className={`text-sm font-semibold ${
                                                            formData.isAvailable ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                            {formData.isAvailable ? 'Disponible' : 'No disponible'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {formData.recipe.length > 0 && (
                                                <div className="bg-gray-50 dark:bg-empanada-dark p-4 rounded-lg">
                                                    <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-2">
                                                        Receta ({formData.recipe.length} ingredientes)
                                                    </h4>
                                                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto">
                                                        {formData.recipe.map((item, index) => (
                                                            <div key={index} className="flex justify-between">
                                                                <span>{item.ingredientName}</span>
                                                                <span className="font-medium">{item.quantity} {item.unit}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            {/* Footer con botones */}
                            <div className="p-6 border-t border-gray-200 dark:border-empanada-light-gray bg-gray-50 dark:bg-empanada-dark">
                                <div className="flex justify-between">
                                    <div>
                                        {currentStep > 1 && (
                                            <Button
                                                variant="outline"
                                                onClick={prevStep}
                                                disabled={isLoading}
                                                className="flex items-center gap-2"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                Anterior
                                            </Button>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={handleClose}
                                            disabled={isLoading}
                                        >
                                            Cancelar
                                        </Button>

                                        {currentStep < 4 ? (
                                            <Button
                                                variant="empanada"
                                                onClick={nextStep}
                                                disabled={isLoading}
                                                className="flex items-center gap-2"
                                            >
                                                Siguiente
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="empanada"
                                                onClick={handleSave}
                                                disabled={isLoading}
                                                className="flex items-center gap-2"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                        Guardando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        Crear Producto
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </Portal>
    );
}