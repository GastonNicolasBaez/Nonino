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
                width: '384px', // 48mm a 203 DPI ≈ 384px
                fontFamily: 'monospace',
                fontSize: '12px',
                lineHeight: '1.4',
                color: '#000',
                backgroundColor: '#fff'
              }}
            >
              {/* Header con logo */}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                {defaultLogo && (
                  <div style={{ marginBottom: '8px' }}>
                    <img
                      src={defaultLogo}
                      alt="Logo"
                      style={{
                        maxWidth: '120px',
                        height: 'auto',
                        margin: '0 auto',
                        display: 'block'
                      }}
                    />
                  </div>
                )}

                <div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '4px'
                }}>
                  {restaurantName}
                </div>

                <div style={{ fontSize: '10px', marginBottom: '2px' }}>
                  {address}
                </div>
                <div style={{ fontSize: '10px', marginBottom: '8px' }}>
                  Tel: {phone}
                </div>
              </div>

              {/* Información del pedido */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px'
                }}>
                  <span>Mesa: {order.table || 'N/A'}</span>
                  <span>Mozo: {order.waiter || 'N/A'}</span>
                </div>
                <div style={{ fontSize: '11px', marginBottom: '8px' }}>
                  {formatTicketDate(order.time || order.orderDate || new Date())}
                </div>
                <div style={{
                  borderTop: '1px dashed #000',
                  borderBottom: '1px dashed #000',
                  padding: '4px 0',
                  fontSize: '11px'
                }}>
                  Pedido: {order.id}
                </div>
              </div>

              {/* Items */}
              <div style={{ marginBottom: '16px' }}>
                {order.items && order.items.map((item, index) => (
                  <div key={index} style={{ marginBottom: '8px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div>
                          <span style={{ fontWeight: 'bold' }}>
                            {item.qty || item.quantity || 1}
                          </span>
                          {' '}
                          <span>{item.name}</span>
                        </div>
                        {item.notes && (
                          <div style={{
                            fontSize: '10px',
                            fontStyle: 'italic',
                            marginLeft: '16px',
                            color: '#666'
                          }}>
                            - {item.notes}
                          </div>
                        )}
                      </div>
                      <div style={{
                        minWidth: '60px',
                        textAlign: 'right',
                        fontSize: '11px'
                      }}>
                        {item.price && formatPrice(item.price * (item.qty || item.quantity || 1))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Separador */}
              <div style={{
                borderTop: '1px dashed #000',
                margin: '16px 0'
              }}></div>

              {/* Totales */}
              <div style={{ marginBottom: '16px' }}>
                {order.subtotal && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <span>Subtotal:</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                )}

                {order.tax && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <span>IVA:</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  borderTop: '1px solid #000',
                  paddingTop: '4px'
                }}>
                  <span>TOTAL:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Forma de pago */}
              <div style={{
                textAlign: 'center',
                marginBottom: '16px',
                fontSize: '11px'
              }}>
                <div>Forma de pago: {order.payment || order.paymentMethod || 'Efectivo'}</div>
              </div>

              {/* Footer */}
              <div style={{
                borderTop: '1px dashed #000',
                paddingTop: '8px',
                textAlign: 'center',
                fontSize: '11px'
              }}>
                <div style={{ marginBottom: '4px' }}>
                  ¡Gracias por su compra!
                </div>
                <div style={{ fontSize: '10px' }}>
                  www.noninoempanadas.com
                </div>
              </div>

              {/* Espacio para corte */}
              <div style={{ height: '24px' }}></div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default TicketPreview;