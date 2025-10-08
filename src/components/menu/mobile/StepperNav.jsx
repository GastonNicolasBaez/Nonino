import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Navegación por pasos para combo builder mobile
 * Patrón de stepper horizontal con indicadores visuales
 */

const STEP_CONFIG = {
  EMPANADAS: {
    label: 'Empanadas',
    shortLabel: 'Empanadas',
    icon: '🥟',
    number: 1
  },
  BEBIDAS: {
    label: 'Bebidas',
    shortLabel: 'Bebidas',
    icon: '🥤',
    number: 2
  },
  POSTRES: {
    label: 'Postres',
    shortLabel: 'Postres',
    icon: '🍰',
    number: 3
  }
};

export function StepperNav({
  steps = [],
  currentStep,
  completedSteps = [],
  onStepClick
}) {
  if (steps.length === 0) return null;

  return (
    <div className="bg-empanada-medium border-b border-empanada-light-gray">
      <div className="px-4 py-4">
        {/* Barra de progreso lineal */}
        <div className="w-full bg-empanada-dark rounded-full h-2 mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-empanada-golden to-empanada-warm rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${((completedSteps.length) / steps.length) * 100}%`
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        {/* Steps horizontales */}
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, index) => {
            const config = STEP_CONFIG[step];
            if (!config) return null;

            const isCurrent = currentStep === step;
            const isCompleted = completedSteps.includes(step);
            const isPast = completedSteps.length > index;
            const isClickable = isPast || isCurrent;

            return (
              <div key={step} className="flex-1 flex items-center">
                {/* Step indicator */}
                <motion.button
                  onClick={() => isClickable && onStepClick && onStepClick(step)}
                  disabled={!isClickable}
                  className={cn(
                    "flex flex-col items-center gap-2 w-full transition-all",
                    isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  )}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                >
                  {/* Circle con icono o número */}
                  <div
                    className={cn(
                      "relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                      "border-2",
                      isCurrent &&
                        "bg-empanada-golden border-empanada-golden shadow-lg shadow-empanada-golden/30 scale-110",
                      isCompleted &&
                        !isCurrent &&
                        "bg-green-600 border-green-600",
                      !isCurrent &&
                        !isCompleted &&
                        "bg-empanada-dark border-empanada-light-gray"
                    )}
                  >
                    {isCompleted && !isCurrent ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      >
                        <Check className="w-6 h-6 text-white" />
                      </motion.div>
                    ) : (
                      <span className="text-2xl">{config.icon}</span>
                    )}

                    {/* Pulse animation para step actual */}
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-empanada-golden"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: 'loop'
                        }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <p
                      className={cn(
                        "text-xs font-medium transition-colors",
                        isCurrent
                          ? "text-empanada-golden"
                          : isCompleted
                          ? "text-green-400"
                          : "text-gray-400"
                      )}
                    >
                      {config.shortLabel}
                    </p>
                  </div>
                </motion.button>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 bg-empanada-light-gray relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-empanada-golden to-green-600"
                      initial={{ width: 0 }}
                      animate={{
                        width: isCompleted ? '100%' : '0%'
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info adicional */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Paso {steps.indexOf(currentStep) + 1} de {steps.length}
          </p>
        </div>
      </div>
    </div>
  );
}
