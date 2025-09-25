import { useState, useEffect } from "react";
import {
  Save,
  User,
  ShoppingBag,
  Minus,
  Search,
  Loader2,
  Plus,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { formatPrice } from "../../../lib/utils";
import { productService } from "../../../services/productService";
import { CustomSelect, BrandedModal, BrandedModalFooter } from "../../../components/branding";

// Modal de Nuevo Pedido Manual con Buscador de Productos
export function NewOrderModal({ onClose, onSave, availableProducts = [] }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    items: [],
    notes: ''
  });

  const [productSearch, setProductSearch] = useState('');
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productQuantities, setProductQuantities] = useState({});

  // Opciones para CustomSelect
  const categoryFilterOptions = [
    { value: "", label: "Todas las categorías" },
    ...categories.map(category => ({
      value: category,
      label: category
    }))
  ];

  // Cargar categorías al inicializar
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryList = await productService.getCategories();
        setCategories(categoryList);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Buscar productos con debounce
  useEffect(() => {
    // Si no hay criterios de búsqueda, limpiar resultados inmediatamente
    if (!productSearch.trim() && !selectedCategory) {
      setFilteredProducts([]);
      setSearchLoading(false);
      return;
    }

    const searchProducts = async () => {
      setSearchLoading(true);
      try {
        // Usar servicio de productos (que ya maneja fallback interno)
        const results = await productService.searchProducts(productSearch.trim(), selectedCategory);
        setFilteredProducts(results);
      } catch (error) {
        console.error('Error searching products:', error);
        setFilteredProducts([]);
      } finally {
        setSearchLoading(false);
      }
    };

    // Solo hacer debounce si hay criterios de búsqueda
    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [productSearch, selectedCategory]);

  const handleSave = () => {
    const newOrder = {
      ...formData,
      id: `EMP-${Date.now()}`,
      status: 'pending',
      date: new Date().toISOString(),
      total: formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    };
    onSave(newOrder);
  };

  const updateProductQuantity = (productId, quantity) => {
    setProductQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, quantity)
    }));
  };

  const getProductQuantity = (productId) => {
    return productQuantities[productId] || 1;
  };

  const addProductToOrder = (product) => {
    const quantity = getProductQuantity(product.id);
    const existingItem = formData.items.find(item => item.name === product.name);

    if (existingItem) {
      // Si el producto ya existe, aumentar cantidad
      const newItems = formData.items.map(item =>
        item.name === product.name
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setFormData({ ...formData, items: newItems });
    } else {
      // Agregar nuevo producto
      const newItems = [...formData.items, {
        name: product.name,
        quantity: quantity,
        price: product.price
      }];
      setFormData({ ...formData, items: newItems });
    }

    // Resetear cantidad de ese producto
    setProductQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const totalAmount = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const isFormValid = formData.customerName && formData.customerPhone && formData.deliveryAddress && formData.items.length > 0;

  return (
    <BrandedModal
      isOpen={true}
      onClose={onClose}
      title="Nuevo Pedido Manual"
      subtitle="Crea un nuevo pedido manualmente"
      icon={<Plus className="w-5 h-5" />}
      maxWidth="max-w-6xl"
      maxHeight="max-h-[95vh]"
      footer={
        <div className="flex justify-between items-center w-full">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            Total: <span className="text-xl font-bold text-empanada-golden">{formatPrice(totalAmount)}</span>
          </div>
          <BrandedModalFooter
            onCancel={onClose}
            onConfirm={handleSave}
            cancelText="Cancelar"
            confirmText="Crear Pedido"
            confirmIcon={<Save className="w-4 h-4" />}
            isConfirmDisabled={!isFormValid}
          />
        </div>
      }
    >
      <div className="space-y-6">
        {/* Información del Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              <User className="w-4 h-4 inline mr-1" />
              Nombre *
            </label>
            <Input
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Nombre del cliente"
              className={`${!formData.customerName ? 'border-red-300' : ''}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Teléfono *</label>
            <Input
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              placeholder="Teléfono del cliente"
              className={`${!formData.customerPhone ? 'border-red-300' : ''}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
            <Input
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              placeholder="Email del cliente"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Dirección *</label>
            <Input
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
              placeholder="Dirección de entrega"
              className={`${!formData.deliveryAddress ? 'border-red-300' : ''}`}
            />
          </div>
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Notas del Pedido</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Notas adicionales del pedido..."
            className="w-full h-20 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-empanada-golden resize-none"
          />
        </div>

        {/* Buscador de Productos */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-empanada-golden" />
              Agregar Productos
            </h3>

            {/* Filtros */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setShowProductSearch(true);
                  }}
                  onFocus={() => setShowProductSearch(true)}
                  placeholder="Buscar productos por nombre..."
                  className="pl-10"
                />
              </div>
              <div className="w-48">
                <CustomSelect
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categoryFilterOptions}
                  placeholder="Filtrar por categoría"
                />
              </div>
            </div>
          </div>

          {/* Resultados de búsqueda - Contenedor de altura fija */}
          <div className="p-4">
            <div className="h-80 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {(productSearch.trim() || selectedCategory) ? (
                // Lista de productos con selectors de cantidad
                <div className="h-full flex flex-col">
                  {searchLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-empanada-golden" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Buscando productos...</p>
                      </div>
                    </div>
                  ) : filteredProducts.length > 0 ? (
                    <div className="flex-1 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          {/* Información del producto */}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-empanada-golden font-semibold">
                                {formatPrice(product.price)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                            </div>
                          </div>

                          {/* Controles */}
                          <div className="flex items-center gap-3">
                            {/* Selector de cantidad */}
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => updateProductQuantity(product.id, getProductQuantity(product.id) - 1)}
                                disabled={getProductQuantity(product.id) <= 1}
                                className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-12 text-center font-medium text-sm border-x border-gray-300 dark:border-gray-600 py-1">
                                {getProductQuantity(product.id)}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => updateProductQuantity(product.id, getProductQuantity(product.id) + 1)}
                                className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            {/* Botón agregar */}
                            <Button
                              type="button"
                              onClick={() => addProductToOrder(product)}
                              className="bg-empanada-golden hover:bg-empanada-golden/90 text-white"
                              size="sm"
                            >
                              Agregar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium">No se encontraron productos</p>
                        <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Estado inicial
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium mb-1">Busca productos para agregar</p>
                    <p className="text-sm">
                      Escribe el nombre del producto o selecciona una categoría
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Agregados */}
        {formData.items.length > 0 ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-empanada-golden" />
                Items del Pedido ({formData.items.length})
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 dark:text-white text-lg">{item.name}</span>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatPrice(item.price)} c/u
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          placeholder="Cant."
                          min="1"
                          className="text-center font-medium"
                        />
                      </div>
                      <div className="w-24 text-right">
                        <div className="font-bold text-lg text-empanada-golden">
                          {formatPrice(item.quantity * item.price)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 w-10 h-10"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20 text-gray-400" />
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
              No hay productos en el pedido
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Busca y agrega productos para continuar
            </p>
          </div>
        )}
      </div>
    </BrandedModal>
  );
}