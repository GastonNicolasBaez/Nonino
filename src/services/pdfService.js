/**
 * PDF GENERATION SERVICE - NONINO EMPANADAS
 * Servicio para generar reportes en PDF con plantillas personalizadas
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Configuración del PDF - Estilo Moderno
const PDF_CONFIG = {
  pageWidth: 210, // A4 width in mm
  pageHeight: 297, // A4 height in mm
  margin: 15,
  headerHeight: 45,
  footerHeight: 25,
  logoSize: 35,
  primaryColor: '#f59e0b', // empanada-golden
  secondaryColor: '#1f2937', // gray-800
  textColor: '#111827', // gray-900
  lightTextColor: '#6b7280', // gray-500
  accentColor: '#3b82f6', // blue-500
  successColor: '#10b981', // emerald-500
  warningColor: '#f59e0b', // amber-500
  dangerColor: '#ef4444', // red-500
  backgroundColor: '#f9fafb', // gray-50
  borderColor: '#e5e7eb' // gray-200
};

/**
 * Función helper para obtener etiqueta de estado
 */
function getStatusLabel(status) {
  const statusLabels = {
    'pending': 'Pendiente',
    'preparing': 'Preparando',
    'ready': 'Listo',
    'delivered': 'Entregado',
    'cancelled': 'Cancelado',
    'completed': 'Completado'
  };
  return statusLabels[status] || status;
}

/**
 * Genera el header del PDF con logo y título - Estilo Moderno
 */
