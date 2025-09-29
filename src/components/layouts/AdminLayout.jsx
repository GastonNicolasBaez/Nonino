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
    Building2,
    Truck
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

import logoNonino from '@/assets/logos/nonino.png';

const AdminLayout = () => {
    const session = useSession();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        sucursales,
        sucursalSeleccionada,
        setSucursalSeleccionada,
        showDebugStateInfo,
        adminDataLoading,
    } = useAdminData();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [definitionsDropdownOpen, setDefinitionsDropdownOpen] = useState(false);
    const [inventoryDropdownOpen, setInventoryDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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

    // Persistir estado del sidebar en localStorage
    useEffect(() => {
        const savedState = localStorage.getItem('admin-sidebar-collapsed');
        if (savedState !== null) {
            setSidebarCollapsed(JSON.parse(savedState));
        }
    }, []);

    // Cerrar dropdown cuando se hace click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownOpen && !event.target.closest('.user-dropdown-container')) {
                setUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [userDropdownOpen]);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
        localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(!sidebarCollapsed));
    };


    const navigationItemsByRole = {
        "ADMIN": [
            { name: "Dashboard", href: "/intranet/admin", icon: Home },
            {
                name: "Órdenes",
                href: "/intranet/admin/ordenes",
                icon: ShoppingCart,
                badge: pendingOrdersCount > 0 ? pendingOrdersCount : null
            },
            { name: "Menú", href: "/intranet/admin/menu", icon: Menu },
            {
                name: "Definiciones",
                icon: Package,
                hasDropdown: true,
                dropdownItems: [
                    { name: "Productos", href: "/intranet/admin/productos", icon: Package },
                    { name: "Materiales", href: "/intranet/admin/materiales", icon: Archive },
                    { name: "Combos", href: "/intranet/admin/combos", icon: ShoppingCart }
                ]
            },
            {
                name: "Inventario",
                icon: Archive,
                hasDropdown: true,
                dropdownItems: [
                    { name: "Productos", href: "/intranet/admin/inventario-productos", icon: ShoppingCart },
                    { name: "Materiales", href: "/intranet/admin/inventario-materiales", icon: Package }
                ]
            },
            { name: "Clientes", href: "/intranet/admin/clientes", icon: Users },
            { name: "Métricas", href: "/intranet/admin/metricas", icon: BarChart3 },
            { name: "Configuración", href: "/intranet/admin/configuracion", icon: Settings },
        ],
        "LOCAL": [
            { name: "Dashboard", href: "/intranet/local", icon: Home },
            {
                name: "Pedidos",
                href: "/intranet/local/pedidos",
                icon: ShoppingCart,
                badge: pendingOrdersCount > 0 ? pendingOrdersCount : null
            },
            {
                name: "Sucursal",
                icon: Building2,
                hasDropdown: true,
                dropdownItems: [
                    { name: "Gestionar", href: "/intranet/local/sucursal", icon: Building2 },
                    { name: "Envíos", href: "/intranet/local/sucursal-envios", icon: Truck }
                ]
            },
            {
                name: "Inventario",
                icon: Archive,
                hasDropdown: true,
                dropdownItems: [
                    { name: "Gestión", href: "/intranet/local/inventario", icon: Archive },
                    { name: "Productos", href: "/intranet/local/inventario-productos", icon: ShoppingCart },
                    { name: "Receta", href: "/intranet/local/inventario-receta", icon: Package }
                ]
            },
            { name: "Reportes", href: "/intranet/local/reportes", icon: BarChart3 },
        ],
        "FABRICA": [
            { name: "Dashboard", href: "/intranet/fabrica", icon: Home },
            {
                name: "Inventario",
                icon: Archive,
                hasDropdown: true,
                dropdownItems: [
                    { name: "Gestión", href: "/intranet/fabrica/inventario", icon: Archive },
                    { name: "Productos", href: "/intranet/fabrica/inventario-productos", icon: ShoppingCart },
                    { name: "Receta", href: "/intranet/fabrica/inventario-receta", icon: Package }
                ]
            },
        ],
    }

    const assignedNavigationItems = navigationItemsByRole[session.userData.role];

    // Abrir/cerrar dropdowns basado en la ruta actual
    useEffect(() => {
        if (location.pathname.includes('/productos') || location.pathname.includes('/materiales') ||
            location.pathname.includes('/combos')) {
            setDefinitionsDropdownOpen(true);
        } else {
            setDefinitionsDropdownOpen(false);
        }

        if (location.pathname.includes('/inventario')) {
            setInventoryDropdownOpen(true);
        } else {
            setInventoryDropdownOpen(false);
        }
    }, [location.pathname]);

    // Función simplificada para determinar si un item está activo
    const isItemActive = (item) => {
        if (item.hasDropdown) {
            if (item.name === "Definiciones") {
                // Para definiciones: activo solo si el dropdown está abierto
                return definitionsDropdownOpen;
            } else if (item.name === "Inventario") {
                // Para inventario: activo solo si el dropdown está abierto
                return inventoryDropdownOpen;
            }
        } else {
            // Para otros items: activo si la ruta coincide exactamente
            return location.pathname === item.href;
        }
    };

    // Función para determinar si otras secciones deben estar desactivadas
    const shouldDeactivateOthers = () => {
        return definitionsDropdownOpen || location.pathname.includes('/productos') ||
            location.pathname.includes('/materiales') || location.pathname.includes('/combos') ||
            inventoryDropdownOpen || location.pathname.includes('/inventario');
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
                                    src={logoNonino}
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
                                    src={logoNonino}
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

                    {(session.userData.isAdmin) ? (
                        <CustomSelect
                            value={sucursalSeleccionada}
                            onChange={setSucursalSeleccionada}
                            options={sucursalOptions}
                            placeholder="Selecciona una sucursal"
                            disabled={adminDataLoading}
                        />
                    ) : (
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-2">
                            {sucursales[0]?.name}
                        </span>
                    )}

                    {assignedNavigationItems.map((item) => (
                        <div key={item.name}>
                            {item.hasDropdown ? (
                                <div className="space-y-1">
                                    <button
                                        onClick={() => {
                                            if (item.name === "Definiciones") {
                                                setDefinitionsDropdownOpen(!definitionsDropdownOpen);
                                                setInventoryDropdownOpen(false);
                                            } else if (item.name === "Inventario") {
                                                setInventoryDropdownOpen(!inventoryDropdownOpen);
                                                setDefinitionsDropdownOpen(false);
                                            }
                                        }}
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
                                                {((item.name === "Definiciones" && definitionsDropdownOpen) ||
                                                    (item.name === "Inventario" && inventoryDropdownOpen)) ? (
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
                                    {!sidebarCollapsed && ((item.name === "Definiciones" && definitionsDropdownOpen) ||
                                        (item.name === "Inventario" && inventoryDropdownOpen)) && (
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
                                    onClick={() => {
                                        // Cerrar dropdowns cuando hacemos click en otros elementos
                                        setDefinitionsDropdownOpen(false);
                                        setInventoryDropdownOpen(false);
                                    }}
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
                            src={logoNonino}
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
                    {(session.userData.isAdmin) ? (
                        <CustomSelect
                            value={sucursalSeleccionada}
                            onChange={setSucursalSeleccionada}
                            options={sucursalOptions}
                            placeholder="Selecciona una sucursal"
                            disabled={adminDataLoading}
                        />
                    ) : (
                        <>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-2">
                                {sucursales[0]?.name}
                            </span>
                        </>
                    )}

                    {assignedNavigationItems.map((item) => (
                        <div key={item.name}>
                            {item.hasDropdown ? (
                                <div className="space-y-1">
                                    <button
                                        onClick={() => {
                                            if (item.name === "Definiciones") {
                                                setDefinitionsDropdownOpen(!definitionsDropdownOpen);
                                                setInventoryDropdownOpen(false);
                                            } else if (item.name === "Inventario") {
                                                setInventoryDropdownOpen(!inventoryDropdownOpen);
                                                setDefinitionsDropdownOpen(false);
                                            }
                                        }}
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
                                            {((item.name === "Productos" && productsDropdownOpen) ||
                                                (item.name === "Sucursal" && branchesDropdownOpen) ||
                                                (item.name === "Inventario" && inventoryDropdownOpen)) ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Dropdown Items */}
                                    {((item.name === "Productos" && productsDropdownOpen) ||
                                        (item.name === "Sucursal" && branchesDropdownOpen) ||
                                        (item.name === "Inventario" && inventoryDropdownOpen)) && (
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
                                    onClick={() => {
                                        setSidebarOpen(false);
                                        // Cerrar dropdowns cuando hacemos click en otros elementos
                                        setDefinitionsDropdownOpen(false);
                                        setInventoryDropdownOpen(false);
                                    }}
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


                                {/* User Menu */}
                                <div className="relative flex items-center gap-2 sm:gap-3 flex-shrink-0 user-dropdown-container">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px] lg:max-w-none">
                                            {session.userData?.name || 'NOMBRE NO ENCONTRADO'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] lg:max-w-none">
                                            {session.userData?.email || 'EMAIL NO ENCONTRADO'}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                        className="w-8 h-8 bg-empanada-golden rounded-full hover:bg-empanada-golden/80 flex-shrink-0"
                                    >
                                        <User className="w-4 h-4 text-white" />
                                    </Button>

                                    {/* User Dropdown */}
                                    {userDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center space-x-3 mb-2">
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
                                            </div>
                                            <div className="p-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => showDebugStateInfo()}
                                                >
                                                    DEBUG STATE INFO
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        toggleTheme();
                                                        setUserDropdownOpen(false);
                                                    }}
                                                    className="w-full justify-start mb-1"
                                                >
                                                    {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                                                    {isDark ? "Modo Claro" : "Modo Oscuro"}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        handleLogout();
                                                        setUserDropdownOpen(false);
                                                    }}
                                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                                                >
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Cerrar Sesión
                                                </Button>
                                            </div>
                                        </div>
                                    )}
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