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
    LogOut,
    Bell,
    ChevronLeft,
    ChevronRight,
    User,
    ChevronDown,
    ChevronUp,
    Building2,
    Truck,
    Factory,
    Tag,
    RefreshCcw,
    Clock
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

import { useAdminData } from "@/context/AdminDataProvider";

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
        adminStartingLoading,

        orders,

        refreshAll,
        callActualizarSucursal,
    } = useAdminData();

    const pendingOrdersCount = orders.filter(order => order.status === 'pending').length;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [definitionsDropdownOpen, setDefinitionsDropdownOpen] = useState(false);
    const [inventoryDropdownOpen, setInventoryDropdownOpen] = useState(false);
    const [sucursalDropdownOpen, setSucursalDropdownOpen] = useState(false);
    const [fabricaDropdownOpen, setFabricaDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [deliveryTimeInput, setDeliveryTimeInput] = useState('');
    const [isUpdatingDeliveryTime, setIsUpdatingDeliveryTime] = useState(false);

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

    // Sincronizar input de tiempo de envío con la sucursal seleccionada
    // SOLO cuando cambia la sucursal, NO cuando escribís en el input
    useEffect(() => {
        if (sucursalSeleccionada && sucursales.length > 0) {
            const sucursal = sucursales.find(s => s.id === sucursalSeleccionada);
            if (sucursal) {
                // El campo puede ser deliveryTimeMinutes, estimatedDeliveryTime o deliveryTime
                const deliveryTime = sucursal.deliveryTimeMinutes || sucursal.estimatedDeliveryTime || sucursal.deliveryTime || '';
                setDeliveryTimeInput(deliveryTime.toString());
                console.log('[AdminLayout] Sucursal seleccionada:', sucursal);
                console.log('[AdminLayout] Campos de tiempo:', {
                    deliveryTimeMinutes: sucursal.deliveryTimeMinutes,
                    estimatedDeliveryTime: sucursal.estimatedDeliveryTime,
                    deliveryTime: sucursal.deliveryTime
                });
            }
        } else {
            setDeliveryTimeInput('');
        }
    }, [sucursalSeleccionada]); // Solo depende de sucursalSeleccionada, NO de sucursales

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

    // Función para actualizar tiempo de envío con debounce
    const updateDeliveryTime = async (newTime) => {
        if (!sucursalSeleccionada || !session.userData?.accessToken) return;
        
        setIsUpdatingDeliveryTime(true);
        try {
            const sucursal = sucursales.find(s => s.id === sucursalSeleccionada);
            if (sucursal) {
                const updatedSucursal = {
                    ...sucursal,
                    deliveryTimeMinutes: parseInt(newTime) || 0
                };
                
                console.log('[AdminLayout] Enviando sucursal actualizada:', updatedSucursal);
                console.log('[AdminLayout] Campo deliveryTimeMinutes:', updatedSucursal.deliveryTimeMinutes);
                
                const result = await callActualizarSucursal({
                    _store: updatedSucursal,
                    _accessToken: session.userData.accessToken,
                });
                
                console.log('[AdminLayout] Respuesta del backend:', result);
            }
        } catch (error) {
            console.error('Error al actualizar tiempo de envío:', error);
        } finally {
            setIsUpdatingDeliveryTime(false);
        }
    };

    // Debounce para actualizar tiempo de envío
    useEffect(() => {
        // No actualizar si el input está vacío o es el mismo valor inicial
        if (!deliveryTimeInput || !sucursalSeleccionada) return;
        
        const sucursal = sucursales.find(s => s.id === sucursalSeleccionada);
        const currentTime = sucursal?.deliveryTimeMinutes || sucursal?.estimatedDeliveryTime || sucursal?.deliveryTime || '';
        
        // Solo actualizar si el valor cambió
        if (deliveryTimeInput === currentTime.toString()) return;
        
        const timeoutId = setTimeout(() => {
            console.log('[AdminLayout] Actualizando tiempo de envío a:', deliveryTimeInput);
            updateDeliveryTime(deliveryTimeInput);
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [deliveryTimeInput]);


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
                name: "Catálogos",
                icon: Package,
                hasDropdown: true,
                dropdownItems: [
                    { name: "Productos", href: "/intranet/admin/productos", icon: Package },
                    { name: "Categorías", href: "/intranet/admin/categorias", icon: Tag },
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
            {
                name: "Sucursal",
                icon: Building2,
                hasDropdown: true,
                dropdownItems: [
                    { name: "Configurar", href: "/intranet/admin/sucursal-configurar", icon: Settings },
                    { name: "Envíos", href: "/intranet/admin/sucursal-delivery", icon: Truck }
                ]
            },
            {
                name: "Fábrica",
                icon: Factory,
                hasDropdown: true,
                dropdownItems: [
                    { name: "Producir", href: "/intranet/admin/fabrica-producir", icon: Package },
                    { name: "Transferir", href: "/intranet/admin/fabrica-transferir", icon: Truck }
                ]
            },
            { name: "Clientes", href: "/intranet/admin/clientes", icon: Users },
            { name: "Métricas", href: "/intranet/admin/metricas", icon: BarChart3 },
            { name: "Configuración", href: "/intranet/admin/configuracion", icon: Settings },
        ],
        "LOCAL": [
            { name: "Dashboard", href: "/intranet/local", icon: Home },
            {
                name: "Órdenes",
                href: "/intranet/local/ordenes",
                icon: ShoppingCart,
                badge: pendingOrdersCount > 0 ? pendingOrdersCount : null
            },
            { name: "Menú", href: "/intranet/local/menu", icon: Menu },
            // {
            //     name: "Catálogos",
            //     icon: Package,
            //     hasDropdown: true,
            //     dropdownItems: [
            //         { name: "Productos", href: "/intranet/local/productos", icon: Package },
            //         { name: "Categorías", href: "/intranet/local/categorias", icon: Tag },
            //         { name: "Materiales", href: "/intranet/local/materiales", icon: Archive },
            //         { name: "Combos", href: "/intranet/local/combos", icon: ShoppingCart }
            //     ]
            // },
            {
                name: "Inventario",
                icon: Archive,
                hasDropdown: true,
                dropdownItems: [
                    { name: "Productos", href: "/intranet/local/inventario-productos", icon: ShoppingCart },
                    // { name: "Materiales", href: "/intranet/local/inventario-materiales", icon: Package }
                ]
            },
            {
                name: "Sucursal",
                icon: Building2,
                hasDropdown: true,
                dropdownItems: [
                    { name: "Configurar", href: "/intranet/local/sucursal-configurar", icon: Settings },
                    { name: "Envíos", href: "/intranet/local/sucursal-delivery", icon: Truck }
                ]
            },
            // {
            //     name: "Fábrica",
            //     icon: Factory,
            //     hasDropdown: true,
            //     dropdownItems: [
            //         { name: "Producir", href: "/intranet/local/fabrica-producir", icon: Package },
            //         { name: "Transferir", href: "/intranet/local/fabrica-transferir", icon: Truck }
            //     ]
            // },
            { name: "Clientes", href: "/intranet/local/clientes", icon: Users },
            { name: "Métricas", href: "/intranet/local/metricas", icon: BarChart3 },
            // { name: "Configuración", href: "/intranet/local/configuracion", icon: Settings },
        ],
        "FABRICA": [
            { name: "Dashboard", href: "/intranet/fabrica", icon: Home },
            // {
            //     name: "Órdenes",
            //     href: "/intranet/fabrica/ordenes",
            //     icon: ShoppingCart,
            //     badge: pendingOrdersCount > 0 ? pendingOrdersCount : null
            // },
            // { name: "Menú", href: "/intranet/fabrica/menu", icon: Menu },
            // {
            //     name: "Catálogos",
            //     icon: Package,
            //     hasDropdown: true,
            //     dropdownItems: [
            //         { name: "Productos", href: "/intranet/fabrica/productos", icon: Package },
            //         { name: "Categorías", href: "/intranet/fabrica/categorias", icon: Tag },
            //         { name: "Materiales", href: "/intranet/fabrica/materiales", icon: Archive },
            //         { name: "Combos", href: "/intranet/fabrica/combos", icon: ShoppingCart }
            //     ]
            // },
            {
                name: "Inventario",
                icon: Archive,
                hasDropdown: true,
                dropdownItems: [
                    { name: "Productos", href: "/intranet/fabrica/inventario-productos", icon: ShoppingCart },
                    { name: "Materiales", href: "/intranet/fabrica/inventario-materiales", icon: Package }
                ]
            },
            // {
            //     name: "Sucursal",
            //     icon: Building2,
            //     hasDropdown: true,
            //     dropdownItems: [
            //         { name: "Configurar", href: "/intranet/fabrica/sucursal-configurar", icon: Settings },
            //         { name: "Delivery", href: "/intranet/fabrica/sucursal-delivery", icon: Truck }
            //     ]
            // },
            {
                name: "Fábrica",
                icon: Factory,
                hasDropdown: true,
                dropdownItems: [
                    { name: "Producir", href: "/intranet/fabrica/fabrica-producir", icon: Package },
                    { name: "Transferir", href: "/intranet/fabrica/fabrica-transferir", icon: Truck }
                ]
            },
            // { name: "Clientes", href: "/intranet/fabrica/clientes", icon: Users },
            // { name: "Métricas", href: "/intranet/fabrica/metricas", icon: BarChart3 },
            // { name: "Configuración", href: "/intranet/fabrica/configuracion", icon: Settings },
        ],
    }

    const assignedNavigationItems = navigationItemsByRole[session.userData.role];

    // Abrir/cerrar dropdowns basado en la ruta actual
    useEffect(() => {
        if (location.pathname.includes('/productos') || location.pathname.includes('/materiales') ||
            location.pathname.includes('/combos') || location.pathname.includes('/categorias')) {
            setDefinitionsDropdownOpen(true);
        } else {
            setDefinitionsDropdownOpen(false);
        }

        if (location.pathname.includes('/inventario')) {
            setInventoryDropdownOpen(true);
        } else {
            setInventoryDropdownOpen(false);
        }

        if (location.pathname.includes('/sucursal-')) {
            setSucursalDropdownOpen(true);
        } else {
            setSucursalDropdownOpen(false);
        }

        if (location.pathname.includes('/fabrica-')) {
            setFabricaDropdownOpen(true);
        } else {
            setFabricaDropdownOpen(false);
        }
    }, [location.pathname]);

    // Función simplificada para determinar si un item está activo
    const isItemActive = (item) => {
        if (item.hasDropdown) {
            if (item.name === "Catálogos") {
                // Para definiciones: activo solo si el dropdown está abierto
                return definitionsDropdownOpen;
            } else if (item.name === "Inventario") {
                // Para inventario: activo solo si el dropdown está abierto
                return inventoryDropdownOpen;
            } else if (item.name === "Sucursal") {
                // Para sucursal: activo solo si el dropdown está abierto
                return sucursalDropdownOpen;
            } else if (item.name === "Fábrica") {
                // Para fábrica: activo solo si el dropdown está abierto
                return fabricaDropdownOpen;
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
            inventoryDropdownOpen || location.pathname.includes('/inventario') ||
            sucursalDropdownOpen || location.pathname.includes('/sucursal-') ||
            fabricaDropdownOpen || location.pathname.includes('/fabrica-');
    };

    return (
        <div className="h-screen bg-gray-50 dark:bg-empanada-dark admin-layout-light flex overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className="hidden lg:flex lg:flex-col bg-white dark:bg-empanada-dark admin-sidebar-light border-r border-gray-200 dark:border-empanada-light-gray transition-all duration-300 h-screen"
                style={{ width: sidebarCollapsed ? '5.5rem' : '16rem' }}
            >
                {/* Desktop Sidebar Content */}
                <div className={`flex items-center border-b border-gray-200 dark:border-empanada-light-gray ${sidebarCollapsed ? 'justify-center p-4' : 'justify-between p-6'
                    }`}>
                    {sidebarCollapsed ? (
                        /* Layout colapsado: Logo centrado con botón debajo */
                        <div className="flex flex-col items-center space-y-3">
                            <Link to="/admin" className="flex items-center justify-center">
                                <img
                                    src={logoNonino}
                                    alt="Nonino Empanadas - Restaurante empanadas artesanales Patagonia Neuquén"
                                    className="w-12 h-12"
                                />
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleSidebar}
                                className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-empanada-medium"
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
                                    alt="Nonino Empanadas - Restaurante empanadas artesanales Patagonia Neuquén"
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
                                className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-empanada-medium"
                                title="Colapsar sidebar"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                </div>

                {/* Desktop Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-empanada-medium dark:scrollbar-track-empanada-dark">

                    {(session.userData.isAdmin) ? (
                        <CustomSelect
                            value={sucursalSeleccionada}
                            onChange={setSucursalSeleccionada}
                            options={sucursalOptions}
                            placeholder="Selecciona una sucursal"
                            disabled={adminDataLoading}
                        />
                    ) : (
                        <span className="text-sm font-medium text-gray-700 dark:text-white px-3 py-2">
                            {sucursales[0]?.name}
                        </span>
                    )}

                    {assignedNavigationItems.map((item) => (
                        <div key={item.name}>
                            {item.hasDropdown ? (
                                <div className="space-y-1">
                                    <button
                                        onClick={() => {
                                            if (item.name === "Catálogos") {
                                                setDefinitionsDropdownOpen(!definitionsDropdownOpen);
                                                setInventoryDropdownOpen(false);
                                                setSucursalDropdownOpen(false);
                                                setFabricaDropdownOpen(false);
                                            } else if (item.name === "Inventario") {
                                                setInventoryDropdownOpen(!inventoryDropdownOpen);
                                                setDefinitionsDropdownOpen(false);
                                                setSucursalDropdownOpen(false);
                                                setFabricaDropdownOpen(false);
                                            } else if (item.name === "Sucursal") {
                                                setSucursalDropdownOpen(!sucursalDropdownOpen);
                                                setDefinitionsDropdownOpen(false);
                                                setInventoryDropdownOpen(false);
                                                setFabricaDropdownOpen(false);
                                            } else if (item.name === "Fábrica") {
                                                setFabricaDropdownOpen(!fabricaDropdownOpen);
                                                setDefinitionsDropdownOpen(false);
                                                setInventoryDropdownOpen(false);
                                                setSucursalDropdownOpen(false);
                                            }
                                        }}
                                        className={`w-full flex items-center px-4 py-3 rounded-lg admin-nav-item group ${isItemActive(item)
                                            ? "bg-empanada-golden text-white active"
                                            : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-empanada-medium"
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
                                                {((item.name === "Catálogos" && definitionsDropdownOpen) ||
                                                    (item.name === "Inventario" && inventoryDropdownOpen) ||
                                                    (item.name === "Sucursal" && sucursalDropdownOpen) ||
                                                    (item.name === "Fábrica" && fabricaDropdownOpen)) ? (
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
                                    {!sidebarCollapsed && ((item.name === "Catálogos" && definitionsDropdownOpen) ||
                                        (item.name === "Inventario" && inventoryDropdownOpen) ||
                                        (item.name === "Sucursal" && sucursalDropdownOpen) ||
                                        (item.name === "Fábrica" && fabricaDropdownOpen)) && (
                                            <div className="ml-4 space-y-1">
                                                {item.dropdownItems.map((subItem) => (
                                                    <NavLink
                                                        key={subItem.name}
                                                        to={subItem.href}
                                                        end
                                                        className={({ isActive }) => `flex items-center px-4 py-2 rounded-lg text-sm transition-colors ${isActive
                                                            ? "bg-empanada-golden/20 text-empanada-golden font-medium"
                                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-empanada-medium"
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
                                        setSucursalDropdownOpen(false);
                                        setFabricaDropdownOpen(false);
                                    }}
                                    className={`relative flex items-center px-4 py-3 rounded-lg admin-nav-item group ${isItemActive(item) && !shouldDeactivateOthers()
                                        ? "bg-empanada-golden text-white active"
                                        : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-empanada-medium"
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
                className={`fixed lg:hidden inset-y-0 left-0 z-40 w-64 bg-white dark:bg-empanada-dark shadow-xl border-r border-gray-200 dark:border-empanada-light-gray transform transition-transform duration-200 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-empanada-light-gray">
                    <Link to="/admin" className="flex items-center space-x-2">
                        <img
                            src={logoNonino}
                            alt="Nonino Empanadas - Restaurante empanadas artesanales Patagonia Neuquén"
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
                <nav className="p-4 space-y-2 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-empanada-medium dark:scrollbar-track-empanada-dark">
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
                            <span className="text-sm font-medium text-gray-700 dark:text-white px-3 py-2">
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
                                            if (item.name === "Catálogos") {
                                                setDefinitionsDropdownOpen(!definitionsDropdownOpen);
                                                setInventoryDropdownOpen(false);
                                                setSucursalDropdownOpen(false);
                                                setFabricaDropdownOpen(false);
                                            } else if (item.name === "Inventario") {
                                                setInventoryDropdownOpen(!inventoryDropdownOpen);
                                                setDefinitionsDropdownOpen(false);
                                                setSucursalDropdownOpen(false);
                                                setFabricaDropdownOpen(false);
                                            } else if (item.name === "Sucursal") {
                                                setSucursalDropdownOpen(!sucursalDropdownOpen);
                                                setDefinitionsDropdownOpen(false);
                                                setInventoryDropdownOpen(false);
                                                setFabricaDropdownOpen(false);
                                            } else if (item.name === "Fábrica") {
                                                setFabricaDropdownOpen(!fabricaDropdownOpen);
                                                setDefinitionsDropdownOpen(false);
                                                setInventoryDropdownOpen(false);
                                                setSucursalDropdownOpen(false);
                                            }
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isItemActive(item)
                                            ? "bg-empanada-golden text-white"
                                            : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-empanada-medium"
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
                                            {((item.name === "Catálogos" && definitionsDropdownOpen) ||
                                                (item.name === "Inventario" && inventoryDropdownOpen) ||
                                                (item.name === "Sucursal" && sucursalDropdownOpen) ||
                                                (item.name === "Fábrica" && fabricaDropdownOpen)) ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Dropdown Items */}
                                    {((item.name === "Catálogos" && definitionsDropdownOpen) ||
                                        (item.name === "Inventario" && inventoryDropdownOpen) ||
                                        (item.name === "Sucursal" && sucursalDropdownOpen) ||
                                        (item.name === "Fábrica" && fabricaDropdownOpen)) && (
                                            <div className="ml-4 space-y-1">
                                                {item.dropdownItems.map((subItem) => (
                                                    <NavLink
                                                        key={subItem.name}
                                                        to={subItem.href}
                                                        end
                                                        onClick={() => setSidebarOpen(false)}
                                                        className={({ isActive }) => `flex items-center px-4 py-2 rounded-lg text-sm transition-colors ${isActive
                                                            ? "bg-empanada-golden/20 text-empanada-golden font-medium"
                                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-empanada-medium"
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
                                        setSucursalDropdownOpen(false);
                                        setFabricaDropdownOpen(false);
                                    }}
                                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isItemActive(item) && !shouldDeactivateOthers()
                                        ? "bg-empanada-golden text-white"
                                        : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-empanada-medium"
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
                <header className="bg-white dark:bg-empanada-dark admin-header shadow-sm border-b border-gray-200 dark:border-empanada-light-gray">
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
                                {/* Input de tiempo de envío - Solo para ADMIN */}
                                {session.userData.isAdmin && sucursalSeleccionada && (
                                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-empanada-medium rounded-lg px-3 py-1.5 border border-gray-200 dark:border-empanada-light-gray">
                                        <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            max="999"
                                            value={deliveryTimeInput}
                                            onChange={(e) => setDeliveryTimeInput(e.target.value)}
                                            placeholder="Tiempo"
                                            className="w-16 text-sm bg-transparent border-none outline-none text-gray-700 dark:text-white placeholder-gray-400"
                                            disabled={isUpdatingDeliveryTime}
                                        />
                                        <span className="text-xs text-gray-500 dark:text-gray-400">min</span>
                                        {isUpdatingDeliveryTime && (
                                            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                    </div>
                                )}
                                
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        refreshAll();
                                    }}
                                    className="text-gray-600 hover:text-gray-700 hover:bg-red-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-empanada-medium"
                                >
                                    <RefreshCcw className="w-4 h-4 mr-2" />
                                </Button>
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
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-empanada-dark rounded-lg shadow-lg border border-gray-200 dark:border-empanada-light-gray z-50">
                                            <div className="p-4 border-b border-gray-200 dark:border-empanada-light-gray">
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
                    {adminStartingLoading ? 
                    'cargando primeros...' : <Outlet />}
                </main>
            </div>
        </div>
    );
}

export default AdminLayout