function generatePDFHeader(doc, title, subtitle = '') {
  // Fondo del header con gradiente simulado
  doc.setFillColor(249, 250, 251); // gray-50
  doc.rect(0, 0, PDF_CONFIG.pageWidth, PDF_CONFIG.headerHeight, 'F');
  
  // Logo (simulado con texto estilizado)
  doc.setFontSize(28);
  doc.setTextColor(PDF_CONFIG.primaryColor);
  doc.text('NONINO', PDF_CONFIG.margin, PDF_CONFIG.margin + 12);
  
  doc.setFontSize(9);
  doc.setTextColor(PDF_CONFIG.lightTextColor);
  doc.text('Empanadas', PDF_CONFIG.margin, PDF_CONFIG.margin + 18);
  
  // Título del reporte con estilo moderno
  doc.setFontSize(20);
  doc.setTextColor(PDF_CONFIG.secondaryColor);
  doc.text(title, PDF_CONFIG.pageWidth - PDF_CONFIG.margin, PDF_CONFIG.margin + 12, { align: 'right' });
  
  if (subtitle) {
    doc.setFontSize(11);
    doc.setTextColor(PDF_CONFIG.lightTextColor);
    doc.text(subtitle, PDF_CONFIG.pageWidth - PDF_CONFIG.margin, PDF_CONFIG.margin + 20, { align: 'right' });
  }
  
  // Fecha de generación con estilo moderno
  doc.setFontSize(9);
  doc.setTextColor(PDF_CONFIG.lightTextColor);
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`, PDF_CONFIG.pageWidth - PDF_CONFIG.margin, PDF_CONFIG.margin + 28, { align: 'right' });
  
  // Línea separadora moderna con gradiente
  doc.setDrawColor(PDF_CONFIG.primaryColor);
  doc.setLineWidth(1);
  doc.line(PDF_CONFIG.margin, PDF_CONFIG.margin + 32, PDF_CONFIG.pageWidth - PDF_CONFIG.margin, PDF_CONFIG.margin + 32);
  
  // Línea sutil adicional
  doc.setDrawColor(PDF_CONFIG.borderColor);
  doc.setLineWidth(0.5);
  doc.line(PDF_CONFIG.margin, PDF_CONFIG.margin + 33, PDF_CONFIG.pageWidth - PDF_CONFIG.margin, PDF_CONFIG.margin + 33);
}

/**
 * Genera el footer del PDF
 */
function generatePDFFooter(doc, pageNumber, totalPages) {
  const footerY = PDF_CONFIG.pageHeight - PDF_CONFIG.footerHeight;
  
  // Línea separadora
  doc.setDrawColor(PDF_CONFIG.primaryColor);
  doc.setLineWidth(0.5);
  doc.line(PDF_CONFIG.margin, footerY - 5, PDF_CONFIG.pageWidth - PDF_CONFIG.margin, footerY - 5);
  
  // Información de página
  doc.setFontSize(8);
  doc.setTextColor(PDF_CONFIG.lightTextColor);
  doc.text(`Página ${pageNumber} de ${totalPages}`, PDF_CONFIG.pageWidth - PDF_CONFIG.margin, footerY, { align: 'right' });
  
  // Copyright
  doc.text('© 2025 Nonino Empanadas - Todos los derechos reservados', PDF_CONFIG.margin, footerY);
}

/**
 * Formatea un número como precio
 */
function formatPrice(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Genera un reporte de ventas en PDF
 */
export function generateSalesReportPDF(salesData, dateRange) {
  const doc = new jsPDF();
  let currentY = PDF_CONFIG.margin + PDF_CONFIG.headerHeight;
  
  // Header
  generatePDFHeader(doc, 'Reporte de Ventas', `Período: ${getDateRangeLabel(dateRange)}`);
  
  // Métricas principales
  doc.setFontSize(14);
  doc.setTextColor(PDF_CONFIG.textColor);
  doc.text('Resumen Ejecutivo', PDF_CONFIG.margin, currentY);
  currentY += 10;
  
  // Grid de métricas
  const metrics = [
    { label: 'Ventas Totales', value: formatPrice(salesData.totalSales), color: PDF_CONFIG.primaryColor },
    { label: 'Total Pedidos', value: salesData.totalOrders.toString(), color: '#3b82f6' },
    { label: 'Ticket Promedio', value: formatPrice(salesData.averageOrderValue), color: '#10b981' },
    { label: 'Crecimiento', value: `+${salesData.growth}%`, color: '#ef4444' }
  ];
  
  metrics.forEach((metric, index) => {
    const x = PDF_CONFIG.margin + (index % 2) * 85;
    const y = currentY + Math.floor(index / 2) * 25;
    
    // Fondo del métrica
    doc.setFillColor(240, 240, 240);
    doc.rect(x, y - 5, 80, 20, 'F');
    
    // Valor
    doc.setFontSize(16);
    doc.setTextColor(metric.color);
    doc.text(metric.value, x + 5, y + 5);
    
    // Label
    doc.setFontSize(8);
    doc.setTextColor(PDF_CONFIG.lightTextColor);
    doc.text(metric.label, x + 5, y + 12);
  });
  
  currentY += 60;
  
  // Top productos
  doc.setFontSize(14);
  doc.setTextColor(PDF_CONFIG.textColor);
  doc.text('Productos Más Vendidos', PDF_CONFIG.margin, currentY);
  currentY += 10;
  
  salesData.topProducts.forEach((product, index) => {
    if (currentY > PDF_CONFIG.pageHeight - PDF_CONFIG.footerHeight - 20) {
      doc.addPage();
      generatePDFHeader(doc, 'Reporte de Ventas', `Período: ${getDateRangeLabel(dateRange)}`);
      currentY = PDF_CONFIG.margin + PDF_CONFIG.headerHeight + 10;
    }
    
    // Ranking
    doc.setFontSize(12);
    doc.setTextColor(PDF_CONFIG.primaryColor);
    doc.text(`#${index + 1}`, PDF_CONFIG.margin, currentY);
    
    // Nombre del producto
    doc.setTextColor(PDF_CONFIG.textColor);
    doc.text(product.name, PDF_CONFIG.margin + 15, currentY);
    
    // Ventas y revenue
    doc.setTextColor(PDF_CONFIG.lightTextColor);
    doc.text(`${product.sales} unidades vendidas`, PDF_CONFIG.margin + 15, currentY + 6);
    doc.text(formatPrice(product.revenue), PDF_CONFIG.pageWidth - PDF_CONFIG.margin, currentY, { align: 'right' });
    
    currentY += 15;
  });
  
  // Ventas por categoría
  currentY += 10;
  doc.setFontSize(14);
  doc.setTextColor(PDF_CONFIG.textColor);
  doc.text('Ventas por Categoría', PDF_CONFIG.margin, currentY);
  currentY += 10;
  
  salesData.salesByCategory.forEach((category, index) => {
    if (currentY > PDF_CONFIG.pageHeight - PDF_CONFIG.footerHeight - 20) {
      doc.addPage();
      generatePDFHeader(doc, 'Reporte de Ventas', `Período: ${getDateRangeLabel(dateRange)}`);
      currentY = PDF_CONFIG.margin + PDF_CONFIG.headerHeight + 10;
    }
    
    // Barra de progreso visual
    const barWidth = (category.value / 100) * 100;
    doc.setFillColor(240, 240, 240);
    doc.rect(PDF_CONFIG.margin, currentY - 2, 100, 8, 'F');
    doc.setFillColor(PDF_CONFIG.primaryColor);
    doc.rect(PDF_CONFIG.margin, currentY - 2, barWidth, 8, 'F');
    
    // Texto
    doc.setFontSize(10);
    doc.setTextColor(PDF_CONFIG.textColor);
    doc.text(category.name, PDF_CONFIG.margin + 105, currentY + 2);
    doc.text(`${category.value}%`, PDF_CONFIG.pageWidth - PDF_CONFIG.margin, currentY + 2, { align: 'right' });
    
    currentY += 12;
  });
  
  // Footer
  generatePDFFooter(doc, 1, 1);
  
  return doc;
}

/**
 * Genera un reporte de clientes en PDF
 */
export function generateCustomerReportPDF(customerData, dateRange) {
  const doc = new jsPDF();
  let currentY = PDF_CONFIG.margin + PDF_CONFIG.headerHeight;
  
  // Header
  generatePDFHeader(doc, 'Reporte de Clientes', `Período: ${getDateRangeLabel(dateRange)}`);
  
  // Métricas principales
  doc.setFontSize(14);
  doc.setTextColor(PDF_CONFIG.textColor);
  doc.text('Resumen Ejecutivo', PDF_CONFIG.margin, currentY);
  currentY += 10;
  
  // Grid de métricas
  const metrics = [
    { label: 'Total Clientes', value: customerData.totalCustomers.toString(), color: '#3b82f6' },
    { label: 'Nuevos Clientes', value: customerData.newCustomers.toString(), color: '#10b981' },
    { label: 'Clientes Recurrentes', value: customerData.returningCustomers.toString(), color: PDF_CONFIG.primaryColor },
    { label: 'Retención', value: `${customerData.customerRetention}%`, color: '#8b5cf6' }
  ];
  
  metrics.forEach((metric, index) => {
    const x = PDF_CONFIG.margin + (index % 2) * 85;
    const y = currentY + Math.floor(index / 2) * 25;
    
    // Fondo del métrica
    doc.setFillColor(240, 240, 240);
    doc.rect(x, y - 5, 80, 20, 'F');
    
    // Valor
    doc.setFontSize(16);
    doc.setTextColor(metric.color);
    doc.text(metric.value, x + 5, y + 5);
    
    // Label
    doc.setFontSize(8);
    doc.setTextColor(PDF_CONFIG.lightTextColor);
    doc.text(metric.label, x + 5, y + 12);
  });
  
  currentY += 60;
  
  // Top clientes
  doc.setFontSize(14);
  doc.setTextColor(PDF_CONFIG.textColor);
  doc.text('Mejores Clientes', PDF_CONFIG.margin, currentY);
  currentY += 10;
  
  customerData.topCustomers.forEach((customer, index) => {
    if (currentY > PDF_CONFIG.pageHeight - PDF_CONFIG.footerHeight - 20) {
      doc.addPage();
      generatePDFHeader(doc, 'Reporte de Clientes', `Período: ${getDateRangeLabel(dateRange)}`);
      currentY = PDF_CONFIG.margin + PDF_CONFIG.headerHeight + 10;
    }
    
    // Ranking
    doc.setFontSize(12);
    doc.setTextColor(PDF_CONFIG.primaryColor);
    doc.text(`#${index + 1}`, PDF_CONFIG.margin, currentY);
    
    // Nombre del cliente
    doc.setTextColor(PDF_CONFIG.textColor);
    doc.text(customer.name, PDF_CONFIG.margin + 15, currentY);
    
    // Detalles
    doc.setTextColor(PDF_CONFIG.lightTextColor);
    doc.text(`${customer.orders} pedidos`, PDF_CONFIG.margin + 15, currentY + 6);
    doc.text(formatPrice(customer.spent), PDF_CONFIG.pageWidth - PDF_CONFIG.margin, currentY, { align: 'right' });
    
    currentY += 15;
  });
  
  // Distribución por nivel
  currentY += 10;
  doc.setFontSize(14);
  doc.setTextColor(PDF_CONFIG.textColor);
  doc.text('Distribución por Nivel de Cliente', PDF_CONFIG.margin, currentY);
  currentY += 10;
  
  customerData.customersByLevel.forEach((level, index) => {
    if (currentY > PDF_CONFIG.pageHeight - PDF_CONFIG.footerHeight - 20) {
      doc.addPage();
      generatePDFHeader(doc, 'Reporte de Clientes', `Período: ${getDateRangeLabel(dateRange)}`);
      currentY = PDF_CONFIG.margin + PDF_CONFIG.headerHeight + 10;
    }
    
    // Barra de progreso visual
    const barWidth = (level.value / 100) * 100;
    doc.setFillColor(240, 240, 240);
    doc.rect(PDF_CONFIG.margin, currentY - 2, 100, 8, 'F');
    doc.setFillColor(PDF_CONFIG.primaryColor);
    doc.rect(PDF_CONFIG.margin, currentY - 2, barWidth, 8, 'F');
    
    // Texto
    doc.setFontSize(10);
    doc.setTextColor(PDF_CONFIG.textColor);
    doc.text(level.name, PDF_CONFIG.margin + 105, currentY + 2);
    doc.text(`${level.value}%`, PDF_CONFIG.pageWidth - PDF_CONFIG.margin, currentY + 2, { align: 'right' });
    
    currentY += 12;
  });
  
  // Footer
  generatePDFFooter(doc, 1, 1);
  
  return doc;
}


