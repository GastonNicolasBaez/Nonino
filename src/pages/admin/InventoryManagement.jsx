import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { formatPrice } from "../../lib/utils";
import { toast } from "sonner";

export function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data para inventario
  const mockInventory = [
    {
      id: "inv-001",
      name: "Harina 000",
      category: "Masa",
      currentStock: 50,
      minStock: 20,
      maxStock: 100,
      unit: "kg",
      unitCost: 850,
      supplier: "Molinos Río de la Plata",
      lastUpdated: "2024-01-15T10:30:00Z",
      status: "good"
    },
    {
      id: "inv-002",
      name: "Carne Picada",
      category: "Proteínas",
      currentStock: 8,
      minStock: 15,
      maxStock: 30,
      unit: "kg",
      unitCost: 3200,
      supplier: "Frigorífico La Pampa",
      lastUpdated: "2024-01-15T09:15:00Z",
      status: "low"
    },
    {
      id: "inv-003",
      name: "Queso Mozzarella",
      category: "Lácteos",
      currentStock: 25,
      minStock: 10,
      maxStock: 40,
      unit: "kg",
      unitCost: 2800,
      supplier: "Lácteos del Valle",
      lastUpdated: "2024-01-15T11:45:00Z",
      status: "good"
    },
    {
      id: "inv-004",
      name: "Aceitunas Verdes",
      category: "Condimentos",
      currentStock: 5,
      minStock: 8,
      maxStock: 20,
      unit: "kg",
      unitCost: 1200,
      supplier: "Conservas del Norte",
      lastUpdated: "2024-01-14T16:20:00Z",
      status: "critical"
    },
    {
      id: "inv-005",
      name: "Huevos",
      category: "Proteínas",
      currentStock: 120,
      minStock: 50,
      maxStock: 200,
      unit: "unidades",
      unitCost: 25,
      supplier: "Granja San Juan",
      lastUpdated: "2024-01-15T08:30:00Z",
      status: "good"
    },
    {
      id: "inv-006",
      name: "Cebolla",
      category: "Verduras",
      currentStock: 12,
      minStock: 15,
      maxStock: 30,
      unit: "kg",
      unitCost: 450,
      supplier: "Verdulería Central",
      lastUpdated: "2024-01-15T07:45:00Z",
      status: "low"
    }
  ];

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      // Simular carga de datos
      setTimeout(() => {
        setInventory(mockInventory);
        setLoading(false);
      }, 800);
    };

    fetchInventory();
  }, []);

  const getStatusBadge = (status, currentStock, minStock) => {
    if (status === "critical" || currentStock <= minStock * 0.5) {
      return <Badge variant="destructive">Crítico</Badge>;
    } else if (status === "low" || currentStock <= minStock) {
      return <Badge variant="warning" className="bg-yellow-500 text-white">Bajo</Badge>;
    } else {
      return <Badge variant="success" className="bg-green-500 text-white">Bueno</Badge>;
    }
  };

  const getTrendIcon = (currentStock, minStock, maxStock) => {
    const percentage = (currentStock / maxStock) * 100;
    if (percentage < 30) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    } else if (percentage > 70) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else {
      return <Package className="w-4 h-4 text-yellow-500" />;
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(inventory.map(item => item.category))];

  const inventoryStats = {
    total: inventory.length,
    critical: inventory.filter(item => item.status === "critical" || item.currentStock <= item.minStock * 0.5).length,
    low: inventory.filter(item => item.status === "low" || (item.currentStock <= item.minStock && item.currentStock > item.minStock * 0.5)).length,
    good: inventory.filter(item => item.status === "good" && item.currentStock > item.minStock).length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0)
  };

  const handleUpdateStock = (itemId, newStock) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            currentStock: newStock,
            lastUpdated: new Date().toISOString(),
            status: newStock <= item.minStock * 0.5 ? "critical" : 
                   newStock <= item.minStock ? "low" : "good"
          }
        : item
    ));
    toast.success("Stock actualizado correctamente");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Inventario</h1>
          <p className="text-muted-foreground">
            Control de materias primas y stock en tiempo real
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="empanada" size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{inventoryStats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stock Crítico</p>
                <p className="text-2xl font-bold text-red-500">{inventoryStats.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stock Bajo</p>
                <p className="text-2xl font-bold text-yellow-500">{inventoryStats.low}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stock Bueno</p>
                <p className="text-2xl font-bold text-green-500">{inventoryStats.good}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-empanada-golden">
                  {formatPrice(inventoryStats.totalValue)}
                </p>
              </div>
              <RefreshCcw className="w-8 h-8 text-empanada-golden" />
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
                  placeholder="Buscar productos o proveedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
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
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventario ({filteredInventory.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                    <th className="text-left p-4 font-medium">Producto</th>
                    <th className="text-left p-4 font-medium">Categoría</th>
                    <th className="text-left p-4 font-medium">Stock Actual</th>
                    <th className="text-left p-4 font-medium">Stock Mín/Máx</th>
                    <th className="text-left p-4 font-medium">Costo Unitario</th>
                    <th className="text-left p-4 font-medium">Proveedor</th>
                    <th className="text-left p-4 font-medium">Estado</th>
                    <th className="text-left p-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {getTrendIcon(item.currentStock, item.minStock, item.maxStock)}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {item.id}</p>
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
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${
                              item.currentStock <= item.minStock * 0.5 ? 'bg-red-500' :
                              item.currentStock <= item.minStock ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <span className="text-red-500">Min: {item.minStock}</span>
                          <br />
                          <span className="text-green-500">Max: {item.maxStock}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{formatPrice(item.unitCost)}</span>
                        <br />
                        <span className="text-sm text-muted-foreground">
                          Total: {formatPrice(item.currentStock * item.unitCost)}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">{item.supplier}</p>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(item.status, item.currentStock, item.minStock)}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              const newStock = prompt(`Actualizar stock para ${item.name}:`, item.currentStock);
                              if (newStock && !isNaN(newStock)) {
                                handleUpdateStock(item.id, parseInt(newStock));
                              }
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}