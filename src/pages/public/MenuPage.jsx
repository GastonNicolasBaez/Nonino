import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { TextAnimate } from "../../components/ui/text-animate";
import { ProductCard } from "../../components/common/ProductCard";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { productService } from "../../services/api";
// import { cn } from "../../lib/utils"; // No utilizado actualmente

export function MenuPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getAllProducts({ onlyAvailable: true }),
          productService.getCategories(),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <section className="bg-gradient-to-r from-empanada-golden to-empanada-crust text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TextAnimate
            animation="slideUp"
            by="word"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2"
          >
            Nuestro Delicioso Menú
          </TextAnimate>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-2"
          >
            Descubre nuestra variedad de empanadas artesanales,
            hechas con ingredientes frescos y recetas tradicionales
          </motion.p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 sm:py-12 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 justify-center max-w-4xl mx-auto">
            <Button
              variant={selectedCategory === "all" ? "empanada" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="mb-2 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3 flex-shrink-0"
              size="sm"
            >
              Todas
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "empanada" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="mb-2 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3 flex-shrink-0"
                size="sm"
              >
                <span className="mr-1 sm:mr-2 text-sm sm:text-base">{category.icon}</span>
                <span className="hidden xs:inline">{category.name}</span>
                <span className="xs:hidden">{category.name.split(' ')[0]}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <div className="sticky top-16 lg:top-20 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search - Full width on mobile */}
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

            {/* Controls - Responsive layout */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Sort - Full width on mobile */}
                <div className="flex-1 sm:flex-none min-w-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-empanada-golden focus:border-empanada-golden text-sm sm:text-base bg-white"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter Toggle - Prominent on mobile */}
                <Button
                  variant={showFilters ? "empanada" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base whitespace-nowrap"
                  size="sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden xs:inline">Filtros</span>
                  <span className="xs:hidden">Filtro</span>
                  {showFilters && <X className="w-4 h-4 ml-1" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 p-4 sm:p-6 bg-gray-50 rounded-lg border-2 border-empanada-golden/20"
              >
                <h3 className="text-lg font-semibold mb-4 text-empanada-golden">Filtros Avanzados</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm sm:text-base text-gray-700 border-b border-gray-300 pb-1">Precio</h4>
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
                    <h4 className="font-medium text-sm sm:text-base text-gray-700 border-b border-gray-300 pb-1">Alergenos</h4>
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

                  <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                    <h4 className="font-medium text-sm sm:text-base text-gray-700 border-b border-gray-300 pb-1">Tiempo de Preparación</h4>
                    <div className="space-y-2">
                      <label className="flex items-center text-sm cursor-pointer hover:text-empanada-golden transition-colors">
                        <input type="checkbox" className="mr-3 w-4 h-4 text-empanada-golden focus:ring-empanada-golden" />
                        Menos de 15 min
                      </label>
                      <label className="flex items-center text-sm cursor-pointer hover:text-empanada-golden transition-colors">
                        <input type="checkbox" className="mr-3 w-4 h-4 text-empanada-golden focus:ring-empanada-golden" />
                        15-20 min
                      </label>
                      <label className="flex items-center text-sm cursor-pointer hover:text-empanada-golden transition-colors">
                        <input type="checkbox" className="mr-3 w-4 h-4 text-empanada-golden focus:ring-empanada-golden" />
                        Más de 20 min
                      </label>
                    </div>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className="mt-6 pt-4 border-t border-gray-300">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(false)}
                    className="w-full sm:w-auto text-sm"
                  >
                    Aplicar Filtros
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results Info */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
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
    </div>
  );
}
