import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Eye } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { formatPrice } from "../../lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "../../hooks/useMediaQuery";

export function ProductCardDisplay({ product, className, onViewDetails }) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();


  /**
   * Maneja el click para ver detalles
   */
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <motion.div
      className={`h-full ${className || ''}`}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      <Card className="h-full overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500 flex flex-col bg-white/90 backdrop-blur-sm border border-empanada-cream shadow-lg hover:shadow-empanada-golden/20">
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isPopular && (
              <Badge variant="empanada" className="text-xs font-semibold shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            )}
            {!product.isAvailable && (
              <Badge variant="destructive" className="text-xs font-semibold shadow-lg">
                Agotado
              </Badge>
            )}
          </div>


          {/* View Details Button */}
          <motion.div
            className="absolute bottom-3 right-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? 0 : 20 
            }}
            transition={{ duration: 0.3 }}
          >
            <Button
              size="sm"
              variant="empanada"
              className="shadow-lg hover:shadow-xl"
            >
              <Eye className="w-4 h-4 mr-1" />
              Ver
            </Button>
          </motion.div>
        </div>

        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="mb-3">
            <h3 className="font-bold text-xl leading-tight group-hover:text-empanada-golden transition-colors duration-300 mb-2">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-empanada-golden">
                {formatPrice(product.price)}
              </p>
              {product.volume && (
                <span className="text-sm text-muted-foreground">
                  {product.volume}
                </span>
              )}
            </div>
          </div>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Allergens */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.allergens.map((allergen) => (
                <Badge key={allergen} variant="outline" className="text-xs">
                  {allergen}
                </Badge>
              ))}
            </div>
          )}

          {/* Category Badge */}
          <div className="mt-auto">
            <Badge variant="secondary" className="text-xs font-medium">
              {product.category}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
