<!-- 836c0554-07ad-47b2-97f4-7213bfe18d13 858ee7e1-29f4-4b9b-b8c7-8199f914b81d -->
# Plan: Sistema Adaptativo de Imágenes para Productos

## Objetivo

Crear un sistema inteligente que permita subir y editar imágenes una sola vez en el panel admin, y que estas se vean perfectamente en todos los contextos (parallax, cards, menú) respetando los efectos de cada vista.

## Análisis del Problema Actual

**Archivos clave identificados:**

- `src/components/ui/image-upload.jsx` - Editor actual (formato 4:3, 320x240px)
- `src/components/ui/products-carousel.jsx` - Carrusel con parallax (layer 130% width, -15% left)
- `src/components/ui/products-focus-carousel.jsx` - Carrusel focus con parallax
- `src/components/ui/OptimizedImage.jsx` - Componente base de visualización
- `src/components/common/ProductCard.jsx` - Cards estáticas del menú
- `src/components/menu/ProductStepSelector.jsx` - Selector de productos en combos

**Problema identificado:**

- Las imágenes se guardan con `object-cover` en formato 4:3
- El parallax usa un layer 130% ancho que se desplaza, cortando partes importantes
- No hay consistencia entre cómo se ve en admin vs en producción

## Solución Propuesta

### 1. Mejorar el Editor de Imágenes (ImageUpload)

**Archivo:** `src/components/ui/image-upload.jsx`

**Cambios:**

- Cambiar el preview del editor para mostrar **guías visuales del área segura**:
  - Área central (80% width) = zona que siempre será visible en parallax
  - Área completa = lo que se ve en vistas estáticas
- Cambiar el formato de guardado a **4:3 más ancho** (400x300px o 480x360px para mejor calidad)
- Implementar **algoritmo de detección de área focal**: analizar la imagen para identificar el "centro de interés" y sugerir el mejor encuadre
- Agregar **visualización en tiempo real** de cómo se verá en:
  - Vista parallax (con simulación del desplazamiento)
  - Vista estática (card normal)

**Implementación específica:**

```javascript
// Nuevo formato de canvas
const canvasWidth = 480;  // Ancho mejorado (antes 320)
const canvasHeight = 360; // Alto mejorado (antes 240)

// Agregar guías visuales en el preview
<div className="parallax-safe-zone">
  {/* Zona segura para parallax (80% central) */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-0 bottom-0 left-[10%] right-[10%] border-2 border-empanada-golden/50 border-dashed" />
    <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs bg-black/60 px-2 py-1 rounded">
      Zona visible en parallax
    </span>
  </div>
</div>
```

### 2. Crear Sistema de Posicionamiento Inteligente

**Nuevo archivo:** `src/utils/imagePositioning.js`

**Funcionalidades:**

- `calculateSafeArea(image)` - Calcula el área que siempre será visible
- `detectFocalPoint(image)` - Detecta automáticamente el punto focal usando análisis de contraste/bordes
- `optimizeForParallax(image, focalPoint)` - Ajusta el encuadre para que el punto focal esté en la zona segura
- `getAdaptiveObjectPosition(context)` - Devuelve el `object-position` CSS óptimo según el contexto

### 3. Actualizar Componentes de Visualización

**a) OptimizedImage.jsx**

Agregar prop `context` para indicar el tipo de visualización:

```javascript
export const ProductImage = memo(({ 
  product, 
  context = 'default', // 'parallax' | 'static' | 'default'
  className = '', 
  ...props 
}) => {
  const imageSrc = useProductImage(product);
  const objectPosition = getAdaptiveObjectPosition(context, product.focalPoint);
  
  return (
    <OptimizedImage
      src={imageSrc}
      className={cn("group-hover:scale-105", className)}
      style={{ objectPosition }}
      {...props}
    />
  );
});
```

**b) products-carousel.jsx & products-focus-carousel.jsx**

Ajustar el layer del parallax para mejor visualización:

```javascript
// Reducir el ancho extra del parallax layer
<div className="parallax-layer absolute inset-0 w-[120%] -left-[10%]">
  <ProductImage 
    product={product}
    context="parallax"
    className="w-full h-full"
  />
</div>
```

