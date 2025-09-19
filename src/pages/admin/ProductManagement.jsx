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

// ICONOS
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Package,
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
import { SectionHeader, StatsCards, CustomSelect } from "@/components/branding";

// ------------------ IMPORT ------------------ //
// ------------------ CODE   ------------------ //

export function ProductManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("-1");
    //   const [products, setProducts] = useState([]);
    //   const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

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

    const productStats = {
        total: products.length,
        available: products.filter(p => p.isAvailable).length,
        outOfStock: products.filter(p => !p.isAvailable || (p.stock || 0) <= 0).length,
        lowStock: products.filter(p => (p.stock || 0) <= (p.minStock || 10) && (p.stock || 0) > 0).length,
        popular: products.filter(p => p.isPopular).length,
        totalValue: products.reduce((sum, p) => sum + ((p.stock || 0) * (p.price || 0)), 0),
        totalRevenue: products.reduce((sum, p) => sum + ((p.sales || 0) * (p.price || 0)), 0),
        averageRating: products.length > 0 ? products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length : 0
    };

    const toggleAvailability = (productId) => {
        // TODO: Implementar llamada al backend para actualizar disponibilidad
        toast.success("Estado del producto actualizado");
    };

    const togglePopular = (productId) => {
        // TODO: Implementar llamada al backend para actualizar popularidad
        toast.success("Estado de popularidad actualizado");
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
            size: "sm",
            onClick: () => setShowAddModal(true),
            icon: <Plus className="w-4 h-4 mr-2" />
        },
        {
            label: "Actualizar",
            onClick: () => {
                toast.info("Actualizando productos...");
                // Aquí se llamaría a la función de actualización
            },
            className: "h-8 px-3 text-xs",
            icon: <RefreshCw className="w-3 h-3 mr-1" />
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
            <Portal>
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999999] flex items-center justify-center p-4">
                    <div className="w-full max-w-7xl h-[95vh] flex flex-col">
                        <Card className="shadow-2xl h-full flex flex-col ">
                            {/* Header */}
                            <CardHeader className="pb-4 flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {product ? "Editar Producto" : "Nuevo Producto"}
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {product ? "Modifica los detalles del producto" : "Agrega un nuevo producto al catálogo"}
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                            </CardHeader>

                            {/* Content */}
                            <CardContent className="flex-1 overflow-y-auto space-y-6 px-6 py-6">
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
                            </CardContent>

                            {/* Footer */}
                            <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                <div className="flex justify-end gap-3">
                                    <Button variant="outline" onClick={onClose} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                                        Cancelar
                                    </Button>
                                    <Button variant="empanada" onClick={handleSave}>
                                        <Save className="w-4 h-4 mr-2" />
                                        {product ? "Actualizar" : "Crear"} Producto
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Portal>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header usando SectionHeader */}
            <SectionHeader
                title="Gestión de Productos"
                subtitle="Administra tu catálogo de empanadas y productos"
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
                    Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <div className="bg-gray-200 h-4 rounded w-1/3" />
                                        <div className="bg-gray-200 h-3 rounded w-2/3" />
                                        <div className="bg-gray-200 h-3 rounded w-1/2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    filteredProducts.map((product) => {
                        const priority = calculatePriority(product);
                        const getPriorityColor = (priority) => {
                            if (priority >= 7) return "border-l-red-500 bg-red-50 dark:bg-red-950/20";
                            if (priority >= 5) return "border-l-red-400 bg-red-50/50 dark:bg-red-950/10";
                            if (priority >= 3) return "border-l-orange-400 bg-orange-50/50 dark:bg-orange-950/10";
                            if (priority >= 2) return "border-l-yellow-400 bg-yellow-50 dark:bg-yellow-950/10";
                            return "border-l-gray-200 dark:border-l-gray-700";
                        };

                        const getPriorityBadge = (priority) => {
                            if (priority >= 7) return { text: "CRÍTICO", color: "bg-red-500 text-white" };
                            if (priority >= 5) return { text: "SIN STOCK", color: "bg-red-400 text-white" };
                            if (priority >= 3) return { text: "BAJO", color: "bg-orange-400 text-white" };
                            if (priority >= 2) return { text: "POPULAR", color: "bg-yellow-400 text-black" };
                            return { text: "NORMAL", color: "bg-gray-400 text-white" };
                        };

                        const priorityInfo = getPriorityBadge(priority);

                        return (
                            <Card 
                                key={product.id} 
                                className={`hover:shadow-md transition-all duration-200 border-l-4 ${getPriorityColor(priority)}`}
                            >
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-3">
                                        {/* Estados del producto - más a la izquierda */}
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => toggleAvailability(product.id)}
                                                title={product.isAvailable ? "Producto disponible" : "Producto oculto"}
                                            >
                                                {product.isAvailable ?
                                                    <Eye className="w-3 h-3 text-green-500" /> :
                                                    <EyeOff className="w-3 h-3 text-red-500" />
                                                }
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => togglePopular(product.id)}
                                                title={product.isPopular ? "Producto popular" : "Marcar como popular"}
                                            >
                                                <Star
                                                    className={`w-3 h-3 ${product.isPopular ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                                                />
                                            </Button>
                                        </div>

                                        {/* Imagen compacta */}
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

                                        {/* Información principal compacta */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium text-base truncate">{product.name}</h3>
                                                    <Badge className={`text-xs px-2 py-0.5 ${priorityInfo.color}`}>
                                                        {priorityInfo.text}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Información esencial en una línea */}
                                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-4">
                                                    <span>{product.categoryName}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold text-empanada-golden">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-7 px-2 text-xs"
                                                            onClick={() => setEditingProduct(product)}
                                                        >
                                                            <Edit className="w-3 h-3 mr-1" />
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-7 px-2 text-xs"
                                                            onClick={() => handleUpdateStock(product.id)}
                                                        >
                                                            <Package className="w-3 h-3 mr-1" />
                                                            Stock
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-7 px-2 text-xs text-red-500 hover:text-red-700"
                                                            onClick={() => deleteProduct(product.id)}
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </CardContent>
        </Card>

        {/* Modals */}
            {showAddModal && (
                <ProductModal
                    onClose={() => setShowAddModal(false)}
                />
            )}
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