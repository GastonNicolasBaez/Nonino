import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router";
import { ChevronRight, Star, Clock, Truck, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TextAnimate } from "@/components/ui/text-animate";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ProductCardDisplay } from "@/components/common/ProductCardDisplay";
import { FloatingOrderButton } from "@/components/common/FloatingOrderButton";
import { productService, promotionService } from "@/services/api";
import { formatPrice } from "@/lib/utils";
import { usePublicData } from "@/context/PublicDataProvider";

export function HomePage() {

    const { productos, publicLoading: loading } = usePublicData();

    const [promotions, setPromotions] = useState([]);

    // Parallax scroll effect
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 800], [0, -200]);

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
            {/* Logo animado independiente */}
            <motion.div
                className="fixed z-[9999] pointer-events-none"
                style={{
                    left: "50%",
                    top: useTransform(scrollY, [0, 200], ["18vh", "4.5rem"]),
                    x: "-50%",
                    y: "-50%",
                    scale: useTransform(scrollY, [100, 200], [1, 0.4])
                }}
            >
                <img
                    src="/src/assets/images/LogoNonino.png"
                    alt="Logo Nonino"
                    className="w-48 h-48 xs:w-56 xs:h-56 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72"
                />
            </motion.div>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image with Parallax Effect */}
                <motion.div
                    className="absolute inset-0 w-full h-[160%] -top-[30%]"
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
                        className="mt-32 sm:mt-40 md:mt-48 lg:mt-56"
                    >

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

            {/* Popular Products */}
            <section className="min-h-[70vh] bg-empanada-dark relative">
                {/* Decoración superior */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-empanada-golden/30 to-transparent"></div>
                
                {/* Split Layout */}
                <div className="relative h-[70vh]">
                    {/* Background Image - Full width on mobile, half on desktop */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="absolute inset-0 lg:w-1/2 lg:left-0"
                    >
                        <div className="relative h-full overflow-hidden">
                            <img
                                src="/src/assets/images/SanMartin2.jpg"
                                alt="Empanadas artesanales de Nonino"
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay - stronger on mobile for better text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-empanada-dark/95 via-empanada-dark/40 to-empanada-dark/20 lg:bg-gradient-to-t lg:from-empanada-dark/90 lg:via-empanada-dark/20 lg:to-transparent" />
                        </div>
                    </motion.div>

                    {/* Product List - Overlay on mobile, right side on desktop */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="relative z-10 flex flex-col h-full lg:ml-auto lg:w-1/2"
                    >
                        {/* Header */}
                        <div className="p-6 sm:p-8">
                            <div className="text-center lg:text-left mb-6">
                                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-wide mb-2">
                                    EMPANADAS POPULARES
                                </h3>
                                <div className="w-16 h-px bg-empanada-golden mx-auto lg:mx-0"></div>
                            </div>
                        </div>

                        {/* Product Slider */}
                        <div className="flex-1 px-6 sm:px-8 pb-6 sm:pb-8">
                            <div className="relative h-full">
                                {/* Slider Container */}
                                <div className="overflow-hidden h-full">
                                    <div className="space-y-3 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-empanada-golden/30 scrollbar-track-transparent">
                                        {loading ? (
                                            <div className="space-y-4">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <div key={i} className="animate-pulse">
                                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-empanada-rich/5">
                                                            <div className="w-16 h-16 bg-empanada-rich/30 rounded-full"></div>
                                                            <div className="flex-1">
                                                                <div className="bg-empanada-rich/30 h-4 rounded mb-2"></div>
                                                                <div className="bg-empanada-rich/20 h-3 rounded w-2/3"></div>
                                                            </div>
                                                            <div className="bg-empanada-rich/30 h-4 w-12 rounded"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {(productos && productos.length > 0 ? productos : [
                                                    { id: 1, name: "Empanada de Carne", description: "Carne molida con cebolla y especias", price: 450, image: "/src/assets/images/SanMartin.jpg", isPopular: true },
                                                    { id: 2, name: "Empanada de Pollo", description: "Pollo desmenuzado con verduras", price: 420, image: "/src/assets/images/SanMartin.jpg", isPopular: true },
                                                    { id: 3, name: "Empanada de Jamón y Queso", description: "Jamón cocido y queso mozzarella", price: 400, image: "/src/assets/images/SanMartin.jpg", isPopular: true },
                                                    { id: 4, name: "Empanada de Verdura", description: "Espinaca, acelga y queso", price: 380, image: "/src/assets/images/SanMartin.jpg", isPopular: true },
                                                    { id: 5, name: "Empanada de Humita", description: "Choclo cremoso con especias", price: 390, image: "/src/assets/images/SanMartin.jpg", isPopular: true },
                                                    { id: 6, name: "Empanada de Caprese", description: "Tomate, mozzarella y albahaca", price: 410, image: "/src/assets/images/SanMartin.jpg", isPopular: true },
                                                    { id: 7, name: "Empanada de Atún", description: "Atún con cebolla y huevo", price: 430, image: "/src/assets/images/SanMartin.jpg", isPopular: true },
                                                    { id: 8, name: "Empanada de Choclo", description: "Choclo dulce con crema", price: 395, image: "/src/assets/images/SanMartin.jpg", isPopular: true }
                                                ]).map((product, index) => (
                                                    <motion.div
                                                        key={product.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: 0.6 + index * 0.1 }}
                                                        className="group cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-empanada-rich/5 hover:bg-empanada-rich/10 transition-all duration-300 border border-empanada-rich/10 hover:border-empanada-golden/30">
                                                            {/* Product Image */}
                                                            <div className="relative w-14 h-12 rounded-[20px] overflow-hidden flex-shrink-0 ring-1 ring-empanada-golden/20 group-hover:ring-empanada-golden/50 transition-all duration-300 shadow-lg">
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-empanada-golden rounded-full flex items-center justify-center shadow-lg">
                                                                    <span className="text-xs font-bold text-white">★</span>
                                                                </div>
                                                            </div>

                                                            {/* Product Info */}
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-sm font-semibold text-white group-hover:text-empanada-golden transition-colors duration-300">
                                                                    {product.name.toUpperCase()}
                                                                </h4>
                                                                <p className="text-xs text-empanada-cream/80 line-clamp-1">
                                                                    {product.description}
                                                                </p>
                                                            </div>

                                                            {/* Price */}
                                                            <div className="text-right flex-shrink-0">
                                                                <span className="text-lg font-bold text-empanada-golden">
                                                                    ${product.price}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Scroll Indicator */}
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-2">
                                    <div className="w-1 h-8 bg-empanada-golden/20 rounded-full overflow-hidden">
                                        <div className="w-full h-4 bg-empanada-golden/60 rounded-full animate-pulse"></div>
                                    </div>
                                    <div className="text-empanada-golden/60 text-xs font-medium">Scroll</div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 sm:p-6 pt-0">
                            <div className="flex justify-center">
                                <Link
                                    to="/pedir"
                                    className="bg-gradient-to-r from-empanada-golden to-empanada-warm text-white px-8 py-3 rounded-xl font-semibold text-center hover:from-empanada-warm hover:to-empanada-rich transition-all duration-300 shadow-lg hover:shadow-empanada-golden/20"
                                >
                                    Ver Menú Completo →
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

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
                            Haz tu pedido ahora y recibe nuestras deliciosas empanadas
                            en la comodidad de tu hogar
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                            <Link to="/pedir" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    variant="shimmer"
                                    className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-white text-empanada-golden hover:bg-empanada-light border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                                >
                                    Pedir Ahora
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

            {/* Floating Order Button */}
            <FloatingOrderButton />
        </div>
    );
}