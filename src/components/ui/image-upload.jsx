import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, RotateCcw, Crop, RotateCw, Move } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";

export function ImageUpload({ 
  value, 
  onChange, 
  placeholder = "Subir imagen del producto",
  className = "",
  disabled = false 
}) {
  const [preview, setPreview] = useState(value || null);
  const [originalImage, setOriginalImage] = useState(value || null);
  const [processedImage, setProcessedImage] = useState(null); // Nueva: imagen procesada temporal
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isImageEdited, setIsImageEdited] = useState(false); // Nueva: track si la imagen ha sido editada
  const [editSettings, setEditSettings] = useState({
    zoom: 100,
    x: 0,
    y: 0
  });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const previewRef = useRef(null); // Nueva referencia para el contenedor del preview

  // Sincronizar estado con props cuando cambian (SOLO al inicio)
  useEffect(() => {
    if (value && !originalImage) {
      // Solo establecer la imagen original una vez, cuando no existe
      setOriginalImage(value);
      setPreview(value);
      setIsImageEdited(false);
    }
  }, [value]);

  const handleFileSelect = useCallback((file) => {
    if (!file) return;
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es muy grande. El tamaño máximo es 5MB');
      return;
    }

    // Resetear ajustes cuando se cambia la imagen
    setEditSettings({
      zoom: 100,
      x: 0,
      y: 0
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      setOriginalImage(imageData); // Guardar imagen original (NUNCA cambiar)
      setPreview(imageData); // Mostrar imagen original en preview
      setProcessedImage(null); // Limpiar imagen procesada anterior
      setIsImageEdited(false); // Resetear estado de edición
      setIsEditing(false); // NO entrar automáticamente en modo edición
      // NO llamar onChange aquí - solo al finalizar todo el proceso
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setOriginalImage(null);
    setProcessedImage(null);
    setIsEditing(false);
    setIsImageEdited(false);
    setEditSettings({
      zoom: 100,
      rotation: 0,
      x: 0,
      y: 0,
      brightness: 100,
      contrast: 100,
      cropArea: { x: 0, y: 0, width: 100, height: 100 }
    });
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSliderChange = (key, value) => {
    setEditSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetSettings = () => {
    setEditSettings({
      zoom: 100,
      x: 0,
      y: 0
    });
  };

  // Funciones para manejo de arrastrar con mouse
  const handleMouseDown = (e) => {
    setIsDraggingImage(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDraggingImage) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setEditSettings(prev => ({
      ...prev,
      x: prev.x + deltaX * 0.5, // Factor de sensibilidad
      y: prev.y + deltaY * 0.5
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDraggingImage(false);
  };


  // Agregar event listeners para mouse global
  useEffect(() => {
    if (isDraggingImage) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingImage, dragStart]);

  // Event listener para scroll zoom en modo edición
  useEffect(() => {
    if (isEditing && previewRef.current) {
      const previewElement = previewRef.current;
      
      const handleWheelCapture = (e) => {
        console.log('Wheel event captured:', e.deltaY);
        
        // Prevenir completamente el scroll de la página
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        const delta = e.deltaY > 0 ? -10 : 10;
        const newZoom = Math.max(25, Math.min(300, editSettings.zoom + delta));
        
        console.log('Zoom change:', editSettings.zoom, '->', newZoom);
        
        setEditSettings(prev => ({
          ...prev,
          zoom: newZoom
        }));
        
        return false;
      };
      
      // Usar addEventListener con capture = true para interceptar antes que cualquier otro listener
      previewElement.addEventListener('wheel', handleWheelCapture, { passive: false, capture: true });
      
      return () => {
        previewElement.removeEventListener('wheel', handleWheelCapture, { capture: true });
      };
    }
  }, [isEditing, editSettings.zoom]);

  const handleStartEdit = () => {
    // SIEMPRE usar la imagen original al entrar al modo edición
    setPreview(originalImage); // Volver al original para editar
    resetSettings(); // Resetear todos los ajustes de edición
    setIsEditing(true);
    // Temporalmente marcar como no editada para mostrar object-contain en modo edición
    setIsImageEdited(false);
  };

  const handleSaveEdit = async () => {
    if (!preview || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    // Usar exactamente las mismas dimensiones que el contenedor del preview
    // w-64 = 256px de ancho, aspect-square = 256px de alto (cuadrado)
    const canvasSize = 256;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Limpiar canvas con fondo gris (igual que el preview)
    ctx.fillStyle = '#f9fafb'; // bg-gray-50
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Aplicar transformaciones simplificadas (solo zoom y posición)
    ctx.save();

    // Centro del canvas (ahora es cuadrado)
    ctx.translate(canvasSize / 2, canvasSize / 2);

    // 1. Zoom (scale)
    const zoomFactor = editSettings.zoom / 100;
    ctx.scale(zoomFactor, zoomFactor);

    // 2. Posición (translate)
    ctx.translate(editSettings.x, editSettings.y);

     // Dibujar la imagen exactamente como se ve en el preview
     // El preview usa object-contain cuando está en modo edición (!isImageEdited)
     const imgAspect = img.naturalWidth / img.naturalHeight;
     
     // Usar object-contain logic (mismo que el preview CSS)
     // Esto hace que la imagen se ajuste completamente dentro del contenedor
     let baseWidth, baseHeight;
     if (imgAspect > 1) {
       // Imagen más ancha que alta - limitar por ancho
       baseWidth = canvasSize;
       baseHeight = canvasSize / imgAspect;
     } else {
       // Imagen más alta que ancha - limitar por altura
       baseHeight = canvasSize;
       baseWidth = canvasSize * imgAspect;
     }

     // Dibujar imagen centrada con el tamaño base (object-contain behavior)
     ctx.drawImage(img, -baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);
    
    ctx.restore();

    // Convertir a blob y actualizar
    canvas.toBlob((blob) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const editedImageUrl = e.target.result;
        setProcessedImage(editedImageUrl); // Guardar imagen procesada separadamente
        setPreview(editedImageUrl); // Mostrar resultado en preview
        setIsImageEdited(true); // Marcar como imagen editada
        setIsEditing(false); // Salir del modo edición
        onChange?.(editedImageUrl); // SOLO aquí llamar onChange con la imagen final
      };
      reader.readAsDataURL(blob);
    }, 'image/jpeg', 0.95);
  };

  if (isEditing && preview) {
    return (
      <div className="w-full flex justify-center max-h-[50vh] overflow-y-auto">
        {/* Layout simplificado y centrado */}
        <div className="flex flex-col items-center gap-4 max-w-lg">

          {/* Preview como Card de Producto - Centro */}
          <div className="relative">
            <div className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div
                ref={previewRef}
                className="aspect-square relative overflow-hidden cursor-move select-none bg-gray-50 dark:bg-gray-700"
                onMouseDown={handleMouseDown}
              >
                 <img
                   ref={imageRef}
                   src={originalImage}
                   alt="Preview"
                   className={`absolute inset-0 w-full h-full ${isImageEdited ? 'object-cover' : 'object-contain'}`}
                   style={{
                     transform: `
                       scale(${editSettings.zoom / 100})
                       translate(${editSettings.x}px, ${editSettings.y}px)
                     `,
                     transformOrigin: 'center center'
                   }}
                   draggable={false}
                 />

                {/* Barra de zoom minimalista sobre la imagen */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/20 backdrop-blur-md rounded-full p-2 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2 text-white">
                    <button
                      onClick={() => handleSliderChange('zoom', Math.max(25, editSettings.zoom - 25))}
                      className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-sm font-bold shrink-0"
                      title="Reducir zoom"
                    >
                      -
                    </button>

                    <input
                      type="range"
                      min="25"
                      max="300"
                      value={editSettings.zoom}
                      onChange={(e) => handleSliderChange('zoom', parseInt(e.target.value))}
                      className="w-24 h-1 bg-white/30 rounded-full appearance-none cursor-pointer zoom-slider"
                    />

                    <button
                      onClick={() => handleSliderChange('zoom', Math.min(300, editSettings.zoom + 25))}
                      className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-sm font-bold shrink-0"
                      title="Aumentar zoom"
                    >
                      +
                    </button>

                    <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full min-w-[45px] text-center shrink-0">
                      {editSettings.zoom}%
                    </span>
                  </div>
                </div>

                {/* Indicador de arrastrar - discreto */}
                <div className="absolute bottom-4 right-4 opacity-40 hover:opacity-70 transition-opacity">
                  <div className="text-white text-xs bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-2">
                    <Move className="w-3 h-3" />
                    <span className="text-xs">Arrastra para mover</span>
                  </div>
                </div>
              </div>

              {/* Información del producto simplificada */}
              <div className="p-2 bg-gray-50 dark:bg-gray-700/50">
                <div className="text-center">
                  <h3 className="font-medium text-xs text-gray-900 dark:text-white mb-0.5">Vista previa</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ajusta zoom y posición
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción - Responsivos */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="px-3 py-2 text-sm border-gray-300 hover:border-empanada-golden hover:bg-empanada-golden/10 flex-shrink-0"
            >
              Restablecer
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 text-sm border-gray-300 hover:border-empanada-golden hover:bg-empanada-golden/10 flex-shrink-0"
            >
              <Upload className="w-3 h-3 mr-1" />
              Cambiar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Al cancelar, volver a mostrar la imagen anterior
                if (processedImage) {
                  setPreview(processedImage); // Si hay imagen procesada, mostrarla
                  setIsImageEdited(true); // Marcar como editada
                } else {
                  setPreview(originalImage); // Si no, mostrar original
                  setIsImageEdited(false); // Marcar como no editada
                }
                setIsEditing(false);
              }}
              className="px-3 py-2 text-sm border-gray-300 hover:border-red-500 hover:bg-red-50 text-red-600 flex-shrink-0"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="px-4 py-2 text-sm bg-empanada-golden hover:bg-empanada-golden-dark text-white flex-shrink-0"
            >
              Guardar
            </Button>
          </div>
        </div>

        {/* Canvas oculto para procesamiento */}
        <canvas
          ref={canvasRef}
          className="hidden"
          width="256"
          height="256"
        />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {preview ? (
        <div className="w-full flex justify-center">
          <div className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
             <div className="aspect-square relative bg-gray-50 dark:bg-gray-700">
               <img
                 src={preview}
                 alt="Preview"
                 className={`w-full h-full ${isImageEdited ? 'object-cover' : 'object-contain'}`}
               />
             </div>
            
            {/* Información del producto simulada */}
            <div className="p-3">
              <h3 className="font-semibold text-sm mb-1 text-gray-900 dark:text-white">Empanada de Carne</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                Carne picada, cebolla, huevo duro, aceitunas y condimentos
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-empanada-golden">$450</span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-xs">★</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300">4.8</span>
                </div>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="p-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartEdit}
                  className="flex-1 text-xs h-7 px-2"
                >
                  <Crop className="w-3 h-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 text-xs h-7 px-2"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Cambiar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="flex-1 text-xs h-7 px-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                >
                  <X className="w-3 h-3 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200
            ${isDragging 
              ? 'border-empanada-golden bg-empanada-golden/10' 
              : 'border-gray-300 dark:border-gray-600 hover:border-empanada-golden/50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {placeholder}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                PNG, JPG, JPEG hasta 5MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Estilos para la barra de zoom */}
      <style jsx>{`
        .zoom-slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid rgba(255, 255, 255, 0.5);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .zoom-slider::-moz-range-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid rgba(255, 255, 255, 0.5);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .zoom-slider::-webkit-slider-track {
          background: rgba(255, 255, 255, 0.3);
          height: 4px;
          border-radius: 2px;
        }

        .zoom-slider::-moz-range-track {
          background: rgba(255, 255, 255, 0.3);
          height: 4px;
          border-radius: 2px;
          border: none;
        }
      `}</style>
    </div>
  );
}