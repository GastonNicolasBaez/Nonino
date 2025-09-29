import { useState, useEffect } from "react";
// Removed framer-motion for simpler admin experience
import {
    Search,
    Plus,
    Edit,
    Trash2,
    AlertTriangle,
    Package,
    TrendingDown,
    TrendingUp,
    RefreshCcw,
    FileDown,
    Filter,
    X,
    Save,
    BarChart,
    PackagePlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useConfirmModal } from "@/components/common/ConfirmModal";
import { useUpdateStockModal } from "@/components/common/UpdateStockModal";
import { Portal } from "@/components/common/Portal";
import { SectionHeader, StatsCards, CustomSelect, BrandedModal, BrandedModalFooter} from "@/components/branding";
import { toast } from "sonner";

import { useAdminData } from "@/context/AdminDataProvider";
import { useSession } from "@/context/SessionProvider";

export function MaterialManagement() {

    const {
        materiales: materials,
        adminDataLoading: loading,
        callMateriales,
        callCrearMaterial
    } = useAdminData();

    const session = useSession();

    const [searchTerm, setSearchTerm] = useState("");
    //   const [categoryFilter, setCategoryFilter] = useState("all");
    // const [materials, setMaterials] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showInboundModal, setShowInboundModal] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    // Hooks para modales
    const { openModal: openConfirmModal, ConfirmModalComponent } = useConfirmModal();
    const { openModal: openStockModal, UpdateStockModalComponent } = useUpdateStockModal();

    // Opciones para CustomSelect
    //   const categoryFilterOptions = [
    //     { value: "all", label: "Todas las categorías" },
    //     { value: "Carnes", label: "Carnes" },
    //     { value: "Verduras", label: "Verduras" },
    //     { value: "Lácteos", label: "Lácteos" },
    //     { value: "Harinas", label: "Harinas" },
    //     { value: "Condimentos", label: "Condimentos" },
    //     { value: "Aceites", label: "Aceites" },
    //     { value: "Otros", label: "Otros" }
    //   ];

    //   const categoryOptions = [
    //     { value: "", label: "Seleccionar categoría" },
    //     { value: "Carnes", label: "Carnes" },
    //     { value: "Verduras", label: "Verduras" },
    //     { value: "Lácteos", label: "Lácteos" },
    //     { value: "Harinas", label: "Harinas" },
    //     { value: "Condimentos", label: "Condimentos" },
    //     { value: "Aceites", label: "Aceites" },
    //     { value: "Otros", label: "Otros" }
    //   ];

    //   const unitOptions = [
    //     { value: "", label: "Seleccionar unidad" },
    //     { value: "kg", label: "Kilogramos (kg)" },
    //     { value: "g", label: "Gramos (g)" },
    //     { value: "l", label: "Litros (l)" },
    //     { value: "ml", label: "Mililitros (ml)" },
    //     { value: "unidades", label: "Unidades" },
    //     { value: "cajas", label: "Cajas" },
    //     { value: "bolsas", label: "Bolsas" }
    //   ];

    // Cerrar modales con ESC
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                if (showAddModal) setShowAddModal(false);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [showAddModal]);

    const filteredMaterials = materials?.filter(item => {
        // const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        //                      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        //                      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        // const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
        // return matchesSearch && matchesCategory;
        return matchesSearch;
    });

    const handleDeleteItem = (itemId) => {
        openConfirmModal({
            title: "Eliminar Material",
            message: "¿Estás seguro de que quieres eliminar este material del inventario?",
            type: "danger",
            confirmText: "Eliminar",
            onConfirm: () => {
                setMaterials(prev => prev.filter(item => item.id !== itemId));
                toast.success("Material eliminado correctamente");
            }
        });
    };

    const handleUpdateStock = (itemId, currentStock) => {
        openStockModal({
            title: "Actualizar Stock de Material",
            currentStock,
            onConfirm: (newStock) => {
                setMaterials(prev => prev.map(item =>
                    item.id === itemId
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

    const handleAddItem = () => {
        setShowAddModal(true);
    };

    const handleOpenInbound = (material) => {
        setSelectedMaterial(material);
        setShowInboundModal(true);
    };

    // // Preparar datos para StatsCards - críticas primero, resto neutras
    // const statsData = [
    //     // Cards críticas primero (solo si tienen valor > 0)
    //     ...(materials.filter(item => item.status === 'low').length > 0 ? [{
    //         id: "stock-bajo",
    //         label: "Stock Bajo",
    //         value: materials.filter(item => item.status === 'low').length,
    //         color: "red",
    //         icon: <AlertTriangle className="w-5 h-5" />
    //     }] : []),

    //     // Cards neutras después
    //     {
    //         id: "total-materiales",
    //         label: "Total Materiales",
    //         value: materials.length,
    //         color: "gray",
    //         icon: <Package className="w-5 h-5" />
    //     },
    //     {
    //         id: "valor-total",
    //         label: "Valor Total",
    //         value: formatPrice(materials.reduce((sum, item) => sum + (item.currentStock * item.cost), 0)),
    //         color: "gray",
    //         icon: <BarChart className="w-5 h-5" />
    //     },
    //     {
    //         id: "categorias",
    //         label: "Categorías",
    //         value: new Set(materials.map(item => item.category)).size,
    //         color: "gray",
    //         icon: <Filter className="w-5 h-5" />
    //     }
    // ];

    // Preparar datos para SectionHeader
    const headerActions = [
        {
            label: "Agregar Material",
            variant: "empanada",
            className: "h-9 px-4 text-sm font-medium",
            onClick: handleAddItem,
            icon: <Plus className="w-4 h-4 mr-2" />
        },
        {
            label: "Actualizar",
            variant: "outline",
            className: "h-9 px-4 text-sm font-medium",
            onClick: () => {
                callMateriales(session.userData.accessToken);
            },
            icon: <RefreshCcw className="w-4 h-4 mr-2" />
        }
    ];

    //   const getStatusClasses = (status) => {
    //     switch (status) {
    //       case 'low': return 'status-badge status-badge-danger';
    //       case 'good': return 'status-badge status-badge-success';
    //       case 'warning': return 'status-badge status-badge-warning';
    //       default: return 'status-badge status-badge-info';
    //     }
    //   };

    //   const getStatusText = (status) => {
    //     switch (status) {
    //       case 'low': return 'Stock Bajo';
    //       case 'good': return 'Stock Normal';
    //       case 'warning': return 'Stock Crítico';
    //       default: return 'Estado Desconocido';
    //     }
    //   };

    return (
        <div className="space-y-6">
            {/* Header usando SectionHeader */}
            <SectionHeader
                title="Gestión de Materiales"
                subtitle="Administra el inventario de materias primas e ingredientes"
                icon={<Package className="w-6 h-6" />}
                actions={headerActions}
            />

            {/* Stats usando StatsCards */}
            {/* <StatsCards stats={statsData} /> */}

            {/* Tabla de Materiales con búsqueda integrada */}
            <Card className="">
                <CardContent>
                    {/* Barra de búsqueda integrada */}
                    <div className="my-6">
                        <div className="flex gap-4 items-center">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar por nombre..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            {/* <div className="w-48">
                <CustomSelect
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  options={categoryFilterOptions}
                  placeholder="Filtrar por categoría"
                />
              </div> */}
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
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-4 font-medium">Material</th>
                                        {/* <th className="text-left p-4 font-medium">Categoría</th>
                    <th className="text-left p-4 font-medium">Stock Actual</th>
                    <th className="text-left p-4 font-medium">Stock Mín.</th>
                    <th className="text-left p-4 font-medium">Proveedor</th> */}
                                        <th className="text-left p-4 font-medium">Costo por gramo</th>
                                        {/* <th className="text-left p-4 font-medium">Estado</th> */}
                                        <th className="text-left p-4 font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMaterials.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b admin-table-row"
                                        >
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                </div>
                                            </td>
                                            {/* <td className="p-4">
                        <Badge variant="outline">{item.category}</Badge>
                      </td> */}
                                            {/* <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.currentStock}</span>
                          <span className="text-sm text-muted-foreground">{item.unit}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{item.minStock} {item.unit}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{item.supplier}</span>
                      </td> */}
                                            <td className="p-4 flex items-center gap-2">
                                                <span className="font-medium">{formatPrice(item.unitPrice)}</span>
                                                <p className="text-sm text-muted-foreground">/{item.unit}</p>
                                                {/* <span className="text-sm text-muted-foreground">/{item.unit}</span> */}
                                            </td>
                                            {/* <td className="p-4">
                        <div className={getStatusClasses(item.status)}>
                          {getStatusText(item.status)}
                        </div>
                      </td> */}
                                            <td className="p-4" style={{ width: '1px' }}>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="empanada"
                                                        size="sm"
                                                        onClick={() => handleOpenInbound(item)}
                                                        title="Registrar Entrada"
                                                    >
                                                        <PackagePlus className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled
                                                        onClick={() => handleUpdateStock(item.id, item.currentStock)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        disabled
                                                        onClick={() => handleDeleteItem(item.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Material Modal */}
            {showAddModal && (
                <AddMaterialModal
                    onClose={() => setShowAddModal(false)}
                    onSave={async (newItem) => {
                        // setMaterials(prev => [...prev, newItem]);
                        await callCrearMaterial({
                            _material: newItem,
                            _accessToken: session.userData.accessToken,
                        });
                        setShowAddModal(false);
                        toast.success(`Material ${newItem.name} agregado correctamente`);
                        callMateriales(session.userData.accessToken);
                    }}
                />
            )}

            {/* Inbound Modal */}
            {showInboundModal && selectedMaterial && (
                <InboundMaterialModal
                    material={selectedMaterial}
                    onClose={() => {
                        setShowInboundModal(false);
                        setSelectedMaterial(null);
                    }}
                    onConfirm={(inboundData) => {
                        // Aquí iría la llamada a la API
                        toast.success(`Entrada registrada: ${inboundData.operationId}`);
                        setShowInboundModal(false);
                        setSelectedMaterial(null);
                        callMateriales(session.userData.accessToken);
                    }}
                />
            )}

            {/* Modal Components */}
            <ConfirmModalComponent />
            <UpdateStockModalComponent />
        </div>
    );
}

// Modal de Agregar Material
function AddMaterialModal({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        unit: 'g',
        unitPrice: 0,
    });

    const handleSave = () => {
        const newItem = {
            ...formData,
            code: `MAT-${Date.now()}`,
        };
        onSave(newItem);
    };

    const isFormValid = formData.name && formData.unitPrice;

    return (
        <BrandedModal
            isOpen={true}
            onClose={onClose}
            title="Agregar Nuevo Material"
            subtitle="Agrega un nuevo material al inventario"
            icon={<Package className="w-6 h-6" />}
            maxWidth="max-w-6xl"
            maxHeight="max-h-[95vh]"
            footer={
                <BrandedModalFooter
                    onCancel={onClose}
                    onConfirm={handleSave}
                    cancelText="Cancelar"
                    confirmText="Agregar Material"
                    confirmIcon={<Save className="w-4 h-4" />}
                    isConfirmDisabled={!isFormValid}
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
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nombre del material"
                                    required
                                    className="admin-input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Precio por gramo *</label>
                                <Input
                                    type='number'
                                    value={formData.unitPrice}
                                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                                    placeholder="Nombre del material"
                                    required
                                    className="admin-input"
                                />
                            </div>
                            {/* <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Categoría *</label>
                      <CustomSelect
                        value={formData.category}
                        onChange={(value) => setFormData({ ...formData, category: value })}
                        options={categoryOptions}
                        placeholder="Seleccionar categoría"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Unidad de Medida *</label>
                      <CustomSelect
                        value={formData.unit}
                        onChange={(value) => setFormData({ ...formData, unit: value })}
                        options={unitOptions}
                        placeholder="Seleccionar unidad"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Proveedor</label>
                      <Input
                        value={formData.supplier}
                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                        placeholder="Nombre del proveedor"
                        className="admin-input"
                      />
                    </div> */}
                        </div>
                    </CardContent>
                </Card>

                {/* Información de Stock */}
                {/* <Card className="">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <TrendingUp className="w-5 h-5" />
                    Gestión de Stock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Stock Actual</label>
                      <Input
                        type="number"
                        value={formData.currentStock}
                        onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        min="0"
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Stock Mínimo</label>
                      <Input
                        type="number"
                        value={formData.minStock}
                        onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        min="0"
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Stock Máximo</label>
                      <Input
                        type="number"
                        value={formData.maxStock}
                        onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        min="0"
                        className="admin-input"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Costo por Unidad</label>
                    <Input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                </CardContent>
              </Card> */}

                {/* Notas */}
                {/* <Card className="">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Notas Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Notas adicionales sobre el material..."
                    className="w-full h-24 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-empanada-golden resize-none"
                  />
                </CardContent>
              </Card> */}
            </div>
        </BrandedModal>
    );
}

// Modal de Registrar Entrada (Inbound)
function InboundMaterialModal({ material, onClose, onConfirm }) {
    const [quantity, setQuantity] = useState("");
    const [batchNumber, setBatchNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [operationId] = useState(`INB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);

    const handleConfirm = () => {
        if (!quantity || parseFloat(quantity) <= 0) {
            toast.error("Debes ingresar una cantidad válida");
            return;
        }

        const inboundData = {
            operationId,
            materialId: material.id,
            materialName: material.name,
            quantity: parseFloat(quantity),
            batchNumber,
            notes,
            timestamp: new Date().toISOString()
        };

        onConfirm(inboundData);
    };

    const isFormValid = quantity && parseFloat(quantity) > 0;

    return (
        <BrandedModal
            isOpen={true}
            onClose={onClose}
            title="Registrar Entrada de Material"
            subtitle={`Material: ${material.name}`}
            icon={<PackagePlus className="w-6 h-6" />}
        >
            <div className="space-y-6">
                {/* ID de Operación */}
                <div className="bg-empanada-golden/10 border border-empanada-golden/30 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        ID de Operación:
                    </p>
                    <p className="text-lg font-mono font-bold text-empanada-golden">
                        {operationId}
                    </p>
                </div>

                {/* Cantidad */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Cantidad * ({material.unit})
                    </label>
                    <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder={`Cantidad en ${material.unit}`}
                        className="text-base"
                    />
                </div>

                {/* Número de Lote */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Número de Lote
                    </label>
                    <Input
                        type="text"
                        value={batchNumber}
                        onChange={(e) => setBatchNumber(e.target.value)}
                        placeholder="Ej: LOTE-2024-001"
                        className="text-base"
                    />
                </div>

                {/* Notas */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Notas
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Notas adicionales sobre esta entrada (opcional)..."
                        rows={3}
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-empanada-golden focus:border-empanada-golden bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            <BrandedModalFooter>
                <Button
                    variant="outline"
                    onClick={onClose}
                >
                    Cancelar
                </Button>
                <Button
                    variant="empanada"
                    onClick={handleConfirm}
                    disabled={!isFormValid}
                >
                    Registrar Entrada
                </Button>
            </BrandedModalFooter>
        </BrandedModal>
    );
}