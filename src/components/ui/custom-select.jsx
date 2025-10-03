import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Portal } from "../common/Portal";

export function CustomSelect({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Seleccionar...", 
  className = "",
  disabled = false,
  variant = "default", // "default" | "status"
  statusColors = {}, // Para colores personalizados por estado
  usePortal = true // Nueva prop para controlar si usar Portal
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const selectedOption = options.find(option => String(option.value) === String(value));

  // Calcular posición del dropdown cuando se abre
  useEffect(() => {
    if (isOpen && selectRef.current && usePortal) {
      const rect = selectRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const dropdownHeight = Math.min(options.length * 40 + 8, 200);
      const dropdownWidth = Math.max(rect.width, 200); // Ancho mínimo
      
      // Determinar si mostrar arriba o abajo
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      let top = rect.bottom + window.scrollY + 4; // Pequeño margen
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        top = rect.top + window.scrollY - dropdownHeight - 4; // Pequeño margen
      }
      
      // Calcular posición horizontal
      let left = rect.left + window.scrollX;
      
      // Ajustar si se sale por la derecha
      if (left + dropdownWidth > viewportWidth + window.scrollX) {
        left = viewportWidth + window.scrollX - dropdownWidth - 10;
      }
      
      // Ajustar si se sale por la izquierda
      if (left < window.scrollX) {
        left = window.scrollX + 10;
      }
      
      setDropdownPosition({
        top,
        left,
        width: dropdownWidth
      });
    }
  }, [isOpen, options.length, usePortal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verificar si el click fue fuera del select y del dropdown
      const isClickInsideSelect = selectRef.current && selectRef.current.contains(event.target);
      const isClickInsideDropdown = event.target.closest('[data-dropdown-portal]');
      
      if (!isClickInsideSelect && !isClickInsideDropdown) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    console.log('CustomSelect: Seleccionando valor:', optionValue);
    console.log('CustomSelect: Valor actual:', value);
    
    // Asegurar que el valor se pase correctamente
    onChange(optionValue);
    setIsOpen(false);
    
    console.log('CustomSelect: Después de onChange');
  };

  // Función para obtener clases de color basadas en el estado (simplificada)
  const getStatusClasses = (optionValue) => {
    if (variant !== "status") return "";
    
    const statusColorMap = {
      pending: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700',
      preparing: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700',
      ready: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-700',
      completed: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-200 dark:border-green-700',
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-700',
      cancelled: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700',
      active: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-200 dark:border-green-700',
      inactive: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-empanada-medium dark:text-gray-200 dark:border-empanada-light-gray',
      ...statusColors
    };

    return statusColorMap[optionValue] || 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-empanada-medium dark:text-gray-200 dark:border-empanada-light-gray';
  };

  const getButtonClasses = () => {
    const baseClasses = `
      w-full px-3 py-2 text-left rounded-md border transition-all duration-150
      focus:outline-none focus:ring-2 focus:ring-empanada-golden/20
      ${disabled
        ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-empanada-medium'
        : 'cursor-pointer hover:shadow-sm'
      }
    `;

    if (variant === "status") {
      return `${baseClasses} ${getStatusClasses(value)}`;
    }

    return `${baseClasses} bg-white dark:bg-empanada-dark border-gray-300 dark:border-empanada-light-gray text-gray-900 dark:text-gray-100 hover:border-empanada-golden/50`;
  };

  const getOptionClasses = (optionValue) => {
    const baseClasses = `
      w-full px-3 py-2 text-left text-sm transition-colors duration-150
      hover:bg-gray-50 dark:hover:bg-empanada-medium
    `;

    if (variant === "status") {
      const statusClasses = getStatusClasses(optionValue);
      return `${baseClasses} ${statusClasses} ${String(value) === String(optionValue) ? 'bg-empanada-golden/10 font-medium' : ''}`;
    }

    return `${baseClasses} text-gray-700 dark:text-gray-300 ${String(value) === String(optionValue) 
      ? 'bg-empanada-golden/10 text-empanada-golden font-medium' 
      : ''
    }`;
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={getButtonClasses()}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-150 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {isOpen && (
        <>
          {usePortal ? (
            <Portal>
              <div 
                data-dropdown-portal
                className="fixed z-[999999] bg-white dark:bg-empanada-dark border border-gray-200 dark:border-empanada-light-gray rounded-md shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  width: dropdownPosition.width,
                  minWidth: dropdownPosition.width
                }}
              >
                <div className="py-1">
                  {options.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelect(option.value);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      className={getOptionClasses(option.value)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{option.label}</span>
                        {String(value) === String(option.value) && (
                          <Check className="w-3 h-3 text-empanada-golden flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Portal>
          ) : (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-empanada-dark border border-gray-200 dark:border-empanada-light-gray rounded-md shadow-lg overflow-hidden">
              <div className="py-1">
                {options.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelect(option.value);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    className={getOptionClasses(option.value)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{option.label}</span>
                      {String(value) === String(option.value) && (
                        <Check className="w-3 h-3 text-empanada-golden flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
