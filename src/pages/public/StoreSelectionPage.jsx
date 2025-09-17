import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Truck, MapPin, Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";

export function StoreSelectionPage() {
  const [selectedStore, setSelectedStore] = useState(null);
  const navigate = useNavigate();

  // Mock data de sucursales
  const stores = [
    {
      id: 1,
      name: "Sucursal Centro",
      address: "Av. Corrientes 1234, CABA",
      hours: "Lun-Dom: 10:00 - 23:00",
      deliveryTime: "30-45 min",
      deliveryFee: 0,
      minOrder: 3000,
      isOpen: true
    },
    {
      id: 2,
      name: "Sucursal Palermo",
      address: "Av. Santa Fe 2345, CABA",
      hours: "Lun-Dom: 11:00 - 00:00",
      deliveryTime: "25-40 min",
      deliveryFee: 500,
      minOrder: 2500,
      isOpen: true
    },
    {
      id: 3,
      name: "Sucursal Belgrano",
      address: "Av. Cabildo 3456, CABA",
      hours: "Lun-Dom: 10:30 - 22:30",
      deliveryTime: "35-50 min",
      deliveryFee: 300,
      minOrder: 2000,
      isOpen: false
    }
  ];

  const handleSelectStore = (store) => {
    setSelectedStore(store);
    // Ir directamente al menú
    localStorage.setItem('selectedStore', JSON.stringify(store));
    navigate('/menu');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Store className="w-8 h-8 text-empanada-golden" />
          <h1 className="text-3xl font-bold text-gray-900">
            Elige tu Sucursal
          </h1>
        </div>
        <p className="text-gray-600 mb-6">
          Selecciona la sucursal más cercana para hacer tu pedido
        </p>
        
        <div className="space-y-3 mb-6">
          {stores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                        className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                          selectedStore?.id === store.id
                            ? 'bg-empanada-golden/10 border-empanada-golden border-2'
                            : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                        }`}
                onClick={() => handleSelectStore(store)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 text-sm">{store.name}</h3>
                        <Badge 
                          className={`text-xs px-2 py-0.5 ${
                            store.isOpen 
                              ? 'bg-green-500 text-white' 
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {store.isOpen ? "Abierto" : "Cerrado"}
                        </Badge>
                      </div>
                              <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                        <MapPin className="w-3 h-3" />
                        <span>{store.address}</span>
                      </div>
                    </div>
                    {selectedStore?.id === store.id && (
                            <CheckCircle className="w-5 h-5 text-empanada-golden flex-shrink-0" />
                    )}
                  </div>
                  
                  {/* Información compacta */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-empanada-rich">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{store.hours}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      <span>{store.deliveryTime}</span>
                      <span className="font-semibold">
                        {store.deliveryFee === 0 ? "Gratis" : `$${store.deliveryFee}`}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-empanada-terracotta mt-1">
                    Mín: ${store.minOrder}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}