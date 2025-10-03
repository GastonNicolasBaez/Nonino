/**
 * Exportación centralizada de hooks personalizados
 * Evita problemas con React Fast Refresh
 */

export { useAuth } from '../context/AuthContext';
export { useCart } from '../context/CartProvider';
export { useTheme } from '../context/ThemeProvider';
export { useLoading } from './useLoading';
export { useScrollToTop } from './useScrollToTop';
export { useDropdownPosition } from './useDropdownPosition';