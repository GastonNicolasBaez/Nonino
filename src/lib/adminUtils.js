/**
 * ADMIN UTILITIES - NONINO EMPANADAS
 * Utilidades específicas para funciones administrativas
 * Optimizadas para PostgreSQL integration
 */

import { formatPrice, formatDate, formatDateTime } from './utils';

/**
 * CONSTANTS FOR ADMIN OPERATIONS
 */
export const ADMIN_CONSTANTS = {
  ORDER_STATUSES: {
    PENDING: 'pending',
    PREPARING: 'preparing', 
    READY: 'ready',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
  },
  
  CUSTOMER_STATUSES: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    BANNED: 'banned'
  },

  PRODUCT_CATEGORIES: {
    TRADICIONALES: 'Tradicionales',
    PREMIUM: 'Premium',
    VEGETARIANAS: 'Vegetarianas',
    DULCES: 'Dulces'
  },

  REPORT_TYPES: {
    SALES: 'sales',
    CUSTOMERS: 'customers',
    INVENTORY: 'inventory',
    FINANCIAL: 'financial'
  },

  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
  }
};

/**
 * STATUS UTILITIES
 */
export const getStatusVariant = (status) => {
  const statusMap = {
    [ADMIN_CONSTANTS.ORDER_STATUSES.PENDING]: 'yellow',
    [ADMIN_CONSTANTS.ORDER_STATUSES.PREPARING]: 'blue',
    [ADMIN_CONSTANTS.ORDER_STATUSES.READY]: 'purple',
    [ADMIN_CONSTANTS.ORDER_STATUSES.DELIVERED]: 'green',
    [ADMIN_CONSTANTS.ORDER_STATUSES.CANCELLED]: 'red'
  };
  return statusMap[status] || 'gray';
};

export const getStatusLabel = (status) => {
  const labelMap = {
    [ADMIN_CONSTANTS.ORDER_STATUSES.PENDING]: 'Pendiente',
    [ADMIN_CONSTANTS.ORDER_STATUSES.PREPARING]: 'Preparando',
    [ADMIN_CONSTANTS.ORDER_STATUSES.READY]: 'Listo',
    [ADMIN_CONSTANTS.ORDER_STATUSES.DELIVERED]: 'Entregado',
    [ADMIN_CONSTANTS.ORDER_STATUSES.CANCELLED]: 'Cancelado'
  };
  return labelMap[status] || status;
};

export const getPriorityLevel = (order) => {
  const now = new Date();
  const orderDate = new Date(order.date || order.createdAt);
  const hoursDiff = (now - orderDate) / (1000 * 60 * 60);
  
  if (hoursDiff > 4) return 'high';
  if (hoursDiff > 2) return 'medium'; 
  return 'low';
};

/**
 * SEARCH AND FILTER UTILITIES
 */
export const createSearchFilter = (searchTerm, fields) => {
  if (!searchTerm?.trim()) return () => true;
  
  const normalizedTerm = searchTerm.toLowerCase().trim();
  
  return (item) => {
    return fields.some(field => {
      const value = getNestedValue(item, field);
      return value?.toString().toLowerCase().includes(normalizedTerm);
    });
  };
};

export const createStatusFilter = (statusFilter) => {
  if (!statusFilter || statusFilter === 'all') return () => true;
  return (item) => item.status === statusFilter;
};

export const createDateRangeFilter = (startDate, endDate, dateField = 'date') => {
  if (!startDate && !endDate) return () => true;
  
  return (item) => {
    const itemDate = new Date(getNestedValue(item, dateField));
    if (isNaN(itemDate.getTime())) return false;
    
    if (startDate && itemDate < new Date(startDate)) return false;
    if (endDate && itemDate > new Date(endDate)) return false;
    
    return true;
  };
};

/**
 * PAGINATION UTILITIES
 */
export const paginateResults = (items, page = 1, pageSize = ADMIN_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    items: items.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      pageSize,
      totalItems: items.length,
      totalPages: Math.ceil(items.length / pageSize),
      hasNextPage: endIndex < items.length,
      hasPreviousPage: page > 1
    }
  };
};

/**
 * CALCULATION UTILITIES
 */
export const calculateOrderMetrics = (orders) => {
  const metrics = {
    totalOrders: orders.length,
    totalRevenue: 0,
    averageOrderValue: 0,
    statusBreakdown: {},
    recentOrders: orders.slice(0, 5)
  };

  orders.forEach(order => {
    metrics.totalRevenue += order.total || 0;
    
    const status = order.status || 'unknown';
    metrics.statusBreakdown[status] = (metrics.statusBreakdown[status] || 0) + 1;
  });

  metrics.averageOrderValue = metrics.totalOrders > 0 
    ? metrics.totalRevenue / metrics.totalOrders 
    : 0;

  return metrics;
};

export const calculateInventoryAlerts = (inventory) => {
  const alerts = {
    lowStock: [],
    outOfStock: [],
    expiringSoon: []
  };

  inventory.forEach(item => {
    if (item.stock === 0) {
      alerts.outOfStock.push(item);
    } else if (item.stock <= (item.minStock || 10)) {
      alerts.lowStock.push(item);
    }
    
    if (item.expiryDate) {
      const expiryDate = new Date(item.expiryDate);
      const daysUntilExpiry = (expiryDate - new Date()) / (1000 * 60 * 60 * 24);
      
      if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
        alerts.expiringSoon.push({
          ...item,
          daysUntilExpiry: Math.ceil(daysUntilExpiry)
        });
      }
    }
  });

  return alerts;
};

