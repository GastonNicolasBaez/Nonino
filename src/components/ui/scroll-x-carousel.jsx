'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  motion,
  useScroll,
  useTransform,
} from 'motion/react';

const ScrollXCarouselContext = React.createContext(null);

function useScrollXCarousel() {
  const context = React.useContext(ScrollXCarouselContext);
  if (!context) {
    throw new Error('useScrollXCarousel must be used within a ScrollXCarousel');
  }
  return context;
}

export function ScrollXCarousel({
  children,
  className,
  ...props
}) {
  const carouselRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: carouselRef,
    offset: ["start start", "end start"]
  });

  return (
    <ScrollXCarouselContext.Provider value={{ scrollYProgress }}>
      <div
        ref={carouselRef}
        className={cn('relative w-screen max-w-full', className)}
        {...props}
      >
        {children}
      </div>
    </ScrollXCarouselContext.Provider>
  );
}

export function ScrollXCarouselContainer({
  className,
  ...props
}) {
  return (
    <div
      className={cn('sticky overflow-hidden w-full top-0 left-0', className)}
      {...props}
    />
  );
}

export function ScrollXCarouselWrap({
  className,
  style,
  xRagnge = ['0%', '-75%'],
  ...props
}) {
  const { scrollYProgress } = useScrollXCarousel();
  const x = useTransform(scrollYProgress, [0, 1], xRagnge);

  return (
    <motion.div
      className={cn('w-fit', className)}
      style={{ x, ...style }}
      {...props}
    />
  );
}

export function ScrollXCarouselProgress({
  className,
  style,
  progressStyle,
  ...props
}) {
  const { scrollYProgress } = useScrollXCarousel();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className={cn('max-w-screen overflow-hidden', className)} {...props}>
      <motion.div
        className={cn('origin-left', progressStyle)}
        style={{ scaleX, ...style }}
      />
    </div>
  );
}