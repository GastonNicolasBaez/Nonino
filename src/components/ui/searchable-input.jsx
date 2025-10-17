import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Portal } from '../common/Portal';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

/**
 * Componente de búsqueda con autocompletado mejorado
 * Usa Portal para evitar cortes en modales
 */
export function SearchableInput({
  value,
  onChange,
  options = [],
  onSelect,
  placeholder = "Buscar...",
  className = "",
  disabled = false,
  maxResults = 5,
  noResultsText = "No se encontraron resultados",
  renderOption = (option) => option.name,
  getOptionKey = (option) => option.id,
  getOptionLabel = (option) => option.name,
  getOptionSubtitle = (option) => null
}) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const { position, shouldRenderAbove } = useDropdownPosition(inputRef, isOpen && options.length > 0, options.slice(0, maxResults));

  const filteredOptions = options.slice(0, maxResults);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verificar si el click fue fuera del input y del dropdown
      const isClickInsideInput = inputRef.current && inputRef.current.contains(event.target);
      const isClickInsideDropdown = event.target.closest('[data-searchable-dropdown]');
      
      if (!isClickInsideInput && !isClickInsideDropdown) {
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

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(newValue.trim().length > 0);
  };

  const handleOptionSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
    onChange('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filteredOptions.length > 0) {
      e.preventDefault();
      handleOptionSelect(filteredOptions[0]);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      onChange('');
    }
  };

  return (
    <div className={`relative ${className}`} ref={inputRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
        <Input
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value.trim().length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-4 text-base"
          disabled={disabled}
        />
      </div>

      {/* Sugerencias con Portal */}
      {isOpen && filteredOptions.length > 0 && (
        <Portal>
          <div 
            data-searchable-dropdown
            className="fixed z-[999999] bg-white dark:bg-empanada-dark border border-gray-200 dark:border-empanada-light-gray rounded-lg shadow-xl max-h-60 overflow-y-auto"
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
              minWidth: '300px'
            }}
          >
            {filteredOptions.map((option, index) => (
              <button
                key={getOptionKey(option)}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleOptionSelect(option);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                className={`w-full text-left px-4 py-3 hover:bg-empanada-golden/10 dark:hover:bg-empanada-golden/20 flex items-center justify-between border-b border-gray-100 dark:border-empanada-light-gray last:border-b-0 transition-colors ${
                  index === 0 ? 'bg-gray-50 dark:bg-empanada-medium/50' : ''
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {getOptionLabel(option)}
                  </span>
                  {getOptionSubtitle(option) && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getOptionSubtitle(option)}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </Portal>
      )}

      {/* Mensaje si no hay resultados */}
      {isOpen && filteredOptions.length === 0 && value.trim() && (
        <Portal>
          <div 
            data-searchable-dropdown
            className="fixed z-[999999] bg-white dark:bg-empanada-dark border border-gray-200 dark:border-empanada-light-gray rounded-lg shadow-xl p-4 text-center text-gray-500 dark:text-gray-400"
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
              minWidth: '300px'
            }}
          >
            {noResultsText.replace('{query}', value)}
          </div>
        </Portal>
      )}
    </div>
  );
}
