import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
// Removed framer-motion for simpler admin experience
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
  ChevronRight,
  User
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { useSession } from "@/context/SessionProvider";
import { AnimatedGradientText } from "../ui/animated-gradient-text";
import { GlobalSearch } from "../common/GlobalSearch";
import { InlineSearch } from "../common/InlineSearch";
import { NotificationsDropdown } from "../common/NotificationsDropdown";
import { Avatar } from "../ui/avatar";
import { useScrollToTop } from "@/hooks/useScrollToTop";

import { useTheme } from "@/context/ThemeProvider";

const AdminLayout = () => {
  const session = useSession();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();

  // Automatically scroll to top when route changes
  useScrollToTop();

  const handleLogout = () => {
    session.logout();
    navigate('/intranet/login');
  };
  // const { user, logout } = useAuth();
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
    { name: "Dashboard", href: "/intranet/admin", icon: Home },
    { name: "Pedidos", href: "/intranet/admin/pedidos", icon: ShoppingCart },
    { name: "Productos", href: "/intranet/admin/productos", icon: Package },
    { name: "Inventario", href: "/intranet/admin/inventario", icon: Archive },
    { name: "Clientes", href: "/intranet/admin/clientes", icon: Users },
    { name: "Reportes", href: "/intranet/admin/reportes", icon: BarChart3 },
    { name: "Configuración", href: "/intranet/admin/configuracion", icon: Settings },
  ];

  const isActive = (href) => {
    if (href === "/intranet/admin") {
      return location.pathname === href;
    }
    return location.pathname === href;
  };


  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 admin-layout-light flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside 
        className="hidden lg:flex lg:flex-col bg-white dark:bg-gray-800 admin-sidebar-light border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-screen"
        style={{ width: sidebarCollapsed ? '5.5rem' : '16rem' }}
      >
        {/* Desktop Sidebar Content */}
        <div className={`flex items-center border-b border-gray-200 dark:border-gray-700 ${
          sidebarCollapsed ? 'justify-center p-4' : 'justify-between p-6'
        }`}>
          {sidebarCollapsed ? (
            /* Layout colapsado: Logo centrado con botón debajo */
            <div className="flex flex-col items-center space-y-3">
              <Link to="/admin" className="flex items-center justify-center">
                <img 
                  src="/src/assets/images/remo.png" 
                  alt="Nonino Empanadas" 
                  className="w-12 h-12"
                />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Expandir sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            /* Layout expandido: Logo, texto y botón de colapso */
            <>
              <Link to="/admin" className="flex items-center space-x-2">
                <img 
                  src="/src/assets/images/remo.png" 
                  alt="Nonino Empanadas" 
                  className="w-8 h-8"
                />
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
                onClick={toggleSidebar}
                className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Colapsar sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`relative flex items-center px-4 py-3 rounded-lg admin-nav-item group ${
                isActive(item.href)
                  ? "bg-empanada-golden text-white active"
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
            <div className="flex flex-col items-center space-y-3">
              <div className="w-10 h-10 bg-empanada-golden rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="w-10 h-10 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Card className="p-4 ">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-empanada-golden rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {session.userData?.name || 'NOMBRE NO ENCONTRADO'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {session.userData?.email || 'EMAIL NO ENCONTRADO'}
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
                  onClick={handleLogout}
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
      <aside
        className={`fixed lg:hidden inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/admin" className="flex items-center space-x-2">
            <img 
              src="/src/assets/images/remo.png" 
              alt="Nonino Empanadas" 
              className="w-8 h-8"
            />
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
              <div className="w-10 h-10 bg-empanada-golden rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {session.userData?.name || 'NOMBRE NO ENCONTRADO'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {session.userData?.email || 'EMAIL NO ENCONTRADO'}
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
                onClick={handleLogout}
                className="flex-1"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </Card>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 admin-header shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                
                
                {/* Componente de búsqueda global */}
                <div className="flex-1 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
                  <InlineSearch />
                </div>
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
                      {session.userData?.name || 'NOMBRE NO ENCONTRADO'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {session.userData?.email || 'EMAIL NO ENCONTRADO'}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-empanada-golden rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto admin-main-content m-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout