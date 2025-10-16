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
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price)
}

/**
 * Formatea una fecha en formato argentino
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
export function formatDate(date) {
    if (!date) return 'Fecha no disponible';

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        console.warn('formatDate: Fecha inválida recibida:', date);
        return 'Fecha inválida';
    }

    return new Intl.DateTimeFormat('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(dateObj);
}

/**
 * Formatea una fecha y hora en formato argentino
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha y hora formateadas
 */
export function formatDateTime(date) {
    if (!date) return 'Fecha no disponible';

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        console.warn('formatDateTime: Fecha inválida recibida:', date);
        return 'Fecha inválida';
    }

    return new Intl.DateTimeFormat('es-AR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(dateObj);
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
 * Valida formato de email con expresiones regulares más robustas
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 * @example
 * validateEmail('usuario@dominio.com') // true
 * validateEmail('usuario') // false
 */
export function validateEmail(email) {
    if (!email || typeof email !== 'string') return false;

    // Expresión regular más robusta para emails
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return emailRegex.test(email.trim()) && email.length <= 254;
}

/**
 * Valida formato de teléfono internacional
 * @param {string} phone - Teléfono a validar (con o sin código de país)
 * @returns {boolean} - True si es válido
 * @example
 * validatePhone('+5491123456789') // true
 * validatePhone('91123456789') // true
 * validatePhone('abc') // false
 */
export function validatePhone(phone) {
    if (!phone || typeof phone !== 'string') return false;

    // Limpiar el teléfono de espacios, guiones y paréntesis
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');

    // Validar formato internacional o local argentino
    const phoneRegex = /^(\\+54|54|0)?[1-9]\d{9,11}$/;

    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

/**
 * Valida contraseña según criterios de seguridad
 * @param {string} password - Contraseña a validar
 * @param {Object} options - Opciones de validación
 * @param {number} options.minLength - Longitud mínima (default: 8)
 * @param {boolean} options.requireUppercase - Requiere mayúsculas (default: true)
 * @param {boolean} options.requireLowercase - Requiere minúsculas (default: true)
 * @param {boolean} options.requireNumbers - Requiere números (default: true)
 * @param {boolean} options.requireSpecialChars - Requiere caracteres especiales (default: false)
 * @returns {Object} - Resultado con isValid y errors
 * @example
 * validatePassword('MiPass123!') // { isValid: true, errors: [] }
 * validatePassword('123') // { isValid: false, errors: ['Mínimo 8 caracteres', ...] }
 */
export function validatePassword(password, options = {}) {
    const {
        minLength = 8,
        requireUppercase = true,
        requireLowercase = true,
        requireNumbers = true,
        requireSpecialChars = false
    } = options;

    const errors = [];

    if (!password || typeof password !== 'string') {
        return { isValid: false, errors: ['Contraseña requerida'] };
    }

    if (password.length < minLength) {
        errors.push(`Mínimo ${minLength} caracteres`);
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Al menos una letra mayúscula');
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Al menos una letra minúscula');
    }

    if (requireNumbers && !/\d/.test(password)) {
        errors.push('Al menos un número');
    }

    if (requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?/]/.test(password)) {
        errors.push('Al menos un carácter especial');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
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
 * Obtiene un item del localStorage con manejo de errores robusto
 * @param {string} key - Clave del item
 * @param {*} defaultValue - Valor por defecto si no existe
 * @returns {*} - Valor obtenido o valor por defecto
 * @throws {Error} - Si hay un error crítico (solo en desarrollo)
 * @example
 * const user = getStorageItem('user', {});
 * const theme = getStorageItem('theme', 'light');
 */
export function getStorageItem(key, defaultValue = null) {
    if (!key || typeof key !== 'string') {
        console.warn('getStorageItem: La clave debe ser un string no vacío');
        return defaultValue;
    }

    try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        // Intentar parsear JSON
        return JSON.parse(item);
    } catch (error) {
        // Si hay error de parseo, intentar devolver el valor raw
        try {
            const rawItem = localStorage.getItem(key);
            if (rawItem !== null) {
                console.warn(`getStorageItem: Error parseando JSON para "${key}", devolviendo valor raw`);
                return rawItem;
            }
        } catch {
            // Si tampoco se puede obtener el valor raw, devolver default
        }

        console.error(`getStorageItem: Error obteniendo "${key}" de localStorage:`, error);
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
