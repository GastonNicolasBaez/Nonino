import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Truck, MapPin, Store, BikeIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";
import { usePublicData } from "@/context/PublicDataProvider";

export function StoreSelectionPage() {
    const navigate = useNavigate();

    const {
        sucursales: stores,
        sucursalSeleccionada: selectedStore,
        setSucursalSeleccionada,
        publicDataLoading: loading,
    } = usePublicData();

    const handleSelectStore = (store) => {
        setSucursalSeleccionada(store.id);
        // Ir directamente al menú
        navigate('/menu');
    };

    console.log(stores);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center dark">
            <div className="text-center bg-empanada-dark p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-empanada-light-gray">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Store className="w-8 h-8 text-empanada-golden" />
                    <h1 className="text-3xl font-bold text-white">
                        Elige tu Sucursal
                    </h1>
                </div>
                <p className="text-gray-300 mb-6">
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
                                className={`cursor-pointer transition-all duration-300 hover:shadow-md ${selectedStore?.id === store.id
                                    ? 'bg-empanada-golden/20 border-empanada-golden border-2'
                                    : 'bg-empanada-light-gray hover:bg-empanada-medium border border-empanada-light-gray'
                                    }`}
                                onClick={() => handleSelectStore(store)}
                            >
                                <CardContent className="p-3">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <h3 className="font-semibold text-white text-md">{store.name}</h3>
                                                <Badge
                                                    className={`text-xs px-2 py-0.5 ${store.statusData.isOpenNow
                                                        ? 'bg-green-700 text-white'
                                                        : 'bg-red-700 text-white'
                                                        }`}
                                                >
                                                    {store.isOpenNow ? "Abierto" : "Cerrado"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-300 mb-1">
                                                <MapPin className="w-3 h-3" />
                                                <span>{store.street} {store.number} ({store.barrio})</span>
                                            </div>
                                        </div>
                                        {selectedStore?.id === store.id && (
                                            <CheckCircle className="w-5 h-5 text-empanada-golden flex-shrink-0" />
                                        )}
                                    </div>

                                    {/* Información compacta */}
                                    <div className="grid grid-cols-2 gap-2 text-md text-gray-200">
                                        <div className="flex items-center gap-2">
                                            {store.supportsPickup && (
                                                <>
                                                    <Clock className="w-3 h-3" />
                                                    <span>Retiro por tienda</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {store.supportsDelivery && (
                                                <>
                                                    <BikeIcon className="w-3 h-3" />
                                                    <span>Delivery</span>
                                                </>
                                            )}
                                        </div>
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