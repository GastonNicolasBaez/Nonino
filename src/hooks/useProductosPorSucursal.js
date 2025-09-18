import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { storeService } from '@/services/api';

/**
 * Hook personalizado para manejar la lógica de productos por sucursal
 * Centraliza la lógica de negocio y facilita el testing y reutilización
 */
export const useProductosPorSucursal = () => {
    const [selectedStore, setSelectedStore] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [storeProducts, setStoreProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [storesLoading, setStoresLoading] = useState(true);

    // Cargar sucursales al montar el componente
    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
        setStoresLoading(true);
        try {
            // TODO: Implementar llamada real al backend
            // const response = await storeService.getAllStores();
            // setStores(response.data);
            
            // Mock data temporal - reemplazar con datos reales del backend
            const mockStores = [
                { id: "1", name: "Sucursal Centro", address: "Av. Corrientes 1234", status: "active" },
                { id: "2", name: "Sucursal Palermo", address: "Av. Santa Fe 5678", status: "active" },
                { id: "3", name: "Sucursal Belgrano", address: "Av. Cabildo 9012", status: "active" },
                { id: "4", name: "Sucursal Recoleta", address: "Av. Callao 3456", status: "inactive" },
            ];
            setStores(mockStores);
            
        } catch (error) {
            console.error('Error al cargar sucursales:', error);
            toast.error("Error al cargar las sucursales");
        } finally {
            setStoresLoading(false);
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

        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener productos ya vinculados a la sucursal
    const getStoreProducts = async (storeId) => {
        if (!storeId) return;
        
        setLoading(true);
        try {
            // Llamada real al backend
            const response = await storeService.getStoreProducts(storeId);
            setStoreProducts(response.data.map(product => product.id));
            
        } catch (error) {
            console.error('Error al obtener productos de la sucursal:', error);
            toast.error("Error al cargar productos de la sucursal");
            setStoreProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Función para desvincular productos de la sucursal
    const handleDesvincularProductos = async (productIds) => {
        if (!selectedStore) {
            toast.error("Por favor selecciona una sucursal");
            return false;
        }

        setLoading(true);
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
        } finally {
            setLoading(false);
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
        if (storeProducts.length > 0 && selectedStore) {
            // Marcar automáticamente los productos ya vinculados
            setSelectedProducts(prev => {
                const newSelection = [...prev];
                storeProducts.forEach(productId => {
                    if (!newSelection.includes(productId)) {
                        newSelection.push(productId);
                    }
                });
                return newSelection;
            });
        }
    }, [storeProducts, selectedStore]);

    return {
        // Estados
        selectedStore,
        setSelectedStore,
        searchTerm,
        setSearchTerm,
        selectedProducts,
        setSelectedProducts,
        loading,
        storeProducts,
        stores,
        storesLoading,
        
        // Funciones
        handleProductSelection,
        handleSelectAll,
        handleUnirProductos,
        handleDesvincularProductos,
        handleUpdateProductAvailability,
        getStoreProducts,
        loadStores,
    };
};
