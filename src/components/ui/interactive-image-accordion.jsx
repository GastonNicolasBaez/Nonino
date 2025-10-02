import React, { useState } from 'react';
import { MapPin, Clock, Phone, Factory, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import { WordPullUp } from './word-pull-up';
import { FranchiseModal } from './FranchiseModal';
import {
  localRuta40Blur, localRuta40640, localRuta401024, localRuta401920, localRuta402560,
  FabricaBlur, Fabrica640, Fabrica1024, Fabrica1920, Fabrica2560
} from '../../assets/images/optimized';

// --- Data for the empanadas locations accordion ---
const accordionItems = [
  {
    id: 1,
    title: 'Local Ruta 40',
    type: 'store',
    address: 'Ruta Nacional 40, Km 1234, San Martín de los Andes',
    phone: '+54 2972 41-0400',
    hours: 'Lun a Dom: 11:00 - 15:00 / 19:00 - 23:00',
    imageUrl: localRuta402560,
    srcSet: `${localRuta40640} 640w, ${localRuta401024} 1024w, ${localRuta401920} 1920w, ${localRuta402560} 2560w`,
    blurDataURL: localRuta40Blur,
    description: 'Nuestro local principal con vista a la cordillera'
  },
  {
    id: 2,
    title: 'Local Villegas',
    type: 'store',
    address: 'Av. Villegas 567, San Martín de los Andes',
    phone: '+54 2972 42-5072',
    hours: 'Lun a Dom: 11:00 - 15:00 / 19:00 - 23:00',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop',
    description: 'Ambiente acogedor en el centro de la ciudad'
  },
  {
    id: 3,
    title: 'Fábrica Nonino',
    type: 'factory',
    address: 'Parque Industrial, San Martín de los Andes',
    phone: '(02972) 444-888',
    hours: 'Lun a Vie: 06:00 - 18:00',
    imageUrl: Fabrica2560,
    srcSet: `${Fabrica640} 640w, ${Fabrica1024} 1024w, ${Fabrica1920} 1920w, ${Fabrica2560} 2560w`,
    blurDataURL: FabricaBlur,
    description: 'En nuestra fabrica cada empanada es preparada con el sabor de lo casero.'
  },
  {
    id: 4,
    title: 'Próximamente',
    type: 'coming_soon',
    address: 'Nueva apertura',
    phone: 'Información pronto',
    hours: 'Muy pronto',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop',
    description: 'Estamos trabajando en una nueva sorpresa para ti'
  },
];

// --- Accordion Item Component (Desktop) ---
const AccordionItem = ({ item, isActive, onMouseEnter }) => {
  const [isLoaded, setIsLoaded] = useState(false);

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
      {/* Blur placeholder */}
      {item.blurDataURL && !isLoaded && (
        <img
          src={item.blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
          aria-hidden="true"
        />
      )}

      {/* Background Image */}
      {item.srcSet ? (
        <picture>
          <source
            type="image/webp"
            srcSet={item.srcSet}
            sizes="(max-width: 1024px) 400px, 400px"
          />
          <img
            src={item.imageUrl}
            alt={item.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${!isLoaded && item.blurDataURL ? 'opacity-0' : 'opacity-100'}`}
            style={{ transition: 'opacity 0.3s ease-in-out, transform 0.7s ease-in-out' }}
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/400x450/f59e0b/ffffff?text=Nonino+Empanadas';
            }}
          />
        </picture>
      ) : (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/400x450/f59e0b/ffffff?text=Nonino+Empanadas';
          }}
        />
      )}

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
            bottom: '60px'
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

// --- Mobile/Tablet Card Component ---
const MobileCard = ({ item }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative h-[320px] md:h-[350px] rounded-2xl overflow-hidden shadow-xl">
      {/* Blur placeholder */}
      {item.blurDataURL && !isLoaded && (
        <img
          src={item.blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
          aria-hidden="true"
        />
      )}

      {/* Background Image */}
      {item.srcSet ? (
        <picture>
          <source
            type="image/webp"
            srcSet={item.srcSet}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <img
            src={item.imageUrl}
            alt={item.title}
            className={`absolute inset-0 w-full h-full object-cover ${!isLoaded && item.blurDataURL ? 'opacity-0' : 'opacity-100'}`}
            style={{ transition: 'opacity 0.3s ease-in-out' }}
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/400x450/f59e0b/ffffff?text=Nonino+Empanadas';
            }}
          />
        </picture>
      ) : (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/400x450/f59e0b/ffffff?text=Nonino+Empanadas';
          }}
        />
      )}

      {/* Gradient overlay - más fuerte para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

      {/* Factory/Store/Coming Soon icon overlay */}
      <div className={cn(
        "absolute top-4 right-4 p-3 rounded-full",
        item.type === 'factory'
          ? "bg-empanada-golden/90 text-white"
          : item.type === 'coming_soon'
          ? "bg-gray-500/90 text-white"
          : "bg-white/90 text-empanada-golden"
      )}>
        {item.type === 'factory' ? (
          <Factory className="w-6 h-6" />
        ) : item.type === 'coming_soon' ? (
          <Calendar className="w-6 h-6" />
        ) : (
          <MapPin className="w-6 h-6" />
        )}
      </div>

      {/* Content - siempre visible */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
        <h3 className="text-2xl md:text-3xl font-bold mb-2 text-empanada-golden">
          {item.title}
        </h3>

        <p className="text-sm md:text-base mb-4 text-gray-200">
          {item.description}
        </p>

        <div className="space-y-2 text-sm md:text-base">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-empanada-golden flex-shrink-0" />
            <span className="text-gray-200">{item.address}</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-empanada-golden flex-shrink-0" />
            <span className="text-gray-200">{item.hours}</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-empanada-golden flex-shrink-0" />
            <span className="text-gray-200">{item.phone}</span>
          </div>
        </div>
      </div>
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
  const [activeIndex, setActiveIndex] = useState(2); // Start with factory active
  const [isFranchiseModalOpen, setIsFranchiseModalOpen] = useState(false);

  const handleItemHover = (index) => {
    setActiveIndex(index);
  };

  const handleButtonClick = () => {
    setIsFranchiseModalOpen(true);
  };

  return (
    <div className="bg-gradient-to-b from-black via-empanada-darker to-empanada-medium font-sans relative">
      <section className="container mx-auto px-4 py-16 md:py-20 pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* Left Side: Text Content */}
          <div className="w-full lg:w-1/2 lg:flex-shrink-0 text-center flex flex-col justify-center">
            <WordPullUp
              words={title}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tighter"
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
              className="mt-6 text-lg text-gray-300 max-w-xl mx-auto leading-relaxed"
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
              <button
                onClick={handleButtonClick}
                className="inline-block bg-empanada-golden text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-empanada-golden/90 transition-colors duration-300 cursor-pointer"
              >
                {buttonText}
              </button>
            </div>
          </div>

          {/* Right Side: Image Accordion (Desktop) / Cards (Mobile/Tablet) */}
          <div className="w-full lg:w-1/2 lg:flex-shrink-0">
            {/* Desktop: Accordion horizontal */}
            <div className="hidden lg:flex flex-row items-center justify-center gap-4 overflow-x-auto p-4">
              {accordionItems.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => handleItemHover(index)}
                />
              ))}
            </div>

            {/* Mobile/Tablet: Cards apiladas verticalmente */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              {accordionItems.map((item) => (
                <MobileCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Degradado sutil hacia el footer */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-empanada-medium pointer-events-none"></div>

      {/* Franchise Modal */}
      <FranchiseModal
        isOpen={isFranchiseModalOpen}
        onClose={() => setIsFranchiseModalOpen(false)}
      />
    </div>
  );
}

// Export default for easier importing
export default InteractiveImageAccordion;