// Servicios API para NONINO EMPANADAS
// Preparado para backend en Kotlin con endpoints REST

import axios from 'axios';
import { 
  products, 
  categories, 
  stores, 
  promotions, 
  deliveryZones, 
  mockOrders,
  adminMetrics 
} from './mockData';

// Configuración base de Axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejo de respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Simula delay de red para testing
 * @param {number} ms - Milisegundos de delay
 * @returns {Promise} - Promise que se resuelve después del delay
 */
const simulateNetworkDelay = (ms = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// ============ AUTH SERVICES ============
export const authService = {
  async login(email, password) {
    await simulateNetworkDelay();
    // En producción: return api.post('/auth/login', { email, password });
    
    // Respuesta simulada para desarrollo
    if (email === 'admin@nonino.com' && password === 'admin123') {
      return {
        data: {
          user: {
            id: 'admin-1',
            email,
            name: 'Administrador',
            role: 'admin',
          },
          token: `jwt-token-${Date.now()}`,
        }
      };
    } else if (email && password) {
      return {
        data: {
          user: {
            id: 'user-1',
            email,
            name: 'Usuario Cliente',
            role: 'customer',
          },
          token: `jwt-token-${Date.now()}`,
        }
      };
    } else {
      throw new Error('Credenciales inválidas');
    }
  },

  async register(userData) {
    await simulateNetworkDelay();
    // En producción: return api.post('/auth/register', userData);
    
    return {
      data: {
        user: {
          id: `user-${Date.now()}`,
          ...userData,
          role: 'customer',
        },
        token: `jwt-token-${Date.now()}`,
      }
    };
  },

  async logout() {
    await simulateNetworkDelay(200);
    // En producción: return api.post('/auth/logout');
    return { data: { message: 'Logout successful' } };
  },

  async refreshToken() {
    await simulateNetworkDelay(300);
    // En producción: return api.post('/auth/refresh');
    return {
      data: { token: `jwt-token-${Date.now()}` }
    };
  },
};

// ============ PRODUCT SERVICES ============
export const productService = {
  async getAllProducts(filters = {}) {
    await simulateNetworkDelay();
    // En producción: return api.get('/products', { params: filters });
    
    let filteredProducts = [...products];
    
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.onlyAvailable) {
      filteredProducts = filteredProducts.filter(p => p.isAvailable);
    }

    return { data: filteredProducts };
  },

  async getProductById(id) {
    await simulateNetworkDelay();
    // En producción: return api.get(`/products/${id}`);
    
    const product = products.find(p => p.id === id);
    if (!product) throw new Error('Producto no encontrado');
    
    return { data: product };
  },

  async getCategories() {
    await simulateNetworkDelay(300);
    // En producción: return api.get('/categories');
    return { data: categories };
  },

  async getPopularProducts() {
    await simulateNetworkDelay();
    // En producción: return api.get('/products/popular');
    return { 
      data: products.filter(p => p.isPopular).slice(0, 6) 
    };
  },
};

// ============ STORE SERVICES ============
export const storeService = {
  async getAllStores() {
    await simulateNetworkDelay();
    // En producción: return api.get('/stores');
    return { data: stores };
  },

  async getStoreById(id) {
    await simulateNetworkDelay();
    // En producción: return api.get(`/stores/${id}`);
    
    const store = stores.find(s => s.id === id);
    if (!store) throw new Error('Local no encontrado');
    
    return { data: store };
  },

  async getDeliveryZones() {
    await simulateNetworkDelay(300);
    // En producción: return api.get('/delivery/zones');
    return { data: deliveryZones };
  },
};

// ============ ORDER SERVICES ============
export const orderService = {
  async createOrder(orderData) {
    await simulateNetworkDelay(1000);
    // En producción: return api.post('/orders', orderData);
    
    const newOrder = {
      id: `EMP-${Date.now()}`,
      ...orderData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: '45-60 min',
    };
    
    return { data: newOrder };
  },

  async getOrderById(id) {
    await simulateNetworkDelay();
    // En producción: return api.get(`/orders/${id}`);
    
    const order = mockOrders.find(o => o.id === id);
    if (!order) throw new Error('Pedido no encontrado');
    
    return { data: order };
  },

  async getUserOrders(userId) {
    await simulateNetworkDelay();
    // En producción: return api.get(`/users/${userId}/orders`);
    
    return { 
      data: mockOrders.filter(o => o.customerId === userId) 
    };
  },

  async updateOrderStatus(orderId, status) {
    await simulateNetworkDelay(500);
    // En producción: return api.patch(`/orders/${orderId}/status`, { status });
    
    return { 
      data: { 
        id: orderId, 
        status, 
        updatedAt: new Date().toISOString() 
      } 
    };
  },

  async cancelOrder(orderId) {
    await simulateNetworkDelay();
    // En producción: return api.delete(`/orders/${orderId}`);
    
    return { 
      data: { 
        id: orderId, 
        status: 'cancelled', 
        cancelledAt: new Date().toISOString() 
      } 
    };
  },
};

