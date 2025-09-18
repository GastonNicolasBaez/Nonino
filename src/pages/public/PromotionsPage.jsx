import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { TextAnimate } from "../../components/ui/text-animate";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { FloatingOrderButton } from "../../components/common/FloatingOrderButton";
import { promotionService } from "../../services/api";
import { formatPrice } from "../../lib/utils";

export function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await promotionService.getActivePromotions();
        setPromotions(response.data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-empanada-dark text-white py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-empanada-golden/20 to-empanada-crust/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <TextAnimate
            animation="slideUp"
            by="word"
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Promociones Especiales
          </TextAnimate>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            ¡Aprovecha nuestras increíbles ofertas y disfruta más por menos!
          </motion.p>
        </div>
      </section>

      {/* Promotions Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.map((promotion, index) => (
              <motion.div
                key={promotion.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full">
                  <div className="relative">
                    <img
                      src={promotion.image}
                      alt={promotion.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="empanada" className="text-lg px-3 py-1">
                        {promotion.discount}% OFF
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl">{promotion.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-gray-600 mb-4 flex-1">
                      {promotion.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      {promotion.originalPrice && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Precio original:</span>
                          <span className="line-through text-gray-500">
                            {formatPrice(promotion.originalPrice)}
                          </span>
                        </div>
                      )}
                      
                      {promotion.salePrice && (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Precio promocional:</span>
                          <span className="text-2xl font-bold text-empanada-golden">
                            {formatPrice(promotion.salePrice)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Válido hasta: {new Date(promotion.validUntil).toLocaleDateString('es-AR')}</span>
                      </div>
                      
                      {promotion.conditions && (
                        <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                          {promotion.conditions}
                        </div>
                      )}
                    </div>
                    
                    <Button variant="empanada" className="w-full">
                      ¡Aprovechar Oferta!
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Codes */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Códigos de Descuento
            </h2>
            <p className="text-lg text-gray-600">
              Usa estos códigos en tu próxima compra online
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { code: "BIENVENIDO10", discount: "10%", description: "Para nuevos clientes" },
              { code: "ENVIOGRATIS", discount: "Envío gratis", description: "En pedidos +$2500" },
              { code: "EMPANADAS20", discount: "20%", description: "En docenas mixtas" },
              { code: "NUEVOCLIENTE", discount: "15%", description: "Primera compra" },
            ].map((promo, index) => (
              <motion.div
                key={promo.code}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow border-dashed border-2 border-empanada-golden/30">
                  <CardContent className="p-6">
                    <Tag className="w-8 h-8 text-empanada-golden mx-auto mb-3" />
                    <div className="bg-empanada-golden/10 px-4 py-2 rounded-lg mb-3">
                      <code className="text-lg font-bold text-empanada-golden">
                        {promo.code}
                      </code>
                    </div>
                    <div className="text-2xl font-bold text-empanada-golden mb-2">
                      {promo.discount}
                    </div>
                    <p className="text-sm text-gray-600">{promo.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FloatingOrderButton />
    </div>
  );
}
