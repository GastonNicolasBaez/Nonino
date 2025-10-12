/**
 * Utilidades para posicionamiento inteligente de imágenes
 * Sistema adaptativo que optimiza la visualización según el contexto
 */

/**
 * Calcula el área segura que siempre será visible en parallax
 * @param {Object} imageData - Datos de la imagen (ancho, alto, etc.)
 * @returns {Object} - Coordenadas del área segura
 */
export const calculateSafeArea = (imageData = {}) => {
  const { width = 480, height = 360 } = imageData;
  
  // Área segura para parallax: 80% central del ancho (10% margen cada lado)
  // Con escala 120% y movimiento parallax, el área visible es ~80% de la imagen
  const safeWidth = width * 0.8;
  const safeLeft = width * 0.1; // 10% desde la izquierda
  
  return {
    width: safeWidth,
    height: height,
    left: safeLeft,
    right: safeLeft + safeWidth,
    top: 0,
    bottom: height
  };
};

/**
 * Detecta automáticamente el punto focal de una imagen
 * @param {string} imageSrc - URL o data URL de la imagen
 * @returns {Promise<Object>} - Coordenadas del punto focal detectado
 */
export const detectFocalPoint = async (imageSrc) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Crear canvas para análisis
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Reducir tamaño para análisis más rápido
        const analysisSize = 100;
        canvas.width = analysisSize;
        canvas.height = analysisSize;
        
        // Dibujar imagen escalada
        ctx.drawImage(img, 0, 0, analysisSize, analysisSize);
        
        // Obtener datos de píxeles
        const imageData = ctx.getImageData(0, 0, analysisSize, analysisSize);
        const data = imageData.data;
        
        // Análisis simple de contraste y bordes
        let maxContrast = 0;
        let focalX = analysisSize / 2; // Centro por defecto
        let focalY = analysisSize / 2;
        
        // Analizar cada píxel para encontrar área de mayor contraste
        for (let y = 1; y < analysisSize - 1; y++) {
          for (let x = 1; x < analysisSize - 1; x++) {
            const idx = (y * analysisSize + x) * 4;
            
            // Calcular gradiente (diferencia con píxeles vecinos)
            const currentLuminance = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            const rightLuminance = (data[idx + 4] + data[idx + 5] + data[idx + 6]) / 3;
            const bottomLuminance = (data[(y + 1) * analysisSize * 4 + x * 4] + 
                                    data[(y + 1) * analysisSize * 4 + x * 4 + 1] + 
                                    data[(y + 1) * analysisSize * 4 + x * 4 + 2]) / 3;
            
            const gradientX = Math.abs(currentLuminance - rightLuminance);
            const gradientY = Math.abs(currentLuminance - bottomLuminance);
            const totalGradient = gradientX + gradientY;
            
            if (totalGradient > maxContrast) {
              maxContrast = totalGradient;
              focalX = x;
              focalY = y;
            }
          }
        }
        
        // Convertir coordenadas de análisis a porcentajes
        const focalPoint = {
          x: (focalX / analysisSize) * 100,
          y: (focalY / analysisSize) * 100
        };
        
        resolve(focalPoint);
      } catch (error) {
        console.warn('Error detectando punto focal:', error);
        // Fallback al centro
        resolve({ x: 50, y: 50 });
      }
    };
    
    img.onerror = () => {
      // Fallback al centro si hay error
      resolve({ x: 50, y: 50 });
    };
    
    img.src = imageSrc;
  });
};

/**
 * Optimiza el encuadre para que el punto focal esté en la zona segura del parallax
 * @param {Object} focalPoint - Coordenadas del punto focal (porcentajes)
 * @param {Object} safeArea - Área segura calculada
 * @returns {Object} - Posición optimizada para el parallax
 */
export const optimizeForParallax = (focalPoint, safeArea) => {
  const { x: focalX, y: focalY } = focalPoint;
  const { left, right, top, bottom } = safeArea;
  
  // Si el punto focal está fuera del área segura, ajustar la posición
  let optimizedX = focalX;
  let optimizedY = focalY;
  
  // Ajustar horizontalmente si está fuera del área segura
  if (focalX < left) {
    optimizedX = left + (right - left) / 2; // Centrar en área segura
  } else if (focalX > right) {
    optimizedX = left + (right - left) / 2; // Centrar en área segura
  }
  
  // Mantener posición vertical (no hay restricciones verticales en parallax)
  optimizedY = focalY;
  
  return {
    x: optimizedX,
    y: optimizedY
  };
};

