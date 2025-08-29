import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, generateOrderId } from '../lib/utils';
import { toast } from 'sonner';

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

  useEffect(() => {
    // Cargar carrito guardado
    const savedCart = getStorageItem('cart', {});
    if (savedCart.items) setItems(savedCart.items);
    if (savedCart.selectedStore) setSelectedStore(savedCart.selectedStore);
    if (savedCart.deliveryInfo) setDeliveryInfo(savedCart.deliveryInfo);
    if (savedCart.promoCode) setPromoCode(savedCart.promoCode);
  }, []);

  useEffect(() => {
    // Guardar carrito en localStorage
    setStorageItem('cart', {
      items,
      selectedStore,
      deliveryInfo,
      promoCode,
    });
  }, [items, selectedStore, deliveryInfo, promoCode]);

  const addItem = (product, quantity = 1, customizations = {}) => {
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

    toast.success(`${product.name} agregado al carrito`);
  };

  const removeItem = (itemId, customizations = {}) => {
    const updatedItems = items.filter(
      item => !(
        item.id === itemId && 
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
      )
    );
    setItems(updatedItems);
    toast.info('Producto eliminado del carrito');
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
    toast.info('Carrito vaciado');
  };

  const applyPromoCode = (code) => {
    // Códigos promocionales simulados
    const promoCodes = {
      'BIENVENIDO10': { discount: 10, type: 'percentage', description: '10% de descuento' },
      'ENVIOGRATIS': { discount: 0, type: 'free_shipping', description: 'Envío gratuito' },
      'EMPANADAS20': { discount: 20, type: 'percentage', description: '20% de descuento' },
      'NUEVOCLIENTE': { discount: 15, type: 'percentage', description: '15% de descuento para nuevos clientes' },
    };

    const promo = promoCodes[code.toUpperCase()];
    if (promo) {
      setPromoCode({ code: code.toUpperCase(), ...promo });
      toast.success(`Código promocional aplicado: ${promo.description}`);
      return true;
    } else {
      toast.error('Código promocional inválido');
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode(null);
    toast.info('Código promocional removido');
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

  const createOrder = async () => {
    const order = {
      id: generateOrderId(),
      items: [...items],
      subtotal,
      discount,
      deliveryFee,
      total,
      promoCode,
      selectedStore,
      deliveryInfo,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedDelivery: deliveryInfo?.estimatedTime || '45-60 min',
    };

    // Simular procesamiento del pedido
    toast.success('Pedido creado exitosamente');
    clearCart();
    
    return order;
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
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
