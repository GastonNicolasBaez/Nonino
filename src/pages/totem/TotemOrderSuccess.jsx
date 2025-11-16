import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router';
import { CheckCircle2, Clock, Package, ArrowRight, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTotem } from '@/hooks/useTotem';
import { usePublicData } from '@/context/PublicDataProvider';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const TotemOrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { resetSession, logEvent, config } = useTotem();
  const { callPublicOrderById, callPublicOrderByIdLoading } = usePublicData();

  const [countdown, setCountdown] = useState(30);
  const [orderData, setOrderData] = useState(null);

  // Cargar datos de la orden
  useEffect(() => {
    const loadOrder = async () => {
      if (orderId) {
        try {
          const order = await callPublicOrderById(orderId);
          setOrderData(order);

          logEvent('order_success_viewed', {
            orderId,
            orderNumber: order.orderNumber,
          });
        } catch (error) {
          console.error('[TOTEM] Error loading order:', error);
        }
      }
    };

    loadOrder();
  }, [orderId]);

  // Countdown automático
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleNewOrder();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNewOrder = () => {
    logEvent('new_order_started_from_success');
    resetSession();
  };

  if (callPublicOrderByIdLoading || !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-empanada-dark">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-empanada-dark flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        {/* Ícono de éxito */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-green-500/20 rounded-full p-8 border-4 border-green-500">
            <CheckCircle2 className="w-24 h-24 text-green-500" />
          </div>
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold text-white text-center mb-4"
        >
          ¡Pedido confirmado!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl text-gray-300 text-center mb-8"
        >
          Tu pedido fue recibido correctamente
        </motion.p>

        {/* Número de pedido destacado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-empanada-golden/20 border-4 border-empanada-golden rounded-3xl p-12 mb-8"
        >
          <p className="text-gray-300 text-2xl text-center mb-4">
            Número de pedido:
          </p>
          <p className="text-empanada-golden text-8xl font-bold text-center tracking-wider">
            #{orderData.orderNumber || orderId}
          </p>
        </motion.div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-6 mb-8"
        >
          {/* Tiempo estimado */}
          <div className="bg-empanada-medium rounded-2xl p-6 border border-empanada-light-gray">
            <div className="flex items-center gap-4 mb-3">
              <Clock className="w-8 h-8 text-empanada-golden" />
              <h3 className="text-xl font-bold text-white">Tiempo estimado</h3>
            </div>
            <p className="text-3xl font-bold text-empanada-golden">
              {orderData.estimatedTime || '20-30'} min
            </p>
          </div>

          {/* Retiro */}
          <div className="bg-empanada-medium rounded-2xl p-6 border border-empanada-light-gray">
            <div className="flex items-center gap-4 mb-3">
              <Package className="w-8 h-8 text-empanada-golden" />
              <h3 className="text-xl font-bold text-white">Retiro</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              En el mostrador
            </p>
          </div>
        </motion.div>

        {/* Instrucciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-empanada-medium rounded-2xl p-8 border border-empanada-light-gray mb-8"
        >
          <div className="flex items-start gap-4 mb-4">
            <Printer className="w-8 h-8 text-empanada-golden flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Importante:
              </h3>
              <p className="text-gray-300 text-xl leading-relaxed">
                Presentá tu <span className="text-empanada-golden font-bold">número de pedido #{orderData.orderNumber || orderId}</span> en
                el mostrador para retirar tu pedido cuando esté listo.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Botón nuevo pedido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={handleNewOrder}
            className="bg-empanada-golden text-empanada-dark hover:bg-empanada-golden/90 text-2xl font-bold px-12 py-8 rounded-2xl mb-4"
          >
            HACER OTRO PEDIDO
            <ArrowRight className="w-7 h-7 ml-3" />
          </Button>

          <div className="bg-empanada-dark/50 rounded-xl p-4 inline-block">
            <p className="text-gray-400 text-lg">
              Esta pantalla se cerrará automáticamente en{' '}
              <span className="text-empanada-golden font-bold text-2xl">
                {countdown}
              </span>{' '}
              segundos
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TotemOrderSuccess;
