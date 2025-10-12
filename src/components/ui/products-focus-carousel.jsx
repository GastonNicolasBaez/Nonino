import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartProvider';
import { Star, Plus, Clock, Heart, ChevronLeft, ChevronRight, X, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductImage } from '@/components/ui/OptimizedImage';

const PARALLAX_FACTOR = 0.4;

// Componente optimizado para imágenes de productos - ahora usa ProductImage
const OptimizedProductImage = React.memo(({ product, onImageLoad, priority = false, context = 'default' }) => {
    return (
        <ProductImage 
            product={product} 
            priority={priority}
            context={context}
            onLoad={onImageLoad}
            className="group-hover:scale-105"
        />
    );
});

OptimizedProductImage.displayName = "OptimizedProductImage";

// Modal informativo de detalles del producto
const ProductDetailModal = ({ product, isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleViewMenu = () => {
        navigate('/pedir');
        onClose();
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.3
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            transition: {
                duration: 0.2
            }
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:hidden">
                    {/* Overlay */}
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>

                        {/* Product Image */}
                        <div className="h-64 relative overflow-hidden">
                            <OptimizedProductImage product={product} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                            {/* Product badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.isPopular && (
                                    <Badge variant="empanada" className="text-xs shadow-lg">
                                        <Star className="w-3 h-3 mr-1 fill-current" />
                                        Popular
                                    </Badge>
                                )}
                                {!product.isAvailable && (
                                    <Badge variant="destructive" className="text-xs shadow-lg">
                                        Agotado
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {product.name}
                            </h2>

                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Product Stats */}
                            <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{product.preparationTime || 15} min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span>{product.rating || 4.8}</span>
                                </div>
                            </div>

                            {/* Price Display */}
                            <div className="text-center mb-6">
                                <p className="text-3xl font-bold text-empanada-golden">
                                    {formatPrice(product.basePrice)}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Precio unitario</p>
                            </div>

                            {/* View Menu Button */}
                            <Button
                                onClick={handleViewMenu}
                                className="w-full py-3 text-base font-semibold"
                                variant="empanada"
                                size="lg"
                            >
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4" />
                                    Pedir Ya
                                </div>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// Componente de tarjeta individual con efecto focus
const ProductFocusCard = React.memo(({
    product,
    index,
    hovered,
    setHovered,
    globalIndex,
    onProductClick
}) => (
    <div
        onMouseEnter={() => setHovered(globalIndex)}
        onMouseLeave={() => setHovered(null)}
        onClick={(e) => {
            // Solo abrir modal en dispositivos móviles
            if (window.innerWidth < 768) {
                onProductClick(product);
            }
        }}
        className={cn(
            "relative overflow-hidden rounded-xl h-60 sm:h-48 md:h-64 group cursor-pointer bg-gray-100 transition-all duration-300 ease-out",
            hovered !== null && hovered !== globalIndex && "blur-sm scale-[0.98]"
        )}
    >
        <OptimizedProductImage 
            product={product} 
            context="parallax"
            className="parallax-image absolute inset-0 w-full h-full"
        />

        {/* Badges - Always visible */}
        {/* <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            {product.isPopular && (
                <Badge variant="empanada" className="text-xs shadow-lg">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Popular
                </Badge>
            )}
            {!product.isAvailable && (
                <Badge variant="destructive" className="text-xs shadow-lg">
                    Agotado
                </Badge>
            )}
        </div> */}

        {/* Focus Overlay with Product Details */}
        <div className={cn(
            "absolute inset-0 bg-black/60 flex flex-col justify-end p-3 md:p-4 z-10 transition-opacity duration-300",
            hovered === globalIndex ? "opacity-100" : "opacity-0"
        )}>
            <div className="text-white">
                <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                    {product.name}
                </h3>
                <p className="text-white/90 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center gap-3 mb-2 md:mb-3 text-xs text-white/80">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{product.preparationTime || 15} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{product.rating || 4.8}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-lg md:text-xl font-bold text-empanada-golden">
                        {formatPrice(product.basePrice)}
                    </p>
                    <ProductMenuButton product={product} />
                </div>
            </div>
        </div>
    </div>
));

ProductFocusCard.displayName = "ProductFocusCard";

export function ProductsFocusCarousel({ products = [], className = '', title = 'Nuestros Productos' }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [hovered, setHovered] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [emblaMainRef, emblaMainApi] = useEmblaCarousel({
        loop: true,
        dragFree: false,
        containScroll: false,
        align: 'start',
        skipSnaps: false,
        slidesToScroll: 1
    });

    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: 'keepSnaps',
        dragFree: true
    });

    const handleProductClick = useCallback((product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    }, []);

    if (!products || products.length === 0) {
        return null;
    }


    // Crear columnas de productos (cada columna = 2 productos apilados)
    const columns = [];
    for (let i = 0; i < products.length; i += 2) {
        const topProduct = products[i];
        const bottomProduct = products[i + 1] || null; // Puede ser null si es impar
        columns.push({ top: topProduct, bottom: bottomProduct });
    }

    const onNavButtonClick = useCallback((emblaApi) => {
        const autoScroll = emblaApi?.plugins()?.autoScroll;
        if (!autoScroll) return;
        const resetOrStop = autoScroll.options.stopOnInteraction === false
            ? autoScroll.reset
            : autoScroll.stop;
        resetOrStop();
    }, []);

    const onPrevButtonClick = useCallback(() => {
        if (!emblaMainApi) return;
        emblaMainApi.scrollPrev();
        onNavButtonClick(emblaMainApi);
    }, [emblaMainApi, onNavButtonClick]);

    const onNextButtonClick = useCallback(() => {
        if (!emblaMainApi) return;
        emblaMainApi.scrollNext();
        onNavButtonClick(emblaMainApi);
    }, [emblaMainApi, onNavButtonClick]);

    const onThumbClick = useCallback((index) => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        emblaMainApi.scrollTo(index);
    }, [emblaMainApi, emblaThumbsApi]);

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        setSelectedIndex(emblaMainApi.selectedScrollSnap());
        emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
    }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

    useEffect(() => {
        if (!emblaMainApi) return;
        onSelect();
        emblaMainApi.on('select', onSelect);
        emblaMainApi.on('reInit', onSelect);
    }, [emblaMainApi, onSelect]);

    // Parallax effect simplificado - siempre activo
    const tweenParallax = useCallback((emblaApi, eventName) => {
        const slides = emblaApi.slideNodes();
        
        slides.forEach((slide, slideIndex) => {
            const tweenNodes = slide.querySelectorAll('.parallax-image img');
            
            tweenNodes.forEach(tweenNode => {
                if (tweenNode) {
                    // Parallax basado en posición del slide
                    const slidePosition = slideIndex;
                    const totalSlides = slides.length;
                    const progress = slidePosition / Math.max(totalSlides - 1, 1);
                    
                    // Crear movimiento parallax basado en progreso
                    const translate = (progress - 0.5) * 20; // -10% a +10%
                    
                    // Aplicar transform con scale y translateX
                    tweenNode.style.transform = `scale(1.2) translateX(${translate}%)`;
                }
            });
        });
    }, []);

    useEffect(() => {
        if (!emblaMainApi) return;


        emblaMainApi.on('reInit', tweenParallax).on('scroll', tweenParallax);
        tweenParallax(emblaMainApi);
    }, [emblaMainApi, tweenParallax]);

    return (
        <section className={`py-8 md:py-16 relative ${className}`} style={{ backgroundColor: 'rgb(26, 26, 26)' }}>
            <div className="container mx-auto px-4">
                {/* Title */}
                {title && (
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                            {title}
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
                            Descubri nuestras deliciosas empanadas artesanales, preparadas con los mejores ingredientes.
                        </p>
                    </div>
                )}

                {/* Carousel Container */}
                <div className="relative">
                    {/* Left fade gradient */}
                    <div className="hidden md:block absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, rgb(26, 26, 26), transparent)' }}></div>

                    {/* Right fade gradient */}
                    <div className="hidden md:block absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, rgb(26, 26, 26), transparent)' }}></div>

                    {/* Navigation Buttons */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden md:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-[15] bg-white hover:bg-gray-50 shadow-lg border-gray-200 rounded-full w-10 h-10 md:w-12 md:h-12"
                        onClick={onPrevButtonClick}
                    >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden md:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-[15] bg-white hover:bg-gray-50 shadow-lg border-gray-200 rounded-full w-10 h-10 md:w-12 md:h-12"
                        onClick={onNextButtonClick}
                    >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                    </Button>

                    {/* Main Carousel Viewport */}
                    <div className="overflow-hidden" ref={emblaMainRef}>
                        <div className="flex">
                            {columns.map((column, columnIndex) => (
                                <div
                                    key={columnIndex}
                                    className="relative flex-[0_0_50%] md:flex-[0_0_33.333%] min-w-0 px-2"
                                >
                                    {/* Columna con 2 productos apilados */}
                                    <div className="space-y-3">
                                        {/* Producto superior */}
                                        <ProductFocusCard
                                            product={column.top}
                                            index={columnIndex * 2}
                                            hovered={hovered}
                                            setHovered={setHovered}
                                            globalIndex={columnIndex * 2}
                                            onProductClick={handleProductClick}
                                        />

                                        {/* Producto inferior (si existe) */}
                                        {column.bottom && (
                                            <ProductFocusCard
                                                product={column.bottom}
                                                index={columnIndex * 2 + 1}
                                                hovered={hovered}
                                                setHovered={setHovered}
                                                globalIndex={columnIndex * 2 + 1}
                                                onProductClick={handleProductClick}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Thumb Indicators */}
                    <div className="mt-8">
                        <div className="overflow-hidden" ref={emblaThumbsRef}>
                            <div className="flex gap-2 justify-center">
                                {columns.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedIndex
                                                ? 'bg-empanada-golden scale-125'
                                                : 'bg-gray-500 hover:bg-gray-400'
                                            }`}
                                        onClick={() => onThumbClick(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de detalles del producto */}
            <ProductDetailModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </section>
    );
}

function ProductMenuButton({ product }) {
    const navigate = useNavigate();

    const handleViewMenu = () => {
        navigate('/pedir');
    };

    return (
        <Button
            size="sm"
            variant="empanada"
            onClick={handleViewMenu}
            className="shadow-lg"
        >
            Pedir Ya
        </Button>
    );
}