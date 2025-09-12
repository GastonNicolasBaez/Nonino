// Servicios API para NONINO EMPANADAS
// Preparado para backend en Kotlin con endpoints REST

import axios from 'axios';

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

// ============ AUTH SERVICES ============
export const authService = {
  async login(email, password) {
    return api.post('/auth/login', { email, password });
  },

  async register(userData) {
    return api.post('/auth/register', userData);
  },

  async logout() {
    return api.post('/auth/logout');
  },

  async refreshToken() {
    return api.post('/auth/refresh');
  },
};

// ============ PRODUCT SERVICES ============
export const productService = {
  async getAllProducts(filters = {}) {
    return api.get('/products', { params: filters });
  },

  async getProductById(id) {
    return api.get(`/products/${id}`);
  },

  async getCategories() {
    return api.get('/categories');
  },

  async getPopularProducts() {
    return api.get('/products/popular');
  },
};

// ============ STORE SERVICES ============
export const storeService = {
  async getAllStores() {
    return api.get('/stores');
  },

  async getStoreById(id) {
    return api.get(`/stores/${id}`);
  },

  async getDeliveryZones() {
    return api.get('/delivery/zones');
  },
};

// ============ ORDER SERVICES ============
export const orderService = {
  async createOrder(orderData) {
    // Formatear los datos para el backend según las especificaciones:
    // - items: array con precio por unidad, sku y cantidad
    // - currency: tipo de moneda
    const backendOrderData = {
      items: orderData.items.map(item => ({
        sku: item.sku || item.id, // Usar sku si existe, sino el id del producto
        quantity: item.quantity,
        unitPrice: item.price,
        name: item.name // Información adicional para el frontend
      })),
      currency: 'ARS', // Pesos argentinos
      customerInfo: orderData.customerInfo,
      deliveryType: orderData.deliveryType,
      address: orderData.deliveryType === 'delivery' ? orderData.address : null,
      paymentMethod: orderData.paymentMethod,
      notes: orderData.notes,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      deliveryFee: orderData.deliveryFee,
      total: orderData.total
    };
    
    return api.post('/orders', backendOrderData);
  },

  async getOrderById(id) {
    return api.get(`/orders/${id}`);
  },

  async getUserOrders(userId) {
    return api.get(`/users/${userId}/orders`);
  },

  async updateOrderStatus(orderId, status) {
    return api.patch(`/orders/${orderId}/status`, { status });
  },

  async cancelOrder(orderId) {
    return api.delete(`/orders/${orderId}`);
  },
};

// ============ PROMOTION SERVICES ============
export const promotionService = {
  async getActivePromotions() {
    return api.get('/promotions/active');
  },

  async validatePromoCode(code) {
    return api.post('/promotions/validate', { code });
  },
};

// ============ IMAGE SERVICES ============
export const imageService = {
  async uploadImage(file, type = 'product') {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    return api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async uploadProductImage(productId, file) {
    const formData = new FormData();
    formData.append('image', file);

    return api.post(`/products/${productId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async deleteImage(imageId) {
    return api.delete(`/images/${imageId}`);
  },

  async processImage(imageId, options = {}) {
    return api.post(`/images/${imageId}/process`, {
      resize: options.resize,
      crop: options.crop,
      format: options.format || 'jpeg',
      quality: options.quality || 80,
    });
  },
};

// ============ ADMIN SERVICES ============
export const adminService = {
  async getDashboardMetrics() {
    return api.get('/admin/metrics');
  },

  async getAllOrders(filters = {}) {
    return api.get('/admin/orders', { params: filters });
  },

  async updateProduct(productId, productData) {
    // Si hay imagen nueva, subirla primero
    if (productData.image instanceof File) {
      try {
        const imageResponse = await imageService.uploadProductImage(productId, productData.image);
        productData.imageUrl = imageResponse.data.imageUrl;
        delete productData.image; // Remover el archivo del objeto
      } catch (error) {
        console.error('Error al subir imagen:', error);
        throw new Error('Error al procesar la imagen');
      }
    }
    
    return api.put(`/admin/products/${productId}`, productData);
  },

  async createProduct(productData) {
    let imageUrl = null;
    
    // Si hay imagen, subirla primero
    if (productData.image instanceof File) {
      try {
        const imageResponse = await imageService.uploadImage(productData.image, 'product');
        imageUrl = imageResponse.data.imageUrl;
      } catch (error) {
        console.error('Error al subir imagen:', error);
        throw new Error('Error al procesar la imagen');
      }
    }

    // Crear producto con la URL de la imagen
    const productPayload = {
      ...productData,
      imageUrl,
    };
    delete productPayload.image; // Remover el archivo del objeto

    return api.post('/admin/products', productPayload);
  },

  async deleteProduct(productId) {
    return api.delete(`/admin/products/${productId}`);
  },
};

// ============ USER SERVICES ============
export const userService = {
  async updateProfile(userId, userData) {
    return api.put(`/users/${userId}`, userData);
  },

  async getUserAddresses(userId) {
    return api.get(`/users/${userId}/addresses`);
  },

  async addUserAddress(userId, addressData) {
    return api.post(`/users/${userId}/addresses`, addressData);
  },
};

export default api;
