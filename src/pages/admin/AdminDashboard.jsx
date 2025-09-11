import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { NumberTicker } from "../../components/ui/number-ticker";
import { adminService } from "../../services/api";
import { mockDashboardData } from "../../lib/mockData";
import { formatPrice, formatDateTime } from "../../lib/utils";
import { SalesChart, TopProductsChart, OrdersStatusChart, CustomerTrendsChart } from "../../components/charts/DashboardCharts";

export function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-empanada-golden border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-empanada-golden/20 rounded-full mx-auto"></div>
          </div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Cargando dashboard...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Preparando datos en tiempo real</p>
        </motion.div>
      </div>
    );
  }

  // Validar que los datos estén disponibles
  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
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
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
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
      </motion.div>

      {/* Alerts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Alertas Importantes
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stock bajo */}
          <Card className="border-amber-200  dark:border-amber-800">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                    Stock Bajo
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Empanada de Carne: <span className="font-medium">5 unidades</span>
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2 text-xs h-7"
                    onClick={() => window.location.href = '/admin/inventario'}
                  >
                    Reabastecer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pedidos pendientes */}
          <Card className="border-blue-200  dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    Pedidos Pendientes
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-medium">3 pedidos</span> esperando confirmación
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2 text-xs h-7"
                    onClick={() => window.location.href = '/admin/pedidos?status=pending'}
                  >
                    Revisar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -2 }}
            className="group"
          >
            <Card 
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300  cursor-pointer"
              onClick={() => {
                switch(stat.title) {
                  case 'Ventas Totales':
                    window.location.href = '/admin/reportes?type=sales';
                    break;
                  case 'Pedidos':
                    window.location.href = '/admin/pedidos';
                    break;
                  case 'Valor Promedio':
                    window.location.href = '/admin/reportes?type=aov';
                    break;
                  case 'Clientes':
                    window.location.href = '/admin/clientes';
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
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Orders - Takes 2 columns on XL */}
        <div className="xl:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="h-full ">
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
                  onClick={() => window.location.href = '/admin/pedidos'}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver Todos
                </Button>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {metrics?.recentOrders?.slice(0, 5).map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
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
                  </motion.div>
                ))}
                
                {(!metrics?.recentOrders || metrics.recentOrders.length === 0) && (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No hay pedidos recientes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Top Products - Takes 1 column on XL */}
        <div className="xl:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="h-full ">
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
                  onClick={() => window.location.href = '/admin/productos'}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver Todos
                </Button>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {metrics?.topProducts?.map((item, index) => (
                  <motion.div
                    key={item.name || index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
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
                  </motion.div>
                ))}
                
                {(!metrics?.topProducts || metrics.topProducts.length === 0) && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No hay productos para mostrar</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="">
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
                onClick={() => window.location.href = '/admin/reportes?type=sales'}
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
      </motion.div>
    </div>
  );
}