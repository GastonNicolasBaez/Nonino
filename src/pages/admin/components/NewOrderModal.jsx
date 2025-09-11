import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  X,
  Save,
  User,
  Package,
  ShoppingBag,
  Minus,
  Search,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { formatPrice } from "../../../lib/utils";
import { Portal } from "../../../components/common/Portal";
import { productService } from "../../../services/productService";

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

  const addProductToOrder = (product) => {
    const existingItem = formData.items.find(item => item.name === product.name);
    
    if (existingItem) {
      // Si el producto ya existe, aumentar cantidad
      const newItems = formData.items.map(item =>
        item.name === product.name 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setFormData({ ...formData, items: newItems });
    } else {
      // Agregar nuevo producto
      const newItems = [...formData.items, { 
        name: product.name, 
        quantity: 1, 
        price: product.price 
      }];
      setFormData({ ...formData, items: newItems });
    }
    
    setProductSearch('');
    setShowProductSearch(false);
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
    <Portal>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-6xl h-[95vh] flex flex-col"
        >
          <Card className="shadow-2xl h-full flex flex-col bg-white dark:bg-gray-900">
            {/* Header */}
            <CardHeader className="pb-4 flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Nuevo Pedido Manual
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Crea un nuevo pedido manualmente
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="flex-1 overflow-y-auto space-y-6 px-6 py-6">
              {/* Grid de información del cliente y notas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información del Cliente */}
                <Card className="bg-gray-50 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <User className="w-5 h-5" />
                      Información del Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Nombre *</label>
                        <Input
                          value={formData.customerName}
                          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                          placeholder="Nombre del cliente"
                          required
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Teléfono *</label>
                        <Input
                          value={formData.customerPhone}
                          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                          placeholder="Teléfono del cliente"
                          required
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
                        <Input
                          value={formData.customerEmail}
                          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                          placeholder="Email del cliente"
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Dirección de Entrega *</label>
                        <Input
                          value={formData.deliveryAddress}
                          onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                          placeholder="Dirección de entrega"
                          required
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notas */}
                <Card className="bg-gray-50 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">
                      Notas del Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Notas adicionales del pedido..."
                      className="w-full h-32 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-empanada-golden resize-none"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Buscador de Productos */}
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <ShoppingBag className="w-5 h-5" />
                    Agregar Productos
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                        className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-empanada-golden"
                    >
                      <option value="">Todas las categorías</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Resultados de búsqueda */}
                  {(productSearch.trim() || selectedCategory) && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      {searchLoading ? (
                        <div className="p-4 text-center">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">Buscando productos...</p>
                        </div>
                      ) : filteredProducts.length > 0 ? (
                        <div className="max-h-64 overflow-y-auto">
                          {filteredProducts.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => addProductToOrder(product)}
                              className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-200 dark:border-gray-600 last:border-b-0 transition-colors"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex-1">
                                  <span className="font-medium block text-gray-900 dark:text-white">{product.name}</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {product.category}
                                    </Badge>
                                    {product.stock && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Stock: {product.stock}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className="font-bold text-empanada-golden text-lg">
                                  {formatPrice(product.price)}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No se encontraron productos</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Mensaje de ayuda */}
                  {!productSearch.trim() && !selectedCategory && (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">
                        Busca productos por nombre o selecciona una categoría para comenzar
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Items Agregados */}
              {formData.items.length > 0 && (
                <Card className="bg-gray-50 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <ShoppingBag className="w-5 h-5" />
                      Items del Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {formData.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                          <div className="flex-1">
                            <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                          </div>
                          <div className="w-20">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                              placeholder="Cant."
                              min="1"
                              className="bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white"
                            />
                          </div>
                          <div className="w-32 text-right font-medium text-gray-900 dark:text-white">
                            {formatPrice(item.quantity * item.price)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>

            {/* Footer */}
            <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total: <span className="text-xl font-bold text-empanada-golden">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                    Cancelar
                  </Button>
                  <Button 
                    variant="empanada" 
                    onClick={handleSave}
                    disabled={!isFormValid}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Crear Pedido
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </Portal>
  );
}