/**
 * Devuelve el object-position CSS óptimo según el contexto de visualización
 * @param {string} context - Contexto: 'parallax', 'static', 'default'
 * @param {Object} focalPoint - Punto focal detectado (opcional)
 * @param {Object} product - Datos del producto (opcional)
 * @returns {string} - Valor CSS para object-position
 */
export const getAdaptiveObjectPosition = (context = 'default', focalPoint = null, product = null) => {
  // Si hay punto focal detectado, usarlo
  if (focalPoint && focalPoint.x !== undefined && focalPoint.y !== undefined) {
    return `${focalPoint.x}% ${focalPoint.y}%`;
  }
  
  // Si hay datos del producto con focalPoint guardado
  if (product && product.focalPoint) {
    return `${product.focalPoint.x}% ${product.focalPoint.y}%`;
  }
  
  // Posiciones por defecto según contexto
  switch (context) {
    case 'parallax':
      // Para parallax, centrar horizontalmente para evitar cortes
      return 'center center';
    
    case 'static':
      // Para vistas estáticas, usar posición centrada
      return 'center center';
    
    case 'default':
    default:
      // Posición por defecto
      return 'center center';
  }
};

/**
 * Calcula el offset de parallax óptimo basado en el punto focal
 * @param {Object} focalPoint - Punto focal de la imagen
 * @param {number} parallaxFactor - Factor de parallax (0.4 por defecto)
 * @returns {number} - Offset ajustado para el parallax
 */
export const calculateParallaxOffset = (focalPoint, parallaxFactor = 0.4) => {
  if (!focalPoint || focalPoint.x === undefined) {
    return 0; // Sin offset si no hay punto focal
  }
  
  // Calcular offset basado en la posición horizontal del punto focal
  // Si el punto focal está a la izquierda del centro, mover hacia la derecha
  // Si está a la derecha, mover hacia la izquierda
  const centerX = 50; // Centro horizontal
  const offset = (focalPoint.x - centerX) * parallaxFactor * 0.01; // Convertir a decimal
  
  return offset;
};

/**
 * Valida si una posición es óptima para el contexto parallax
 * @param {Object} focalPoint - Punto focal a validar
 * @param {Object} safeArea - Área segura
 * @returns {boolean} - True si la posición es óptima
 */
export const isOptimalForParallax = (focalPoint, safeArea) => {
  if (!focalPoint || !safeArea) return false;
  
  const { x } = focalPoint;
  const { left, right } = safeArea;
  
  // Verificar si el punto focal está dentro del área segura
  return x >= left && x <= right;
};

/**
 * Genera recomendaciones de posicionamiento para el editor
 * @param {Object} focalPoint - Punto focal detectado
 * @param {Object} safeArea - Área segura calculada
 * @returns {Object} - Recomendaciones para el usuario
 */
export const generatePositioningRecommendations = (focalPoint, safeArea) => {
  const recommendations = {
    isOptimal: false,
    suggestions: [],
    warnings: []
  };
  
  if (!focalPoint || !safeArea) {
    recommendations.warnings.push('No se pudo analizar la imagen');
    return recommendations;
  }
  
  // Verificar si es óptimo para parallax
  recommendations.isOptimal = isOptimalForParallax(focalPoint, safeArea);
  
  if (!recommendations.isOptimal) {
    recommendations.suggestions.push(
      'Centra el elemento principal - los bordes laterales (5% cada lado) pueden moverse con el parallax'
    );
    
    if (focalPoint.x < safeArea.left) {
      recommendations.suggestions.push('Mueve la imagen hacia la derecha');
    } else if (focalPoint.x > safeArea.right) {
      recommendations.suggestions.push('Mueve la imagen hacia la izquierda');
    }
  } else {
    recommendations.suggestions.push('¡Posición óptima para parallax!');
  }
  
  return recommendations;
};
