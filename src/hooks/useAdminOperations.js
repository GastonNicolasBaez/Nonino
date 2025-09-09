/**
 * ADMIN OPERATIONS HOOK - NONINO EMPANADAS
 * Hook centralizado para operaciones administrativas
 * Elimina duplicación de código y centraliza lógica común
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import adminService from '../services/adminService';
import { 
  createSearchFilter, 
  createStatusFilter, 
  paginateResults,
  validateAdminAction,
  ADMIN_CONSTANTS 
} from '../lib/adminUtils';

/**
 * Hook principal para operaciones administrativas
 */
export function useAdminOperations(entityType, options = {}) {
  const {
    pageSize = ADMIN_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    enableRealTimeUpdates = false,
    searchFields = ['name', 'id'],
    sortField = 'createdAt',
    sortOrder = 'desc'
  } = options;

  // Estados principales
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Obtener servicio apropiado
  const service = useMemo(() => {
    const serviceMap = {
      orders: adminService.orders,
      customers: adminService.customers,
      inventory: adminService.inventory,
      products: adminService.products
    };
    return serviceMap[entityType];
  }, [entityType]);

  // Cargar datos iniciales
  const loadData = useCallback(async (filters = {}) => {
    if (!service) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await service.getAll?.(filters) || await service.getAllCustomers?.(filters) || await service.getAllOrders?.(filters) || await service.getAllInventory?.(filters);
      const items = response.data || response;
      setData(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(err.message);
      toast.error(`Error cargando ${entityType}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [service, entityType]);

  // Efecto inicial de carga
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtros aplicados
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const searchFilter = createSearchFilter(searchTerm, searchFields);
      filtered = filtered.filter(searchFilter);
    }

    // Aplicar filtro de estado
    if (statusFilter !== 'all') {
      const statusFilterFn = createStatusFilter(statusFilter);
      filtered = filtered.filter(statusFilterFn);
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [data, searchTerm, statusFilter, searchFields, sortField, sortOrder]);

  // Datos paginados
  const paginatedData = useMemo(() => {
    return paginateResults(filteredData, currentPage, pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Operaciones CRUD
  const createItem = useCallback(async (itemData) => {
    if (!service?.create && !service?.createCustomer && !service?.createOrder && !service?.addInventoryItem) {
      throw new Error(`Operación create no disponible para ${entityType}`);
    }

    try {
      const createMethod = service.create || service.createCustomer || service.createOrder || service.addInventoryItem;
      const response = await createMethod(itemData);
      const newItem = response.data || response;
      
      setData(prev => [newItem, ...prev]);
      toast.success(`${entityType} creado correctamente`);
      return newItem;
    } catch (error) {
      toast.error(`Error creando ${entityType}: ${error.message}`);
      throw error;
    }
  }, [service, entityType]);

  const updateItem = useCallback(async (itemId, updates) => {
    if (!service?.update && !service?.updateCustomer && !service?.updateOrder) {
      throw new Error(`Operación update no disponible para ${entityType}`);
    }

    try {
      const updateMethod = service.update || service.updateCustomer || service.updateOrder;
      const response = await updateMethod(itemId, updates);
      const updatedItem = response.data || response;
      
      setData(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, ...updatedItem } : item
        )
      );
      
      toast.success(`${entityType} actualizado correctamente`);
      return updatedItem;
    } catch (error) {
      toast.error(`Error actualizando ${entityType}: ${error.message}`);
      throw error;
    }
  }, [service, entityType]);

  const deleteItem = useCallback(async (itemId) => {
    if (!service?.delete && !service?.deleteCustomer && !service?.deleteOrder && !service?.deleteInventoryItem) {
      throw new Error(`Operación delete no disponible para ${entityType}`);
    }

    try {
      const deleteMethod = service.delete || service.deleteCustomer || service.deleteOrder || service.deleteInventoryItem;
      await deleteMethod(itemId);
      
      setData(prev => prev.filter(item => item.id !== itemId));
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      
      toast.success(`${entityType} eliminado correctamente`);
    } catch (error) {
      toast.error(`Error eliminando ${entityType}: ${error.message}`);
      throw error;
    }
  }, [service, entityType]);

  // Operaciones de selección
  const toggleItemSelection = useCallback((itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const selectAllItems = useCallback(() => {
    setSelectedItems(new Set(paginatedData.items.map(item => item.id)));
  }, [paginatedData.items]);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  // Operaciones en lote
  const bulkDelete = useCallback(async (itemIds = Array.from(selectedItems)) => {
    if (itemIds.length === 0) return;

    try {
      await Promise.all(itemIds.map(id => deleteItem(id)));
      toast.success(`${itemIds.length} elementos eliminados`);
    } catch (error) {
      toast.error(`Error en eliminación masiva: ${error.message}`);
    }
  }, [selectedItems, deleteItem]);

  // Exportar datos
  const exportData = useCallback(async (format = 'csv') => {
    try {
      const dataToExport = filteredData;
      
      if (format === 'csv') {
        // Implementación exportar CSV
        const { exportToCSV } = await import('../lib/adminUtils');
        exportToCSV(dataToExport, entityType, {
          id: 'ID',
          name: 'Nombre',
          status: 'Estado',
          createdAt: 'Fecha Creación'
        });
      } else if (format === 'pdf') {
        // Implementación exportar PDF
        const { exportToPDF } = await import('../lib/adminUtils');
        await exportToPDF(dataToExport, `Reporte de ${entityType}`);
      }
      
      toast.success(`Datos exportados en formato ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(`Error exportando datos: ${error.message}`);
    }
  }, [filteredData, entityType]);

  // Refrescar datos
  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  // Stats calculadas
  const stats = useMemo(() => {
    return {
      total: data.length,
      filtered: filteredData.length,
      selected: selectedItems.size,
      loading,
      error
    };
  }, [data.length, filteredData.length, selectedItems.size, loading, error]);

  return {
    // Datos
    data: paginatedData.items,
    pagination: paginatedData.pagination,
    stats,
    
    // Estados
    loading,
    error,
    searchTerm,
    statusFilter,
    currentPage,
    selectedItems,
    
    // Setters
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
    
    // Operaciones CRUD
    createItem,
    updateItem,
    deleteItem,
    
    // Selección
    toggleItemSelection,
    selectAllItems,
    clearSelection,
    
    // Operaciones en lote
    bulkDelete,
    
    // Utilidades
    exportData,
    refresh
  };
}

/**
 * Hook especializado para gestión de pedidos
 */
export function useOrderManagement() {
  const baseHook = useAdminOperations('orders', {
    searchFields: ['id', 'customerName', 'customerInfo.name'],
    sortField: 'date',
    sortOrder: 'desc'
  });

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      await adminService.orders.updateOrderStatus(orderId, newStatus);
      baseHook.refresh();
      toast.success(`Estado del pedido actualizado a ${newStatus}`);
    } catch (error) {
      toast.error(`Error actualizando estado: ${error.message}`);
    }
  }, [baseHook]);

  return {
    ...baseHook,
    updateOrderStatus
  };
}

