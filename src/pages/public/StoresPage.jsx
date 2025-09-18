import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Star, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { TextAnimate } from "../../components/ui/text-animate";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { FloatingOrderButton } from "../../components/common/FloatingOrderButton";
import { storeService } from "../../services/api";
import { formatPrice } from "../../lib/utils";

export function StoresPage() {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await storeService.getAllStores();
        setStores(response.data);
        if (response.data.length > 0) {
          setSelectedStore(response.data[0]);
        }
      } catch (error) {
        // Error silencioso en desarrollo - en producción usar sistema de logging
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  /**
   * Formatea los horarios de un local
   * @param {Object} hours - Objeto con horarios por día
   * @returns {JSX.Element[]} - Array de elementos JSX con horarios
   */
  const formatHours = (hours) => {
    return Object.entries(hours).map(([day, schedule]) => (
      <div key={day} className="flex justify-between text-sm">
        <span className="capitalize">{day.substring(0, 3)}</span>
        <span>{schedule.open} - {schedule.close}</span>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-empanada-dark text-white py-12 sm:py-16 lg:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-empanada-golden/20 to-empanada-warm/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <TextAnimate
            animation="slideUp"
            by="word"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2"
          >
            Nuestros Locales
          </TextAnimate>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-2"
          >
            Encuentra el local más cercano y disfruta nuestras empanadas frescas
          </motion.p>
        </div>
      </section>

      {/* Store Selector */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {stores.map((store) => (
              <Button
                key={store.id}
                variant={selectedStore?.id === store.id ? "empanada" : "outline"}
                onClick={() => setSelectedStore(store)}
                className="flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                {store.name.split(' - ')[1]}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Store Details */}
      {selectedStore && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Store Info */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                key={selectedStore.id}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <span className="text-3xl">🥟</span>
                      {selectedStore.name}
                      {selectedStore.isOpen && (
                        <Badge variant="success" className="ml-2">Abierto</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-empanada-golden mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Dirección</h4>
                        <p className="text-gray-600">{selectedStore.address}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-empanada-golden mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Teléfono</h4>
                        <a 
                          href={`tel:${selectedStore.phone}`}
                          className="text-empanada-golden hover:underline"
                        >
                          {selectedStore.phone}
                        </a>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-empanada-golden mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Horarios</h4>
                        <div className="space-y-1">
                          {formatHours(selectedStore.hours)}
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-empanada-golden mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Calificación</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-empanada-golden">
                            {selectedStore.rating}
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(selectedStore.rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="bg-empanada-golden/10 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Información de Delivery</h4>
                      <div className="space-y-1 text-sm">
                        <p>⏱️ Tiempo estimado: {selectedStore.deliveryTime}</p>
                        <p>🛒 Pedido mínimo: {formatPrice(selectedStore.minOrder)}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        variant="empanada" 
                        className="flex-1"
                        onClick={() => window.open(
                          `https://maps.google.com/?q=${selectedStore.coordinates.lat},${selectedStore.coordinates.lng}`,
                          '_blank'
                        )}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Cómo Llegar
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.open(`tel:${selectedStore.phone}`)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Llamar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                key={`map-${selectedStore.id}`}
              >
                <Card className="h-full">
                  <CardContent className="p-0">
                    <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-empanada-golden mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Mapa interactivo</p>
                        <p className="text-sm text-gray-500">
                          {selectedStore.address}
                        </p>
                        <Button
                          variant="empanada"
                          className="mt-4"
                          onClick={() => window.open(
                            `https://maps.google.com/?q=${selectedStore.coordinates.lat},${selectedStore.coordinates.lng}`,
                            '_blank'
                          )}
                        >
                          Ver en Google Maps
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* All Stores List */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Todos Nuestros Locales
            </h2>
            <p className="text-lg text-gray-600">
              Encuentra el más conveniente para ti
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedStore(store)}
                className="cursor-pointer"
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{store.name}</span>
                      {store.isOpen && (
                        <Badge variant="success">Abierto</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-empanada-golden" />
                        <span>{store.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-empanada-golden" />
                        <span>{store.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-empanada-golden" />
                        <span>{store.deliveryTime} • Min: {formatPrice(store.minOrder)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-empanada-golden" />
                        <span>{store.rating} estrellas</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FloatingOrderButton />
    </div>
  );
}
