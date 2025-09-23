/**
 * PRINT FORMATTER SERVICE - NONINO EMPANADAS
 * Convierte órdenes a comandos ESC/POS siguiendo la semántica de ZplEscPrinter
 * Soporta impresoras térmicas P58C (57-58mm, ~48mm útil, 203 DPI)
 */

// Comandos ESC/POS estándar
const ESC = '\x1B';
const GS = '\x1D';
const LF = '\x0A';  // Line Feed
const CR = '\x0D';  // Carriage Return

/**
 * Clase EscPosFormatter - Inspirada en ZplEscPrinter
 * Genera comandos ESC/POS para impresoras térmicas
 */
class EscPosFormatter {
  constructor() {
    this.commands = '';
    this.init();
  }

  // Inicializar impresora
  init() {
    this.commands += ESC + '@'; // ESC @ - Initialize printer
    return this;
  }

  // Configurar alineación
  align(alignment = 'left') {
    const alignments = {
      'left': '\x00',
      'center': '\x01',
      'right': '\x02'
    };
    this.commands += ESC + 'a' + (alignments[alignment] || alignments.left);
    return this;
  }

  // Configurar estilo de texto
  textStyle(options = {}) {
    const {
      bold = false,
      underline = false,
      size = 'normal'
    } = options;

    // ESC ! n - Configurar estilo de caracteres
    let styleCode = 0;

    if (bold) styleCode |= 8;    // Bit 3: Bold
    if (size === 'large') styleCode |= 48;  // Bits 4-5: Double height & width
    if (size === 'wide') styleCode |= 32;   // Bit 5: Double width
    if (size === 'tall') styleCode |= 16;   // Bit 4: Double height

    this.commands += ESC + '!' + String.fromCharCode(styleCode);

    // ESC - n - Underline
    if (underline) {
      this.commands += ESC + '-' + '\x01';
    }

    return this;
  }

  // Restablecer estilo
  resetStyle() {
    this.commands += ESC + '!' + '\x00'; // Normal style
    this.commands += ESC + '-' + '\x00'; // No underline
    return this;
  }

  // Añadir texto
  text(content) {
    this.commands += content;
    return this;
  }

  // Nueva línea
  newLine(count = 1) {
    for (let i = 0; i < count; i++) {
      this.commands += LF;
    }
    return this;
  }

  // Separador con guiones
  separator(char = '-', length = 32) {
    this.commands += char.repeat(length) + LF;
    return this;
  }

  // Línea divisoria punteada
  dashedLine(length = 32) {
    this.separator('-', length);
    return this;
  }

  // Línea con texto centrado y padding
  centeredText(text, totalWidth = 32, padChar = ' ') {
    const padding = Math.max(0, totalWidth - text.length);
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;

    this.commands += padChar.repeat(leftPad) + text + padChar.repeat(rightPad) + LF;
    return this;
  }

  // Texto justificado (izquierda-derecha)
  justifiedText(leftText, rightText, totalWidth = 32, fillChar = ' ') {
    const contentLength = leftText.length + rightText.length;
    const spacesNeeded = Math.max(1, totalWidth - contentLength);

    this.commands += leftText + fillChar.repeat(spacesNeeded) + rightText + LF;
    return this;
  }

  // Añadir imagen (base64)
  image(base64Data) {
    // Para implementación futura - requiere conversión a bitmap ESC/POS
    // Por ahora, simplemente omite la imagen
    console.warn('Image printing not implemented yet');
    return this;
  }

  // Corte de papel (si la impresora lo soporta)
  cut(type = 'full') {
    if (type === 'partial') {
      this.commands += GS + 'V' + '\x01'; // GS V 1 - Partial cut
    } else {
      this.commands += GS + 'V' + '\x00'; // GS V 0 - Full cut
    }
    return this;
  }

  // Pulso para abrir cajón (si está conectado)
  pulse() {
    this.commands += ESC + 'p' + '\x00' + '\x50' + '\xFA'; // ESC p 0 80 250
    return this;
  }

