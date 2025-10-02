import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * Componente OptimizedImage
 *
 * Imagen responsive optimizada con:
 * - Lazy loading con IntersectionObserver
 * - Blur placeholder (LQIP)
 * - Srcset responsive
 * - GPU acceleration
 * - Transición suave al cargar
 *
 * @example
 * <OptimizedImage
 *   src={image1920}
 *   srcSet={{
 *     '640w': image640,
 *     '1024w': image1024,
 *     '1920w': image1920
 *   }}
 *   blurDataURL={imageBlur}
 *   alt="Descripción"
 *   priority={false}
 * />
 */
export function OptimizedImage({
  src,
  srcSet = {},
  blurDataURL,
  alt = '',
  className = '',
  priority = false,
  sizes = '100vw',
  objectFit = 'cover',
  onLoad,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Si es priority, cargar inmediatamente
  const imgRef = useRef(null);

  // IntersectionObserver para lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Cargar 50px antes de entrar al viewport
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Generar srcSet string
  const srcSetString = Object.entries(srcSet)
    .map(([size, url]) => `${url} ${size}`)
    .join(', ');

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  return (
    <div
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={{
        // GPU acceleration
        willChange: isInView && !isLoaded ? 'opacity' : 'auto',
        transform: 'translate3d(0, 0, 0)'
      }}
    >
      {/* Blur Placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className={cn(
            'absolute inset-0 w-full h-full',
            objectFit === 'cover' ? 'object-cover' : 'object-contain'
          )}
          style={{
            filter: 'blur(20px)',
            transform: 'scale(1.1)', // Evitar bordes del blur
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      )}

      {/* Imagen principal */}
      {isInView && (
        <picture>
          {srcSetString && (
            <source
              srcSet={srcSetString}
              sizes={sizes}
              type="image/webp"
            />
          )}
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={handleLoad}
            className={cn(
              'w-full h-full transition-opacity duration-300',
              objectFit === 'cover' ? 'object-cover' : 'object-contain',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            style={{
              // GPU acceleration
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden'
            }}
            {...props}
          />
        </picture>
      )}

      {/* Loading indicator (opcional) */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50">
          <div className="w-8 h-8 border-3 border-empanada-golden border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

/**
 * Variante para backgrounds con parallax
 */
export function OptimizedBackgroundImage({
  src,
  srcSet = {},
  blurDataURL,
  className = '',
  priority = false,
  parallaxY,
  children,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const bgRef = useRef(null);

  useEffect(() => {
    if (priority || !bgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px', threshold: 0 }
    );

    observer.observe(bgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  // Generar srcSet para CSS background
  const backgroundImage = isLoaded && src
    ? `url(${src})`
    : blurDataURL
    ? `url(${blurDataURL})`
    : 'none';

  return (
    <div
      ref={bgRef}
      className={cn('relative', className)}
      style={{
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: isLoaded ? 'blur(0)' : 'blur(20px)',
        transition: 'filter 0.3s ease-in-out',
        // GPU acceleration + parallax
        willChange: parallaxY ? 'transform' : 'auto',
        transform: parallaxY ? `translate3d(0, ${parallaxY}px, 0)` : 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        ...props.style
      }}
      {...props}
    >
      {/* Preload image */}
      {isInView && (
        <link
          rel="preload"
          as="image"
          href={src}
          onLoad={() => setIsLoaded(true)}
        />
      )}

      {children}
    </div>
  );
}

export default OptimizedImage;
