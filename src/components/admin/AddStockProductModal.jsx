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

export function AddStockProductModal({
    isOpen,
    onClose,
    onSave,
    isLoading = false
}) {
    const {
        productos: products,
        adminDataLoading: loading
    } = useAdminData();

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar productos por término de búsqueda
    const filteredProducts = products?.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Agregar producto a la lista
    const handleAddProduct = (productId) => {
        if (!productId || selectedProducts.find(p => p.id === productId)) return;

        const product = products.find(p => p.id === productId);
        if (product) {
            setSelectedProducts([
                ...selectedProducts,
                { ...product, quantity: 1 }
            ]);
            setSearchTerm(""); // Limpiar búsqueda después de agregar
        }
    };

    // Remover producto de la lista
    const handleRemoveProduct = (productId) => {
        setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    };

    // Actualizar cantidad de producto
    const handleUpdateQuantity = (productId, quantity) => {
        setSelectedProducts(selectedProducts.map(p =>
            p.id === productId ? { ...p, quantity: Math.max(1, parseInt(quantity) || 1) } : p
        ));
    };

    // Confirmar ingreso de stock
    const handleConfirm = () => {
        if (selectedProducts.length === 0) {
            return;
        }

        const stockData = selectedProducts.map((p) => ({
            id: p.id,
            quantity: p.quantity,
            name: p.name,
            sku: p.sku
        }));

        onSave(stockData);
    };

    // Cerrar y resetear
    const handleClose = () => {
        setSelectedProducts([]);
        setSearchTerm("");
        onClose();
    };

    return (
        <BrandedModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Ingresar Stock de Productos"
            subtitle="Selecciona los productos y cantidades a agregar al inventario"
            icon={<Package className="w-6 h-6" />}
            maxWidth="max-w-4xl"
            footer={
                <BrandedModalFooter
                    onCancel={handleClose}
                    onConfirm={handleConfirm}
                    cancelText="Cancelar"
                    confirmText="Confirmar Ingreso"
                    confirmIcon={<Plus className="w-4 h-4" />}
                    isConfirmDisabled={selectedProducts.length === 0 || isLoading}
                    isLoading={isLoading}
                />
            }
        >
            <div className="space-y-6">
                {/* Búsqueda de productos */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                        Buscar Producto *
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar producto por nombre o SKU..."
                            className="pl-10"
                            disabled={loading || isLoading}
                        />
                    </div>

                    {/* Lista de productos filtrados */}
                    {searchTerm && (
                        <div className="mt-2 max-h-64 overflow-y-auto border border-gray-300 dark:border-empanada-light-gray rounded-md bg-white dark:bg-empanada-dark">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <button
                                        key={product.id}
                                        onClick={() => handleAddProduct(product.id)}
                                        disabled={selectedProducts.find(p => p.id === product.id)}
                                        className={`w-full text-left px-3 py-2 hover:bg-empanada-golden/10 dark:hover:bg-empanada-golden/20 transition-colors border-b border-gray-100 dark:border-empanada-light-gray last:border-b-0 ${
                                            selectedProducts.find(p => p.id === product.id)
                                                ? 'bg-gray-100 dark:bg-empanada-medium opacity-50 cursor-not-allowed'
                                                : ''
                                        }`}
                                    >
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {product.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            SKU: {product.sku}
                                            {selectedProducts.find(p => p.id === product.id) && ' • Ya agregado'}
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
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-white">
                            Productos a ingresar ({selectedProducts.length})
                        </h3>
                        {selectedProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-empanada-medium/50"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {product.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        SKU: {product.sku}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Cantidad:
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={product.quantity}
                                        onChange={(e) => handleUpdateQuantity(product.id, e.target.value)}
                                        className="w-20 text-center"
                                        disabled={isLoading}
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveProduct(product.id)}
                                    disabled={isLoading}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Mensaje cuando no hay productos seleccionados */}
                {selectedProducts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Busca y selecciona productos para agregar al inventario</p>
                    </div>
                )}
            </div>
        </BrandedModal>
    );
}
