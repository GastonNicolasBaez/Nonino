/**
 * Constantes globales de la aplicación
 * Centraliza valores hardcodeados para mejor mantenimiento
 */

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer'
};

// Estados de pedidos
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed', 
  PREPARING: 'preparing',
  READY: 'ready',
  IN_DELIVERY: 'inDelivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Claves de localStorage
export const STORAGE_KEYS = {
  USER: 'user',
  AUTH_TOKEN: 'authToken',
  CART: 'cart',
  THEME: 'theme'
};

// Configuración de la aplicación
export const APP_CONFIG = {
  BASE_DELIVERY_TIME: 30, // minutos
  MIN_ORDER_AMOUNT: 2000, // pesos argentinos
  FREE_DELIVERY_THRESHOLD: 3000, // pesos argentinos
  DEFAULT_TIMEOUT: 10000 // ms para requests
};

// URLs externas
export const EXTERNAL_URLS = {
  GOOGLE_MAPS_BASE: 'https://maps.google.com/?q='
};

// Multiplicadores de zona para delivery
export const ZONE_MULTIPLIERS = {
  centro: 1,
  norte: 1.2,
  sur: 1.3,
  este: 1.4,
  oeste: 1.1
};