import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
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

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { itemCount, setIsOpen: setCartOpen } = useCart();
  const session = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Menú", href: "/menu" },
    { name: "Promociones", href: "/promociones" },
    { name: "Locales", href: "/locales" },
    { name: "Nosotros", href: "/nosotros" },
    { name: "Contacto", href: "/contacto" },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-20 transition-all duration-300",
          scrolled
            ? "bg-white/20 backdrop-blur-sm shadow-lg"
            : "bg-white/95 backdrop-blur-md shadow-lg border-b"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >

        {/* Main Header */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <motion.div
                className="text-2xl sm:text-3xl"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                🥟
              </motion.div>
              <AnimatedGradientText className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight hidden xs:block">
                NONINO EMPANADAS
              </AnimatedGradientText>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight xs:hidden text-empanada-golden">
                NONINO
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm xl:text-base font-medium transition-colors hover:text-empanada-golden relative px-2 py-1",
                    isActive(item.href)
                      ? "text-empanada-golden"
                      : "text-gray-900"
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
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  "relative h-10 w-10 sm:h-11 sm:w-11",
                  "text-gray-900 hover:text-empanada-golden hover:bg-empanada-golden/10"
                )}
                aria-label="Buscar productos"
                aria-expanded={isSearchOpen}
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              {/* Favorites - Hidden on very small screens */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "relative h-10 w-10 sm:h-11 sm:w-11 hidden sm:flex",
                  "text-gray-900 hover:text-empanada-golden hover:bg-empanada-golden/10"
                )}
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(true)}
                className={cn(
                  "relative h-10 w-10 sm:h-11 sm:w-11",
                  "text-gray-900 hover:text-empanada-golden hover:bg-empanada-golden/10"
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

              {/* User */}
              {session.isAuthenticated ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className={cn(
                    "text-xs sm:text-sm hidden md:block font-medium",
                    "text-gray-900"
                  )}>
                    Hola, {session.username.split(' ')[0]}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={session.logout}
                    className={cn(
                      "h-10 w-10 sm:h-11 sm:w-11",
                      "text-gray-900 hover:text-empanada-golden hover:bg-empanada-golden/10"
                    )}
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              ) : (
                <div className="relative group">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-10 w-10 sm:h-11 sm:w-11",
                      "text-gray-900 hover:text-empanada-golden hover:bg-empanada-golden/10"
                    )}
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  {/* Tooltip hacia abajo - Hidden on mobile */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap hidden sm:block">
                    Próximamente
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                  </div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "lg:hidden h-10 w-10 sm:h-11 sm:w-11",
                  "text-gray-900 hover:text-empanada-golden hover:bg-empanada-golden/10"
                )}
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t bg-white/95 backdrop-blur-md shadow-lg"
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar empanadas..."
                    className="pl-10 pr-4 py-3 text-base sm:text-lg border-2 focus:border-empanada-golden"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 lg:hidden"
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
              <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-empanada-golden/10 to-empanada-crust/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="text-2xl"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      🥟
                    </motion.div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-empanada-golden">NONINO</h2>
                      <p className="text-xs text-gray-600">Menú de navegación</p>
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
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all duration-200 hover:bg-empanada-golden/10 group",
                          isActive(item.href)
                            ? "bg-empanada-golden/20 text-empanada-golden border border-empanada-golden/30"
                            : "text-gray-900 hover:text-empanada-golden"
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
                      to="/menu"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-2xl mb-2">🥟</div>
                      <span className="text-xs font-medium text-gray-700">Menú</span>
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

                {/* User Section */}
                {session.isAuthenticated && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-empanada-golden rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Hola, {session.username.split(' ')[0]}
                        </p>
                        <p className="text-xs text-gray-500">Usuario registrado</p>
                      </div>
                    </div>
                  </div>
                )}
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
