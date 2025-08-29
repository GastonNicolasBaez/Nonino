import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function LoadingSpinner({ className, size = "default", ...props }) {
  const sizes = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <motion.div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizes[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
      {...props}
    />
  );
}

export function LoadingEmpanada({ className }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div
        className="text-6xl"
        animate={{
          rotate: [0, 15, -15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🥟
      </motion.div>
    </div>
  );
}

export function FullPageLoading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <LoadingEmpanada />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-empanada-golden">
            Preparando tus empanadas...
          </h3>
          <p className="text-muted-foreground text-sm">
            Un momento por favor
          </p>
        </div>
      </div>
    </div>
  );
}
