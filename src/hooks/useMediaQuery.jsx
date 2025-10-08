import { useState, useEffect } from 'react';

/**
 * Hook para detectar breakpoints de manera consistente
 * Breakpoints basados en Tailwind CSS
 */

export const BREAKPOINTS = {
  xs: 0,      // 0-374px
  sm: 375,    // 375-479px (Mobile M)
  md: 480,    // 480-767px (Mobile L / Tablet S)
  lg: 768,    // 768-1023px (Tablet)
  xl: 1024,   // 1024+ (Desktop)
};

/**
 * Hook principal para media queries
 * @param {string} query - Media query string (ej: "(min-width: 768px)")
 * @returns {boolean} - true si la query coincide
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Verificar si estamos en el navegador
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Handler para cambios
    const handler = (event) => setMatches(event.matches);

    // Soporte moderno y legacy
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // Fallback para navegadores antiguos
      mediaQuery.addListener(handler);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Hook específico para detectar mobile
 * @returns {boolean}
 */
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.lg - 1}px)`);
}

/**
 * Hook específico para detectar tablet
 * @returns {boolean}
 */
export function useIsTablet() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.xl - 1}px)`);
}

/**
 * Hook específico para detectar desktop
 * @returns {boolean}
 */
export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
}

/**
 * Hook para obtener el breakpoint actual
 * @returns {string} - 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState('xl');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width < BREAKPOINTS.sm) {
        setBreakpoint('xs');
      } else if (width < BREAKPOINTS.md) {
        setBreakpoint('sm');
      } else if (width < BREAKPOINTS.lg) {
        setBreakpoint('md');
      } else if (width < BREAKPOINTS.xl) {
        setBreakpoint('lg');
      } else {
        setBreakpoint('xl');
      }
    };

    updateBreakpoint();

    // Throttle para mejor performance
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateBreakpoint, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return breakpoint;
}

/**
 * Hook para obtener dimensiones de viewport
 * @returns {{ width: number, height: number }}
 */
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    let timeoutId;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return viewport;
}
