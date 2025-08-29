import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Star, Clock, Truck, Shield, Award } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { TextAnimate } from "../../components/ui/text-animate";
import { AnimatedGradientText } from "../../components/ui/animated-gradient-text";
import { NumberTicker } from "../../components/ui/number-ticker";
import { ProductCard } from "../../components/common/ProductCard";
import { productService, promotionService } from "../../services/api";

export function HomePage() {
  const [popularProducts, setPopularProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, promotionsRes] = await Promise.all([
          productService.getPopularProducts(),
          promotionService.getActivePromotions(),
        ]);
        setPopularProducts(productsRes.data);
        setPromotions(promotionsRes.data);
      } catch (error) {
        // Error silencioso en desarrollo - en producción usar sistema de logging
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: Clock,
      title: "Entrega Rápida",
      description: "En menos de 45 minutos en toda la ciudad",
    },
    {
      icon: Truck,
      title: "Envío Gratis",
      description: "En pedidos mayores a $3000",
    },
    {
      icon: Shield,
      title: "Calidad Garantizada",
      description: "Ingredientes frescos y naturales",
    },
    {
      icon: Award,
      title: "Tradición Familiar",
      description: "Más de 25 años de experiencia",
    },
  ];

  const stats = [
    { value: 10000, label: "Clientes Felices", suffix: "+" },
    { value: 50000, label: "Empanadas Vendidas", suffix: "+" },
    { value: 25, label: "Años de Experiencia" },
    { value: 4.8, label: "Puntuación Promedio", decimals: 1 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-empanada-golden via-empanada-crust to-empanada-dark">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" />
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-8xl mb-6 animate-bounce-subtle">🥟</div>
            
            <TextAnimate
              animation="slideUp"
              by="word"
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              Las Mejores Empanadas de la Ciudad
            </TextAnimate>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
            >
              Tradición familiar desde 1995. Ingredientes frescos, recetas artesanales
              y el sabor auténtico que tanto amas.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/menu">
                <Button size="lg" variant="shimmer" className="text-lg px-8 py-4">
                  Ver Nuestro Menú
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/locales">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/20 border-white/30 text-white hover:bg-white/30">
                  Encontrar Local
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por qué elegir{" "}
              <AnimatedGradientText>Nonino Empanadas</AnimatedGradientText>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre lo que nos hace únicos y por qué miles de clientes confían en nosotros
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-empanada-golden/10 rounded-full group-hover:bg-empanada-golden/20 transition-colors">
                      <feature.icon className="w-8 h-8 text-empanada-golden" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-empanada-golden/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Números que hablan por nosotros
            </h2>
            <p className="text-lg text-muted-foreground">
              La confianza de nuestros clientes es nuestro mejor respaldo
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-empanada-golden mb-2">
                  <NumberTicker
                    value={stat.value}
                    decimalPlaces={stat.decimals || 0}
                  />
                  {stat.suffix}
                </div>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestras Empanadas Más Populares
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre los sabores favoritos de nuestros clientes
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[4/3] rounded-lg mb-4" />
                  <div className="bg-gray-200 h-4 rounded mb-2" />
                  <div className="bg-gray-200 h-4 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/menu">
              <Button size="lg" variant="empanada">
                Ver Todo el Menú
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Promotions */}
      {promotions.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Promociones Especiales
              </h2>
              <p className="text-lg text-muted-foreground">
                Aprovecha nuestras ofertas increíbles
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promotions.map((promotion, index) => (
                <motion.div
                  key={promotion.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-[16/9] relative">
                      <img
                        src={promotion.image}
                        alt={promotion.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="empanada" className="text-sm">
                          {promotion.discount}% OFF
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{promotion.title}</h3>
                      <p className="text-muted-foreground mb-4">{promotion.description}</p>
                      <Button variant="outline" className="w-full">
                        Ver Detalles
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-empanada-golden text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para disfrutar?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Haz tu pedido ahora y recibe nuestras deliciosas empanadas
              en la comodidad de tu hogar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu">
                <Button size="lg" variant="shimmer" className="text-lg px-8 py-4">
                  Hacer Pedido Ahora
                </Button>
              </Link>
              <a href="tel:+541112345678">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/20 border-white/30 text-white hover:bg-white/30">
                  Llamar: +54 11 1234-5678
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
