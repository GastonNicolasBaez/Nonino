"use client";

import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import { memo, useRef, useState, useEffect } from "react";

const staggerTimings = {
  text: 0.06,
  word: 0.05,
  character: 0.03,
  line: 0.06,
};

const defaultContainerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const defaultItemAnimationVariants = {
  fadeIn: {
    container: {
      hidden: { opacity: 1 },
      show: {
        opacity: 1,
        transition: {
          delayChildren: 0,
          staggerChildren: 0.05,
        },
      },
      exit: {
        opacity: 0,
        transition: {
          staggerChildren: 0.05,
          staggerDirection: -1,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: "easeOut",
        },
      },
      exit: {
        opacity: 0,
        y: 20,
        transition: { duration: 0.3 },
      },
    },
  },
  blurIn: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)" },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        transition: {
          duration: 0.3,
        },
      },
      exit: {
        opacity: 0,
        filter: "blur(10px)",
        transition: { duration: 0.3 },
      },
    },
  },
  slideUp: {
    container: {
      hidden: { opacity: 1 },
      show: {
        opacity: 1,
        transition: {
          delayChildren: 0,
          staggerChildren: 0.05,
        },
      },
      exit: {
        opacity: 0,
        transition: {
          staggerChildren: 0.05,
          staggerDirection: -1,
        },
      },
    },
    item: {
      hidden: { y: 30, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      },
      exit: {
        y: -20,
        opacity: 0,
        transition: {
          duration: 0.3,
        },
      },
    },
  },
};

const TextAnimateBase = ({
  children,
  delay = 0,
  duration = 0.3,
  variants,
  className,
  segmentClassName,
  as: Component = "p",
  startOnView = true,
  once = false,
  by = "word",
  animation = "fadeIn",
  accessible = true,
  ...props
}) => {
  const MotionComponent = motion.create(Component);
  const hasAnimated = useRef(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  // Después de la primera animación, marcar como animado para evitar re-animaciones
  useEffect(() => {
    if (!hasAnimated.current && !startOnView) {
      const animationDuration = (delay + duration) * 1000 + 100;
      const timer = setTimeout(() => {
        hasAnimated.current = true;
        setShouldAnimate(false);
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [delay, duration, startOnView]);

  let segments = [];
  switch (by) {
    case "word":
      segments = children.split(/(\\s+)/);
      break;
    case "character":
      segments = children.split("");
      break;
    case "line":
      segments = children.split("\\n");
      break;
    case "text":
    default:
      segments = [children];
      break;
  }

  const finalVariants = variants
    ? {
        container: {
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              opacity: { duration: 0.01, delay },
              delayChildren: delay,
              staggerChildren: duration / segments.length,
            },
          },
          exit: {
            opacity: 0,
            transition: {
              staggerChildren: duration / segments.length,
              staggerDirection: -1,
            },
          },
        },
        item: variants,
      }
    : animation
      ? {
          container: {
            ...defaultItemAnimationVariants[animation].container,
            show: {
              ...defaultItemAnimationVariants[animation].container.show,
              transition: {
                delayChildren: delay,
                staggerChildren: duration / segments.length,
              },
            },
            exit: {
              ...defaultItemAnimationVariants[animation].container.exit,
              transition: {
                staggerChildren: duration / segments.length,
                staggerDirection: -1,
              },
            },
          },
          item: defaultItemAnimationVariants[animation].item,
        }
      : { container: defaultContainerVariants, item: defaultItemAnimationVariants.fadeIn.item };

  return (
    <MotionComponent
      variants={finalVariants.container}
      initial={shouldAnimate ? "hidden" : false}
      whileInView={startOnView ? "show" : undefined}
      animate={startOnView ? undefined : (shouldAnimate ? "show" : undefined)}
      className={cn("whitespace-pre-wrap", className)}
      viewport={{ once, amount: 0.1 }}
      aria-label={accessible ? children : undefined}
      {...props}
    >
      {accessible && <span className="sr-only">{children}</span>}
      {segments.map((segment, i) => (
        <motion.span
          key={`${by}-${segment}-${i}`}
          variants={finalVariants.item}
          custom={i * staggerTimings[by]}
          className={cn(
            by === "line" ? "block" : "inline-block whitespace-pre",
            by === "character" && "",
            segmentClassName,
          )}
          aria-hidden={accessible ? true : undefined}
        >
          {segment}
        </motion.span>
      ))}
    </MotionComponent>
  );
};

export const TextAnimate = memo(TextAnimateBase);
