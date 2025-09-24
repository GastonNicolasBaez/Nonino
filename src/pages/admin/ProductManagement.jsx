/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

// CORE
import { useState } from "react";

// EXTERNO
import { toast } from "sonner";

// COMPONENTES
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/image-upload";
import { Portal } from "@/components/common/Portal";
import { useConfirmModal } from "@/components/common/ConfirmModal";
import { useUpdateStockModal } from "@/components/common/UpdateStockModal";
import { AddProductModal } from "@/components/admin/AddProductModal";

// ICONOS
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Package,
    CookingPot,
    Eye,
    EyeOff,
    Star,
    Clock,
    DollarSign,
    BarChart3,
    Filter,
    Upload,
    Download,
    MoreVertical,
    X,
    Save,
    RefreshCw
} from "lucide-react";

// PROVIDERS
import { useAdminData } from "@/context/AdminDataProvider";
import { useSession } from "@/context/SessionProvider";

// UTILIDADES Y SERVICIOS
import { formatPrice } from "@/lib/utils";
import { generateProductsReportPDF, downloadPDF } from "@/services/pdfService";
import { SectionHeader, StatsCards, CustomSelect, BrandedModal, BrandedModalFooter } from "@/components/branding";

// ------------------ IMPORT ------------------ //
// ------------------ CODE   ------------------ //

