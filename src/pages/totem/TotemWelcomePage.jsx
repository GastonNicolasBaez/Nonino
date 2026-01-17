import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { usePublicData } from '@/context/PublicDataProvider';
import logoNonino from '@/assets/logos/nonino.png';
import SanMartin1920 from '@/assets/images/optimized/SanMartin-1920w.webp';

export const TotemWelcomePage = () => {
  const navigate = useNavigate();
  const { sucursales, sucursalSeleccionada } = usePublicData();

  const selectedStore = sucursales.find(s => s.id === sucursalSeleccionada);

  const handleStartOrder = () => {
    navigate('/totem/menu');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-empanada-dark">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0">
        <img
          src={SanMartin1920}
          alt="Nonino Empanadas"
          className="w-full h-full object-cover"
        />
        {/* Overlay oscuro para mejor contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      {/* Contenido centrado */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <img
            src={logoNonino}
            alt="Nonino Logo"
            className="w-40 h-40 mx-auto drop-shadow-2xl"
          />
        </motion.div>

        {/* Nombre de la empresa */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <h1 className="text-7xl font-black text-white mb-3 drop-shadow-2xl tracking-tight">
            NONINO
          </h1>
          <div className="h-1 w-48 mx-auto bg-empanada-golden rounded-full" />
        </motion.div>

        {/* Nombre de la sucursal */}
        {selectedStore && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl text-empanada-golden font-bold mb-12 drop-shadow-lg"
          >
            {selectedStore.name}
          </motion.p>
        )}

        {/* Botón de inicio */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleStartOrder}
            size="lg"
            className="bg-empanada-golden hover:bg-empanada-golden/90 text-empanada-dark font-black text-3xl px-16 py-10 h-auto rounded-2xl shadow-2xl shadow-empanada-golden/50 border-4 border-white/20 transition-all duration-300"
          >
            Inicia tu pedido
          </Button>
        </motion.div>

        {/* Pulso sutil en el botón */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-white/60 text-lg"
          >
            👆 Tocá para comenzar
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TotemWelcomePage;
