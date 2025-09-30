import * as React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    outline: "border-2 border-gray-300 dark:border-empanada-light-gray bg-white dark:bg-empanada-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-empanada-light-gray shadow-sm",
    secondary: "bg-gray-100 dark:bg-empanada-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-empanada-light-gray shadow-sm",
    ghost: "hover:bg-gray-100 dark:hover:bg-empanada-medium text-gray-700 dark:text-gray-300",
    link: "text-primary underline-offset-4 hover:underline",
    empanada: "bg-gradient-to-r from-empanada-golden to-empanada-warm text-white hover:from-empanada-warm hover:to-empanada-rich shadow-lg",
    shimmer: "relative overflow-hidden bg-empanada-golden text-white before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:shadow-lg",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