/**
 * Obtiene el label del rango de fechas
 */
function getDateRangeLabel(dateRange) {
  const labels = {
    'today': 'Hoy',
    'last7days': 'Últimos 7 días',
    'last30days': 'Últimos 30 días',
    'thisMonth': 'Este mes',
    'lastMonth': 'Mes anterior',
    'thisYear': 'Este año'
  };
  return labels[dateRange] || dateRange;
}

/**
 * Función principal para generar PDF según el tipo de reporte
 */
export function generateReportPDF(reportType, data, dateRange) {
  switch (reportType) {
    case 'sales':
      return generateSalesReportPDF(data, dateRange);
    case 'customers':
      return generateCustomerReportPDF(data, dateRange);
    case 'inventory':
      return generateInventoryReportPDF(data, {});
    default:
      throw new Error(`Tipo de reporte no soportado: ${reportType}`);
  }
}

/**
 * Genera un reporte de pedidos en PDF
 */
export function generateOrdersReportPDF(ordersData, filters = {}) {
  const doc = new jsPDF();
  let currentY = PDF_CONFIG.margin + PDF_CONFIG.headerHeight;
  
  // Header
  generatePDFHeader(doc, 'Reporte de Pedidos', `Filtros aplicados: ${getFiltersLabel(filters)}`);
  
  // Métricas principales
  doc.setFontSize(16);
  doc.setTextColor(PDF_CONFIG.secondaryColor);
  doc.text('Resumen Ejecutivo', PDF_CONFIG.margin, currentY);
  currentY += 12;
  
  // Grid de métricas moderno
  const metrics = [
    { label: 'Total Pedidos', value: ordersData.length.toString(), color: PDF_CONFIG.accentColor },
    { label: 'Valor Total', value: formatPrice(ordersData.reduce((sum, order) => sum + order.total, 0)), color: PDF_CONFIG.successColor },
    { label: 'Promedio por Pedido', value: formatPrice(ordersData.reduce((sum, order) => sum + order.total, 0) / ordersData.length || 0), color: PDF_CONFIG.warningColor },
    { label: 'Pedidos Pendientes', value: ordersData.filter(o => o.status === 'pending').length.toString(), color: PDF_CONFIG.dangerColor }
  ];
  
  metrics.forEach((metric, index) => {
    const x = PDF_CONFIG.margin + (index % 2) * 90;
    const y = currentY + Math.floor(index / 2) * 30;
    
    // Fondo moderno del métrica
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y - 8, 85, 25, 3, 3, 'F');
    doc.setDrawColor(PDF_CONFIG.borderColor);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y - 8, 85, 25, 3, 3, 'S');
    
    // Valor
    doc.setFontSize(18);
    doc.setTextColor(metric.color);
    doc.text(metric.value, x + 8, y + 2);
    
    // Label
    doc.setFontSize(9);
    doc.setTextColor(PDF_CONFIG.lightTextColor);
    doc.text(metric.label, x + 8, y + 10);
  });
  
  currentY += 80;
  
  // Tabla de pedidos
  doc.setFontSize(16);
  doc.setTextColor(PDF_CONFIG.secondaryColor);
  doc.text('Detalle de Pedidos', PDF_CONFIG.margin, currentY);
  currentY += 15;
  
  // Headers de tabla
  const tableHeaders = ['ID', 'Cliente', 'Fecha', 'Estado', 'Total'];
  const colWidths = [25, 60, 30, 25, 30];
  let xPos = PDF_CONFIG.margin;
  
  // Header de tabla con fondo
  doc.setFillColor(PDF_CONFIG.primaryColor);
  doc.rect(PDF_CONFIG.margin, currentY - 5, PDF_CONFIG.pageWidth - 2 * PDF_CONFIG.margin, 8, 'F');
  
  tableHeaders.forEach((header, index) => {
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(header, xPos + 2, currentY + 1);
    xPos += colWidths[index];
  });
  
  currentY += 10;
  
  // Filas de datos
  ordersData.slice(0, 20).forEach((order, index) => {
    if (currentY > PDF_CONFIG.pageHeight - PDF_CONFIG.footerHeight - 20) {
      doc.addPage();
      generatePDFHeader(doc, 'Reporte de Pedidos', `Filtros aplicados: ${getFiltersLabel(filters)}`);
      currentY = PDF_CONFIG.margin + PDF_CONFIG.headerHeight + 10;
    }
    
    xPos = PDF_CONFIG.margin;
    const rowData = [
      order.id.substring(0, 8),
      order.customerName.substring(0, 25),
      new Date(order.orderDate).toLocaleDateString('es-AR'),
      getStatusLabel(order.status),
      formatPrice(order.total)
    ];
    
    rowData.forEach((data, colIndex) => {
      doc.setFontSize(9);
      doc.setTextColor(PDF_CONFIG.textColor);
      doc.text(data, xPos + 2, currentY + 1);
      xPos += colWidths[colIndex];
    });
    
    // Línea separadora sutil
    doc.setDrawColor(PDF_CONFIG.borderColor);
    doc.setLineWidth(0.3);
    doc.line(PDF_CONFIG.margin, currentY + 3, PDF_CONFIG.pageWidth - PDF_CONFIG.margin, currentY + 3);
    
    currentY += 8;
  });
  
  // Footer
  generatePDFFooter(doc, 1, 1);
  
  return doc;
}

