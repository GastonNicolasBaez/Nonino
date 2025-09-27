import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export function ZoomParallax({ images }) {
    const container = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end'],
        // En móvil, usar document.body como fuente de scroll
        container: isMobile ? { current: document.body } : undefined
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

    // Títulos y navegación para las imágenes interactivas
    const imageNavigation = {
        0: { title: "Conocenos", targetId: "end-parallax" },
        1: { title: "La Historia de Don Carlos", targetId: "historia" },
        2: { title: "Nuestros Valores", targetId: "valores" },
        4: { title: "Nuestra Trayectoria", targetId: "trayectoria" },
        6: { title: "Nuestro Equipo", targetId: "equipo" }
    };

    // Función para navegar a una sección específica
    const navigateToSection = (targetId) => {
        const element = document.getElementById(targetId);
        if (element) {
            const headerHeight = 80; // Altura del navbar fijo (16/20 = 64px/80px)
            const elementPosition = element.offsetTop - headerHeight;

            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
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

    const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
    const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
    const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
    const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
    const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

    // Transformación del degradado según el scroll
    const gradientOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 0.6, 0.3]);

    // Transformación del difuminado de las imágenes según el zoom
    const imageBlur = useTransform(
        scrollYProgress,
        [0, 0.3, 0.8, 1],
        ["blur(0px)", "blur(0px)", "blur(2px)", "blur(3px)"]
    );

    const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

    return (
        <div ref={container} className="relative h-[300vh] bg-gradient-to-b from-empanada-golden via-empanada-warm to-empanada-cream">
            {/* Degradado dinámico superpuesto que evoluciona con el scroll */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-empanada-dark/60 via-empanada-rich/40 to-transparent"
                style={{ opacity: gradientOpacity }}
            />
            {/* Degradado de transición para el final */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-empanada-cream to-transparent"></div>
            <div className="sticky top-0 h-screen overflow-hidden relative" style={{ transform: 'translateY(0)' }}>
                {images.map(({ src, alt }, index) => {
                    const scale = scales[index % scales.length];

                    return (
                        <motion.div
                            key={index}
                            style={{ scale }}
                            className={`absolute top-0 flex h-full w-full items-center justify-center
                                ${index === 0 ?
                                    'md:[&>div]:!-top-[0vh] md:[&>div]:!left-[0vw] md:[&>div]:!h-[35vh] md:[&>div]:!w-[35vw] [&>div]:!-top-[0vh] [&>div]:!left-[0vw] [&>div]:!h-[27vh] [&>div]:!w-[38vw]' : ''
                                } ${index === 1 ?
                                    'md:[&>div]:!-top-[35vh] md:[&>div]:!left-[15vw] md:[&>div]:!h-[30vh] md:[&>div]:!w-[65vw] [&>div]:!-top-[32vh] [&>div]:!left-[20vw] [&>div]:!h-[35vh] [&>div]:!w-[60vw]' : ''
                                } ${index === 2 ?
                                    'md:[&>div]:!-top-[20vh] md:[&>div]:!-left-[39vw] md:[&>div]:!h-[55vh] md:[&>div]:!w-[40vw] [&>div]:!-top-[8vh] [&>div]:!-left-[40vw] [&>div]:!h-[40vh] [&>div]:!w-[35vw]' : ''
                                } ${index === 3 ?
                                    'md:[&>div]:!-top-[2vh] md:[&>div]:!left-[37vw] md:[&>div]:!h-[32vh] md:[&>div]:!w-[35vw] [&>div]:!top-[-39vh] [&>div]:!left-[-30vw] [&>div]:!h-[20vh] [&>div]:!w-[35vw]' : ''
                                } ${index === 4 ?
                                    'md:[&>div]:!top-[31vh] md:[&>div]:!left-[9vw] md:[&>div]:!h-[25vh] md:[&>div]:!w-[50vw] [&>div]:!top-[33vh] [&>div]:!left-[24vw] [&>div]:!h-[33vh] [&>div]:!w-[44vw]' : ''
                                } ${index === 5 ?
                                    'md:[&>div]:!top-[30vh] md:[&>div]:!-left-[33vw] md:[&>div]:!h-[40vh] md:[&>div]:!w-[30vw] [&>div]:!top-[32vh] [&>div]:!-left-[24vw] [&>div]:!h-[35vh] [&>div]:!w-[45vw]' : ''
                                } ${index === 6 ?
                                    'md:[&>div]:!top-[26vh] md:[&>div]:!left-[43vw] md:[&>div]:!h-[20vh] md:[&>div]:!w-[15vw] [&>div]:!top-[3vh] [&>div]:!left-[38vw] [&>div]:!h-[25vh] [&>div]:!w-[35vw]' : ''
                                }`}
                        >
                            <motion.div
                                className={`relative h-[25vh] w-[35vw] md:h-[25vh] md:w-[25vw] group ${
                                    isImageInteractive(index) ? 'cursor-pointer z-10 touch-manipulation' : 'z-0'
                                }`}
                                style={{
                                    filter: imageBlur
                                }}
                                onClick={isImageInteractive(index) ? () => handleImageClick(index) : undefined}
                                onTouchStart={isImageInteractive(index) ? (e) => {
                                    e.preventDefault();
                                    handleImageClick(index);
                                } : undefined}
                            >
                                <img
                                    src={src || 'https://placehold.co/400x300/f59e0b/ffffff?text=Imagen+' + (index + 1)}
                                    alt={alt || `Imagen ${index + 1}`}
                                    className="h-full w-full object-cover rounded-lg transition-all duration-300 group-hover:brightness-75"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://placehold.co/400x300/f59e0b/ffffff?text=Imagen+' + (index + 1);
                                    }}
                                />
                                {/* Overlay con título al hover */}
                                {isImageInteractive(index) && (
                                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg flex items-center justify-center z-20 backdrop-blur-sm">
                                        <div className="text-center text-white px-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
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