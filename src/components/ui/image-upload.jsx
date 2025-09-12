import { useState, useRef, useCallback } from "react";
import { Upload, X, RotateCcw, Crop, RotateCw } from "lucide-react";
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

    // Usar exactamente el mismo tamaño que el contenedor del preview (400px)
    const size = 400;
    canvas.width = size;
    canvas.height = size;

    // Limpiar canvas con fondo blanco
    ctx.fillStyle = '#ffffff';
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

    // Dibujar la imagen con el mismo comportamiento que object-contain
    // Calcular dimensiones para que la imagen se ajuste manteniendo aspecto
    const containerSize = size;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawWidth, drawHeight;

    if (imgAspect > 1) {
      // Imagen más ancha que alta
      drawWidth = containerSize;
      drawHeight = containerSize / imgAspect;
    } else {
      // Imagen más alta que ancha
      drawWidth = containerSize * imgAspect;
      drawHeight = containerSize;
    }

    // Dibujar imagen centrada (igual que object-contain)
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
      <div className="w-full max-w-none space-y-4">
        {/* Layout con imagen y controles lado a lado - balanceado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Vista previa de la imagen - Columna izquierda */}
          <div>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-gray-50 dark:bg-gray-800">
                  <div className="relative overflow-hidden" style={{ height: '400px' }}>
                  <img
                    ref={imageRef}
                    src={originalImage}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{
                      transform: `
                        scale(${editSettings.zoom / 100}) 
                        rotate(${editSettings.rotation}deg) 
                        translate(${editSettings.x}px, ${editSettings.y}px)
                      `,
                      filter: `brightness(${editSettings.brightness}%) contrast(${editSettings.contrast}%)`,
                      transformOrigin: 'center center'
                    }}
                  />
                  {/* Overlay de recorte */}
                  <div 
                    className="absolute border-2 border-dashed border-empanada-golden bg-empanada-golden/10"
                    style={{
                      left: `${editSettings.cropArea.x}%`,
                      top: `${editSettings.cropArea.y}%`,
                      width: `${editSettings.cropArea.width}%`,
                      height: `${editSettings.cropArea.height}%`
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Controles de edición - Columna derecha */}
          <div className="space-y-3">
            <Card>
              <CardContent className="p-3 space-y-3">
                <h3 className="font-semibold text-base mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  <Crop className="w-4 h-4" />
                  Ajustes de Imagen
                </h3>

                {/* Zoom */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium">Zoom</label>
                    <span className="text-xs text-muted-foreground font-mono">{editSettings.zoom}%</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="300"
                    value={editSettings.zoom}
                    onChange={(e) => handleSliderChange('zoom', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-empanada"
                  />
                </div>

                {/* Posición X */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium">Posición X</label>
                    <span className="text-xs text-muted-foreground font-mono">{editSettings.x}px</span>
                  </div>
                  <input
                    type="range"
                    min="-200"
                    max="200"
                    value={editSettings.x}
                    onChange={(e) => handleSliderChange('x', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-empanada"
                  />
                </div>

                {/* Posición Y */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium">Posición Y</label>
                    <span className="text-xs text-muted-foreground font-mono">{editSettings.y}px</span>
                  </div>
                  <input
                    type="range"
                    min="-200"
                    max="200"
                    value={editSettings.y}
                    onChange={(e) => handleSliderChange('y', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-empanada"
                  />
                </div>

                <div className="border-t pt-2">
                  <h4 className="font-medium text-xs mb-2 text-gray-700 dark:text-gray-300">Efectos</h4>
                  
                  {/* Brillo */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium">Brillo</label>
                      <span className="text-xs text-muted-foreground font-mono">{editSettings.brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={editSettings.brightness}
                      onChange={(e) => handleSliderChange('brightness', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-empanada"
                    />
                  </div>

                  {/* Contraste */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium">Contraste</label>
                      <span className="text-xs text-muted-foreground font-mono">{editSettings.contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={editSettings.contrast}
                      onChange={(e) => handleSliderChange('contrast', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-empanada"
                    />
                  </div>
                </div>

                <div className="border-t pt-2">
                  {/* Rotación */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium">Rotación</label>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRotateLeft}
                          className="h-6 w-6 p-0 text-xs"
                          title="Rotar 90° izquierda"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                        <span className="text-xs text-muted-foreground font-mono min-w-[30px] text-center">{editSettings.rotation}°</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRotateRight}
                          className="h-6 w-6 p-0 text-xs"
                          title="Rotar 90° derecha"
                        >
                          <RotateCw className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-1">
                <Button
                  variant="outline"
                  onClick={resetSettings}
                  className="flex items-center justify-center gap-1 text-xs h-8"
                  title="Restablecer todos los valores"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1 text-xs h-8"
                  title="Cambiar imagen"
                >
                  <Upload className="w-3 h-3" />
                  Cambiar
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center justify-center gap-1 text-xs h-8"
                >
                  <X className="w-3 h-3" />
                  Cancelar
                </Button>
                <Button
                  variant="empanada"
                  onClick={handleSaveEdit}
                  className="flex items-center justify-center gap-1 text-xs h-8"
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
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative group">
              <div className="relative bg-gray-50 dark:bg-gray-800" style={{ height: '400px' }}>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleStartEdit}
                  className="bg-white/90 text-gray-900 hover:bg-white"
                >
                  <Crop className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-500/90 text-white hover:bg-blue-600"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Cambiar
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="bg-red-500/90 text-white hover:bg-red-600"
                >
                  <X className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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