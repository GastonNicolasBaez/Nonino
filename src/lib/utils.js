import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina clases de CSS utilizando clsx y tailwind-merge
 * @param {...*} inputs - Clases a combinar
 * @returns {string} - String de clases combinadas
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un precio en pesos argentinos
 * @param {number} price - Precio a formatear
 * @returns {string} - Precio formateado
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price)
}

/**
 * Formatea una fecha en formato argentino
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Formatea una fecha y hora en formato argentino
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha y hora formateadas
 */
export function formatDateTime(date) {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

/**
 * Calcula el tiempo estimado de entrega basado en la zona
 * @param {string} zone - Zona de entrega
 * @param {Date} currentTime - Hora actual (opcional)
 * @returns {Object} - Objeto con minutos estimados y hora de entrega
 */
export function calculateDeliveryTime(zone, currentTime = new Date()) {
  // Importar constantes dinámicamente para evitar dependencias circulares
  const baseTime = 30; // minutos base
  const zoneMultipliers = {
    centro: 1,
    norte: 1.2,
    sur: 1.3,
    este: 1.4,
    oeste: 1.1
  };
  
  const multiplier = zoneMultipliers[zone] || 1;
  const estimatedMinutes = Math.round(baseTime * multiplier);
  
  const deliveryTime = new Date(currentTime.getTime() + estimatedMinutes * 60000);
  return {
    estimatedMinutes,
    deliveryTime: deliveryTime.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  };
}

/**
 * Genera un ID único para pedidos
 * @returns {string} - ID único del pedido
 */
export function generateOrderId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `EMP-${timestamp}-${random}`.toUpperCase();
}

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Valida formato de teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} - True si es válido
 */
export function validatePhone(phone) {
  const re = /^[+]?[1-9][\d]{0,15}$/;
  return re.test(phone.replace(/\s/g, ''));
}

/**
 * Convierte texto a slug URL-friendly
 * @param {string} text - Texto a convertir
 * @returns {string} - Slug generado
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Implementa debounce para limitar la frecuencia de ejecución de funciones
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} - Función con debounce aplicado
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Obtiene un item del localStorage con manejo de errores
 * @param {string} key - Clave del item
 * @param {*} defaultValue - Valor por defecto si no existe
 * @returns {*} - Valor obtenido o valor por defecto
 */
export function getStorageItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error leyendo clave "${key}" de localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Guarda un item en localStorage con manejo de errores
 * @param {string} key - Clave del item
 * @param {*} value - Valor a guardar
 */
export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error guardando clave "${key}" en localStorage:`, error);
  }
}

/**
 * Elimina un item del localStorage con manejo de errores
 * @param {string} key - Clave del item a eliminar
 */
export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error eliminando clave "${key}" de localStorage:`, error);
  }
}
