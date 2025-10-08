import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, Truck, Star, Flame, MapPin, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/common/ProductCard";
import { ProductModal } from "@/components/ui/ProductModal";
import { ComboModal } from "@/components/ui/ComboModal";
import { StoreChangeButton } from "@/components/common/StoreChangeButton";
import { CategoryTabs } from "@/components/menu/mobile/CategoryTabs";
import { FilterBottomSheet, FilterButton } from "@/components/menu/mobile/FilterBottomSheet";
import { ComboCarousel } from "@/components/menu/mobile/ComboCardMobile";
import { useCart } from "@/context/CartProvider";

export function MenuMobile({
    products,
    categories,
    promotions,
    combos,
    selectedStore = null
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("popular");
    const [showFilterSheet, setShowFilterSheet] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedCombo, setSelectedCombo] = useState(null);
    const [showComboModal, setShowComboModal] = useState(false);
    const { addItem } = useCart();
    const navigate = useNavigate();

    // Obtener productos destacados/populares para "Los elegidos de hoy"
    const todaysPicks = useMemo(() => {
        return products
            .filter(p => p.isPopular || p.rating >= 4.5)
            .slice(0, 6); // Mostrar máximo 6
    }, [products]);

    // Filtrar y ordenar productos
    const filteredProducts = useMemo(() => {
        return products
            .filter((product) => {
                // Filtro de búsqueda
                const matchesSearch = !searchTerm ||
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

                // Filtro de categoría
                const matchesCategory = selectedCategory === "all" ||
                    product.category === selectedCategory;

                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "price-low":
                        return a.price - b.price;
                    case "price-high":
                        return b.price - a.price;
                    case "rating":
                        return (b.rating || 0) - (a.rating || 0);
                    case "newest":
                        return (b.id || 0) - (a.id || 0);
                    case "popular":
                    default:
                        return (b.reviews || 0) - (a.reviews || 0);
                }
            });
    }, [products, searchTerm, selectedCategory, sortBy]);

    // Contar filtros aplicados
    const appliedFiltersCount = useMemo(() => {
        let count = 0;
        if (selectedCategory !== "all") count++;
        if (sortBy !== "popular") count++;
        return count;
    }, [selectedCategory, sortBy]);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTimeout(() => {
            setSelectedProduct(null);
        }, 300);
    };

    const handleComboSelect = (combo) => {
        navigate(`/menu/combo-builder?comboId=${combo.id}`);
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

    // Determinar si mostrar secciones o solo resultados de búsqueda
    const isSearching = searchTerm.length > 0;

    return (
        <div className="min-h-screen bg-black dark">
            {/* Header del restaurante - Más compacto */}
            <div className="bg-empanada-dark border-b border-empanada-light-gray py-3 sticky top-16 z-40">
                <div className="px-4">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-lg font-bold text-gray-100">Nonino Empanadas</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <MapPin className="w-3 h-3 text-gray-500" />
                                <span className="text-xs text-gray-300">
                                    {selectedStore?.name || "Selecciona sucursal"}
                                </span>
                                {selectedStore && (
                                    <StoreChangeButton variant="mobile" storeName={selectedStore?.name} />
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-semibold text-sm">4.5</span>
                            <span className="text-gray-300 text-xs">(500+)</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-300">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{selectedStore?.deliveryTime || "30 min"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            <span>{selectedStore?.deliveryFee === 0 ? "Gratis" : `$${selectedStore?.deliveryFee || 500}`}</span>
                        </div>
                        <div>
                            <span>Mín: ${selectedStore?.minOrder || 2000}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buscador y filtros - Sticky */}
            <div className="bg-empanada-dark border-b border-empanada-light-gray sticky z-30" style={{top: '140px'}}>
                <div className="px-4 py-3">
                    <div className="flex gap-2 mb-3">
                        {/* Buscador */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Buscar empanadas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-10 py-2 text-sm border-2 bg-empanada-medium text-white placeholder-gray-400 border-empanada-light-gray focus:border-empanada-golden"
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

                        {/* Botón filtros */}
                        <FilterButton
                            onClick={() => setShowFilterSheet(true)}
                            appliedFiltersCount={appliedFiltersCount}
                        />
                    </div>

                    {/* Category Tabs - Solo cuando NO hay búsqueda */}
                    {!isSearching && (
                        <CategoryTabs
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                        />
                    )}
                </div>
            </div>

            {/* Contenido principal */}
            <div className="pb-20 relative">
                {/* Secciones por defecto - Solo cuando NO hay búsqueda */}
                {!isSearching && (
                    <>
                        {/* Los elegidos de hoy */}
                        {todaysPicks.length > 0 && (
                            <section className="py-6 bg-black">
                                <div className="px-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Flame className="w-5 h-5 text-orange-500" />
                                        <h2 className="text-lg font-bold text-white">Los elegidos de hoy</h2>
                                        <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5">
                                            HOT
                                        </Badge>
                                    </div>

                                    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                                        {todaysPicks.map((product, index) => (
                                            <motion.div
                                                key={product.id}
                                                className="flex-none w-44 snap-start"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Card
                                                    className="overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-105 h-[220px] flex flex-col cursor-pointer bg-empanada-dark border-empanada-light-gray"
                                                    onClick={() => handleProductClick(product)}
                                                >
                                                    <div className="h-28 bg-empanada-medium relative flex-shrink-0">
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
                                                            <h3 className="font-semibold text-sm text-white leading-tight mb-2 h-10 line-clamp-2">{product.name}</h3>
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
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Combos Especiales - Carrusel swipeable */}
                        {combos && combos.length > 0 && (
                            <section className="bg-black border-t border-empanada-light-gray">
                                <div className="px-4 pt-6">
                                    <h2 className="text-lg font-bold text-white mb-1">Combos Especiales</h2>
                                    <p className="text-sm text-gray-400 mb-4">Más por menos 💰</p>
                                </div>
                                <ComboCarousel
                                    combos={combos}
                                    onSelectCombo={handleComboSelect}
                                    onShowInfo={handleShowComboInfo}
                                />
                            </section>
                        )}

                        {/* Todos los productos */}
                        <section className="bg-black border-t border-empanada-light-gray">
                            <div className="px-4 py-6">
                                <div className="mb-4">
                                    <h2 className="text-lg font-bold text-white">
                                        {selectedCategory === 'all' ? 'Todas las Empanadas' : categories.find(c => c.id === selectedCategory)?.name}
                                    </h2>
                                    <p className="text-sm text-gray-400">
                                        {filteredProducts.length} productos disponibles
                                    </p>
                                </div>

                                {filteredProducts.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-4">🔍</div>
                                        <h3 className="text-xl font-semibold mb-3 text-white">No hay productos</h3>
                                        <p className="text-gray-300 mb-6">Intenta con otra categoría</p>
                                        <Button
                                            onClick={() => setSelectedCategory('all')}
                                            variant="empanada"
                                        >
                                            Ver Todas las Categorías
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {filteredProducts.map((product, index) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.03 }}
                                            >
                                                <ProductCard product={product} />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                )}

                {/* Resultados de búsqueda - Solo cuando HAY búsqueda */}
                <AnimatePresence>
                    {isSearching && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-black py-6"
                        >
                            <div className="px-4">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-white">
                                        Resultados de búsqueda
                                    </h2>
                                    <p className="text-sm text-gray-400">
                                        {filteredProducts.length} productos encontrados para "{searchTerm}"
                                    </p>
                                </div>

                                {filteredProducts.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-4">🔍</div>
                                        <h3 className="text-xl font-semibold mb-3 text-white">No encontramos empanadas</h3>
                                        <p className="text-gray-300 mb-6">Intenta con otros términos de búsqueda</p>
                                        <Button
                                            onClick={() => setSearchTerm("")}
                                            variant="empanada"
                                        >
                                            Ver Todas las Empanadas
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {filteredProducts.map((product, index) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.03 }}
                                            >
                                                <ProductCard product={product} />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                isOpen={showModal}
                onClose={handleCloseModal}
            />

            {/* Filter Bottom Sheet */}
            <FilterBottomSheet
                isOpen={showFilterSheet}
                onClose={() => setShowFilterSheet(false)}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
                appliedFiltersCount={appliedFiltersCount}
            />

            {/* Combo Modal */}
            <ComboModal
                combo={selectedCombo}
                isOpen={showComboModal}
                onClose={handleCloseComboModal}
            />
        </div>
    );
}
