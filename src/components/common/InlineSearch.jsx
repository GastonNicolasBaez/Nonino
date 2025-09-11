import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Command } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

/**
 * Componente de búsqueda inline para el panel de administración
 * Permite buscar entre todos los elementos y componentes del dashboard
 */
export function InlineSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  // Datos de búsqueda expandidos - incluyendo inventario, productos específicos, etc.
  const searchData = [
    // Páginas principales
    { id: "dashboard", title: "Dashboard", description: "Panel principal con métricas y estadísticas", type: "page", href: "/admin", icon: "📊" },
    { id: "pedidos", title: "Pedidos", description: "Gestionar pedidos y órdenes", type: "page", href: "/admin/pedidos", icon: "🛒" },
    { id: "productos", title: "Productos", description: "Administrar productos del menú", type: "page", href: "/admin/productos", icon: "📦" },
    { id: "inventario", title: "Inventario", description: "Control de stock y existencias", type: "page", href: "/admin/inventario", icon: "📋" },
    { id: "clientes", title: "Clientes", description: "Gestión de clientes y usuarios", type: "page", href: "/admin/clientes", icon: "👥" },
    { id: "reportes", title: "Reportes", description: "Análisis y reportes de ventas", type: "page", href: "/admin/reportes", icon: "📈" },
    { id: "configuracion", title: "Configuración", description: "Ajustes del sistema", type: "page", href: "/admin/configuracion", icon: "⚙️" },
    
    // Productos específicos
    { id: "empanada-carne", title: "Empanada de Carne", description: "Producto - Stock bajo: 5 unidades", type: "product", href: "/admin/productos/empanada-carne", icon: "🥟" },
    { id: "empanada-pollo", title: "Empanada de Pollo", description: "Producto - Stock: 38 unidades", type: "product", href: "/admin/productos/empanada-pollo", icon: "🥟" },
    { id: "empanada-jamon-queso", title: "Empanada de Jamón y Queso", description: "Producto - Stock: 42 unidades", type: "product", href: "/admin/productos/empanada-jamon-queso", icon: "🥟" },
    { id: "empanada-verdura", title: "Empanada de Verdura", description: "Producto - Stock: 35 unidades", type: "product", href: "/admin/productos/empanada-verdura", icon: "🥟" },
    { id: "empanada-humita", title: "Empanada de Humita", description: "Producto - Stock: 28 unidades", type: "product", href: "/admin/productos/empanada-humita", icon: "🥟" },
    
    // Elementos de inventario
    { id: "stock-carne", title: "Stock de Carne", description: "Inventario - Ingrediente principal", type: "inventory", href: "/admin/inventario/ingredientes", icon: "🥩" },
    { id: "stock-pollo", title: "Stock de Pollo", description: "Inventario - Ingrediente principal", type: "inventory", href: "/admin/inventario/ingredientes", icon: "🍗" },
    { id: "stock-queso", title: "Stock de Queso", description: "Inventario - Ingrediente principal", type: "inventory", href: "/admin/inventario/ingredientes", icon: "🧀" },
    { id: "stock-verdura", title: "Stock de Verdura", description: "Inventario - Ingrediente principal", type: "inventory", href: "/admin/inventario/ingredientes", icon: "🥬" },
    { id: "stock-masa", title: "Stock de Masa", description: "Inventario - Ingrediente base", type: "inventory", href: "/admin/inventario/ingredientes", icon: "🌾" },
    
    // Pedidos específicos
    { id: "pedido-001", title: "Pedido #ORD-001", description: "María González - $4,500 - Completado", type: "order", href: "/admin/pedidos/ORD-001", icon: "📋" },
    { id: "pedido-002", title: "Pedido #ORD-002", description: "Carlos Rodríguez - $3,200 - Preparando", type: "order", href: "/admin/pedidos/ORD-002", icon: "📋" },
    { id: "pedido-003", title: "Pedido #ORD-003", description: "Ana Martínez - $7,500 - Pendiente", type: "order", href: "/admin/pedidos/ORD-003", icon: "📋" },
    
    // Clientes específicos
    { id: "cliente-maria", title: "María González", description: "Cliente - 12 pedidos - $45,000 gastado", type: "customer", href: "/admin/clientes/maria-gonzalez", icon: "👤" },
    { id: "cliente-carlos", title: "Carlos Rodríguez", description: "Cliente - 8 pedidos - $32,000 gastado", type: "customer", href: "/admin/clientes/carlos-rodriguez", icon: "👤" },
    { id: "cliente-ana", title: "Ana Martínez", description: "Cliente - 15 pedidos - $75,000 gastado", type: "customer", href: "/admin/clientes/ana-martinez", icon: "👤" },
    
    // Acciones rápidas
    { id: "nuevo-pedido", title: "Nuevo Pedido", description: "Crear un nuevo pedido", type: "action", href: "/admin/pedidos/nuevo", icon: "➕" },
    { id: "agregar-producto", title: "Agregar Producto", description: "Añadir nuevo producto al menú", type: "action", href: "/admin/productos/nuevo", icon: "➕" },
    { id: "ver-stock", title: "Ver Stock", description: "Consultar niveles de inventario", type: "action", href: "/admin/inventario", icon: "📊" },
    { id: "reporte-ventas", title: "Reporte de Ventas", description: "Generar reporte de ventas", type: "action", href: "/admin/reportes/ventas", icon: "📈" },
    { id: "reabastecer-stock", title: "Reabastecer Stock", description: "Actualizar niveles de inventario", type: "action", href: "/admin/inventario/reabastecer", icon: "📦" },
    
    // Métricas del dashboard
    { id: "ventas-totales", title: "Ventas Totales", description: "Ver métricas de ventas - $1,250,000", type: "metric", href: "/admin", icon: "💰" },
    { id: "pedidos-pendientes", title: "Pedidos Pendientes", description: "Pedidos sin confirmar - 3 pedidos", type: "metric", href: "/admin/pedidos?status=pending", icon: "⏳" },
    { id: "productos-populares", title: "Productos Populares", description: "Productos más vendidos", type: "metric", href: "/admin", icon: "⭐" },
    { id: "clientes-activos", title: "Clientes Activos", description: "Clientes registrados - 156 usuarios", type: "metric", href: "/admin/clientes", icon: "👤" },
    { id: "stock-bajo", title: "Stock Bajo", description: "Productos con stock bajo - Empanada de Carne", type: "metric", href: "/admin/inventario", icon: "⚠️" },
    
    // Configuraciones
    { id: "ajustes-perfil", title: "Ajustes de Perfil", description: "Modificar información personal", type: "setting", href: "/admin/configuracion/perfil", icon: "👤" },
    { id: "notificaciones", title: "Notificaciones", description: "Configurar alertas y notificaciones", type: "setting", href: "/admin/configuracion/notificaciones", icon: "🔔" },
    { id: "tema", title: "Tema", description: "Cambiar tema claro/oscuro", type: "setting", href: "#", icon: "🌙" },
    { id: "configuracion-menu", title: "Configuración del Menú", description: "Ajustar precios y disponibilidad", type: "setting", href: "/admin/configuracion/menu", icon: "🍽️" },
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

    setResults(filtered.slice(0, 6)); // Limitar a 6 resultados para el inline
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
    <div className="relative w-full max-w-md" ref={resultsRef}>
      {/* Input de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={openSearch}
          placeholder="Buscar en el panel..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-input text-foreground placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-empanada-golden focus:border-transparent"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {/* Removed ⌘K shortcut display */}
        </div>
      </div>

      {/* Resultados inline */}
      <AnimatePresence>
        {isOpen && query.trim().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-80 overflow-y-auto"
          >
            {results.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No se encontraron resultados para "{query}"</p>
              </div>
            ) : (
              <div className="py-2">
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
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
                            result.type === "product" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                            result.type === "inventory" ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
                            result.type === "order" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" :
                            result.type === "customer" ? "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400" :
                            result.type === "action" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                            result.type === "metric" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400" :
                            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                          }`}
                        >
                          {result.type === "page" ? "Página" :
                           result.type === "product" ? "Producto" :
                           result.type === "inventory" ? "Inventario" :
                           result.type === "order" ? "Pedido" :
                           result.type === "customer" ? "Cliente" :
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
