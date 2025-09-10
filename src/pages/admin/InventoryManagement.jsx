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
  Filter,
  X,
  Save,
  BarChart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { formatPrice } from "../../lib/utils";
import { toast } from "sonner";
import { useConfirmModal } from "../../components/common/ConfirmModal";
import { useUpdateStockModal } from "../../components/common/UpdateStockModal";
import { Portal } from "../../components/common/Portal";

export function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Hooks para modales
  const { openModal: openConfirmModal, ConfirmModalComponent } = useConfirmModal();
  const { openModal: openStockModal, UpdateStockModalComponent } = useUpdateStockModal();

  // Cargar datos mock al inicializar
  useEffect(() => {
    setInventory(mockInventory);
    setLoading(false);
  }, []);

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

  // Mock data para inventario
  const mockInventory = [
    {
      id: "inv-001",
      name: "Harina 000",
      category: "Harinas",
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
      unit: "kg",
      supplier: "Molino San Juan",
      cost: 180,
      lastUpdated: "2024-01-15T10:30:00Z",
      status: "good"
    },
    {
      id: "inv-002",
      name: "Carne Molida",
      category: "Carnes",
      currentStock: 5,
      minStock: 8,
      maxStock: 20,
      unit: "kg",
      supplier: "Carnicería El Buen Gusto",
      cost: 1200,
      lastUpdated: "2024-01-14T16:45:00Z",
      status: "low"
    },
    {
      id: "inv-003",
      name: "Cebolla",
      category: "Verduras",
      currentStock: 15,
      minStock: 5,
      maxStock: 30,
      unit: "kg",
      supplier: "Verdulería Central",
      cost: 200,
      lastUpdated: "2024-01-15T08:20:00Z",
      status: "good"
    },
    {
      id: "inv-004",
      name: "Queso Mozzarella",
      category: "Lácteos",
      currentStock: 3,
      minStock: 5,
      maxStock: 15,
      unit: "kg",
      supplier: "Lácteos del Valle",
      cost: 800,
      lastUpdated: "2024-01-13T14:15:00Z",
      status: "low"
    },
    {
      id: "inv-005",
      name: "Aceite de Oliva",
      category: "Aceites",
      currentStock: 8,
      minStock: 3,
      maxStock: 12,
      unit: "l",
      supplier: "Aceites Premium",
      cost: 1500,
      lastUpdated: "2024-01-12T11:30:00Z",
      status: "good"
    }
  ];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteItem = (itemId) => {
    openConfirmModal({
      title: "Eliminar Item",
      message: "¿Estás seguro de que quieres eliminar este item del inventario?",
      onConfirm: () => {
        setInventory(prev => prev.filter(item => item.id !== itemId));
        toast.success("Item eliminado correctamente");
      }
    });
  };

  const handleUpdateStock = (itemId, currentStock) => {
    openStockModal({
      title: "Actualizar Stock",
      currentStock,
      onConfirm: (newStock) => {
        setInventory(prev => prev.map(item => 
          item.id === itemId 
            ? { 
                ...item, 
                currentStock: newStock,
                status: newStock <= item.minStock ? 'low' : 'good',
                lastUpdated: new Date().toISOString()
              }
            : item
        ));
        toast.success("Stock actualizado correctamente");
      }
    });
  };

  const handleAddItem = () => {
    setShowAddModal(true);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'low': return 'destructive';
      case 'good': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'low': return 'Stock Bajo';
      case 'good': return 'Stock Normal';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Inventario</h1>
          <p className="text-muted-foreground mt-2">
            Administra el inventario de ingredientes y productos
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => toast.info("Función de exportar próximamente")}>
            <FileDown className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="empanada" onClick={handleAddItem}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Item
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="">
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nombre, categoría o proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border-2 border-gray-300 dark:border-gray-600 bg-input text-gray-300 dark:text-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-empanada-golden"
            >
              <option value="all">Todas las categorías</option>
              <option value="Carnes">Carnes</option>
              <option value="Verduras">Verduras</option>
              <option value="Lácteos">Lácteos</option>
              <option value="Harinas">Harinas</option>
              <option value="Condimentos">Condimentos</option>
              <option value="Aceites">Aceites</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Inventario */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stock Bajo</p>
                <p className="text-2xl font-bold text-red-500">
                  {inventory.filter(item => item.status === 'low').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">
                  {formatPrice(inventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0))}
                </p>
              </div>
              <BarChart className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categorías</p>
                <p className="text-2xl font-bold">
                  {new Set(inventory.map(item => item.category)).size}
                </p>
              </div>
              <Filter className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Inventario */}
      <Card className="">
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
                    <th className="text-left p-4 font-medium">Item</th>
                    <th className="text-left p-4 font-medium">Categoría</th>
                    <th className="text-left p-4 font-medium">Stock Actual</th>
                    <th className="text-left p-4 font-medium">Stock Mín.</th>
                    <th className="text-left p-4 font-medium">Proveedor</th>
                    <th className="text-left p-4 font-medium">Costo</th>
                    <th className="text-left p-4 font-medium">Estado</th>
                    <th className="text-left p-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.unit}</p>
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
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{item.minStock} {item.unit}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{item.supplier}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{formatPrice(item.cost)}</span>
                        <span className="text-sm text-muted-foreground">/{item.unit}</span>
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusVariant(item.status)}>
                          {getStatusText(item.status)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStock(item.id, item.currentStock)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
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
      
      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onSave={(newItem) => {
            setInventory(prev => [...prev, newItem]);
            setShowAddModal(false);
            toast.success(`Item ${newItem.name} agregado correctamente`);
          }}
        />
      )}

      {/* Modal Components */}
      <ConfirmModalComponent />
      <UpdateStockModalComponent />
    </div>
  );
}

