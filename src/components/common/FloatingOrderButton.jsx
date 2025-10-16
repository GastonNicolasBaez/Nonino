import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { usePublicData } from "@/context/PublicDataProvider";

export function FloatingOrderButton() {
  const { sucursalSeleccionada } = usePublicData();

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <Link to="/menu">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          {/* Sombra sutil */}
          <div className="absolute inset-0 bg-green-500/30 rounded-full blur-lg" />

          {/* Botón principal */}
          <Button
            size="lg"
            className="relative bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-8 py-6 text-base sm:text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <ShoppingCart className="w-6 h-6" />
              <span>Pedir Ya</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </Button>
        </motion.div>
      </Link>
    </motion.div>
  );
}
