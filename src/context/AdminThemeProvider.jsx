/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminThemeContext = createContext();

/**
 * Hook para usar el contexto de tema del admin
 * @returns {Object} - Objeto con funciones y estado del tema
 * @throws {Error} - Si se usa fuera del AdminThemeProvider
 */
export function useAdminTheme() {
    const context = useContext(AdminThemeContext);
    if (!context) {
        throw new Error('useAdminTheme debe ser usado dentro de un AdminThemeProvider');
    }
    return context;
};

/**
 * Proveedor del contexto de tema para el panel de administración
 * Siempre usa modo oscuro y no permite cambiar a modo claro
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 */
const AdminThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark'); // Siempre oscuro

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add('dark'); // Forzar siempre modo oscuro
        localStorage.setItem('admin-theme', 'dark');
    }, []);

    // Funciones deshabilitadas para el admin
    const toggleTheme = () => {
        // No hacer nada - modo claro deshabilitado
        console.warn('Modo claro deshabilitado en el panel de administración');
    };

    const setLightTheme = () => {
        // No hacer nada - modo claro deshabilitado
        console.warn('Modo claro deshabilitado en el panel de administración');
    };

    const setDarkTheme = () => {
        // Ya está en modo oscuro, no hacer nada
    };

    const value = {
        theme: 'dark', // Siempre oscuro
        toggleTheme,
        setLightTheme,
        setDarkTheme,
        isDark: true, // Siempre true
        isLight: false, // Siempre false
    };

    return (
        <AdminThemeContext.Provider value={value}>
            {children}
        </AdminThemeContext.Provider>
    );
};

export default AdminThemeProvider;
