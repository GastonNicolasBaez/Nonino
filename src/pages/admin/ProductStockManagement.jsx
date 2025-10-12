/* eslint-disable react-hooks/exhaustive-deps */

// CORE
import { useState, useEffect } from "react";

// EXTERNO
import { toast } from "sonner";

// COMPONENTES
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Portal } from "@/components/common/Portal";
import { SectionHeader, StatsCards, CustomSelect, EmptyState } from "@/components/branding";
import { useConfirmModal } from "@/components/common/ConfirmModal";
import { useUpdateStockModal } from "@/components/common/UpdateStockModal";

// ICONOS
import {
    Search,
    Edit,
    Trash2,
    AlertTriangle,
    ShoppingCart,
    Boxes,
    RefreshCcw,
    BarChart,
    Filter,
    Plus,
    DollarSign
} from "lucide-react";

// PROVIDERS
import { useAdminData } from "@/context/AdminDataProvider";

// UTILIDADES
import { formatPrice } from "@/lib/utils";
import { useSession } from "@/context/SessionProvider";

export function ProductStockManagement() {
    const {
        inventarioProductosSucursal: products,
        sucursalSeleccionada: selectedStore,
        adminDataLoading: loading,
        categoriasTodas,
        
    } = useAdminData();

    const session = useSession();

    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    // Hooks para modales
    const { openModal: openConfirmModal, ConfirmModalComponent } = useConfirmModal();
    const { openModal: openStockModal, UpdateStockModalComponent } = useUpdateStockModal();

    // Opciones para filtros
    const categoryFilterOptions = categoriasTodas.map((c) => ({
        value: c.id,
        label: c.name
    }));

    // Filtrar productos
    const filteredProducts = products.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

    //   const handleDeleteProduct = (productId) => {
    //     openConfirmModal({
    //       title: "Eliminar Producto",
    //       message: "¿Estás seguro de que quieres eliminar este producto del inventario?",
    //       type: "danger",
    //       confirmText: "Eliminar",
    //       onConfirm: () => {
    //         setProducts(prev => prev.filter(item => item.id !== productId));
    //         toast.success("Producto eliminado correctamente");
    //       }
    //     });
    //   };

    //   const handleUpdateProductStock = (productId, currentStock) => {
    //     openStockModal({
    //       title: "Actualizar Stock de Producto",
    //       currentStock,
    //       onConfirm: (newStock) => {
    //         setProducts(prev => prev.map(item =>
    //           item.id === productId
    //             ? {
    //                 ...item,
    //                 currentStock: newStock,
    //                 status: newStock <= item.minStock ? 'low' : 'good',
    //                 lastUpdated: new Date().toISOString()
    //               }
    //             : item
    //         ));
    //         toast.success("Stock de producto actualizado correctamente");
    //       }
    //     });
    //   };

    // Preparar datos para StatsCards
    const statsData = [
        // Cards críticas primero (solo si tienen valor > 0)
        ...(products.filter(item => item.status === 'low').length > 0 ? [{
            id: "stock-bajo",
            label: "Stock Bajo",
            value: products.filter(item => item.status === 'low').length,
            color: "red",
            icon: <AlertTriangle className="w-5 h-5" />
        }] : []),

        // Cards neutras después
        {
            id: "total-productos",
            label: "Total Productos",
            value: products.length,
            color: "gray",
            icon: <ShoppingCart className="w-5 h-5" />
        },
        {
            id: "valor-inventario",
            label: "Valor Inventario",
            value: formatPrice(products.reduce((sum, item) => sum + (item.currentStock * item.cost), 0)),
            color: "gray",
            icon: <BarChart className="w-5 h-5" />
        },
        {
            id: "valor-venta",
            label: "Valor de Venta",
            value: formatPrice(products.reduce((sum, item) => sum + (item.currentStock * item.price), 0)),
            color: "gray",
            icon: <DollarSign className="w-5 h-5" />
        }
    ];

    // Preparar datos para SectionHeader
    const headerActions = [
        {
            label: "Ingresar",
            variant: "outline",
            className: "h-9 px-4 text-sm font-medium",
            onClick: () => {
                toast.info("Actualizando stock de materiales...");
                // Aquí se llamaría a la función de actualización
            },
            icon: <Plus className="w-4 h-4 mr-2" />
        },
        {
            label: "Actualizar Stock",
            variant: "empanada",
            className: "h-9 px-4 text-sm font-medium",
            onClick: () => {
                
            },
            icon: <RefreshCcw className="w-4 h-4 mr-2" />
        }
    ];

    const getStatusClasses = (status) => {
        switch (status) {
            case 'low': return 'status-badge status-badge-danger';
            case 'good': return 'status-badge status-badge-success';
            case 'warning': return 'status-badge status-badge-warning';
            default: return 'status-badge status-badge-info';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'low': return 'Stock Bajo';
            case 'good': return 'Stock Normal';
            case 'warning': return 'Stock Crítico';
            default: return 'Estado Desconocido';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header usando SectionHeader */}
            <SectionHeader
                title="Stock de Productos"
                subtitle={`Gestiona el inventario de productos terminados${selectedStore ? ` - ${selectedStore}` : ''}`}
                icon={<ShoppingCart className="w-6 h-6" />}
                actions={headerActions}
            />

            {/* Stats usando StatsCards */}
            <StatsCards stats={statsData} />

            {/* Mensaje cuando no hay sucursal seleccionada */}
            {!selectedStore && (
                <EmptyState
                    title="Selecciona una Sucursal"
                    subtitle="Elige una sucursal para comenzar a gestionar sus productos"
                />
            )}

            {/* Tabla de Productos */}
            {selectedStore && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Inventario de Productos ({filteredProducts.length} productos)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Barra de búsqueda integrada */}
                        <div className="mb-6">
                            <div className="flex gap-4 items-center">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Buscar productos por nombre o categoría..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
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
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-gray-200 h-16 rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">
                                    {searchTerm || categoryFilter !== "all" ? 'No se encontraron productos' : 'No hay productos'}
                                </h3>
                                <p className="text-muted-foreground">
                                    {searchTerm || categoryFilter !== "all"
                                        ? 'Intenta con otros filtros de búsqueda'
                                        : 'Los productos aparecerán aquí cuando se agreguen'
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-4 font-medium">Producto</th>
                                            <th className="text-left p-4 font-medium">Stock</th>
                                            <th className="text-left p-4 font-medium">Categoría</th>                                            
                                            {/* <th className="text-left p-4 font-medium">Stock Mín.</th>
                                            <th className="text-left p-4 font-medium">Costo</th> */}
                                            <th className="text-left p-4 font-medium">Precio</th>
                                            {/* <th className="text-left p-4 font-medium">Margen</th>
                                            <th className="text-left p-4 font-medium">Estado</th>
                                            <th className="text-left p-2 font-medium w-24 min-w-24">Acciones</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((item) => {
                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="border-b admin-table-row"
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                                {item.imageUrl ? (
                                                                    <img
                                                                        src={item.imageUrl}
                                                                        alt={item.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <Boxes className="w-4 h-4 text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{item.name}</p>
                                                                <p className="text-sm text-muted-foreground">{item.unit}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{item.quantity}</span>
                                                            {/* <span className="text-sm text-muted-foreground">{item.unit}</span> */}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge variant="outline">{item.categoryName}</Badge>
                                                    </td>
                                                    {/* <td className="p-4">
                                                        <span className="text-sm">{item.minStock} {item.unit}</span>
                                                    </td> */}
                                                    {/* <td className="p-4">
                                                        <span className="font-medium">{formatPrice(item.cost)}</span>
                                                        <span className="text-sm text-muted-foreground">/{item.unit}</span>
                                                    </td> */}
                                                    <td className="p-4">
                                                        <span className="font-medium text-empanada-golden">{formatPrice(item.price)}</span>
                                                    </td>
                                                    {/* <td className="p-4">
                                                        <span className={`text-sm font-medium ${margin > 30 ? 'text-green-600' : margin > 15 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                            {margin}%
                                                        </span>
                                                    </td> */}
                                                    {/* <td className="p-4">
                                                        <div className={getStatusClasses(item.status)}>
                                                            {getStatusText(item.status)}
                                                        </div>
                                                    </td> */}
                                                    {/* <td className="p-2 w-24 min-w-24">
                                                        <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateProductStock(item.id, item.currentStock)}
                              className="p-2 min-w-8 h-8"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProduct(item.id)}
                              className="p-2 min-w-8 h-8"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                                                    </td> */}
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

            {/* Modales */}
            <ConfirmModalComponent />
            <UpdateStockModalComponent />
        </div>
    );
}

