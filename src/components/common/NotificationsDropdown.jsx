import { useState, useRef, useEffect, useMemo } from 'react';
import { Bell, X, Check, Clock, AlertTriangle, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminData } from '@/context/AdminDataProvider';

/**
 * Componente de notificaciones con dropdown
 * Muestra solo alertas de stock bajo de productos y materiales
 */
export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState(() => {
    // Cargar notificaciones leídas desde localStorage
    const saved = localStorage.getItem('noninoReadNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Obtener datos de inventario desde AdminDataProvider
  const {
    inventarioProductosSucursal: products,
    inventarioMaterialesSucursal: materials,
  } = useAdminData();

  // Generar notificaciones dinámicamente basadas en stock bajo
  const notifications = useMemo(() => {
    const stockNotifications = [];

    // Notificaciones de productos con stock bajo
    if (products && Array.isArray(products)) {
      const lowStockProducts = products.filter(item => item.status === 'low');
      lowStockProducts.forEach((product, index) => {
        stockNotifications.push({
          id: `product-${product.id}`,
          type: 'inventory',
          subtype: 'product',
          title: 'Stock Bajo - Productos',
          message: `${product.name}: Solo quedan ${product.quantity} unidades`,
          time: 'Ahora',
          unread: !readNotifications.includes(`product-${product.id}`),
          priority: 'high',
          link: '/intranet/stock-productos'
        });
      });
    }

    // Notificaciones de materiales con stock bajo
    if (materials && Array.isArray(materials)) {
      const lowStockMaterials = materials.filter(item => item.status === 'low');
      lowStockMaterials.forEach((material, index) => {
        // Adaptar unidad para mostrar
        const displayQuantity = material.quantity >= 1000
          ? (material.quantity / 1000).toFixed(1)
          : material.quantity;
        const displayUnit = material.quantity >= 1000
          ? (material.unit === 'g' ? 'kg' : 'litros')
          : material.unit;

        stockNotifications.push({
          id: `material-${material.id}`,
          type: 'inventory',
          subtype: 'material',
          title: 'Stock Bajo - Materia Prima',
          message: `${material.materialName}: Solo quedan ${displayQuantity} ${displayUnit}`,
          time: 'Ahora',
          unread: !readNotifications.includes(`material-${material.id}`),
          priority: 'high',
          link: '/intranet/stock-materias-primas'
        });
      });
    }

    return stockNotifications;
  }, [products, materials, readNotifications]);
  
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Sincronizar localStorage cuando cambien las notificaciones leídas
  useEffect(() => {
    localStorage.setItem('noninoReadNotifications', JSON.stringify(readNotifications));
  }, [readNotifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'inventory':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'low':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const markAsRead = (id) => {
    setReadNotifications(prev => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadNotifications(allIds);
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    // Navegar a la página de stock correspondiente
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de notificaciones */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown de notificaciones */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-96 z-30"
          >
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notificaciones</CardTitle>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={markAllAsRead}
                        className="text-xs h-7"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Marcar todas
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsOpen(false)}
                      className="h-7 w-7 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                      <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="font-medium">No hay alertas de stock</p>
                      <p className="text-xs mt-1">Todos los productos y materiales tienen stock adecuado</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 border-l-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${getPriorityColor(notification.priority)} ${notification.unread ? 'font-semibold' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {notification.title}
                                </p>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="w-3 h-3 mr-1" />
                                {notification.time}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                      Haz clic en una alerta para ir a la gestión de stock
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
