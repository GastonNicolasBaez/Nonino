/**
 * ADMIN SERVICE - NONINO EMPANADAS
 * Servicio especializado para funciones administrativas
 * Preparado para PostgreSQL y API REST integration
 */

import axios from 'axios';
import { mockDashboardData, mockOrders, mockCustomers, mockInventory } from '../lib/mockData';

// Configuración optimizada para admin
const ADMIN_API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/admin',
  timeout: 15000, // Más tiempo para reportes pesados
  enableMockFallback: import.meta.env.VITE_ENABLE_MOCK_DATA !== 'false',
  enableDebugLogs: import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true'
};

// Cliente axios específico para admin con interceptors optimizados
const adminApi = axios.create({
  baseURL: ADMIN_API_CONFIG.baseURL,
  timeout: ADMIN_API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'X-Admin-Request': 'true'
  }
});

// Interceptor para agregar autenticación
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Logs de debug si están habilitados
    if (ADMIN_API_CONFIG.enableDebugLogs) {
      console.log(`🔧 Admin API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejo de respuestas con fallback automático
adminApi.interceptors.response.use(
  (response) => {
    if (ADMIN_API_CONFIG.enableDebugLogs) {
      console.log(`✅ Admin API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (ADMIN_API_CONFIG.enableDebugLogs) {
      console.warn(`❌ Admin API Error: ${error.response?.status || 'Network'} ${error.config?.url}`);
    }
    
    // Redirección automática si no autorizado
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    
    return Promise.reject(error);
  }
);

// Función helper para simular delays de API
const simulateApiDelay = (data, delay = 300) => {
  return new Promise(resolve => 
    setTimeout(() => resolve({ data }), delay + Math.random() * 200)
  );
};

// Función helper para manejo de errores con fallback
const handleApiError = async (apiCall, fallbackData, errorContext) => {
  if (ADMIN_API_CONFIG.enableMockFallback) {
    try {
      return await apiCall();
    } catch (error) {
      if (ADMIN_API_CONFIG.enableDebugLogs) {
        console.warn(`🔄 Fallback activated for ${errorContext}:`, error.message);
      }
      return simulateApiDelay(fallbackData);
    }
  }
  
  return apiCall();
};

/**
 * DASHBOARD SERVICES
 */
export const dashboardService = {
  async getMetrics() {
    return handleApiError(
      () => adminApi.get('/dashboard/metrics'),
      mockDashboardData.metrics,
      'dashboard metrics'
    );
  },

  async getRecentActivity() {
    return handleApiError(
      () => adminApi.get('/dashboard/activity'),
      mockDashboardData.recentOrders.slice(0, 5),
      'recent activity'
    );
  },

  async getSalesChart(period = '7d') {
    return handleApiError(
      () => adminApi.get(`/dashboard/sales?period=${period}`),
      mockDashboardData.metrics.salesData,
      'sales chart'
    );
  }
};

/**
 * ORDERS SERVICES
 */
