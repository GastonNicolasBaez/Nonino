// HERRAMIENTAS DE DESARROLLO - SOLO PARA TESTING
// Este archivo proporciona utilidades para probar el frontend sin backend
// NO INCLUIR EN PRODUCCIÓN

import { enableMockMode, disableMockMode } from '../services/mockApi.js';

// Hacer las funciones disponibles globalmente en desarrollo
if (import.meta.env.DEV) {
  window.enableMockMode = enableMockMode;
  window.disableMockMode = disableMockMode;
  
  // Función para probar rápidamente
  window.testProductOperations = () => {
    console.log(`
🧪 INSTRUCCIONES PARA PROBAR:

1. Habilitar modo mock:
   enableMockMode()

2. Ir al panel de administración
3. Crear o editar un producto
4. El botón "Actualizar/Crear producto" ahora funcionará

5. Para volver al modo normal:
   disableMockMode()

💡 Tip: Abre las DevTools (F12) para ver los logs del mock
    `);
  };

  // Habilitar mock automáticamente en desarrollo
  console.log('🔧 DevTools cargadas. Usa testProductOperations() para ver instrucciones');
  
  // Auto-habilitar mock en desarrollo para que funcione inmediatamente
  setTimeout(() => {
    enableMockMode();
    console.log('✅ Modo Mock auto-habilitado para testing');
  }, 1000);
}