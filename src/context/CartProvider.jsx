/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../lib/utils';
import { STORAGE_KEYS } from '../constants';
import { toast } from 'sonner';
import { orderService } from '../services/api';
import { useIsMobile } from '../hooks/useMediaQuery';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [promoCode, setPromoCode] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Cargar carrito guardado
    const savedCart = getStorageItem(STORAGE_KEYS.CART, {});
    if (savedCart.items) setItems(savedCart.items);
    if (savedCart.selectedStore) setSelectedStore(savedCart.selectedStore);
    if (savedCart.deliveryInfo) setDeliveryInfo(savedCart.deliveryInfo);
    if (savedCart.promoCode) setPromoCode(savedCart.promoCode);
  }, []);

  useEffect(() => {
    // Guardar carrito en localStorage
    setStorageItem(STORAGE_KEYS.CART, {
      items,
      selectedStore,
      deliveryInfo,
      promoCode,
    });
  }, [items, selectedStore, deliveryInfo, promoCode]);

  const addItem = (product, quantity = 1, customizations = {}, isCombo = false) => {
    // Manejo especial para combos
    if (isCombo) {
      const comboItem = {
        id: `combo-${product.id}-${Date.now()}`,
        name: product.name,
        price: product.price,
        image: product.image,
        category: 'combo',
        quantity: 1,
        isCombo: true,
        comboDetails: customizations.comboDetails || [],
        comboId: product.id,
        addedAt: new Date().toISOString(),
      };
      setItems([...items, comboItem]);
      // Solo mostrar toast en desktop
      if (!isMobile) {
        toast.success(`${product.name} agregado al carrito`);
      }
      return;
    }

    // Lógica existente para productos normales
    const existingItemIndex = items.findIndex(
      item => 
        item.id === product.id && 
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      setItems(updatedItems);
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity,
        customizations,
        addedAt: new Date().toISOString(),
      };
      setItems([...items, newItem]);
    }

    // Toast removido para mejor fluidez UX
  };

  const removeItem = (itemId, customizations = {}) => {
    const updatedItems = items.filter(item => {
      // Para combos, el ID ya es único (combo-${id}-${timestamp})
      if (item.isCombo) {
        return item.id !== itemId;
      }
      // Para productos normales, comparar ID y customizations
      return !(
        item.id === itemId && 
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
      );
    });
    setItems(updatedItems);
    // Toast removido para mejor fluidez UX
  };

  const updateQuantity = (itemId, customizations, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId, customizations);
      return;
    }

    const updatedItems = items.map(item => {
      if (
        item.id === itemId && 
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
      ) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setItems(updatedItems);
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
    // Limpiar también los totales guardados para el pago
    localStorage.removeItem('pendingPaymentTotals');
    // Toast removido para mejor fluidez UX
  };

  const savePendingPaymentTotals = (orderId = null) => {
    // Guardar los totales actuales para mantenerlos durante la redirección a MercadoPago
    const totals = {
      orderId,
      subtotal,
      discount,
      deliveryFee,
      total,
      itemCount,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('pendingPaymentTotals', JSON.stringify(totals));
  };

  const applyPromoCode = (code) => {
    // Los códigos promocionales se validarán contra el backend
    setPromoCode({ code: code.toUpperCase() });
    // Toast removido para mejor fluidez UX
    return true;
  };

  const removePromoCode = () => {
    setPromoCode(null);
    // Toast removido para mejor fluidez UX
  };

  const updateStore = (store) => {
    setSelectedStore(store);
  };

  const updateDeliveryInfo = (info) => {
    setDeliveryInfo(info);
  };

  // Cálculos
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const discount = promoCode ? 
    (promoCode.type === 'percentage' ? subtotal * (promoCode.discount / 100) : promoCode.discount) : 0;
  
  const deliveryFee = deliveryInfo && promoCode?.type !== 'free_shipping' ? 
    (deliveryInfo.zone === 'centro' ? 0 : 500) : 0;
  
  const total = subtotal - discount + deliveryFee;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const createOrder = async (orderData) => {
    try {
      // Enviar al backend real
      const response = await orderService.createOrder(orderData);
      
      // Toast removido para mejor fluidez UX
      clearCart();
      return response.data;
    } catch (error) {
      console.error('Error enviando orden al backend:', error);
      // Solo mostrar toast en desktop
      if (!isMobile) {
        toast.error('Error al enviar el pedido');
      }
      throw error;
    }
  };

  const value = {
    items,
    selectedStore,
    deliveryInfo,
    promoCode,
    isOpen,
    subtotal,
    discount,
    deliveryFee,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
    updateStore,
    updateDeliveryInfo,
    createOrder,
    setIsOpen,
    savePendingPaymentTotals,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
