import { Outlet, Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Archive, 
  Users, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Moon,
  Sun,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { AnimatedGradientText } from "../ui/animated-gradient-text";
import { GlobalSearch } from "../common/GlobalSearch";
import { InlineSearch } from "../common/InlineSearch";
import { NotificationsDropdown } from "../common/NotificationsDropdown";
import { Avatar } from "../ui/avatar";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  // Persistir estado del sidebar en localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('admin-sidebar-collapsed');
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(!sidebarCollapsed));
  };

  const navigationItems = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Pedidos", href: "/admin/pedidos", icon: ShoppingCart },
    { name: "Productos", href: "/admin/productos", icon: Package },
    { name: "Inventario", href: "/admin/inventario", icon: Archive },
    { name: "Clientes", href: "/admin/clientes", icon: Users },
    { name: "Reportes", href: "/admin/reportes", icon: BarChart3 },
    { name: "Configuración", href: "/admin/configuracion", icon: Settings },
  ];

  const isActive = (href) => {
    if (href === "/admin") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const sidebarVariants = {
    closed: { x: "-100%" },
    open: { x: 0 },
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`hidden lg:flex lg:flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-screen ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Desktop Sidebar Content */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/admin" className="flex items-center space-x-2">
            <motion.div
              className="text-2xl"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              🥟
            </motion.div>
            {!sidebarCollapsed && (
              <div>
                <AnimatedGradientText className="text-lg font-bold">
                  NONINO
                </AnimatedGradientText>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
              </div>
            )}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`relative flex items-center px-4 py-3 rounded-lg transition-colors group ${
                isActive(item.href)
                  ? "bg-empanada-golden text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              } ${sidebarCollapsed ? "justify-center" : "justify-between"}`}
              title={sidebarCollapsed ? item.name : undefined}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </div>
              {!sidebarCollapsed && item.badge && (
                <Badge 
                  variant={isActive(item.href) ? "secondary" : "empanada"} 
                  className="text-xs"
                >
                  {item.badge}
                </Badge>
              )}
              {sidebarCollapsed && item.badge && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {item.badge}
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop User Info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {sidebarCollapsed ? (
            <div className="flex flex-col items-center space-y-2">
              <Avatar name={user?.name} size="md" />
            </div>
          ) : (
            <Card className="p-4 ">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar name={user?.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="flex-1"
                >
                  {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  {isDark ? "Claro" : "Oscuro"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex-1"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </div>
            </Card>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={sidebarOpen ? "open" : "closed"}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed lg:hidden inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/admin" className="flex items-center space-x-2">
            <motion.div
              className="text-2xl"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              🥟
            </motion.div>
            <div>
              <AnimatedGradientText className="text-lg font-bold">
                NONINO
              </AnimatedGradientText>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-empanada-golden text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </div>
              {item.badge && (
                <Badge 
                  variant={isActive(item.href) ? "secondary" : "empanada"} 
                  className="text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <Card className="p-4 ">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar name={user?.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="flex-1"
              >
                {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                {isDark ? "Claro" : "Oscuro"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex-1"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </Card>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                
                {/* Botón para colapsar sidebar en desktop */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="hidden lg:flex"
                >
                  {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </Button>
                
                {/* Componente de búsqueda global */}
                <InlineSearch />
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Notifications Dropdown */}
                <NotificationsDropdown />

                {/* Theme Toggle */}
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Administrador
                    </p>
                  </div>
                  <Avatar name={user?.name} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
