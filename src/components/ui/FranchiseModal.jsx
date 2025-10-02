import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Store, TrendingUp, Users, Award, Phone, Mail } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import {
  nonino_lateralBlur,
  nonino_lateral640,
  nonino_lateral1024,
  nonino_lateral1920,
  nonino_lateral2560
} from '@/assets/images/optimized';

export function FranchiseModal({ isOpen, onClose }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: -50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.95,
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

  // Animación para mobile: slide desde abajo
  const mobileModalVariants = {
    hidden: {
      opacity: 0,
      y: '100%'
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      y: '100%',
      transition: {
        duration: 0.25
      }
    }
  };

  const handleContactClick = () => {
    window.location.href = '/contacto';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal - Desktop/Tablet (≥768px) */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="hidden md:flex relative w-full max-w-4xl bg-empanada-dark rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors group"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Left Side - Image (Desktop only) */}
            <div className="hidden lg:block relative w-2/5 overflow-hidden">
              {/* Blur placeholder */}
              {nonino_lateralBlur && !isLoaded && (
                <img
                  src={nonino_lateralBlur}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'blur(20px)', transform: 'scale(1.1)', objectPosition: '40% center' }}
                  aria-hidden="true"
                />
              )}

              {/* Main responsive image */}
              <picture>
                <source
                  type="image/webp"
                  srcSet={`${nonino_lateral640} 640w, ${nonino_lateral1024} 1024w, ${nonino_lateral1920} 1920w, ${nonino_lateral2560} 2560w`}
                  sizes="40vw"
                />
                <img
                  src={nonino_lateral2560}
                  alt="Fábrica Nonino Empanadas San Martín de los Andes - Tradición artesanal patagónica"
                  className={`absolute inset-0 w-full h-full object-cover ${!isLoaded && nonino_lateralBlur ? 'opacity-0' : 'opacity-100'}`}
                  style={{ objectPosition: '40% center', transition: 'opacity 0.3s ease-in-out' }}
                  onLoad={() => setIsLoaded(true)}
                />
              </picture>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-empanada-dark"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>

            {/* Right Side - Content */}
            <div className="flex-1 p-8 lg:p-12 overflow-y-auto max-h-[90vh]">
              {/* Header Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-empanada-golden/20 rounded-full flex items-center justify-center">
                  <Store className="w-8 h-8 text-empanada-golden" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl lg:text-4xl font-bold text-empanada-golden text-center mb-3 leading-tight">
                UNITE A NUESTRA RED DE FRANQUICIAS
              </h2>

              <p className="text-gray-400 text-center mb-8 text-sm">
                Una oportunidad de negocio única en el mercado
              </p>

              {/* Benefits Grid */}
              <div className="space-y-6 mb-8">
                {/* Benefit 1 */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-empanada-golden/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-empanada-golden/20 transition-colors">
                    <Award className="w-6 h-6 text-empanada-golden" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1 text-lg">Productos Listos Para Vender</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Marca reconocida y valorada por su precio y calidad en toda la región
                    </p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-empanada-golden/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-empanada-golden/20 transition-colors">
                    <TrendingUp className="w-6 h-6 text-empanada-golden" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1 text-lg">Negocio Simple y Rentable</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Modelo de negocio probado con excelente retorno de inversión
                    </p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-empanada-golden/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-empanada-golden/20 transition-colors">
                    <Users className="w-6 h-6 text-empanada-golden" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1 text-lg">Soporte Completo</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Brindamos soporte, capacitación y acompañamiento continuo. No necesitás experiencia previa
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleContactClick}
                className="w-full py-6 text-lg font-bold bg-gradient-to-r from-empanada-golden to-empanada-warm hover:from-empanada-warm hover:to-empanada-rich text-white shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  CONTACTANOS PARA MÁS INFORMACIÓN
                </div>
              </Button>

              {/* Footer note */}
              <p className="text-gray-500 text-center mt-4 text-xs">
                Responderemos a tu consulta en menos de 24 horas
              </p>
            </div>
          </motion.div>

          {/* Modal - Mobile (<768px) */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 150 || velocity.y > 500) {
                onClose();
              }
            }}
            variants={mobileModalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden fixed inset-x-0 bottom-0 bg-empanada-dark rounded-t-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-gray-600 rounded-full"></div>
            </div>

            {/* Header Image */}
            <div className="relative h-48 overflow-hidden flex-shrink-0">
              {/* Blur placeholder */}
              {nonino_lateralBlur && !isLoaded && (
                <img
                  src={nonino_lateralBlur}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'blur(20px)', transform: 'scale(1.1)', objectPosition: '60% center' }}
                  aria-hidden="true"
                />
              )}

              {/* Main responsive image */}
              <picture>
                <source
                  type="image/webp"
                  srcSet={`${nonino_lateral640} 640w, ${nonino_lateral1024} 1024w, ${nonino_lateral1920} 1920w, ${nonino_lateral2560} 2560w`}
                  sizes="100vw"
                />
                <img
                  src={nonino_lateral2560}
                  alt="Fábrica Nonino Empanadas San Martín de los Andes - Tradición artesanal patagónica"
                  className={`absolute inset-0 w-full h-full object-cover ${!isLoaded && nonino_lateralBlur ? 'opacity-0' : 'opacity-100'}`}
                  style={{ objectPosition: '60% center', transition: 'opacity 0.3s ease-in-out' }}
                  onLoad={() => setIsLoaded(true)}
                />
              </picture>

              <div className="absolute inset-0 bg-gradient-to-t from-empanada-dark via-black/30 to-transparent"></div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Header Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-empanada-golden/20 rounded-full flex items-center justify-center">
                  <Store className="w-7 h-7 text-empanada-golden" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-empanada-golden text-center mb-2 leading-tight">
                UNITE A NUESTRA RED DE FRANQUICIAS
              </h2>

              <p className="text-gray-400 text-center mb-6 text-sm">
                Una oportunidad de negocio única
              </p>

              {/* Benefits - Compact */}
              <div className="space-y-5 mb-6">
                {/* Benefit 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-empanada-golden/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-empanada-golden" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Productos Listos</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Marca reconocida y valorada por precio y calidad
                    </p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-empanada-golden/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-empanada-golden" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Simple y Rentable</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Modelo probado con excelente retorno
                    </p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-empanada-golden/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-empanada-golden" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Soporte Completo</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Capacitación y acompañamiento. Sin experiencia previa
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleContactClick}
                className="w-full py-5 text-base font-bold bg-gradient-to-r from-empanada-golden to-empanada-warm hover:from-empanada-warm hover:to-empanada-rich text-white shadow-lg"
                size="lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  CONTACTANOS
                </div>
              </Button>

              {/* Footer note */}
              <p className="text-gray-500 text-center mt-3 text-xs mb-4">
                Responderemos en menos de 24 horas
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
