import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

/**
 * Componente de demostración de las mejoras de UX/UI implementadas
 * Muestra las mejores prácticas aplicadas para evitar cortes en modales
 */
export function UXImprovementsDemo() {
  const improvements = [
    {
      title: "Portal para Dropdowns",
      description: "Los dropdowns ahora se renderizan fuera del contenedor del modal usando Portal, evitando cortes por overflow.",
      benefits: [
        "Sin cortes de información",
        "Posicionamiento inteligente",
        "Mejor experiencia de usuario"
      ],
      status: "implementado"
    },
    {
      title: "Cálculo Inteligente de Posición",
      description: "El sistema calcula automáticamente la mejor posición para mostrar dropdowns arriba o abajo según el espacio disponible.",
      benefits: [
        "Adaptación automática",
        "Máximo aprovechamiento del espacio",
        "Funciona en cualquier resolución"
      ],
      status: "implementado"
    },
    {
      title: "Componente SearchableInput Mejorado",
      description: "Nuevo componente de búsqueda con autocompletado que usa Portal para evitar cortes en modales.",
      benefits: [
        "Búsqueda fluida",
        "Sin cortes de sugerencias",
        "Mejor accesibilidad"
      ],
      status: "implementado"
    },
    {
      title: "Optimización de Modales",
      description: "Mejoras en la estructura de modales para mejor manejo del overflow y espacio disponible.",
      benefits: [
        "Mejor uso del espacio",
        "Scroll optimizado",
        "Responsive design"
      ],
      status: "implementado"
    },
    {
      title: "Hook useDropdownPosition",
      description: "Hook personalizado para calcular posiciones óptimas de dropdowns con detección de espacio disponible.",
      benefits: [
        "Reutilizable",
        "Cálculos precisos",
        "Fácil mantenimiento"
      ],
      status: "implementado"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Mejoras de UX/UI Implementadas
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Soluciones implementadas para evitar cortes de información en modales
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {improvements.map((improvement, index) => (
          <Card key={index} className="border-2 border-empanada-golden/20 hover:border-empanada-golden/40 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-800 dark:text-white">
                  {improvement.title}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-200 dark:border-green-700"
                >
                  {improvement.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {improvement.description}
              </p>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Beneficios:
                </h4>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  {improvement.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-empanada-golden rounded-full flex-shrink-0"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-empanada-golden/10 border border-empanada-golden/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          🎯 Mejores Prácticas Aplicadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <h4 className="font-medium mb-2">Accesibilidad:</h4>
            <ul className="space-y-1 text-xs">
              <li>• Navegación por teclado mejorada</li>
              <li>• Contraste de colores optimizado</li>
              <li>• Indicadores visuales claros</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Usabilidad:</h4>
            <ul className="space-y-1 text-xs">
              <li>• Feedback visual inmediato</li>
              <li>• Posicionamiento inteligente</li>
              <li>• Experiencia fluida sin cortes</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Rendimiento:</h4>
            <ul className="space-y-1 text-xs">
              <li>• Cálculos optimizados</li>
              <li>• Renderizado eficiente</li>
              <li>• Memoria optimizada</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Mantenibilidad:</h4>
            <ul className="space-y-1 text-xs">
              <li>• Código reutilizable</li>
              <li>• Hooks personalizados</li>
              <li>• Componentes modulares</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
