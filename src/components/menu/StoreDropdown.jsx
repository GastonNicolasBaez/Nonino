import { useState } from 'react';
import { MapPin, ChevronDown, Check, Clock } from 'lucide-react';
import { usePublicData } from '@/context/PublicDataProvider';
import { useCart } from '@/context/CartProvider';
import { cn } from '@/lib/utils';

export function StoreDropdown({ className, variant = 'mobile' }) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    sucursales: stores,
    sucursalSeleccionada: selectedStoreId,
    setSucursalSeleccionada
  } = usePublicData();
  const { clearCart, items } = useCart();

  const selectedStore = stores.find(s => s.id === selectedStoreId);

  // Console log para debug
  console.log('[StoreDropdown] selectedStore:', selectedStore);
  console.log('[StoreDropdown] all stores:', stores);

  // Función para formatear tiempo de envío
  const formatDeliveryTime = (store) => {
    console.log('[StoreDropdown] formatDeliveryTime - store:', store);
    console.log('[StoreDropdown] candidate fields:', {
      deliveryTimeMinutes: store?.deliveryTimeMinutes,
      estimatedDeliveryTime: store?.estimatedDeliveryTime,
      deliveryTime: store?.deliveryTime,
      statusData: store?.statusData
    });
    const deliveryTime = store.deliveryTimeMinutes || store.estimatedDeliveryTime || store.deliveryTime;
    if (!deliveryTime || deliveryTime === 0) return null;
    
    const minTime = parseInt(deliveryTime);
    const maxTime = minTime + 15; // Añadir 15 minutos al tiempo base
    return `${minTime}-${maxTime} min`;
  };

  const handleSelectStore = (storeId) => {
    // Si hay items en el carrito y cambias de sucursal, limpiar
    if (items.length > 0 && storeId !== selectedStoreId) {
      const confirmChange = window.confirm(
        'Al cambiar de sucursal se vaciará tu carrito. ¿Continuar?'
      );
      if (!confirmChange) {
        setIsOpen(false);
        return;
      }
      clearCart();
    }

    setSucursalSeleccionada(storeId);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-3 bg-empanada-medium border border-empanada-light-gray rounded-lg hover:border-empanada-golden transition-colors",
          variant === 'desktop' 
            ? "px-3 py-2" 
            : "px-4 py-3"
        )}
      >
        <div className="flex items-center gap-2 flex-1 text-left">
          <MapPin className={cn(
            "text-empanada-golden flex-shrink-0",
            variant === 'desktop' ? "w-4 h-4" : "w-5 h-5"
          )} />
          <div>
            <p className={cn(
              "font-medium text-white",
              variant === 'desktop' ? "text-xs" : "text-sm"
            )}>
              {selectedStore?.name || "Selecciona tu sucursal"}
            </p>
            {selectedStore && variant === 'mobile' && (
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-400">
                  {selectedStore.barrio}
                </p>
                {formatDeliveryTime(selectedStore) && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDeliveryTime(selectedStore)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "text-gray-400 transition-transform",
            variant === 'desktop' ? "w-4 h-4" : "w-5 h-5",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-empanada-medium border border-empanada-light-gray rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => handleSelectStore(store.id)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-empanada-dark transition-colors border-b border-empanada-light-gray last:border-0",
                  selectedStoreId === store.id && "bg-empanada-dark/50"
                )}
              >
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-white">
                    {store.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {store.street} {store.number} - {store.barrio}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      store.statusData.isOpenNow
                        ? "bg-green-700 text-white"
                        : "bg-red-700 text-white"
                    )}>
                      {store.statusData.isOpenNow ? "Abierto" : "Cerrado"}
                    </span>
                    {formatDeliveryTime(store) && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatDeliveryTime(store)}</span>
                      </div>
                    )}
                  </div>
                </div>
                {selectedStoreId === store.id && (
                  <Check className="w-5 h-5 text-empanada-golden flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
