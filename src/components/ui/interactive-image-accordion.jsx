import React, { useState } from 'react';
import { MapPin, Clock, Phone, Factory, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import { WordPullUp } from './word-pull-up';

// --- Data for the empanadas locations accordion ---
const accordionItems = [
  {
    id: 1,
    title: 'Local Centro',
    type: 'store',
    address: 'Av. San Martín 1234, Centro',
    phone: '(011) 4444-5555',
    hours: 'Lun a Dom: 11:00 - 23:00',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop',
    description: 'Nuestro local principal en el corazón de la ciudad'
  },
  {
    id: 2,
    title: 'Local Palermo',
    type: 'store',
    address: 'Av. Santa Fe 2567, Palermo',
    phone: '(011) 4444-6666',
    hours: 'Lun a Dom: 12:00 - 00:00',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop',
    description: 'Ambiente moderno en el barrio más trendy'
  },
  {
    id: 3,
    title: 'Local Belgrano',
    type: 'store',
    address: 'Av. Cabildo 3456, Belgrano',
    phone: '(011) 4444-7777',
    hours: 'Lun a Dom: 11:30 - 23:30',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
    description: 'Tradición familiar en zona norte'
  },
  {
    id: 4,
    title: 'Fábrica Nonino',
    type: 'factory',
    address: 'Parque Industrial Norte, Lote 45',
    phone: '(011) 4444-8888',
    hours: 'Lun a Vie: 06:00 - 18:00',
    imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2070&auto=format&fit=crop',
    description: 'Centro de producción con más de 25 años de experiencia'
  },
  {
    id: 5,
    title: 'Próximamente',
    type: 'coming_soon',
    address: 'Próxima apertura',
    phone: 'Información pronto',
    hours: 'Muy pronto',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop',
    description: 'Estamos trabajando en una nueva sorpresa para ti'
  },
];

// --- Accordion Item Component ---
const AccordionItem = ({ item, isActive, onMouseEnter }) => {
  return (
    <div
      className={cn(
        "relative h-[450px] rounded-2xl overflow-hidden cursor-pointer group",
        "transition-all duration-700 ease-in-out",
        "shadow-lg hover:shadow-xl",
        isActive ? "w-[400px]" : "w-[80px]"
      )}
      onMouseEnter={onMouseEnter}
    >
      {/* Background Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/400x450/f59e0b/ffffff?text=Nonino+Empanadas';
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

      {/* Factory/Store/Coming Soon icon overlay */}
      <div className={cn(
        "absolute top-4 right-4 p-2 rounded-full transition-all duration-300",
        item.type === 'factory'
          ? "bg-empanada-golden/90 text-white"
          : item.type === 'coming_soon'
          ? "bg-gray-500/90 text-white"
          : "bg-white/90 text-empanada-golden"
      )}>
        {item.type === 'factory' ? (
          <Factory className="w-5 h-5" />
        ) : item.type === 'coming_soon' ? (
          <Calendar className="w-5 h-5" />
        ) : (
          <MapPin className="w-5 h-5" />
        )}
      </div>

      {/* Content - appears when active */}
      {isActive && (
        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
          <div className="transform transition-all duration-500 translate-y-0 opacity-100">
            <h3 className="text-2xl font-bold mb-2 text-empanada-golden">
              {item.title}
            </h3>

            <p className="text-sm mb-4 text-gray-200">
              {item.description}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-empanada-golden flex-shrink-0" />
                <span className="text-gray-200">{item.address}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-empanada-golden flex-shrink-0" />
                <span className="text-gray-200">{item.hours}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-empanada-golden flex-shrink-0" />
                <span className="text-gray-200">{item.phone}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Title - vertical when inactive */}
      {!isActive && (
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: '60px' // Posición fija en píxeles para todos
          }}
        >
          <span
            className="text-white text-base font-bold whitespace-nowrap drop-shadow-lg block"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              transform: 'rotate(-90deg)',
              transformOrigin: 'center center'
            }}
          >
            {item.title}
          </span>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
export function InteractiveImageAccordion({
  title = "Nuestros Locales y Fábrica",
  subtitle = "Descubre todos nuestros puntos de venta y conoce donde hacemos nuestras empanadas",
  buttonText = "Ver Todos los Locales",
  buttonHref = "/locales"
}) {
  const [activeIndex, setActiveIndex] = useState(3); // Start with factory active

  const handleItemHover = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="bg-gradient-to-br from-empanada-cream to-empanada-wheat font-sans relative">
      <section className="container mx-auto px-4 py-16 md:py-20 pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* Left Side: Text Content */}
          <div className="w-full lg:w-1/2 lg:flex-shrink-0 text-center flex flex-col justify-center">
            <WordPullUp
              words={title}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-empanada-dark leading-tight tracking-tighter"
              wrapperFramerProps={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.25,
                  },
                },
              }}
              framerProps={{
                hidden: { y: 40, opacity: 0 },
                show: { y: 0, opacity: 1 },
              }}
            />
            <WordPullUp
              words={subtitle}
              className="mt-6 text-lg text-empanada-dark/80 max-w-xl mx-auto leading-relaxed"
              wrapperFramerProps={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.8,
                  },
                },
              }}
              framerProps={{
                hidden: { y: 20, opacity: 0 },
                show: { y: 0, opacity: 1 },
              }}
            />
            <div className="mt-8">
              <a
                href={buttonHref}
                className="inline-block bg-empanada-golden text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-empanada-golden/90 transition-colors duration-300"
              >
                {buttonText}
              </a>
            </div>
          </div>

          {/* Right Side: Image Accordion */}
          <div className="w-full lg:w-1/2 lg:flex-shrink-0">
            <div className="flex flex-row items-center justify-center gap-4 overflow-x-auto p-4">
              {accordionItems.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => handleItemHover(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Degradado sutil hacia el footer */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-gray-100/30 pointer-events-none"></div>
    </div>
  );
}

// Export default for easier importing
export default InteractiveImageAccordion;