/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

// CORE
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// EXTERNO
import { toast } from "sonner";

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
  RefreshCw
} from "lucide-react";

// PROVIDERS

// UTILIDADES Y SERVICIOS
import { adminService } from "@/services/api";
import { mockDashboardData } from "@/lib/mockData";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { useOrders } from "@/context/OrdersContext";
import { SectionHeader, StatsCards } from "@/components/branding";

// ------------------ IMPORT ------------------ //
// ------------------ CODE   ------------------ //


export function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
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

  const navigate = useNavigate();

  // Usar el contexto de pedidos
  const { pendingOrdersCount } = useOrders();

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

  // Preparar datos para los componentes de branding
  const headerActions = [
    {
      label: "Actualizar",
      onClick: () => {
        toast.info("Actualizando dashboard...");
        // Aquí se llamaría a la función de actualización
      },
      className: "h-8 px-3 text-xs",
      icon: <RefreshCw className="w-3 h-3 mr-1" />
    }
  ];

  const statsData = [
    {
      id: "ventas-totales",
      label: "Ventas Totales",
      value: metrics?.totalSales ? formatPrice(metrics.totalSales) : "$0",
      color: "gray",
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      id: "pedidos-totales",
      label: "Pedidos Totales",
      value: metrics?.totalOrders || 0,
      color: "gray",
      icon: <ShoppingCart className="w-5 h-5" />
    },
    {
      id: "clientes-activos",
      label: "Clientes Activos",
      value: metrics?.customerCount || 0,
      color: "gray",
      icon: <Users className="w-5 h-5" />
    },
    {
      id: "valor-promedio",
      label: "Valor Promedio",
      value: metrics?.averageOrderValue ? formatPrice(metrics.averageOrderValue) : "$0",
      color: "gray",
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];


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
      {/* Header usando SectionHeader */}
      <SectionHeader
        title="Dashboard"
        subtitle={`Resumen general de tu negocio • ${new Date().toLocaleDateString('es-AR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`}
        icon={<Activity className="w-6 h-6" />}
        actions={headerActions}
      />

      {/* Alertas Críticas - Versión Simplificada */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Alertas Críticas
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock Bajo - Versión Simplificada */}
          <Card className="admin-alert admin-alert-warning">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
                      Stock Bajo ({lowStockProducts.length} productos)
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Productos con inventario crítico
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700">
                    Crítico
                  </Badge>
                  <Button 
                    variant="empanada"
                    size="sm"
                    onClick={() => navigate('/intranet/admin/inventario', {replace: true})}
                  >
                    Resolver ahora
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pedidos Pendientes - Versión Simplificada */}
          <Card className="admin-alert admin-alert-info">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                      Pedidos Pendientes ({pendingOrdersCount})
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Requieren atención inmediata
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700">
                    Urgente
                  </Badge>
                  <Button 
                    variant="empanada"
                    size="sm"
                    onClick={() => navigate('/intranet/admin/pedidos?status=pending', {replace: true})}
                  >
                    Resolver ahora
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats usando StatsCards */}
      <StatsCards stats={statsData} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Pedidos Recientes - Compacto y funcional */}
        <div className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-500" />
                  Pedidos Recientes
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => window.location.href = '/intranet/admin/pedidos'}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver Todos
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-2">
              {metrics?.recentOrders?.slice(0, 5).map((order, index) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-empanada-medium transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-empanada-medium rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        #{order.id.split('-')[1]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {order.items} productos • {formatDateTime(order.date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {formatPrice(order.total)}
                    </p>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200" :
                      order.status === "preparing" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200" :
                      order.status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200" :
                      "bg-gray-100 text-gray-800 dark:bg-empanada-dark dark:text-white"
                    }`}>
                      {order.status === "completed" ? "Completado" : 
                       order.status === "preparing" ? "Preparando" : 
                       order.status === "pending" ? "Pendiente" : order.status}
                    </div>
                  </div>
                </div>
              ))}
              
              {(!metrics?.recentOrders || metrics.recentOrders.length === 0) && (
                <div className="text-center py-8">
                  <ShoppingCart className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No hay pedidos recientes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Products - Compacto y funcional */}
        <div className="xl:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="w-4 h-4 text-empanada-golden" />
                  Top Productos
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => window.location.href = '/intranet/admin/productos'}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver Todos
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-2">
              {metrics?.topProducts?.map((item, index) => (
                <div
                  key={item.name || index}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-empanada-medium transition-colors"
                >
                  <div className="w-6 h-6 bg-empanada-golden rounded text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.sales} vendidas
                    </p>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-empanada-golden">
                      {formatPrice(item.revenue)}
                    </p>
                  </div>
                </div>
              ))}
              
              {(!metrics?.topProducts || metrics.topProducts.length === 0) && (
                <div className="text-center py-8">
                  <Package className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No hay productos para mostrar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Section - Compacto y funcional */}
      <div>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Ventas de la Semana
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  <Zap className="w-3 h-3 mr-1" />
                  Actualizado hace 2 min
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => window.location.href = '/intranet/admin/reportes?type=sales'}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver Detalles
                </Button>
              </div>
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