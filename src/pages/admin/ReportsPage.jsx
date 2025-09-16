import { useState, useEffect } from "react";
// Removed framer-motion for simpler admin experience
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
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
  RefreshCcw,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { SalesChart, TopProductsChart, OrdersStatusChart, CustomerTrendsChart, CategorySalesChart, HourlySalesChart, CustomerLevelChart } from "../../components/charts/DashboardCharts";
import { SimpleTopProductsChart, SimpleCategorySalesChart, SimpleHourlySalesChart, SimpleCustomerLevelChart } from "../../components/charts/SimpleCharts";
import { formatPrice, formatDate } from "../../lib/utils";
import { toast } from "sonner";
import { generateReportPDF, downloadPDF } from "../../services/pdfService";

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
      { day: 'Lun', sales: 18500, orders: 67 },
      { day: 'Mar', sales: 22000, orders: 78 },
      { day: 'Mié', sales: 19800, orders: 71 },
      { day: 'Jue', sales: 25200, orders: 89 },
      { day: 'Vie', sales: 21700, orders: 76 },
      { day: 'Sáb', sales: 17800, orders: 62 },
      { day: 'Dom', sales: 20000, orders: 72 }
    ],
    topProducts: [
      { name: "Empanada de Carne", sales: 890, revenue: 400500, color: "#f59e0b" },
      { name: "Empanada de Pollo", sales: 756, revenue: 317520, color: "#10b981" },
      { name: "Empanada de Dulce de Leche", sales: 634, revenue: 221900, color: "#8b5cf6" },
      { name: "Empanada de Jamón y Queso", sales: 445, revenue: 169100, color: "#3b82f6" },
      { name: "Empanada de Cordero", sales: 234, revenue: 152100, color: "#ef4444" }
    ],
    salesByCategory: [
      { name: "Tradicionales", value: 60, color: "#f59e0b" },
      { name: "Gourmet", value: 20, color: "#10b981" },
      { name: "Dulces", value: 15, color: "#8b5cf6" },
      { name: "Vegetarianas", value: 5, color: "#ef4444" }
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
      { name: "Platino", value: 15, color: "#8b5cf6" },
      { name: "Oro", value: 25, color: "#ffd700" },
      { name: "Plata", value: 35, color: "#c0c0c0" },
      { name: "Bronce", value: 25, color: "#cd7f32" }
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
      { product: "Carne Picada", movement: -15, type: "out", currentStock: 5, minStock: 20 },
      { product: "Harina 000", movement: +25, type: "in", currentStock: 45, minStock: 30 },
      { product: "Queso Mozzarella", movement: -8, type: "out", currentStock: 12, minStock: 15 },
      { product: "Aceitunas", movement: +10, type: "in", currentStock: 25, minStock: 20 },
      { product: "Cebolla", movement: -12, type: "out", currentStock: 8, minStock: 15 },
      { product: "Tomate", movement: -5, type: "out", currentStock: 18, minStock: 20 },
      { product: "Aceite", movement: +15, type: "in", currentStock: 35, minStock: 25 }
    ],
    categoryDistribution: [
      { category: "Proteínas", value: 18500, percentage: 40.6, items: 8 },
      { category: "Masa", value: 12300, percentage: 27.0, items: 5 },
      { category: "Lácteos", value: 8900, percentage: 19.5, items: 6 },
      { category: "Verduras", value: 3600, percentage: 7.9, items: 4 },
      { category: "Condimentos", value: 2300, percentage: 5.0, items: 2 }
    ],
    lowStockAlerts: [
      { product: "Carne Picada", current: 5, minimum: 20, urgency: "high" },
      { product: "Queso Mozzarella", current: 12, minimum: 15, urgency: "medium" },
      { product: "Cebolla", current: 8, minimum: 15, urgency: "high" },
      { product: "Tomate", current: 18, minimum: 20, urgency: "medium" }
    ],
    topMovingProducts: [
      { product: "Carne Picada", unitsSold: 156, revenue: 46800 },
      { product: "Harina 000", unitsSold: 89, revenue: 13350 },
      { product: "Queso Mozzarella", unitsSold: 78, revenue: 23400 },
      { product: "Cebolla", unitsSold: 45, revenue: 4500 },
      { product: "Aceitunas", unitsSold: 34, revenue: 5100 }
    ]
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [dateRange, reportType]);

  const handleExportPDF = () => {
    try {
      let data, filename;
      
      switch (reportType) {
        case 'sales':
          data = salesData;
          filename = `reporte-ventas-${dateRange}-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        case 'customers':
          data = customerData;
          filename = `reporte-clientes-${dateRange}-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        case 'inventory':
          data = inventoryData;
          filename = `reporte-inventario-${dateRange}-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }
      
      const doc = generateReportPDF(reportType, data, dateRange);
      downloadPDF(doc, filename);
      
      toast.success(`Reporte de ${reportType} exportado correctamente`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error al generar el PDF. Inténtalo de nuevo.');
    }
  };

  const handleRefreshReport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Reporte actualizado");
    }, 1000);
  };

  const SalesReport = () => (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="">
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

        <Card className="">
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

        <Card className="">
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

        <Card className="">
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
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-5 h-5" />
            Ventas Diarias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={salesData.dailySales} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top productos */}
        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Productos Más Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleTopProductsChart data={salesData.topProducts} />
          </CardContent>
        </Card>

        {/* Ventas por categoría */}
        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Ventas por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCategorySalesChart data={salesData.salesByCategory} />
          </CardContent>
        </Card>
      </div>

      {/* Ventas por horario */}
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Ventas por Horario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleHourlySalesChart data={salesData.salesByHour} />
        </CardContent>
      </Card>
    </div>
  );

  const CustomerReport = () => (
    <div className="space-y-6">
      {/* Métricas de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="">
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

        <Card className="">
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

        <Card className="">
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

        <Card className="">
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
        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Mejores Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerData.topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3  rounded-lg">
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
        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Distribución por Nivel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCustomerLevelChart data={customerData.customersByLevel} />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const InventoryReport = () => (
    <div className="space-y-6">
      {/* Métricas de inventario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Productos</p>
                <p className="text-2xl font-bold">{inventoryData.totalProducts}</p>
                <p className="text-xs text-muted-foreground mt-1">En catálogo</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stock Bajo</p>
                <p className="text-2xl font-bold text-yellow-500">{inventoryData.lowStockItems}</p>
                <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sin Stock</p>
                <p className="text-2xl font-bold text-red-500">{inventoryData.outOfStockItems}</p>
                <p className="text-xs text-muted-foreground mt-1">Urgente</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-green-500">
                  {formatPrice(inventoryData.totalInventoryValue)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">En inventario</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de stock bajo */}
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Alertas de Stock Bajo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {inventoryData.lowStockAlerts.map((alert, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                alert.urgency === 'high' 
                  ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' 
                  : 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    alert.urgency === 'high' 
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                      : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{alert.product}</p>
                    <p className="text-xs text-muted-foreground">
                      Stock actual: {alert.current} | Mínimo: {alert.minimum}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={alert.urgency === 'high' ? 'destructive' : 'secondary'}>
                    {alert.urgency === 'high' ? 'Crítico' : 'Bajo'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movimientos de stock */}
        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Movimientos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventoryData.stockMovement.map((movement, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      movement.type === 'in' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {movement.type === 'in' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{movement.product}</p>
                      <p className="text-xs text-muted-foreground">
                        Stock: {movement.currentStock} | Mín: {movement.minStock}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium text-sm ${
                      movement.type === 'in' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movement.movement > 0 ? '+' : ''}{movement.movement}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {movement.type === 'in' ? 'Entrada' : 'Salida'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Productos más movidos */}
        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Productos Más Movidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryData.topMovingProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-empanada-golden rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.product}</p>
                      <p className="text-xs text-muted-foreground">{product.unitsSold} unidades</p>
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
      </div>

      {/* Distribución por categoría */}
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Distribución por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryData.categoryDistribution.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-empanada-golden"></div>
                    <span className="font-medium text-sm">{category.category}</span>
                    <Badge variant="outline" className="text-xs">
                      {category.items} items
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatPrice(category.value)}</p>
                    <p className="text-xs text-muted-foreground">{category.percentage}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-empanada-golden h-2 rounded-full transition-all duration-300"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
            className="px-3 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-empanada-golden"
          >
            <option value="today">Hoy</option>
            <option value="last7days">Últimos 7 días</option>
            <option value="last30days">Últimos 30 días</option>
            <option value="thisMonth">Este mes</option>
            <option value="lastMonth">Mes anterior</option>
            <option value="thisYear">Este año</option>
          </select>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportPDF}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleRefreshReport}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Tabs de reportes */}
      <Card className="">
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
            <Card key={i} className="animate-pulse ">
              <div className="bg-input h-64 rounded-lg" />
            </Card>
          ))}
        </div>
      ) : (
        <>
          {reportType === "sales" && <SalesReport />}
          {reportType === "customers" && <CustomerReport />}
          {reportType === "inventory" && <InventoryReport />}
        </>
      )}
    </div>
  );
}