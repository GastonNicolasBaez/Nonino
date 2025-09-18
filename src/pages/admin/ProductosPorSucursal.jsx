import { useState, useEffect } from "react";
import {
    Search,
    Building2,
    Package,
    Check,
    X,
    Link as LinkIcon,
    Filter,
    RefreshCw,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAdminData } from "@/context/AdminDataProvider";
import { toast } from "sonner";

export function ProductosPorSucursal() {
    const {
        productos: products,
        sucursales: stores,
        productosSucursal,
        callProductosYCategoriasSucursal,
        adminDataLoading 
    } = useAdminData();

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [selectedStore, setSelectedStore] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);

    console.log(selectedProducts);

    // Filtrar productos según el término de búsqueda
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const selectedStoreData = stores.find(store => store.id === selectedStore);

    // Efecto para mostrar/ocultar el modal de confirmación
    useEffect(() => {
        if (selectedStore && selectedProducts.length > 0) {
            setShowConfirmModal(true);
        } else {
            setShowConfirmModal(false);
        }
    }, [selectedStore, selectedProducts.length]);

    // Función wrapper para manejar la vinculación y cerrar el modal
    const handleConfirmUnirProductos = async () => {
        const success = await handleUnirProductos();
        if (success) {
            setShowConfirmModal(false);
        }
    };

    // Función para manejar la selección de productos
    const handleProductSelection = (productId) => {
        setSelectedProducts(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    // Función para seleccionar/deseleccionar todos los productos
    const handleSelectAll = (filteredProducts) => {
        if (selectedProducts.length === filteredProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(filteredProducts.map(product => product.id));
        }
    };

    // Función para unir productos a la sucursal
    const handleUnirProductos = async () => {
        if (!selectedStore) {
            toast.error("Por favor selecciona una sucursal");
            return false;
        }

        if (selectedProducts.length === 0) {
            toast.error("Por favor selecciona al menos un producto");
            return false;
        }

        try {
            // Llamada real al backend
            const response = await storeService.linkProductsToStore(selectedStore, selectedProducts);
            
            toast.success(`${selectedProducts.length} productos vinculados exitosamente a la sucursal`);
            
            // Limpiar selección
            setSelectedProducts([]);
            setSearchTerm("");
            
            // Actualizar lista de productos de la sucursal
            await getStoreProducts(selectedStore);
            
            return true;
        } catch (error) {
            console.error('Error al vincular productos:', error);
            toast.error(error.response?.data?.message || "Error al vincular productos. Inténtalo de nuevo.");
            return false;
        }
    };

    // Función para obtener productos ya vinculados a la sucursal
    const getStoreProducts = async (storeId) => {
        if (!storeId) return;
        
        try {
            // Llamada real al backend
            await callProductosYCategoriasSucursal(storeId);            
        } catch (error) {
            console.error('Error al obtener productos de la sucursal:', error);
            toast.error("Error al cargar productos de la sucursal");
        }
    };

    // Función para desvincular productos de la sucursal
    const handleDesvincularProductos = async (productIds) => {
        if (!selectedStore) {
            toast.error("Por favor selecciona una sucursal");
            return false;
        }

        try {
            const response = await storeService.unlinkProductsFromStore(selectedStore, productIds);
            
            toast.success(`${productIds.length} productos desvinculados exitosamente`);
            
            // Actualizar lista de productos de la sucursal
            await getStoreProducts(selectedStore);
            
            return true;
        } catch (error) {
            console.error('Error al desvincular productos:', error);
            toast.error(error.response?.data?.message || "Error al desvincular productos. Inténtalo de nuevo.");
            return false;
        }
    };

    // Función para actualizar disponibilidad de un producto en la sucursal
    const handleUpdateProductAvailability = async (productId, isAvailable) => {
        if (!selectedStore) {
            toast.error("Por favor selecciona una sucursal");
            return false;
        }

        try {
            const response = await storeService.updateStoreProductAvailability(selectedStore, productId, isAvailable);
            
            toast.success(`Disponibilidad del producto actualizada`);
            
            // Actualizar lista de productos de la sucursal
            await getStoreProducts(selectedStore);
            
            return true;
        } catch (error) {
            console.error('Error al actualizar disponibilidad:', error);
            toast.error(error.response?.data?.message || "Error al actualizar disponibilidad. Inténtalo de nuevo.");
            return false;
        }
    };

    // Efecto para cargar productos de la sucursal cuando se selecciona una
    useEffect(() => {
        if (selectedStore) {
            getStoreProducts(selectedStore);
            // Limpiar selección cuando cambia la sucursal
            setSelectedProducts([]);
        }
    }, [selectedStore]);

    // Efecto para marcar automáticamente los productos ya vinculados cuando se cargan
    useEffect(() => {
        if (productosSucursal.length > 0 && selectedStore) {
            // Marcar automáticamente los productos ya vinculados
            setSelectedProducts(prev => {
                const newSelection = [...prev];
                productosSucursal.forEach(productId => {
                    if (!newSelection.includes(productId)) {
                        newSelection.push(productId);
                    }
                });
                return newSelection;
            });
        }
    }, [productosSucursal, selectedStore]);

    return (
        <div className="space-y-6 pb-24">
            {/* Header - más compacto */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-empanada-golden" />
                        Productos por Sucursal
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gestiona qué productos están disponibles en cada sucursal
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => getStoreProducts(selectedStore)}
                        disabled={!selectedStore || adminDataLoading}
                        className="h-8 px-3 text-xs"
                    >
                        <RefreshCw className={`w-3 h-3 mr-1 ${adminDataLoading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                </div>
            </div>

            {/* Stats - más compactas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Sucursales</p>
                                <p className="text-xl font-bold text-green-500">
                                    {stores.filter(s => s.status === 'active').length}
                                </p>
                            </div>
                            <Building2 className="w-5 h-5 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-empanada-golden">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Seleccionados</p>
                                <p className="text-xl font-bold text-empanada-golden">
                                    {selectedProducts.length}
                                </p>
                            </div>
                            <Package className="w-5 h-5 text-empanada-golden" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Total Productos</p>
                                <p className="text-xl font-bold text-blue-500">
                                    {products.length}
                                </p>
                            </div>
                            <Package className="w-5 h-5 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Vinculados</p>
                                <p className="text-xl font-bold text-purple-500">
                                    {productosSucursal.length}
                                </p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Selector de Sucursal */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Seleccionar Sucursal
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Sucursal *
                            </label>
                            <select
                                value={selectedStore}
                                onChange={(e) => setSelectedStore(e.target.value)}
                                disabled={adminDataLoading}
                                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-empanada-golden disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">
                                    {adminDataLoading ? "Cargando sucursales..." : "Selecciona una sucursal"}
                                </option>
                                {stores.map(store => (
                                    <option key={store.id} value={store.id}>
                                        {store.name} - {store.address}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {selectedStoreData && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {selectedStoreData.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedStoreData.address}
                                        </p>
                                    </div>
                                    <Badge 
                                        variant={selectedStoreData.status === 'active' ? 'default' : 'secondary'}
                                        className={selectedStoreData.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
                                    >
                                        {selectedStoreData.status === 'active' ? 'Activa' : 'Inactiva'}
                                    </Badge>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Búsqueda y Filtros - más compacta */}
            {selectedStore && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Buscar productos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 h-9 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSelectAll(filteredProducts)}
                                    className="h-9 px-3 text-sm"
                                >
                                    {selectedProducts.length === filteredProducts.length ? (
                                        <>
                                            <X className="w-3 h-3 mr-1" />
                                            Deseleccionar Todo
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-3 h-3 mr-1" />
                                            Seleccionar Todo
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Lista de Productos */}
            {selectedStore && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between text-lg">
                            <span className="flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Productos Disponibles
                            </span>
                            <Badge variant="outline" className="text-xs">
                                {filteredProducts.length} productos
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {adminDataLoading ? (
                            <div className="space-y-2">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="flex items-center gap-3 p-2 border rounded-md">
                                            <div className="w-8 h-8 bg-gray-200 rounded" />
                                            <div className="w-10 h-10 bg-gray-200 rounded" />
                                            <div className="flex-1 space-y-1">
                                                <div className="bg-gray-200 h-3 rounded w-1/3" />
                                                <div className="bg-gray-200 h-2 rounded w-2/3" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredProducts.map((product) => {
                                    const isSelected = selectedProducts.includes(product.id);
                                    const isLinked = productosSucursal.includes(product.id);
                                    
                                    return (
                                        <div
                                            key={product.id}
                                            className={`flex items-center gap-3 p-2 border rounded-md transition-all duration-200 hover:shadow-sm cursor-pointer ${
                                                isSelected 
                                                    ? 'border-empanada-golden bg-empanada-golden/5' 
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                            }`}
                                            onClick={() => handleProductSelection(product.id)}
                                        >
                                            {/* Imagen del producto - muy pequeña */}
                                            <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                                                {product.imageUrl ? (
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-empanada-golden/10 flex items-center justify-center">
                                                        <Package className="w-3 h-3 text-empanada-golden" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Información del producto - más compacta */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-medium text-sm truncate">
                                                                {product.name}
                                                            </h3>
                                                            {isLinked && (
                                                                <Badge className="bg-green-500 text-white text-xs px-1 py-0">
                                                                    <CheckCircle2 className="w-2 h-2 mr-1" />
                                                                    Vinculado
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                            <span className="font-semibold text-empanada-golden">
                                                                ${product.price}
                                                            </span>
                                                            <span>Stock: {product.stock}</span>
                                                            {product.isAvailable ? (
                                                                <Badge className="bg-green-500 text-white text-xs px-1 py-0">
                                                                    Disponible
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-red-500 text-white text-xs px-1 py-0">
                                                                    No Disponible
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Checkbox del lado derecho */}
                                            <div className="flex items-center flex-shrink-0">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleProductSelection(product.id)}
                                                    className="w-4 h-4 text-empanada-golden bg-gray-100 border-gray-300 rounded focus:ring-empanada-golden focus:ring-2"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Botón de Confirmación - más prominente */}
            {showConfirmModal && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Card className="shadow-2xl border-2 border-empanada-golden bg-white dark:bg-gray-800">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-empanada-golden rounded-full flex items-center justify-center mb-2">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        {selectedProducts.length} productos
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-base text-gray-900 dark:text-white">
                                        Confirmar Vinculación
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Vincular productos a <span className="font-semibold text-empanada-golden">{selectedStoreData?.name}</span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedProducts([]);
                                            setSearchTerm("");
                                            setShowConfirmModal(false);
                                        }}
                                        disabled={adminDataLoading}
                                        className="h-9 px-3"
                                    >
                                        <X className="w-3 h-3 mr-1" />
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="empanada"
                                        size="sm"
                                        onClick={handleConfirmUnirProductos}
                                        disabled={adminDataLoading}
                                        className="h-9 px-4 font-semibold"
                                    >
                                        {adminDataLoading ? (
                                            <>
                                                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Confirmar
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Mensaje cuando no hay sucursal seleccionada */}
            {!selectedStore && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            Selecciona una Sucursal
                        </h3>
                        <p className="text-gray-500 dark:text-gray-500">
                            Elige una sucursal para comenzar a gestionar sus productos
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
