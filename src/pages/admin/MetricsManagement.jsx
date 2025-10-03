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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SalesChart, TopProductsChart, OrdersStatusChart, CustomerTrendsChart, CategorySalesChart, HourlySalesChart, CustomerLevelChart } from "@/components/charts/DashboardCharts";
import { SimpleTopProductsChart, SimpleCategorySalesChart, SimpleHourlySalesChart, SimpleCustomerLevelChart } from "@/components/charts/SimpleCharts";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { generateReportPDF, downloadPDF } from "@/services/pdfService";
import { SectionHeader, StatsCards, CustomSelect } from "@/components/branding";

export function MetricsManagement() {
  const [dateRange, setDateRange] = useState("last7days");
  const [reportType, setReportType] = useState("sales");
  const [loading, setLoading] = useState(true);

  // Opciones para el dropdown de período
  const dateRangeOptions = [
    { value: "today", label: "Hoy" },
    { value: "last7days", label: "Últimos 7 días" },
    { value: "last30days", label: "Últimos 30 días" },
    { value: "thisMonth", label: "Este mes" },
    { value: "lastMonth", label: "Mes anterior" },
    { value: "thisYear", label: "Este año" }
  ];

  // Opciones para el tipo de reporte
  const reportTypeOptions = [
    { value: "sales", label: "Ventas" },
    { value: "customers", label: "Clientes" },
    { value: "inventory", label: "Inventario" }
  ];

  // Datos vacíos para reportes - obtener desde API
  const salesData = {
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    growth: 0,
    dailySales: [],
    topProducts: [],
    salesByCategory: [],
    salesByHour: []
  };

  const customerData = {
    totalCustomers: 0,
    newCustomers: 0,
    returningCustomers: 0,
    customerRetention: 0,
    topCustomers: [],
    customersByLevel: [],
    acquisitionChannels: []
  };

  const inventoryData = {
    totalProducts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalInventoryValue: 0,
    stockMovement: [],
    categoryDistribution: [],
    lowStockAlerts: [],
    topMovingProducts: []
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
          filename = `metricas-ventas-${dateRange}-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        case 'customers':
          data = customerData;
          filename = `metricas-clientes-${dateRange}-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        case 'inventory':
          data = inventoryData;
          filename = `metricas-inventario-${dateRange}-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        default:
          throw new Error('Tipo de métrica no válido');
      }

      const doc = generateReportPDF(reportType, data, dateRange);
      downloadPDF(doc, filename);

      toast.success(`Métricas de ${reportType} exportadas correctamente`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error al generar el PDF. Inténtalo de nuevo.');
    }
  };

  const handleRefreshReport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Métricas actualizadas");
    }, 1000);
  };

  // Preparar datos para SectionHeader
  const headerActions = [
    {
      label: "Actualizar",
      variant: "outline",
      onClick: handleRefreshReport,
      className: "h-9 px-4 text-sm font-medium",
      icon: <RefreshCcw className="w-4 h-4 mr-2" />
    }
  ];

  const SalesReport = () => {
    // Preparar datos para StatsCards - todas neutras
    const salesStatsData = [
      {
        id: "ventas-totales",
        label: "Ventas Totales",
        value: formatPrice(salesData.totalSales),
        color: "gray",
        icon: <DollarSign className="w-5 h-5" />
      },
      {
        id: "total-pedidos",
        label: "Total Pedidos",
        value: salesData.totalOrders,
        color: "gray",
        icon: <ShoppingCart className="w-5 h-5" />
      },
      {
        id: "ticket-promedio",
        label: "Ticket Promedio",
        value: formatPrice(salesData.averageOrderValue),
        color: "gray",
        icon: <BarChart3 className="w-5 h-5" />
      },
      {
        id: "productos-activos",
        label: "Productos Activos",
        value: 0,
        color: "gray",
        icon: <Package className="w-5 h-5" />
      }
    ];

    return (
      <div className="space-y-6">
        {/* Stats usando StatsCards */}
        <StatsCards stats={salesStatsData} />

        {/* Filtros de fecha y tipo de reporte */}
        <Card className="">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-white">Período:</span>
              </div>
              <div className="w-48">
                <CustomSelect
                  value={dateRange}
                  onChange={setDateRange}
                  options={dateRangeOptions}
                  placeholder="Seleccionar período"
                />
              </div>

              <div className="flex items-center gap-2 ml-0 sm:ml-4">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-white">Tipo:</span>
              </div>
              <div className="w-48">
                <CustomSelect
                  value={reportType}
                  onChange={setReportType}
                  options={reportTypeOptions}
                  placeholder="Seleccionar tipo"
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
};

  const CustomerReport = () => {
    // Preparar datos para StatsCards - todas neutras
    const customerStatsData = [
      {
        id: "total-clientes",
        label: "Total Clientes",
        value: customerData.totalCustomers,
        color: "gray",
        icon: <Users className="w-5 h-5" />
      },
      {
        id: "nuevos-clientes",
        label: "Nuevos Clientes",
        value: customerData.newCustomers,
        color: "gray",
        icon: <TrendingUp className="w-5 h-5" />
      },
      {
        id: "clientes-recurrentes",
        label: "Clientes Recurrentes",
        value: customerData.returningCustomers,
        color: "gray",
        icon: <RefreshCcw className="w-5 h-5" />
      },
      {
        id: "retencion",
        label: "Retención",
        value: `${customerData.customerRetention}%`,
        color: "gray",
        icon: <Activity className="w-5 h-5" />
      }
    ];

    return (
      <div className="space-y-6">
        {/* Stats usando StatsCards */}
        <StatsCards stats={customerStatsData} />

        {/* Filtros de fecha y tipo de reporte */}
        <Card className="">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-white">Período:</span>
              </div>
              <div className="w-48">
                <CustomSelect
                  value={dateRange}
                  onChange={setDateRange}
                  options={dateRangeOptions}
                  placeholder="Seleccionar período"
                />
              </div>

              <div className="flex items-center gap-2 ml-0 sm:ml-4">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-white">Tipo:</span>
              </div>
              <div className="w-48">
                <CustomSelect
                  value={reportType}
                  onChange={setReportType}
                  options={reportTypeOptions}
                  placeholder="Seleccionar tipo"
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
};

  const InventoryReport = () => {
    // Preparar datos para StatsCards - críticas primero, resto neutras
    const inventoryStatsData = [
      // Cards críticas primero (solo si tienen valor > 0)
      ...(inventoryData.outOfStockItems > 0 ? [{
        id: "sin-stock",
        label: "Sin Stock",
        value: inventoryData.outOfStockItems,
        color: "red",
        icon: <XCircle className="w-5 h-5" />
      }] : []),
      ...(inventoryData.lowStockItems > 0 ? [{
        id: "stock-bajo",
        label: "Stock Bajo",
        value: inventoryData.lowStockItems,
        color: "red",
        icon: <AlertTriangle className="w-5 h-5" />
      }] : []),

      // Cards neutras después
      {
        id: "total-productos",
        label: "Total Productos",
        value: inventoryData.totalProducts,
        color: "gray",
        icon: <Package className="w-5 h-5" />
      },
      {
        id: "valor-total",
        label: "Valor Total",
        value: formatPrice(inventoryData.totalInventoryValue),
        color: "gray",
        icon: <DollarSign className="w-5 h-5" />
      }
    ];

    return (
      <div className="space-y-6">
        {/* Stats usando StatsCards */}
        <StatsCards stats={inventoryStatsData} />

        {/* Filtros de fecha y tipo de reporte */}
        <Card className="">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-white">Período:</span>
              </div>
              <div className="w-48">
                <CustomSelect
                  value={dateRange}
                  onChange={setDateRange}
                  options={dateRangeOptions}
                  placeholder="Seleccionar período"
                />
              </div>

              <div className="flex items-center gap-2 ml-0 sm:ml-4">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-white">Tipo:</span>
              </div>
              <div className="w-48">
                <CustomSelect
                  value={reportType}
                  onChange={setReportType}
                  options={reportTypeOptions}
                  placeholder="Seleccionar tipo"
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
                <div className="w-full bg-gray-200 dark:bg-empanada-medium rounded-full h-2">
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
};

  return (
    <div className="space-y-6">
      {/* Header usando SectionHeader */}
      <SectionHeader
        title="Métricas y Análisis"
        subtitle="Analiza el rendimiento de tu negocio con métricas detalladas"
        icon={<BarChart3 className="w-6 h-6" />}
        actions={headerActions}
      />

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