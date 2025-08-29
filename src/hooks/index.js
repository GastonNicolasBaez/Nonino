/**
 * Exportación centralizada de hooks personalizados
 * Evita problemas con React Fast Refresh
 */

export { useAuth } from '../context/AuthContext';
export { useCart } from '../context/CartContext';
export { useTheme } from '../context/ThemeContext';
export { useLoading } from './useLoading';