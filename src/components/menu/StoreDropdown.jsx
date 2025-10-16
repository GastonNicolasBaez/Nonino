import { useState } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { usePublicData } from '@/context/PublicDataProvider';
import { useCart } from '@/context/CartProvider';
import { cn } from '@/lib/utils';

export function StoreDropdown({ className }) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    sucursales: stores,
    sucursalSeleccionada: selectedStoreId,
    setSucursalSeleccionada
  } = usePublicData();
  const { clearCart, items } = useCart();

  const selectedStore = stores.find(s => s.id === selectedStoreId);

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
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-empanada-medium border border-empanada-light-gray rounded-lg hover:border-empanada-golden transition-colors"
      >
        <div className="flex items-center gap-2 flex-1 text-left">
          <MapPin className="w-5 h-5 text-empanada-golden flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-white">
              {selectedStore?.name || "Selecciona tu sucursal"}
            </p>
            {selectedStore && (
              <p className="text-xs text-gray-400">
                {selectedStore.barrio}
              </p>
            )}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-gray-400 transition-transform",
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
