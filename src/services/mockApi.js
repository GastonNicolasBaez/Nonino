// ARCHIVO TEMPORAL SOLO PARA TESTING
// Este archivo simula las respuestas del backend para poder probar el frontend
// NO INCLUIR EN PRODUCCIÓN - solo para desarrollo y pruebas

// Mock de respuestas del backend
export const mockAdminService = {
  async updateProduct(productId, productData) {
    console.log('🔍 Mock: Actualizando producto:', productId, productData);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular respuesta exitosa del backend
    return {
      data: {
        id: productId,
        ...productData,
        updatedAt: new Date().toISOString()
      },
      status: 200,
      message: 'Producto actualizado correctamente'
    };
  },

  async createProduct(productData) {
    console.log('🔍 Mock: Creando producto:', productData);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular respuesta exitosa del backend
    return {
      data: {
        id: `emp-${Date.now()}`,
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      status: 201,
      message: 'Producto creado correctamente'
    };
  },

  async deleteProduct(productId) {
    console.log('🔍 Mock: Eliminando producto:', productId);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      data: { id: productId },
      status: 200,
      message: 'Producto eliminado correctamente'
    };
  }
};

// Función para habilitar/deshabilitar el mock
export const enableMockMode = () => {
  console.log('🚀 Modo Mock habilitado - Las operaciones funcionarán sin backend');
  
  // Reemplazar temporalmente el adminService
  const originalAdminService = window.__originalAdminService || {};
  
  if (!window.__originalAdminService) {
    // Guardar referencia original solo la primera vez
    import('./api.js').then(({ adminService }) => {
      window.__originalAdminService = { ...adminService };
    });
  }
  
  // Reemplazar con mock
  import('./api.js').then(({ adminService }) => {
    Object.assign(adminService, mockAdminService);
  });
};

export const disableMockMode = () => {
  console.log('🔌 Modo Mock deshabilitado - Volviendo al backend real');
  
  if (window.__originalAdminService) {
    import('./api.js').then(({ adminService }) => {
      Object.assign(adminService, window.__originalAdminService);
    });
  }
};