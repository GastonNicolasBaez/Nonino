import { useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router";
import { ChevronRight, Clock, Truck, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TextAnimate } from "@/components/ui/text-animate";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ProductsFocusCarousel } from "@/components/ui/products-focus-carousel";
import { FloatingOrderButton } from "@/components/common/FloatingOrderButton";
import { usePublicData } from "@/context/PublicDataProvider";
import { useRAFThrottle } from "@/hooks/useThrottle";
import logoNonino from '@/assets/logos/nonino.png';

// Imágenes optimizadas con WebP responsive
import {
    SanMartinBlur, SanMartin640, SanMartin1024, SanMartin1920, SanMartin2560,
    SanMartin2Blur, SanMartin2640, SanMartin21024, SanMartin21920, SanMartin22560
} from '@/assets/images/optimized';

export function HomePage() {

    const { productosTodos: productos, publicDataLoading: loading, sucursalSeleccionada } = usePublicData();

    const [promotions] = useState([]);
    const [isSmallMobile, setIsSmallMobile] = useState(() => {
        // Mobile muy pequeño (< 475px)
        if (typeof window !== 'undefined') {
            return window.innerWidth < 475;
        }
        return false;
    });
    const [isMobile, setIsMobile] = useState(() => {
        // Mobile (< 640px) - ajustado de 768px para mejor granularidad
        if (typeof window !== 'undefined') {
            return window.innerWidth < 640;
        }
        return false;
    });
    const [isTablet, setIsTablet] = useState(() => {
        // Tablet (640px - 1024px)
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 640 && window.innerWidth < 1024;
        }
        return false;
    });

    // Force scroll to top on mount to ensure logo animation starts correctly
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Agregar clase al body para background transparente
    useEffect(() => {
        document.body.classList.add('homepage-background');
        return () => {
            document.body.classList.remove('homepage-background');
        };
    }, []);

    // Detectar si es dispositivo móvil o tablet
    useEffect(() => {
        const checkDevice = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);

        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    // Parallax scroll effect con custom scroll source para móvil
    // OPTIMIZACIÓN: Throttle scroll con RAF para 60fps consistente
    const { scrollY } = useScroll({
        // En móvil, usar document.body como fuente de scroll
        container: isMobile ? { current: document.body } : undefined
    });

    // Throttle scroll values para mejor performance
    const throttledScrollY = useRAFThrottle(scrollY.get());

    // Parallax transforms optimizados con GPU acceleration
    const y = useTransform(scrollY, [0, 800], [0, -200]);
    const featuresParallaxY = useTransform(scrollY,
        value => value * (isMobile ? -0.15 : -0.3)
    );

    // Helper para obtener imagen responsive según viewport
    const getResponsiveImage = (blur, img640, img1024, img1920, img2560) => {
        const width = window.innerWidth;
        if (width <= 640) return img640;
        if (width <= 1024) return img1024;
        if (width <= 1920) return img1920;
        return img2560;
    };

    // Imágenes del hero según tamaño de pantalla
    const heroImage = useMemo(() =>
        getResponsiveImage(SanMartinBlur, SanMartin640, SanMartin1024, SanMartin1920, SanMartin2560),
        [isMobile, isTablet]
    );

    const featuresImage = useMemo(() =>
        getResponsiveImage(SanMartin2Blur, SanMartin2640, SanMartin21024, SanMartin21920, SanMartin22560),
        [isMobile, isTablet]
    );

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
            {/* Logo animado - Anclado al título del hero (~15px arriba) */}
            <motion.div
                className="fixed z-[30] pointer-events-none"
                style={{
                    left: "50%",
                    top: useTransform(
                        scrollY,
                        // Rangos de scroll para animación fluida (factor 1.89 - equilibrado)
                        isSmallMobile
                            ? [0, 169]      // 11.56rem → 4.5rem = 7.06rem (169px) de animación
                            : isMobile
                            ? [0, 215]      // 13.45rem → 4.5rem = 8.95rem (215px)
                            : isTablet
                            ? [0, 261]      // 15.39rem → 4.5rem = 10.89rem (261px)
                            : [0, 308],     // 17.325rem → 4.5rem = 12.825rem (308px)
                        // Posición ajustada (factor 1.89 - 30% menos que anterior) CON y: "-50%"
                        isSmallMobile
                            ? ["11.56rem", "4.5rem"]   // 4 + (12-4)/2*1.89 = 11.56rem
                            : isMobile
                            ? ["13.45rem", "4.5rem"]   // 4 + (14-4)/2*1.89 = 13.45rem
                            : isTablet
                            ? ["15.39rem", "4.5rem"]   // 4.5 + (16-4.5)/2*1.89 = 15.39rem
                            : ["17.325rem", "4.5rem"]  // 5 + (18-5)/2*1.89 = 17.325rem
                    ),
                    x: "-50%",
                    y: "-50%",
                    scale: useTransform(
                        scrollY,
                        // Mismos rangos de scroll que la posición para consistencia
                        isSmallMobile ? [0, 169] : isMobile ? [0, 215] : isTablet ? [0, 261] : [0, 308],
                        // Escalas conservadoras para transición suave
                        isSmallMobile
                            ? [1, 0.45]     // Small mobile
                            : isMobile
                            ? [1, 0.48]     // Mobile
                            : isTablet
                            ? [1, 0.5]      // Tablet
                            : [1, 0.42]     // Desktop
                    ),
                    willChange: 'transform'
                }}
            >
                <img
                    src={logoNonino}
                    alt="Nonino Empanadas - Empanadas artesanales San Martín de los Andes Patagonia Argentina"
                    className="w-36 min-[375px]:w-40 xs:w-52 sm:w-64 md:w-64 lg:w-64"
                    loading="eager"
                />
            </motion.div>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center">
                {/* Background Image with Parallax Effect - OPTIMIZADO CON WEBP */}
                <motion.div
                    className="absolute inset-0 w-full h-[180%] -top-[20%] md:-top-[30%] lg:-top-[40%] xl:-top-[50%] z-[-1]"
                    aria-label="Vista panorámica de San Martín de los Andes, Patagonia Argentina - Cordillera de los Andes"
                    role="img"
                    style={{
                        backgroundImage: `url(${heroImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center top",
                        y,
                        // GPU acceleration para parallax suave
                        willChange: 'transform',
                        transform: 'translate3d(0, 0, 0)',
                        backfaceVisibility: 'hidden'
                    }}
                />

                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/30" />
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
                        className="mt-40 sm:mt-48 md:mt-56 lg:mt-64"
                    >

                        <TextAnimate
                            animation="slideUp"
                            by="word"
                            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-6 sm:mb-8 px-4 sm:px-2"
                            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
                        >
                            Vas a volver
                        </TextAnimate>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto px-2"
                            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}
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
                            <Link to={sucursalSeleccionada ? "/menu" : "/pedir"} className="w-full sm:w-auto">
                                <Button size="lg" variant="shimmer" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                                    Pedir YA
                                    <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                                </Button>
                            </Link>
                            <Link to="/locales" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-white/20 border-white/30 text-white hover:bg-white/30 w-full sm:w-auto">
                                    Nuestros Locales
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Products Carousel Section */}
            {!loading && (
                <ProductsFocusCarousel
                    products={productos}
                    title="Nuestras Empanadas Más Populares"
                    className=""
                />
            )}

            {/* Separador simple entre secciones */}
            <div className="relative py-8 bg-gradient-to-b from-empanada-dark via-empanada-dark/90 to-empanada-dark/70">
                {/* Línea dorada horizontal */}
                <div className="absolute inset-x-0 top-1/2 h-1 bg-empanada-golden/60 transform -translate-y-1/2"></div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-empanada-golden/40 to-empanada-golden/60"></div>
                            <div className="relative w-12 h-12 bg-empanada-dark rounded-full flex items-center justify-center border-2 border-empanada-golden/60">
                                <svg 
                                    className="w-6 h-6 text-empanada-golden" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                                    />
                                </svg>
                            </div>
                            <div className="w-16 h-px bg-gradient-to-l from-transparent via-empanada-golden/40 to-empanada-golden/60"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
                {/* Background Image with Parallax Effect - OPTIMIZADO CON WEBP */}
                <motion.div
                    className={`absolute inset-0 w-full ${isMobile ? 'h-[220%] -top-[25%]' : 'h-[300%] -top-[40%]'}`}
                    aria-label="Bosque patagónico en San Martín de los Andes - Naturaleza Patagonia Argentina"
                    role="img"
                    style={{
                        backgroundImage: `url(${featuresImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center bottom",
                        backgroundRepeat: "no-repeat",
                        y: featuresParallaxY,
                        // GPU acceleration para parallax suave
                        willChange: 'transform',
                        transform: 'translate3d(0, 0, 0)',
                        backfaceVisibility: 'hidden'
                    }}
                />


                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-8 sm:mb-12 lg:mb-16"
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2 text-white drop-shadow-lg">
                            ¿Por qué elegir{" "}
                            <AnimatedGradientText>Nonino Empanadas</AnimatedGradientText>?
                        </h2>
                        <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto px-2 drop-shadow-md">
                            Descubri lo que nos hace únicos y por qué miles de clientes confían en nosotros
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
                                <Card className="text-center hover:shadow-lg transition-all duration-300 group h-full flex flex-col bg-white/25 backdrop-blur-xs border-white/40 shadow-2xl backdrop-brightness-110">
                                    <CardContent className="p-4 sm:p-6 flex flex-col flex-1">
                                        <div className="mb-3 sm:mb-4 flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-empanada-golden/10 rounded-full group-hover:bg-empanada-golden/20 transition-colors mx-auto">
                                            <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-empanada-golden" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
                                        <p className="text-sm sm:text-base text-foreground flex-1">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Transición entre secciones */}
            <div className="relative py-8 bg-empanada-dark">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-px bg-gradient-to-r from-transparent via-empanada-golden/20 to-empanada-golden/40"></div>
                            <div className="w-2 h-2 bg-empanada-golden/60 rounded-full"></div>
                            <div className="w-12 h-px bg-gradient-to-l from-transparent via-empanada-golden/20 to-empanada-golden/40"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-empanada-dark relative">
                {/* Decoración superior */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-empanada-golden/20 to-transparent"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-8 sm:mb-12 lg:mb-16"
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2 text-white">
                            Números que hablan por nosotros
                        </h2>
                        <p className="text-base sm:text-lg text-empanada-cream px-2">
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
                                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-center drop-shadow-lg">
                                    <NumberTicker
                                        value={stat.value}
                                        decimalPlaces={stat.decimals || 0}
                                        className="text-white"
                                    />
                                    <span className="text-empanada-golden drop-shadow-md">{stat.suffix}</span>
                                </div>
                                <p className="text-sm sm:text-base text-white font-medium px-1 text-center drop-shadow-sm">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Transición Elegante hacia CTA */}
            <div className="relative">
                {/* Gradiente de transición */}
                <div className="absolute inset-0 bg-gradient-to-b from-empanada-dark via-empanada-dark/80 to-empanada-golden/20"></div>

                {/* Separador Visual Mejorado */}
                <div className="relative py-12 sm:py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center space-x-6">
                                <div className="w-16 h-px bg-gradient-to-r from-transparent via-empanada-golden/40 to-empanada-golden/60"></div>
                                <div className="relative">
                                    <div className="w-16 h-16 bg-empanada-golden/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-empanada-golden/30">
                                        <svg
                                            className="w-8 h-8 text-empanada-golden"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="absolute inset-0 w-16 h-16 bg-empanada-golden/10 rounded-full animate-pulse"></div>
                                </div>
                                <div className="w-16 h-px bg-gradient-to-l from-transparent via-empanada-golden/40 to-empanada-golden/60"></div>
                            </div>
                        </div>

                        {/* Texto de transición */}
                        <div className="text-center mt-8">
                            <p className="text-empanada-golden/90 text-sm font-medium tracking-wide uppercase">
                                ¡Es Hora de Disfrutar!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

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
            <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-empanada-golden to-empanada-warm text-white relative">
                {/* Decoración superior */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
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
                            Hace tu pedido ahora y recibi nuestras deliciosas empanadas
                            en la comodidad de tu hogar
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                            <Link to={sucursalSeleccionada ? "/menu" : "/pedir"} className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    variant="shimmer"
                                    className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-white text-empanada-golden hover:bg-empanada-light border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                                >
                                    Pedir YA
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Floating Order Button */}
            <FloatingOrderButton />
        </div>
    );
}