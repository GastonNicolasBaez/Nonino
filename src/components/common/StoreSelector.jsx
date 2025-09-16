import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Star, Check, ChevronDown } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { storeService } from "../../services/api";
import { formatPrice } from "../../lib/utils";
import { useCart } from "../../context/CartProvider";

export function StoreSelector({ onStoreSelect, selectedStore, className = "" }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { selectedStore: cartStore } = useCart();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await storeService.getAllStores();
        setStores(response.data);
        // Si no hay una tienda seleccionada pero hay una en el carrito, usar esa
        if (!selectedStore && cartStore) {
          onStoreSelect(cartStore);
        }
      } catch (error) {
        console.error("Error cargando sucursales:", error);
        // Mock data para desarrollo
        const mockStores = [
          {
            id: 1,
            name: "Nonino - Centro",
            address: "Av. Córdoba 1234, CABA",
            phone: "+54 11 4567-8901",
            isOpen: true,
            rating: 4.8,
            deliveryTime: "30-45 min",
            minOrder: 2500,
            coordinates: { lat: -34.6037, lng: -58.3816 }
          },
          {
            id: 2,
            name: "Nonino - Palermo",
            address: "Av. Santa Fe 3456, CABA",
            phone: "+54 11 4567-8902",
            isOpen: true,
            rating: 4.9,
            deliveryTime: "25-40 min",
            minOrder: 2500,
            coordinates: { lat: -34.5897, lng: -58.3974 }
          },
          {
            id: 3,
            name: "Nonino - Belgrano",
            address: "Av. Cabildo 5678, CABA",
            phone: "+54 11 4567-8903",
            isOpen: false,
            rating: 4.7,
            deliveryTime: "35-50 min",
            minOrder: 3000,
            coordinates: { lat: -34.5627, lng: -58.4558 }
          }
        ];
        setStores(mockStores);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [cartStore, selectedStore, onStoreSelect]);

  const handleStoreSelect = (store) => {
    onStoreSelect(store);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-16 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Selected Store Display */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-auto p-4 justify-between items-center"
      >
        {selectedStore ? (
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 bg-empanada-golden/20 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-empanada-golden" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{selectedStore.name}</div>
              <div className="text-xs text-gray-600 truncate">{selectedStore.address}</div>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedStore.deliveryTime}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  {selectedStore.rating}
                </span>
                {selectedStore.isOpen && (
                  <Badge variant="success" className="text-xs py-0 px-1">Abierto</Badge>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-gray-600">Selecciona una sucursal</span>
          </div>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-50 mt-2"
          >
            <Card className="shadow-lg border">
              <CardContent className="p-2 max-h-80 overflow-y-auto">
                <div className="space-y-2">
                  {stores.map((store) => (
                    <motion.button
                      key={store.id}
                      onClick={() => handleStoreSelect(store)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedStore?.id === store.id
                          ? 'bg-empanada-golden/10 border-empanada-golden border'
                          : 'hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-empanada-golden/20 rounded-full flex items-center justify-center flex-shrink-0">
                          {selectedStore?.id === store.id ? (
                            <Check className="w-4 h-4 text-empanada-golden" />
                          ) : (
                            <MapPin className="w-4 h-4 text-empanada-golden" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm truncate">{store.name}</span>
                            {store.isOpen ? (
                              <Badge variant="success" className="text-xs">Abierto</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Cerrado</Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 truncate mb-1">{store.address}</div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {store.deliveryTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400" />
                              {store.rating}
                            </span>
                            <span>Min: {formatPrice(store.minOrder)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}