export const ordersService = {
  async getAllOrders(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return handleApiError(
      () => adminApi.get(`/orders?${params}`),
      mockOrders,
      'orders list'
    );
  },

  async getOrderById(orderId) {
    return handleApiError(
      () => adminApi.get(`/orders/${orderId}`),
      mockOrders.find(o => o.id === orderId),
      `order ${orderId}`
    );
  },

  async createOrder(orderData) {
    const processedData = {
      ...orderData,
      id: `EMP-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    return handleApiError(
      () => adminApi.post('/orders', processedData),
      processedData,
      'create order'
    );
  },

  async updateOrder(orderId, updates) {
    return handleApiError(
      () => adminApi.put(`/orders/${orderId}`, updates),
      { ...mockOrders.find(o => o.id === orderId), ...updates },
      `update order ${orderId}`
    );
  },

  async updateOrderStatus(orderId, status) {
    return handleApiError(
      () => adminApi.patch(`/orders/${orderId}/status`, { status }),
      { id: orderId, status, updatedAt: new Date().toISOString() },
      `update order status ${orderId}`
    );
  },

  async deleteOrder(orderId) {
    return handleApiError(
      () => adminApi.delete(`/orders/${orderId}`),
      { success: true, deletedId: orderId },
      `delete order ${orderId}`
    );
  }
};

/**
 * CUSTOMERS SERVICES
 */
export const customersService = {
  async getAllCustomers(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return handleApiError(
      () => adminApi.get(`/customers?${params}`),
      mockCustomers,
      'customers list'
    );
  },

  async getCustomerById(customerId) {
    return handleApiError(
      () => adminApi.get(`/customers/${customerId}`),
      mockCustomers.find(c => c.id === customerId),
      `customer ${customerId}`
    );
  },

  async createCustomer(customerData) {
    const processedData = {
      ...customerData,
      id: `CUST-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    return handleApiError(
      () => adminApi.post('/customers', processedData),
      processedData,
      'create customer'
    );
  },

  async updateCustomer(customerId, updates) {
    return handleApiError(
      () => adminApi.put(`/customers/${customerId}`, updates),
      { ...mockCustomers.find(c => c.id === customerId), ...updates },
      `update customer ${customerId}`
    );
  },

  async deleteCustomer(customerId) {
    return handleApiError(
      () => adminApi.delete(`/customers/${customerId}`),
      { success: true, deletedId: customerId },
      `delete customer ${customerId}`
    );
  },

  async toggleCustomerStatus(customerId) {
    const customer = mockCustomers.find(c => c.id === customerId);
    const newStatus = customer?.status === 'active' ? 'inactive' : 'active';
    
    return handleApiError(
      () => adminApi.patch(`/customers/${customerId}/status`, { status: newStatus }),
      { id: customerId, status: newStatus },
      `toggle customer status ${customerId}`
    );
  }
};

/**
 * INVENTORY SERVICES
 */
export const inventoryService = {
  async getAllInventory(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return handleApiError(
      () => adminApi.get(`/inventory?${params}`),
      mockInventory,
      'inventory list'
    );
  },

  async addInventoryItem(itemData) {
    const processedData = {
      ...itemData,
      id: `INV-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    return handleApiError(
      () => adminApi.post('/inventory', processedData),
      processedData,
      'add inventory item'
    );
  },

  async updateStock(itemId, newStock, reason = 'manual_adjustment') {
    const updateData = {
      stock: newStock,
      lastUpdated: new Date().toISOString(),
      reason
    };

    return handleApiError(
      () => adminApi.patch(`/inventory/${itemId}/stock`, updateData),
      { id: itemId, ...updateData },
      `update stock ${itemId}`
    );
  },

  async deleteInventoryItem(itemId) {
    return handleApiError(
      () => adminApi.delete(`/inventory/${itemId}`),
      { success: true, deletedId: itemId },
      `delete inventory item ${itemId}`
    );
  }
};

/**
 * REPORTS SERVICES
 */
export const reportsService = {
  async generateReport(reportType, filters = {}) {
    const reportData = {
      type: reportType,
      filters,
      generatedAt: new Date().toISOString()
    };

    return handleApiError(
      () => adminApi.post('/reports/generate', reportData),
      { ...reportData, id: `RPT-${Date.now()}`, status: 'completed' },
      `generate ${reportType} report`
    );
  },

  async exportToPDF(reportType, filters = {}) {
    return handleApiError(
      () => adminApi.post('/reports/export/pdf', { type: reportType, filters }, { 
        responseType: 'blob' 
      }),
      new Blob(['Mock PDF data'], { type: 'application/pdf' }),
      `export ${reportType} to PDF`
    );
  },

  async getSalesReport(period = '30d') {
    return handleApiError(
      () => adminApi.get(`/reports/sales?period=${period}`),
      mockDashboardData.metrics.salesData,
      'sales report'
    );
  }
};

/**
 * SETTINGS SERVICES  
 */
export const settingsService = {
  async getSettings() {
    const defaultSettings = {
      general: {
        siteName: 'Nonino Empanadas',
        timezone: 'America/Argentina/Buenos_Aires',
        language: 'es'
      },
      notifications: {
        email: true,
        push: false,
        sms: true
      },
      business: {
        currency: 'ARS',
        tax: 21,
        deliveryFee: 500
      }
    };

    return handleApiError(
      () => adminApi.get('/settings'),
      defaultSettings,
      'settings'
    );
  },

  async updateSettings(settings) {
    return handleApiError(
      () => adminApi.put('/settings', settings),
      { ...settings, updatedAt: new Date().toISOString() },
      'update settings'
    );
  }
};

// Export default con todos los servicios
export default {
  dashboard: dashboardService,
  orders: ordersService,
  customers: customersService,
  inventory: inventoryService,
  reports: reportsService,
  settings: settingsService
};
