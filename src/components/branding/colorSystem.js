/**
 * SISTEMA DE COLORES CENTRALIZADO - NONINO
 * Paleta "Tradición Argentina" - Empanada
 *
 * Este archivo centraliza todos los colores utilizados en la aplicación
 * tanto para áreas públicas como administrativas.
 */

// ============================================
// PALETA BASE - EMPANADA
// ============================================

export const empanadaColors = {
  // Dorados y cálidos
  golden: '#d4af37',
  warm: '#b8860b',
  rich: '#8b4513',

  // Neutros claros
  cream: '#f5f5dc',
  wheat: '#f0e68c',
  light: '#fdf5e6',

  // Terracota
  terracotta: '#cd853f',

  // Oscuros y fondos
  dark: '#1a1a1a',
  darker: '#0f0f0f',
  medium: '#2a2a2a',
  mediumLight: '#454545',
  lightGray: '#3a3a3a',
};

// ============================================
// COLORES DE ACENTO ARGENTINA
// ============================================

export const argentinaColors = {
  red: '#dc143c',
  green: '#228b22',
  orange: '#ff8c00',
};

// ============================================
// COLORES PARA ADMIN
// ============================================

export const adminColors = {
  // Backgrounds
  background: empanadaColors.dark,      // #1a1a1a
  backgroundDarker: empanadaColors.darker,  // #0f0f0f

  // Cards y contenedores
  card: empanadaColors.medium,          // #2a2a2a
  cardHover: empanadaColors.mediumLight, // #454545

  // Borders
  border: empanadaColors.lightGray,     // #3a3a3a
  borderLight: '#4b5563',

  // Inputs
  input: empanadaColors.medium,         // #2a2a2a
  inputFocus: empanadaColors.lightGray, // #3a3a3a
  inputBorder: empanadaColors.lightGray,

  // Sidebar
  sidebar: '#1f2937',
  sidebarHover: empanadaColors.medium,

  // Texto
  textPrimary: '#f9fafb',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',

  // Primary (dorado)
  primary: empanadaColors.golden,
  primaryHover: empanadaColors.warm,
  primaryForeground: '#ffffff',

  // Estados
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.8)',
};

// ============================================
// COLORES PARA PUBLIC
// ============================================

export const publicColors = {
  background: '#000000',
  backgroundDark: empanadaColors.darker,

  card: empanadaColors.dark,
  cardHover: empanadaColors.medium,

  primary: empanadaColors.golden,
  primaryGradientFrom: empanadaColors.golden,
  primaryGradientTo: empanadaColors.warm,

  text: '#ffffff',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',

  border: empanadaColors.lightGray,
};

// ============================================
// UTILIDADES DE TAILWIND
// ============================================

/**
 * Genera las clases de Tailwind para la paleta empanada
 * Estas se pueden usar directamente en los componentes
 */
export const empanadaTailwindClasses = {
  // Backgrounds
  bgDark: 'bg-empanada-dark',
  bgDarker: 'bg-empanada-darker',
  bgMedium: 'bg-empanada-medium',
  bgLightGray: 'bg-empanada-light-gray',
  bgGolden: 'bg-empanada-golden',
  bgWarm: 'bg-empanada-warm',
  bgRich: 'bg-empanada-rich',

  // Text
  textGolden: 'text-empanada-golden',
  textWarm: 'text-empanada-warm',
  textRich: 'text-empanada-rich',
  textLight: 'text-gray-300',
  textWhite: 'text-white',

  // Borders
  borderLightGray: 'border-empanada-light-gray',
  borderGolden: 'border-empanada-golden',

  // Gradients
  gradientGolden: 'bg-gradient-to-r from-empanada-golden to-empanada-warm',
};

// ============================================
// MAPEO DE CLASES ADMIN
// ============================================

/**
 * Clases específicas para componentes admin
 * Estas clases aplican la paleta empanada de forma consistente
 */
export const adminTailwindClasses = {
  // Layout
  layout: 'bg-empanada-dark',
  sidebar: 'bg-empanada-dark border-empanada-light-gray',
  header: 'bg-empanada-medium border-empanada-light-gray',

  // Cards
  card: 'bg-empanada-medium border-empanada-light-gray hover:bg-empanada-light-gray',
  cardHeader: 'border-b border-empanada-light-gray',

  // Inputs
  input: 'bg-empanada-medium border-empanada-light-gray text-white placeholder:text-gray-400 focus:border-empanada-golden focus:bg-empanada-light-gray',
  select: 'bg-empanada-medium border-empanada-light-gray text-white focus:border-empanada-golden focus:bg-empanada-light-gray',

  // Buttons
  buttonPrimary: 'bg-empanada-golden hover:bg-empanada-warm text-white',
  buttonSecondary: 'bg-empanada-medium hover:bg-empanada-light-gray text-white border border-empanada-light-gray',
  buttonGhost: 'hover:bg-empanada-medium text-gray-300',

  // Tables
  tableHeader: 'bg-empanada-medium text-gray-300',
  tableRow: 'hover:bg-empanada-medium border-b border-empanada-light-gray',
  tableRowEven: 'bg-empanada-dark/50',

  // Badges
  badgeSuccess: 'bg-green-500/20 text-green-400 border border-green-500/30',
  badgeWarning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  badgeError: 'bg-red-500/20 text-red-400 border border-red-500/30',
  badgeInfo: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',

  // Navigation
  navItem: 'hover:bg-empanada-medium text-gray-300 hover:text-white',
  navItemActive: 'bg-empanada-golden text-white',

  // Modal
  modalOverlay: 'bg-black/80 backdrop-blur-sm',
  modalContent: 'bg-empanada-medium border border-empanada-light-gray',
};

// ============================================
// FUNCIONES HELPER
// ============================================

/**
 * Obtiene un color de la paleta empanada
 * @param {string} colorName - Nombre del color
 * @returns {string} - Código hexadecimal del color
 */
export const getEmpanadaColor = (colorName) => {
  return empanadaColors[colorName] || '#000000';
};

/**
 * Obtiene un color admin
 * @param {string} colorName - Nombre del color
 * @returns {string} - Código del color
 */
export const getAdminColor = (colorName) => {
  return adminColors[colorName] || '#000000';
};

/**
 * Genera una clase de Tailwind con el color empanada
 * @param {string} type - Tipo de clase (bg, text, border)
 * @param {string} colorName - Nombre del color
 * @returns {string} - Clase de Tailwind
 */
export const getEmpanadaClass = (type, colorName) => {
  return `${type}-empanada-${colorName}`;
};

export default {
  empanadaColors,
  argentinaColors,
  adminColors,
  publicColors,
  empanadaTailwindClasses,
  adminTailwindClasses,
  getEmpanadaColor,
  getAdminColor,
  getEmpanadaClass,
};
