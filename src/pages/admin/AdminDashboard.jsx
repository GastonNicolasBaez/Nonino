/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

// CORE
import { useState, useEffect } from "react";

// EXTERNO

// COMPONENTES
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NumberTicker } from "@/components/ui/number-ticker";
import { SalesChart, TopProductsChart, OrdersStatusChart, CustomerTrendsChart } from "@/components/charts/DashboardCharts";

// ICONOS
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Package,
  Clock,
  Star,
  AlertCircle,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  AlertTriangle,
  Info,
  Bell,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Minus
} from "lucide-react";

// PROVIDERS

// UTILIDADES Y SERVICIOS
import { adminService } from "@/services/api";
import { mockDashboardData } from "@/lib/mockData";
import { formatPrice, formatDateTime } from "@/lib/utils";

// ------------------ IMPORT ------------------ //
// ------------------ CODE   ------------------ //


export function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(3);
  const [lowStockProducts, setLowStockProducts] = useState([
    { id: 1, name: "Empanada de Carne", currentStock: 5, minStock: 20 },
    { id: 2, name: "Empanada de Pollo", currentStock: 8, minStock: 15 },
    { id: 3, name: "Empanada de Jamón y Queso", currentStock: 3, minStock: 10 },
    { id: 4, name: "Empanada de Verdura", currentStock: 12, minStock: 15 },
    { id: 5, name: "Empanada de Cebolla", currentStock: 7, minStock: 12 },
    { id: 6, name: "Empanada de Espinaca", currentStock: 4, minStock: 8 },
    { id: 7, name: "Empanada de Choclo", currentStock: 9, minStock: 15 },
    { id: 8, name: "Empanada de Atún", currentStock: 6, minStock: 10 },
    { id: 9, name: "Empanada de Ricotta", currentStock: 2, minStock: 8 },
    { id: 10, name: "Empanada de Caprese", currentStock: 11, minStock: 15 }
  ]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await adminService.getDashboardMetrics();
        setMetrics(response.data);
        setUsingMockData(false);
      } catch (error) {
        console.error("Error fetching metrics:", error);
        // Si hay error de red, usar datos mock
        if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          setMetrics(mockDashboardData.metrics);
          setUsingMockData(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Simular nuevos pedidos pendientes
  useEffect(() => {
    const interval = setInterval(() => {
      setPendingOrdersCount(prev => {
        // Simular que llegan pedidos nuevos ocasionalmente
        if (Math.random() < 0.3) {
          return prev + 1;
        }
        return prev;
      });
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: "Ventas Totales",
      value: metrics?.totalSales || 0,
      icon: DollarSign,
      format: "currency",
      change: "+12.5%",
      changeType: "positive",
      description: "Este mes",
      color: "emerald"
    },
    {
      title: "Pedidos Totales",
      value: metrics?.totalOrders || 0,
      icon: ShoppingCart,
      format: "number",
      change: "+8.2%",
      changeType: "positive",
      description: "Este mes",
      color: "blue"
    },
    {
      title: "Clientes Activos",
      value: metrics?.customerCount || 0,
      icon: Users,
      format: "number",
      change: "+15.3%",
      changeType: "positive",
      description: "Registrados",
      color: "purple"
    },
    {
      title: "Valor Promedio",
      value: metrics?.averageOrderValue || 0,
      icon: TrendingUp,
      format: "currency",
      change: "+5.7%",
      changeType: "positive",
      description: "Por pedido",
      color: "orange"
    }
  ];

  const handleReplenishStock = (productId) => {
    setLowStockProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, currentStock: product.minStock + 10 }
          : product
      )
    );
  };

  const handleProcessOrder = (orderId) => {
    setPendingOrdersCount(prev => Math.max(0, prev - 1));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-empanada-golden border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-empanada-golden/20 rounded-full mx-auto"></div>
          </div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Cargando dashboard...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Preparando datos en tiempo real</p>
        </div>
      </div>
    );
  }

  // Validar que los datos estén disponibles
  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error al cargar datos
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No se pudieron cargar los datos del dashboard. Verifica tu conexión o contacta al administrador.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="empanada"
            className="px-6"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Resumen general de tu negocio • {new Date().toLocaleDateString('es-AR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            <Activity className="w-3 h-3 mr-1" />
            Tiempo real
          </Badge>
          {usingMockData && (
            <Badge variant="secondary" className="px-3 py-1">
              <Info className="w-3 h-3 mr-1" />
              Modo demo
            </Badge>
          )}
        </div>
      </div>

      {/* Alertas Críticas - Nueva Sección */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Alertas Críticas
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock Bajo - Lista Expandida */}
          <Card className="admin-alert admin-alert-warning h-[400px] flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-amber-800 dark:text-amber-200">
                    Stock Bajo ({lowStockProducts.length} productos)
                  </CardTitle>
                </div>
                <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700">
                  Crítico
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-3 overflow-hidden">
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-100 dark:scrollbar-thumb-amber-600 dark:scrollbar-track-amber-900/20 space-y-3 pr-2">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex-1">
                      <p className="font-medium text-amber-900 dark:text-amber-100">
                        {product.name}
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        <span className="font-semibold">{product.currentStock}</span> unidades restantes
                        <span className="text-amber-600 dark:text-amber-400"> • Mínimo: {product.minStock}</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs h-7 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                        onClick={() => handleReplenishStock(product.id)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Reabastecer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-amber-200 dark:border-amber-800 flex-shrink-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs h-8 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                  onClick={() => window.location.href = '/intranet/admin/inventario'}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver Inventario Completo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pedidos Pendientes - Lista Expandida */}
          <Card className="admin-alert admin-alert-info h-[400px] flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-blue-800 dark:text-blue-200">
                    Pedidos Pendientes ({pendingOrdersCount})
                  </CardTitle>
                </div>
                <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700">
                  Urgente
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-3 overflow-hidden">
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100 dark:scrollbar-thumb-blue-600 dark:scrollbar-track-blue-900/20 space-y-3 pr-2">
                {Array.from({ length: Math.min(pendingOrdersCount, 10) }, (_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          #{String(i + 1).padStart(3, '0')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          Cliente #{i + 1}
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {Math.floor(Math.random() * 5) + 1} productos • ${Math.floor(Math.random() * 5000) + 2000}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs h-7 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        onClick={() => handleProcessOrder(i)}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Procesar
                      </Button>
                    </div>
                  </div>
                ))}
                {pendingOrdersCount > 10 && (
                  <div className="text-center py-2">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Y {pendingOrdersCount - 10} pedidos más...
                    </p>
                  </div>
                )}
              </div>
              <div className="pt-2 border-t border-blue-200 dark:border-blue-800 flex-shrink-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs h-8 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  onClick={() => window.location.href = '/intranet/admin/pedidos?status=pending'}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver Todos los Pedidos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={stat.title} className="group">
            <Card 
              className="relative overflow-hidden admin-stats-card cursor-pointer"
              onClick={() => {
                switch(stat.title) {
                  case 'Ventas Totales':
                    window.location.href = '/intranet/admin/reportes?type=sales';
                    break;
                  case 'Pedidos Totales':
                    window.location.href = '/intranet/admin/pedidos';
                    break;
                  case 'Valor Promedio':
                    window.location.href = '/intranet/admin/reportes?type=aov';
                    break;
                  case 'Clientes Activos':
                    window.location.href = '/intranet/admin/clientes';
                    break;
                  default:
                    break;
                }
              }}
            >
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/5 rounded-full -translate-y-4 translate-x-4`}></div>
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.format === "currency" ? (
                    formatPrice(stat.value)
                  ) : (
                    <NumberTicker value={stat.value} />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </p>
                  <div className="flex items-center space-x-1">
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-600" />
                    )}
                    <span className={`text-xs font-medium ${
                      stat.changeType === "positive" ? "text-emerald-600" : "text-red-600"
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Orders - Takes 2 columns on XL */}
        <div className="xl:col-span-2">
          <div>
            <Card className="h-full admin-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">Pedidos Recientes</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => window.location.href = '/intranet/admin/pedidos'}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver Todos
                </Button>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {metrics?.recentOrders?.slice(0, 5).map((order, index) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg admin-table-row"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          #{order.id.split('-')[1]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {order.customerName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.items} productos • {formatDateTime(order.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(order.total)}
                      </p>
                      <div className={`status-badge text-xs ${
                        order.status === "completed" ? "status-badge-success" :
                        order.status === "preparing" ? "status-badge-info" :
                        order.status === "pending" ? "status-badge-warning" :
                        "status-badge-info"
                      }`}>
                        {order.status === "completed" ? "Completado" : 
                         order.status === "preparing" ? "Preparando" : 
                         order.status === "pending" ? "Pendiente" : order.status}
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!metrics?.recentOrders || metrics.recentOrders.length === 0) && (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No hay pedidos recientes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Products - Takes 1 column on XL */}
        <div className="xl:col-span-1">
          <div>
            <Card className="h-full admin-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">Top Productos</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => window.location.href = '/intranet/admin/productos'}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver Todos
                </Button>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {metrics?.topProducts?.map((item, index) => (
                  <div
                    key={item.name || index}
                    className="flex items-center space-x-3 p-3 rounded-lg admin-table-row"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-empanada-golden to-empanada-crust rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">#{index + 1}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.sales} vendidas
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-semibold text-empanada-golden">
                        {formatPrice(item.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {(!metrics?.topProducts || metrics.topProducts.length === 0) && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No hay productos para mostrar</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div>
        <Card className="admin-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-lg">Ventas de la Semana</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Actualizado hace 2 min
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => window.location.href = '/intranet/admin/reportes?type=sales'}
              >
                <Eye className="w-3 h-3 mr-1" />
                Ver Detalles
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <SalesChart data={metrics?.salesData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}