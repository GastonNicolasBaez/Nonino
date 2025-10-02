import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, Truck, Star, Flame, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/common/ProductCard";
import { ProductModal } from "@/components/ui/ProductModal";
import { StoreChangeButton } from "@/components/common/StoreChangeButton";
import { useCart } from "@/context/CartProvider";

export function MenuMobile({
    products,
    categories,
    todaysPicks,
    promotions,
    combos,
    selectedStore = null
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { addItem } = useCart();

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        // Delay para que la animación de salida termine antes de limpiar el producto
        setTimeout(() => {
            setSelectedProduct(null);
        }, 300);
    };

    return (
        <div className="min-h-screen bg-black dark">
            {/* Header del restaurante */}
            <div className="bg-empanada-dark border-b border-empanada-light-gray py-4 sticky top-16 z-40">
                <div className="px-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-bold text-gray-100">Nonino Empanadas</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <MapPin className="w-3 h-3 text-gray-500" />
                                <span className="text-sm text-gray-300">
                                    {selectedStore?.name || "Selecciona sucursal"}
                                </span>
                                {selectedStore && (
                                    <StoreChangeButton variant="mobile" storeName={selectedStore?.name} />
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="font-semibold">4.5</span>
                            <span className="text-gray-300 text-sm">(500+)</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{selectedStore?.deliveryTime || "30 min"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Truck className="w-4 h-4" />
                            <span>{selectedStore?.deliveryFee === 0 ? "Gratis" : `$${selectedStore?.deliveryFee || 500}`}</span>
                        </div>
                        <div>
                            <span>Mín: ${selectedStore?.minOrder || 2000}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buscador */}
                <div className="bg-empanada-dark border-b border-empanada-light-gray py-3 px-4 +  sticky z-30" style={{top: '180px'}}>
                    <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Buscar empanadas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-10 py-3 text-base border-2 focus:border-empanada-golden"
                    />
                    {searchTerm && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSearchTerm("")}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-empanada-golden/10"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Contenido principal */}
            <div className="pb-20 relative">
                {/* Secciones por defecto - Siempre presentes pero pueden estar ocultas */}
                <div className={`transition-all duration-300 ${searchTerm ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {/* Los elegidos de hoy */}
                <section className="py-6 bg-black mb-4">
                    <div className="px-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Flame className="w-5 h-5 text-orange-500" />
                            <h2 className="text-lg font-bold text-white">Los elegidos de hoy</h2>
                            <span className="text-sm text-gray-300">¡Apúrate que vuelan!</span>
                        </div>

                        <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide lg:overflow-x-visible pb-2 snap-x snap-mandatory">
                            {todaysPicks.map((product) => (
                                <div key={product.id} className="flex-none w-40 xs:w-44 sm:w-48 snap-start">
                                    <Card
                                        className="overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-105 h-[200px] flex flex-col cursor-pointer bg-empanada-dark border-empanada-light-gray"
                                        onClick={() => handleProductClick(product)}
                                    >
                                        <div className="h-24 bg-empanada-medium relative flex-shrink-0">
                                            <img
                                                src={product.image || "/api/placeholder/150/100"}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-1 right-1">
                                                <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0.5">
                                                    Popular
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-3 flex flex-col flex-1 justify-between">
                                            <div>
                                                <h3 className="font-semibold text-sm text-white leading-tight mb-2 h-8 line-clamp-2">{product.name}</h3>
                                            </div>
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex flex-col">
                                                    <p className="text-lg font-bold text-empanada-golden">${product.price}</p>
                                                    <p className="text-xs text-gray-400">c/u</p>
                                                </div>
                                                <Button
                                                    size="icon"
                                                    variant="empanada"
                                                    className="h-8 w-8 rounded-full flex-shrink-0 shadow-md"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addItem(product, 1);
                                                    }}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Promociones */}
                <section className="py-6 bg-black mb-4">
                    <div className="px-4">
                        <h2 className="text-lg font-bold text-white mb-4">Promociones</h2>

                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                            {promotions.map((promo) => (
                                <div key={promo.id} className="flex-none w-72">
                                    <Card className="overflow-hidden hover:shadow-md transition-shadow bg-gradient-to-r from-red-500 to-orange-500 text-white">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-lg">{promo.title}</h3>
                                                    <p className="text-sm opacity-90">{promo.description}</p>
                                                </div>
                                                <Badge className="bg-gray-800 text-red-500 font-bold">
                                                    {promo.discount}
                                                </Badge>
                                            </div>
                                            <div className="mt-4">
                                                <Button className="bg-empanada-dark text-red-500 hover:bg-empanada-medium font-semibold w-full">
                                                    ¡Quiero esta promo!
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Combos */}
                <section className="py-6 bg-black mb-4">
                    <div className="px-4">
                        <h2 className="text-lg font-bold text-white mb-4">Combos Especiales</h2>

                        <div className="space-y-4">
                            {combos.map((combo) => (
                                <Card
                                    key={combo.id}
                                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-empanada-dark border-empanada-light-gray"
                                    onClick={() => handleProductClick(combo)}
                                >
                                    <div className="flex">
                                        <div className="w-24 h-24 bg-empanada-medium flex-shrink-0">
                                            <img
                                                src={combo.image}
                                                alt={combo.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <CardContent className="flex-1 p-4 flex flex-col">
                                            <h3 className="font-semibold text-white">{combo.name}</h3>
                                            <p className="text-sm text-gray-300 mb-2 line-clamp-2 flex-1">{combo.description}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-empanada-golden">${combo.price}</span>
                                                    <span className="text-sm text-gray-400 line-through">${combo.originalPrice}</span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="empanada"
                                                    className="text-xs px-3 py-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addItem(combo, 1);
                                                    }}
                                                >
                                                    Agregar
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
                </div>

                {/* Sección de búsqueda - Se superpone cuando hay searchTerm */}
                <AnimatePresence>
                {searchTerm && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 bg-black z-10"
                    >
                        <section className="bg-black py-6">
                            <div className="px-4">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-white">
                                        Resultados de búsqueda
                                    </h2>
                                    <p className="text-gray-300 text-sm">
                                        {filteredProducts.length} productos encontrados para "{searchTerm}"
                                    </p>
                                </div>

                                {filteredProducts.length === 0 ? (
                                    <motion.div className="text-center py-12">
                                        <div className="text-4xl mb-4">🔍</div>
                                        <h3 className="text-xl font-semibold mb-3 text-white">No encontramos empanadas</h3>
                                        <p className="text-gray-300 mb-6">Intenta con otros términos de búsqueda</p>
                                        <Button
                                            onClick={() => setSearchTerm("")}
                                            variant="empanada"
                                        >
                                            Ver Todas las Empanadas
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {filteredProducts.map((product) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="snap-start"
                                            >
                                                <ProductCard product={product} />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </motion.div>
                )}
                </AnimatePresence>

                {/* Todos los productos - Solo cuando no hay búsqueda */}
                {!searchTerm && (
                <section className="bg-black">
                    <div className="px-4 py-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white">
                                Todas las Empanadas
                            </h2>
                            <p className="text-gray-300 text-sm">
                                {products.length} productos disponibles
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {products.map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
                )}
            </div>

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                isOpen={showModal}
                onClose={handleCloseModal}
            />
        </div>
    );
}