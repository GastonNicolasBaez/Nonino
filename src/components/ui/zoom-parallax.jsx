import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export function ZoomParallax({ images }) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end'],
    });

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
            <div className="sticky top-0 h-screen overflow-hidden relative">
                {images.map(({ src, alt }, index) => {
                    const scale = scales[index % scales.length];

                    return (
                        <motion.div
                            key={index}
                            style={{ scale }}
                            className={`absolute top-0 flex h-full w-full items-center justify-center
                                ${index === 1 ?
                                    'md:[&>div]:!-top-[30vh] md:[&>div]:!left-[5vw] md:[&>div]:!h-[30vh] md:[&>div]:!w-[35vw] [&>div]:!-top-[32vh] [&>div]:!left-[20vw] [&>div]:!h-[35vh] [&>div]:!w-[60vw]' : ''
                                } ${index === 2 ?
                                    'md:[&>div]:!-top-[10vh] md:[&>div]:!-left-[25vw] md:[&>div]:!h-[45vh] md:[&>div]:!w-[20vw] [&>div]:!-top-[8vh] [&>div]:!-left-[40vw] [&>div]:!h-[40vh] [&>div]:!w-[35vw]' : ''
                                } ${index === 3 ?
                                    'md:[&>div]:!-top-[1vh] md:[&>div]:!left-[27.5vw] md:[&>div]:!h-[25vh] md:[&>div]:!w-[25vw] [&>div]:!top-[-39vh] [&>div]:!left-[-30vw] [&>div]:!h-[20vh] [&>div]:!w-[35vw]' : ''
                                } ${index === 4 ?
                                    'md:[&>div]:!top-[27.5vh] md:[&>div]:!left-[5vw] md:[&>div]:!h-[25vh] md:[&>div]:!w-[20vw] [&>div]:!top-[33vh] [&>div]:!left-[24vw] [&>div]:!h-[30vh] [&>div]:!w-[40vw]' : ''
                                } ${index === 5 ?
                                    'md:[&>div]:!top-[27.5vh] md:[&>div]:!-left-[22.5vw] md:[&>div]:!h-[25vh] md:[&>div]:!w-[30vw] [&>div]:!top-[32vh] [&>div]:!-left-[24vw] [&>div]:!h-[35vh] [&>div]:!w-[45vw]' : ''
                                } ${index === 6 ?
                                    'md:[&>div]:!top-[22.5vh] md:[&>div]:!left-[25vw] md:[&>div]:!h-[15vh] md:[&>div]:!w-[15vw] [&>div]:!top-[3vh] [&>div]:!left-[38vw] [&>div]:!h-[25vh] [&>div]:!w-[35vw]' : ''
                                }`}
                        >
                            <motion.div
                                className="relative h-[25vh] w-[35vw] md:h-[25vh] md:w-[25vw]"
                                style={{
                                    filter: imageBlur
                                }}
                            >
                                <img
                                    src={src || 'https://placehold.co/400x300/f59e0b/ffffff?text=Imagen+' + (index + 1)}
                                    alt={alt || `Imagen ${index + 1}`}
                                    className="h-full w-full object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://placehold.co/400x300/f59e0b/ffffff?text=Imagen+' + (index + 1);
                                    }}
                                />
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}