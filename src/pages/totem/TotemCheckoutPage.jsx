import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { ArrowLeft, User, Phone, CreditCard, Banknote, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartProvider';
import { usePublicData } from '@/context/PublicDataProvider';
import { useTotem } from '@/hooks/useTotem';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export const TotemCheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, clearCart, savePendingPaymentTotals } = useCart();
  const {
    sucursalSeleccionada,
    callPublicCreateOrder,
    callPublicCreatePrintJob,
    callPublicCreatePreference,
    publicDataCreatingOrderLoading: loading,
    productos,
  } = usePublicData();
  const { logEvent, sessionId } = useTotem();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    paymentMethod: 'cash', // 'cash' o 'mercadopago'
  });

  const [errors, setErrors] = useState({});

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Ingresá un teléfono válido (10 dígitos)';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Seleccioná un método de pago';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (items.length === 0) {
      alert('Tu carrito está vacío');
      navigate('/totem/menu');
      return;
    }

    if (!sucursalSeleccionada) {
      alert('No se ha seleccionado una sucursal');
      navigate('/totem');
      return;
    }

    try {
      // Preparar items para el backend
      const prodSkuMap = new Map(productos.map(p => [p.id, p.sku]));
      const newItems = [];

      items.forEach(item => {
        if (item.isCombo && Array.isArray(item.comboDetails)) {
          // Expandir combos
          item.comboDetails.forEach(detail => {
            newItems.push({
              productId: detail.productId,
              name: detail.name,
              quantity: detail.quantity,
              sku: detail.sku ?? '',
              hasRecipe: item.hasRecipe,
            });
          });
        } else {
          // Producto normal
          newItems.push({
            productId: item.id,
            name: item.name,
            unitPrice: item.price,
            quantity: item.quantity,
            sku: prodSkuMap.get(item.id) ?? '',
            hasRecipe: item.hasRecipe,
          });
        }
      });

      // Crear orden
      const newOrder = {
        storeId: sucursalSeleccionada,
        items: newItems,
        paymentMethod: formData.paymentMethod === 'cash' ? 'CASH' : 'MERCADO_PAGO',
        fulfillment: 'PICKUP', // Siempre retiro en local
        deliveryAddress: {
          contactName: formData.name.trim(),
          contactPhone: formData.phone.replace(/\s/g, ''),
        },
        totalAmount: total,
      };

      console.log('[TOTEM] Creating order:', newOrder);

      const createdOrder = await callPublicCreateOrder(newOrder);

      console.log('[TOTEM] Order created:', createdOrder);

      // Log del evento
      logEvent('order_created', {
        orderId: createdOrder.id,
        total,
        itemCount: items.length,
        paymentMethod: formData.paymentMethod,
      });

      // Crear print job
      const orderDetails = {
        id: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        proof: createdOrder.proof,
        deliveryShort: createdOrder.deliveryShort,
        items: createdOrder.items,
        status: createdOrder.status,
        paymentMethod: formData.paymentMethod === 'cash' ? 'CASH' : 'MERCADO_PAGO',
        total,
        contactName: formData.name.trim(),
        contactPhone: formData.phone.replace(/\s/g, ''),
      };

      const printJob = {
        dataB64: JSON.stringify(orderDetails),
        basic: btoa('admin:admin'), // Credenciales de impresión
        storeId: sucursalSeleccionada,
        orderId: createdOrder.id,
        status: formData.paymentMethod === 'mercadopago' ? 'PENDIENTE' : 'PARA_IMPRIMIR',
      };

      await callPublicCreatePrintJob(printJob);

      // Si es MercadoPago, crear preferencia y redirigir
      if (formData.paymentMethod === 'mercadopago') {
        const preference = await callPublicCreatePreference({
          orderId: createdOrder.id,
          proof: createdOrder.proof,
        });

        // Guardar totales antes de redirigir
        savePendingPaymentTotals(createdOrder.id);

        // Redirigir a MercadoPago
        window.location.href = preference.initPoint;
      } else {
        // Si es efectivo, limpiar carrito y navegar a success
        clearCart();
        navigate(`/totem/order-success/${createdOrder.id}`);
      }
    } catch (error) {
      console.error('[TOTEM] Error creating order:', error);
      alert('Hubo un error al crear tu pedido. Por favor intentá de nuevo.');
    }
  };

  const handleBack = () => {
    navigate('/totem/menu');
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] bg-empanada-dark flex flex-col">
      {/* Contenedor principal con scroll */}
      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto p-6 pb-32">
            {/* Header */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-white hover:text-empanada-golden mb-3 text-base"
                size="lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al menú
              </Button>

              <h1 className="text-3xl font-bold text-white mb-1">
                Completá tu pedido
              </h1>
              <p className="text-gray-400 text-base">
                Ingresá tus datos para finalizar
              </p>
            </div>

            {/* Layout de 2 columnas en tablets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Columna izquierda - Formulario */}
              <div className="space-y-4">
                {/* Datos del cliente */}
                <Card className="bg-empanada-medium border-empanada-light-gray">
                  <CardContent className="p-5 space-y-3">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-empanada-golden" />
                      Tus datos
                    </h2>

                    {/* Nombre */}
                    <div>
                      <label className="block text-white text-base font-semibold mb-1.5">
                        Nombre completo *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          setErrors({ ...errors, name: '' });
                        }}
                        placeholder="Ej: Juan Pérez"
                        className={cn(
                          "bg-empanada-dark text-white border-empanada-light-gray text-base h-12",
                          errors.name && "border-red-500"
                        )}
                      />
                      {errors.name && (
                        <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label className="block text-white text-base font-semibold mb-1.5">
                        Teléfono *
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-empanada-golden flex-shrink-0" />
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => {
                            // Solo permitir números
                            const value = e.target.value.replace(/\D/g, '');
                            setFormData({ ...formData, phone: value });
                            setErrors({ ...errors, phone: '' });
                          }}
                          placeholder="Ej: 2944123456"
                          maxLength={10}
                          className={cn(
                            "bg-empanada-dark text-white border-empanada-light-gray text-base h-12 flex-1",
                            errors.phone && "border-red-500"
                          )}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Método de pago */}
                <Card className="bg-empanada-medium border-empanada-light-gray">
                  <CardContent className="p-5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-3">
                      <CreditCard className="w-5 h-5 text-empanada-golden" />
                      Método de pago
                    </h2>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Efectivo */}
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setFormData({ ...formData, paymentMethod: 'cash' });
                          setErrors({ ...errors, paymentMethod: '' });
                        }}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all",
                          formData.paymentMethod === 'cash'
                            ? "bg-empanada-golden/20 border-empanada-golden"
                            : "bg-empanada-dark border-empanada-light-gray hover:border-empanada-golden/50"
                        )}
                      >
                        <Banknote className={cn(
                          "w-10 h-10 mx-auto mb-2",
                          formData.paymentMethod === 'cash' ? "text-empanada-golden" : "text-gray-400"
                        )} />
                        <p className={cn(
                          "font-bold text-base",
                          formData.paymentMethod === 'cash' ? "text-empanada-golden" : "text-gray-300"
                        )}>
                          Efectivo
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          Pagás al retirar
                        </p>
                      </motion.button>

                      {/* MercadoPago */}
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setFormData({ ...formData, paymentMethod: 'mercadopago' });
                          setErrors({ ...errors, paymentMethod: '' });
                        }}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all",
                          formData.paymentMethod === 'mercadopago'
                            ? "bg-empanada-golden/20 border-empanada-golden"
                            : "bg-empanada-dark border-empanada-light-gray hover:border-empanada-golden/50"
                        )}
                      >
                        <CreditCard className={cn(
                          "w-10 h-10 mx-auto mb-2",
                          formData.paymentMethod === 'mercadopago' ? "text-empanada-golden" : "text-gray-400"
                        )} />
                        <p className={cn(
                          "font-bold text-base",
                          formData.paymentMethod === 'mercadopago' ? "text-empanada-golden" : "text-gray-300"
                        )}>
                          MercadoPago
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          Tarjeta o QR
                        </p>
                      </motion.button>
                    </div>

                    {errors.paymentMethod && (
                      <p className="text-red-400 text-sm mt-2">{errors.paymentMethod}</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Columna derecha - Resumen del pedido */}
              <div className="space-y-4">
                <Card className="bg-empanada-medium border-empanada-light-gray">
                  <CardContent className="p-5">
                    <h2 className="text-xl font-bold text-white mb-3">
                      Resumen del pedido
                    </h2>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {items.map((item, index) => (
                        <div
                          key={item.isCombo ? item.id : `${item.id}-${index}`}
                          className="bg-empanada-dark rounded-lg p-3 border border-empanada-light-gray"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-white font-semibold text-sm">{item.name}</span>
                            <span className="text-empanada-golden font-bold text-sm">
                              x{item.quantity}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-white font-bold text-sm">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="mt-4 pt-4 border-t-2 border-empanada-golden">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-white">TOTAL</span>
                        <span className="text-3xl font-bold text-empanada-golden">
                          {formatPrice(total)}
                        </span>
                      </div>

                      <p className="text-center text-gray-400 text-xs mb-3">
                        * Retiro en el local seleccionado
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer fijo con botón confirmar */}
        <div className="bg-empanada-dark border-t-4 border-red-700 px-6 py-4 flex-shrink-0">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-empanada-golden text-empanada-dark hover:bg-empanada-golden/90 text-xl font-bold h-16 rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Check className="w-6 h-6 mr-2" />
                CONFIRMAR PEDIDO
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TotemCheckoutPage;
