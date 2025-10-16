import { useState } from "react";
import { motion } from "framer-motion";
import { Store, TrendingUp, Users, Award, Phone, Factory, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingOrderButton } from "@/components/common/FloatingOrderButton";
import { useNavigate } from "react-router";
import {
  nonino_lateralBlur,
  nonino_lateral640,
  nonino_lateral1024,
  nonino_lateral1920,
  nonino_lateral2560
} from '@/assets/images/optimized';

export function FranchisePage() {
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleContactClick = () => {
    navigate('/contacto');
  };

  const benefits = [
    {
      icon: Award,
      title: "Productos Listos Para Vender",
      description: "Marca reconocida y valorada por su precio y calidad en toda la región. Nuestras empanadas tienen una reputación consolidada que te garantiza clientes desde el primer día.",
      features: [
        "Marca establecida con 10 años de trayectoria",
        "Productos de alta calidad ya probados en el mercado",
        "Recetas exclusivas y reconocidas"
      ]
    },
    {
      icon: TrendingUp,
      title: "Negocio Simple y Rentable",
      description: "Modelo de negocio probado con excelente retorno de inversión. Sistema operativo simplificado que te permite enfocarte en vender sin complicaciones.",
      features: [
        "Proceso operativo optimizado y documentado",
        "ROI comprobado en nuestros locales existentes",
        "Inversión accesible con plan de financiamiento"
      ]
    },
    {
      icon: Users,
      title: "Soporte Completo",
      description: "Brindamos soporte, capacitación y acompañamiento continuo. No necesitás experiencia previa. Te acompañamos en cada etapa del negocio.",
      features: [
        "Capacitación inicial completa e intensiva",
        "Soporte técnico y comercial permanente",
        "Marketing y materiales promocionales incluidos"
      ]
    }
  ];

  const franchiseStats = [
    { value: "10+", label: "Años de Experiencia" },
    { value: "4", label: "Locales Activos" },
    { value: "95%", label: "Satisfacción Clientes" },
    { value: "32", label: "Variedades Únicas" }
  ];

  return (
    <div className="min-h-screen bg-empanada-light-gray">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-black via-empanada-darker to-empanada-medium text-white py-20 md:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge superior */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="inline-flex items-center gap-2 bg-empanada-golden/10 border border-empanada-golden/30 rounded-full px-6 py-2">
                <Store className="w-4 h-4 text-empanada-golden" />
                <span className="text-sm font-semibold text-empanada-golden">Oportunidad de Negocio</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl min-[375px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 px-4 leading-tight"
            >
              UNITE A NUESTRA RED DE FRANQUICIAS
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8"
            >
              Convertite en parte de la red de empanadas artesanales más exitosa de la Patagonia
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={handleContactClick}
                size="lg"
                className="bg-gradient-to-r from-empanada-golden to-empanada-warm hover:from-empanada-warm hover:to-empanada-rich text-white text-lg px-8 py-6 shadow-2xl hover:shadow-xl transition-all duration-300"
              >
                <Phone className="mr-2 w-5 h-5" />
                QUIERO SER FRANQUICIADO
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-empanada-medium">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {franchiseStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-empanada-golden mb-2">
                  {stat.value}
                </div>
                <p className="text-sm md:text-base text-white font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content - Imagen + Beneficios */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-empanada-medium via-empanada-light-gray to-empanada-medium/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
              ¿Por Qué Elegir Nonino?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Una oportunidad de negocio única con respaldo comprobado
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
            {/* Imagen de la Fábrica */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] md:h-[500px] lg:h-[600px]"
            >
              {/* Blur placeholder */}
              {nonino_lateralBlur && !isImageLoaded && (
                <img
                  src={nonino_lateralBlur}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'blur(20px)', transform: 'scale(1.1)', objectPosition: '40% center' }}
                  aria-hidden="true"
                />
              )}

              {/* Main responsive image */}
              <picture>
                <source
                  type="image/webp"
                  srcSet={`${nonino_lateral640} 640w, ${nonino_lateral1024} 1024w, ${nonino_lateral1920} 1920w, ${nonino_lateral2560} 2560w`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <img
                  src={nonino_lateral2560}
                  alt="Fábrica Nonino Empanadas - Instalaciones modernas de producción artesanal"
                  className={`absolute inset-0 w-full h-full object-cover ${!isImageLoaded && nonino_lateralBlur ? 'opacity-0' : 'opacity-100'}`}
                  style={{ objectPosition: '40% center', transition: 'opacity 0.3s ease-in-out' }}
                  onLoad={() => setIsImageLoaded(true)}
                />
              </picture>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

              {/* Badge sobre la imagen */}
              <div className="absolute bottom-6 left-6 bg-empanada-golden/90 backdrop-blur-sm rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 text-white">
                  <Factory className="w-5 h-5" />
                  <span className="font-semibold">Nuestra Fábrica</span>
                </div>
              </div>
            </motion.div>

            {/* Beneficios Grid */}
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                >
                  <Card className="bg-empanada-dark/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-l-4 border-empanada-golden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-empanada-golden/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="w-7 h-7 text-empanada-golden" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 text-empanada-golden">
                            {benefit.title}
                          </h3>
                          <p className="text-gray-200 leading-relaxed mb-4">
                            {benefit.description}
                          </p>
                          <ul className="space-y-2">
                            {benefit.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                <CheckCircle className="w-4 h-4 text-empanada-golden flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FloatingOrderButton />
    </div>
  );
}