  // Feed de papel
  feed(lines = 3) {
    this.newLine(lines);
    return this;
  }

  // Obtener comandos como buffer
  getBuffer() {
    return new TextEncoder().encode(this.commands);
  }

  // Obtener comandos como string
  getCommands() {
    return this.commands;
  }

  // Limpiar comandos
  clear() {
    this.commands = '';
    this.init();
    return this;
  }
}

/**
 * Función principal para convertir order a ESC/POS
 * Formato básico para comanda de cocina
 */
export function formatToEscPos(order) {
  const formatter = new EscPosFormatter();

  try {
    // Header
    formatter
      .align('center')
      .textStyle({ bold: true })
      .text('COMANDA DE COCINA')
      .newLine()
      .resetStyle()
      .text('NONINO EMPANADAS')
      .newLine()
      .separator('-', 32)
      .newLine();

    // Información del pedido
    formatter
      .align('center')
      .textStyle({ bold: true })
      .text(`PEDIDO: ${order.id}`)
      .newLine()
      .resetStyle();

    const orderTime = new Date(order.time || order.orderDate || Date.now());
    formatter
      .text(`${orderTime.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`)
      .newLine();

    // Indicador de delivery
    if (order.deliveryType === 'delivery') {
      formatter
        .textStyle({ bold: true })
        .text('*** DELIVERY ***')
        .resetStyle()
        .newLine();
    }

    formatter
      .separator('-', 32)
      .newLine();

    // Items
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item) => {
        const qty = item.qty || item.quantity || 1;

        formatter
          .align('left')
          .textStyle({ bold: true })
          .text(`${qty}x ${item.name}`)
          .resetStyle()
          .newLine();

        // Notas del item
        if (item.notes && item.notes.trim()) {
          formatter
            .text(`   - ${item.notes}`)
            .newLine();
        }

        formatter.newLine();
      });
    }

    formatter
      .separator('-', 32)
      .newLine();

    // Total
    const totalItems = order.items ? order.items.reduce((total, item) => total + (item.qty || item.quantity || 1), 0) : 0;

    formatter
      .align('center')
      .textStyle({ bold: true })
      .text(`TOTAL: ${totalItems} items`)
      .resetStyle()
      .newLine(2);

    // Notas especiales del pedido
    if (order.notes && order.notes.trim()) {
      formatter
        .align('left')
        .textStyle({ bold: true })
        .text('Notas:')
        .resetStyle()
        .newLine()
        .text(order.notes)
        .newLine(2);
    }

    // Control
    formatter
      .separator('-', 32)
      .newLine()
      .text('PREPARADO: _____________')
      .newLine()
      .text('REVISADO:  _____________')
      .newLine()
      .text('ENTREGADO: _____________')
      .newLine(2);

    // Feed final y corte
    formatter
      .feed(3)
      .cut('full');

    return formatter.getBuffer();

  } catch (error) {
    console.error('Error formatting order to ESC/POS:', error);
    throw new Error('Failed to format order for thermal printing');
  }
}

/**
 * Función helper para generar comandos ESC/POS de prueba
 */
export function generateTestPrint() {
  const testOrder = {
    id: "TEST-001",
    table: "Mesa 7",
    waiter: "Juan",
    time: new Date().toISOString(),
    deliveryType: "pickup", // "delivery" o "pickup"
    items: [
      { qty: 2, name: "Empanada de carne", notes: "sin cebolla" },
      { qty: 1, name: "Milanesa con papas", notes: "termino medio" },
      { qty: 3, name: "Coca Cola 500ml", notes: "" }
    ],
    notes: "Cliente regular - servir rápido",
    total: 4905
  };

  return formatToEscPos(testOrder);
}

/**
 * Función para convertir buffer a hex string (útil para debugging)
 */
export function bufferToHex(buffer) {
  return Array.from(buffer)
    .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
}

/**
 * Función para guardar comandos ESC/POS como archivo .bin
 */
export function downloadEscPosFile(buffer, filename = 'ticket.bin') {
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

export default { formatToEscPos, generateTestPrint, bufferToHex, downloadEscPosFile };