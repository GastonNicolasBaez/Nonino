import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  Download,
  Calendar,
  Users,
  Package,
  ShoppingCart,
  Star,
  Clock,
  PieChart,
  LineChart,
  Activity,
  Filter,
  RefreshCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { formatPrice, formatDate } from "../../lib/utils";

export function ReportsPage() {
  const [dateRange, setDateRange] = useState("last7days");
  const [reportType, setReportType] = useState("sales");
  const [loading, setLoading] = useState(true);

  // Mock data para reportes
  const salesData = {
    totalSales: 125000,
    totalOrders: 450,
    averageOrderValue: 2780,
    growth: 15.4,
    dailySales: [
      { date: "2024-01-09", sales: 18500, orders: 67 },
      { date: "2024-01-10", sales: 22000, orders: 78 },
      { date: "2024-01-11", sales: 19800, orders: 71 },
      { date: "2024-01-12", sales: 25200, orders: 89 },
      { date: "2024-01-13", sales: 21700, orders: 76 },
      { date: "2024-01-14", sales: 17800, orders: 62 },
      { date: "2024-01-15", sales: 20000, orders: 72 }
    ],
    topProducts: [
      { name: "Empanada de Carne", sales: 890, revenue: 400500 },
      { name: "Empanada de Pollo", sales: 756, revenue: 317520 },
      { name: "Empanada de Dulce de Leche", sales: 634, revenue: 221900 },
      { name: "Empanada de Jamón y Queso", sales: 445, revenue: 169100 },
      { name: "Empanada de Cordero", sales: 234, revenue: 152100 }
    ],
    salesByCategory: [
      { category: "Tradicionales", sales: 75000, percentage: 60 },
      { category: "Gourmet", sales: 25000, percentage: 20 },
      { category: "Dulces", sales: 18750, percentage: 15 },
      { category: "Vegetarianas", sales: 6250, percentage: 5 }
    ],
    salesByHour: [
      { hour: "11:00", sales: 8500 },
      { hour: "12:00", sales: 15200 },
      { hour: "13:00", sales: 18700 },
      { hour: "14:00", sales: 12300 },
      { hour: "15:00", sales: 9800 },
      { hour: "16:00", sales: 7200 },
      { hour: "17:00", sales: 6500 },
      { hour: "18:00", sales: 11200 },
      { hour: "19:00", sales: 16800 },
      { hour: "20:00", sales: 14500 },
      { hour: "21:00", sales: 10300 },
      { hour: "22:00", sales: 8000 }
    ]
  };

  const customerData = {
    totalCustomers: 1230,
    newCustomers: 45,
    returningCustomers: 312,
    customerRetention: 78.5,
    topCustomers: [
      { name: "Roberto Miguel Díaz", orders: 31, spent: 22150 },
      { name: "Juan Carlos Pérez", orders: 23, spent: 15450 },
      { name: "María García Rodríguez", orders: 15, spent: 8750 },
      { name: "Carlos Alberto Fernández", orders: 8, spent: 3240 },
      { name: "Ana Patricia López", orders: 5, spent: 1890 }
    ],
    customersByLevel: [
      { level: "Platino", count: 12, percentage: 15 },
      { level: "Oro", count: 89, percentage: 25 },
      { level: "Plata", count: 234, percentage: 35 },
      { level: "Bronce", count: 895, percentage: 25 }
    ],
    acquisitionChannels: [
      { channel: "Orgánico", customers: 456, percentage: 37 },
      { channel: "Recomendaciones", customers: 369, percentage: 30 },
      { channel: "Redes Sociales", customers: 246, percentage: 20 },
      { channel: "Publicidad", customers: 159, percentage: 13 }
    ]
  };

  const inventoryData = {
    totalProducts: 25,
    lowStockItems: 6,
    outOfStockItems: 2,
    totalInventoryValue: 45600,
    stockMovement: [
      { product: "Carne Picada", movement: -15, type: "out" },
      { product: "Harina 000", movement: +25, type: "in" },
      { product: "Queso Mozzarella", movement: -8, type: "out" },
      { product: "Aceitunas", movement: +10, type: "in" },
      { product: "Cebolla", movement: -12, type: "out" }
    ],
    categoryDistribution: [
      { category: "Proteínas", value: 18500, percentage: 40.6 },
      { category: "Masa", value: 12300, percentage: 27.0 },
      { category: "Lácteos", value: 8900, percentage: 19.5 },
      { category: "Verduras", value: 3600, percentage: 7.9 },
      { category: "Condimentos", value: 2300, percentage: 5.0 }
    ]
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [dateRange, reportType]);

  const SalesReport = () => (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ventas Totales</p>
                <p className="text-2xl font-bold text-empanada-golden">
                  {formatPrice(salesData.totalSales)}
                </p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +{salesData.growth}% vs mes anterior
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-empanada-golden" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pedidos</p>
                <p className="text-2xl font-bold">{salesData.totalOrders}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Promedio: {Math.round(salesData.totalOrders / 7)} por día
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ticket Promedio</p>
                <p className="text-2xl font-bold text-green-500">
                  {formatPrice(salesData.averageOrderValue)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Por pedido
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Productos Activos</p>
                <p className="text-2xl font-bold text-purple-500">25</p>
                <p className="text-xs text-muted-foreground mt-1">
                  En catálogo
                </p>
              </div>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de ventas diarias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-5 h-5" />
            Ventas Diarias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Gráfico de ventas diarias</p>
              <p className="text-sm text-gray-400">Aquí iría un gráfico de líneas con las ventas por día</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top productos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Productos Más Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-empanada-golden rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} unidades</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatPrice(product.revenue)}</p>
                    <p className="text-xs text-muted-foreground">ingresos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ventas por categoría */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Ventas por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.salesByCategory.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category.category}</span>
                    <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-empanada-golden h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{formatPrice(category.sales)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ventas por horario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Ventas por Horario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Gráfico de barras por horario</p>
              <p className="text-sm text-gray-400">Muestra las horas de mayor demanda</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CustomerReport = () => (
    <div className="space-y-6">
      {/* Métricas de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
                <p className="text-2xl font-bold">{customerData.totalCustomers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nuevos Clientes</p>
                <p className="text-2xl font-bold text-green-500">{customerData.newCustomers}</p>
                <p className="text-xs text-muted-foreground mt-1">Este mes</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clientes Recurrentes</p>
                <p className="text-2xl font-bold text-empanada-golden">{customerData.returningCustomers}</p>
                <p className="text-xs text-muted-foreground mt-1">Este mes</p>
              </div>
              <RefreshCcw className="w-8 h-8 text-empanada-golden" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Retención</p>
                <p className="text-2xl font-bold text-purple-500">{customerData.customerRetention}%</p>
                <p className="text-xs text-muted-foreground mt-1">Promedio</p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top clientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Mejores Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerData.topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-empanada-golden rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.orders} pedidos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatPrice(customer.spent)}</p>
                    <p className="text-xs text-muted-foreground">gastado</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Clientes por nivel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Distribución por Nivel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerData.customersByLevel.map((level, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{level.level}</span>
                    <span className="text-sm text-muted-foreground">{level.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        level.level === 'Platino' ? 'bg-purple-500' :
                        level.level === 'Oro' ? 'bg-yellow-500' :
                        level.level === 'Plata' ? 'bg-gray-500' : 'bg-amber-600'
                      }`}
                      style={{ width: `${level.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{level.count} clientes</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Reportes y Análisis</h1>
          <p className="text-muted-foreground">
            Analiza el rendimiento de tu negocio con métricas detalladas
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="today">Hoy</option>
            <option value="last7days">Últimos 7 días</option>
            <option value="last30days">Últimos 30 días</option>
            <option value="thisMonth">Este mes</option>
            <option value="lastMonth">Mes anterior</option>
            <option value="thisYear">Este año</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Tabs de reportes */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={reportType === "sales" ? "empanada" : "outline"}
              size="sm"
              onClick={() => setReportType("sales")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Ventas
            </Button>
            <Button
              variant={reportType === "customers" ? "empanada" : "outline"}
              size="sm"
              onClick={() => setReportType("customers")}
            >
              <Users className="w-4 h-4 mr-2" />
              Clientes
            </Button>
            <Button
              variant={reportType === "inventory" ? "empanada" : "outline"}
              size="sm"
              onClick={() => setReportType("inventory")}
            >
              <Package className="w-4 h-4 mr-2" />
              Inventario
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contenido del reporte */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg" />
            </Card>
          ))}
        </div>
      ) : (
        <>
          {reportType === "sales" && <SalesReport />}
          {reportType === "customers" && <CustomerReport />}
          {reportType === "inventory" && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Reporte de Inventario</h3>
              <p className="text-muted-foreground">
                Los reportes de inventario estarán disponibles próximamente
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}