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
import noninoEmpanada from '@/assets/empanada1.webp';

const PARALLAX_FACTOR = 0.4;

// Componente optimizado para imágenes de productos
const OptimizedProductImage = React.memo(({ product, onImageLoad }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Determinar la mejor fuente de imagen disponible
    // Ahora con prioridad para imágenes procesadas por el admin
    const getImageSrc = () => {
        // Priorizar imageBase64 (desde admin) o imageUrl procesadas
        if (product.imageBase64) return product.imageBase64;
        if (product.imageUrl) return product.imageUrl;
        if (product.image) return product.image;
        if (product.foto) return product.foto;
        if (product.imagen) return product.imagen;
        return noninoEmpanada;
    };

    const handleImageLoad = (e) => {
        setImageLoaded(true);
        setImageError(false);
        e.target.style.opacity = '1';
        if (onImageLoad) onImageLoad();
    };

    const handleImageError = (e) => {
        setImageError(true);
        // Intentar fuentes alternativas antes del fallback
        const currentSrc = e.target.src;

        // Intentar alternativas en orden de prioridad
        if (product.imageUrl && !currentSrc.includes(product.imageUrl)) {
            e.target.src = product.imageUrl;
            return;
        }
        if (product.image && !currentSrc.includes(product.image)) {
            e.target.src = product.image;
            return;
        }
        if (product.foto && !currentSrc.includes(product.foto)) {
            e.target.src = product.foto;
            return;
        }
        if (product.imagen && !currentSrc.includes(product.imagen)) {
            e.target.src = product.imagen;
            return;
        }

        // Fallback final
        e.target.src = noninoEmpanada;
        setImageLoaded(true);
    };

    return (
        <div className="w-full h-full relative overflow-hidden bg-gray-100">
            <img
                className={cn(
                    "w-full h-full transition-all duration-300 group-hover:scale-105",
                    // Usar object-cover por defecto, ya que las imágenes del admin ahora tienen mejor formato
                    // object-contain solo en caso de error crítico
                    imageError ? "object-contain p-1" : "object-cover object-center"
                )}
                src={getImageSrc()}
                alt={product.name || 'Producto'}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                    // Las nuevas imágenes del admin (320x240) se ven mejor con object-cover
                    minWidth: imageError ? 'auto' : '100%',
                    minHeight: imageError ? 'auto' : '100%',
                }}
            />

            {/* Loading spinner mejorado */}
            {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-3 border-empanada-golden border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-xs text-gray-500 font-medium">Cargando...</span>
                </div>
            )}

            {/* Gradient overlay para mejorar contraste del texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
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
                                    Ver en el Menú
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
        <div className="parallax-layer absolute inset-0 w-[130%] -left-[15%]">
            <OptimizedProductImage product={product} />
        </div>

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

    // Parallax effect
    const tweenParallax = useCallback((emblaApi, eventName) => {
        const engine = emblaApi.internalEngine();
        const scrollProgress = emblaApi.scrollProgress();
        const slidesInView = emblaApi.slidesInView();
        const isScrollEvent = eventName === 'scroll';

        emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
            let diffToTarget = scrollSnap - scrollProgress;
            const slidesInSnap = engine.slideRegistry[snapIndex];

            slidesInSnap.forEach((slideIndex) => {
                if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

                if (engine.options.loop) {
                    engine.slideLooper.loopPoints.forEach((loopItem) => {
                        const target = loopItem.target();

                        if (slideIndex === loopItem.index && target !== 0) {
                            const sign = Math.sign(target);

                            if (sign === -1) {
                                diffToTarget = scrollSnap - (1 + scrollProgress);
                            }
                            if (sign === 1) {
                                diffToTarget = scrollSnap + (1 - scrollProgress);
                            }
                        }
                    });
                }

                const translate = diffToTarget * (-1 * PARALLAX_FACTOR) * 100;
                const tweenNodes = emblaApi.slideNodes()[slideIndex].querySelectorAll('.parallax-layer');
                tweenNodes.forEach(tweenNode => {
                    if (tweenNode) {
                        tweenNode.style.transform = `translateX(${translate}%)`;
                    }
                });
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
                            Descubre nuestras deliciosas empanadas artesanales, preparadas con los mejores ingredientes.
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
            Ver Menú
        </Button>
    );
}