/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import {
    Search,
    Building2,
    Package,
    Check,
    X,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Edit,
    Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAdminData } from "@/context/AdminDataProvider";
import { toast } from "sonner";
import { useSession } from "@/context/SessionProvider";
import { SectionHeader, StatsCards, EmptyState } from "@/components/branding";
import { formatPrice } from "@/lib/utils";

export function ProductosPorSucursal() {
    const {
        productos: products,
        sucursales: stores,
        productosSucursal,
        sucursalSeleccionada: selectedStore,

        callProductosYCategoriasSucursal,
        callAsignarASucursal,
        adminDataLoading
    } = useAdminData();

    const session = useSession();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productStates, setProductStates] = useState({});

    // Función helper para obtener el estado actual de un producto
    const getProductState = (product) => {
        const localState = productStates[product.id] || {};
        return {
            ...product,
            isAvailable: localState.isAvailable !== undefined ? localState.isAvailable : product.isAvailable,
            isPopular: localState.isPopular !== undefined ? localState.isPopular : product.isPopular
        };
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

            toast.success(`Producto ${newPopularity ? 'marcado como popular' : 'removido de populares'}`);
        } catch (error) {
            console.error('Error al actualizar popularidad:', error);
            toast.error("Error al actualizar el estado de popularidad");
        }
    };

    // Filtrar productos según el término de búsqueda
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Preparar datos para los componentes
    const headerActions = [
        {
            label: "Actualizar",
            variant: "outline",
            // onClick: () => getStoreProducts(selectedStore),
            disabled: !selectedStore || adminDataLoading,
            className: "h-9 px-4 text-sm font-medium",
            icon: <RefreshCw className={`w-4 h-4 mr-2 ${adminDataLoading ? 'animate-spin' : ''}`} />
        }
    ];

    const statsData = [
        {
            id: "sucursales",
            label: "Sucursales",
            value: stores.filter(s => s.status === 'active').length,
            color: "blue",
            icon: <Building2 className="w-5 h-5" />
        },
        {
            id: "seleccionados",
            label: "Seleccionados",
            value: selectedProducts.length,
            color: "empanada-golden",
            icon: <Package className="w-5 h-5" />
        },
        {
            id: "total-productos",
            label: "Total Productos",
            value: products.length,
            color: "blue",
            icon: <Package className="w-5 h-5" />
        },
        {
            id: "vinculados",
            label: "Vinculados",
            value: productosSucursal.length,
            color: "purple",
            icon: <CheckCircle2 className="w-5 h-5" />
        }
    ];


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
            await callAsignarASucursal({
                _productosCombos: {
                    "visibleProductIds": selectedProducts,
                    "visibleComboIds": []
                },
                _idSucursal: selectedStore,
                _accessToken: session.userData.accessToken,
            })

            toast.success(`${selectedProducts.length} productos vinculados exitosamente a la sucursal`);

            // Limpiar selección
            setSelectedProducts([]);
            setSearchTerm("");

            // Actualizar lista de productos de la sucursal
            await callProductosYCategoriasSucursal(selectedStore);

            return true;
        } catch (error) {
            console.error('Error al vincular productos:', error);
            toast.error(error.response?.data?.message || "Error al vincular productos. Inténtalo de nuevo.");
            return false;
        }
    };

    // Efecto para marcar automáticamente los productos ya vinculados cuando se cargan
    useEffect(() => {
        if (productosSucursal.length > 0 && selectedStore) {
            // Only select products that are in productosSucursal
            const productosSucursalIds = productosSucursal.map(p => typeof p === "object" ? p.id : p);
            setSelectedProducts(productosSucursalIds);
        }
    }, [productosSucursal, selectedStore]);

    return (
        <div className="space-y-6 pb-24">
            {/* Header usando SectionHeader */}
            <SectionHeader
                title="Menú de sucursal"
                subtitle="Gestiona qué productos están disponibles en cada sucursal"
                icon={<Building2 className="w-6 h-6" />}
                actions={headerActions}
            />

            {/* Stats usando StatsCards */}
            <StatsCards stats={statsData} />


            {/* Card unificada con búsqueda y lista de productos */}
            {selectedStore && (
                <Card>
                    {/* Header con título y contador */}
                    <CardHeader className="pb-4">
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

                    {/* Barra de búsqueda integrada */}
                    <CardContent className="pt-0 pb-4">
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
                                {selectedProducts.length > 0 && (
                                    <Button
                                        variant="empanada"
                                        size="sm"
                                        onClick={handleUnirProductos}
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
                                                Confirmar ({selectedProducts.length})
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>

                    {/* Tabla de productos */}
                    <CardContent className="pt-0">
                        {adminDataLoading ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="text-left p-4">Producto</th>
                                            <th className="text-center p-4">Vinculado</th>
                                            <th className="text-center p-4">Seleccionar</th>
                                            <th className="text-left p-4">Descripción</th>
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
                                                    <div className="bg-gray-200 h-4 rounded w-4 mx-auto" />
                                                </td>
                                                <td className="p-4">
                                                    <div className="bg-gray-200 h-3 rounded w-full" />
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
                                            <th className="text-center p-4">Vinculado</th>
                                            <th className="text-center p-4">Seleccionar</th>
                                            <th className="text-left p-4">Descripción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product) => {
                                            const isLinked = productosSucursal.some(p => (typeof p === "object" ? p.id : p) === product.id);
                                            const isSelected = selectedProducts.includes(product.id);

                                            return (
                                                <tr 
                                                    key={product.id} 
                                                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${isSelected ? 'bg-empanada-golden/5 border-empanada-golden' : ''}`}
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
                                                                        <Package className="w-4 h-4 text-empanada-golden" />
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

                                                    {/* Columna Vinculado */}
                                                    <td className="p-4 text-center">
                                                        <Badge className={`text-xs px-3 py-1 ${isLinked 
                                                            ? 'bg-blue-500 text-white' 
                                                            : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                                        }`}>
                                                            {isLinked ? 'Vinculado' : 'No Vinculado'}
                                                        </Badge>
                                                    </td>

                                                    {/* Columna Seleccionar */}
                                                    <td className="p-4 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => handleProductSelection(product.id)}
                                                            className="w-4 h-4 text-empanada-golden bg-gray-100 border-gray-300 rounded focus:ring-empanada-golden focus:ring-2"
                                                        />
                                                    </td>

                                                    {/* Columna Descripción */}
                                                    <td className="p-4">
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                            {product.description || 'Sin descripción'}
                                                        </p>
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
            )}


            {/* Mensaje cuando no hay sucursal seleccionada usando EmptyState */}
            {!selectedStore && (
                <EmptyState
                    title="Selecciona una Sucursal"
                    message="Elige una sucursal para comenzar a gestionar sus productos"
                />
            )}
        </div>
    );
}
