import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router";
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
  
  // Parallax scroll effect
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -200]);

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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <motion.div
          className="absolute inset-0 w-full h-[140%] -top-[20%]"
          style={{
            backgroundImage: "url('/src/assets/images/SanMartin.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            y
          }}
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-4 sm:left-20 w-16 h-16 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl animate-float" />
          <div className="absolute bottom-20 right-4 sm:right-20 w-12 h-12 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/4 sm:left-1/3 w-8 h-8 sm:w-16 sm:h-16 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 sm:mb-6 animate-bounce-subtle">🥟</div>

            <TextAnimate
              animation="slideUp"
              by="word"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-4 sm:mb-6 px-2"
            >
              Las Mejores Empanadas de la Ciudad
            </TextAnimate>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto px-2"
            >
              Tradición familiar desde 1995. Ingredientes frescos, recetas artesanales
              y el sabor auténtico que tanto amas.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
            >
              <Link to="/menu" className="w-full sm:w-auto">
                <Button size="lg" variant="shimmer" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                  Ver Nuestro Menú
                  <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              <Link to="/locales" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-white/20 border-white/30 text-white hover:bg-white/30 w-full sm:w-auto">
                  Encontrar Local
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
              ¿Por qué elegir{" "}
              <AnimatedGradientText>Nonino Empanadas</AnimatedGradientText>?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Descubre lo que nos hace únicos y por qué miles de clientes confían en nosotros
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
                  <CardContent className="p-4 sm:p-6 flex flex-col flex-1">
                    <div className="mb-3 sm:mb-4 flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-empanada-golden/10 rounded-full group-hover:bg-empanada-golden/20 transition-colors mx-auto">
                      <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-empanada-golden" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground flex-1">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-empanada-golden/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
              Números que hablan por nosotros
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground px-2">
              La confianza de nuestros clientes es nuestro mejor respaldo
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center flex flex-col items-center"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-empanada-golden mb-2 text-center">
                  <NumberTicker
                    value={stat.value}
                    decimalPlaces={stat.decimals || 0}
                  />
                  {stat.suffix}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground font-medium px-1 text-center">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
              Nuestras Empanadas Más Populares
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Descubre los sabores favoritos de nuestros clientes
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[4/3] rounded-lg mb-4" />
                  <div className="bg-gray-200 h-4 rounded mb-2" />
                  <div className="bg-gray-200 h-4 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
            className="text-center mt-8 sm:mt-12"
          >
            <Link to="/menu">
              <Button size="lg" variant="empanada" className="px-6 sm:px-8 py-3 sm:py-4">
                Ver Todo el Menú
                <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Promotions */}
      {promotions.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12 lg:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
                Promociones Especiales
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-2">
                Aprovecha nuestras ofertas increíbles
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                        <Badge variant="empanada" className="text-xs sm:text-sm">
                          {promotion.discount}% OFF
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">{promotion.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">{promotion.description}</p>
                      <Button variant="outline" className="w-full text-sm sm:text-base py-2 sm:py-3">
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
      <section className="py-12 sm:py-16 lg:py-20 bg-empanada-golden text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
              ¿Listo para disfrutar?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90 max-w-2xl mx-auto px-2">
              Haz tu pedido ahora y recibe nuestras deliciosas empanadas
              en la comodidad de tu hogar
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link to="/menu" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="shimmer"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-white text-empanada-golden hover:bg-gray-100 border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                >
                  Hacer Pedido Ahora
                </Button>
              </Link>
              <a href="tel:+541112345678" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-white/20 border-white/30 text-white hover:bg-white/30 w-full sm:w-auto">
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
