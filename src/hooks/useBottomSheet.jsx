import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Hook para gestionar bottom sheets con gestos de swipe
 * Patrón común en apps mobile (Google Maps, UberEats, etc)
 */

export function useBottomSheet(options = {}) {
  const {
    defaultOpen = false,
    snapPoints = [0, 0.5, 1], // Porcentajes de altura viewport (0 = cerrado, 1 = full)
    initialSnap = 1, // Índice del snap point inicial
    onClose,
    onOpen,
    minSwipeDistance = 50, // Píxeles mínimos para activar swipe
  } = options;

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const startY = useRef(0);
  const currentY = useRef(0);
  const sheetRef = useRef(null);

  // Altura del viewport
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

  /**
   * Obtener altura del snap point actual
   */
  const getCurrentHeight = useCallback(() => {
    if (!isOpen) return 0;
    return snapPoints[currentSnapIndex] * viewportHeight;
  }, [isOpen, currentSnapIndex, snapPoints, viewportHeight]);

  /**
   * Abrir bottom sheet
   */
  const open = useCallback(() => {
    setIsOpen(true);
    setCurrentSnapIndex(initialSnap);
    if (onOpen) onOpen();
  }, [initialSnap, onOpen]);

  /**
   * Cerrar bottom sheet
   */
  const close = useCallback(() => {
    setIsOpen(false);
    setCurrentSnapIndex(0);
    setDragOffset(0);
    if (onClose) onClose();
  }, [onClose]);

  /**
   * Toggle bottom sheet
   */
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  /**
   * Ir a un snap point específico
   */
  const snapTo = useCallback((index) => {
    if (index < 0 || index >= snapPoints.length) return;

    if (index === 0) {
      close();
    } else {
      setCurrentSnapIndex(index);
      setDragOffset(0);
    }
  }, [snapPoints, close]);

  /**
   * Encontrar el snap point más cercano
   */
  const findClosestSnap = useCallback((height) => {
    let closestIndex = 0;
    let minDiff = Math.abs(height - snapPoints[0] * viewportHeight);

    snapPoints.forEach((snap, index) => {
      const snapHeight = snap * viewportHeight;
      const diff = Math.abs(height - snapHeight);

      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    return closestIndex;
  }, [snapPoints, viewportHeight]);

  /**
   * Manejar inicio de drag (touch/mouse)
   */
  const handleDragStart = useCallback((clientY) => {
    setIsDragging(true);
    startY.current = clientY;
    currentY.current = clientY;
  }, []);

  /**
   * Manejar movimiento de drag
   */
  const handleDragMove = useCallback((clientY) => {
    if (!isDragging) return;

    currentY.current = clientY;
    const delta = startY.current - clientY;
    setDragOffset(delta);
  }, [isDragging]);

  /**
   * Manejar fin de drag
   */
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    const delta = startY.current - currentY.current;
    const currentHeight = getCurrentHeight();
    const newHeight = currentHeight + delta;

    // Si el swipe es muy pequeño, volver al snap actual
    if (Math.abs(delta) < minSwipeDistance) {
      setDragOffset(0);
      return;
    }

    // Encontrar snap más cercano
    const closestSnapIndex = findClosestSnap(newHeight);
    snapTo(closestSnapIndex);
  }, [isDragging, getCurrentHeight, findClosestSnap, snapTo, minSwipeDistance]);

  /**
   * Touch handlers
   */
  const touchHandlers = {
    onTouchStart: (e) => {
      handleDragStart(e.touches[0].clientY);
    },
    onTouchMove: (e) => {
      handleDragMove(e.touches[0].clientY);
    },
    onTouchEnd: () => {
      handleDragEnd();
    },
  };

  /**
   * Mouse handlers (para desktop)
   */
  const mouseHandlers = {
    onMouseDown: (e) => {
      handleDragStart(e.clientY);
    },
  };

  // Mouse move y up globales
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      handleDragMove(e.clientY);
    };

    const handleMouseUp = () => {
      handleDragEnd();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  /**
   * Prevenir scroll del body cuando el sheet está abierto
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return {
    isOpen,
    open,
    close,
    toggle,
    snapTo,
    currentSnapIndex,
    isDragging,
    sheetRef,
    touchHandlers,
    mouseHandlers,
    // Altura calculada con offset de drag
    height: getCurrentHeight() + dragOffset,
    // Porcentaje de altura (útil para animaciones)
    heightPercent: ((getCurrentHeight() + dragOffset) / viewportHeight) * 100,
  };
}

/**
 * Variante simplificada para bottom sheets básicos (solo abierto/cerrado)
 */
export function useSimpleBottomSheet(options = {}) {
  const { defaultOpen = false, onClose, onOpen } = options;

  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    if (onOpen) onOpen();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    if (onClose) onClose();
  }, [onClose]);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Prevenir scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
