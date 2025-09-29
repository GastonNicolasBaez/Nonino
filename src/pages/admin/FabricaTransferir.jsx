import { useState } from "react";
import {
    Truck,
    Plus,
    Trash2,
    CheckCircle,
    Building2,
    Search,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeader, CustomSelect, BrandedModal, BrandedModalFooter } from "@/components/branding";
import { toast } from "sonner";
import { useAdminData } from "@/context/AdminDataProvider";

export function FabricaTransferir() {
    const {
        inventarioProductosSucursal,
        sucursales,
        sucursalSeleccionada,
        adminDataLoading
    } = useAdminData();

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [destinationStore, setDestinationStore] = useState("");
    const [notes, setNotes] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [operationId, setOperationId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar productos por búsqueda
    const filteredProducts = inventarioProductosSucursal?.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Opciones para sucursales (excluyendo la actual)
    const storeOptions = [
        { value: "", label: adminDataLoading ? "Cargando sucursales..." : "Selecciona sucursal destino" },
        ...(sucursales?.filter(store => store.id !== sucursalSeleccionada).map(store => ({
            value: store.id,
            label: store.name
        })) || [])
    ];

    // Generar ID de operación
    const generateOperationId = () => {
        return `TRF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    };

    // Agregar producto a la lista
    const handleAddProduct = (productId) => {
        if (!productId || selectedProducts.find(p => (p.id || p.productId) === productId)) return;

        const product = inventarioProductosSucursal.find(p => (p.id || p.productId) === productId);
        if (product) {
            setSelectedProducts([
                ...selectedProducts,
                {
                    ...product,
                    id: product.id || product.productId,
                    quantity: 1,
                    maxStock: product.currentStock || 0
                }
            ]);
            setSearchTerm(""); // Limpiar búsqueda al seleccionar
        }
    };

    // Remover producto de la lista
    const handleRemoveProduct = (productId) => {
        setSelectedProducts(selectedProducts.filter(p => (p.id || p.productId) !== productId));
    };

    // Actualizar cantidad de producto
    const handleUpdateQuantity = (productId, quantity) => {
        setSelectedProducts(selectedProducts.map(p => {
            if ((p.id || p.productId) === productId) {
                const newQuantity = Math.max(1, Math.min(p.maxStock, parseInt(quantity) || 1));
                return { ...p, quantity: newQuantity };
            }
            return p;
        }));
    };

    // Confirmar transferencia
    const handleConfirmTransfer = () => {
        if (selectedProducts.length === 0) {
            toast.error("Debes seleccionar al menos un producto");
            return;
        }

        if (!destinationStore) {
            toast.error("Debes seleccionar una sucursal destino");
            return;
        }

        const newOperationId = generateOperationId();
        setOperationId(newOperationId);
        setShowConfirmModal(true);
    };

    // Procesar transferencia
    const handleProcessTransfer = () => {
        // Aquí iría la llamada a la API
        toast.success(`Transferencia registrada: ${operationId}`);

        // Resetear formulario
        setSelectedProducts([]);
        setDestinationStore("");
        setNotes("");
        setShowConfirmModal(false);
    };

    const selectedStoreName = sucursales?.find(s => s.id === destinationStore)?.name || "";
    const originStoreName = sucursales?.find(s => s.id === sucursalSeleccionada)?.name || "Sucursal Actual";

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Transferir Productos"
                subtitle="Transfiere productos entre sucursales"
                icon={<Truck className="w-6 h-6" />}
            />

            {/* Card de Sucursal Origen */}
            <Card className="admin-card bg-gray-50 dark:bg-gray-800 border-2 border-empanada-golden/20">
                <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-empanada-golden/10 rounded-lg">
                            <Building2 className="w-6 h-6 text-empanada-golden" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Transferir desde:
                            </p>
                            <p className="font-semibold text-lg text-gray-900 dark:text-white">
                                {originStoreName}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Selector de productos */}
            <Card className="admin-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-empanada-golden" />
                        Seleccionar Productos del Inventario
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Barra de búsqueda */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Buscar Producto *
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar producto por nombre..."
                                className="pl-10"
                                disabled={adminDataLoading}
                            />
                        </div>

                        {/* Lista de productos filtrados */}
                        {searchTerm && (
                            <div className="mt-2 max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <button
                                            key={product.id || product.productId}
                                            onClick={() => handleAddProduct(product.id || product.productId)}
                                            disabled={selectedProducts.find(p => (p.id || p.productId) === (product.id || product.productId))}
                                            className={`w-full text-left px-3 py-2 hover:bg-empanada-golden/10 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                                                selectedProducts.find(p => (p.id || p.productId) === (product.id || product.productId))
                                                    ? 'bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                                                    : ''
                                            }`}
                                        >
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Stock disponible: {product.currentStock || 0}
                                                {selectedProducts.find(p => (p.id || p.productId) === (product.id || product.productId)) && ' • Ya agregado'}
                                            </p>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-3 py-4 text-center text-gray-500">
                                        No se encontraron productos
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Lista de productos seleccionados */}
                    {selectedProducts.length > 0 && (
                        <div className="space-y-3 mt-6">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Productos a transferir ({selectedProducts.length})
                            </h3>
                            {selectedProducts.map((product) => (
                                <div
                                    key={product.id || product.productId}
                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {product.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Stock disponible: {product.maxStock}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Cantidad:
                                        </label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max={product.maxStock}
                                            value={product.quantity}
                                            onChange={(e) => handleUpdateQuantity(product.id || product.productId, e.target.value)}
                                            className="w-20 text-center"
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveProduct(product.id || product.productId)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Selector de sucursal destino */}
            <Card className="admin-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowRight className="w-5 h-5 text-empanada-golden" />
                        Sucursal Destino
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Seleccionar sucursal destino *
                        </label>
                        <CustomSelect
                            options={storeOptions}
                            value={destinationStore}
                            onChange={(value) => setDestinationStore(value)}
                            disabled={adminDataLoading}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Notas */}
            <Card className="admin-card">
                <CardHeader>
                    <CardTitle>Notas de transferencia</CardTitle>
                </CardHeader>
                <CardContent>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Agrega notas sobre esta transferencia (opcional)..."
                        rows={4}
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-empanada-golden focus:border-empanada-golden bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </CardContent>
            </Card>

            {/* Botón de confirmación */}
            <div className="flex justify-end">
                <Button
                    variant="empanada"
                    size="lg"
                    onClick={handleConfirmTransfer}
                    disabled={selectedProducts.length === 0 || !destinationStore}
                    className="gap-2"
                >
                    <CheckCircle className="w-5 h-5" />
                    Confirmar Transferencia
                </Button>
            </div>

            {/* Modal de confirmación */}
            <BrandedModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="Confirmar Transferencia"
            >
                <div className="space-y-4">
                    <div className="bg-empanada-golden/10 border border-empanada-golden/30 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            ID de Operación:
                        </p>
                        <p className="text-lg font-mono font-bold text-empanada-golden">
                            {operationId}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                            Sucursal destino:
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                            {selectedStoreName}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                            Productos a transferir:
                        </h4>
                        <ul className="space-y-1">
                            {selectedProducts.map((product) => (
                                <li key={product.id || product.productId} className="text-sm text-gray-600 dark:text-gray-400">
                                    • {product.name} - Cantidad: {product.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {notes && (
                        <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                Notas:
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                {notes}
                            </p>
                        </div>
                    )}
                </div>

                <BrandedModalFooter>
                    <Button
                        variant="outline"
                        onClick={() => setShowConfirmModal(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="empanada"
                        onClick={handleProcessTransfer}
                    >
                        Confirmar
                    </Button>
                </BrandedModalFooter>
            </BrandedModal>
        </div>
    );
}