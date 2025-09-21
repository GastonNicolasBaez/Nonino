import { Outlet, Link, NavLink, useLocation, useNavigate } from "react-router";
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
    User,
    ChevronDown,
    ChevronUp,
    Building2
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { useSession } from "@/context/SessionProvider";
import { AnimatedGradientText } from "../ui/animated-gradient-text";
import { GlobalSearch } from "../common/GlobalSearch";
import { CustomSelect } from "../branding";
import { InlineSearch } from "../common/InlineSearch";
import { NotificationsDropdown } from "../common/NotificationsDropdown";
import { Avatar } from "../ui/avatar";
import { useScrollToTop } from "@/hooks/useScrollToTop";

import { useTheme } from "@/context/ThemeProvider";
import { useAdminData } from "@/context/AdminDataProvider";
import { useOrders } from "@/context/OrdersContext";

const AdminLayout = () => {
    const session = useSession();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        sucursales,
        sucursalSeleccionada,
        setSucursalSeleccionada,
        adminDataLoading,
    } = useAdminData();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

    // Opciones para CustomSelect de sucursales
    const sucursalOptions = [
        { 
            value: "", 
            label: adminDataLoading ? "Cargando sucursales..." : "Selecciona una sucursal" 
        },
        ...(sucursales?.map(store => ({
            value: store.id,
            label: `${store.name}`
        })) || [])
    ];
    const { toggleTheme, isDark } = useTheme();
    const { pendingOrdersCount } = useOrders();

    // Automatically scroll to top when route changes
    useScrollToTop();

    const handleLogout = () => {
        session.logout();
        navigate('/intranet/login');
    };

    // Cerrar dropdown de productos cuando cambias de ruta (excepto subsecciones de productos)
    useEffect(() => {
        if (!location.pathname.includes('/productos')) {
            setProductsDropdownOpen(false);
        }
    }, [location.pathname]);

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
        {
            name: "Pedidos",
            href: "/intranet/admin/pedidos",
            icon: ShoppingCart,
            badge: pendingOrdersCount > 0 ? pendingOrdersCount : null
        },
        {
            name: "Productos",
            icon: Package,
            hasDropdown: true,
            dropdownItems: [
                { name: "Gestionar", href: "/intranet/admin/productos", icon: Package },
                { name: "Menú", href: "/intranet/admin/productos-sucursal", icon: Building2 }
            ]
        },
        { name: "Inventario", href: "/intranet/admin/inventario", icon: Archive },
        { name: "Clientes", href: "/intranet/admin/clientes", icon: Users },
        { name: "Reportes", href: "/intranet/admin/reportes", icon: BarChart3 },
        { name: "Configuración", href: "/intranet/admin/configuracion", icon: Settings },
    ];

    // Función simplificada para determinar si un item está activo
    const isItemActive = (item) => {
        if (item.hasDropdown) {
            // Para productos: activo si el dropdown está abierto O si estás en una subsección
            return productsDropdownOpen || location.pathname.includes('/productos');
        } else {
            // Para otros items: activo si la ruta coincide exactamente
            return location.pathname === item.href;
        }
    };

    // Función para determinar si otras secciones deben estar desactivadas
    const shouldDeactivateOthers = () => {
        return productsDropdownOpen || location.pathname.includes('/productos');
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
                <div className={`flex items-center border-b border-gray-200 dark:border-gray-700 ${sidebarCollapsed ? 'justify-center p-4' : 'justify-between p-6'
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
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                    
                    {(session.userData.sucursalAsignada) ? (          
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-2">
                            {sucursales[0]?.name}
                        </span>                        
                    ) : (
                        <CustomSelect
                            value={sucursalSeleccionada}
                            onChange={setSucursalSeleccionada}
                            options={sucursalOptions}
                            placeholder="Selecciona una sucursal"
                            disabled={adminDataLoading}
                        />
                    )}

                    {navigationItems.map((item) => (
                        <div key={item.name}>
                            {item.hasDropdown ? (
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                                        className={`w-full flex items-center px-4 py-3 rounded-lg admin-nav-item group ${isItemActive(item)
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
                                        {!sidebarCollapsed && (
                                            <div className="flex items-center space-x-2">
                                                {item.badge && (
                                                    <Badge
                                                        variant={isItemActive(item) ? "secondary" : "empanada"}
                                                        className="text-xs"
                                                    >
                                                        {item.badge}
                                                    </Badge>
                                                )}
                                                {productsDropdownOpen ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </div>
                                        )}
                                        {sidebarCollapsed && item.badge && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                                {item.badge}
                                            </div>
                                        )}
                                    </button>

                                    {/* Dropdown Items */}
                                    {!sidebarCollapsed && productsDropdownOpen && (
                                        <div className="ml-4 space-y-1">
                                            {item.dropdownItems.map((subItem) => (
                                                <NavLink
                                                    key={subItem.name}
                                                    to={subItem.href}
                                                    end
                                                    className={({ isActive }) => `flex items-center px-4 py-2 rounded-lg text-sm transition-colors ${isActive
                                                        ? "bg-empanada-golden/20 text-empanada-golden font-medium"
                                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        }`}
                                                >
                                                    <subItem.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                                                    <span>{subItem.name}</span>
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to={item.href}
                                    className={`relative flex items-center px-4 py-3 rounded-lg admin-nav-item group ${isItemActive(item) && !shouldDeactivateOthers()
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
                                            variant={isItemActive(item) && !shouldDeactivateOthers() ? "secondary" : "empanada"}
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
                            )}
                        </div>
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
                        <Card className="p-4 admin-user-card">
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
                className={`fixed lg:hidden inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                <nav className="p-4 space-y-2 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                    {(session.userData.sucursalAsignada) ? (          
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-2">
                            {sucursales[0]?.name}
                        </span>                        
                    ) : (
                        <CustomSelect
                            value={sucursalSeleccionada}
                            onChange={setSucursalSeleccionada}
                            options={sucursalOptions}
                            placeholder="Selecciona una sucursal"
                            disabled={adminDataLoading}
                        />
                    )}

                    {navigationItems.map((item) => (
                        <div key={item.name}>
                            {item.hasDropdown ? (
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isItemActive(item)
                                            ? "bg-empanada-golden text-white"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <item.icon className="w-5 h-5" />
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {item.badge && (
                                                <Badge
                                                    variant={isItemActive(item) ? "secondary" : "empanada"}
                                                    className="text-xs"
                                                >
                                                    {item.badge}
                                                </Badge>
                                            )}
                                            {productsDropdownOpen ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Dropdown Items */}
                                    {productsDropdownOpen && (
                                        <div className="ml-4 space-y-1">
                                            {item.dropdownItems.map((subItem) => (
                                                <NavLink
                                                    key={subItem.name}
                                                    to={subItem.href}
                                                    end
                                                    onClick={() => setSidebarOpen(false)}
                                                    className={({ isActive }) => `flex items-center px-4 py-2 rounded-lg text-sm transition-colors ${isActive
                                                        ? "bg-empanada-golden/20 text-empanada-golden font-medium"
                                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        }`}
                                                >
                                                    <subItem.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                                                    <span>{subItem.name}</span>
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isItemActive(item) && !shouldDeactivateOthers()
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
                                            variant={isItemActive(item) && !shouldDeactivateOthers() ? "secondary" : "empanada"}
                                            className="text-xs"
                                        >
                                            {item.badge}
                                        </Badge>
                                    )}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* User Info */}
                <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
                    <Card className="p-4 admin-user-card">
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
                    <div className="px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden flex-shrink-0"
                                >
                                    <Menu className="w-5 h-5" />
                                </Button>

                                {/* Componente de búsqueda global */}
                                <div className="flex-1 min-w-0 max-w-[200px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                                    <InlineSearch />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                                {/* Notifications Dropdown */}
                                <div className="hidden sm:block">
                                    <NotificationsDropdown />
                                </div>

                                {/* Theme Toggle */}
                                <Button variant="ghost" size="icon" onClick={toggleTheme} className="flex-shrink-0">
                                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </Button>

                                {/* User Menu */}
                                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px] lg:max-w-none">
                                            {session.userData?.name || 'NOMBRE NO ENCONTRADO'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] lg:max-w-none">
                                            {session.userData?.email || 'EMAIL NO ENCONTRADO'}
                                        </p>
                                    </div>
                                    <div className="w-8 h-8 bg-empanada-golden rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto admin-main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout