import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { Heart, Award, Users, Clock } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { TextAnimate } from "../../components/ui/text-animate";
import { Card, CardContent } from "../../components/ui/card";
import { FloatingOrderButton } from "../../components/common/FloatingOrderButton";
import { AnimatedTestimonials } from "../../components/ui/animated-testimonials";
import { ZoomParallax } from "../../components/ui/zoom-parallax";
import { AnimatedGradientText } from "../../components/ui/animated-gradient-text";
import { WordPullUp } from "../../components/ui/word-pull-up";

// Importar imágenes optimizadas del parallax
import {
  parallax0Blur, parallax0640, parallax01024, parallax01920, parallax02560,
  parallax1Blur, parallax1640, parallax11024, parallax11920, parallax12560,
  parallax2Blur, parallax2640, parallax21024, parallax21920, parallax22560,
  parallax3Blur, parallax3640, parallax31024, parallax31920, parallax32560,
  parallax4Blur, parallax4640, parallax41024, parallax41920, parallax42560,
  parallax5Blur, parallax5640, parallax51024, parallax51920, parallax52560,
  parallax6Blur, parallax6640, parallax61024, parallax61920, parallax62560,
  SanMartinBlur, SanMartin640, SanMartin1024, SanMartin1920, SanMartin2560
} from "../../assets/images/optimized";

