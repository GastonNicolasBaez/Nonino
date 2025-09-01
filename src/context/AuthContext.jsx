import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem, validateEmail } from '../lib/utils';
import { authService } from '../services/api';
import { DEV_CREDENTIALS, DEV_CONFIG, SECURITY_CONFIG, ERROR_MESSAGES } from '../config/constants';

const AuthContext = createContext();

/**
 * Usuario administrador por defecto para desarrollo local
 * NOTA: En producción, nunca usar credenciales hardcodeadas.
 * Usar variables de entorno o configuración segura.
 */
const DEFAULT_ADMIN = {
  id: 'admin-001',
  email: DEV_CREDENTIALS.admin.email,
  password: DEV_CREDENTIALS.admin.password,
  name: 'Administrador',
  role: 'admin',
  avatar: null,
  createdAt: new Date().toISOString(),
  permissions: ['all']
};

/**
 * Verifica si estamos en modo desarrollo
 * @returns {boolean} - True si estamos en desarrollo
 */
const isDevelopment = () => {
  return import.meta.env.DEV && DEV_CONFIG.enableDevMode;
};

/**
 * Hook para usar el contexto de autenticación
 * @returns {Object} - Objeto con funciones y estado de autenticación
 * @throws {Error} - Si se usa fuera del AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de autenticación
 * Maneja el estado de autenticación y persistencia en localStorage
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Verificar si hay un usuario guardado al iniciar
    const savedUser = getStorageItem('user');
    const savedToken = getStorageItem('authToken');
    
    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  /**
   * Inicia sesión de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} - Resultado de la operación con success, user y error
   * @throws {Error} - Si hay un error crítico
   */
  const login = async (email, password) => {
    // Validar parámetros de entrada
    if (!email || !password) {
      return {
        success: false,
        error: 'Email y contraseña son requeridos'
      };
    }

    // Validar formato de email
    if (!validateEmail(email)) {
      return {
        success: false,
        error: 'Formato de email inválido'
      };
    }

    setLoading(true);

    try {
      // Verificar si es el usuario administrador por defecto (solo en desarrollo)
      if (isDevelopment() && email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        console.warn('⚠️ Usando credenciales de desarrollo. En producción, esto debería estar deshabilitado.');

        const userData = {
          id: DEFAULT_ADMIN.id,
          email: DEFAULT_ADMIN.email,
          name: DEFAULT_ADMIN.name,
          role: DEFAULT_ADMIN.role,
          permissions: DEFAULT_ADMIN.permissions,
          avatar: DEFAULT_ADMIN.avatar
        };

        const authToken = `default-admin-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        setUser(userData);
        setToken(authToken);
        setStorageItem('user', userData);
        setStorageItem('authToken', authToken);

        return { success: true, user: userData };
      }

      // Intentar autenticación con el backend
      try {
        const response = await authService.login(email, password);
        const { user: userData, token: authToken } = response.data;

        // Validar que el usuario tenga los campos requeridos
        if (!userData.id || !userData.email || !userData.role) {
          return {
            success: false,
            error: 'Respuesta del servidor inválida'
          };
        }

        setUser(userData);
        setToken(authToken);
        setStorageItem('user', userData);
        setStorageItem('authToken', authToken);

        return { success: true, user: userData };

      } catch (backendError) {
        console.error('Error de backend:', backendError);

        // Manejar diferentes tipos de errores
        if (backendError.code === 'ERR_NETWORK') {
          return {
            success: false,
            error: ERROR_MESSAGES.network
          };
        }

        if (backendError.response?.status === 401) {
          return {
            success: false,
            error: 'Credenciales incorrectas'
          };
        }

        if (backendError.response?.status === 429) {
          return {
            success: false,
            error: 'Demasiados intentos. Inténtalo de nuevo más tarde.'
          };
        }

        return {
          success: false,
          error: backendError.response?.data?.message || ERROR_MESSAGES.unknown
        };
      }
    } catch (error) {
      console.error('Error crítico en login:', error);
      return {
        success: false,
        error: 'Error interno del sistema'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      const { user: newUser, token: authToken } = response.data;

      setUser(newUser);
      setToken(authToken);
      setStorageItem('user', newUser);
      setStorageItem('authToken', authToken);

      setLoading(false);
      return { success: true, user: newUser };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setUser(null);
      setToken(null);
      removeStorageItem('user');
      removeStorageItem('authToken');
      removeStorageItem('cart');
    }
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    setStorageItem('user', updatedUser);
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    isCustomer,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
