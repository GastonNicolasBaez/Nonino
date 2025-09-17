import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router";

export function FloatingOrderButton() {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <Link to="/pedir">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          {/* Sombra sutil */}
          <div className="absolute inset-0 bg-empanada-golden/20 rounded-full blur-md" />
          
          {/* Botón principal */}
          <Button
            size="lg"
            className="relative bg-gradient-to-r from-empanada-golden to-empanada-warm hover:from-empanada-warm hover:to-empanada-rich text-white font-semibold px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-0"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Pedir Ya</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Button>
        </motion.div>
      </Link>
    </motion.div>
  );
}
