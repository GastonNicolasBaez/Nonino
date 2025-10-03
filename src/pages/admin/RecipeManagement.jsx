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

// ICONOS
import {
  Search,
  Edit,
  CookingPot,
  ChefHat,
  Package,
  X,
  Plus,
  Minus,
  Save
} from "lucide-react";

// PROVIDERS
import { useAdminData } from "@/context/AdminDataProvider";

function RecipeManagement() {
  const { productos, inventario } = useAdminData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIngredients, setEditingIngredients] = useState([]);

  // Filtrar productos que tienen receta
  const productosConReceta = productos?.filter(producto =>
    producto.receta && producto.receta.length > 0
  ) || [];

  // Filtrar productos por término de búsqueda
  const productosFiltrados = productosConReceta.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditRecipe = (producto) => {
    setSelectedRecipe(producto);
    setEditingIngredients(
      producto.receta?.map(item => ({
        ...item,
        ingrediente: inventario?.find(ing => ing.id === item.ingredienteId) || {}
      })) || []
    );
    setIsEditModalOpen(true);
  };

  const handleAddIngredient = () => {
    const availableIngredients = inventario?.filter(ing =>
      !editingIngredients.some(editIng => editIng.ingredienteId === ing.id)
    ) || [];

    if (availableIngredients.length > 0) {
      setEditingIngredients([
        ...editingIngredients,
        {
          ingredienteId: availableIngredients[0].id,
          cantidad: 1,
          unidad: availableIngredients[0].unidadMedida || 'unidad',
          ingrediente: availableIngredients[0]
        }
      ]);
    }
  };

  const handleRemoveIngredient = (index) => {
    setEditingIngredients(editingIngredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...editingIngredients];
    updated[index] = { ...updated[index], [field]: value };

    if (field === 'ingredienteId') {
      const ingrediente = inventario?.find(ing => ing.id === value);
      updated[index].ingrediente = ingrediente || {};
      updated[index].unidad = ingrediente?.unidadMedida || 'unidad';
    }

    setEditingIngredients(updated);
  };

  const handleSaveRecipe = () => {
    // Aquí implementarías la lógica para guardar la receta editada
    toast.success(`Receta de ${selectedRecipe.nombre} actualizada correctamente`);
    setIsEditModalOpen(false);
    setSelectedRecipe(null);
    setEditingIngredients([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-empanada-golden flex items-center gap-3">
            <ChefHat className="w-8 h-8" />
            Gestión de Recetas
          </h1>
          <p className="text-muted-foreground mt-1">
            Edita las recetas de tus productos de empanadas
          </p>
        </div>
      </div>

      {/* Buscador */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar producto por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de productos con recetas */}
      <div className="grid gap-4">
        {productosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CookingPot className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? 'No se encontraron productos' : 'No hay productos con recetas'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? 'Intenta con otro término de búsqueda'
                  : 'Los productos con recetas aparecerán aquí'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          productosFiltrados.map((producto) => (
            <Card key={producto.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    {/* Imagen del producto */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {producto.imagen ? (
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Info del producto y receta */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{producto.nombre}</h3>
                        <Badge variant="secondary">
                          {producto.receta?.length || 0} ingredientes
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {producto.descripcion || 'Sin descripción'}
                      </p>

                      {/* Lista de ingredientes */}
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-empanada-golden">Ingredientes:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {producto.receta?.map((item, index) => {
                            const ingrediente = inventario?.find(ing => ing.id === item.ingredienteId);
                            return (
                              <div key={index} className="text-sm bg-gray-50 dark:bg-empanada-dark rounded px-2 py-1">
                                <span className="font-medium">{ingrediente?.nombre || 'Ingrediente no encontrado'}</span>
                                <span className="text-muted-foreground ml-2">
                                  {item.cantidad} {item.unidad}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón de editar */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditRecipe(producto)}
                    className="shrink-0"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Receta
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de edición de receta */}
      {isEditModalOpen && selectedRecipe && (
        <Portal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-lg shadow-xl max-w-6xl w-full max-h-[80vh] overflow-hidden">
              {/* Header del modal */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <CookingPot className="w-5 h-5 text-empanada-golden" />
                    Editar Receta: {selectedRecipe.nombre}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Modifica los ingredientes y cantidades de esta empanada
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Contenido del modal */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  {/* Lista de ingredientes editables */}
                  {editingIngredients.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                      {/* Selector de ingrediente */}
                      <div className="flex-1">
                        <select
                          value={item.ingredienteId}
                          onChange={(e) => handleIngredientChange(index, 'ingredienteId', e.target.value)}
                          className="w-full p-2 border rounded-md bg-background"
                        >
                          {inventario?.map(ingrediente => (
                            <option key={ingrediente.id} value={ingrediente.id}>
                              {ingrediente.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Cantidad */}
                      <div className="w-24">
                        <Input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => handleIngredientChange(index, 'cantidad', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.1"
                          className="text-center"
                        />
                      </div>

                      {/* Unidad */}
                      <div className="w-20">
                        <Input
                          value={item.unidad}
                          onChange={(e) => handleIngredientChange(index, 'unidad', e.target.value)}
                          className="text-center text-sm"
                        />
                      </div>

                      {/* Botón eliminar */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveIngredient(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Botón agregar ingrediente */}
                  <Button
                    variant="outline"
                    onClick={handleAddIngredient}
                    className="w-full"
                    disabled={!inventario || inventario.length === editingIngredients.length}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Ingrediente
                  </Button>
                </div>
              </div>

              {/* Footer del modal */}
              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 dark:bg-empanada-dark">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveRecipe}
                  className="bg-empanada-golden hover:bg-empanada-golden/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Receta
                </Button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

export { RecipeManagement };