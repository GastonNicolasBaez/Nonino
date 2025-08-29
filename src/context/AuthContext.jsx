import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '../lib/utils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

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

  const login = async (email, password, isAdmin = false) => {
    setLoading(true);
    try {
      // Simulación de login - En producción sería una llamada real a la API
      const mockUser = {
        id: isAdmin ? 'admin-1' : 'user-1',
        email,
        name: isAdmin ? 'Administrador' : 'Usuario Cliente',
        role: isAdmin ? 'admin' : 'customer',
        avatar: null,
        preferences: {
          notifications: true,
          theme: 'light'
        }
      };

      const mockToken = `jwt-token-${Date.now()}`;

      setUser(mockUser);
      setToken(mockToken);
      setStorageItem('user', mockUser);
      setStorageItem('authToken', mockToken);

      setLoading(false);
      return { success: true, user: mockUser };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // Simulación de registro
      const newUser = {
        id: `user-${Date.now()}`,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: 'customer',
        avatar: null,
        addresses: [],
        preferences: {
          notifications: true,
          theme: 'light'
        }
      };

      const mockToken = `jwt-token-${Date.now()}`;

      setUser(newUser);
      setToken(mockToken);
      setStorageItem('user', newUser);
      setStorageItem('authToken', mockToken);

      setLoading(false);
      return { success: true, user: newUser };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeStorageItem('user');
    removeStorageItem('authToken');
    removeStorageItem('cart');
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
