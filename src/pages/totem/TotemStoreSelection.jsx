import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { MapPin, Clock, CheckCircle2, XCircle, Package, Truck } from 'lucide-react';
import { usePublicData } from '@/context/PublicDataProvider';
import { useTotem } from '@/hooks/useTotem';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { cn } from '@/lib/utils';

export const TotemStoreSelection = () => {
  const navigate = useNavigate();
  const { sucursales, publicDataLoading, setSucursalSeleccionada } = usePublicData();
  const { updateStore, config, configLoading, enterKioskMode } = useTotem();

  // Si hay un store configurado y no se permite selección, auto-navegar
  useEffect(() => {
    if (config && !configLoading && config.storeId && !config.allowStoreSelection) {
      handleStoreSelect(config.storeId);
    }
  }, [config, configLoading]);

  // Activar modo kiosko al montar
  useEffect(() => {
    if (config?.kioskMode) {
      enterKioskMode();
    }
  }, [config, enterKioskMode]);

  const handleStoreSelect = (storeId) => {
    setSucursalSeleccionada(storeId);
    updateStore(storeId);
    navigate('/totem/menu');
  };

  if (publicDataLoading || configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-empanada-dark">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-empanada-dark px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-empanada-golden mb-4">
            ¡Bienvenido a Nonino!
          </h1>
          <p className="text-2xl text-gray-300">
            Seleccioná tu local para comenzar tu pedido
          </p>
        </motion.div>

        {/* Grid de locales */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {sucursales.map((store, index) => {
            const isOpen = store.statusData?.status === 'ABIERTO';
            const supportsDelivery = store.deliversOrders;
            const supportsPickup = store.servesWalkIn;

            return (
              <motion.button
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: isOpen ? 1.02 : 1 }}
                whileTap={{ scale: isOpen ? 0.98 : 1 }}
                onClick={() => isOpen && handleStoreSelect(store.id)}
                disabled={!isOpen}
                className={cn(
                  "relative p-8 rounded-2xl border-2 transition-all duration-300 text-left",
                  "min-h-[280px] flex flex-col justify-between",
                  isOpen
                    ? "bg-empanada-dark border-empanada-golden hover:bg-empanada-golden/10 hover:shadow-2xl hover:shadow-empanada-golden/20"
                    : "bg-empanada-medium border-gray-600 opacity-60 cursor-not-allowed"
                )}
              >
                {/* Badge de estado */}
                <div className="absolute top-4 right-4">
                  {isOpen ? (
                    <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold text-sm">ABIERTO</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full border border-red-500/30">
                      <XCircle className="w-5 h-5" />
                      <span className="font-semibold text-sm">CERRADO</span>
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {store.name}
                  </h3>

                  <div className="flex items-start gap-2 text-gray-300 mb-4">
                    <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-empanada-golden" />
                    <p className="text-lg">
                      {store.shortAddress || `${store.street} ${store.number}, ${store.barrio}`}
                    </p>
                  </div>

                  {/* Servicios disponibles */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    {supportsPickup && (
                      <div className="flex items-center gap-2 bg-empanada-golden/20 text-empanada-golden px-3 py-1.5 rounded-lg text-sm">
                        <Package className="w-4 h-4" />
                        <span>Retiro en local</span>
                      </div>
                    )}
                    {supportsDelivery && (
                      <div className="flex items-center gap-2 bg-empanada-golden/20 text-empanada-golden px-3 py-1.5 rounded-lg text-sm">
                        <Truck className="w-4 h-4" />
                        <span>Delivery</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer con tiempo de preparación */}
                {isOpen && store.baseDelay > 0 && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-4 pt-4 border-t border-gray-700">
                    <Clock className="w-4 h-4" />
                    <span>Tiempo de preparación: {store.baseDelay} min</span>
                  </div>
                )}

                {/* Indicador visual de selección */}
                {isOpen && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-empanada-golden/0 via-empanada-golden/5 to-empanada-golden/0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Mensaje si no hay locales */}
        {sucursales.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-gray-400">
              No hay locales disponibles en este momento
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TotemStoreSelection;