/**
 * Genera un reporte de productos en PDF
 */
export function generateProductsReportPDF(productsData, stats = {}) {
  const doc = new jsPDF();
  let currentY = PDF_CONFIG.margin + PDF_CONFIG.headerHeight;
  
  // Header
  generatePDFHeader(doc, 'Reporte de Productos', `Catálogo completo de productos`);
  
  // Métricas principales
  doc.setFontSize(16);
  doc.setTextColor(PDF_CONFIG.secondaryColor);
  doc.text('Resumen del Catálogo', PDF_CONFIG.margin, currentY);
  currentY += 12;
  
  // Grid de métricas
  const metrics = [
    { label: 'Total Productos', value: stats.total?.toString() || productsData.length.toString(), color: PDF_CONFIG.accentColor },
    { label: 'Disponibles', value: stats.available?.toString() || productsData.filter(p => p.status === 'active').length.toString(), color: PDF_CONFIG.successColor },
    { label: 'Agotados', value: stats.outOfStock?.toString() || productsData.filter(p => p.stock === 0).length.toString(), color: PDF_CONFIG.dangerColor },
    { label: 'Stock Bajo', value: stats.lowStock?.toString() || productsData.filter(p => p.stock < 10).length.toString(), color: PDF_CONFIG.warningColor }
  ];
  
  metrics.forEach((metric, index) => {
    const x = PDF_CONFIG.margin + (index % 2) * 90;
    const y = currentY + Math.floor(index / 2) * 30;
    
    // Fondo moderno del métrica
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y - 8, 85, 25, 3, 3, 'F');
    doc.setDrawColor(PDF_CONFIG.borderColor);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y - 8, 85, 25, 3, 3, 'S');
    
    // Valor
    doc.setFontSize(18);
    doc.setTextColor(metric.color);
    doc.text(metric.value, x + 8, y + 2);
    
    // Label
    doc.setFontSize(9);
    doc.setTextColor(PDF_CONFIG.lightTextColor);
    doc.text(metric.label, x + 8, y + 10);
  });
  
  currentY += 80;
  
  // Tabla de productos
  doc.setFontSize(16);
  doc.setTextColor(PDF_CONFIG.secondaryColor);
  doc.text('Lista de Productos', PDF_CONFIG.margin, currentY);
  currentY += 15;
  
  // Headers de tabla
  const tableHeaders = ['Producto', 'Categoría', 'Precio', 'Stock', 'Estado'];
  const colWidths = [60, 30, 25, 20, 25];
  let xPos = PDF_CONFIG.margin;
  
  // Header de tabla
  doc.setFillColor(PDF_CONFIG.primaryColor);
  doc.rect(PDF_CONFIG.margin, currentY - 5, PDF_CONFIG.pageWidth - 2 * PDF_CONFIG.margin, 8, 'F');
  
  tableHeaders.forEach((header, index) => {
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(header, xPos + 2, currentY + 1);
    xPos += colWidths[index];
  });
  
  currentY += 10;
  
  // Filas de datos
  productsData.slice(0, 25).forEach((product, index) => {
    if (currentY > PDF_CONFIG.pageHeight - PDF_CONFIG.footerHeight - 20) {
      doc.addPage();
      generatePDFHeader(doc, 'Reporte de Productos', `Catálogo completo de productos`);
      currentY = PDF_CONFIG.margin + PDF_CONFIG.headerHeight + 10;
    }
    
    xPos = PDF_CONFIG.margin;
    const rowData = [
      product.name.substring(0, 30),
      product.category?.substring(0, 15) || 'Sin categoría',
      formatPrice(product.price),
      product.stock?.toString() || '0',
      product.status === 'active' ? 'Activo' : 'Inactivo'
    ];
    
    rowData.forEach((data, colIndex) => {
      doc.setFontSize(9);
      doc.setTextColor(PDF_CONFIG.textColor);
      doc.text(data, xPos + 2, currentY + 1);
      xPos += colWidths[colIndex];
    });
    
    // Línea separadora
    doc.setDrawColor(PDF_CONFIG.borderColor);
    doc.setLineWidth(0.3);
    doc.line(PDF_CONFIG.margin, currentY + 3, PDF_CONFIG.pageWidth - PDF_CONFIG.margin, currentY + 3);
    
    currentY += 8;
  });
  
  // Footer
  generatePDFFooter(doc, 1, 1);
  
  return doc;
}

