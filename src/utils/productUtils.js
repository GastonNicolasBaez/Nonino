import { SKU_ORDER } from '@/config/constants';

/**
 * Ordena productos según el orden predefinido de SKUs
 * Los productos con SKUs no definidos van al final, ordenados alfabéticamente
 * @param {Array} products - Array de productos a ordenar
 * @returns {Array} - Array de productos ordenados
 */
export const sortProductsBySku = (products) => {
  if (!Array.isArray(products)) return [];

  return [...products].sort((a, b) => {
    const skuA = a.sku?.toUpperCase();
    const skuB = b.sku?.toUpperCase();

    const indexA = SKU_ORDER.indexOf(skuA);
    const indexB = SKU_ORDER.indexOf(skuB);

    // Si ambos están en el orden definido
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    // Si solo uno está definido, ese va primero
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    // SKUs no definidos van al final, ordenados alfabéticamente
    return (skuA || '').localeCompare(skuB || '');
  });
};
