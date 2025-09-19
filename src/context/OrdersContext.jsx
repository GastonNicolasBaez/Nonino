import { createContext, useContext, useState, useEffect } from 'react';
import { mockOrders } from '@/lib/mockData';

const OrdersContext = createContext();

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders debe ser usado dentro de OrdersProvider');
  }
  return context;
};

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos mock al inicializar
  useEffect(() => {
    setOrders(mockOrders);
    setLoading(false);
  }, []);

  // Calcular pedidos pendientes
  const pendingOrdersCount = orders.filter(order => order.status === 'pending').length;

  // Función para actualizar el estado de un pedido
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Función para eliminar un pedido
  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  // Función para agregar un nuevo pedido
  const addOrder = (newOrder) => {
    setOrders(prev => [...prev, newOrder]);
  };

  // Función para obtener pedidos filtrados
  const getFilteredOrders = (searchTerm = '', statusFilter = 'all') => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const value = {
    orders,
    pendingOrdersCount,
    loading,
    updateOrderStatus,
    deleteOrder,
    addOrder,
    getFilteredOrders,
    setOrders
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};

