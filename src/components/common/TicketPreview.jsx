/**
 * TICKET PREVIEW COMPONENT - NONINO EMPANADAS
 * Componente para mostrar preview del ticket y preparar para impresión
 * Soporta conversión a PDF y comandos ESC/POS
 */

import { useState, useRef } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Printer, Download, Eye } from 'lucide-react';
import { formatPrice, formatDateTime } from '../../lib/utils';
import { printOrder } from '../../services/printerSender';
import { toast } from 'sonner';

/**
 * Componente TicketPreview
 * @param {Object} order - Objeto orden con formato estándar
 * @param {boolean} showPreview - Si mostrar el preview visual
 * @param {string} mode - 'dev' para PDF, 'prod' para impresora real
 */
export function TicketPreview({ order, showPreview = true, mode = 'dev' }) {
  const [isLoading, setIsLoading] = useState(false);
  const ticketRef = useRef(null);

  // Datos predeterminados si no se proporciona logo
  const defaultLogo = order?.logo || null;
  const restaurantName = "NONINO EMPANADAS";
  const address = "Av. Corrientes 1234, CABA";
  const phone = "(011) 4123-4567";

  // Formatear fecha para el ticket
  const formatTicketDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Manejar impresión
  const handlePrint = async () => {
    if (!order) {
      toast.error('No hay orden para imprimir');
      return;
    }

    setIsLoading(true);
    try {
      await printOrder(order, { mode, elementRef: ticketRef });

      if (mode === 'dev') {
        toast.success('Preview PDF descargado correctamente');
      } else {
        toast.success('Ticket enviado a impresora');
      }
    } catch (error) {
      console.error('Error al imprimir:', error);
      toast.error('Error al procesar la impresión');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar preview en nueva pestaña
  const handlePreviewWindow = () => {
    const ticketContent = ticketRef.current?.innerHTML;
    if (!ticketContent) return;

    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preview Ticket - ${order.id}</title>
          <style>
            body { margin: 0; padding: 20px; font-family: monospace; }
            .ticket-container { width: 384px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            ${ticketContent}
          </div>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  if (!order) {
    return (
      <Card className="p-4">
        <p className="text-center text-gray-500">No hay orden seleccionada</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controles de impresión */}
      <div className="flex gap-2 justify-center">
        <Button
          onClick={handlePrint}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {mode === 'dev' ? <Download className="w-4 h-4" /> : <Printer className="w-4 h-4" />}
          {isLoading ? 'Procesando...' : mode === 'dev' ? 'Descargar PDF' : 'Imprimir'}
        </Button>

        <Button
          variant="outline"
          onClick={handlePreviewWindow}
          className="flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Vista Previa
        </Button>
      </div>

      {/* Preview del ticket */}
      {showPreview && (
        <Card className="mx-auto" style={{ width: '400px' }}>
          <div className="p-4">
            <div
              ref={ticketRef}
              className="ticket-content"
              style={{
                width: '400px',
                fontFamily: "'Courier New', monospace",
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#000',
                backgroundColor: '#fff',
                padding: '20px'
              }}
            >
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px' }}>
                  COMANDA DE COCINA
                </div>
                <div style={{ fontSize: '16px', marginTop: '8px' }}>
                  NONINO EMPANADAS
                </div>
                <div style={{ borderBottom: '2px solid #000', margin: '16px 0' }}></div>
              </div>

              {/* Número de Orden */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center', letterSpacing: '1px' }}>
                  ORDEN #{order.id}
                </div>
              </div>

              {/* Fecha y Hora */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '18px', textAlign: 'center', marginBottom: '4px' }}>
                  <strong>Fecha:</strong> {new Date(order.time || order.orderDate || new Date()).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>
                  <strong>Hora:</strong> {new Date(order.time || order.orderDate || new Date()).toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000', margin: '20px 0' }}></div>

              {/* Items de la orden */}
              <div style={{ marginBottom: '24px' }}>
                {order.items && order.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '20px',
                      padding: '12px 0',
                      borderTop: index > 0 ? '1px dashed #999' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
                      {item.qty || item.quantity || 1}x {(item.name || '').toUpperCase()}
                    </div>
                    {item.notes && (
                      <div style={{
                        fontSize: '18px',
                        marginLeft: '20px',
                        fontStyle: 'italic',
                        color: '#333',
                        marginTop: '8px'
                      }}>
                        Nota: {item.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '2px solid #000', margin: '20px 0' }}></div>

              {/* Notas especiales generales */}
              {order.notes && (
                <div style={{
                  marginBottom: '24px',
                  padding: '12px',
                  backgroundColor: '#f9f9f9',
                  border: '2px solid #000'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                    ⚠️ NOTAS ESPECIALES:
                  </div>
                  <div style={{ fontSize: '18px' }}>
                    {order.notes}
                  </div>
                </div>
              )}

              {/* Espacio para corte */}
              <div style={{ height: '40px' }}></div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default TicketPreview;