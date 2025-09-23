# Sistema de Impresión Térmica - Nonino Empanadas

## Descripción General

Sistema integrado para convertir comandas en comandos de impresora térmica (ESC/POS) y enviarlas a impresoras térmicas portátiles modelo P58C (papel 57-58 mm, ancho útil ~48 mm).

## Características

### Funcionalidades Principales
- ✅ **Vista HTML del ticket** para PDF preview
- ✅ **Conversión a comandos ESC/POS** optimizados para P58C
- ✅ **Modo desarrollo**: Genera y descarga PDF que muestra exactamente cómo quedaría el ticket
- ✅ **Modo producción**: Envía bytes al puerto de la impresora (Bluetooth/TCP/USB)
- ✅ **Soporte para logos** en cabecera (base64 o URL)
- ✅ **Formato completo**: items, cantidades, agregados, totales, forma de pago
- ✅ **Estilo térmico**: texto en negrita, centrado, cortes de línea y feed final

### Componentes Implementados

```
src/
├── components/common/
│   └── TicketPreview.jsx       # Componente React para preview y conversión
├── services/
│   ├── printFormatter.js       # Conversión order → ESC/POS
│   └── printerSender.js        # Abstracción dev/prod para envío
└── pages/admin/
    └── OrderManagement.jsx     # Integración en gestión de pedidos
```

## Guía de Uso

### 1. Integración en Componentes

```jsx
import { TicketPreview } from '@/components/common/TicketPreview';

// En tu componente
<TicketPreview
  order={orderObject}
  showPreview={true}
  mode="dev" // 'dev' para PDF, 'prod' para impresora real
/>
```

### 2. Formato de Orden Esperado

```javascript
const order = {
  "id": "ORD-20250923-001",
  "table": "Mesa 7",
  "waiter": "Juan",
  "time": "2025-09-23T13:20:00-03:00",
  "items": [
    {"qty": 2, "name": "Empanada de carne", "notes": "sin cebolla"},
    {"qty": 1, "name": "Milanesa con papas", "notes": "termino medio"},
    {"qty": 3, "name": "Coca Cola 500ml", "notes": ""}
  ],
  "subtotal": 4500,
  "tax": 405,
  "total": 4905,
  "payment": "Efectivo",
  "logo": "data:image/png;base64,<...opcional...>"
}
```

### 3. Uso Programático

```javascript
import { printOrder } from '@/services/printerSender';
import { formatToEscPos } from '@/services/printFormatter';

// Imprimir orden completa
await printOrder(order, {
  mode: 'dev',        // 'dev' | 'prod'
  elementRef: ticketRef,
  connectionType: 'tcp' // 'tcp' | 'bluetooth' | 'usb'
});

// Solo generar comandos ESC/POS
const escPosBuffer = formatToEscPos(order);
```

## Configuración para Desarrollo

### Requisitos
- Node.js 18+
- React 18+
- Dependencias: `html2canvas`, `jsPDF` (ya incluidas)

### Variables de Entorno

```env
# .env.development
NODE_ENV=development

# .env.production
NODE_ENV=production
PRINTER_DEFAULT_IP=192.168.1.100
PRINTER_TCP_PORT=9100
```

## Testing Manual

### Test 1: Preview PDF (Desarrollo)

1. **Ejecutar la aplicación en modo desarrollo**
   ```bash
   npm run dev
   ```

2. **Navegar a Gestión de Pedidos**
   - Ir a `/intranet/admin/pedidos`
   - Seleccionar cualquier pedido
   - Hacer clic en el ícono "Ver detalles" (👁️)

3. **Generar Preview PDF**
   - En el panel derecho, hacer clic en "Descargar PDF"
   - Se descargará automáticamente `ticket-{orderID}.pdf`

4. **Verificar el PDF**
   - Abrir el archivo descargado
   - Verificar que coincide exactamente con el preview HTML
   - Confirmar ancho de ~80mm (formato térmico)

### Test 2: Comandos ESC/POS (Emulación)

1. **Generar archivo .bin**
   ```javascript
   // En consola del navegador
   import('./src/services/printFormatter.js').then(module => {
     const buffer = module.generateTestPrint();
     module.downloadEscPosFile(buffer, 'test-ticket.bin');
   });
   ```

