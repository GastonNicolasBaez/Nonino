import React, { useState, memo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Componente optimizado para imágenes de productos con alta calidad
 * Incluye optimizaciones de renderizado, carga progresiva y responsive
 */
export const OptimizedImage = memo(({ 
    src, 
    alt, 
    className = '', 
    priority = false,
    quality = 'high',
    loading = 'lazy',
    decoding = 'async',
    onLoad,
    onError,
    fallbackSrc,
    ...props 
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    const handleImageLoad = (e) => {
        setImageLoaded(true);
        setImageError(false);
        e.target.style.opacity = '1';
        if (onLoad) onLoad(e);
    };

    const handleImageError = (e) => {
        setImageError(true);
        
        // Intentar fallback si está disponible
        if (fallbackSrc && currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
            return;
        }
        
        // Fallback final a imagen placeholder
        e.target.src = 'https://placehold.co/400x300/f59e0b/ffffff?text=Imagen+No+Disponible';
        setImageLoaded(true);
        
        if (onError) onError(e);
    };

    // Configuración de carga optimizada
    const loadingConfig = priority ? 'eager' : loading;
    const decodingConfig = priority ? 'sync' : decoding;
    const fetchPriority = priority ? 'high' : undefined;

    return (
        <div className="w-full h-full relative overflow-hidden bg-gray-100">
            <img
                className={cn(
                    "w-full h-full transition-all duration-300",
                    // Optimizaciones de calidad para desktop
                    quality === 'high' && "image-rendering: high-quality",
                    imageError ? "object-contain p-1" : "object-cover object-center",
                    className
                )}
                src={currentSrc}
                alt={alt}
                loading={loadingConfig}
                decoding={decodingConfig}
                fetchpriority={fetchPriority}
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                    // Optimizaciones de renderizado para alta calidad
                    ...(quality === 'high' && {
                        imageRendering: 'high-quality',
                        imageRendering: '-webkit-optimize-contrast',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)'
                    }),
                    minWidth: imageError ? 'auto' : '100%',
                    minHeight: imageError ? 'auto' : '100%',
                }}
                {...props}
            />

            {/* Loading spinner mejorado */}
            {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-3 border-empanada-golden border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-xs text-gray-500 font-medium">Cargando...</span>
                </div>
            )}

            {/* Gradient overlay para mejorar contraste del texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
    );
});

OptimizedImage.displayName = "OptimizedImage";

/**
 * Hook para obtener la mejor fuente de imagen de un producto
 */
export const useProductImage = (product) => {
    return React.useMemo(() => {
        // Priorizar imageBase64 (desde admin) o imageUrl procesadas
        if (product.imageBase64) return `data:image/webp;base64,${product.imageBase64}`;
        if (product.imageUrl) return product.imageUrl;
        if (product.image) return product.image;
        if (product.foto) return product.foto;
        if (product.imagen) return product.imagen;
        
        // Fallback a imagen por defecto
        return 'https://placehold.co/400x300/f59e0b/ffffff?text=Imagen+No+Disponible';
    }, [product.imageBase64, product.imageUrl, product.image, product.foto, product.imagen]);
};

/**
 * Componente específico para imágenes de productos con configuración optimizada
 */
export const ProductImage = memo(({ product, className = '', priority = false, ...props }) => {
    const imageSrc = useProductImage(product);
    
    return (
        <OptimizedImage
            src={imageSrc}
            alt={`${product.name || 'Producto'} - Empanada artesanal patagónica Nonino San Martín de los Andes`}
            className={cn("group-hover:scale-105", className)}
            priority={priority}
            quality="high"
            fallbackSrc="https://placehold.co/400x300/f59e0b/ffffff?text=Imagen+No+Disponible"
            {...props}
        />
    );
});

ProductImage.displayName = "ProductImage";