export function AboutPage() {
  const parallaxRef = useRef(null);
  // Clave para re-inicializar efectos de scroll tras el montaje
  const [initKey, setInitKey] = useState(0);
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

  // No forzar remount global aquí; el componente interno refresca al cargar imagen
  // Asegurar inicialización de efectos de scroll al ingresar por primera vez
  useEffect(() => {
    // Volver al tope para que los observadores tomen el estado inicial
    window.scrollTo(0, 0);
    // Forzar un remount controlado de elementos que dependen de scroll
    const id = requestAnimationFrame(() => setInitKey((k) => k + 1));
    // Disparar un evento de scroll para que framer-motion calcule posiciones
    const fire = () => window.dispatchEvent(new Event('scroll'));
    const t = setTimeout(fire, 0);
    document.addEventListener('visibilitychange', fire);
    window.addEventListener('load', fire, { once: true });
    // Doble nudge como fallback
    const tt = setTimeout(() => {
      const y = (window.pageYOffset || window.scrollY || 0);
      window.scrollTo(0, Math.max(0, y + 1));
      window.scrollTo(0, Math.max(0, y));
      fire();
    }, 50);

    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
      clearTimeout(tt);
      document.removeEventListener('visibilitychange', fire);
    };
  }, []);

  // Progreso manual robusto para sincronizar el título con el parallax
  const manualProgress = useMotionValue(0);
  useEffect(() => {
    const clamp = (v) => Math.max(0, Math.min(1, v));
    let rafId = 0;
    let rafWarm = 0;
    let warm = true;
    const update = () => {
      if (!parallaxRef.current) return;
      const rect = parallaxRef.current.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      const total = Math.max(1, rect.height - vh);
      const progress = clamp((0 - rect.top) / total);
      manualProgress.set(progress);
    };
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };
    const onResize = onScroll;
    requestAnimationFrame(update);
    const warmup = () => { if (!warm) return; update(); rafWarm = requestAnimationFrame(warmup); };
    rafWarm = requestAnimationFrame(warmup);
    const opts = { passive: true };
    window.addEventListener('scroll', onScroll, opts);
    document.addEventListener('scroll', onScroll, opts);
    window.addEventListener('resize', onResize, opts);
    window.addEventListener('orientationchange', onResize, opts);
    document.addEventListener('visibilitychange', update);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (rafWarm) cancelAnimationFrame(rafWarm);
      warm = false;
      window.removeEventListener('scroll', onScroll, opts);
      document.removeEventListener('scroll', onScroll, opts);
      window.removeEventListener('resize', onResize, opts);
      window.removeEventListener('orientationchange', onResize, opts);
      document.removeEventListener('visibilitychange', update);
    };
  }, [manualProgress]);

  // Transformaciones para el efecto sticky del título
  // Que aparezca más tarde y se vaya justo al final del parallax
  const titleY = useTransform(manualProgress, [0.2, 0.45, 0.85, 0.99], [200, 0, 0, -200]);
  const titleOpacity = useTransform(manualProgress, [0.25, 0.45, 0.85, 0.99], [0, 1, 1, 0]);

  // Control de animación WordPullUp basado en scroll
  const [shouldAnimateTitle, setShouldAnimateTitle] = useState(false);
  const [shouldAnimateSubtitle, setShouldAnimateSubtitle] = useState(false);
  const [hideTitle, setHideTitle] = useState(false);

  useEffect(() => {
    const unsubscribe = manualProgress.on("change", (value) => {
      if (value >= 0.4 && !shouldAnimateTitle) {
        setShouldAnimateTitle(true);
      }
      if (value >= 0.5 && !shouldAnimateSubtitle) {
        setShouldAnimateSubtitle(true);
      }
    });

    return () => unsubscribe();
  }, [manualProgress, shouldAnimateTitle, shouldAnimateSubtitle]);

  // Ocultar el título al finalizar el parallax o al entrar historia
  useEffect(() => {
    const t1 = document.getElementById('historia');
    const t2 = document.getElementById('end-parallax');
    const obs = new IntersectionObserver((entries) => {
      const anyVisible = entries.some(e => e.isIntersecting && e.intersectionRatio > 0.01);
      setHideTitle(anyVisible);
    }, { threshold: [0, 0.01, 0.1] });
    if (t1) obs.observe(t1);
    if (t2) obs.observe(t2);
    return () => obs.disconnect();
  }, []);

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
      src: parallax02560,
      srcSet: `${parallax0640} 640w, ${parallax01024} 1024w, ${parallax01920} 1920w, ${parallax02560} 2560w`,
      blurDataURL: parallax0Blur,
      alt: 'Empanadas doradas y crujientes - Index 0',
    },
    {
      src: parallax12560,
      srcSet: `${parallax1640} 640w, ${parallax11024} 1024w, ${parallax11920} 1920w, ${parallax12560} 2560w`,
      blurDataURL: parallax1Blur,
      alt: 'Empanadas tradicionales argentinas - Index 1',
      // Configuración especial para alta calidad
      quality: 'high',
      priority: true
    },
    {
      src: parallax22560,
      srcSet: `${parallax2640} 640w, ${parallax21024} 1024w, ${parallax21920} 1920w, ${parallax22560} 2560w`,
      blurDataURL: parallax2Blur,
      alt: 'Ingredientes frescos y naturales - Index 2',
    },
    {
      src: parallax32560,
      srcSet: `${parallax3640} 640w, ${parallax31024} 1024w, ${parallax31920} 1920w, ${parallax32560} 2560w`,
      blurDataURL: parallax3Blur,
      alt: 'Cocina tradicional argentina - Index 3',
    },
    {
      src: parallax42560,
      srcSet: `${parallax4640} 640w, ${parallax41024} 1024w, ${parallax41920} 1920w, ${parallax42560} 2560w`,
      blurDataURL: parallax4Blur,
      alt: 'Ambiente familiar y acogedor - Index 4',
    },
    {
      src: parallax52560,
      srcSet: `${parallax5640} 640w, ${parallax51024} 1024w, ${parallax51920} 1920w, ${parallax52560} 2560w`,
      blurDataURL: parallax5Blur,
      alt: 'Tradición culinaria argentina - Index 5',
    },
    {
      src: parallax62560,
      srcSet: `${parallax6640} 640w, ${parallax61024} 1024w, ${parallax61920} 1920w, ${parallax62560} 2560w`,
      blurDataURL: parallax6Blur,
      alt: 'Cocina profesional argentina - Index 6',
    },
  ];


  return (
    <div className="min-h-screen">
      {/* Hero Section with Zoom Parallax */}
      <section key={`about-parallax-${initKey}`} ref={parallaxRef} className="relative -mb-1" style={{ marginTop: '-80px' }}>
        {/* Zoom Parallax Component */}
        <ZoomParallax key={`zoom-${initKey}`} images={parallaxImages} />
      </section>

      {/* Unified Background Gradient Container */}
      <div className="bg-gradient-to-b from-empanada-light-gray via-empanada-medium via-empanada-dark via-empanada-darker to-black">

      {/* Título sticky que aparece durante el parallax */}
      <motion.div
        className={`fixed left-0 right-0 z-50 flex items-center justify-center pointer-events-none ${hideTitle ? 'opacity-0' : ''}`}
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
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-empanada-golden leading-tight"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.4)' }}
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
            words="Empanadas que se destacan por su tamaño y por la calidad de la materia prima que utilizamos, con la mayor variedad de rellenos deliciosos de San Martin De los Andes."
            className="text-xl md:text-2xl text-empanada-golden/90 font-medium leading-relaxed"
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7), 0 0 8px rgba(0,0,0,0.5)' }}
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

      {/* Anchor point for end of parallax (ajustado para cerrar sin gap) */}
      <div id="end-parallax" className="absolute" style={{ top: '205vh' }}></div>

        {/* Story Section */}
        <section id="historia" className="py-8 sm:py-12 lg:py-16 -mt-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2 text-empanada-white">
                La Historia de Don Carlos
              </h2>
              <div className="space-y-4 text-empanada-golden leading-relaxed">
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
        <section className="py-4 relative overflow-hidden">
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
      </section>

        {/* Values Section */}
        <section id="valores" className="py-8 sm:py-12 lg:py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Nuestros Valores
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
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
      </section>

        {/* Separator Section - Values to Timeline */}
        <section className="py-4 relative overflow-hidden">
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
      </section>

        {/* Timeline Section */}
        <section id="trayectoria" className="py-6 sm:py-8 lg:py-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Nuestra Trayectoria
            </h2>
            <p className="text-lg text-gray-300">
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
        <section className="py-4 relative overflow-hidden">
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
      </section>

        {/* Team Section */}
        <section id="equipo" className="py-6 sm:py-8 lg:py-12 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Nuestro Equipo
            </h2>
            <p className="text-lg text-gray-300">
              Las personas que hacen posible cada empanada
            </p>
          </motion.div>

          <AnimatedTestimonials autoplay={true} />
        </div>
      </section>

      </div>

      <FloatingOrderButton />
    </div>
  );
}