2. **Probar con netcat**
   ```bash
   # Terminal 1: Crear servidor de prueba
   nc -l 9100

   # Terminal 2: Enviar comandos
   cat test-ticket.bin | nc localhost 9100
   ```

3. **Usar emulador ZplEscPrinter**
   - Clonar: `git clone https://github.com/erikn69/ZplEscPrinter`
   - Abrir `test-ticket.bin` en el emulador
   - Verificar renderizado correcto

### Test 3: Conexión de Red (Producción)

1. **Configurar backend endpoint** (opcional)
   ```javascript
   // api/print.js
   app.post('/api/print', (req, res) => {
     const { printerIP, port, data } = req.body;
     // Implementar conexión TCP a impresora
   });
   ```

2. **Probar conexión TCP**
   ```javascript
   import { testPrinterConnection } from '@/services/printerSender';

   testPrinterConnection('tcp', '192.168.1.100')
     .then(result => console.log('Test result:', result));
   ```

### Test 4: Bluetooth (Experimental)

1. **Verificar soporte del navegador**
   ```javascript
   console.log('Bluetooth disponible:', !!navigator.bluetooth);
   ```

2. **Probar conexión Bluetooth**
   - Modo producción: `mode: 'prod'`, `connectionType: 'bluetooth'`
   - El navegador solicitará permisos
   - Seleccionar impresora P58C de la lista

## Opciones de Conexión en Producción

### Opción A: Backend (Recomendado)
- **Ventajas**: Estable, sin limitaciones del navegador
- **Configuración**: Endpoint `/api/print` que maneje conexión TCP/USB
- **Compatibilidad**: Todas las impresoras de red

### Opción B: Web APIs (Cliente)
- **Web Bluetooth**: Para impresoras Bluetooth compatibles
- **Web Serial**: Para impresoras USB serie
- **Limitaciones**: Requiere permisos, soporte limitado del navegador

## Configuración de la Impresora P58C

### Especificaciones Técnicas
- **Papel**: 57.5mm (2.25")
- **Ancho de impresión**: ~48mm útil
- **Resolución**: 203 DPI
- **Protocolo**: ESC/POS compatible
- **Conectividad**: Bluetooth, USB, Serie

### Configuración Recomendada
1. **Velocidad de transmisión**: 9600 baud (USB/Serie)
2. **Bluetooth**: SPP (Serial Port Profile)
3. **Red**: IP estática, puerto 9100
4. **Corte automático**: Habilitado si está disponible

## Troubleshooting

### Problemas Comunes

**PDF no se genera**
- Verificar que `elementRef` tiene contenido
- Comprobar permisos de descarga del navegador

**Comandos ESC/POS incorrectos**
- Usar `bufferToHex()` para inspeccionar bytes
- Verificar compatibilidad con P58C

**Conexión Bluetooth falla**
- Verificar soporte del navegador: `chrome://flags/#enable-web-bluetooth`
- Emparejar impresora en configuración del sistema

**Impresora no responde (TCP)**
- Verificar IP y puerto (9100)
- Comprobar firewall y red
- Probar con telnet: `telnet [IP] 9100`

### Logs de Debug

```javascript
// Habilitar logs detallados
localStorage.setItem('DEBUG_PRINTING', 'true');

// Ver comandos ESC/POS generados
import { bufferToHex } from '@/services/printFormatter';
console.log('ESC/POS hex:', bufferToHex(buffer));
```

## Roadmap

### Mejoras Futuras
- [ ] Soporte para imágenes (conversión a bitmap ESC/POS)
- [ ] Configuración de fuentes y tamaños
- [ ] Templates de ticket personalizables
- [ ] Dashboard de estado de impresoras
- [ ] Cola de impresión con reintentos
- [ ] Soporte para códigos QR/códigos de barras

### Integraciones Pendientes
- [ ] Sistema de inventario
- [ ] Gestión de mesas
- [ ] Punto de venta (POS)
- [ ] Reportes automáticos

## Licencias

- **html2canvas**: MIT License
- **jsPDF**: MIT License
- **Proyecto**: Uso interno Nonino Empanadas

---

**Desarrollado para**: Sistema POS Nonino Empanadas
**Versión**: 1.0.0
**Fecha**: Septiembre 2025