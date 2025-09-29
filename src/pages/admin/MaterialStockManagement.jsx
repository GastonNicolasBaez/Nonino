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
  Package,
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

export function MaterialStockManagement() {
  const { 
    inventarioMaterialesSucursal: materials,
    sucursalSeleccionada: selectedStore,
    adminDataLoading: loading,
 } = useAdminData();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Hooks para modales
  const { openModal: openConfirmModal, ConfirmModalComponent } = useConfirmModal();
  const { openModal: openStockModal, UpdateStockModalComponent } = useUpdateStockModal();

  // Opciones para filtros
  const categoryFilterOptions = [
    { value: "all", label: "Todas las categorías" },
    { value: "Harinas", label: "Harinas" },
    { value: "Carnes", label: "Carnes" },
    { value: "Vegetales", label: "Vegetales" },
    { value: "Lácteos", label: "Lácteos" },
    { value: "Especias", label: "Especias" },
    { value: "Otros", label: "Otros" }
  ];

  // Filtrar materiales
  const filteredMaterials = materials.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

//   const handleDeleteMaterial = (materialId) => {
//     openConfirmModal({
//       title: "Eliminar Material",
//       message: "¿Estás seguro de que quieres eliminar este material del inventario?",
//       type: "danger",
//       confirmText: "Eliminar",
//       onConfirm: () => {
//         setMaterials(prev => prev.filter(item => item.id !== materialId));
//         toast.success("Material eliminado correctamente");
//       }
//     });
//   };

  const handleUpdateMaterialStock = (materialId, currentStock) => {
    openStockModal({
      title: "Actualizar Stock de Material",
      currentStock,
      onConfirm: (newStock) => {
        setMaterials(prev => prev.map(item =>
          item.id === materialId
            ? {
                ...item,
                currentStock: newStock,
                status: newStock <= item.minStock ? 'low' : 'good',
                lastUpdated: new Date().toISOString()
              }
            : item
        ));
        toast.success("Stock de material actualizado correctamente");
      }
    });
  };

  // Preparar datos para StatsCards
  const statsData = [
    // Cards críticas primero (solo si tienen valor > 0)
    ...(materials.filter(item => item.status === 'low').length > 0 ? [{
      id: "stock-bajo",
      label: "Stock Bajo",
      value: materials.filter(item => item.status === 'low').length,
      color: "red",
      icon: <AlertTriangle className="w-5 h-5" />
    }] : []),

    // Cards neutras después
    {
      id: "total-materiales",
      label: "Total Materiales",
      value: materials.length,
      color: "gray",
      icon: <Package className="w-5 h-5" />
    },
    {
      id: "valor-inventario",
      label: "Valor Inventario",
      value: formatPrice(materials.reduce((sum, item) => sum + (item.currentStock * item.cost), 0)),
      color: "gray",
      icon: <BarChart className="w-5 h-5" />
    }
  ];

  // Preparar datos para SectionHeader
  const headerActions = [
    {
      label: "Actualizar Stock",
      variant: "empanada",
      className: "h-9 px-4 text-sm font-medium",
      onClick: () => {
        toast.info("Actualizando stock de materiales...");
        // Aquí se llamaría a la función de actualización
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
        title="Stock de Materiales"
        subtitle={`Gestiona el inventario de materias primas${selectedStore ? ` - ${selectedStore}` : ''}`}
        icon={<Package className="w-6 h-6" />}
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

      {/* Tabla de Materiales */}
      {selectedStore && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventario de Materiales ({filteredMaterials.length} materiales)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Barra de búsqueda integrada */}
          <div className="mb-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar materiales por nombre o categoría..."
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
          ) : filteredMaterials.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm || categoryFilter !== "all" ? 'No se encontraron materiales' : 'No hay materiales'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== "all"
                  ? 'Intenta con otros filtros de búsqueda'
                  : 'Los materiales aparecerán aquí cuando se agreguen'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Material</th>
                    <th className="text-left p-4 font-medium">Categoría</th>
                    <th className="text-left p-4 font-medium">Stock Actual</th>
                    <th className="text-left p-4 font-medium">Stock Mín.</th>
                    <th className="text-left p-4 font-medium">Costo</th>
                    <th className="text-left p-4 font-medium">Valor Total</th>
                    <th className="text-left p-4 font-medium">Estado</th>
                    <th className="text-left p-2 font-medium w-24 min-w-24">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((item) => {
                    const totalValue = item.currentStock * item.cost;

                    return (
                      <tr
                        key={item.id}
                        className="border-b admin-table-row"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                              {item.image ? (
                                <img
                                  src={item.image}
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
                          <Badge variant="outline">{item.category}</Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.currentStock}</span>
                            <span className="text-sm text-muted-foreground">{item.unit}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">{item.minStock} {item.unit}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-medium">{formatPrice(item.cost)}</span>
                          <span className="text-sm text-muted-foreground">/{item.unit}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-empanada-golden">{formatPrice(totalValue)}</span>
                        </td>
                        <td className="p-4">
                          <div className={getStatusClasses(item.status)}>
                            {getStatusText(item.status)}
                          </div>
                        </td>
                        <td className="p-2 w-24 min-w-24">
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateMaterialStock(item.id, item.currentStock)}
                              className="p-2 min-w-8 h-8"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {/* <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteMaterial(item.id)}
                              className="p-2 min-w-8 h-8"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button> */}
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
      )}
      {/* Modales */}
      <ConfirmModalComponent />
      <UpdateStockModalComponent />
    </div>
  );
}