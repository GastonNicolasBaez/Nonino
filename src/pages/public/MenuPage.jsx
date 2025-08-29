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
import { cn } from "../../lib/utils";

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
      <section className="bg-gradient-to-r from-empanada-golden to-empanada-crust text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <TextAnimate
            animation="slideUp"
            by="word"
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Nuestro Delicioso Menú
          </TextAnimate>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            Descubre nuestra variedad de empanadas artesanales, 
            hechas con ingredientes frescos y recetas tradicionales
          </motion.p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant={selectedCategory === "all" ? "empanada" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="mb-2"
            >
              Todas
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "empanada" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="mb-2"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <div className="sticky top-20 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar empanadas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-empanada-golden"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Precio</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Hasta $400
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        $400 - $600
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Más de $600
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Alergenos</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Sin Gluten
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Sin Lactosa
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Vegetariano
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Tiempo de Preparación</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Menos de 15 min
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        15-20 min
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Más de 20 min
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results Info */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? "empanada encontrada" : "empanadas encontradas"}
            {searchTerm && ` para "${searchTerm}"`}
          </p>
          {selectedCategory !== "all" && (
            <Badge variant="empanada" className="flex items-center gap-1">
              {categories.find(c => c.id === selectedCategory)?.icon}
              {categories.find(c => c.id === selectedCategory)?.name}
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
      <div className="container mx-auto px-4 pb-20">
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold mb-2">
              No encontramos empanadas
            </h3>
            <p className="text-gray-600 mb-8">
              Intenta con otros términos de búsqueda o filtros
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setShowFilters(false);
              }}
              variant="empanada"
            >
              Ver Todas las Empanadas
            </Button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
