import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  MapPin, 
  Phone,
  Heart,
  Search
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { AnimatedGradientText } from "../ui/animated-gradient-text";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { itemCount, setIsOpen: setCartOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b"
            : "bg-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Top Bar */}
        <div className="bg-empanada-golden text-white py-2 px-4 text-sm">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Delivery en toda la ciudad</span>
              </div>
              <div className="hidden md:flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>+54 11 1234-5678</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🚚 Envío gratis en pedidos +$3000</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                className="text-2xl"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                🥟
              </motion.div>
              <AnimatedGradientText className="text-xl font-bold tracking-tight">
                NONINO EMPANADAS
              </AnimatedGradientText>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-empanada-golden relative",
                    isActive(item.href)
                      ? "text-empanada-golden"
                      : scrolled
                        ? "text-gray-900"
                        : "text-white"
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
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  "relative",
                  scrolled ? "text-gray-900 hover:text-empanada-golden" : "text-white hover:text-empanada-golden"
                )}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Favorites */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "relative",
                  scrolled ? "text-gray-900 hover:text-empanada-golden" : "text-white hover:text-empanada-golden"
                )}
              >
                <Heart className="w-5 h-5" />
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(true)}
                className={cn(
                  "relative",
                  scrolled ? "text-gray-900 hover:text-empanada-golden" : "text-white hover:text-empanada-golden"
                )}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="empanada"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>

              {/* User */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm hidden md:block",
                    scrolled ? "text-gray-900" : "text-white"
                  )}>
                    Hola, {user.name.split(' ')[0]}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className={cn(
                      scrolled ? "text-gray-900 hover:text-empanada-golden" : "text-white hover:text-empanada-golden"
                    )}
                  >
                    <User className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    scrolled ? "text-gray-900 hover:text-empanada-golden" : "text-white hover:text-empanada-golden"
                  )}
                >
                  <User className="w-5 h-5" />
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "lg:hidden",
                  scrolled ? "text-gray-900 hover:text-empanada-golden" : "text-white hover:text-empanada-golden"
                )}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              className="border-t bg-white/95 backdrop-blur-md"
            >
              <div className="container mx-auto px-4 py-4">
                <Input
                  placeholder="Buscar empanadas..."
                  className="max-w-md mx-auto"
                  autoFocus
                />
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
            className="fixed inset-0 z-40 lg:hidden"
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
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl"
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Menú</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <nav className="p-6 space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block text-lg font-medium transition-colors hover:text-empanada-golden",
                      isActive(item.href) ? "text-empanada-golden" : "text-gray-900"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
}
