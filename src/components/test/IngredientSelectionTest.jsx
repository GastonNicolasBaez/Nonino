import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { SearchableInput } from '../ui/searchable-input';

/**
 * Componente de prueba para verificar que la selección de ingredientes funcione correctamente
 */
export function IngredientSelectionTest() {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const availableIngredients = [
    { id: '1', name: 'Harina', unit: 'kg' },
    { id: '2', name: 'Carne molida', unit: 'kg' },
    { id: '3', name: 'Cebolla', unit: 'unidad' },
    { id: '4', name: 'Aceite', unit: 'litro' },
    { id: '5', name: 'Sal', unit: 'gramos' },
    { id: '6', name: 'Pimienta', unit: 'gramos' },
    { id: '7', name: 'Huevo', unit: 'unidad' },
    { id: '8', name: 'Queso rallado', unit: 'gramos' },
    { id: '9', name: 'Tomate', unit: 'unidad' },
    { id: '10', name: 'Ajo', unit: 'diente' }
  ];

  const handleIngredientSelect = (ingredient) => {
    console.log('IngredientSelectionTest: Ingrediente seleccionado:', ingredient);
    setSelectedIngredient(ingredient);
  };

  const handleSearchChange = (value) => {
    console.log('IngredientSelectionTest: Cambiando búsqueda a:', value);
    setSearchTerm(value);
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Prueba de Selección de Ingredientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Buscar Ingrediente:
            </label>
            <SearchableInput
              value={searchTerm}
              onChange={handleSearchChange}
              options={availableIngredients}
              onSelect={handleIngredientSelect}
              placeholder="Buscar ingrediente y presionar Enter para agregar..."
              maxResults={5}
              noResultsText="No se encontró '{query}'"
              getOptionKey={(ingredient) => ingredient.id}
              getOptionLabel={(ingredient) => ingredient.name}
              getOptionSubtitle={(ingredient) => `${ingredient.unit} - Enter para agregar`}
            />
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <p className="text-sm">
              <strong>Ingrediente seleccionado:</strong>
            </p>
            {selectedIngredient ? (
              <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {selectedIngredient.name}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Unidad: {selectedIngredient.unit}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Ningún ingrediente seleccionado
              </p>
            )}
          </div>

          <div className="text-xs text-gray-500">
            <p>🔍 Abre la consola del navegador para ver los logs de depuración</p>
            <p>⌨️ Usa Enter para seleccionar el primer resultado</p>
            <p>🚫 Usa Escape para cerrar el dropdown</p>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Instrucciones de Prueba</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Escribe "carne" y selecciona "Carne molida"</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Escribe "ceb" y presiona Enter</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span>Escribe "xyz" para ver mensaje de no encontrado</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