/**
 * Hook especializado para gestión de clientes
 */
export function useCustomerManagement() {
  const baseHook = useAdminOperations('customers', {
    searchFields: ['name', 'email', 'phone'],
    sortField: 'createdAt',
    sortOrder: 'desc'
  });

  const toggleCustomerStatus = useCallback(async (customerId) => {
    try {
      await adminService.customers.toggleCustomerStatus(customerId);
      baseHook.refresh();
      toast.success('Estado del cliente actualizado');
    } catch (error) {
      toast.error(`Error actualizando estado: ${error.message}`);
    }
  }, [baseHook]);

  return {
    ...baseHook,
    toggleCustomerStatus
  };
}

/**
 * Hook especializado para gestión de inventario
 */
export function useInventoryManagement() {
  const baseHook = useAdminOperations('inventory', {
    searchFields: ['name', 'category', 'sku'],
    sortField: 'name',
    sortOrder: 'asc'
  });

  const updateStock = useCallback(async (itemId, newStock, reason = 'manual_adjustment') => {
    try {
      await adminService.inventory.updateStock(itemId, newStock, reason);
      baseHook.refresh();
      toast.success('Stock actualizado correctamente');
    } catch (error) {
      toast.error(`Error actualizando stock: ${error.message}`);
    }
  }, [baseHook]);

  const getLowStockItems = useCallback(() => {
    return baseHook.data.filter(item => item.stock <= (item.minStock || 10));
  }, [baseHook.data]);

  return {
    ...baseHook,
    updateStock,
    getLowStockItems
  };
}

/**
 * Hook para operaciones de reportes
 */
export function useReportsOperations() {
  const [reports, setReports] = useState([]);
  const [generating, setGenerating] = useState(false);

  const generateReport = useCallback(async (reportType, filters = {}) => {
    setGenerating(true);
    try {
      const response = await adminService.reports.generateReport(reportType, filters);
      const report = response.data || response;
      setReports(prev => [report, ...prev]);
      toast.success(`Reporte ${reportType} generado correctamente`);
      return report;
    } catch (error) {
      toast.error(`Error generando reporte: ${error.message}`);
      throw error;
    } finally {
      setGenerating(false);
    }
  }, []);

  const exportToPDF = useCallback(async (reportType, filters = {}) => {
    try {
      const response = await adminService.reports.exportToPDF(reportType, filters);
      // Handle blob download
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_${reportType}_${Date.now()}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Reporte exportado correctamente');
    } catch (error) {
      toast.error(`Error exportando reporte: ${error.message}`);
    }
  }, []);

  return {
    reports,
    generating,
    generateReport,
    exportToPDF
  };
}

// Export default
export default {
  useAdminOperations,
  useOrderManagement,
  useCustomerManagement, 
  useInventoryManagement,
  useReportsOperations
};
