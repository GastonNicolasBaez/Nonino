import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  somosBlur, somos640, somos1024, somos1920, somos2560,
  somos2Blur, somos2640, somos21024, somos21920, somos22560,
  somos3Blur, somos3640, somos31024, somos31920, somos32560
} from "@/assets/images/optimized";

const teamMembers = [
  {
    name: "ELI",
    designation: "Encargada de la Sucursal Villegas",
    src: somos2560,
    srcSet: `${somos640} 640w, ${somos1024} 1024w, ${somos1920} 1920w, ${somos2560} 2560w`,
    blurDataURL: somosBlur,
  },
  {
    name: "ORLANDO",
    designation: "Encargado de Fábrica",
    src: somos22560,
    srcSet: `${somos2640} 640w, ${somos21024} 1024w, ${somos21920} 1920w, ${somos22560} 2560w`,
    blurDataURL: somos2Blur,
  },
  {
    name: "DAVID Y CATERINA",
    designation: "Encargado de la sucursal El Molino y encargada de Despacho",
    src: somos32560,
    srcSet: `${somos3640} 640w, ${somos31024} 1024w, ${somos31920} 1920w, ${somos32560} 2560w`,
    blurDataURL: somos3Blur,
  },

  
];

export function AnimatedTestimonials({ autoplay = false }) {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  const handleNext = () => {
    setActive((prev) => (prev + 1) % teamMembers.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 8000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  // Funciones para manejar swipe/touch
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <div className="max-w-sm md:max-w-3xl mx-auto antialiased font-sans px-4 md:px-8 lg:px-12 py-12 relative" style={{ zIndex: 1 }}>
      <div className="relative flex flex-col items-center">
        <div className="w-full max-w-md">
          <div
            className="relative h-96 w-full"
            onTouchStart={isMobile ? onTouchStart : undefined}
            onTouchMove={isMobile ? onTouchMove : undefined}
            onTouchEnd={isMobile ? onTouchEnd : undefined}
          >
            <AnimatePresence>
              {teamMembers.map((member, index) => (
                <motion.div
                  key={`${member.name}-${index}`}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index) ? 10 : teamMembers.length + 2 - index,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  {/* Blur placeholder */}
                  {member.blurDataURL && !loadedImages[index] && (
                    <img
                      src={member.blurDataURL}
                      alt=""
                      className="absolute inset-0 h-full w-full rounded-3xl object-cover"
                      style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Main responsive image */}
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={member.srcSet || `${member.src} 2560w`}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <img
                      src={member.src}
                      alt={member.name}
                      width={500}
                      height={500}
                      draggable={false}
                      className={`h-full w-full rounded-3xl object-cover object-center ${!loadedImages[index] && member.blurDataURL ? 'opacity-0' : 'opacity-100'}`}
                      style={{ transition: 'opacity 0.3s ease-in-out' }}
                      onLoad={() => {
                        setLoadedImages(prev => ({ ...prev, [index]: true }));
                      }}
                    />
                  </picture>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Información del miembro del equipo - Centrada debajo de la imagen */}
        <motion.div
          key={active}
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: -20,
            opacity: 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="text-center mt-8 mb-6"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {teamMembers[active].name}
          </h3>
          <p className="text-base md:text-lg text-empanada-golden font-medium">
            {teamMembers[active].designation}
          </p>
        </motion.div>

        {/* Controles de navegación - Centrados */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handlePrev}
            className="h-10 w-10 rounded-full bg-empanada-medium hover:bg-empanada-golden/20 border border-empanada-golden/30 flex items-center justify-center group/button transition-all"
          >
            <svg
              className="h-5 w-5 text-empanada-golden group-hover/button:rotate-12 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="h-10 w-10 rounded-full bg-empanada-medium hover:bg-empanada-golden/20 border border-empanada-golden/30 flex items-center justify-center group/button transition-all"
          >
            <svg
              className="h-5 w-5 text-empanada-golden group-hover/button:-rotate-12 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}