/**
 * Genera un reporte de clientes en PDF
 */
export function generateCustomersReportPDF(customersData, stats = {}) {
  const doc = new jsPDF();
  let currentY = PDF_CONFIG.margin + PDF_CONFIG.headerHeight;
  
  // Header
  generatePDFHeader(doc, 'Reporte de Clientes', `Base de datos de clientes`);
  
  // Métricas principales
  doc.setFontSize(16);
  doc.setTextColor(PDF_CONFIG.secondaryColor);
  doc.text('Resumen de Clientes', PDF_CONFIG.margin, currentY);
  currentY += 12;
  
  // Grid de métricas
  const metrics = [
    { label: 'Total Clientes', value: stats.total?.toString() || customersData.length.toString(), color: PDF_CONFIG.accentColor },
    { label: 'Activos', value: stats.active?.toString() || customersData.filter(c => c.status === 'active').length.toString(), color: PDF_CONFIG.successColor },
    { label: 'Nuevos Este Mes', value: stats.newThisMonth?.toString() || '0', color: PDF_CONFIG.warningColor },
    { label: 'Clientes VIP', value: stats.vip?.toString() || '0', color: PDF_CONFIG.primaryColor }
  ];
  
  metrics.forEach((metric, index) => {
    const x = PDF_CONFIG.margin + (index % 2) * 90;
    const y = currentY + Math.floor(index / 2) * 30;
    
    // Fondo moderno del métrica
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y - 8, 85, 25, 3, 3, 'F');
    doc.setDrawColor(PDF_CONFIG.borderColor);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y - 8, 85, 25, 3, 3, 'S');
    
    // Valor
    doc.setFontSize(18);
    doc.setTextColor(metric.color);
    doc.text(metric.value, x + 8, y + 2);
    
    // Label
    doc.setFontSize(9);
    doc.setTextColor(PDF_CONFIG.lightTextColor);
    doc.text(metric.label, x + 8, y + 10);
  });
  
  currentY += 80;
  
  // Tabla de clientes
  doc.setFontSize(16);
  doc.setTextColor(PDF_CONFIG.secondaryColor);
  doc.text('Lista de Clientes', PDF_CONFIG.margin, currentY);
  currentY += 15;
  
  // Headers de tabla
  const tableHeaders = ['Cliente', 'Email', 'Teléfono', 'Pedidos', 'Estado'];
  const colWidths = [50, 50, 30, 20, 20];
  let xPos = PDF_CONFIG.margin;
  
  // Header de tabla
  doc.setFillColor(PDF_CONFIG.primaryColor);
  doc.rect(PDF_CONFIG.margin, currentY - 5, PDF_CONFIG.pageWidth - 2 * PDF_CONFIG.margin, 8, 'F');
  
  tableHeaders.forEach((header, index) => {
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(header, xPos + 2, currentY + 1);
    xPos += colWidths[index];
  });
  
  currentY += 10;
  
  // Filas de datos
  customersData.slice(0, 25).forEach((customer, index) => {
    if (currentY > PDF_CONFIG.pageHeight - PDF_CONFIG.footerHeight - 20) {
      doc.addPage();
      generatePDFHeader(doc, 'Reporte de Clientes', `Base de datos de clientes`);
      currentY = PDF_CONFIG.margin + PDF_CONFIG.headerHeight + 10;
    }
    
    xPos = PDF_CONFIG.margin;
    const rowData = [
      customer.name?.substring(0, 25) || 'Sin nombre',
      customer.email?.substring(0, 25) || 'Sin email',
      customer.phone?.substring(0, 15) || 'Sin teléfono',
      customer.totalOrders?.toString() || '0',
      customer.status === 'active' ? 'Activo' : 'Inactivo'
    ];
    
    rowData.forEach((data, colIndex) => {
      doc.setFontSize(9);
      doc.setTextColor(PDF_CONFIG.textColor);
      doc.text(data, xPos + 2, currentY + 1);
      xPos += colWidths[colIndex];
    });
    
    // Línea separadora
    doc.setDrawColor(PDF_CONFIG.borderColor);
    doc.setLineWidth(0.3);
    doc.line(PDF_CONFIG.margin, currentY + 3, PDF_CONFIG.pageWidth - PDF_CONFIG.margin, currentY + 3);
    
    currentY += 8;
  });
  
  // Footer
  generatePDFFooter(doc, 1, 1);
  
  return doc;
}

