import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  Eye,
  EyeOff,
  Star,
  Clock,
  DollarSign,
  BarChart3,
  Filter,
  Upload,
  Download,
  MoreVertical,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { formatPrice } from "../../lib/utils";
import { toast } from "sonner";

export function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Mock products data
  const mockProducts = [
    {
      id: "emp-001",
      name: "Empanada de Carne",
      description: "Carne picada, cebolla, huevo duro, aceitunas y condimentos",
      category: "Tradicionales",
      price: 450,
      cost: 280,
      stock: 25,
      minStock: 10,
      preparationTime: 15,
      isAvailable: true,
      isPopular: true,
      icon: "🥟",
      rating: 4.8,
      reviews: 156,
      sales: 890,
      ingredients: ["carne picada", "cebolla", "huevo", "aceitunas"],
      allergens: ["gluten", "huevo"],
      nutritionalInfo: {
        calories: 320,
        protein: 18,
        carbs: 28,
        fat: 15
      }
    },
    {
      id: "emp-002",
      name: "Empanada de Pollo",
      description: "Pollo desmenuzado, verduras y especias",
      category: "Tradicionales",
      price: 420,
      cost: 260,
      stock: 18,
      minStock: 10,
      preparationTime: 15,
      isAvailable: true,
      isPopular: true,
      icon: "🥟",
      rating: 4.7,
      reviews: 123,
      sales: 756,
      ingredients: ["pollo", "cebolla", "pimiento"],
      allergens: ["gluten"],
      nutritionalInfo: {
        calories: 290,
        protein: 22,
        carbs: 25,
        fat: 12
      }
    },
    {
      id: "emp-003",
      name: "Empanada de Jamón y Queso",
      description: "Jamón cocido y queso mozzarella",
      category: "Tradicionales",
      price: 380,
      cost: 220,
      stock: 30,
      minStock: 15,
      preparationTime: 12,
      isAvailable: true,
      isPopular: false,
      icon: "🥟",
      rating: 4.6,
      reviews: 89,
      sales: 445,
      ingredients: ["jamón", "queso mozzarella"],
      allergens: ["gluten", "lactosa"],
      nutritionalInfo: {
        calories: 310,
        protein: 16,
        carbs: 24,
        fat: 16
      }
    },
    {
      id: "emp-004",
      name: "Empanada de Cordero",
      description: "Cordero patagónico con hierbas finas",
      category: "Gourmet",
      price: 650,
      cost: 420,
      stock: 12,
      minStock: 5,
      preparationTime: 18,
      isAvailable: true,
      isPopular: true,
      icon: "🥟",
      rating: 4.9,
      reviews: 67,
      sales: 234,
      ingredients: ["cordero", "romero", "tomillo"],
      allergens: ["gluten"],
      nutritionalInfo: {
        calories: 380,
        protein: 24,
        carbs: 26,
        fat: 19
      }
    },
    {
      id: "emp-005",
      name: "Empanada de Verduras",
      description: "Mix de verduras de estación con queso",
      category: "Vegetarianas",
      price: 380,
      cost: 180,
      stock: 8,
      minStock: 10,
      preparationTime: 14,
      isAvailable: false,
      isPopular: false,
      icon: "🥟",
      rating: 4.5,
      reviews: 78,
      sales: 156,
      ingredients: ["calabaza", "espinaca", "queso"],
      allergens: ["gluten", "lactosa"],
      nutritionalInfo: {
        calories: 270,
        protein: 12,
        carbs: 32,
        fat: 10
      }
    },
    {
      id: "emp-006",
      name: "Empanada de Dulce de Leche",
      description: "Dulce de leche artesanal argentino",
      category: "Dulces",
      price: 350,
      cost: 150,
      stock: 22,
      minStock: 8,
      preparationTime: 10,
      isAvailable: true,
      isPopular: true,
      icon: "🥟",
      rating: 4.9,
      reviews: 134,
      sales: 567,
      ingredients: ["dulce de leche"],
      allergens: ["gluten", "lactosa"],
      nutritionalInfo: {
        calories: 280,
        protein: 6,
        carbs: 38,
        fat: 12
      }
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setTimeout(() => {
        setProducts(mockProducts);
        setLoading(false);
      }, 800);
    };

    fetchProducts();
  }, []);

  const categories = ["all", ...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const productStats = {
    total: products.length,
    available: products.filter(p => p.isAvailable).length,
    outOfStock: products.filter(p => !p.isAvailable || p.stock <= 0).length,
    lowStock: products.filter(p => p.stock <= p.minStock && p.stock > 0).length,
    popular: products.filter(p => p.isPopular).length,
    totalValue: products.reduce((sum, p) => sum + (p.stock * p.price), 0),
    totalRevenue: products.reduce((sum, p) => sum + (p.sales * p.price), 0),
    averageRating: products.reduce((sum, p) => sum + p.rating, 0) / products.length
  };

  const toggleAvailability = (productId) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, isAvailable: !product.isAvailable }
        : product
    ));
    toast.success("Estado del producto actualizado");
  };

  const togglePopular = (productId) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, isPopular: !product.isPopular }
        : product
    ));
    toast.success("Estado de popularidad actualizado");
  };

  const deleteProduct = (productId) => {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      setProducts(prev => prev.filter(product => product.id !== productId));
      toast.success("Producto eliminado correctamente");
    }
  };

  const updateStock = (productId, newStock) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, stock: newStock }
        : product
    ));
    toast.success("Stock actualizado correctamente");
  };

  const ProductModal = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState(product || {
      name: "",
      description: "",
      category: "Tradicionales",
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 0,
      preparationTime: 0,
      isAvailable: true,
      isPopular: false,
      ingredients: [],
      allergens: []
    });

    const handleSave = () => {
      if (product) {
        // Editar producto existente
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, ...formData } : p));
        toast.success("Producto actualizado correctamente");
      } else {
        // Crear nuevo producto
        const newProduct = {
          ...formData,
          id: `emp-${Date.now()}`,
          icon: "🥟",
          rating: 0,
          reviews: 0,
          sales: 0,
          nutritionalInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 }
        };
        setProducts(prev => [...prev, newProduct]);
        toast.success("Producto creado correctamente");
      }
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {product ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre del producto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Tradicionales">Tradicionales</option>
                  <option value="Gourmet">Gourmet</option>
                  <option value="Vegetarianas">Vegetarianas</option>
                  <option value="Dulces">Dulces</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Precio</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  placeholder="Precio de venta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Costo</label>
                <Input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
                  placeholder="Costo de producción"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Stock Actual</label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                  placeholder="Cantidad en stock"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Stock Mínimo</label>
                <Input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                  placeholder="Stock mínimo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tiempo de Preparación (min)</label>
                <Input
                  type="number"
                  value={formData.preparationTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: Number(e.target.value) }))}
                  placeholder="Minutos"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                  />
                  <span className="text-sm">Disponible</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                  />
                  <span className="text-sm">Popular</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción del producto"
                className="w-full px-3 py-2 border rounded-md h-20"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="empanada" onClick={handleSave}>
              {product ? "Actualizar" : "Crear"} Producto
            </Button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Productos</h1>
          <p className="text-muted-foreground">
            Administra tu catálogo de empanadas y productos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button variant="empanada" size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Productos</p>
                <p className="text-2xl font-bold">{productStats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Disponibles</p>
                <p className="text-2xl font-bold text-green-500">{productStats.available}</p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stock Bajo</p>
                <p className="text-2xl font-bold text-yellow-500">{productStats.lowStock}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
                <p className="text-2xl font-bold text-empanada-golden">
                  {formatPrice(productStats.totalRevenue)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-empanada-golden" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "Todas las categorías" : category}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded" />
                  <div className="bg-gray-200 h-3 rounded w-2/3" />
                  <div className="bg-gray-200 h-3 rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-square relative">
                  <div className="w-full h-full bg-empanada-golden/10 flex items-center justify-center">
                    <span className="text-6xl">{product.icon || "🥟"}</span>
                  </div>
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isPopular && (
                      <Badge variant="empanada" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {!product.isAvailable && (
                      <Badge variant="destructive" className="text-xs">
                        No disponible
                      </Badge>
                    )}
                    {product.stock <= product.minStock && product.stock > 0 && (
                      <Badge variant="warning" className="text-xs bg-yellow-500 text-white">
                        Stock bajo
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/80 backdrop-blur-sm hover:bg-white"
                      onClick={() => toggleAvailability(product.id)}
                    >
                      {product.isAvailable ? 
                        <Eye className="w-4 h-4 text-green-500" /> : 
                        <EyeOff className="w-4 h-4 text-red-500" />
                      }
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => togglePopular(product.id)}
                      >
                        <Star 
                          className={`w-3 h-3 ${product.isPopular ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                        />
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {product.preparationTime}min
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-empanada-golden">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Costo: {formatPrice(product.cost)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span>Stock: {product.stock}</span>
                        <span>★ {product.rating} ({product.reviews})</span>
                      </div>
                    </div>

                    <div className="flex gap-1 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const newStock = prompt(`Actualizar stock para ${product.name}:`, product.stock);
                          if (newStock && !isNaN(newStock)) {
                            updateStock(product.id, parseInt(newStock));
                          }
                        }}
                      >
                        <Package className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <ProductModal
            onClose={() => setShowAddModal(false)}
            onSave={() => setShowAddModal(false)}
          />
        )}
        {editingProduct && (
          <ProductModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={() => setEditingProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}