**c) ProductCard.jsx & ProductStepSelector.jsx**

Mantener como están pero usar el nuevo sistema:

```javascript
<ProductImage
  product={product}
  context="static"
  className="w-full h-full"
/>
```

### 4. Agregar Toggle de Vista en el Editor

**En image-upload.jsx**, agregar botones para alternar entre vistas:

- Vista "Parallax Preview" - muestra cómo se verá con el efecto
- Vista "Card Preview" - muestra cómo se verá en el menú
- Vista "Ambas" - split screen con ambas previews

### 5. Mejorar Calidad de Procesamiento

**En image-upload.jsx → handleSaveEdit():**

- Aumentar calidad del JPEG: de `0.92` a `0.95`
- Implementar sharpening suave para compensar el resize
- Agregar opción de guardar en WebP para mejor compresión

## Archivos a Modificar

1. **`src/components/ui/image-upload.jsx`** ⭐ Principal

   - Nuevo preview con guías visuales
   - Formato de canvas mejorado (480x360)
   - Toggle de vistas (parallax/static/ambas)
   - Mayor calidad de guardado

2. **`src/utils/imagePositioning.js`** ⭐ Nuevo archivo

   - Funciones de cálculo de área segura
   - Detección de punto focal
   - Lógica de posicionamiento adaptativo

3. **`src/components/ui/OptimizedImage.jsx`**

   - Agregar soporte para `context` prop
   - Implementar `object-position` dinámico
   - Mejorar fallbacks

4. **`src/components/ui/products-carousel.jsx`**

   - Ajustar parallax layer de 130% a 120%
   - Pasar `context="parallax"` a ProductImage

5. **`src/components/ui/products-focus-carousel.jsx`**

   - Ajustar parallax layer de 130% a 120%
   - Pasar `context="parallax"` a ProductImage

6. **`src/components/common/ProductCard.jsx`**

   - Pasar `context="static"` a ProductImage

7. **`src/components/menu/ProductStepSelector.jsx`**

   - Pasar `context="static"` a ProductImage
   - Mejorar aspect ratio del contenedor

## Flujo de Trabajo Propuesto

1. **Admin sube imagen** → Editor muestra guías visuales de zona segura
2. **Admin ajusta zoom/posición** → Preview muestra cómo se ve en parallax y static
3. **Admin guarda** → Sistema procesa en alta calidad (480x360, 0.95 quality)
4. **Frontend solicita imagen** → `ProductImage` aplica posicionamiento según contexto
5. **Visualización adaptativa** → Parallax y static usan la misma imagen optimizada

## Beneficios

✅ **Una sola imagen** para todos los contextos

✅ **Editor visual mejorado** con guías de zona segura

✅ **Mayor calidad** (480x360 vs 320x240)

✅ **Posicionamiento inteligente** según el contexto

✅ **Mejor experiencia de usuario** en todas las vistas

✅ **Compatibilidad** con imágenes existentes (se adaptan automáticamente)

## Consideraciones Técnicas

- **Peso de archivos**: El aumento de 320x240 a 480x360 incrementa el tamaño ~2.25x, pero se compensa con WebP
- **Performance**: El cálculo de posicionamiento es liviano (solo CSS)
- **Compatibilidad**: Las imágenes viejas seguirán funcionando, simplemente sin el posicionamiento optimizado
- **Testing**: Probar con imágenes nuevas de productos para validar el sistema

### To-dos

- [ ] Crear archivo imagePositioning.js con funciones de cálculo de área segura y posicionamiento adaptativo
- [ ] Mejorar ImageUpload: agregar guías visuales de zona segura, cambiar canvas a 480x360, implementar toggle de vistas (parallax/static)
- [ ] Actualizar OptimizedImage y ProductImage para soportar prop 'context' y aplicar object-position dinámico
- [ ] Ajustar products-carousel.jsx y products-focus-carousel.jsx: reducir parallax layer a 120% y pasar context='parallax'
- [ ] Actualizar ProductCard.jsx y ProductStepSelector.jsx para pasar context='static' a ProductImage
- [ ] Probar el sistema completo subiendo nuevas imágenes y validando visualización en parallax y vistas estáticas