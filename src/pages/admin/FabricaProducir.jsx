import { useState } from "react";
import {
    Package,
    Plus,
    Trash2,
    CheckCircle,
    Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeader, CustomSelect, BrandedModal, BrandedModalFooter } from "@/components/branding";
import { toast } from "sonner";
import { useAdminData } from "@/context/AdminDataProvider";
import { useSession } from "@/context/SessionProvider";

export function FabricaProducir() {
    const {
        sucursalSeleccionada,
        productos,
        adminDataLoading,

        callMakeProducto,
    } = useAdminData();

    const session = useSession();

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [notes, setNotes] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar productos por término de búsqueda
    const filteredProducts = productos?.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Agregar producto a la lista
    const handleAddProduct = (productId) => {
        if (!productId || selectedProducts.find(p => p.id === productId)) return;

        const product = productos.find(p => p.id === productId);
        if (product) {
            setSelectedProducts([
                ...selectedProducts,
                { ...product, quantity: 1 }
            ]);
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

    // Procesar producción
    const handleProcessProduction = () => {
        if (selectedProducts.length === 0) {
            toast.error("Debes seleccionar al menos un producto");
            return;
        }

        const newProducts = selectedProducts.map((p) => ({
            productId: p.id,
            quantity: p.quantity
        }));

        const resolvedProduction = {
            factoryId: sucursalSeleccionada,
            items: newProducts,
            operationId: null,
            notes: notes,
        }

        callMakeProducto({
            _produce: resolvedProduction,
            _accessToken: session.userData.accessToken,
        })
        toast.success(`Producción registrada`);

        // Resetear formulario
        setSelectedProducts([]);
        setNotes("");
    };

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Producir Productos"
                subtitle="Registra la producción de productos en fábrica"
                icon={<Package className="w-6 h-6" />}
            />

            {/* Selector de productos */}
            <Card className="">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-empanada-golden" />
                        Seleccionar Productos
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Barra de búsqueda */}
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
                                disabled={adminDataLoading}
                            />
                        </div>

                        {/* Lista de productos filtrados */}
                        {searchTerm && (
                            <div className="mt-2 max-h-64 overflow-y-auto border border-gray-300 dark:border-empanada-light-gray rounded-md bg-white dark:bg-empanada-dark">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => {
                                                handleAddProduct(product.id);
                                                setSearchTerm("");
                                            }}
                                            disabled={selectedProducts.find(p => p.id === product.id)}
                                            className={`w-full text-left px-3 py-2 hover:bg-empanada-golden/10 dark:hover:bg-empanada-golden/20 transition-colors border-b border-gray-100 dark:border-empanada-light-gray last:border-b-0 ${selectedProducts.find(p => p.id === product.id)
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
                        <div className="space-y-3 mt-6">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-white">
                                Productos a producir ({selectedProducts.length})
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
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveProduct(product.id)}
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

            {/* Notas */}
            <Card className="">
                <CardHeader>
                    <CardTitle>Notas de producción</CardTitle>
                </CardHeader>
                <CardContent>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Agrega notas sobre esta producción (opcional)..."
                        rows={4}
                        className="w-full admin-input"
                    />
                </CardContent>
            </Card>

            {/* Botón de confirmación */}
            <div className="flex justify-end">
                <Button
                    variant="empanada"
                    size="lg"
                    onClick={handleProcessProduction}
                    disabled={selectedProducts.length === 0}
                    className="gap-2"
                >
                    <CheckCircle className="w-5 h-5" />
                    Confirmar Producción
                </Button>
            </div>

            {/* Modal de confirmación */}
            {/* <BrandedModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="Confirmar Producción"
            >
                <div className="space-y-4">
                    <div className="bg-empanada-golden/10 border border-empanada-golden/30 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-700 dark:text-white mb-1">
                            ID de Operación:
                        </p>
                        <p className="text-lg font-mono font-bold text-empanada-golden">
                            {operationId}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                            Productos a producir:
                        </h4>
                        <ul className="space-y-1">
                            {selectedProducts.map((product) => (
                                <li key={product.id} className="text-sm text-gray-600 dark:text-gray-400">
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
                            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-empanada-dark p-3 rounded">
                                {notes}
                            </p>
                        </div>
                    )}
                </div>

                <BrandedModalFooter>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowConfirmModal(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="empanada"
                        size="sm"
                        onClick={() => {
                            handleProcessProduction
                        }}
                    >
                        Confirmar
                    </Button>
                </BrandedModalFooter>
            </BrandedModal> */}
        </div>
    );
}