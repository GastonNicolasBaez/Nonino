import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CustomSelect } from '../ui/custom-select';

/**
 * Componente de prueba para verificar que la selección de categorías funcione correctamente
 * y que los dropdowns se muestren completamente sin cortes
 */
export function CategorySelectionTest() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategory2, setSelectedCategory2] = useState('');
  
  const categoryOptions = [
    { value: '', label: 'Seleccionar categoría' },
    { value: '1', label: 'Empanadas Tradicionales' },
    { value: '2', label: 'Empanadas Especiales' },
    { value: '3', label: 'Bebidas Frías' },
    { value: '4', label: 'Bebidas Calientes' },
    { value: '5', label: 'Postres Caseros' },
    { value: '6', label: 'Promociones del Día' },
    { value: '7', label: 'Combos Familiares' },
    { value: '8', label: 'Ofertas Especiales' }
  ];

  const handleCategoryChange = (value) => {
    console.log('CategorySelectionTest: Valor seleccionado:', value);
    setSelectedCategory(value);
  };

  const handleCategoryChange2 = (value) => {
    console.log('CategorySelectionTest 2: Valor seleccionado:', value);
    setSelectedCategory2(value);
  };

  const selectedCategoryName = categoryOptions.find(opt => opt.value === selectedCategory)?.label || 'Ninguna';
  const selectedCategoryName2 = categoryOptions.find(opt => opt.value === selectedCategory2)?.label || 'Ninguna';

  return (
    <div className="space-y-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Prueba de Selección con Portal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Categoría (con Portal):
            </label>
            <CustomSelect
              value={selectedCategory}
              onChange={handleCategoryChange}
              options={categoryOptions}
              placeholder="Seleccionar categoría"
              usePortal={true}
            />
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <p className="text-sm">
              <strong>Valor seleccionado:</strong> {selectedCategory}
            </p>
            <p className="text-sm">
              <strong>Nombre:</strong> {selectedCategoryName}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Prueba de Selección sin Portal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Categoría (sin Portal):
            </label>
            <CustomSelect
              value={selectedCategory2}
              onChange={handleCategoryChange2}
              options={categoryOptions}
              placeholder="Seleccionar categoría"
              usePortal={false}
            />
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <p className="text-sm">
              <strong>Valor seleccionado:</strong> {selectedCategory2}
            </p>
            <p className="text-sm">
              <strong>Nombre:</strong> {selectedCategoryName2}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-gray-500">
        <p>✅ Portal: Dropdown se muestra completamente fuera del contenedor</p>
        <p>❌ Sin Portal: Dropdown puede cortarse si el contenedor tiene overflow</p>
        <p>🔍 Abre la consola del navegador para ver los logs de depuración</p>
      </div>
    </div>
  );
}
