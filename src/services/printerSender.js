/**
 * PRINTER SENDER SERVICE - NONINO EMPANADAS
 * Abstracción para envío de tickets a impresora térmica
 * Modo dev: genera PDF preview
 * Modo prod: envía por Bluetooth/TCP a impresora
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { formatToEscPos, downloadEscPosFile } from './printFormatter';

/**
 * Configuración del sistema de impresión
 */
const PRINT_CONFIG = {
  // Configuración PDF (modo desarrollo)
  pdf: {
    format: 'a4',
    margin: 10,
    ticketWidth: 80, // mm - ancho del ticket en PDF
    dpi: 203
  },

  // Configuración impresora (modo producción)
  printer: {
    width: 48, // mm - ancho útil de impresión
    widthPx: 384, // px - ancho en píxeles a 203 DPI
    bluetoothServiceUUID: '00001101-0000-1000-8000-00805f9b34fb', // Serial Port Profile
    tcpPort: 9100, // Puerto estándar para impresoras de red
    timeout: 5000 // ms
  }
};

/**
 * Función principal para imprimir orden
 * @param {Object} order - Objeto orden
 * @param {Object} options - Opciones de impresión
 * @param {string} options.mode - 'dev' | 'prod'
 * @param {React.RefObject} options.elementRef - Referencia al elemento DOM del ticket
 * @param {string} options.printerAddress - Dirección IP o MAC de la impresora (modo prod)
 */
export async function printOrder(order, options = {}) {
  const {
    mode = 'dev',
    elementRef = null,
    printerAddress = null,
    connectionType = 'tcp' // 'tcp' | 'bluetooth' | 'usb'
  } = options;

  console.log(`Printing order ${order.id} in mode: ${mode}`);

  try {
    if (mode === 'dev') {
      return await generatePDFPreview(order, elementRef);
    } else {
      return await sendToPrinter(order, { printerAddress, connectionType });
    }
  } catch (error) {
    console.error('Print operation failed:', error);
    throw error;
  }
}

/**
 * Generar PDF preview para modo desarrollo
 * Usa html2canvas + jsPDF para crear exactamente lo que se vería en el ticket
 */
async function generatePDFPreview(order, elementRef) {
  if (!elementRef?.current) {
    throw new Error('Element reference is required for PDF generation');
  }

  try {
    // Configurar el elemento para captura óptima
    const element = elementRef.current;
    const originalStyle = {
      transform: element.style.transform,
      width: element.style.width,
      height: element.style.height
    };

    // Asegurar que el elemento tenga el tamaño correcto
    element.style.transform = 'scale(1)';
    element.style.width = `${PRINT_CONFIG.printer.widthPx}px`;

    // Generar canvas del elemento
    const canvas = await html2canvas(element, {
      width: PRINT_CONFIG.printer.widthPx,
      height: element.offsetHeight,
      scale: 2, // Mayor resolución para mejor calidad
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false
    });

    // Restaurar estilos originales
    Object.assign(element.style, originalStyle);

    // Crear PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [PRINT_CONFIG.pdf.ticketWidth, 210] // Ancho fijo, altura automática
    });

    // Calcular dimensiones para el PDF
    const pdfWidth = PRINT_CONFIG.pdf.ticketWidth - (PRINT_CONFIG.pdf.margin * 2);
    const imgAspectRatio = canvas.height / canvas.width;
    const pdfHeight = pdfWidth * imgAspectRatio;

    // Añadir imagen al PDF
    pdf.addImage(
      imgData,
      'PNG',
      PRINT_CONFIG.pdf.margin,
      PRINT_CONFIG.pdf.margin,
      pdfWidth,
      pdfHeight
    );

    // Añadir metadatos
    pdf.setProperties({
      title: `Ticket - ${order.id}`,
      subject: 'Ticket de Pedido - Nonino Empanadas',
      author: 'Sistema POS Nonino',
      creator: 'Nonino Empanadas POS'
    });

    // Descargar PDF
    const filename = `ticket-${order.id}.pdf`;
    pdf.save(filename);

    console.log(`PDF preview generated: ${filename}`);
    return { success: true, filename };

  } catch (error) {
    console.error('Error generating PDF preview:', error);
    throw new Error('Failed to generate PDF preview');
  }
}

/**
 * Enviar ticket a impresora en modo producción
 */
async function sendToPrinter(order, options = {}) {
  const { printerAddress, connectionType } = options;

  // Generar comandos ESC/POS
  const escPosBuffer = formatToEscPos(order);

  console.log(`Sending to printer via ${connectionType}:`, {
    orderID: order.id,
    bufferLength: escPosBuffer.length,
    printerAddress
  });

  switch (connectionType) {
    case 'tcp':
      return await sendViaTCP(escPosBuffer, printerAddress);

    case 'bluetooth':
      return await sendViaBluetooth(escPosBuffer, printerAddress);

    case 'usb':
      return await sendViaUSB(escPosBuffer);

    default:
      throw new Error(`Unsupported connection type: ${connectionType}`);
  }
}

/**
 * Envío por TCP/IP (red)
 * Opción A - Backend: envía al endpoint /api/print
 */
