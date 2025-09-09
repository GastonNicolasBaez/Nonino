import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, ArrowRight, Command } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

/**
 * Componente de búsqueda global para el panel de administración
 * Permite buscar entre todos los elementos y componentes del dashboard
 */
export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  // Datos de búsqueda - en una app real esto vendría de una API
  const searchData = [
    // Páginas principales
    { id: "dashboard", title: "Dashboard", description: "Panel principal con métricas y estadísticas", type: "page", href: "/admin", icon: "📊" },
    { id: "pedidos", title: "Pedidos", description: "Gestionar pedidos y órdenes", type: "page", href: "/admin/pedidos", icon: "🛒" },
    { id: "productos", title: "Productos", description: "Administrar productos del menú", type: "page", href: "/admin/productos", icon: "📦" },
    { id: "inventario", title: "Inventario", description: "Control de stock y existencias", type: "page", href: "/admin/inventario", icon: "📋" },
    { id: "clientes", title: "Clientes", description: "Gestión de clientes y usuarios", type: "page", href: "/admin/clientes", icon: "👥" },
    { id: "reportes", title: "Reportes", description: "Análisis y reportes de ventas", type: "page", href: "/admin/reportes", icon: "📈" },
    { id: "configuracion", title: "Configuración", description: "Ajustes del sistema", type: "page", href: "/admin/configuracion", icon: "⚙️" },
    
    // Acciones rápidas
    { id: "nuevo-pedido", title: "Nuevo Pedido", description: "Crear un nuevo pedido", type: "action", href: "/admin/pedidos/nuevo", icon: "➕" },
    { id: "agregar-producto", title: "Agregar Producto", description: "Añadir nuevo producto al menú", type: "action", href: "/admin/productos/nuevo", icon: "➕" },
    { id: "ver-stock", title: "Ver Stock", description: "Consultar niveles de inventario", type: "action", href: "/admin/inventario", icon: "📊" },
    { id: "reporte-ventas", title: "Reporte de Ventas", description: "Generar reporte de ventas", type: "action", href: "/admin/reportes/ventas", icon: "📈" },
    
    // Métricas del dashboard
    { id: "ventas-totales", title: "Ventas Totales", description: "Ver métricas de ventas", type: "metric", href: "/admin", icon: "💰" },
    { id: "pedidos-pendientes", title: "Pedidos Pendientes", description: "Pedidos sin confirmar", type: "metric", href: "/admin/pedidos?status=pending", icon: "⏳" },
    { id: "productos-populares", title: "Productos Populares", description: "Productos más vendidos", type: "metric", href: "/admin", icon: "⭐" },
    { id: "clientes-activos", title: "Clientes Activos", description: "Clientes registrados", type: "metric", href: "/admin/clientes", icon: "👤" },
    
    // Configuraciones
    { id: "ajustes-perfil", title: "Ajustes de Perfil", description: "Modificar información personal", type: "setting", href: "/admin/configuracion/perfil", icon: "👤" },
    { id: "notificaciones", title: "Notificaciones", description: "Configurar alertas y notificaciones", type: "setting", href: "/admin/configuracion/notificaciones", icon: "🔔" },
    { id: "tema", title: "Tema", description: "Cambiar tema claro/oscuro", type: "setting", href: "#", icon: "🌙" },
  ];

  // Filtrar resultados basado en la consulta
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const filtered = searchData.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered.slice(0, 8)); // Limitar a 8 resultados
    setSelectedIndex(-1);
  }, [query]);

  // Manejar teclas especiales
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setQuery("");
        break;
    }
  };

  // Manejar click en resultado
  const handleResultClick = (result) => {
    if (result.href !== "#") {
      window.location.href = result.href;
    }
    setIsOpen(false);
    setQuery("");
  };

  // Abrir búsqueda
  const openSearch = () => {
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Cerrar búsqueda
  const closeSearch = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
  };

  // Manejar click fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        closeSearch();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Manejar atajo de teclado (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="relative" ref={resultsRef}>
      {/* Botón de búsqueda */}
      <Button
        variant="ghost"
        onClick={openSearch}
        className="flex items-center space-x-2 px-3 py-2 h-10 bg-[#363C47] dark:bg-[#363C47] hover:bg-[#2a2f3a] dark:hover:bg-[#2a2f3a] rounded-lg border-0 text-gray-300 dark:text-gray-300 min-w-[300px] justify-start"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Buscar en el panel...</span>
        {/* Removed ⌘K shortcut display */}
      </Button>

      {/* Modal de búsqueda */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          >
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSearch}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Contenedor de búsqueda */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
              {/* Input de búsqueda */}
              <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar páginas, acciones, métricas..."
                  className="flex-1 bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeSearch}
                  className="w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Resultados */}
              <div className="max-h-96 overflow-y-auto">
                {query.trim().length === 0 ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Escribe para buscar en el panel de administración</p>
                    <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Command className="w-3 h-3" />
                        <span>K</span>
                        <span>para abrir</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ArrowRight className="w-3 h-3" />
                        <span>para navegar</span>
                      </div>
                    </div>
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No se encontraron resultados para "{query}"</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {results.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleResultClick(result)}
                        className={`flex items-center space-x-3 px-4 py-3 cursor-pointer transition-colors ${
                          selectedIndex === index
                            ? "bg-empanada-golden/10 border-l-4 border-empanada-golden"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="text-lg">{result.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {result.title}
                            </p>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                result.type === "page" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                                result.type === "action" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                result.type === "metric" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" :
                                "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                              }`}
                            >
                              {result.type === "page" ? "Página" :
                               result.type === "action" ? "Acción" :
                               result.type === "metric" ? "Métrica" : "Configuración"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {result.description}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer con atajos */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <ArrowRight className="w-3 h-3" />
                      <span>Seleccionar</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <X className="w-3 h-3" />
                      <span>Cerrar</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Command className="w-3 h-3" />
                    <span>K</span>
                    <span>para abrir</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