// ============ PROMOTION SERVICES ============
export const promotionService = {
  async getActivePromotions() {
    await simulateNetworkDelay();
    // En producción: return api.get('/promotions/active');
    
    return { 
      data: promotions.filter(p => p.isActive) 
    };
  },

  async validatePromoCode(code) {
    await simulateNetworkDelay(300);
    // En producción: return api.post('/promotions/validate', { code });
    
    const promoCodes = {
      'BIENVENIDO10': { discount: 10, type: 'percentage' },
      'ENVIOGRATIS': { discount: 0, type: 'free_shipping' },
      'EMPANADAS20': { discount: 20, type: 'percentage' },
      'NUEVOCLIENTE': { discount: 15, type: 'percentage' },
    };
    
    const promo = promoCodes[code.toUpperCase()];
    if (!promo) throw new Error('Código promocional inválido');
    
    return { data: { code: code.toUpperCase(), ...promo } };
  },
};

// ============ ADMIN SERVICES ============
export const adminService = {
  async getDashboardMetrics() {
    await simulateNetworkDelay();
    // En producción: return api.get('/admin/metrics');
    return { data: adminMetrics };
  },

  async getAllOrders(filters = {}) {
    await simulateNetworkDelay();
    // En producción: return api.get('/admin/orders', { params: filters });
    
    let filteredOrders = [...mockOrders];
    
    if (filters.status) {
      filteredOrders = filteredOrders.filter(o => o.status === filters.status);
    }
    
    if (filters.dateFrom) {
      filteredOrders = filteredOrders.filter(o => 
        new Date(o.createdAt) >= new Date(filters.dateFrom)
      );
    }
    
    return { data: filteredOrders };
  },

  async updateProduct(productId, productData) {
    await simulateNetworkDelay(800);
    // En producción: return api.put(`/admin/products/${productId}`, productData);
    
    return { 
      data: { 
        id: productId, 
        ...productData, 
        updatedAt: new Date().toISOString() 
      } 
    };
  },

  async createProduct(productData) {
    await simulateNetworkDelay(800);
    // En producción: return api.post('/admin/products', productData);
    
    return { 
      data: { 
        id: `emp-${Date.now()}`, 
        ...productData, 
        createdAt: new Date().toISOString() 
      } 
    };
  },

  async deleteProduct(productId) {
    await simulateNetworkDelay(500);
    // En producción: return api.delete(`/admin/products/${productId}`);
    
    return { 
      data: { 
        id: productId, 
        deletedAt: new Date().toISOString() 
      } 
    };
  },
};

// ============ USER SERVICES ============
export const userService = {
  async updateProfile(userId, userData) {
    await simulateNetworkDelay(600);
    // En producción: return api.put(`/users/${userId}`, userData);
    
    return { 
      data: { 
        id: userId, 
        ...userData, 
        updatedAt: new Date().toISOString() 
      } 
    };
  },

  async getUserAddresses(userId) {
    await simulateNetworkDelay();
    // En producción: return api.get(`/users/${userId}/addresses`);
    
    return { 
      data: [
        {
          id: 'addr-1',
          type: 'home',
          address: 'Av. Corrientes 1234',
          city: 'CABA',
          zone: 'centro',
          isDefault: true,
        }
      ] 
    };
  },

  async addUserAddress(userId, addressData) {
    await simulateNetworkDelay(500);
    // En producción: return api.post(`/users/${userId}/addresses`, addressData);
    
    return { 
      data: { 
        id: `addr-${Date.now()}`, 
        ...addressData,
        userId,
        createdAt: new Date().toISOString() 
      } 
    };
  },
};

export default api;
