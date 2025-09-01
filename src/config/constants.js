/**
 * Constantes de configuración para la aplicación Nonino Empanadas
 * Este archivo contiene todas las configuraciones constantes y valores por defecto
 */

/**
 * Configuración de la aplicación
 */
export const APP_CONFIG = {
  name: 'Nonino Empanadas',
  version: '1.0.0',
  description: 'Sistema de gestión para Nonino Empanadas'
};

/**
 * Configuración de seguridad
 */
export const SECURITY_CONFIG = {
  maxLoginAttempts: 3,
  sessionTimeoutMinutes: 60,
  passwordMinLength: 6,
  tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutos antes de expirar
};

/**
 * Configuración de validaciones
 */
export const VALIDATION_CONFIG = {
  email: {
    maxLength: 254,
    pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  },
  phone: {
    minLength: 10,
    maxLength: 15,
    pattern: /^(\+54|54|0)?[1-9]\d{9,11}$/
  },
  password: {
    minLength: 6,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false
  }
};

/**
 * Configuración de la API
 */
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  retries: 3,
  retryDelay: 1000
};

/**
 * Configuración de desarrollo
 */
export const DEV_CONFIG = {
  enableDevMode: import.meta.env.VITE_ENABLE_DEV_MODE === 'true',
  enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  enableDebugLogs: import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true'
};

/**
 * Configuración de características
 */
export const FEATURE_CONFIG = {
  notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
  analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  darkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
  pwa: import.meta.env.VITE_ENABLE_PWA === 'true'
};

/**
 * Credenciales por defecto para desarrollo
 * ⚠️ NUNCA usar en producción
 */
export const DEV_CREDENTIALS = {
  admin: {
    email: import.meta.env.VITE_DEFAULT_ADMIN_EMAIL || 'admin@noninoempanadas.com',
    password: import.meta.env.VITE_DEFAULT_ADMIN_PASSWORD || 'admin123'
  },
  user: {
    email: import.meta.env.VITE_DEFAULT_USER_EMAIL || 'user@example.com',
    password: import.meta.env.VITE_DEFAULT_USER_PASSWORD || 'user123'
  }
};

/**
 * Mensajes de error comunes
 */
export const ERROR_MESSAGES = {
  network: 'Error de conexión. Verifica tu conexión a internet.',
  server: 'Error del servidor. Inténtalo de nuevo más tarde.',
  validation: 'Por favor, verifica los datos ingresados.',
  unauthorized: 'No tienes permisos para realizar esta acción.',
  notFound: 'El recurso solicitado no fue encontrado.',
  timeout: 'La solicitud tardó demasiado tiempo. Inténtalo de nuevo.',
  unknown: 'Ha ocurrido un error inesperado.'
};

/**
 * Estados de carga
 */
export const LOADING_STATES = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error'
};

/**
 * Roles de usuario
 */
export const USER_ROLES = {
  admin: 'admin',
  customer: 'customer',
  guest: 'guest'
};

/**
 * Estados de pedido
 */
export const ORDER_STATUS = {
  pending: 'pending',
  confirmed: 'confirmed',
  preparing: 'preparing',
  ready: 'ready',
  delivered: 'delivered',
  cancelled: 'cancelled'
};

/**
 * Métodos de pago
 */
export const PAYMENT_METHODS = {
  cash: 'cash',
  card: 'card',
  transfer: 'transfer',
  digital: 'digital'
};

/**
 * Zonas de entrega
 */
export const DELIVERY_ZONES = {
  centro: { name: 'Centro', multiplier: 1 },
  norte: { name: 'Zona Norte', multiplier: 1.2 },
  sur: { name: 'Zona Sur', multiplier: 1.3 },
  este: { name: 'Zona Este', multiplier: 1.4 },
  oeste: { name: 'Zona Oeste', multiplier: 1.1 }
};

/**
 * Configuración de UI
 */
export const UI_CONFIG = {
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  },
  animation: {
    duration: 300,
    easing: 'ease-out'
  },
  toast: {
    duration: 5000,
    position: 'bottom-right'
  }
};
