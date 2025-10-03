import { useScroll, useTransform, useMotionValue, motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export function ZoomParallax({ images }) {
    const container = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [loadedImages, setLoadedImages] = useState({});
    const firstImgRef = useRef(null);
    // Progreso de scroll controlado manualmente (fallback robusto)
    const manualScrollProgress = useMotionValue(0);

    // Usar el scroll del viewport (framer) y un fallback manual
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    });

    // Sincronizar un valor manual con el scroll real del contenedor
    useEffect(() => {
        const clamp = (v) => Math.max(0, Math.min(1, v));
        let rafId = 0;
        let rafWarmup = 0;
        let warmupActive = true;
        const getScrollableAncestor = (el) => {
            let node = el && el.parentElement;
            while (node && node !== document.body) {
                const style = window.getComputedStyle(node);
                const overflowY = style.overflowY;
                if (overflowY === 'auto' || overflowY === 'scroll') {
                    return node;
                }
                node = node.parentElement;
            }
            return null;
        };
        const update = () => {
            if (!container.current) return;
            const rect = container.current.getBoundingClientRect();
            const vh = window.innerHeight || 0;
            const total = Math.max(1, rect.height - vh);
            const progress = clamp((0 - rect.top) / total);
            manualScrollProgress.set(progress);
        };
        const onScroll = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(update);
        };
        const onResize = onScroll;
        // Inicial
        requestAnimationFrame(update);
        // Warmup: varios frames para asegurar cálculo inicial estable
        const warmup = () => {
            if (!warmupActive) return;
            update();
            rafWarmup = requestAnimationFrame(warmup);
        };
        rafWarmup = requestAnimationFrame(warmup);
        const opts = { passive: true };
        window.addEventListener('scroll', onScroll, opts);
        window.addEventListener('resize', onResize, opts);
        window.addEventListener('orientationchange', onResize, opts);
        document.addEventListener('visibilitychange', update);
        document.addEventListener('scroll', onScroll, opts);
        // Si existe un ancestro scrolleable (layouts con overflow-auto), escuchar allí también
        const scrollableAncestor = getScrollableAncestor(container.current);
        if (scrollableAncestor) {
            scrollableAncestor.addEventListener('scroll', onScroll, opts);
        }
        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            if (rafWarmup) cancelAnimationFrame(rafWarmup);
            warmupActive = false;
            window.removeEventListener('scroll', onScroll, opts);
            window.removeEventListener('resize', onResize, opts);
            window.removeEventListener('orientationchange', onResize, opts);
            document.removeEventListener('visibilitychange', update);
            document.removeEventListener('scroll', onScroll, opts);
            if (scrollableAncestor) {
                scrollableAncestor.removeEventListener('scroll', onScroll, opts);
            }
        };
    }, [manualScrollProgress]);

    // Detectar si es dispositivo móvil
    useEffect(() => {
        const checkBreakpoints = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsSmallScreen(width < 1024); // móvil y tablet
        };

        checkBreakpoints();
        window.addEventListener('resize', checkBreakpoints);

        return () => window.removeEventListener('resize', checkBreakpoints);
    }, []);

    // No forzar remount global aquí; refrescaremos al cargar imágenes
    // Asegurar que los observers de scroll se activen en el primer ingreso
    useEffect(() => {
        const nudge = () => {
            const y = (window.pageYOffset || window.scrollY || 0);
            window.scrollTo(0, Math.max(0, y + 1));
            window.scrollTo(0, Math.max(0, y));
            window.dispatchEvent(new Event('scroll'));
        };

        const raf = requestAnimationFrame(nudge);
        const t = setTimeout(nudge, 0);
        window.addEventListener('load', nudge, { once: true });
        document.addEventListener('visibilitychange', nudge);

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(t);
            document.removeEventListener('visibilitychange', nudge);
        };
    }, []);

    // Habilitar zoom para elementos interactivos del parallax
    useEffect(() => {
        const handleParallaxInteraction = (e) => {
            const target = e.target;
            const isInteractiveImage = target.closest('.interactive-image');
            
            if (isInteractiveImage) {
                // Encontrarse en el parallax y es interactivo
                if (window.enableZoom) {
                    window.enableZoom();
                }
                
                // Añadir listener para detectar salida del parallax
                const handleParallaxExit = () => {
                    if (!target.closest('.zoom-parallax-container')) {
                        if (window.disableZoom) {
                            window.disableZoom();
                        }
                        document.removeEventListener('touchmove', handleParallaxExit);
                        document.removeEventListener('touchend', handleParallaxExit);
                    }
                };
                
                document.addEventListener('touchmove', handleParallaxExit, { passive: true });
                document.addEventListener('touchend', handleParallaxExit, { passive: true });
            }
        };

        document.addEventListener('touchstart', handleParallaxInteraction, { passive: true });
        
        return () => {
            document.removeEventListener('touchstart', handleParallaxInteraction);
        };
    }, []);

    // Si la primera imagen ya está cacheada, marcarla como cargada y notificar scroll
    useEffect(() => {
        const img = firstImgRef.current;
        if (img && img.complete) {
            setLoadedImages(prev => ({ ...prev, 0: true }));
            requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));
        }
    }, []);

    // Títulos y navegación para las imágenes interactivas
    const imageNavigation = {
        0: { title: "Conocenos", targetId: "end-parallax" },
        1: { title: "La Historia de Don Carlos", targetId: "historia" },
        2: { title: "Nuestros Valores", targetId: "valores" },
        3: { title: "Nuestro Equipo", targetId: "equipo" },
        4: { title: "Nuestra Trayectoria", targetId: "trayectoria" }
    };

    // Función para navegar a una sección específica
    const navigateToSection = (targetId) => {
        const element = document.getElementById(targetId);
        if (element) {
            const headerHeight = 80; // Altura del navbar fijo (16/20 = 64px/80px)
            const elementPosition = element.offsetTop - headerHeight;
            // Si vamos al final del parallax, detenemos un poco antes para que el título quede completo
            const adjust = targetId === 'end-parallax' ? Math.round((window.innerHeight || 0) * 0.35) : 0;

            window.scrollTo({
                top: Math.max(0, elementPosition - adjust),
                behavior: 'smooth'
            });
            // Notificar para recalcular transformaciones
            requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));
        }
    };

    // Función para manejar interacción específica por índice
    const handleImageClick = (index) => {
        // En mobile, solo la imagen 0 es clickable
        if (isMobile) {
            if (index === 0) {
                navigateToSection("end-parallax");
            }
            return;
        }

        // En desktop, todas las imágenes con navegación funcionan
        if (imageNavigation[index]) {
            navigateToSection(imageNavigation[index].targetId);
        }
    };

    // Determinar si una imagen debe ser interactiva
    const isImageInteractive = (index) => {
        if (isMobile) {
            return index === 0; // Solo imagen 0 en mobile
        }
        return imageNavigation[index] !== undefined; // Todas las navegables en desktop
    };

   // Escalas más conservadoras en móvil para mejor performance
    const sourceProgress = manualScrollProgress; // usar valor manual robusto
    const scale4 = useTransform(sourceProgress, [0, 1], isMobile ? [1, 3] : [1, 4]);
    const scale5 = useTransform(sourceProgress, [0, 1], isMobile ? [1, 3.5] : [1, 5]);
    const scale6 = useTransform(sourceProgress, [0, 1], isMobile ? [1, 4] : [1, 6]);
    const scale8 = useTransform(sourceProgress, [0, 1], isMobile ? [1, 5] : [1, 8]);
    const scale9 = useTransform(sourceProgress, [0, 1], isMobile ? [1, 5.5] : [1, 9]);

    // Transformación del degradado según el scroll
    const gradientOpacity = useTransform(
        sourceProgress,
        // En mobile, retrasamos el inicio del fade un 20% del scroll (0.5 -> 0.7)
        isMobile ? [0, 0.7, 1] : [0, 0.5, 1],
        isMobile ? [0.6, 0.55, 0] : [0.8, 0.6, 0.3]
    );

    // Nota: no desvanecemos el contenedor en mobile para evitar pantalla vacía

    // Transformación del difuminado de las imágenes según el zoom
    const imageBlur = useTransform(
        sourceProgress,
        [0, 0.3, 0.8, 1],
        isMobile ?
            ["blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"] :
            ["blur(0px)", "blur(0px)", "blur(2px)", "blur(3px)"]
    );

    const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

    return (
        <div ref={container} className={`relative zoom-parallax-container ${isMobile ? 'min-h-[210vh]' : 'min-h-[310vh]'} pb-0 bg-gradient-to-b from-black via-empanada-darker via-empanada-dark to-empanada-medium`}>
            {/* Degradado dinámico superpuesto que evoluciona con el scroll */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-empanada-darker/60 via-empanada-dark/40 to-transparent"
                style={{ opacity: gradientOpacity }}
            />
            {/* Degradado de transición para el final (extendido para cubrir uniones) */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-empanada-medium to-transparent pointer-events-none"></div>
            <div className={`sticky top-0 h-screen overflow-hidden relative ${isSmallScreen ? 'z-0' : ''} lg:z-auto`} style={{ transform: 'translateY(0)' }}>
                {images.map(({ src, srcSet, blurDataURL, alt, quality, priority }, index) => {
                    const scale = scales[index % scales.length];
                    const isLoaded = loadedImages[index];

                    return (
                        <motion.div
                            key={index}
                            style={{
                                scale,
                                // Optimizaciones para móvil
                                ...(isMobile && {
                                    willChange: 'transform',
                                    backfaceVisibility: 'hidden',
                                    perspective: 1000
                                })
                             }}
                            className={`absolute top-0 flex h-full w-full items-center justify-center
                                ${index === 0 ?
                                    'md:[&>div]:!-top-[0vh] md:[&>div]:!left-[0vw] md:[&>div]:!h-[35vh] md:[&>div]:!w-[35vw] [&>div]:!-top-[1vh] [&>div]:!left-[0vw] [&>div]:!h-[36vh] [&>div]:!w-[38vw]' : ''
                                } ${index === 1 ?
                                    'md:[&>div]:!-top-[35vh] md:[&>div]:!left-[15vw] md:[&>div]:!h-[30vh] md:[&>div]:!w-[65vw] [&>div]:!-top-[33vh] [&>div]:!left-[20vw] [&>div]:!h-[26vh] [&>div]:!w-[60vw]' : ''
                                } ${index === 2 ?
                                    'md:[&>div]:!-top-[20vh] md:[&>div]:!-left-[39vw] md:[&>div]:!h-[55vh] md:[&>div]:!w-[40vw] [&>div]:!-top-[8vh] [&>div]:!-left-[40vw] [&>div]:!h-[40vh] [&>div]:!w-[35vw]' : ''
                                } ${index === 3 ?
                                    'md:[&>div]:!-top-[2vh] md:[&>div]:!left-[37vw] md:[&>div]:!h-[32vh] md:[&>div]:!w-[35vw] [&>div]:!top-[-39vh] [&>div]:!left-[-30vw] [&>div]:!h-[20vh] [&>div]:!w-[36vw]' : ''
                                } ${index === 4 ?
                                    'md:[&>div]:!top-[36vh] md:[&>div]:!left-[9vw] md:[&>div]:!h-[34vh] md:[&>div]:!w-[50vw] [&>div]:!top-[33vh] [&>div]:!left-[24vw] [&>div]:!h-[32vh] [&>div]:!w-[44vw]' : ''
                                } ${index === 5 ?
                                    'md:[&>div]:!top-[30vh] md:[&>div]:!-left-[34vw] md:[&>div]:!h-[40vh] md:[&>div]:!w-[32vw] [&>div]:!top-[32vh] [&>div]:!-left-[24vw] [&>div]:!h-[30vh] [&>div]:!w-[45vw]' : ''
                                } ${index === 6 ?
                                    'md:[&>div]:!top-[35vh] md:[&>div]:!left-[43vw] md:[&>div]:!h-[40vh] md:[&>div]:!w-[15vw] [&>div]:!top-[1vh] [&>div]:!left-[38vw] [&>div]:!h-[29vh] [&>div]:!w-[35vw]' : ''
                                }`}
                        >
                            <motion.div
                                className={`relative h-[25vh] w-[35vw] md:h-[25vh] md:w-[25vw] group ${
                                    isImageInteractive(index) ? `${isSmallScreen ? 'cursor-pointer z-0' : 'cursor-pointer z-10'} touch-manipulation` : 'z-0'
                                }`}
                                style={{
                                    filter: index === 6 ? "blur(0px)" : imageBlur,
                                    // Optimizaciones de calidad para imágenes escaladas
                                    ...(quality === 'high' && {
                                        imageRendering: 'high-quality',
                                        imageRendering: '-webkit-optimize-contrast',
                                        backfaceVisibility: 'hidden',
                                        transform: 'translateZ(0)'
                                    })
                                }}
                                onClick={isImageInteractive(index) ? () => handleImageClick(index) : undefined}
                                onTouchStart={isImageInteractive(index) ? (e) => {
                                    e.preventDefault();
                                    handleImageClick(index);
                                } : undefined}
                            >
                                {/* Blur placeholder */}
                                {blurDataURL && !isLoaded && (
                                    <img
                                        src={blurDataURL}
                                        alt=""
                                        className="absolute inset-0 h-full w-full object-cover rounded-lg"
                                        style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
                                        aria-hidden="true"
                                    />
                                )}

                                {/* Main responsive image */}
                                <picture>
                                    <source
                                        type="image/webp"
                                        srcSet={srcSet || `${src} 2560w`}
                                        sizes="(max-width: 768px) 35vw, (max-width: 1024px) 50vw, 100vw"
                                    />
                                    <img
                                        src={src || 'https://placehold.co/400x300/f59e0b/ffffff?text=Imagen+' + (index + 1)}
                                        alt={alt || `Imagen ${index + 1}`}
                                        className={`interactive-image h-full w-full object-cover rounded-lg ${
                                            isMobile ?
                                                "transition-none" : // Sin transiciones en móvil
                                                "transition-all duration-300 group-hover:brightness-75"
                                        } ${!isLoaded && blurDataURL ? 'opacity-0' : 'opacity-100'}`}
                                        loading={index === 0 || priority ? "eager" : "lazy"}
                                        decoding={index === 0 || priority ? "sync" : "async"}
                                        fetchpriority={index === 0 || priority ? "high" : undefined}
                                        style={{
                                            // Optimizaciones adicionales para móvil
                                            ...(isMobile && {
                                                willChange: 'auto',
                                                transform: 'translateZ(0)' // Force hardware acceleration
                                            }),
                                            // Optimizaciones de calidad para desktop
                                            ...(!isMobile && {
                                                imageRendering: 'high-quality',
                                                imageRendering: '-webkit-optimize-contrast',
                                                imageRendering: 'crisp-edges'
                                            }),
                                            transition: 'opacity 0.3s ease-in-out'
                                        }}
                                        ref={index === 0 ? firstImgRef : undefined}
                                        onLoad={() => {
                                            setLoadedImages(prev => ({ ...prev, [index]: true }));
                                            // Al cargar la primera imagen, forzar un refresh del scroll
                                            if (index === 0) {
                                                requestAnimationFrame(() => {
                                                    window.dispatchEvent(new Event('scroll'));
                                                });
                                            }
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/400x300/f59e0b/ffffff?text=Imagen+' + (index + 1);
                                        }}
                                    />
                                </picture>

                                {/* Overlay con título al hover */}
                                {isImageInteractive(index) && (
                                    <div className={`absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all ${isSmallScreen ? 'duration-[1800ms] ease-out' : 'duration-300'} rounded-lg flex items-center justify-center ${isSmallScreen ? 'z-10' : 'z-20'} ${index === 6 ? '' : 'backdrop-blur-sm'}`}>
                                        <div className={`text-center text-white px-4 transform translate-y-2 group-hover:translate-y-0 transition-transform ${isSmallScreen ? 'duration-[700ms] ease-out' : 'duration-300'}`}>
                                            <h3 className="text-xs md:text-base lg:text-lg font-bold mb-1 md:mb-2 text-empanada-golden">
                                                {isMobile && index === 0 ? "Nuestra Historia" : imageNavigation[index]?.title}
                                            </h3>
                                            <p className="text-[10px] md:text-xs lg:text-sm opacity-90">
                                                {isMobile ? "Toca para navegar" : "Click para navegar"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}