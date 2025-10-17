import { useState, memo } from "react";
import { motion } from "framer-motion";
import { Plus, Star, Clock, Users, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ProductModal } from "../ui/ProductModal";
import { ProductImage } from "../ui/OptimizedImage";
import { useCart } from "../../context/CartProvider";
import { formatPrice } from "../../lib/utils";
import { toast } from "sonner";

export const ProductCard = memo(function ProductCard({ product, className }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { addItem } = useCart();

  /**
   * Maneja la adición de productos al carrito
   */
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
    // El toast se maneja en el contexto CartContext
  };


  /**
   * Maneja la apertura del modal en mobile
   */
  const handleCardClick = () => {
    // Solo abrir modal en dispositivos móviles
    if (window.innerWidth < 768) {
      setShowModal(true);
    }
  };

  return (
    <>
      <motion.div
        className={'h-full'}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card
          className="h-full overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col bg-empanada-dark border-empanada-light-gray"
          onClick={handleCardClick}
        >
        <div>
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden">
            <ProductImage
              product={product}
              context="static"
              className="w-full h-full"
              priority={false}
              quality="high"
            />
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isPopular && (
              <Badge variant="empanada" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            )}
            {/* {!product.isAvailable && (
              <Badge variant="destructive" className="text-xs">
                Agotado
              </Badge>
            )} */}
          </div>


          {/* Quick Add Button */}
          <motion.div
            className="absolute bottom-2 right-2"
            style={{
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.15s ease-in-out'
            }}
          >
            <Button
              size="icon"
              variant="empanada"
              onClick={handleAddToCart}
            //   disabled={!product.isAvailable}
              className="shadow-lg"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        <CardContent className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-lg leading-tight text-white group-hover:text-empanada-golden transition-colors mb-1">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-empanada-golden">
                {formatPrice(product.price)}
              </p>
              {product.volume && (
                <span className="text-sm text-gray-400">
                  {product.volume}
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{product.preparationTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{product.rating}</span>
              <span>({product.reviews})</span>
            </div>
          </div>

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
        </CardContent>
        </div>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full text-xs sm:text-sm md:text-base"
            variant="empanada"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Agregar al Carrito</span>
            <span className="md:hidden">Agregar</span>
          </Button>
        </CardFooter>
        </Card>
      </motion.div>

      {/* Product Modal */}
      <ProductModal
        product={product}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparador para evitar re-renders innecesarios
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.isAvailable === nextProps.product.isAvailable &&
    prevProps.className === nextProps.className
  );
});
