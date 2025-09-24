/* eslint-disable react-hooks/exhaustive-deps */

// CORE
import { useState, useEffect } from "react";

// EXTERNO
import { toast } from "sonner";

// COMPONENTES
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Portal } from "@/components/common/Portal";
import { SectionHeader, StatsCards, CustomSelect, BrandedModal, BrandedModalFooter } from "@/components/branding";
import { useConfirmModal } from "@/components/common/ConfirmModal";

// ICONOS
import {
  Search,
  Edit,
  Trash2,
  ShoppingCart,
  Plus,
  Package,
  DollarSign,
  Percent,
  X,
  Save,
  Minus,
  RefreshCw,
  Eye
} from "lucide-react";

// PROVIDERS
import { useAdminData } from "@/context/AdminDataProvider";

// UTILIDADES
import { formatPrice } from "@/lib/utils";

export function ComboManagement() {
  const { sucursalSeleccionada, productos } = useAdminData();

  const [searchTerm, setSearchTerm] = useState("");
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCombo, setEditingCombo] = useState(null);
  const [comboForm, setComboForm] = useState({
    name: "",
    description: "",
    products: [],
    discount: 0,
    price: 0,
    isActive: true
  });
  const [productSearchTerm, setProductSearchTerm] = useState("");

  // Hooks para modales
  const { openModal: openConfirmModal, ConfirmModalComponent } = useConfirmModal();

  // Mock data para combos
  const mockCombos = [
    {
      id: "combo-001",
      name: "Combo Familiar",
      description: "4 empanadas de carne + 2 de pollo + gaseosa",
      products: [
        { id: "prod-001", name: "Empanada de Carne", quantity: 4, price: 1200 },
        { id: "prod-002", name: "Empanada de Pollo", quantity: 2, price: 1100 },
        { id: "prod-005", name: "Gaseosa 500ml", quantity: 1, price: 800 }
      ],
      originalPrice: 8000,
      discount: 15,
      price: 6800,
      isActive: true,
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "combo-002",
      name: "Combo Individual",
      description: "2 empanadas + bebida",
      products: [
        { id: "prod-001", name: "Empanada de Carne", quantity: 1, price: 1200 },
        { id: "prod-003", name: "Empanada Vegetariana", quantity: 1, price: 950 },
        { id: "prod-006", name: "Agua 500ml", quantity: 1, price: 500 }
      ],
      originalPrice: 2650,
      discount: 10,
      price: 2385,
      isActive: true,
      createdAt: "2024-01-14T14:20:00Z"
    }
  ];

  // Cargar datos mock al inicializar
  useEffect(() => {
    setCombos(mockCombos);
    setLoading(false);
  }, []);

  // Filtrar combos por término de búsqueda
  const filteredCombos = combos.filter(combo =>
    combo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    combo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCombo = () => {
    setEditingCombo(null);
    setComboForm({
      name: "",
      description: "",
      products: [],
      discount: 0,
      price: 0,
      isActive: true
    });
    setProductSearchTerm("");
    setShowCreateModal(true);
  };

  const handleEditCombo = (combo) => {
    if (!combo) {
      toast.error("Combo no válido para editar");
      return;
    }

    setEditingCombo(combo);
    setComboForm({
      name: combo.name || "",
      description: combo.description || "",
      products: combo.products ? [...combo.products] : [], // Crear copia para evitar mutación
      discount: combo.discount || 0,
      price: combo.price || 0,
      isActive: combo.isActive !== undefined ? combo.isActive : true
    });
    setProductSearchTerm("");
    setShowCreateModal(true);
  };

  const handleDeleteCombo = (comboId) => {
    openConfirmModal({
      title: "Eliminar Combo",
      message: "¿Estás seguro de que quieres eliminar este combo?",
      onConfirm: () => {
        setCombos(prev => prev.filter(combo => combo.id !== comboId));
        toast.success("Combo eliminado correctamente");
      }
    });
  };

  const handleAddProductToCombo = (selectedProduct) => {
    if (!selectedProduct) {
      toast.error("Producto no válido");
      return;
    }

    // Verificar si el producto ya está en el combo
    const existingProductIndex = comboForm.products.findIndex(p => p.id === selectedProduct.id);

    if (existingProductIndex !== -1) {
      // Si ya existe, incrementar la cantidad
      const updatedProducts = [...comboForm.products];
      updatedProducts[existingProductIndex] = {
        ...updatedProducts[existingProductIndex],
        quantity: updatedProducts[existingProductIndex].quantity + 1
      };

      setComboForm(prev => ({
        ...prev,
        products: updatedProducts
      }));
      calculateComboPrice(updatedProducts, comboForm.discount);
      toast.success(`${selectedProduct.nombre} agregado (cantidad: ${updatedProducts[existingProductIndex].quantity})`);
    } else {
      // Si no existe, agregarlo
      const newProduct = {
        id: selectedProduct.id,
        name: selectedProduct.nombre,
        quantity: 1,
        price: selectedProduct.precio || 1000
      };

      const updatedProducts = [...comboForm.products, newProduct];
      setComboForm(prev => ({
        ...prev,
        products: updatedProducts
      }));
      calculateComboPrice(updatedProducts, comboForm.discount);
      toast.success(`${selectedProduct.nombre} agregado al combo`);
    }
  };

  const handleRemoveProductFromCombo = (index) => {
    const productName = comboForm.products[index]?.name;
    const updatedProducts = comboForm.products.filter((_, i) => i !== index);

    setComboForm(prev => ({
      ...prev,
      products: updatedProducts
    }));
    calculateComboPrice(updatedProducts, comboForm.discount);

    if (productName) {
      toast.success(`${productName} removido del combo`);
    }
  };

  const handleProductChange = (index, field, value) => {
    if (index < 0 || index >= comboForm.products.length) {
      toast.error("Índice de producto inválido");
      return;
    }

    const updatedProducts = [...comboForm.products];

    // Validaciones específicas por campo
    if (field === 'quantity') {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 1) {
        toast.error("La cantidad debe ser mayor a 0");
        return;
      }
      updatedProducts[index] = { ...updatedProducts[index], [field]: numValue };
    } else if (field === 'price') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        toast.error("El precio debe ser mayor o igual a 0");
        return;
      }
      updatedProducts[index] = { ...updatedProducts[index], [field]: numValue };
    } else if (field === 'id') {
      if (!value) {
        toast.error("Debe seleccionar un producto");
        return;
      }
      const selectedProduct = productos?.find(p => p.id === value);
      if (selectedProduct) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          id: value,
          name: selectedProduct.nombre,
          price: selectedProduct.precio || 1000
        };
        toast.success(`Producto cambiado a ${selectedProduct.nombre}`);
      } else {
        toast.error("Producto no encontrado");
        return;
      }
    } else {
      updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    }

    setComboForm(prev => ({
      ...prev,
      products: updatedProducts
    }));
    calculateComboPrice(updatedProducts, comboForm.discount);
  };

  const calculateComboPrice = (products, discount) => {
    if (!products || products.length === 0) {
      setComboForm(prev => ({
        ...prev,
        price: 0
      }));
      return;
    }

    const originalPrice = products.reduce((sum, product) => {
      const price = parseFloat(product.price) || 0;
      const quantity = parseInt(product.quantity) || 0;
      return sum + (price * quantity);
    }, 0);

    const discountPercent = parseFloat(discount) || 0;
    const discountAmount = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - discountAmount;

    setComboForm(prev => ({
      ...prev,
      price: Math.round(Math.max(0, finalPrice)) // Asegurar que no sea negativo
    }));
  };

  const handleDiscountChange = (discount) => {
    const numDiscount = parseFloat(discount) || 0;

    if (numDiscount < 0) {
      toast.error("El descuento no puede ser negativo");
      return;
    }

    if (numDiscount > 100) {
      toast.error("El descuento no puede ser mayor al 100%");
      return;
    }

    setComboForm(prev => ({
      ...prev,
      discount: numDiscount
    }));
    calculateComboPrice(comboForm.products, numDiscount);
  };

  const handleSaveCombo = () => {
    // Validaciones
    if (!comboForm.name.trim()) {
      toast.error("El nombre del combo es requerido");
      return;
    }

    if (comboForm.products.length === 0) {
      toast.error("Debe agregar al menos un producto al combo");
      return;
    }

    // Validar que todos los productos tengan datos válidos
    const invalidProduct = comboForm.products.find(product =>
      !product.id || !product.name || product.quantity < 1 || product.price < 0
    );

    if (invalidProduct) {
      toast.error("Todos los productos deben tener datos válidos");
      return;
    }

    // Calcular precio original
    const originalPrice = comboForm.products.reduce((sum, product) => {
      const price = parseFloat(product.price) || 0;
      const quantity = parseInt(product.quantity) || 0;
      return sum + (price * quantity);
    }, 0);

    const comboData = {
      ...comboForm,
      id: editingCombo?.id || `combo-${Date.now()}`,
      originalPrice: Math.round(originalPrice),
      createdAt: editingCombo?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingCombo) {
        setCombos(prev => prev.map(combo =>
          combo.id === editingCombo.id ? comboData : combo
        ));
        toast.success("Combo actualizado correctamente");
      } else {
        setCombos(prev => [...prev, comboData]);
        toast.success("Combo creado correctamente");
      }

      // Limpiar el formulario
      setShowCreateModal(false);
      setEditingCombo(null);
      setProductSearchTerm("");
    } catch (error) {
      console.error("Error al guardar combo:", error);
      toast.error("Error al guardar el combo");
    }
  };

  // Filtrar productos disponibles para el buscador
  const getAvailableProducts = () => {
    if (!productos || !Array.isArray(productos)) return [];

    return productos.filter(product =>
      product?.nombre?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      product?.descripcion?.toLowerCase().includes(productSearchTerm.toLowerCase())
    );
  };


  // Preparar datos para StatsCards
  const statsData = [
    {
      id: "total-combos",
      label: "Total Combos",
      value: combos.length,
      color: "gray",
      icon: <ShoppingCart className="w-5 h-5" />
    },
    {
      id: "combos-activos",
      label: "Combos Activos",
      value: combos.filter(combo => combo.isActive).length,
      color: "green",
      icon: <Eye className="w-5 h-5" />
    },
    {
      id: "ahorro-promedio",
      label: "Descuento Promedio",
      value: combos.length > 0 ? `${Math.round(combos.reduce((sum, combo) => sum + combo.discount, 0) / combos.length)}%` : "0%",
      color: "gray",
      icon: <Percent className="w-5 h-5" />
    },
    {
      id: "valor-total",
      label: "Valor Total Combos",
      value: formatPrice(combos.reduce((sum, combo) => sum + combo.price, 0)),
      color: "gray",
      icon: <DollarSign className="w-5 h-5" />
    }
  ];

  // Preparar datos para SectionHeader
  const headerActions = [
    {
      label: "Crear Combo",
      variant: "empanada",
      className: "h-9 px-4 text-sm font-medium",
      onClick: handleCreateCombo,
      icon: <Plus className="w-4 h-4 mr-2" />
    },
    {
      label: "Actualizar",
      variant: "outline",
      className: "h-9 px-4 text-sm font-medium",
      onClick: () => {
        setLoading(true);
        toast.info("Actualizando combos...");

        // Simular actualización (en producción sería una llamada a API)
        setTimeout(() => {
          // Recargar combos desde el mock data
          setCombos([...mockCombos]);
          setLoading(false);
          toast.success("Combos actualizados correctamente");
        }, 1000);
      },
      icon: <RefreshCw className="w-4 h-4 mr-2" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header usando SectionHeader */}
      <SectionHeader
        title="Gestión de Combos"
        subtitle={`Crea y gestiona combos de productos${sucursalSeleccionada ? ` - ${sucursalSeleccionada.nombre}` : ''}`}
        icon={<ShoppingCart className="w-6 h-6" />}
        actions={headerActions}
      />

      {/* Stats usando StatsCards */}
      <StatsCards stats={statsData} />

      {/* Tabla de Combos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Combos Disponibles ({filteredCombos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Barra de búsqueda */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar combos por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-24 rounded-lg" />
                </div>
              ))}
            </div>
          ) : filteredCombos.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? 'No se encontraron combos' : 'No hay combos creados'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? 'Intenta con otro término de búsqueda'
                  : 'Crea tu primer combo para ofrecer mejores precios a tus clientes'
                }
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateCombo} className="bg-empanada-golden hover:bg-empanada-golden/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primer Combo
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCombos.map((combo) => (
                <Card key={combo.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{combo.name}</h3>
                          <Badge variant={combo.isActive ? "default" : "secondary"}>
                            {combo.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                          <Badge variant="outline" className="text-green-600">
                            -{combo.discount}%
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                          {combo.description}
                        </p>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-empanada-golden">Productos incluidos:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {combo.products.map((product, index) => (
                              <div key={index} className="text-sm bg-gray-50 dark:bg-gray-800 rounded px-3 py-2">
                                <span className="font-medium">{product.quantity}x {product.name}</span>
                                <span className="text-muted-foreground block">
                                  {formatPrice(product.price)} c/u
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-6 mt-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Precio original</p>
                            <p className="text-lg line-through text-gray-500">
                              {formatPrice(combo.originalPrice)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Precio combo</p>
                            <p className="text-xl font-bold text-empanada-golden">
                              {formatPrice(combo.price)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Ahorro</p>
                            <p className="text-lg font-semibold text-green-600">
                              {formatPrice(combo.originalPrice - combo.price)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCombo(combo)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCombo(combo.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de crear/editar combo */}
      <BrandedModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingCombo(null);
          setProductSearchTerm("");
        }}
        title={editingCombo ? 'Editar Combo' : 'Crear Nuevo Combo'}
        subtitle="Configure los productos y el descuento para el combo"
        icon={<ShoppingCart className="w-5 h-5" />}
        footer={
          <BrandedModalFooter
            onCancel={() => {
              setShowCreateModal(false);
              setEditingCombo(null);
              setProductSearchTerm("");
            }}
            onConfirm={handleSaveCombo}
            confirmText={editingCombo ? 'Actualizar Combo' : 'Crear Combo'}
            confirmIcon={<Save className="w-4 h-4" />}
            isConfirmDisabled={!comboForm.name.trim() || comboForm.products.length === 0}
          />
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información básica */}
          <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Nombre del Combo</label>
                      <Input
                        value={comboForm.name}
                        onChange={(e) => setComboForm(prev => ({...prev, name: e.target.value}))}
                        placeholder="Ej: Combo Familiar"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Descripción</label>
                      <Input
                        value={comboForm.description}
                        onChange={(e) => setComboForm(prev => ({...prev, description: e.target.value}))}
                        placeholder="Describe que incluye el combo"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Descuento (%)</label>
                      <Input
                        type="number"
                        value={comboForm.discount}
                        onChange={(e) => handleDiscountChange(parseFloat(e.target.value) || 0)}
                        min="0"
                        max="50"
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Estado</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={comboForm.isActive}
                          onChange={(e) => setComboForm(prev => ({...prev, isActive: e.target.checked}))}
                          className="rounded"
                        />
                        <label htmlFor="isActive" className="text-sm">Combo activo</label>
                      </div>
                    </div>
                  </div>

                  {/* Productos del combo */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Productos del Combo</label>

                    {/* Buscador de productos integrado */}
                    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="space-y-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            value={productSearchTerm}
                            onChange={(e) => setProductSearchTerm(e.target.value)}
                            placeholder="Buscar productos para agregar al combo..."
                            className="pl-10"
                          />
                        </div>

                        {productSearchTerm && (
                          <div className="max-h-32 overflow-y-auto space-y-2">
                            {getAvailableProducts().length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                No se encontraron productos con "{productSearchTerm}"
                              </p>
                            ) : (
                              getAvailableProducts().slice(0, 5).map(product => {
                                const isInCombo = comboForm.products.some(p => p.id === product.id);
                                const comboProduct = comboForm.products.find(p => p.id === product.id);

                                return (
                                  <div
                                    key={product.id}
                                    className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                    onClick={() => {
                                      handleAddProductToCombo(product);
                                      setProductSearchTerm("");
                                    }}
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <div>
                                          <p className="font-medium text-sm">{product.nombre}</p>
                                          {product.descripcion && (
                                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{product.descripcion}</p>
                                          )}
                                        </div>
                                        {isInCombo && (
                                          <Badge variant="secondary" className="text-xs ml-2">
                                            {comboProduct?.quantity}x
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">{formatPrice(product.precio || 1000)}</span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-6 w-6 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAddProductToCombo(product);
                                          setProductSearchTerm("");
                                        }}
                                      >
                                        <Plus className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}

                        {!productSearchTerm && (
                          <p className="text-xs text-muted-foreground text-center py-2">
                            Escribe para buscar productos disponibles
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {comboForm.products.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No hay productos en este combo</p>
                          <p className="text-xs">Usa el buscador de arriba para agregar productos</p>
                        </div>
                      ) : (
                        comboForm.products.map((product, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-gray-900">
                            <div className="flex-1">
                              <select
                                value={product.id || ''}
                                onChange={(e) => handleProductChange(index, 'id', e.target.value)}
                                className="w-full p-2 border rounded-md bg-background text-sm"
                              >
                                <option value="" disabled>Seleccionar producto</option>
                                {productos?.map(prod => (
                                  <option key={prod.id} value={prod.id}>
                                    {prod.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="w-20">
                            <Input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
                              min="1"
                              className="text-center text-sm"
                              placeholder="Cant."
                            />
                          </div>
                          <div className="w-24">
                            <Input
                              type="number"
                              value={product.price}
                              onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value) || 0)}
                              min="0"
                              className="text-center text-sm"
                              placeholder="Precio"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveProductFromCombo(index)}
                            className="text-red-500 hover:text-red-700 shrink-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Resumen de precios */}
                    {comboForm.products.length > 0 && (
                      <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span>Precio original:</span>
                          <span>{formatPrice(comboForm.products.reduce((sum, p) => sum + (p.price * p.quantity), 0))}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Descuento ({comboForm.discount}%):</span>
                          <span>-{formatPrice((comboForm.products.reduce((sum, p) => sum + (p.price * p.quantity), 0) * comboForm.discount) / 100)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-empanada-golden border-t pt-2">
                          <span>Precio final:</span>
                          <span>{formatPrice(comboForm.price)}</span>
                        </div>
                      </div>
                    )}
          </div>
        </div>
      </BrandedModal>

      {/* Modales */}
      <ConfirmModalComponent />
    </div>
  );
}