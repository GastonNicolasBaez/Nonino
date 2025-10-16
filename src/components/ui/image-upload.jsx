import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, RotateCcw, Crop, RotateCw, Move, Eye, EyeOff, Monitor, Smartphone, Edit } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { detectFocalPoint, calculateSafeArea, generatePositioningRecommendations } from "@/utils/imagePositioning";

export function ImageUpload({
  value,
  onChange,
  placeholder = "Subir imagen del producto",
  className = "",
  disabled = false,
  simplePreview = false // Nueva prop: si es true, solo muestra preview estático sin parallax
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
  
  // Nuevos estados para el sistema adaptativo
  const [previewMode, setPreviewMode] = useState('both'); // 'parallax', 'static', 'both'
  const [focalPoint, setFocalPoint] = useState(null);
  const [safeArea, setSafeArea] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [showGuides, setShowGuides] = useState(true);
  const [isDetectingFocalPoint, setIsDetectingFocalPoint] = useState(false);
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
    reader.onload = async (e) => {
      const imageData = e.target.result;
      setOriginalImage(imageData); // Guardar imagen original (NUNCA cambiar)
      setPreview(imageData); // Mostrar imagen original en preview
      setProcessedImage(null); // Limpiar imagen procesada anterior
      setIsImageEdited(false); // Resetear estado de edición
      setIsEditing(true); // Ir DIRECTAMENTE al modo edición
      
      // Detectar punto focal automáticamente
      setIsDetectingFocalPoint(true);
      try {
        const detectedFocalPoint = await detectFocalPoint(imageData);
        setFocalPoint(detectedFocalPoint);
        
        // Calcular área segura
        const calculatedSafeArea = calculateSafeArea({ width: 480, height: 360 });
        setSafeArea(calculatedSafeArea);
        
        // Generar recomendaciones
        const generatedRecommendations = generatePositioningRecommendations(detectedFocalPoint, calculatedSafeArea);
        setRecommendations(generatedRecommendations);
      } catch (error) {
        console.warn('Error detectando punto focal:', error);
      } finally {
        setIsDetectingFocalPoint(false);
      }
      
      // NO llamar onChange aquí - solo cuando se guarde la edición
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

  const handleSaveEdit = async () => {
    if (!preview || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    // Usar formato rectangular 4:3 mejorado para mejor calidad
    // Este formato es más natural para fotos de productos
    const canvasWidth = 480;  // Ancho mejorado (antes 320)
    const canvasHeight = 360; // Alto mejorado (antes 240)
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Limpiar canvas con fondo gris (igual que el preview)
    ctx.fillStyle = '#f9fafb'; // bg-gray-50
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Aplicar transformaciones simplificadas (solo zoom y posición)
    ctx.save();

    // Centro del canvas (ahora es rectangular 4:3)
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    
    // Aplicar transformaciones en ORDEN INVERSO al CSS
    // 1. Zoom (scale - último en CSS)
    const zoomFactor = editSettings.zoom / 100;
    ctx.scale(zoomFactor, zoomFactor);

    // 2. Posición (translate)
    ctx.translate(editSettings.x, editSettings.y);

     // Dibujar la imagen exactamente como se ve en el preview
     // Adaptar para el nuevo formato rectangular 4:3
     const imgAspect = img.naturalWidth / img.naturalHeight;
     const canvasAspect = canvasWidth / canvasHeight;

     // Usar object-cover por defecto para llenar mejor el canvas
     // Esto da mejores resultados visuales en el carrusel
     let baseWidth, baseHeight;
     if (imgAspect > canvasAspect) {
       // Imagen más ancha que el canvas - limitar por altura
       baseHeight = canvasHeight;
       baseWidth = canvasHeight * imgAspect;
     } else {
       // Imagen más alta que el canvas - limitar por ancho
       baseWidth = canvasWidth;
       baseHeight = canvasWidth / imgAspect;
     }

     // Dibujar imagen centrada con el tamaño base (object-cover behavior mejorado)
     ctx.drawImage(img, -baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);
    
    ctx.restore();

    // Convertir a blob y actualizar con mejor calidad
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
    }, 'image/jpeg', 0.95); // Calidad mejorada para mejor visualización
  };

  if (isEditing && preview) {
    return (
      <div className="w-full flex justify-center">
        {/* Input file y canvas - necesarios para el modo edición */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Canvas oculto para procesamiento */}
        <canvas
          ref={canvasRef}
          className="hidden"
          width="480"
          height="360"
        />

        {/* Layout compacto optimizado */}
        <div className="flex flex-col items-center gap-3 max-w-5xl w-full">
          
          {/* Controles superiores - más compactos */}
          {!simplePreview && (
            <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg w-full">
              {/* Toggle de vistas */}
              <div className="flex items-center gap-1 bg-white dark:bg-gray-700 rounded-lg p-1">
                <Button
                  variant={previewMode === 'parallax' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('parallax')}
                  className="h-8 px-3 text-xs"
                >
                  <Monitor className="w-3 h-3 mr-1" />
                  Parallax
                </Button>
                <Button
                  variant={previewMode === 'static' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('static')}
                  className="h-8 px-3 text-xs"
                >
                  <Smartphone className="w-3 h-3 mr-1" />
                  Estático
                </Button>
                <Button
                  variant={previewMode === 'both' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('both')}
                  className="h-8 px-3 text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ambas
                </Button>
              </div>

              {/* Toggle de guías */}
              <Button
                variant={showGuides ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowGuides(!showGuides)}
                className="h-8 px-3 text-xs"
              >
                {showGuides ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                Guías
              </Button>

              {/* Estado de detección */}
              {isDetectingFocalPoint && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-3 h-3 border border-empanada-golden border-t-transparent rounded-full animate-spin"></div>
                  Detectando punto focal...
                </div>
              )}
            </div>
          )}
          
          {/* Recomendaciones - más compactas */}
          {!simplePreview && recommendations && (
            <div className={`w-full p-2 rounded-lg text-xs ${
              recommendations.isOptimal
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
            }`}>
              <div className="font-medium">
                {recommendations.isOptimal ? '✅ Posición óptima' : '⚠️ Ajuste recomendado'}
              </div>
              {recommendations.suggestions.slice(0, 1).map((suggestion, index) => (
                <div key={index} className="text-xs">• {suggestion}</div>
              ))}
            </div>
          )}
          
          {/* Contenedor de previews */}
          <div className={`flex gap-4 ${(previewMode === 'both' && !simplePreview) ? 'flex-row' : 'justify-center'}`}>

            {/* Preview Parallax - más compacto */}
            {!simplePreview && (previewMode === 'parallax' || previewMode === 'both') && (
              <div className="relative">
                <div className="w-72 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 border-b">
                    <h3 className="font-medium text-sm text-gray-900 dark:text-white text-center">
                      Vista Parallax (Carrusel)
                    </h3>
                  </div>
                  <div
                    ref={previewRef}
                    className="aspect-[4/3] relative overflow-hidden cursor-move select-none bg-gray-50 dark:bg-gray-700"
                    onMouseDown={handleMouseDown}
                  >
                    {/* Simulación del parallax con escala 120% */}
                    <img
                      ref={imageRef}
                      src={originalImage}
                      alt="Preview Parallax"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        transform: `
                          scale(${(editSettings.zoom / 100) * 1.2})
                          translate(${editSettings.x}px, ${editSettings.y}px)
                        `,
                        transformOrigin: 'center center',
                        objectPosition: 'center center'
                      }}
                      draggable={false}
                    />

                    {/* Guías de área segura - ajustadas al nuevo porcentaje */}
                    {showGuides && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 bottom-0 left-[10%] right-[10%] border-2 border-empanada-golden/50 border-dashed" />
                        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs bg-black/60 px-2 py-1 rounded text-white">
                          Zona siempre visible (80% central con escala 120%)
                        </span>
                      </div>
                    )}

                    {/* Indicador de punto focal */}
                    {focalPoint && showGuides && (
                      <div 
                        className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg pointer-events-none"
                        style={{
                          left: `${focalPoint.x}%`,
                          top: `${focalPoint.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Preview Estático - más compacto */}
            {(simplePreview || previewMode === 'static' || previewMode === 'both') && (
              <div className="relative">
                <div className="w-72 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {!simplePreview && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 border-b">
                      <h3 className="font-medium text-sm text-gray-900 dark:text-white text-center">
                        Vista Estática (Menú)
                      </h3>
                    </div>
                  )}
                  <div
                    ref={simplePreview ? previewRef : null}
                    className="aspect-[4/3] relative overflow-hidden bg-gray-50 dark:bg-gray-700 cursor-move select-none"
                    onMouseDown={handleMouseDown}
                  >
                    <img
                      ref={simplePreview ? imageRef : null}
                      src={originalImage}
                      alt="Preview Estático"
                      className="w-full h-full object-cover"
                      style={{
                        transform: `
                          scale(${editSettings.zoom / 100})
                          translate(${editSettings.x}px, ${editSettings.y}px)
                        `,
                        transformOrigin: 'center center',
                        objectPosition: 'center center'
                      }}
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controles de zoom y posición - más compactos */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg w-full">
            {/* Barra de zoom */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSliderChange('zoom', Math.max(25, editSettings.zoom - 25))}
                className="w-8 h-8 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center transition-colors text-sm font-bold border border-gray-300"
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
                className="w-32 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer zoom-slider"
              />

              <button
                onClick={() => handleSliderChange('zoom', Math.min(300, editSettings.zoom + 25))}
                className="w-8 h-8 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center transition-colors text-sm font-bold border border-gray-300"
                title="Aumentar zoom"
              >
                +
              </button>

              <span className="text-sm font-medium bg-white px-3 py-1 rounded-full border border-gray-300 min-w-[60px] text-center">
                {editSettings.zoom}%
              </span>
            </div>

            {/* Indicador de arrastrar */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Move className="w-4 h-4" />
              <span className="text-sm">Arrastra para mover</span>
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
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Input file - necesario para seleccionar archivos iniciales */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {!preview ? (
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
      ) : (
        /* Vista de preview cuando hay imagen pero no está editando */
        <div className="space-y-3">
          <div className="relative w-full max-w-md mx-auto">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Cambiar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
              Eliminar
            </Button>
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