export function ProductManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("-1");
    //   const [products, setProducts] = useState([]);
    //   const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productStates, setProductStates] = useState({});

    const session = useSession();
    const {
        productos: products,
        categorias: categories,
        adminDataLoading: loading,

        callProductosYCategorias,
        callProductoNuevo,
        callBorrarProducto,
        callModificarProducto,
    } = useAdminData();

    const categoriasTodas = [
        { "id": "1", "name": "Empanadas" },
        { "id": "2", "name": "Bebidas" },
        { "id": "3", "name": "Promociones" },
    ]

    // Opciones para CustomSelect
    const categoryOptions = categoriasTodas.map(category => ({
        value: category.id,
        label: category.name
    }));

    const categoryFilterOptions = [
        { value: "-1", label: "Todo" },
        ...categories.map(category => ({
            value: category.id,
            label: category.name
        }))
    ];

    // Hooks para modales
    const { openModal: openConfirmModal, ConfirmModalComponent } = useConfirmModal();
    const { openModal: openStockModal, UpdateStockModalComponent } = useUpdateStockModal();

    // Función para calcular la prioridad del producto
    const calculatePriority = (product) => {
        let priority = 0;
        
        // Stock bajo = alta prioridad (usando un valor mínimo por defecto de 10)
        const minStock = product.minStock || 10;
        if (product.stock <= minStock && product.stock > 0) {
            priority += 3;
        }
        
        // Sin stock = máxima prioridad
        if (product.stock <= 0) {
            priority += 5;
        }
        
        // Producto popular = prioridad adicional
        if (product.isPopular) {
            priority += 2;
        }
        
        // No disponible = prioridad alta
        if (!product.isAvailable) {
            priority += 1;
        }
        
        return priority;
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === '-1' || product.category == categoryFilter;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        // Ordenar por prioridad (mayor a menor)
        const priorityA = calculatePriority(a);
        const priorityB = calculatePriority(b);
        
        if (priorityA !== priorityB) {
            return priorityB - priorityA;
        }
        
        // Si tienen la misma prioridad, ordenar por nombre
        return a.name.localeCompare(b.name);
    });

    // Función helper para obtener el estado actual de un producto
    const getProductState = (product) => {
        const localState = productStates[product.id] || {};
        return {
            ...product,
            isAvailable: localState.isAvailable !== undefined ? localState.isAvailable : product.isAvailable,
            isPopular: localState.isPopular !== undefined ? localState.isPopular : product.isPopular
        };
    };

    const productStats = {
        total: products.length,
        available: products.filter(p => getProductState(p).isAvailable).length,
        outOfStock: products.filter(p => !getProductState(p).isAvailable || (p.stock || 0) <= 0).length,
        lowStock: products.filter(p => (p.stock || 0) <= (p.minStock || 10) && (p.stock || 0) > 0).length,
        popular: products.filter(p => getProductState(p).isPopular).length,
        totalValue: products.reduce((sum, p) => sum + ((p.stock || 0) * (p.price || 0)), 0),
        totalRevenue: products.reduce((sum, p) => sum + ((p.sales || 0) * (p.price || 0)), 0),
        averageRating: products.length > 0 ? products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length : 0
    };

    const toggleAvailability = async (productId) => {
        try {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            // Obtener el estado actual del producto
            const currentProduct = getProductState(product);
            const newAvailability = !currentProduct.isAvailable;

            // Actualizar el estado local inmediatamente
            setProductStates(prev => ({
                ...prev,
                [productId]: {
                    ...prev[productId],
                    isAvailable: newAvailability
                }
            }));

            // TODO: Implementar llamada al backend para actualizar disponibilidad
            // await callModificarProducto({
            //     _producto: {
            //         ...product,
            //         isAvailable: newAvailability
            //     },
            //     _accessToken: session.userData.accessToken,
            // });

            toast.success(`Producto ${newAvailability ? 'disponible' : 'no disponible'}`);
        } catch (error) {
            console.error('Error al actualizar disponibilidad:', error);
            toast.error("Error al actualizar el estado del producto");
        }
    };

    const togglePopular = async (productId) => {
        try {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            // Obtener el estado actual del producto
            const currentProduct = getProductState(product);
            const newPopularity = !currentProduct.isPopular;

            // Actualizar el estado local inmediatamente
            setProductStates(prev => ({
                ...prev,
                [productId]: {
                    ...prev[productId],
                    isPopular: newPopularity
                }
            }));

            // TODO: Implementar llamada al backend para actualizar popularidad
            // await callModificarProducto({
            //     _producto: {
            //         ...product,
            //         isPopular: newPopularity
            //     },
            //     _accessToken: session.userData.accessToken,
            // });

            toast.success(`Producto ${newPopularity ? 'marcado como popular' : 'removido de populares'}`);
        } catch (error) {
            console.error('Error al actualizar popularidad:', error);
            toast.error("Error al actualizar el estado de popularidad");
        }
    };

    // ACTUALIZADO
    const deleteProduct = (productId) => {
        const product = products.find(p => p.id === productId);
        openConfirmModal({
            title: "Eliminar Producto",
            message: `¿Estás seguro de que quieres eliminar "${product?.name}"? Esta acción no se puede deshacer.`,
            confirmText: "Eliminar",
            cancelText: "Cancelar",
            type: "danger",
            onConfirm: async () => {
                await callBorrarProducto({ _id: productId, _accessToken: session.userData.accessToken });
                callProductosYCategorias(session.userData.accessToken);
                toast.success("Producto eliminado correctamente");
            }
        });
    };

    const updateStock = (productId, newStock) => {
        // TODO: Implementar llamada al backend para actualizar stock
        toast.success("Stock actualizado correctamente");
    };

    // Función para manejar el guardado del nuevo producto desde el modal de pasos
    const handleSaveProduct = async (productData) => {
        try {
            const adaptedProduct = {
                "sku": productData.sku || `SKU-${Date.now()}`,
                "name": productData.name,
                "description": productData.description,
                "basePrice": productData.price,
                "active": productData.isAvailable,
                "categoryId": productData.category,
                "imageBase64": productData.imageUrl,
                // Campos adicionales del modal de pasos
                "recipe": productData.recipe,
                "preparationTime": productData.preparationTime,
                "minStock": productData.minStock
            };

            await callProductoNuevo({
                _producto: adaptedProduct,
                _accessToken: session.userData.accessToken
            });

            toast.success("Producto creado correctamente");
            callProductosYCategorias(session.userData.accessToken);
            setShowAddModal(false);
        } catch (error) {
            console.error('Error al crear producto:', error);
            toast.error(error.message || "Error al crear el producto");
        }
    };

    const handleExportProducts = () => {
        try {
            const stats = {
                total: productStats.total,
                available: productStats.available,
                outOfStock: productStats.outOfStock,
                lowStock: productStats.lowStock
            };

            const doc = generateProductsReportPDF(filteredProducts, stats);
            const filename = `reporte-productos-${new Date().toISOString().split('T')[0]}.pdf`;
            downloadPDF(doc, filename);

            toast.success('Reporte de productos exportado correctamente');
        } catch (error) {
            console.error('Error generando PDF:', error);
            toast.error('Error al generar el PDF. Inténtalo de nuevo.');
        }
    };

    const handleImportProducts = () => {
        toast.info("Funcionalidad de importación próximamente");
    };

    const handleUpdateStock = (productId) => {
        const product = products.find(p => p.id === productId);
        openStockModal({
            productName: product?.name || 'Producto',
            currentStock: product?.stock || 0,
            onSave: (newStock) => {
                updateStock(productId, newStock);
            }
        });
    };

    // Preparar datos para StatsCards - críticas primero, resto neutras
    const statsData = [
        // Cards críticas primero (solo si tienen valor > 0)
        ...(productStats.lowStock > 0 ? [{
            id: "stock-bajo",
            label: "Stock Bajo",
            value: productStats.lowStock,
            color: "red",
            icon: <BarChart3 className="w-5 h-5" />
        }] : []),
        
        // Cards neutras después
        {
            id: "total-productos",
            label: "Total Productos",
            value: productStats.total,
            color: "gray",
            icon: <Package className="w-5 h-5" />
        },
        {
            id: "disponibles",
            label: "Disponibles",
            value: productStats.available,
            color: "gray",
            icon: <Eye className="w-5 h-5" />
        },
        {
            id: "ingresos-totales",
            label: "Ingresos Totales",
            value: formatPrice(productStats.totalRevenue),
            color: "gray",
            icon: <DollarSign className="w-5 h-5" />
        }
    ];

    // Preparar datos para SectionHeader
    const headerActions = [
        {
            label: "Nuevo Producto",
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
                toast.info("Actualizando productos...");
                // Aquí se llamaría a la función de actualización
            },
            icon: <RefreshCw className="w-4 h-4 mr-2" />
        }
    ];

    // ProductModal component definition (moved inside the main component)
    const ProductModal = ({ product, onClose }) => {
        const [formData, setFormData] = useState(product || {
            name: "",
            description: "",
            category: 1,
            price: 0,
            cost: 0,
            stock: 0,
            minStock: 0,
            preparationTime: 0,
            isAvailable: true,
            isPopular: false,
            ingredients: [],
            allergens: [],
            imageUrl: ""
        });

        const handleSave = async () => {
            try {
                const adaptedProduct = {
                    "sku": "SKU-" + Math.floor(Math.random() * (9999999 - 1000000) + 1000000),
                    "name": formData.name,
                    "description": formData.description,
                    "basePrice": formData.price,
                    "active": formData.isAvailable,
                    "categoryId": formData.category,
                    "imageBase64": formData.imageUrl,
                }

                if (product) {
                    // EDITAR EXISTENTE
                    const updateProduct = {
                        ...adaptedProduct,
                        "id": product.id,
                    }
                    await callModificarProducto({
                        _producto: updateProduct,
                        _accessToken: session.userData.accessToken,
                    });
                    toast.success("Producto actualizado correctamente");
                    callProductosYCategorias(session.userData.accessToken);
                } else {
                    // CREAR NUEVO
                    await callProductoNuevo({
                        _producto: adaptedProduct,
                        _accessToken: session.userData.accessToken
                    });
                    toast.success("Producto creado correctamente");
                    callProductosYCategorias(session.userData.accessToken);
                }
                onClose();
            } catch (error) {
                console.error('Error al guardar producto:', error);
                toast.error(error.message || "Error al guardar el producto");
            }
        };

        return (
            <BrandedModal
                isOpen={true}
                onClose={onClose}
                title={product ? "Editar Producto" : "Nuevo Producto"}
                subtitle={product ? "Modifica los detalles del producto" : "Agrega un nuevo producto al catálogo"}
                icon={<Package className="w-5 h-5" />}
                maxWidth="max-w-7xl"
                maxHeight="max-h-[95vh]"
                footer={
                    <BrandedModalFooter
                        onCancel={onClose}
                        onConfirm={handleSave}
                        cancelText="Cancelar"
                        confirmText={product ? "Actualizar Producto" : "Crear Producto"}
                        confirmIcon={<Save className="w-4 h-4" />}
                        isConfirmDisabled={!formData.name.trim()}
                    />
                }
            >
                <div className="space-y-6">
                    {/* Información Básica */}
                    <Card className="">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                            <Package className="w-5 h-5" />
                                            Información Básica
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Nombre *</label>
                                                <Input
                                                    value={formData.name}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                    placeholder="Nombre del producto"
                                                    className="admin-input"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Categoría *</label>
                                                <CustomSelect
                                                    value={formData.category}
                                                    onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                                                    options={categoryOptions}
                                                    placeholder="Seleccionar categoría"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Precio *</label>
                                                <Input
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                                                    placeholder="Precio de venta"
                                                    className="admin-input"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Costo</label>
                                                <Input
                                                    type="number"
                                                    value={formData.cost}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
                                                    placeholder="Costo de producción"
                                                    className="admin-input"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Descripción</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                placeholder="Descripción del producto..."
                                                className="w-full h-24 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-empanada-golden resize-none"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Imagen del Producto */}
                                <Card className="">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                            <Upload className="w-5 h-5" />
                                            Imagen del Producto
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="w-full">
                                            <ImageUpload
                                                value={formData.imageUrl}
                                                onChange={(imageUrl) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        imageUrl: imageUrl || ""
                                                    }));
                                                }}
                                                placeholder="Subir imagen del producto"
                                                className="w-full"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                                            La imagen se procesará automáticamente para optimizar la carga y visualización
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Inventario y Disponibilidad */}
                                <Card className="">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                            <Package className="w-5 h-5" />
                                            Inventario y Disponibilidad
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Stock Actual</label>
                                                <Input
                                                    type="number"
                                                    value={formData.stock}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                                                    placeholder="Cantidad en stock"
                                                    className="admin-input"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Stock Mínimo</label>
                                                <Input
                                                    type="number"
                                                    value={formData.minStock}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                                                    placeholder="Stock mínimo"
                                                    className="admin-input"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tiempo de Preparación (min)</label>
                                                <Input
                                                    type="number"
                                                    value={formData.preparationTime}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: Number(e.target.value) }))}
                                                    placeholder="Minutos"
                                                    className="admin-input"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4 flex gap-4">
                                            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isAvailable}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                                                    className="rounded border-gray-300 dark:border-gray-600"
                                                />
                                                Disponible para venta
                                            </label>
                                            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isPopular}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                                                    className="rounded border-gray-300 dark:border-gray-600"
                                                />
                                                Producto popular
                                            </label>
                                        </div>
                                    </CardContent>
                                </Card>

                </div>
            </BrandedModal>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header usando SectionHeader */}
            <SectionHeader
                title="Gestión de Productos"
                subtitle="Administra tu catálogo de empanadas y productos"
                icon={<CookingPot className="w-6 h-6" />}
                actions={headerActions}
            />

            {/* Stats usando StatsCards */}
            <StatsCards stats={statsData} />

            {/* Products List con búsqueda integrada */}
            <Card className="">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Productos ({filteredProducts.length} productos)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Barra de búsqueda integrada */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Buscar productos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="w-48">
                                <CustomSelect
                                    value={categoryFilter}
                                    onChange={setCategoryFilter}
                                    options={categoryFilterOptions}
                                    placeholder="Filtrar por categoría"
                                />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="text-left p-4">Producto</th>
                                        <th className="text-center p-4">Disponible</th>
                                        <th className="text-center p-4">Popular</th>
                                        <th className="text-right p-4">Precio</th>
                                        <th className="text-center p-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <tr key={i} className="border-b border-gray-200 dark:border-gray-700 animate-pulse">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-md" />
                                                    <div className="space-y-2">
                                                        <div className="bg-gray-200 h-4 rounded w-32" />
                                                        <div className="bg-gray-200 h-3 rounded w-20" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="bg-gray-200 h-6 rounded w-16 mx-auto" />
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="bg-gray-200 h-6 rounded w-16 mx-auto" />
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="bg-gray-200 h-4 rounded w-20 ml-auto" />
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    <div className="bg-gray-200 h-8 rounded w-16" />
                                                    <div className="bg-gray-200 h-8 rounded w-16" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="text-left p-4">Producto</th>
                                        <th className="text-center p-4">Disponible</th>
                                        <th className="text-center p-4">Popular</th>
                                        <th className="text-right p-4">Precio</th>
                                        <th className="text-center p-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => {
                                        const currentProduct = getProductState(product);
                                        const priority = calculatePriority(currentProduct);
                                        const getPriorityColor = (priority) => {
                                            if (priority >= 7) return "bg-red-50 dark:bg-red-950/20";
                                            if (priority >= 5) return "bg-red-50/50 dark:bg-red-950/10";
                                            if (priority >= 3) return "bg-orange-50/50 dark:bg-orange-950/10";
                                            if (priority >= 2) return "bg-yellow-50 dark:bg-yellow-950/10";
                                            return "";
                                        };

                                        return (
                                            <tr 
                                                key={product.id} 
                                                className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${getPriorityColor(priority)}`}
                                            >
                                                {/* Columna Producto */}
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {/* Imagen del producto */}
                                                        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                                            {product.imageUrl ? (
                                                                <img
                                                                    src={product.imageUrl}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-empanada-golden/10 flex items-center justify-center">
                                                                    <span className="text-lg">{product.icon || "🥟"}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Información del producto */}
                                                        <div className="min-w-0">
                                                            <h3 className="font-medium text-base text-gray-900 dark:text-white truncate">
                                                                {product.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                                {product.categoryName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Columna Disponible */}
                                                <td className="p-4 text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={`h-8 w-24 text-xs font-medium rounded-full transition-colors duration-200 ${
                                                            currentProduct.isAvailable 
                                                                ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300' 
                                                                : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300'
                                                        }`}
                                                        onClick={() => toggleAvailability(product.id)}
                                                    >
                                                        {currentProduct.isAvailable ? 'Disponible' : 'No Disponible'}
                                                    </Button>
                                                </td>

                                                {/* Columna Popular */}
                                                <td className="p-4 text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={`h-8 w-20 text-xs font-medium rounded-full transition-colors duration-200 ${
                                                            currentProduct.isPopular 
                                                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300' 
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                                                        }`}
                                                        onClick={() => togglePopular(product.id)}
                                                    >
                                                        {currentProduct.isPopular ? 'Popular' : 'Normal'}
                                                    </Button>
                                                </td>

                                                {/* Columna Precio */}
                                                <td className="p-4 text-right">
                                                    <span className="font-semibold text-empanada-golden text-base">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                </td>

                                                {/* Columna Acciones */}
                                                <td className="p-4 text-center">
                                                    <div className="flex gap-2 justify-center">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 px-3 text-xs"
                                                            onClick={() => setEditingProduct(product)}
                                                        >
                                                            <Edit className="w-3 h-3 mr-1" />
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 px-3 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => deleteProduct(product.id)}
                                                        >
                                                            <Trash2 className="w-3 h-3 mr-1" />
                                                            Borrar
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
            </CardContent>
        </Card>

        {/* Modals */}
            <AddProductModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleSaveProduct}
                categories={categories}
            />

            {/* ProductModal para editar */}
            {editingProduct && (
                <ProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                />
            )}

            {/* Modal Components */}
            <ConfirmModalComponent />
            <UpdateStockModalComponent />
        </div>
    );
}