import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, Clock, Truck, Star, MapPin, Sparkles, Package, Info } from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductCard } from "@/components/common/ProductCard";
import { ComboModal } from "@/components/ui/ComboModal";
import { StoreChangeButton } from "@/components/common/StoreChangeButton";
import { useCart } from "@/context/CartProvider";

export function MenuDesktop({
    products,
    categories,
    promotions,
    combos,
    selectedStore = null
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("popular");
    const [selectedCombo, setSelectedCombo] = useState(null);
    const [showComboModal, setShowComboModal] = useState(false);
    const { addItem } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = (product) => {
        addItem(product);
    };

    const handleShowComboInfo = (combo) => {
        setSelectedCombo(combo);
        setShowComboModal(true);
    };

    const handleCloseComboModal = () => {
        setShowComboModal(false);
        setTimeout(() => {
            setSelectedCombo(null);
        }, 300);
    };

    // Productos filtrados para búsqueda en tiempo real
    const searchFilteredProducts = products.filter((product) => {
        if (!searchTerm) return false;
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Productos filtrados para la sección "Todos los Productos" (solo cuando no hay búsqueda)
    const filteredProducts = products
        .filter((product) => {
            if (searchTerm) return false; // No mostrar cuando hay búsqueda

            const matchesCategory = selectedCategory === "all" ||
                product.category === selectedCategory;

            return matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return a.price - b.price;
                case "price-high":
                    return b.price - a.price;
                case "rating":
                    return b.rating - a.rating;
                case "popular":
                default:
                    return (b.reviews || 0) - (a.reviews || 0);
            }
        });

    const sortOptions = [
        { value: "popular", label: "Más Popular" },
        { value: "price-low", label: "Precio: Menor a Mayor" },
        { value: "price-high", label: "Precio: Mayor a Menor" },
        { value: "rating", label: "Mejor Calificación" },
    ];

    return (
        <div className="min-h-screen bg-black dark">
            {/* Header con info del restaurante */}
            <div className="bg-empanada-dark shadow-lg border-b lg:bg-empanada-dark/95 lg:backdrop-blur-md lg:border-b lg:border-empanada-light-gray py-6 sticky top-16 z-40">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-100">Nonino Empanadas</h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-300">
                                            {selectedStore?.name || "Selecciona una sucursal"}
                                        </span>
                                    </div>
                                    {selectedStore && (
                                        <StoreChangeButton variant="desktop" storeName={selectedStore?.name} />
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-300">
                                <div className="flex items-center gap-2 bg-green-900/30 px-3 py-2 rounded-lg border border-green-800">
                                    <Clock className="w-4 h-4 text-green-400" />
                                    <span className="text-green-300 font-medium">{selectedStore?.deliveryTime || "30-40 min"}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-blue-900/30 px-3 py-2 rounded-lg border border-blue-800">
                                    <Truck className="w-4 h-4 text-blue-400" />
                                    <span className="text-blue-300 font-medium">
                                        Envío: {selectedStore?.deliveryFee === 0 ? "Gratis" : `$${selectedStore?.deliveryFee || 500}`}
                                    </span>
                                </div>
                                <div className="bg-orange-900/30 px-3 py-2 rounded-lg border border-orange-800">
                                    <span className="text-orange-300 font-medium">Mín: ${selectedStore?.minOrder || 2000}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="font-semibold text-lg">4.5</span>
                            <span className="text-gray-400">(500+ reseñas)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <aside className="w-80 flex-shrink-0">
                        <div className="sticky space-y-6" style={{top: '180px'}}>
                            {/* Buscador */}
                            <div className="bg-empanada-dark rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 text-white">Buscar</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        placeholder="Buscar empanadas, combos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-10 py-3 text-base border-2 bg-empanada-medium text-white placeholder-gray-400 border-empanada-light-gray focus:border-empanada-golden"
                                    />
                                    {searchTerm && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSearchTerm("")}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-empanada-light-gray text-gray-300"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Filtros */}
                            <div className="bg-empanada-dark rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 text-white">Filtros</h3>

                                {/* Categorías */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-300 mb-3">Categorías</h4>
                                    <div className="space-y-2">
                                        <Button
                                            variant={selectedCategory === "all" ? "empanada" : "outline"}
                                            onClick={() => setSelectedCategory("all")}
                                            className={`w-full justify-start text-sm ${selectedCategory === "all" ? "" : "menu-category-button"}`}
                                            size="sm"
                                        >
                                            Todas las categorías
                                        </Button>
                                        {categories.map((category) => (
                                            <Button
                                                key={category.id}
                                                variant={selectedCategory === category.id ? "empanada" : "outline"}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className={`w-full justify-start text-sm ${selectedCategory === category.id ? "" : "menu-category-button"}`}
                                                size="sm"
                                            >
                                                <span className="mr-2">{category.icon}</span>
                                                {category.name}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Ordenar */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-300 mb-3">Ordenar por</h4>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2 border border-empanada-light-gray bg-empanada-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-empanada-golden focus:border-empanada-golden text-sm menu-select"
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Contenido Principal */}
                    <main className="flex-1 ml-8">
                        {/* Secciones principales - Solo cuando no hay búsqueda */}
                        {!searchTerm && (
                            <>
                        {/* Promociones - Comentado para implementación futura */}
                        {/* <section id="promociones" className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-red-500/20 p-2 rounded-lg">
                                    <Badge className="bg-red-500 text-white">%</Badge>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Promociones</h2>
                                    <p className="text-gray-400">Ofertas que no puedes perderte</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {promotions.map((promo) => (
                                    <Card key={promo.id} className="overflow-hidden bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-xl mb-2">{promo.title}</h3>
                                                    <p className="text-white/90">{promo.description}</p>
                                                </div>
                                                <Badge className="bg-empanada-dark text-red-500 font-bold text-lg px-3 py-1">
                                                    {promo.discount}
                                                </Badge>
                                            </div>
                                            <Button className="bg-empanada-dark text-red-500 hover:bg-empanada-medium font-semibold w-full">
                                                ¡Quiero esta promo!
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section> */}

                        {/* Combos */}
                        <section id="combos" className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-green-500/20 p-2 rounded-lg">
                                    <div className="w-6 h-6 bg-green-600 rounded"></div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Combos Especiales</h2>
                                    <p className="text-gray-400">Más por menos</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                {combos.map((combo) => (
                                    <Card key={combo.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-empanada-dark border-empanada-light-gray group">
                                        <div className="flex">
                                            <div className="w-32 h-32 bg-empanada-medium flex-shrink-0 relative">
                                                {combo.imageBase64 ? (
                                                    <img
                                                        src={combo.imageBase64.startsWith('data:') ? combo.imageBase64 : `data:image/webp;base64,${combo.imageBase64}`}
                                                        alt={combo.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-12 h-12 text-empanada-golden opacity-30" />
                                                    </div>
                                                )}
                                                {/* Botón info en hover */}
                                                <button
                                                    onClick={() => handleShowComboInfo(combo)}
                                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <div className="bg-empanada-golden rounded-full p-2">
                                                        <Info className="w-6 h-6 text-white" />
                                                    </div>
                                                </button>
                                            </div>
                                            <CardContent className="flex-1 p-6 flex flex-col justify-between bg-empanada-dark">
                                                <div>
                                                    <h3 className="font-bold text-xl text-white mb-2">{combo.name}</h3>
                                                    <p className="text-gray-400 mb-3 text-sm line-clamp-2">{combo.description}</p>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <span className="text-2xl font-bold text-empanada-golden">${combo.price}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleShowComboInfo(combo)}
                                                        className="border-empanada-light-gray hover:border-empanada-golden text-gray-300 hover:text-white"
                                                    >
                                                        <Info className="w-4 h-4 mr-2" />
                                                        Ver Info
                                                    </Button>
                                                    <Button
                                                        className="flex-1"
                                                        variant="empanada"
                                                        onClick={() => navigate(`/menu/combo-builder?comboId=${combo.id}`)}
                                                    >
                                                        <Package className="w-4 h-4 mr-2" />
                                                        Armar Combo
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* Todos los Productos */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Todos los Productos</h2>
                                    <p className="text-gray-400">
                                        {filteredProducts.length} productos encontrados
                                    </p>
                                </div>
                                {selectedCategory !== "all" && (
                                    <Badge variant="empanada" className="flex items-center gap-2">
                                        {categories.find(c => c.id === selectedCategory)?.icon}
                                        {categories.find(c => c.id === selectedCategory)?.name}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSelectedCategory("all")}
                                            className="h-4 w-4 ml-1 hover:bg-empanada-medium"
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </Badge>
                                )}
                            </div>

                            {filteredProducts.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-2xl font-semibold mb-4 text-white">No encontramos productos</h3>
                                    <p className="text-gray-400 mb-8">Intenta con otros términos de búsqueda o filtros</p>
                                    <Button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedCategory("all");
                                        }}
                                        variant="empanada"
                                    >
                                        Ver Todos los Productos
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-6">
                                    {filteredProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            )}
                        </section>
                            </>
                        )}

                        {/* Sección de búsqueda - Solo cuando hay searchTerm */}
                        <AnimatePresence>
                            {searchTerm && (
                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="mb-12"
                                >
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-white">Resultados de búsqueda</h2>
                                        <p className="text-gray-400">
                                            {searchFilteredProducts.length} productos encontrados para "{searchTerm}"
                                        </p>
                                    </div>

                                    {searchFilteredProducts.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-16"
                                        >
                                            <div className="text-6xl mb-4">🔍</div>
                                            <h3 className="text-2xl font-semibold mb-4 text-white">No encontramos productos</h3>
                                            <p className="text-gray-400 mb-8">Intenta con otros términos de búsqueda</p>
                                            <Button
                                                onClick={() => setSearchTerm("")}
                                                variant="empanada"
                                            >
                                                Ver Todos los Productos
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <div className="grid grid-cols-4 gap-6">
                                            {searchFilteredProducts.map((product, index) => (
                                                <motion.div
                                                    key={product.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                >
                                                    <ProductCard product={product} />
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.section>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            {/* Combo Modal */}
            <ComboModal
                combo={selectedCombo}
                isOpen={showComboModal}
                onClose={handleCloseComboModal}
            />
        </div>
    );
}