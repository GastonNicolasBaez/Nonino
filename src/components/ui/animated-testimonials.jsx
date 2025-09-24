import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star } from "lucide-react";

const teamMembers = [
  {
    quote:
      "Fundé Nonino hace más de 25 años con el sueño de compartir las recetas familiares de mi abuela. Cada empanada que sale de nuestra cocina lleva mi pasión y dedicación por mantener viva esta tradición.",
    name: "Carlos Nonino",
    designation: "Fundador y Chef Principal",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop&crop=face",
  },
  {
    quote:
      "Como gerente general, me aseguro de que cada cliente reciba el mejor servicio. Coordino todos nuestros locales y mantengo los estándares de calidad que nos han caracterizado durante tantos años.",
    name: "María Nonino",
    designation: "Gerente General",
    src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&h=200&auto=format&fit=crop&crop=face",
  },
  {
    quote:
      "En la cocina central, superviso la producción diaria de miles de empanadas. Mi equipo y yo nos aseguramos de que cada masa tenga la textura perfecta y cada relleno el sabor auténtico que nos distingue.",
    name: "José Martínez",
    designation: "Chef de Producción",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop&crop=face",
  },
  {
    quote:
      "Manejo toda la logística de delivery y me aseguro de que nuestras empanadas lleguen calientes a cada hogar. La puntualidad y calidad en el servicio son mi prioridad número uno.",
    name: "Ana Morales",
    designation: "Coordinadora de Delivery",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop&crop=face",
  },
  {
    quote:
      "Como encargada del local Centro, recibo a nuestros clientes con una sonrisa y me aseguro de que vivan la experiencia Nonino completa. Conozco las preferencias de cada cliente regular.",
    name: "Laura Vega",
    designation: "Encargada Local Centro",
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop&crop=face",
  },
];

export function AnimatedTestimonials({ autoplay = false }) {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % teamMembers.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 8000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="max-w-sm md:max-w-4xl mx-auto antialiased font-sans px-4 md:px-8 lg:px-12 py-20 relative" style={{ zIndex: 1 }}>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.src}
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
                  <img
                    src={member.src}
                    alt={member.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex justify-between flex-col py-4">
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
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <div className="text-lg text-slate-500 max-w-sm mx-auto md:mx-0">
              <Quote className="h-4 w-4 text-empanada-golden inline mr-1" />
              {teamMembers[active].quote}
              <Quote className="h-4 w-4 text-empanada-golden inline ml-1 rotate-180" />
            </div>
            <div className="text-sm md:text-base font-bold text-slate-800 mt-4">
              {teamMembers[active].name}
            </div>
            <div className="text-sm text-slate-600 mt-2">
              {teamMembers[active].designation}
            </div>
          </motion.div>
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="h-7 w-7 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group/button"
            >
              <svg
                className="h-5 w-5 text-black dark:text-neutral-400 group-hover/button:rotate-12 transition-transform duration-300"
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
              className="h-7 w-7 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group/button"
            >
              <svg
                className="h-5 w-5 text-black dark:text-neutral-400 group-hover/button:-rotate-12 transition-transform duration-300"
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
    </div>
  );
}