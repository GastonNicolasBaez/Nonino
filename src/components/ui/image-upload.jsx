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
  const [originalImage, setOriginalImage] = useState(null); // Nueva: imagen original sin procesar
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSettings, setEditSettings] = useState({
    zoom: 100, // Cambio a porcentaje (100% = 1x)
    rotation: 0,
    x: 0,
    y: 0,
    brightness: 100,
    contrast: 100,
    cropArea: { x: 0, y: 0, width: 100, height: 100 }
  });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

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
      rotation: 0,
      x: 0,
      y: 0,
      brightness: 100,
      contrast: 100,
      cropArea: { x: 0, y: 0, width: 100, height: 100 }
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      setOriginalImage(imageData); // Guardar imagen original
      setPreview(imageData);
      setIsEditing(true);
      onChange?.(file);
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
    setOriginalImage(null); // Limpiar imagen original
    setIsEditing(false);
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

  const handleRotateLeft = () => {
    setEditSettings(prev => ({
      ...prev,
      rotation: (prev.rotation - 90 + 360) % 360
    }));
  };

  const handleRotateRight = () => {
    setEditSettings(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  };

  const resetSettings = () => {
    setEditSettings({
      zoom: 100,
      rotation: 0,
      x: 0,
      y: 0,
      brightness: 100,
      contrast: 100,
      cropArea: { x: 0, y: 0, width: 100, height: 100 }
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

  const handleStartEdit = () => {
    // Si no tenemos imagen original pero sí preview, usar el preview como original
    if (!originalImage && preview) {
      setOriginalImage(preview);
    }
    // Resetear ajustes cuando vuelve a editar
    resetSettings();
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!preview || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    // Usar exactamente el mismo tamaño que el contenedor del preview (160px)
    const size = 160;
    canvas.width = size;
    canvas.height = size;

    // Limpiar canvas con fondo gris (igual que el preview)
    ctx.fillStyle = '#f9fafb'; // bg-gray-50
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Aplicar filtros
    ctx.filter = `brightness(${editSettings.brightness}%) contrast(${editSettings.contrast}%)`;

    // Aplicar las mismas transformaciones que en el CSS del preview
    ctx.save();
    
    // Centro del canvas
    ctx.translate(size / 2, size / 2);
    
    // Rotación
    ctx.rotate((editSettings.rotation * Math.PI) / 180);
    
    // Zoom (convertir porcentaje a decimal)
    const zoomFactor = editSettings.zoom / 100;
    ctx.scale(zoomFactor, zoomFactor);
    
    // Posición
    ctx.translate(editSettings.x, editSettings.y);

     // Dibujar la imagen con el mismo comportamiento que object-cover
     // Calcular dimensiones para que la imagen llene todo el contenedor
     const containerSize = size;
     const imgAspect = img.naturalWidth / img.naturalHeight;
     let drawWidth, drawHeight;

     if (imgAspect > 1) {
       // Imagen más ancha que alta - usar altura completa
       drawHeight = containerSize;
       drawWidth = containerSize * imgAspect;
     } else {
       // Imagen más alta que ancha - usar ancho completo
       drawWidth = containerSize;
       drawHeight = containerSize / imgAspect;
     }

     // Dibujar imagen centrada (igual que object-cover)
     ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    
    ctx.restore();

    // Convertir a blob y actualizar
    canvas.toBlob((blob) => {
      const file = new File([blob], 'edited-image.jpg', { type: 'image/jpeg' });
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        onChange?.(file);
        setIsEditing(false);
      };
      reader.readAsDataURL(file);
    }, 'image/jpeg', 0.95);
  };

  if (isEditing && preview) {
    return (
      <div className="w-full flex justify-center">
        {/* Layout principal: Card de preview + Controles al lado */}
        <div className="flex flex-col lg:flex-row gap-8 items-center max-w-4xl">
          {/* Preview como Card de Producto - Izquierda */}
          <div className="flex-shrink-0">
            <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div 
                className="relative overflow-hidden cursor-move select-none bg-gray-50" 
                style={{ height: '160px' }}
                onMouseDown={handleMouseDown}
              >
                 <img
                   ref={imageRef}
                   src={originalImage}
                   alt="Preview"
                   className="absolute inset-0 w-full h-full object-cover"
                   style={{
                     transform: `
                       scale(${editSettings.zoom / 100}) 
                       rotate(${editSettings.rotation}deg) 
                       translate(${editSettings.x}px, ${editSettings.y}px)
                     `,
                     filter: `brightness(${editSettings.brightness}%) contrast(${editSettings.contrast}%)`,
                     transformOrigin: 'center center'
                   }}
                   draggable={false}
                 />
                
                {/* Indicador de arrastrar */}
                <div className="absolute top-2 right-2 bg-empanada-golden text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Move className="w-3 h-3" />
                  Arrastrar
                </div>
              </div>
              
              {/* Información del producto simulada */}
              <div className="p-3">
                <h3 className="font-semibold text-sm mb-1">Empanada de Carne</h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  Carne picada, cebolla, huevo duro, aceitunas y condimentos
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-empanada-golden">$450</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-xs">★</span>
                    <span className="text-xs text-gray-600">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controles de edición - Derecha */}
          <div className="w-full max-w-sm">
            <div className="space-y-6">
              {/* Zoom */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Zoom</label>
                  <span className="text-sm font-semibold text-empanada-golden bg-empanada-golden/10 px-2 py-1 rounded">
                    {editSettings.zoom}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-8">25%</span>
                  <input
                    type="range"
                    min="25"
                    max="300"
                    value={editSettings.zoom}
                    onChange={(e) => handleSliderChange('zoom', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-empanada"
                  />
                  <span className="text-xs text-gray-400 w-8 text-right">300%</span>
                </div>
              </div>

              {/* Rotación */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Rotación</label>
                  <span className="text-sm font-semibold text-empanada-golden bg-empanada-golden/10 px-2 py-1 rounded">
                    {editSettings.rotation}°
                  </span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotateLeft}
                    className="h-8 w-8 p-0 border-gray-300 hover:border-empanada-golden hover:bg-empanada-golden/10"
                    title="Rotar 90° izquierda"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotateRight}
                    className="h-8 w-8 p-0 border-gray-300 hover:border-empanada-golden hover:bg-empanada-golden/10"
                    title="Rotar 90° derecha"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Efectos */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Efectos</h3>
                
                {/* Brillo */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-600">Brillo</label>
                    <span className="text-xs font-semibold text-empanada-golden bg-empanada-golden/10 px-2 py-1 rounded">
                      {editSettings.brightness}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-6">50%</span>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={editSettings.brightness}
                      onChange={(e) => handleSliderChange('brightness', parseInt(e.target.value))}
                      className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-empanada"
                    />
                    <span className="text-xs text-gray-400 w-6 text-right">200%</span>
                  </div>
                </div>

                {/* Contraste */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-600">Contraste</label>
                    <span className="text-xs font-semibold text-empanada-golden bg-empanada-golden/10 px-2 py-1 rounded">
                      {editSettings.contrast}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-6">50%</span>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={editSettings.contrast}
                      onChange={(e) => handleSliderChange('contrast', parseInt(e.target.value))}
                      className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-empanada"
                    />
                    <span className="text-xs text-gray-400 w-6 text-right">200%</span>
                  </div>
                </div>
              </div>

              {/* Botones de acción - Alineados horizontalmente */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={resetSettings}
                  className="flex items-center justify-center gap-1 text-xs h-8 border-gray-300 hover:border-empanada-golden hover:bg-empanada-golden/10 flex-1 min-w-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1 text-xs h-8 border-gray-300 hover:border-empanada-golden hover:bg-empanada-golden/10 flex-1 min-w-0"
                >
                  <Upload className="w-3 h-3" />
                  Cambiar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center justify-center gap-1 text-xs h-8 border-gray-300 hover:border-red-500 hover:bg-red-50 flex-1 min-w-0"
                >
                  <X className="w-3 h-3" />
                  Cancelar
                </Button>
                <Button
                  variant="empanada"
                  onClick={handleSaveEdit}
                  className="flex items-center justify-center gap-1 text-xs h-8 flex-1 min-w-0"
                >
                  <Crop className="w-3 h-3" />
                  Aplicar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas oculto para procesamiento */}
        <canvas
          ref={canvasRef}
          className="hidden"
          width="800"
          height="800"
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
          <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <div className="relative bg-gray-50" style={{ height: '160px' }}>
               <img
                 src={preview}
                 alt="Preview"
                 className="w-full h-full object-cover"
               />
             </div>
            
            {/* Información del producto simulada */}
            <div className="p-3">
              <h3 className="font-semibold text-sm mb-1">Empanada de Carne</h3>
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                Carne picada, cebolla, huevo duro, aceitunas y condimentos
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-empanada-golden">$450</span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-xs">★</span>
                  <span className="text-xs text-gray-600">4.8</span>
                </div>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="p-3 border-t border-gray-100">
              <div className="flex gap-1">
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
                  className="flex-1 text-xs h-7 px-2 text-red-600 hover:bg-red-50"
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
    </div>
  );
}