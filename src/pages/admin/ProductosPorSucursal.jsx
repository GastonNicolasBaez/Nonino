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
    CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAdminData } from "@/context/AdminDataProvider";
import { toast } from "sonner";
import { useSession } from "@/context/SessionProvider";
import { SectionHeader, StatsCards, EmptyState } from "@/components/branding";

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
            onClick: () => getStoreProducts(selectedStore),
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
            color: "green",
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

    // Efecto para cargar productos de la sucursal cuando se selecciona una
    useEffect(() => {
        if (selectedStore && selectedStore != '') {
            getStoreProducts(selectedStore);
            // Limpiar selección cuando cambia la sucursal
            setSelectedProducts([]);
        }
    }, [selectedStore]);

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
                title="Productos por Sucursal"
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

                    {/* Lista de productos integrada */}
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
                                    const isLinked = productosSucursal.some(p => (typeof p === "object" ? p.id : p) === product.id);

                                    return (
                                        <div
                                            key={product.id}
                                            className={`flex items-center gap-3 p-2 border rounded-md transition-all duration-200 hover:shadow-sm cursor-pointer ${isSelected
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
                                                                <Badge className="bg-blue-500 text-white text-xs px-1 py-0">
                                                                    <CheckCircle2 className="w-2 h-2 mr-1" />
                                                                    Vinculado
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                            <span className="font-semibold text-empanada-golden">
                                                                ${product.price}
                                                            </span>
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