async function sendViaTCP(buffer, printerIP) {
  try {
    // Opción 1: Enviar al backend para que maneje la conexión TCP
    const response = await fetch('/api/print', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        printerIP: printerIP || 'localhost',
        port: PRINT_CONFIG.printer.tcpPort,
        data: Array.from(buffer), // Convertir buffer a array para JSON
        orderID: order?.id
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('TCP print result:', result);
    return result;

  } catch (error) {
    // Fallback: mostrar instrucciones para prueba manual
    console.warn('Backend not available, providing manual testing instructions');

    // Para testing: descargar archivo .bin para usar con netcat
    downloadEscPosFile(buffer, `ticket-${Date.now()}.bin`);

    return {
      success: false,
      message: 'Backend no disponible. Archivo .bin descargado para prueba manual.',
      instructions: [
        '1. Instalar netcat: npm install -g netcat',
        `2. Ejecutar: nc -l ${PRINT_CONFIG.printer.tcpPort}`,
        '3. En otra terminal: cat ticket-*.bin | nc localhost 9100'
      ]
    };
  }
}

/**
 * Envío por Bluetooth
 * Opción B - Cliente: usar Web Bluetooth API (experimental)
 */
async function sendViaBluetooth(buffer, deviceMAC) {
  // Verificar soporte Web Bluetooth
  if (!navigator.bluetooth) {
    throw new Error('Web Bluetooth API not supported in this browser');
  }

  try {
    console.log('Requesting Bluetooth device...');

    // Solicitar dispositivo Bluetooth
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: [PRINT_CONFIG.printer.bluetoothServiceUUID] }
      ]
    });

    console.log('Connecting to GATT server...');
    const server = await device.gatt.connect();

    console.log('Getting service...');
    const service = await server.getPrimaryService(PRINT_CONFIG.printer.bluetoothServiceUUID);

    console.log('Getting characteristic...');
    const characteristics = await service.getCharacteristics();

    if (characteristics.length === 0) {
      throw new Error('No writable characteristics found');
    }

    const characteristic = characteristics[0];

    // Enviar datos en chunks (Bluetooth tiene límite de MTU)
    const chunkSize = 20; // bytes
    console.log(`Sending ${buffer.length} bytes in chunks of ${chunkSize}`);

    for (let i = 0; i < buffer.length; i += chunkSize) {
      const chunk = buffer.slice(i, i + chunkSize);
      await characteristic.writeValue(chunk);

      // Pequeña pausa entre chunks
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    console.log('Bluetooth print completed');
    await device.gatt.disconnect();

    return { success: true, method: 'bluetooth', deviceName: device.name };

  } catch (error) {
    console.error('Bluetooth print failed:', error);

    // Fallback para prueba
    downloadEscPosFile(buffer, `ticket-bluetooth-${Date.now()}.bin`);

    throw new Error(`Bluetooth printing failed: ${error.message}`);
  }
}

/**
 * Envío por USB (requiere extensión nativa o Electron)
 */
async function sendViaUSB(buffer) {
  // Web Serial API para conexión USB serial
  if ('serial' in navigator) {
    try {
      console.log('Requesting USB serial port...');

      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const writer = port.writable.getWriter();
      await writer.write(buffer);
      writer.releaseLock();

      await port.close();

      return { success: true, method: 'usb-serial' };

    } catch (error) {
      console.error('USB serial print failed:', error);
      throw new Error(`USB printing failed: ${error.message}`);
    }
  } else {
    // Para aplicaciones Electron, usar módulo nativo
    throw new Error('USB printing requires native application (Electron) or Web Serial API');
  }
}

/**
 * Función de utilidad para probar conectividad
 */
export async function testPrinterConnection(connectionType = 'tcp', address = 'localhost') {
  try {
    const testOrder = {
      id: 'TEST-' + Date.now(),
      table: 'Test',
      waiter: 'Sistema',
      time: new Date().toISOString(),
      items: [
        { qty: 1, name: 'Test de impresión', notes: 'Prueba del sistema' }
      ],
      total: 0,
      payment: 'Test'
    };

    return await sendToPrinter(testOrder, { printerAddress: address, connectionType });

  } catch (error) {
    console.error('Printer test failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Función para obtener lista de impresoras disponibles (donde sea posible)
 */
export async function getAvailablePrinters() {
  const printers = [];

  // Web Bluetooth (si está disponible)
  if (navigator.bluetooth) {
    try {
      printers.push({
        type: 'bluetooth',
        status: 'available',
        note: 'Requiere permisos de Bluetooth'
      });
    } catch (error) {
      printers.push({
        type: 'bluetooth',
        status: 'error',
        error: error.message
      });
    }
  }

  // Web Serial (USB)
  if ('serial' in navigator) {
    printers.push({
      type: 'usb',
      status: 'available',
      note: 'Requiere permisos de dispositivo serie'
    });
  }

  // TCP siempre disponible (vía backend)
  printers.push({
    type: 'tcp',
    status: 'available',
    note: 'Requiere backend y conexión de red'
  });

  return printers;
}

export default {
  printOrder,
  testPrinterConnection,
  getAvailablePrinters,
  PRINT_CONFIG
};