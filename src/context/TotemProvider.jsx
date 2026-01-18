/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getStorageItem, setStorageItem } from '@/lib/utils';
import { STORAGE_KEYS } from '@/constants';

export const TotemContext = createContext();

export const TotemProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [isInactive, setIsInactive] = useState(false);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [kioskModeActive, setKioskModeActive] = useState(false);

  // Cargar configuración del totem desde archivo JSON
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/totem-config.json');
        const data = await response.json();
        setConfig(data);

        // Si hay un storeId configurado y no se permite selección, auto-seleccionar
        if (data.storeId && !data.allowStoreSelection) {
          setSelectedStore(data.storeId);
        }
      } catch (error) {
        console.error('Error cargando configuración del totem:', error);
        // Configuración por defecto
        setConfig({
          storeId: null,
          allowStoreSelection: true,
          inactivityTimeout: 180,
          autoResetTimeout: 30,
          enableMercadoPago: true,
          enableCash: true,
          kioskMode: true,
        });
      } finally {
        setConfigLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Inicializar sesión
  useEffect(() => {
    startNewSession();
  }, []);

  // Monitor de actividad
  useEffect(() => {
    if (!config) return;

    const activityEvents = ['mousedown', 'touchstart', 'keydown'];

    const handleActivity = () => {
      setLastActivityTime(Date.now());
      setIsInactive(false);
      setShowInactivityWarning(false);
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [config]);

  // Verificar inactividad
  useEffect(() => {
    if (!config) return;

    const checkInactivity = setInterval(() => {
      // CRÍTICO: Verificar pathname dinámicamente en cada iteración
      const currentPath = window.location.pathname;
      const shouldNotRunTimer = currentPath === '/totem/welcome' || currentPath === '/totem';

      if (shouldNotRunTimer) {
        console.log('[TOTEM] Timer pausado - ruta:', currentPath);
        return; // No ejecutar timer en welcome o login
      }

      const now = Date.now();
      const timeSinceLastActivity = (now - lastActivityTime) / 1000; // segundos

      console.log('[TOTEM] Timer activo - inactividad:', Math.floor(timeSinceLastActivity), 'segundos');

      // Mostrar warning 30 segundos antes del reset
      if (timeSinceLastActivity >= config.inactivityTimeout - config.autoResetTimeout &&
          timeSinceLastActivity < config.inactivityTimeout) {
        console.log('[TOTEM] Mostrando warning de inactividad');
        setShowInactivityWarning(true);
      }

      // Reset automático
      if (timeSinceLastActivity >= config.inactivityTimeout) {
        console.log('[TOTEM] Timeout alcanzado - reseteando sesión');
        setIsInactive(true);
        resetSession();
      }
    }, 1000);

    return () => clearInterval(checkInactivity);
  }, [config, lastActivityTime]);

  // Funciones de sesión
  const startNewSession = useCallback(() => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setSessionStartTime(Date.now());
    setLastActivityTime(Date.now());
    setIsInactive(false);
    setShowInactivityWarning(false);

    // Log para analytics
    logEvent('session_started', { sessionId: newSessionId });
  }, []);

  const resetSession = useCallback(() => {
    // IMPORTANTE: NO cerrar sesión del usuario (mantener login)
    // Solo limpiar el pedido actual y volver a la página de bienvenida

    setShowInactivityWarning(false);

    // Log para analytics
    logEvent('session_reset', {
      sessionId,
      reason: isInactive ? 'inactivity' : 'manual',
      duration: Date.now() - sessionStartTime
    });

    // Limpiar el carrito antes de redirigir
    // Limpiamos directamente el localStorage en lugar de usar useCart hook
    setStorageItem(STORAGE_KEYS.CART, {
      items: [],
      selectedStore: null,
      deliveryInfo: null,
      promoCode: null,
    });

    // Iniciar nueva sesión de pedido (NO de login)
    startNewSession();

    // Navegar a la página de bienvenida (mantiene la sesión de usuario activa)
    // NO navegar a /totem (login), sino a /totem/welcome
    window.location.href = '/totem/welcome';
  }, [sessionId, sessionStartTime, isInactive, config]);

  const updateStore = useCallback((storeId) => {
    setSelectedStore(storeId);
    setStorageItem('totem_selected_store', storeId);

    logEvent('store_selected', { sessionId, storeId });
  }, [sessionId]);

  const logEvent = (eventName, data = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      sessionId,
      event: eventName,
      ...data
    };

    console.log('[TOTEM LOG]', logEntry);

    // Guardar en localStorage para análisis posterior
    const logs = getStorageItem('totem_logs', []);
    logs.push(logEntry);

    // Mantener solo los últimos 100 eventos
    if (logs.length > 100) {
      logs.shift();
    }

    setStorageItem('totem_logs', logs);
  };

  const enterKioskMode = useCallback(() => {
    if (!config?.kioskMode) return;

    // Intentar fullscreen
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {
        console.log('Error al entrar en fullscreen:', err);
      });
    }

    // Prevenir zoom con gestos
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    document.addEventListener('gestureend', (e) => e.preventDefault());

    // Prevenir menú contextual
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    setKioskModeActive(true);
    logEvent('kiosk_mode_activated', { sessionId });
  }, [config, sessionId]);

  const exitKioskMode = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => {
        console.log('Error al salir de fullscreen:', err);
      });
    }

    setKioskModeActive(false);
    logEvent('kiosk_mode_deactivated', { sessionId });
  }, [sessionId]);

  const value = {
    // Configuración
    config,
    configLoading,

    // Sesión
    sessionId,
    sessionStartTime,
    selectedStore,

    // Inactividad
    lastActivityTime,
    isInactive,
    showInactivityWarning,

    // Kiosk mode
    kioskModeActive,

    // Funciones
    updateStore,
    resetSession,
    startNewSession,
    logEvent,
    enterKioskMode,
    exitKioskMode,
  };

  return (
    <TotemContext.Provider value={value}>
      {children}
    </TotemContext.Provider>
  );
};

export const useTotem = () => {
  const context = useContext(TotemContext);
  if (!context) {
    throw new Error('useTotem debe ser usado dentro de un TotemProvider');
  }
  return context;
};

export default TotemProvider;
