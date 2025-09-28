import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  MapPin,
  Phone,
  Heart,
  Search,
  ChevronRight
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { AnimatedGradientText } from "../ui/animated-gradient-text";
import { useCart } from "../../context/CartProvider";
import { useSession } from "@/context/SessionProvider";
import { cn } from "../../lib/utils";
import { CartDropdown } from "./CartDropdown";
import logoNonino from '@/assets/logos/nonino.png';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const location = useLocation();
  const { itemCount, setIsOpen: setCartOpen } = useCart();
  const session = useSession();

  // Scroll effect for logo centering
  const { scrollY } = useScroll();
  
  // Detectar si estamos en páginas que no deben tener animaciones
  const isStaticPage = ['/pedir', '/promociones', '/locales', '/nosotros', '/contacto', '/menu'].includes(location.pathname);

  // Hero logo effect - commented out as not currently used
  // const heroLogoY = useTransform(scrollY, [0, 400], [400, -20]); // Moves from below viewport to navbar
  // const heroLogoOpacity = useTransform(scrollY, [0, 100], [0, 1]); // Fades in as it approaches

  // Logo section movement - mover más a la izquierda para dar espacio
  const logoSectionX = useTransform(scrollY, [200, 400], isStaticPage ? [0, 0] : [0, -25]);

  // Left navigation movement - será definido después de getResponsivePosition
  // Right navigation movement - será definido después de getResponsivePosition

  // Icons section movement - movimiento sutil como antes
  const iconsSectionX = useTransform(scrollY, [200, 400], isStaticPage ? [0, 0] : [0, 8]);

  // Individual icon movements - sincronizados con el movimiento de las secciones
  const heartIconX = useTransform(scrollY, [200, 300], isStaticPage ? [0, 0] : [0, 2]);
  const cartIconX = useTransform(scrollY, [200, 300], isStaticPage ? [0, 0] : [0, 3]);
  const userIconX = useTransform(scrollY, [200, 300], isStaticPage ? [0, 0] : [0, 4]);

  // Navbar logo opacity - desaparece cuando hay scroll
  const navbarLogoOpacity = useTransform(scrollY, [50, 150], isStaticPage ? [1, 1] : [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const leftNavigation = [
    { name: "Inicio", href: "/" },
    { name: "Pedir Ya", href: "/pedir" },
    { name: "Promociones", href: "/promociones" },
  ];

  const rightNavigation = [
    { name: "Locales", href: "/locales" },
    { name: "Nosotros", href: "/nosotros" },
    { name: "Contacto", href: "/contacto" },
  ];

  // Combinar navegaciones para el menú móvil
  const navigation = [...leftNavigation, ...rightNavigation];

  // Función para calcular posiciones responsivas
  const getResponsivePosition = (xlPosition, customPosition, lgPosition) => {
    if (windowWidth >= 1536) return xlPosition; // xl breakpoint (≥1536px)
    if (windowWidth >= 1280) return customPosition; // custom breakpoint (1280px-1535px)
    if (windowWidth >= 1024) return lgPosition; // lg breakpoint (1024px-1279px)
    return xlPosition; // fallback
  };

  // Left navigation movement - navegación central izquierda (Inicio, Pedir Ya, Promociones)
  // Parámetros: (≥1536px, 1280px-1535px, 1024px-1279px)
  const leftNavInitial = getResponsivePosition(60, 30, 20); // Progresivo: 60 → 30 → 20
  const leftNavEnd = getResponsivePosition(-30, -30, -15); // Progresivo: -30 → -20 → -15
  const leftNavX = useTransform(scrollY, [0, 300], isStaticPage ? [leftNavInitial, leftNavInitial] : [leftNavInitial, leftNavEnd]);

  // Right navigation movement - navegación central derecha (Locales, Nosotros, Contacto)
  // Parámetros: (≥1536px, 1280px-1535px, 1024px-1279px)
  const rightNavInitial = getResponsivePosition(-115, -60, -40); // Progresivo: -80 → -60 → -40
  const rightNavEnd = getResponsivePosition(-55, -45, 40); // Progresivo: -55 → -45 → 40
  const rightNavX = useTransform(scrollY, [0, 300], isStaticPage ? [rightNavInitial, rightNavInitial] : [rightNavInitial, rightNavEnd]);

  const isActive = (href) => location.pathname === href;

  // Función para manejar click del carrito
  const handleCartClick = () => {
    if (windowWidth >= 1024) {
      // Desktop: usar dropdown
      setIsCartDropdownOpen(!isCartDropdownOpen);
    } else {
      // Mobile: usar sidebar
      setCartOpen(true);
    }
  };

  // Función para manejar clicks en navegación
  const handleNavClick = (e, href) => {
    // Si ya estamos en la página y hacemos click en el mismo enlace
    if (location.pathname === href) {
      e.preventDefault();
      // Scroll to top with smooth behavior
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };


  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-20 transition-all duration-300",
          // En móvil siempre sólido, en desktop con transparencias
          "bg-white shadow-lg border-b",
          "lg:bg-white/95 lg:backdrop-blur-md",
          !isStaticPage && scrolled && "lg:bg-white/20 lg:backdrop-blur-sm"
        )}
        initial={{ y: isStaticPage ? 0 : -100 }}
        animate={{ y: 0 }}
        transition={{ duration: isStaticPage ? 0 : 0.5 }}
      >

        {/* Main Header */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 relative overflow-visible gap-4 lg:gap-8">
            {/* Logo Section */}
            <motion.div
              style={{
                x: logoSectionX
              }}
              className="flex items-center flex-shrink-0 min-w-0 header-motion-element"
            >
              <Link to="/" className="flex items-center space-x-1 sm:space-x-2">
                <motion.img
                  src={logoNonino}
                  alt="Logo Nonino"
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0"
                  style={{ opacity: navbarLogoOpacity }}
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1">
                  <AnimatedGradientText className="text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-tight text-empanada-golden">
                    NONINO
                  </AnimatedGradientText>
                  <span className="hidden xl:inline text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-empanada-golden/80">
                    EMPANADAS
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Left Navigation Section */}
            <motion.nav
              style={{ x: leftNavX }}
              className="hidden lg:flex items-center space-x-6 xl:space-x-8 mr-6 xl:mr-8"
            >
                {leftNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={cn(
                      "text-xs lg:text-sm xl:text-sm 2xl:text-base font-medium transition-colors hover:text-empanada-golden relative px-1 lg:px-2 py-1 whitespace-nowrap header-nav-item",
                      isActive(item.href)
                        ? "text-empanada-golden"
                        : "text-empanada-dark"
                    )}
                  >
                    {item.name}
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-empanada-golden"
                        initial={false}
                      />
                    )}
                  </Link>
                ))}
            </motion.nav>

            {/* Right Navigation Section */}
            <motion.nav
              style={{ x: rightNavX }}
              className="hidden lg:flex items-center space-x-6 xl:space-x-8 ml-6 xl:ml-8"
            >
                {rightNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={cn(
                      "text-xs lg:text-sm xl:text-sm 2xl:text-base font-medium transition-colors hover:text-empanada-golden relative px-1 lg:px-2 py-1 whitespace-nowrap header-nav-item",
                      isActive(item.href)
                        ? "text-empanada-golden"
                        : "text-empanada-dark"
                    )}
                  >
                    {item.name}
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-empanada-golden"
                        initial={false}
                      />
                    )}
                  </Link>
                ))}
            </motion.nav>

            {/* Actions Section */}
            <motion.div
              style={{ x: iconsSectionX }}
              className="flex items-center space-x-1 sm:space-x-2 xl:space-x-3 flex-shrink-0 header-motion-element"
            >

              {/* Favorites - Hidden on very small screens */}
              <motion.div style={{ x: heartIconX }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "relative h-10 w-10 sm:h-11 sm:w-11 hidden sm:flex",
                    "text-empanada-dark hover:text-empanada-golden hover:bg-empanada-golden/10"
                  )}
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>

              </motion.div>

              {/* Cart */}
              <motion.div style={{ x: cartIconX }} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCartClick}
                  className={cn(
                    "relative h-10 w-10 sm:h-11 sm:w-11",
                    "text-empanada-dark hover:text-empanada-golden hover:bg-empanada-golden/10"
                  )}
                  aria-label={`Carrito de compras${itemCount > 0 ? ` (${itemCount} productos)` : ''}`}
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  {itemCount > 0 && (
                    <Badge
                      variant="empanada"
                      className="absolute -top-2 -right-2 h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center p-0 text-xs"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </Badge>
                  )}
                </Button>

                {/* Desktop Cart Dropdown */}
                <div className="hidden lg:block">
                  <CartDropdown
                    isOpen={isCartDropdownOpen}
                    onClose={() => setIsCartDropdownOpen(false)}
                  />
                </div>

              </motion.div>

              {/* User */}
              <motion.div style={{ x: userIconX }}>
                <div className="relative group">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={session.isAuthenticated ? session.logout : undefined}
                    className={cn(
                      "h-10 w-10 sm:h-11 sm:w-11",
                      "text-empanada-dark hover:text-empanada-golden hover:bg-empanada-golden/10"
                    )}
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  {/* Tooltip hacia abajo - Hidden on mobile */}
                  {!session.isAuthenticated && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap hidden sm:block z-[999]">
                      Próximamente
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "lg:hidden h-10 w-10 sm:h-11 sm:w-11",
                  "text-empanada-dark hover:text-empanada-golden hover:bg-empanada-golden/10"
                )}
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              </Button>
            </motion.div>
          </div>
        </div>

      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-empanada-cream to-empanada-wheat">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <img 
                      src={logoNonino}
                      alt="Logo Nonino" 
                      className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                    />
                    <div>
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-empanada-golden">NONINO</h2>
                      <p className="text-xs sm:text-sm text-gray-600">Menú de navegación</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:bg-empanada-golden/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 sm:p-6">
                <div className="space-y-2">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        onClick={(e) => {
                          handleNavClick(e, item.href);
                          setIsMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all duration-200 hover:bg-empanada-golden/10 group",
                          isActive(item.href)
                            ? "bg-empanada-golden/20 text-empanada-golden border border-empanada-golden/30"
                            : "text-empanada-dark hover:text-empanada-golden"
                        )}
                      >
                        <span className="text-base sm:text-lg font-medium">
                          {item.name}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-empanada-golden transition-colors" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Acciones rápidas
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/pedir"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img 
                        src={logoNonino}
                        alt="Logo Nonino" 
                        className="w-6 h-6 mb-2"
                      />
                      <span className="text-xs font-medium text-gray-700">Pedir Ya</span>
                    </Link>
                    <Link
                      to="/locales"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <MapPin className="w-6 h-6 mb-2 text-gray-600" />
                      <span className="text-xs font-medium text-gray-700">Locales</span>
                    </Link>
                  </div>
                </div>

              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16 lg:h-20" />
    </>
  );
}
