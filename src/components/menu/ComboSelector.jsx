import { motion } from "framer-motion";
import { ShoppingCart, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function ComboSelector({ combos, onSelectCombo, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-empanada-golden mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando combos disponibles...</p>
        </div>
      </div>
    );
  }

  if (!combos || combos.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No hay combos disponibles
          </h3>
          <p className="text-gray-400">
            Por favor, vuelve más tarde o contacta con nosotros.
          </p>
        </div>
      </div>
    );
  }

  const calculateDiscount = (combo) => {
    if (!combo.components || combo.components.length === 0) return 0;
    
    const originalPrice = combo.components.reduce((sum, component) => {
      return sum + (component.price * component.quantity);
    }, 0);
    
    return originalPrice - combo.price;
  };

  const calculateDiscountPercentage = (combo) => {
    if (!combo.components || combo.components.length === 0) return 0;
    
    const originalPrice = combo.components.reduce((sum, component) => {
      return sum + (component.price * component.quantity);
    }, 0);
    
    if (originalPrice === 0) return 0;
    
    return Math.round(((originalPrice - combo.price) / originalPrice) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-empanada-golden" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Armá tu Combo Personalizado
            </h1>
            <Sparkles className="w-8 h-8 text-empanada-golden" />
          </div>
          <p className="text-gray-400 text-lg">
            Elegí uno de nuestros combos y personalizalo a tu gusto
          </p>
        </motion.div>
      </div>

      {/* Grid de Combos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {combos.map((combo, index) => {
          const discount = calculateDiscount(combo);
          const discountPercentage = calculateDiscountPercentage(combo);

          return (
            <motion.div
              key={combo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]",
                  "bg-empanada-dark border-2 border-empanada-light-gray hover:border-empanada-golden",
                  "cursor-pointer group"
                )}
              >
                <div className="relative">
                  {/* Imagen del combo */}
                  <div className="h-48 bg-gradient-to-br from-empanada-medium to-empanada-dark overflow-hidden relative">
                    {combo.imageBase64 ? (
                      <img
                        src={combo.imageBase64}
                        alt={combo.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-20 h-20 text-empanada-golden opacity-30" />
                      </div>
                    )}

                    {/* Badge de descuento */}
                    {discount > 0 && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-empanada-golden to-empanada-warm text-white px-3 py-1 text-sm font-bold shadow-lg">
                          <TrendingUp className="w-4 h-4 mr-1 inline" />
                          {discountPercentage}% OFF
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    {/* Nombre y descripción */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-empanada-golden transition-colors">
                        {combo.name}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {combo.description || "Combo personalizable"}
                      </p>
                    </div>

                    {/* Componentes del combo */}
                    <div className="mb-4 p-3 bg-empanada-medium rounded-lg">
                      <p className="text-xs font-semibold text-empanada-golden mb-2 uppercase tracking-wide">
                        Incluye:
                      </p>
                      <ul className="space-y-1">
                        {combo.components && combo.components.map((component, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-300 flex items-center"
                          >
                            <span className="w-2 h-2 bg-empanada-golden rounded-full mr-2"></span>
                            {component.quantity}x {component.productName}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Precios */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {discount > 0 && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(combo.price + discount)}
                          </p>
                        )}
                        <p className="text-3xl font-bold text-empanada-golden">
                          {formatPrice(combo.price)}
                        </p>
                      </div>
                      {discount > 0 && (
                        <Badge variant="empanada" className="text-sm">
                          Ahorrás {formatPrice(discount)}
                        </Badge>
                      )}
                    </div>

                    {/* Botón de selección */}
                    <Button
                      variant="empanada"
                      className="w-full group-hover:shadow-lg"
                      size="lg"
                      onClick={() => onSelectCombo(combo)}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Seleccionar este Combo
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info adicional */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center py-6 px-4 bg-empanada-medium rounded-lg border border-empanada-light-gray"
      >
        <p className="text-gray-400 text-sm">
          💡 <span className="text-empanada-golden font-semibold">Tip:</span>{" "}
          Después de seleccionar tu combo, podrás elegir los sabores de empanadas,
          bebidas y postres que más te gusten.
        </p>
      </motion.div>
    </div>
  );
}

