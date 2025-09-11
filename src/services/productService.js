// Servicio de productos preparado para base de datos

// Datos mock para desarrollo
const mockProducts = [
  { id: "emp-001", name: "Empanada de Carne", price: 800, category: "Tradicionales", stock: 50, image: "/images/empanada-carne.jpg" },
  { id: "emp-002", name: "Empanada de Pollo", price: 750, category: "Tradicionales", stock: 45, image: "/images/empanada-pollo.jpg" },
  { id: "emp-003", name: "Empanada de Jamón y Queso", price: 630, category: "Tradicionales", stock: 30, image: "/images/empanada-jamon-queso.jpg" },
  { id: "emp-004", name: "Empanada de Cordero", price: 900, category: "Premium", stock: 20, image: "/images/empanada-cordero.jpg" },
  { id: "emp-005", name: "Empanada de Verduras", price: 600, category: "Vegetarianas", stock: 25, image: "/images/empanada-verduras.jpg" },
  { id: "emp-006", name: "Empanada de Humita", price: 680, category: "Vegetarianas", stock: 35, image: "/images/empanada-humita.jpg" },
  { id: "emp-007", name: "Empanada de Caprese", price: 720, category: "Vegetarianas", stock: 28, image: "/images/empanada-caprese.jpg" },
  { id: "emp-008", name: "Empanada de Mariscos", price: 950, category: "Premium", stock: 15, image: "/images/empanada-mariscos.jpg" },
  { id: "emp-009", name: "Empanada de Dulce de Leche", price: 550, category: "Dulces", stock: 40, image: "/images/empanada-dulce-leche.jpg" },
  { id: "emp-010", name: "Empanada de Manzana", price: 580, category: "Dulces", stock: 32, image: "/images/empanada-manzana.jpg" },
  { id: "emp-011", name: "Empanada de Atún", price: 720, category: "Tradicionales", stock: 22, image: "/images/empanada-atun.jpg" },
  { id: "emp-012", name: "Empanada de Cebolla y Queso", price: 650, category: "Vegetarianas", stock: 30, image: "/images/empanada-cebolla-queso.jpg" },
  { id: "emp-013", name: "Empanada de Trucha", price: 850, category: "Premium", stock: 18, image: "/images/empanada-trucha.jpg" },
  { id: "emp-014", name: "Empanada de Espinaca", price: 620, category: "Vegetarianas", stock: 26, image: "/images/empanada-espinaca.jpg" },
  { id: "emp-015", name: "Empanada de Membrillo", price: 560, category: "Dulces", stock: 20, image: "/images/empanada-membrillo.jpg" }
];

// Configuración de API
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 5000,
  // Habilitar mock por defecto en desarrollo si no hay configuración específica
  enableMockFallback: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true' || 
                     import.meta.env.VITE_ENABLE_MOCK_DATA === undefined
};

// Simular delay de red para desarrollo (mínimo para mejor UX)
const simulateNetworkDelay = () => {
  return new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
};

// Función helper para manejar errores de API
const handleApiError = (error, fallbackData = []) => {
  console.warn('API Error:', error.message);
  
  if (API_CONFIG.enableMockFallback) {
    console.log('Fallback to mock data');
    return fallbackData;
  }
  
  throw error;
};

// Función para hacer peticiones HTTP
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Network Error: ${error.message}`);
  }
};

// Servicio de productos
export const productService = {
  // Obtener todos los productos
  async getAllProducts() {
    try {
      // Intentar llamada a la API
      const response = await apiRequest('/products');
      return response.data || response;
    } catch (error) {
      // Fallback a datos mock
      return handleApiError(error, mockProducts);
    }
  },

  // Buscar productos por término de búsqueda
  async searchProducts(searchTerm = '', category = '') {
    // Si no hay API configurada o estamos en modo mock, usar datos locales directamente
    if (!import.meta.env.VITE_API_URL || API_CONFIG.enableMockFallback) {
      await simulateNetworkDelay();
      
      const filtered = mockProducts.filter(product => {
        const matchesSearch = !searchTerm || 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = !category || 
          product.category.toLowerCase() === category.toLowerCase();
        
        return matchesSearch && matchesCategory;
      });
      
      return filtered;
    }

    try {
      // Construir query params
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (category) params.append('category', category);
      
      const queryString = params.toString();
      const endpoint = `/products/search${queryString ? `?${queryString}` : ''}`;
      
      // Intentar llamada a la API
      const response = await apiRequest(endpoint);
      return response.data || response;
    } catch (error) {
      // Fallback a búsqueda en datos mock
      await simulateNetworkDelay();
      
      const filtered = mockProducts.filter(product => {
        const matchesSearch = !searchTerm || 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = !category || 
          product.category.toLowerCase() === category.toLowerCase();
        
        return matchesSearch && matchesCategory;
      });
      
      return handleApiError(error, filtered);
    }
  },

  // Obtener producto por ID
  async getProductById(id) {
    try {
      const response = await apiRequest(`/products/${id}`);
      return response.data || response;
    } catch (error) {
      await simulateNetworkDelay();
      const product = mockProducts.find(p => p.id === id);
      return handleApiError(error, product);
    }
  },

  // Obtener productos por categoría
  async getProductsByCategory(category) {
    try {
      const response = await apiRequest(`/products/category/${category}`);
      return response.data || response;
    } catch (error) {
      await simulateNetworkDelay();
      const filtered = mockProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
      return handleApiError(error, filtered);
    }
  },

  // Obtener categorías disponibles
  async getCategories() {
    // Si no hay API configurada o estamos en modo mock, usar datos locales directamente
    if (!import.meta.env.VITE_API_URL || API_CONFIG.enableMockFallback) {
      await simulateNetworkDelay();
      const categories = [...new Set(mockProducts.map(p => p.category))];
      return categories;
    }

    try {
      const response = await apiRequest('/products/categories');
      return response.data || response;
    } catch (error) {
      await simulateNetworkDelay();
      const categories = [...new Set(mockProducts.map(p => p.category))];
      return handleApiError(error, categories);
    }
  },

  // Verificar stock de producto
  async checkStock(productId, quantity = 1) {
    try {
      const response = await apiRequest(`/products/${productId}/stock?quantity=${quantity}`);
      return response.data || response;
    } catch (error) {
      await simulateNetworkDelay();
      const product = mockProducts.find(p => p.id === productId);
      const isAvailable = product && product.stock >= quantity;
      return handleApiError(error, { 
        available: isAvailable, 
        stock: product?.stock || 0 
      });
    }
  },

  // Funciones para administración (futuras)
  async createProduct(productData) {
    try {
      const response = await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
      return response.data || response;
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  },

  async updateProduct(id, productData) {
    try {
      const response = await apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
      return response.data || response;
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  },

  async deleteProduct(id) {
    try {
      const response = await apiRequest(`/products/${id}`, {
        method: 'DELETE'
      });
      return response.data || response;
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }
};

// Hook personalizado para usar el servicio en componentes React
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async (searchTerm = '', category = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await productService.searchProducts(searchTerm, category);
      setProducts(data);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    refetch: fetchProducts
  };
};

// Exportar datos mock para uso directo si es necesario
export { mockProducts };
