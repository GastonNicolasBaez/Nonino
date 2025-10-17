import { useState } from "react";
import {
    Search,
    Plus,
    Trash2,
    Package,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandedModal, BrandedModalFooter } from "@/components/branding";
import { useAdminData } from "@/context/AdminDataProvider";

export function AddStockMaterialModal({
    isOpen,
    onClose,
    onSave,
    isLoading = false
}) {
    const {
        materiales: materials,
        adminDataLoading: loading
    } = useAdminData();

    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar materiales por término de búsqueda
    const filteredMaterials = materials?.filter(material =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Agregar material a la lista
    const handleAddMaterial = (materialId) => {
        if (!materialId || selectedMaterials.find(m => m.id === materialId)) return;

        const material = materials.find(m => m.id === materialId);
        if (material) {
            setSelectedMaterials([
                ...selectedMaterials,
                { ...material, quantity: 1 }
            ]);
            setSearchTerm(""); // Limpiar búsqueda después de agregar
        }
    };

    // Remover material de la lista
    const handleRemoveMaterial = (materialId) => {
        setSelectedMaterials(selectedMaterials.filter(m => m.id !== materialId));
    };

    // Actualizar cantidad de material
    const handleUpdateQuantity = (materialId, quantity) => {
        setSelectedMaterials(selectedMaterials.map(m =>
            m.id === materialId ? { ...m, quantity: Math.max(1, parseInt(quantity) || 1) } : m
        ));
    };

    // Confirmar ingreso de stock
    const handleConfirm = () => {
        if (selectedMaterials.length === 0) {
            return;
        }

        const stockData = selectedMaterials.map((m) => ({
            id: m.id,
            quantity: m.quantity,
            name: m.name,
            sku: m.sku,
            unit: m.unit
        }));

        onSave(stockData);
    };

    // Cerrar y resetear
    const handleClose = () => {
        setSelectedMaterials([]);
        setSearchTerm("");
        onClose();
    };

    return (
        <BrandedModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Ingresar Stock de Materia Prima"
            subtitle="Selecciona las materias primas y cantidades a agregar al inventario"
            icon={<Package className="w-6 h-6" />}
            maxWidth="max-w-4xl"
            footer={
                <BrandedModalFooter
                    onCancel={handleClose}
                    onConfirm={handleConfirm}
                    cancelText="Cancelar"
                    confirmText="Confirmar Ingreso"
                    confirmIcon={<Plus className="w-4 h-4" />}
                    isConfirmDisabled={selectedMaterials.length === 0 || isLoading}
                    isLoading={isLoading}
                />
            }
        >
            <div className="space-y-6">
                {/* Búsqueda de materiales */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                        Buscar Materia Prima *
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar materia prima por nombre o SKU..."
                            className="pl-10"
                            disabled={loading || isLoading}
                        />
                    </div>

                    {/* Lista de materiales filtrados */}
                    {searchTerm && (
                        <div className="mt-2 max-h-64 overflow-y-auto border border-gray-300 dark:border-empanada-light-gray rounded-md bg-white dark:bg-empanada-dark">
                            {filteredMaterials.length > 0 ? (
                                filteredMaterials.map((material) => (
                                    <button
                                        key={material.id}
                                        onClick={() => handleAddMaterial(material.id)}
                                        disabled={selectedMaterials.find(m => m.id === material.id)}
                                        className={`w-full text-left px-3 py-2 hover:bg-empanada-golden/10 dark:hover:bg-empanada-golden/20 transition-colors border-b border-gray-100 dark:border-empanada-light-gray last:border-b-0 ${
                                            selectedMaterials.find(m => m.id === material.id)
                                                ? 'bg-gray-100 dark:bg-empanada-medium opacity-50 cursor-not-allowed'
                                                : ''
                                        }`}
                                    >
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {material.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            SKU: {material.sku} • Unidad: {material.unit}
                                            {selectedMaterials.find(m => m.id === material.id) && ' • Ya agregado'}
                                        </p>
                                    </button>
                                ))
                            ) : (
                                <div className="px-3 py-4 text-center text-gray-500">
                                    No se encontraron materias primas
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Lista de materiales seleccionados */}
                {selectedMaterials.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-white">
                            Materias primas a ingresar ({selectedMaterials.length})
                        </h3>
                        {selectedMaterials.map((material) => (
                            <div
                                key={material.id}
                                className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-empanada-medium/50"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {material.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        SKU: {material.sku} • Unidad: {material.unit}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {material.unit == 'g' ? 'Kilos' : 'Litros'}:
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={material.quantity}
                                        onChange={(e) => handleUpdateQuantity(material.id, e.target.value)}
                                        className="w-20 text-center"
                                        disabled={isLoading}
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveMaterial(material.id)}
                                    disabled={isLoading}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Mensaje cuando no hay materiales seleccionados */}
                {selectedMaterials.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Busca y selecciona materias primas para agregar al inventario</p>
                    </div>
                )}
            </div>
        </BrandedModal>
    );
}
