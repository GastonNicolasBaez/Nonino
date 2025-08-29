import { useState } from 'react';

/**
 * Hook personalizado para manejar estados de carga
 * Simplifica el manejo de loading states y reduce código duplicado
 * @returns {Object} - Objeto con estado y funciones de loading
 */
export const useLoading = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Ejecuta una función asíncrona con manejo automático de loading
   * @param {Function} asyncFn - Función asíncrona a ejecutar
   * @param {...*} args - Argumentos para la función
   * @returns {Promise} - Resultado de la función
   */
  const withLoading = async (asyncFn, ...args) => {
    setLoading(true);
    try {
      return await asyncFn(...args);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    withLoading
  };
};