// Modal de Agregar Item
function AddItemModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: '',
    supplier: '',
    cost: 0,
    notes: ''
  });

  const handleSave = () => {
    const newItem = {
      ...formData,
      id: `INV-${Date.now()}`,
      lastUpdated: new Date().toISOString(),
      status: formData.currentStock <= formData.minStock ? 'low' : 'good'
    };
    onSave(newItem);
  };

  const isFormValid = formData.name && formData.category && formData.unit;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-6xl h-[95vh] flex flex-col"
        >
          <Card className="shadow-2xl h-full flex flex-col ">
            {/* Header */}
            <CardHeader className="pb-4 flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Agregar Nuevo Item
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Agrega un nuevo item al inventario
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="flex-1 overflow-y-auto space-y-6 px-6 py-6">
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
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Nombre del Item *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nombre del item"
                        required
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Categoría *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-empanada-golden"
                        required
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="Carnes">Carnes</option>
                        <option value="Verduras">Verduras</option>
                        <option value="Lácteos">Lácteos</option>
                        <option value="Harinas">Harinas</option>
                        <option value="Condimentos">Condimentos</option>
                        <option value="Aceites">Aceites</option>
                        <option value="Otros">Otros</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Unidad de Medida *</label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-empanada-golden"
                        required
                      >
                        <option value="">Seleccionar unidad</option>
                        <option value="kg">Kilogramos (kg)</option>
                        <option value="g">Gramos (g)</option>
                        <option value="l">Litros (l)</option>
                        <option value="ml">Mililitros (ml)</option>
                        <option value="unidades">Unidades</option>
                        <option value="cajas">Cajas</option>
                        <option value="bolsas">Bolsas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Proveedor</label>
                      <Input
                        value={formData.supplier}
                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                        placeholder="Nombre del proveedor"
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información de Stock */}
              <Card className="">
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
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
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
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
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
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
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
              </Card>

              {/* Notas */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Notas Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Notas adicionales sobre el item..."
                    className="w-full h-24 border-2 border-gray-300 dark:border-gray-600 bg-input text-gray-300 dark:text-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-empanada-golden resize-none"
                  />
                </CardContent>
              </Card>
            </CardContent>

            {/* Footer */}
            <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                  Cancelar
                </Button>
                <Button 
                  variant="empanada" 
                  onClick={handleSave}
                  disabled={!isFormValid}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Agregar Item
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </Portal>
  );
}