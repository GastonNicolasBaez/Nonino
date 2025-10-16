/**
 * PRINTER TEST COMPONENT - NONINO EMPANADAS
 * Componente para probar el sistema de impresión térmica
 * Solo para desarrollo y testing
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Printer,
  Download,
  TestTube,
  Bluetooth,
  Wifi,
  Usb,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { TicketPreview } from './TicketPreview';
import { printOrder, testPrinterConnection, getAvailablePrinters } from '../../services/printerSender';
import { formatToEscPos, generateTestPrint, downloadEscPosFile, bufferToHex } from '../../services/printFormatter';

// Orden de muestra para testing
const SAMPLE_ORDER = {
  id: "TEST-" + Date.now().toString().slice(-6),
  table: "Mesa Test",
  waiter: "Sistema QA",
  time: new Date().toISOString(),
  items: [
    { qty: 2, name: "Empanada de carne", notes: "sin cebolla" },
    { qty: 1, name: "Milanesa con papas", notes: "termino medio" },
    { qty: 3, name: "Coca Cola 500ml", notes: "" }
  ],
  subtotal: 4500,
  tax: 405,
  total: 4905,
  payment: "Efectivo",
  logo: null // Se puede agregar base64 aquí
};

export function PrinterTestComponent() {
  const [testOrder, setTestOrder] = useState(SAMPLE_ORDER);
  const [printerIP, setPrinterIP] = useState('localhost');
  const [connectionType, setConnectionType] = useState('tcp');
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availablePrinters, setAvailablePrinters] = useState([]);

  // Actualizar orden de prueba
  const handleUpdateOrder = (field, value) => {
    setTestOrder(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Ejecutar test específico
  const runTest = async (testName, testFunction) => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;

      setTestResults(prev => [...prev, {
        id: Date.now(),
        name: testName,
        status: 'success',
        duration,
        result,
        timestamp: new Date().toLocaleTimeString()
      }]);

    } catch (error) {
      const duration = Date.now() - startTime;

      setTestResults(prev => [...prev, {
        id: Date.now(),
        name: testName,
        status: 'error',
        duration,
        error: error.message,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Tests disponibles
  const tests = [
    {
      name: 'Generar PDF Preview',
      icon: <Download className="w-4 h-4" />,
      description: 'Genera y descarga PDF del ticket',
      action: () => runTest('PDF Preview', async () => {
        return await printOrder(testOrder, { mode: 'dev' });
      })
    },
    {
      name: 'Generar Comandos ESC/POS',
      icon: <TestTube className="w-4 h-4" />,
      description: 'Genera archivo .bin con comandos térmicos',
      action: () => runTest('ESC/POS Generation', async () => {
        const buffer = formatToEscPos(testOrder);
        downloadEscPosFile(buffer, `test-${testOrder.id}.bin`);
        return {
          bufferSize: buffer.length,
          hexPreview: bufferToHex(buffer).slice(0, 100) + '...'
        };
      })
    },
    {
      name: 'Test Conexión TCP',
      icon: <Wifi className="w-4 h-4" />,
      description: 'Prueba conexión a impresora por red',
      action: () => runTest('TCP Connection', async () => {
        return await testPrinterConnection('tcp', printerIP);
      })
    },
    {
      name: 'Test Conexión Bluetooth',
      icon: <Bluetooth className="w-4 h-4" />,
      description: 'Prueba conexión Bluetooth (requiere permisos)',
      action: () => runTest('Bluetooth Connection', async () => {
        return await testPrinterConnection('bluetooth');
      })
    },
    {
      name: 'Listar Impresoras',
      icon: <RefreshCw className="w-4 h-4" />,
      description: 'Detecta impresoras disponibles',
      action: () => runTest('Printer Discovery', async () => {
        const printers = await getAvailablePrinters();
        setAvailablePrinters(printers);
        return printers;
      })
    }
  ];

  // Limpiar resultados
  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Pruebas del Sistema de Impresión Térmica
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Herramientas para probar y validar el sistema de impresión para impresoras P58C
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de configuración */}
        <div className="space-y-6">
          {/* Configuración de conexión */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuración de Impresora</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Conexión</label>
                <select
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="tcp">TCP/IP (Red)</option>
                  <option value="bluetooth">Bluetooth</option>
                  <option value="usb">USB Serial</option>
                </select>
              </div>

              {connectionType === 'tcp' && (
                <div>
                  <label className="block text-sm font-medium mb-2">IP de la Impresora</label>
                  <Input
                    value={printerIP}
                    onChange={(e) => setPrinterIP(e.target.value)}
                    placeholder="192.168.1.100 o localhost"
                  />
                </div>
              )}

              {availablePrinters.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Impresoras Detectadas</label>
                  <div className="space-y-2">
                    {availablePrinters.map((printer, index) => (
                      <div key={index} className="p-2 border rounded flex items-center justify-between">
                        <span className="text-sm">{printer.type}</span>
                        <Badge variant={printer.status === 'available' ? 'success' : 'destructive'}>
                          {printer.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuración de orden de prueba */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Orden de Prueba</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ID de Orden</label>
                  <Input
                    value={testOrder.id}
                    onChange={(e) => handleUpdateOrder('id', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mesa</label>
                  <Input
                    value={testOrder.table}
                    onChange={(e) => handleUpdateOrder('table', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mozo</label>
                  <Input
                    value={testOrder.waiter}
                    onChange={(e) => handleUpdateOrder('waiter', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Total</label>
                  <Input
                    type="number"
                    value={testOrder.total}
                    onChange={(e) => handleUpdateOrder('total', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Items (JSON)</label>
                <Textarea
                  value={JSON.stringify(testOrder.items, null, 2)}
                  onChange={(e) => {
                    try {
                      const items = JSON.parse(e.target.value);
                      handleUpdateOrder('items', items);
                    } catch (error) {
                      // Ignorar errores de parsing durante edición
                    }
                  }}
                  rows={6}
                  className="font-mono text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tests disponibles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tests Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tests.map((test, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {test.icon}
                        <span className="font-medium">{test.name}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={test.action}
                        disabled={isLoading}
                      >
                        Ejecutar
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">{test.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={clearResults}
                  className="w-full"
                >
                  Limpiar Resultados
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de preview y resultados */}
        <div className="space-y-6">
          {/* Preview del ticket */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview del Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketPreview
                order={testOrder}
                showPreview={true}
                mode="dev"
              />
            </CardContent>
          </Card>

          {/* Resultados de tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Resultados de Pruebas</span>
                <Badge variant="outline">{testResults.length} tests</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay resultados de pruebas aún
                </p>
              ) : (
                <div className="space-y-3">
                  {testResults.slice(-10).reverse().map((result) => (
                    <div
                      key={result.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        result.status === 'success'
                          ? 'border-green-500 bg-green-50 dark:bg-green-950'
                          : 'border-red-500 bg-red-50 dark:bg-red-950'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {result.status === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="font-medium text-sm">{result.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{result.timestamp}</span>
                          <span>{result.duration}ms</span>
                        </div>
                      </div>

                      {result.status === 'success' && result.result && (
                        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 overflow-x-auto">
                          {JSON.stringify(result.result, null, 2)}
                        </pre>
                      )}

                      {result.status === 'error' && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {result.error}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PrinterTestComponent;