/**
 * Genera un reporte de inventario en PDF
 */
export function generateInventoryReportPDF(inventoryData, stats = {}) {
  const doc = new jsPDF();
  let currentY = PDF_CONFIG.margin + PDF_CONFIG.headerHeight;
  
  // Header
  generatePDFHeader(doc, 'Reporte de Inventario', `Control de stock y productos`);
  
  // Métricas principales
  doc.setFontSize(16);
  doc.setTextColor(PDF_CONFIG.secondaryColor);
  doc.text('Resumen del Inventario', PDF_CONFIG.margin, currentY);
  currentY += 12;
  
  // Grid de métricas
  const metrics = [
    { label: 'Total Items', value: stats.totalItems?.toString() || inventoryData.length.toString(), color: PDF_CONFIG.accentColor },
    { label: 'Stock Bajo', value: stats.lowStock?.toString() || inventoryData.filter(i => i.currentStock < i.minStock).length.toString(), color: PDF_CONFIG.warningColor },
    { label: 'Sin Stock', value: stats.outOfStock?.toString() || inventoryData.filter(i => i.currentStock === 0).length.toString(), color: PDF_CONFIG.dangerColor },
    { label: 'Valor Total', value: formatPrice(stats.totalValue || inventoryData.reduce((sum, item) => sum + (item.currentStock * item.price), 0)), color: PDF_CONFIG.successColor }
  ];
  
  metrics.forEach((metric, index) => {
    const x = PDF_CONFIG.margin + (index % 2) * 90;
    const y = currentY + Math.floor(index / 2) * 30;
    
    // Fondo moderno del métrica
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y - 8, 85, 25, 3, 3, 'F');
    doc.setDrawColor(PDF_CONFIG.borderColor);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y - 8, 85, 25, 3, 3, 'S');
    
    // Valor
    doc.setFontSize(18);
    doc.setTextColor(metric.color);
    doc.text(metric.value, x + 8, y + 2);
    
    // Label
    doc.setFontSize(9);
    doc.setTextColor(PDF_CONFIG.lightTextColor);
    doc.text(metric.label, x + 8, y + 10);
  });
  
  currentY += 80;
  
  // Tabla de inventario
  doc.setFontSize(16);
  doc.setTextColor(PDF_CONFIG.secondaryColor);
  doc.text('Estado del Inventario', PDF_CONFIG.margin, currentY);
  currentY += 15;
  
  // Headers de tabla
  const tableHeaders = ['Producto', 'Categoría', 'Stock Actual', 'Stock Mín.', 'Estado'];
  const colWidths = [50, 30, 25, 25, 20];
  let xPos = PDF_CONFIG.margin;
  
  // Header de tabla
  doc.setFillColor(PDF_CONFIG.primaryColor);
  doc.rect(PDF_CONFIG.margin, currentY - 5, PDF_CONFIG.pageWidth - 2 * PDF_CONFIG.margin, 8, 'F');
  
  tableHeaders.forEach((header, index) => {
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(header, xPos + 2, currentY + 1);
    xPos += colWidths[index];
  });
  
  currentY += 10;
  
  // Filas de datos
  inventoryData.slice(0, 25).forEach((item, index) => {
    if (currentY > PDF_CONFIG.pageHeight - PDF_CONFIG.footerHeight - 20) {
      doc.addPage();
      generatePDFHeader(doc, 'Reporte de Inventario', `Control de stock y productos`);
      currentY = PDF_CONFIG.margin + PDF_CONFIG.headerHeight + 10;
    }
    
    xPos = PDF_CONFIG.margin;
    const stockStatus = item.currentStock === 0 ? 'Sin Stock' : 
                       item.currentStock < item.minStock ? 'Stock Bajo' : 'Normal';
    
    const rowData = [
      item.name?.substring(0, 25) || 'Sin nombre',
      item.category?.substring(0, 15) || 'Sin categoría',
      item.currentStock?.toString() || '0',
      item.minStock?.toString() || '0',
      stockStatus
    ];
    
    rowData.forEach((data, colIndex) => {
      doc.setFontSize(9);
      doc.setTextColor(PDF_CONFIG.textColor);
      doc.text(data, xPos + 2, currentY + 1);
      xPos += colWidths[colIndex];
    });
    
    // Línea separadora
    doc.setDrawColor(PDF_CONFIG.borderColor);
    doc.setLineWidth(0.3);
    doc.line(PDF_CONFIG.margin, currentY + 3, PDF_CONFIG.pageWidth - PDF_CONFIG.margin, currentY + 3);
    
    currentY += 8;
  });
  
  // Footer
  generatePDFFooter(doc, 1, 1);
  
  return doc;
}