/**
 * EXPORT/IMPORT UTILITIES
 */
export const exportToCSV = (data, filename, columns) => {
  const headers = Object.keys(columns).join(',');
  const rows = data.map(item => 
    Object.keys(columns).map(key => {
      const value = getNestedValue(item, key);
      // Escape commas and quotes for CSV
      return `"${String(value || '').replace(/"/g, '""')}"`;
    }).join(',')
  );
  
  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${formatDate(new Date()).replace(/\s/g, '_')}.csv`;
  link.click();
  
  URL.revokeObjectURL(link.href);
};

export const exportToPDF = async (data, title, options = {}) => {
  // Placeholder for PDF export - would integrate with jsPDF or similar
  const mockPDFData = `
    PDF Export: ${title}
    Generated: ${formatDateTime(new Date())}
    Records: ${data.length}
    
    ${data.slice(0, 5).map(item => JSON.stringify(item, null, 2)).join('\n\n')}
  `;
  
  const blob = new Blob([mockPDFData], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${title.replace(/\s/g, '_')}_${Date.now()}.pdf`;
  link.click();
  
  URL.revokeObjectURL(link.href);
};

/**
 * VALIDATION UTILITIES
 */
export const validateAdminAction = (action, user, target) => {
  const errors = [];
  
  // Check user permissions
  if (!user?.isAdmin) {
    errors.push('No tienes permisos de administrador');
  }
  
  // Validate action type
  const allowedActions = ['create', 'read', 'update', 'delete', 'export'];
  if (!allowedActions.includes(action)) {
    errors.push('Acción no permitida');
  }
  
  // Prevent self-deletion for users
  if (action === 'delete' && target?.type === 'user' && target.id === user.id) {
    errors.push('No puedes eliminarte a ti mismo');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateOrderData = (orderData) => {
  const errors = [];
  
  if (!orderData.customerInfo?.name) {
    errors.push('Nombre del cliente requerido');
  }
  
  if (!orderData.items || orderData.items.length === 0) {
    errors.push('Debe incluir al menos un producto');
  }
  
  if (!orderData.total || orderData.total <= 0) {
    errors.push('Total del pedido inválido');
  }
  
  // Validate phone format for Argentina
  if (orderData.customerInfo?.phone) {
    const phoneRegex = /^(\+54|54|0)?[1-9]\d{9,10}$/;
    if (!phoneRegex.test(orderData.customerInfo.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Formato de teléfono inválido');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * NOTIFICATION UTILITIES
 */
export const createNotification = (type, title, message, data = {}) => {
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type, // 'order', 'stock', 'customer', 'system'
    title,
    message,
    data,
    createdAt: new Date().toISOString(),
    read: false,
    priority: data.priority || 'medium'
  };
};

export const getNotificationIcon = (type) => {
  const iconMap = {
    order: 'ShoppingBag',
    stock: 'Package',
    customer: 'Users',
    system: 'Settings',
    payment: 'DollarSign'
  };
  return iconMap[type] || 'Bell';
};

/**
 * HELPER FUNCTIONS
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

export const formatAdminDate = (date) => {
  return formatDateTime(date);
};

export const formatAdminPrice = (price) => {
  return formatPrice(price);
};

export const generateAdminId = (prefix) => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-z0-9áéíóúñü\s\-_]/gi, '')
    .replace(/\s+/g, '_')
    .replace(/_{2,}/g, '_')
    .trim();
};

/**
 * BULK OPERATIONS UTILITIES
 */
export const createBulkOperations = (items, operation) => {
  return {
    items,
    operation,
    status: 'pending',
    createdAt: new Date().toISOString(),
    estimatedDuration: Math.ceil(items.length / 10) * 1000 // 10 items per second estimate
  };
};

export const processBulkOperation = async (bulkOp, processor, onProgress) => {
  const results = [];
  const total = bulkOp.items.length;
  
  for (let i = 0; i < total; i++) {
    try {
      const result = await processor(bulkOp.items[i], i);
      results.push({ success: true, item: bulkOp.items[i], result });
    } catch (error) {
      results.push({ success: false, item: bulkOp.items[i], error: error.message });
    }
    
    if (onProgress) {
      onProgress({
        completed: i + 1,
        total,
        percentage: Math.round(((i + 1) / total) * 100)
      });
    }
    
    // Small delay to prevent overwhelming the system
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  return {
    total,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
};

// Export all utilities
export default {
  ADMIN_CONSTANTS,
  getStatusVariant,
  getStatusLabel,
  getPriorityLevel,
  createSearchFilter,
  createStatusFilter,
  createDateRangeFilter,
  paginateResults,
  calculateOrderMetrics,
  calculateInventoryAlerts,
  exportToCSV,
  exportToPDF,
  validateAdminAction,
  validateOrderData,
  createNotification,
  getNotificationIcon,
  formatAdminDate,
  formatAdminPrice,
  generateAdminId,
  sanitizeFilename,
  createBulkOperations,
  processBulkOperation
};
