import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TextAnimate } from "@/components/ui/text-animate";
import { ProductCard } from "@/components/common/ProductCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { usePublicData } from "@/context/PublicDataProvider";
// import { cn } from "../../lib/utils"; // No utilizado actualmente

export function MenuPage() {

    const {productos: products, categorias : categories, publicLoading : loading} = usePublicData();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("popular");

    // console.log(products);
    // console.log(categories);

    const filteredProducts = products
        .filter((product) => {
            const matchesSearch = product.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-empanada-golden to-empanada-crust text-white py-6 sm:py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <TextAnimate
                        animation="slideUp"
                        by="word"
                        className="text-2xl sm:text-3xl md:text-4xl font-bold px-2"
                    >
                        Nuestro Delicioso Menú
                    </TextAnimate>
                </div>
            </section>

            {/* Main Content Layout */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block lg:w-64 flex-shrink-0">
                        <div className="fixed top-20 left-0 right-0 lg:static lg:top-auto lg:left-auto lg:right-auto lg:w-64 lg:h-screen lg:overflow-y-auto">
                            <div className="bg-white lg:bg-transparent border-b lg:border-b-0 lg:pt-4 space-y-4 px-4 lg:px-0">
            {/* Categories */}
                                <div>
                                    <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Categorías</h4>
                                    <div className="flex flex-wrap gap-1">
                        <Button
                            variant={selectedCategory === "all" ? "empanada" : "outline"}
                            onClick={() => setSelectedCategory("all")}
                                            className="text-xs px-2 py-1 flex-shrink-0"
                            size="sm"
                        >
                            Todas
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={selectedCategory === category.id ? "empanada" : "outline"}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className="text-xs px-2 py-1 flex-shrink-0"
                                size="sm"
                            >
                                                <span className="mr-1 text-xs">{category.icon}</span>
                                <span className="hidden xs:inline">{category.name}</span>
                                <span className="xs:hidden">{category.name.split(' ')[0]}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 z-10" />
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 focus:border-empanada-golden focus:ring-0 focus:outline-none rounded-lg bg-gray-50 focus:bg-white transition-all"
                                        style={{ outline: 'none', boxShadow: 'none' }}
                                        onFocus={(e) => e.target.style.outline = 'none'}
                                        onBlur={(e) => e.target.style.outline = 'none'}
                                    />
                                    {searchTerm && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSearchTerm("")}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-empanada-golden/10 z-10"
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    )}
                                </div>

                                {/* Sort */}
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2.5 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-empanada-golden text-sm bg-gray-50 focus:bg-white transition-all appearance-none cursor-pointer"
                                        style={{ outline: 'none', boxShadow: 'none' }}
                                        onFocus={(e) => e.target.style.outline = 'none'}
                                        onBlur={(e) => e.target.style.outline = 'none'}
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
                                </div>

                                {/* Advanced Filters */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Precio</h4>
                                        <div className="space-y-1">
                                            <label className="flex items-center text-xs cursor-pointer hover:text-empanada-golden transition-colors">
                                                <input type="checkbox" className="mr-2 w-3 h-3 text-empanada-golden focus:ring-empanada-golden" />
                                                Hasta $400
                                            </label>
                                            <label className="flex items-center text-xs cursor-pointer hover:text-empanada-golden transition-colors">
                                                <input type="checkbox" className="mr-2 w-3 h-3 text-empanada-golden focus:ring-empanada-golden" />
                                                $400 - $600
                                            </label>
                                            <label className="flex items-center text-xs cursor-pointer hover:text-empanada-golden transition-colors">
                                                <input type="checkbox" className="mr-2 w-3 h-3 text-empanada-golden focus:ring-empanada-golden" />
                                                Más de $600
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Alergenos</h4>
                                        <div className="space-y-1">
                                            <label className="flex items-center text-xs cursor-pointer hover:text-empanada-golden transition-colors">
                                                <input type="checkbox" className="mr-2 w-3 h-3 text-empanada-golden focus:ring-empanada-golden" />
                                                Sin Gluten
                                            </label>
                                            <label className="flex items-center text-xs cursor-pointer hover:text-empanada-golden transition-colors">
                                                <input type="checkbox" className="mr-2 w-3 h-3 text-empanada-golden focus:ring-empanada-golden" />
                                                Sin Lactosa
                                            </label>
                                            <label className="flex items-center text-xs cursor-pointer hover:text-empanada-golden transition-colors">
                                                <input type="checkbox" className="mr-2 w-3 h-3 text-empanada-golden focus:ring-empanada-golden" />
                                                Vegetariano
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Tiempo</h4>
                                        <div className="space-y-1">
                                            <label className="flex items-center text-xs cursor-pointer hover:text-empanada-golden transition-colors">
                                                <input type="checkbox" className="mr-2 w-3 h-3 text-empanada-golden focus:ring-empanada-golden" />
                                                &lt; 15 min
                                            </label>
                                            <label className="flex items-center text-xs cursor-pointer hover:text-empanada-golden transition-colors">
                                                <input type="checkbox" className="mr-2 w-3 h-3 text-empanada-golden focus:ring-empanada-golden" />
                                                15-20 min
                                            </label>
                                            <label className="flex items-center text-xs cursor-pointer hover:text-empanada-golden transition-colors">
                                                <input type="checkbox" className="mr-2 w-3 h-3 text-empanada-golden focus:ring-empanada-golden" />
                                                &gt; 20 min
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Filters */}
                    <div className="lg:hidden">
                        <div className="bg-white border-b shadow-sm py-3">
                            <div className="flex flex-col gap-3">
                                {/* Categories */}
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant={selectedCategory === "all" ? "empanada" : "outline"}
                                        onClick={() => setSelectedCategory("all")}
                                        className="text-xs px-3 py-2 flex-shrink-0"
                                        size="sm"
                                    >
                                        Todas
                                    </Button>
                                    {categories.map((category) => (
                                        <Button
                                            key={category.id}
                                            variant={selectedCategory === category.id ? "empanada" : "outline"}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className="text-xs px-3 py-2 flex-shrink-0"
                                            size="sm"
                                        >
                                            <span className="mr-1 text-xs">{category.icon}</span>
                                            <span className="hidden xs:inline">{category.name}</span>
                                            <span className="xs:hidden">{category.name.split(' ')[0]}</span>
                                        </Button>
                                    ))}
                                </div>

                                {/* Search */}
                        <div className="relative w-full">
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

                                {/* Controls */}
                                <div className="flex gap-3 items-center justify-between">
                                    <div className="flex-1">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-empanada-golden focus:border-empanada-golden text-sm bg-white"
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Button
                                    variant={showFilters ? "empanada" : "outline"}
                                    onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap"
                                    size="sm"
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                        <span>Filtros</span>
                                    {showFilters && <X className="w-4 h-4 ml-1" />}
                                </Button>
                        </div>
                    </div>

                            {/* Mobile Filter Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                        className="mt-4 p-4 bg-gray-50 rounded-lg border-2 border-empanada-golden/20"
                            >
                                <h3 className="text-lg font-semibold mb-4 text-empanada-golden">Filtros Avanzados</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                                <h4 className="font-medium text-sm text-gray-700 border-b border-gray-300 pb-1">Precio</h4>
                                        <div className="space-y-2">
                                            <label className="flex items-center text-sm cursor-pointer hover:text-empanada-golden transition-colors">
                                                <input type="checkbox" className="mr-3 w-4 h-4 text-empanada-golden focus:ring-empanada-golden" />
                                                Hasta $400
                                            </label>
                                            <label className="flex items-center text-sm cursor-pointer hover:text-empanada-golden transition-colors">
                                                <input type="checkbox" className="mr-3 w-4 h-4 text-empanada-golden focus:ring-empanada-golden" />
                                                $400 - $600
                                            </label>
                                            <label className="flex items-center text-sm cursor-pointer hover:text-empanada-golden transition-colors">
                                                <input type="checkbox" className="mr-3 w-4 h-4 text-empanada-golden focus:ring-empanada-golden" />
                                                Más de $600
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                                <h4 className="font-medium text-sm text-gray-700 border-b border-gray-300 pb-1">Alergenos</h4>
                                        <div className="space-y-2">
                                            <label className="flex items-center text-sm cursor-pointer hover:text-empanada-golden transition-colors">
                                                <input type="checkbox" className="mr-3 w-4 h-4 text-empanada-golden focus:ring-empanada-golden" />
                                                Sin Gluten
                                            </label>
                                            <label className="flex items-center text-sm cursor-pointer hover:text-empanada-golden transition-colors">
                                                <input type="checkbox" className="mr-3 w-4 h-4 text-empanada-golden focus:ring-empanada-golden" />
                                                Sin Lactosa
                                            </label>
                                            <label className="flex items-center text-sm cursor-pointer hover:text-empanada-golden transition-colors">
                                                <input type="checkbox" className="mr-3 w-4 h-4 text-empanada-golden focus:ring-empanada-golden" />
                                                Vegetariano
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-300">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowFilters(false)}
                                                className="w-full text-sm"
                                    >
                                        Aplicar Filtros
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 lg:ml-0">
            {/* Results Info */}
                        <div className="py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <p className="text-sm sm:text-base text-gray-600">
                        {filteredProducts.length} {filteredProducts.length === 1 ? "empanada encontrada" : "empanadas encontradas"}
                        {searchTerm && ` para "${searchTerm}"`}
                    </p>
                    {selectedCategory !== "all" && (
                        <Badge variant="empanada" className="flex items-center gap-1 w-fit text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
                            {categories.find(c => c.id === selectedCategory)?.icon}
                            <span className="hidden xs:inline">{categories.find(c => c.id === selectedCategory)?.name}</span>
                            <span className="xs:hidden">{categories.find(c => c.id === selectedCategory)?.name.split(' ')[0]}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedCategory("all")}
                                className="h-4 w-4 ml-1 hover:bg-white/20"
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </Badge>
                    )}
                </div>
            </div>

            {/* Products Grid */}
                        <div className="pb-16 sm:pb-20">
                {filteredProducts.length === 0 ? (
                    <motion.div
                        className="text-center py-12 sm:py-16 lg:py-20 px-4"
                    >
                        <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">🔍</div>
                        <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 px-2">
                            No encontramos empanadas
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-2">
                            Intenta con otros términos de búsqueda o filtros
                        </p>
                        <Button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("all");
                                setShowFilters(false);
                            }}
                            variant="empanada"
                            className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
                        >
                            Ver Todas las Empanadas
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-6"
                    >
                        <AnimatePresence>
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
