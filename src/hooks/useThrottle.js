import { useEffect, useRef, useState } from 'react';

/**
 * Hook useThrottle
 *
 * Limita la frecuencia de actualización de un valor para mejorar performance
 * Útil para scroll events, resize, etc.
 *
 * @param {any} value - Valor a throttlear
 * @param {number} limit - Tiempo mínimo entre actualizaciones (ms)
 * @returns {any} Valor throttleado
 *
 * @example
 * const throttledScroll = useThrottle(scrollY, 16); // ~60fps
 */
export function useThrottle(value, limit = 16) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());
  const timeoutId = useRef(null);

  useEffect(() => {
    const now = Date.now();

    if (now >= lastRan.current + limit) {
      setThrottledValue(value);
      lastRan.current = now;
    } else {
      // Programar actualización para el siguiente intervalo
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }, limit - (now - lastRan.current));
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [value, limit]);

  return throttledValue;
}

/**
 * Hook useThrottledCallback
 *
 * Crea una versión throttleada de una función
 *
 * @param {Function} callback - Función a throttlear
 * @param {number} limit - Tiempo mínimo entre ejecuciones (ms)
 * @returns {Function} Callback throttleado
 *
 * @example
 * const handleScroll = useThrottledCallback(() => {
 *   console.log('scroll');
 * }, 100);
 */
export function useThrottledCallback(callback, limit = 16) {
  const lastRan = useRef(Date.now());
  const timeoutId = useRef(null);

  return (...args) => {
    const now = Date.now();

    if (now >= lastRan.current + limit) {
      callback(...args);
      lastRan.current = now;
    } else {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        callback(...args);
        lastRan.current = Date.now();
      }, limit - (now - lastRan.current));
    }
  };
}

/**
 * Hook useRAFThrottle
 *
 * Throttle optimizado usando requestAnimationFrame
 * Ideal para animaciones y scroll events
 *
 * @param {any} value - Valor a throttlear
 * @returns {any} Valor throttleado
 *
 * @example
 * const smoothScroll = useRAFThrottle(scrollY);
 */
export function useRAFThrottle(value) {
  const [throttledValue, setThrottledValue] = useState(value);
  const rafId = useRef(null);

  useEffect(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      setThrottledValue(value);
    });

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [value]);

  return throttledValue;
}

export default useThrottle;
