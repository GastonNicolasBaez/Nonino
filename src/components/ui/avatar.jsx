import { cn } from "../../lib/utils";

/**
 * Componente Avatar reutilizable con centrado perfecto
 * @param {Object} props - Props del componente
 * @param {string} props.name - Nombre para generar la inicial
 * @param {string} props.size - Tamaño del avatar (sm, md, lg, xl)
 * @param {string} props.className - Clases CSS adicionales
 * @param {string} props.bgColor - Color de fondo personalizado
 * @returns {JSX.Element} - Componente Avatar
 */
export function Avatar({ 
  name, 
  size = "md", 
  className = "", 
  bgColor = "bg-empanada-golden" 
}) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base", 
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl"
  };

  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div 
      className={cn(
        "rounded-full flex items-center justify-center text-white font-bold flex-shrink-0",
        bgColor,
        sizeClasses[size],
        className
      )}
      style={{
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {getInitial(name)}
    </div>
  );
}