/**
 * Genera un reporte de configuración del sistema en PDF
 */
export function generateSystemConfigReportPDF(configData) {
  const doc = new jsPDF();
  let currentY = PDF_CONFIG.margin + PDF_CONFIG.headerHeight;
  
  // Header
  generatePDFHeader(doc, 'Configuración del Sistema', `Datos de configuración y locales`);
  
  // Información general
  doc.setFontSize(16);
  doc.setTextColor(PDF_CONFIG.secondaryColor);
  doc.text('Información del Sistema', PDF_CONFIG.margin, currentY);
  currentY += 15;
  
  // Datos del sistema
  const systemInfo = [
    { label: 'Nombre del Negocio', value: 'Nonino Empanadas' },
    { label: 'Versión del Sistema', value: '1.0.0' },
    { label: 'Fecha de Generación', value: new Date().toLocaleDateString('es-AR') },
    { label: 'Total de Locales', value: configData.stores?.length?.toString() || '0' },
    { label: 'Promociones Activas', value: configData.promotions?.length?.toString() || '0' }
  ];
  
  systemInfo.forEach((info, index) => {
    doc.setFontSize(11);
    doc.setTextColor(PDF_CONFIG.textColor);
    doc.text(`${info.label}:`, PDF_CONFIG.margin, currentY);
    doc.text(info.value, PDF_CONFIG.margin + 60, currentY);
    currentY += 8;
  });
  
  currentY += 10;
  
  // Locales
  if (configData.stores && configData.stores.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(PDF_CONFIG.secondaryColor);
    doc.text('Locales Configurados', PDF_CONFIG.margin, currentY);
    currentY += 15;
    
    configData.stores.forEach((store, index) => {
      if (currentY > PDF_CONFIG.pageHeight - PDF_CONFIG.footerHeight - 30) {
        doc.addPage();
        generatePDFHeader(doc, 'Configuración del Sistema', `Datos de configuración y locales`);
        currentY = PDF_CONFIG.margin + PDF_CONFIG.headerHeight + 10;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(PDF_CONFIG.primaryColor);
      doc.text(`${index + 1}. ${store.name || 'Local sin nombre'}`, PDF_CONFIG.margin, currentY);
      currentY += 8;
      
      if (store.address) {
        doc.setFontSize(10);
        doc.setTextColor(PDF_CONFIG.textColor);
        doc.text(`Dirección: ${store.address}`, PDF_CONFIG.margin + 5, currentY);
        currentY += 6;
      }
      
      if (store.phone) {
        doc.setFontSize(10);
        doc.setTextColor(PDF_CONFIG.textColor);
        doc.text(`Teléfono: ${store.phone}`, PDF_CONFIG.margin + 5, currentY);
        currentY += 6;
      }
      
      currentY += 5;
    });
  }
  
  // Footer
  generatePDFFooter(doc, 1, 1);
  
  return doc;
}

/**
 * Obtiene el label de los filtros aplicados
 */
function getFiltersLabel(filters) {
  const labels = [];
  if (filters.status && filters.status !== 'all') {
    labels.push(`Estado: ${filters.status}`);
  }
  if (filters.searchTerm) {
    labels.push(`Búsqueda: ${filters.searchTerm}`);
  }
  if (filters.dateRange) {
    labels.push(`Período: ${filters.dateRange}`);
  }
  return labels.length > 0 ? labels.join(', ') : 'Sin filtros';
}

/**
 * Descarga el PDF generado
 */
export function downloadPDF(doc, filename) {
  doc.save(filename);
}
