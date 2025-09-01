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
  AlertCircle
  
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { NumberTicker } from "../../components/ui/number-ticker";
import { adminService } from "../../services/api";
import { mockDashboardData } from "../../lib/mockData";
import { formatPrice } from "../../lib/utils";

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
      changeType: "positive"
    },
    {
      title: "Pedidos Totales",
      value: metrics?.totalOrders || 0,
      icon: ShoppingCart,
      format: "number",
      change: "+8.2%",
      changeType: "positive"
    },
    {
              title: "Clientes Totales",
        value: metrics?.customerCount || 0,
      icon: Users,
      format: "number",
      change: "+15.3%",
      changeType: "positive"
    },
    {
      title: "Valor Promedio",
      value: metrics?.averageOrderValue || 0,
      icon: TrendingUp,
      format: "currency",
      change: "+5.7%",
      changeType: "positive"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // Validar que los datos estén disponibles
  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p>No se pudieron cargar los datos del dashboard</p>
          <p className="text-sm text-gray-500 mt-2">
            Verifica tu conexión o contacta al administrador
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2 mb-2">
          <AlertCircle className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Alertas y Recordatorios
          </h2>
        </div>
        {/* Recordatorio Principal */}
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Recordatorio Importante
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Stock bajo en: Empanada de Carne (5 unidades restantes)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aviso de Datos Mock */}
        {usingMockData && (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">
                    Modo Demostración
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Usando datos de demostración. El backend no está disponible.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.format === "currency" ? (
                    formatPrice(stat.value)
                  ) : (
                    <NumberTicker value={stat.value} />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className={`${
                    stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.change}
                  </span>{" "}
                  desde el mes pasado
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Pedidos Recientes
              <Button variant="outline" size="sm">
                Ver Todos
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.recentOrders?.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">#{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items} productos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.total)}</p>
                    <Badge 
                      variant={order.status === "completed" ? "success" : "empanada"}
                      className="text-xs"
                    >
                      {order.status === "completed" ? "Completado" : 
                       order.status === "preparing" ? "Preparando" : 
                       order.status === "pending" ? "Pendiente" : order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {(!metrics?.recentOrders || metrics.recentOrders.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay pedidos recientes</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.topProducts?.map((item, index) => (
                <div key={item.name || index} className="flex items-center space-x-4">
                  <div className="text-2xl">🥟</div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.sales} vendidas
                    </p>
                  </div>
                  <Badge variant="outline">#{index + 1}</Badge>
                </div>
              ))}
              {(!metrics?.topProducts || metrics.topProducts.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay productos para mostrar</p>
                </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Ventas de la Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <p className="text-gray-600 dark:text-gray-400">
                Gráfico de ventas (placeholder)
              </p>
              <p className="text-sm text-gray-500">
                Aquí se mostraría un gráfico con las ventas diarias
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Package className="w-12 h-12 text-empanada-golden mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Gestionar Productos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Agregar, editar o eliminar productos
            </p>
            <Button variant="empanada" className="w-full">
              Ir a Productos
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Clock className="w-12 h-12 text-empanada-golden mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Pedidos Pendientes</h3>
            <p className="text-sm text-muted-foreground mb-4">
              5 pedidos esperando confirmación
            </p>
            <Button variant="empanada" className="w-full">
              Ver Pedidos
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Star className="w-12 h-12 text-empanada-golden mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Reseñas</h3>
            <p className="text-sm text-muted-foreground mb-4">
              3 nuevas reseñas de clientes
            </p>
            <Button variant="empanada" className="w-full">
              Ver Reseñas
            </Button>
          </CardContent>
        </Card>
      </div>


    </div>
  );
}
