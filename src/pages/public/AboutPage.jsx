import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Award, Users, Clock } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { TextAnimate } from "../../components/ui/text-animate";
import { Card, CardContent } from "../../components/ui/card";
import { FloatingOrderButton } from "../../components/common/FloatingOrderButton";
import { AnimatedTestimonials } from "../../components/ui/animated-testimonials";
import { ZoomParallax } from "../../components/ui/zoom-parallax";
import { AnimatedGradientText } from "../../components/ui/animated-gradient-text";
import { WordPullUp } from "../../components/ui/word-pull-up";

// Importar imágenes locales del parallax
import parallax0 from "../../assets/images/parallax0.jpg";
import parallax1 from "../../assets/images/parallax1.JPG";
import parallax2 from "../../assets/images/parallax2.jpg";
import parallax3 from "../../assets/images/parallax3.jpg";
import parallax4 from "../../assets/images/parallax4.jpg";
import parallax5 from "../../assets/images/parallax5.jpg";
import parallax6 from "../../assets/images/parallax6.jpg";

export function AboutPage() {
  const parallaxRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start start", "end start"],
    // En móvil, usar document.body como fuente de scroll
    container: isMobile ? { current: document.body } : undefined
  });

  // Transformaciones para el efecto sticky del título
  const titleY = useTransform(scrollYProgress, [0, 0.3, 0.6, 0.75], [200, 0, 0, -200]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 0.7], [0, 1, 1, 0]);

  // Control de animación WordPullUp basado en scroll
  const [shouldAnimateTitle, setShouldAnimateTitle] = useState(false);
  const [shouldAnimateSubtitle, setShouldAnimateSubtitle] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (value >= 0.25 && !shouldAnimateTitle) {
        setShouldAnimateTitle(true);
      }
      if (value >= 0.35 && !shouldAnimateSubtitle) {
        setShouldAnimateSubtitle(true);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, shouldAnimateTitle, shouldAnimateSubtitle]);

  const values = [
    {
      icon: Heart,
      title: "Pasión",
      description: "Cada empanada está hecha con amor y dedicación, manteniendo las recetas familiares que nos han acompañado por generaciones."
    },
    {
      icon: Award,
      title: "Calidad",
      description: "Seleccionamos cuidadosamente cada ingrediente para garantizar el mejor sabor y frescura en todos nuestros productos."
    },
    {
      icon: Users,
      title: "Familia",
      description: "Somos una empresa familiar que valora las relaciones humanas y el trato cercano con cada uno de nuestros clientes."
    },
    {
      icon: Clock,
      title: "Tradición",
      description: "Respetamos las técnicas tradicionales de elaboración mientras innovamos para satisfacer los gustos modernos."
    }
  ];

  const milestones = [
    { year: "1995", event: "Fundación de Nonino Empanadas", description: "Don Carlos Nonino abre el primer local familiar" },
    { year: "2000", event: "Segundo Local", description: "Expansión a la zona norte de la ciudad" },
    { year: "2010", event: "Delivery Online", description: "Lanzamiento de nuestro servicio de delivery" },
    { year: "2020", event: "App Mobile", description: "Desarrollo de nuestra aplicación móvil" },
    { year: "2024", event: "25 Años de Tradición", description: "Celebramos nuestro aniversario con nuevas recetas" },
  ];

  const parallaxImages = [
    {
      src: parallax0,
      alt: 'Empanadas doradas y crujientes - Index 0',
    },
    {
      src: parallax1,
      alt: 'Local principal de Nonino Empanadas - Index 1',
    },
    {
      src: parallax2,
      alt: 'Ingredientes frescos y naturales - Index 2',
    },
    {
      src: parallax3,
      alt: 'Cocina tradicional argentina - Index 3',
    },
    {
      src: parallax4,
      alt: 'Ambiente familiar y acogedor - Index 4',
    },
    {
      src: parallax5,
      alt: 'Tradición culinaria argentina - Index 5',
    },
    {
      src: parallax6,
      alt: 'Cocina profesional argentina - Index 6',
    },
  ];


  return (
    <div className="min-h-screen">
      {/* Hero Section with Zoom Parallax */}
      <section ref={parallaxRef} className="relative -mb-1" style={{ marginTop: '-80px' }}>
        {/* Zoom Parallax Component */}
        <ZoomParallax images={parallaxImages} />
      </section>

      {/* Título sticky que aparece durante el parallax */}
      <motion.div
        className="fixed left-0 right-0 z-50 flex items-center justify-center pointer-events-none"
        style={{
          top: '35vh',
          transform: 'translateY(-50%)',
          y: titleY,
          opacity: titleOpacity
        }}
      >
        <div className="text-center max-w-4xl mx-auto px-8">
          <div className="mb-4">
            <WordPullUp
              words="NUESTRA HISTORIA"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-empanada-dark leading-tight"
              shouldAnimate={shouldAnimateTitle}
              wrapperFramerProps={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              framerProps={{
                hidden: { y: 20, opacity: 0 },
                show: { y: 0, opacity: 1 },
              }}
            />
          </div>
          <WordPullUp
            words="Una tradición familiar que comenzó hace más de 25 años con el sueño de compartir el auténtico sabor de las empanadas argentinas"
            className="text-xl md:text-2xl text-empanada-dark/80 font-medium leading-relaxed"
            shouldAnimate={shouldAnimateSubtitle}
            wrapperFramerProps={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            framerProps={{
              hidden: { y: 15, opacity: 0 },
              show: { y: 0, opacity: 1 },
            }}
          />
        </div>
      </motion.div>

      {/* Anchor point for end of parallax */}
      <div id="end-parallax" className="absolute" style={{ top: '200vh' }}></div>

      {/* Story Section */}
      <section id="historia" className="py-8 sm:py-12 lg:py-16 bg-empanada-cream -mt-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2 text-empanada-dark">
                La Historia de Don Carlos
              </h2>
              <div className="space-y-4 text-empanada-rich leading-relaxed">
                <p>
                  Todo comenzó en 1995 cuando Don Carlos Nonino decidió cumplir su sueño 
                  de abrir su propia empanadora. Con las recetas heredadas de su abuela 
                  y una gran pasión por la cocina, abrió el primer local en el centro de la ciudad.
                </p>
                <p>
                  Lo que empezó como un pequeño negocio familiar se convirtió en una tradición 
                  querida por toda la comunidad. Cada empanada es preparada con el mismo cuidado 
                  y dedicación que Don Carlos puso desde el primer día.
                </p>
                <p>
                  Hoy, con más de 25 años de experiencia, seguimos manteniendo esa esencia 
                  familiar mientras incorporamos nuevas tecnologías para brindar el mejor 
                  servicio a nuestros clientes.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-empanada-golden/10 rounded-lg shadow-lg flex items-center justify-center h-48">
                <span className="text-4xl">👨‍🍳</span>
              </div>
              <div className="bg-empanada-golden/10 rounded-lg shadow-lg flex items-center justify-center h-48">
                <span className="text-4xl">🏪</span>
              </div>
              <div className="bg-empanada-golden/10 rounded-lg shadow-lg flex items-center justify-center h-48">
                <span className="text-4xl">👨‍👩‍👧‍👦</span>
              </div>
              <div className="bg-empanada-golden/10 rounded-lg shadow-lg flex items-center justify-center h-48">
                <span className="text-4xl">🥟</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Separator Section - Story to Values */}
      <section className="py-4 bg-empanada-cream relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-empanada-golden/50"></div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-empanada-golden rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-empanada-golden/60 rounded-full"></div>
                <div className="w-3 h-3 bg-empanada-golden rounded-full animate-pulse delay-500"></div>
              </div>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-empanada-golden/50"></div>
            </div>
          </div>
        </div>
        {/* Degradado decorativo de fondo */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-full bg-gradient-to-b from-empanada-golden/5 via-empanada-golden/8 to-empanada-golden/5 blur-3xl"></div>
      </section>

      {/* Values Section */}
      <section id="valores" className="py-8 sm:py-12 lg:py-16 bg-empanada-cream relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestros Valores
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Los principios que guían cada día nuestro trabajo y nos conectan con nuestros clientes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-empanada-golden/10 rounded-full">
                      <value.icon className="w-8 h-8 text-empanada-golden" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Degradado de transición hacia la siguiente sección */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-empanada-cream"></div>
      </section>

      {/* Separator Section - Values to Timeline */}
      <section className="py-4 bg-empanada-cream relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-empanada-golden/50"></div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-empanada-golden rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-empanada-golden/60 rounded-full"></div>
                <div className="w-3 h-3 bg-empanada-golden rounded-full animate-pulse delay-500"></div>
              </div>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-empanada-golden/50"></div>
            </div>
          </div>
        </div>
        {/* Degradado decorativo de fondo */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-full bg-gradient-to-b from-empanada-golden/5 via-empanada-golden/8 to-empanada-golden/5 blur-3xl"></div>
      </section>

      {/* Timeline Section */}
      <section id="trayectoria" className="py-6 sm:py-8 lg:py-10 bg-empanada-cream">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestra Trayectoria
            </h2>
            <p className="text-lg text-gray-600">
              Los momentos más importantes de nuestra historia
            </p>
          </motion.div>

          <div className="relative max-w-6xl mx-auto">
            {/* Timeline Line - Horizontal */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-empanada-golden/20 transform -translate-y-1/2" />

            {/* Timeline Items - Alternating Layout */}
            <div className="hidden md:grid md:grid-cols-5 gap-4 relative">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="relative flex flex-col items-center">
                  {/* Timeline Dot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-empanada-golden rounded-full border-4 border-white shadow-lg z-10" />

                  {/* Content positioned above or below the line */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-full ${
                      index % 2 === 0
                        ? 'pb-48 flex flex-col justify-end' // Above the line (even indices)
                        : 'pt-48 flex flex-col justify-start' // Below the line (odd indices)
                    }`}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-bold text-empanada-golden mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-sm font-semibold mb-2">
                          {milestone.event}
                        </h3>
                        <p className="text-gray-600 text-xs">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Mobile Layout - Vertical */}
            <div className="md:hidden space-y-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-empanada-golden mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-base font-semibold mb-2">
                        {milestone.event}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Separator Section */}
      <section className="py-4 bg-empanada-cream relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-empanada-golden/50"></div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-empanada-golden rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-empanada-golden/60 rounded-full"></div>
                <div className="w-3 h-3 bg-empanada-golden rounded-full animate-pulse delay-500"></div>
              </div>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-empanada-golden/50"></div>
            </div>
          </div>
        </div>
        {/* Degradado decorativo de fondo */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-full bg-gradient-to-b from-empanada-golden/5 via-empanada-golden/8 to-empanada-golden/5 blur-3xl"></div>
      </section>

      {/* Team Section */}
      <section id="equipo" className="py-6 sm:py-8 lg:py-12 bg-empanada-cream relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-lg text-gray-600">
              Las personas que hacen posible cada empanada
            </p>
          </motion.div>

          <AnimatedTestimonials autoplay={true} />
        </div>
      </section>

      <FloatingOrderButton />
    </div>
  );
}
