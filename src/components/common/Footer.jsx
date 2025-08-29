import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter,
  Youtube,
  Heart
} from "lucide-react";
import { AnimatedGradientText } from "../ui/animated-gradient-text";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const quickLinks = [
    { name: "Inicio", href: "/" },
    { name: "Menú", href: "/menu" },
    { name: "Promociones", href: "/promociones" },
    { name: "Locales", href: "/locales" },
    { name: "Nosotros", href: "/nosotros" },
    { name: "Contacto", href: "/contacto" },
  ];

  const legalLinks = [
    { name: "Términos y Condiciones", href: "/terminos" },
    { name: "Política de Privacidad", href: "/privacidad" },
    { name: "Política de Cookies", href: "/cookies" },
    { name: "Preguntas Frecuentes", href: "/faq" },
  ];

  const stores = [
    {
      name: "Centro",
      address: "Av. San Martín 123, Centro",
      phone: "+54 11 1234-5678",
      hours: "Lun-Dom: 11:00 - 23:00"
    },
    {
      name: "Zona Norte",
      address: "Calle Belgrano 456, Zona Norte",
      phone: "+54 11 8765-4321",
      hours: "Lun-Dom: 11:00 - 23:00"
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-empanada-golden py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold mb-4">
              ¡Suscríbete a nuestras ofertas!
            </h3>
            <p className="mb-6 text-white/90">
              Recibe promociones exclusivas y entérate primero de nuestras novedades
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-empanada-golden rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Suscribirse
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <motion.div
                className="text-2xl"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                🥟
              </motion.div>
              <AnimatedGradientText className="text-xl font-bold">
                NONINO EMPANADAS
              </AnimatedGradientText>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Las mejores empanadas artesanales de la ciudad. 
              Tradición familiar desde 1995. Ingredientes frescos, 
              sabores únicos y la calidez de siempre.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-empanada-golden transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-empanada-golden">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stores */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-empanada-golden">
              Nuestros Locales
            </h4>
            <div className="space-y-4">
              {stores.map((store, index) => (
                <div key={index} className="text-sm">
                  <h5 className="font-medium text-white mb-1">{store.name}</h5>
                  <div className="space-y-1 text-gray-400">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{store.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{store.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-empanada-golden">
              Contacto
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a 
                  href="mailto:info@noninoempanadas.com" 
                  className="hover:text-white transition-colors"
                >
                  info@noninoempanadas.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a 
                  href="tel:+541112345678" 
                  className="hover:text-white transition-colors"
                >
                  +54 11 1234-5678
                </a>
              </div>
              <div className="pt-2">
                <h5 className="font-medium text-white mb-2">Horarios de Atención</h5>
                <p>Lunes a Viernes: 11:00 - 23:00</p>
                <p>Sábados y Domingos: 11:00 - 24:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
              <p>
                © {currentYear} Nonino Empanadas. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-1">
                <span>Hecho con</span>
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span>en Argentina</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
