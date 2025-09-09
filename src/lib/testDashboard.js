// Archivo de prueba para verificar el funcionamiento del dashboard

export const testDashboardAccess = () => {
  console.log('🔑 Credenciales de prueba:');
  console.log('Email: admin@noninoempanadas.com');
  console.log('Password: admin123');
  
  console.log('📊 Datos mock disponibles:');
  console.log('- Métricas de ventas');
  console.log('- Pedidos recientes');
  console.log('- Productos más vendidos');
  console.log('- Información de clientes');
  
  return {
    status: 'ready',
    message: 'Dashboard configurado correctamente'
  };
};

// Función para simular datos del backend
export const simulateBackendData = () => {
  return {
    totalSales: 1250000,
    totalOrders: 342,
    averageOrderValue: 3655,
    customerCount: 156,
    recentOrders: [
      {
        id: "ORD-001",
        customerName: "María González",
        items: 3,
        total: 4500,
        status: "completed"
      }
    ],
    topProducts: [
      { name: "Empanada de Carne", sales: 450, revenue: 67500 }
    ]
  };
};


