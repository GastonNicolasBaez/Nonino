import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { CardHoverReveal, CardHoverRevealContent, CardHoverRevealMain } from '@/components/ui/reveal-on-hover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartProvider';
import { Star, Plus, Clock, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const PARALLAX_FACTOR = 0.4;

export function ProductsCarousel({ products = [], className = '', title = 'Nuestros Productos' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({
    loop: true,
    dragFree: false,
    containScroll: false,
    align: 'start',
    skipSnaps: false
  });
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true
  });

  if (!products || products.length === 0) {
    return null;
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
        const tweenNode = emblaApi.slideNodes()[slideIndex].querySelector('.parallax-layer');
        if (tweenNode) {
          tweenNode.style.transform = `translateX(${translate}%)`;
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
              Descubre nuestras deliciosas empanadas artesanales, preparadas con los mejores ingredientes.
            </p>
          </div>
        )}

        {/* Parallax Carousel Container */}
        <div className="relative">
          {/* Left fade gradient - Only on desktop */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-16 md:w-24 z-20 pointer-events-none" style={{ background: 'linear-gradient(to right, rgb(26, 26, 26), transparent)' }}></div>

          {/* Right fade gradient - Only on desktop */}
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-16 md:w-24 z-20 pointer-events-none" style={{ background: 'linear-gradient(to left, rgb(26, 26, 26), transparent)' }}></div>

          {/* Navigation Buttons - Only on desktop */}
          <Button
            variant="outline"
            size="icon"
            className="hidden md:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-white hover:bg-gray-50 shadow-lg border-gray-200 rounded-full w-10 h-10 md:w-12 md:h-12"
            onClick={onPrevButtonClick}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="hidden md:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-white hover:bg-gray-50 shadow-lg border-gray-200 rounded-full w-10 h-10 md:w-12 md:h-12"
            onClick={onNextButtonClick}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </Button>

          {/* Main Parallax Viewport */}
          <div className="overflow-hidden" ref={emblaMainRef}>
            <div className="flex" style={{ marginLeft: '-0.75rem', marginRight: '-0.75rem' }}>
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="relative flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
                  style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}
                >
                  <div className="relative overflow-hidden rounded-xl h-80 md:h-96 group cursor-pointer bg-gray-100">
                    <div className="parallax-layer absolute inset-0 w-[130%] -left-[15%]">
                      <img
                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        src={
                          product.image || product.imageUrl || '/nonino.webp'
                        }
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = '/nonino.webp';
                        }}
                      />
                    </div>

                    {/* Badges - Always visible */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
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

                    {/* Hover Overlay with Product Details */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                      <div className="text-white">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">{product.name}</h3>
                        <p className="text-white/90 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center gap-4 mb-4 text-xs text-white/80">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{product.preparationTime || 15} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating || 4.8}</span>
                            {product.reviews && <span>({product.reviews})</span>}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-2xl md:text-3xl font-bold text-empanada-golden">
                            {formatPrice(product.price)}
                          </p>
                          <ProductMenuButton product={product} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thumb Indicators */}
          <div className="mt-8">
            <div className="overflow-hidden" ref={emblaThumbsRef}>
              <div className="flex gap-2 justify-center">
                {products.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === selectedIndex
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
    </section>
  );
}

function ProductMenuButton({ product }) {
  const handleViewMenu = () => {
    // Redirigir a la página de pedir
    window.location.href = '/pedir';
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
