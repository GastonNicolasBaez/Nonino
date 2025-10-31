import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart
} from "lucide-react";
import { AnimatedGradientText } from "../ui/animated-gradient-text";

import { usePublicData } from "@/context/PublicDataProvider";
import { FaWhatsapp } from "react-icons/fa";

// Instagram Logo SVG Component
const InstagramLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  const {
    sucursales
  } = usePublicData();

  const socialLinks = [
    { icon: InstagramLogo, href: "https://www.instagram.com/noninoempanadas/", label: "Instagram" }
  ];

  const quickLinks = [
    { name: "Inicio", href: "/" },
    { name: "Pedir Ya", href: "/menu" },
    { name: "Franquicias", href: "/franquicias" },
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

  return (
    <footer className="bg-empanada-dark text-white">
      {/* Línea divisoria dorada sutil en la parte superior */}
      <div className="relative py-6">
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-empanada-golden/20 to-transparent transform -translate-y-1/2">
          {/* Efecto de brillo muy sutil */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-empanada-golden/30 to-transparent opacity-40 blur-sm"></div>
        </div>
      </div>

      {/* Newsletter Section - Comentado temporalmente */}
      {/* <div className="bg-empanada-golden py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
              ¡Suscríbete a nuestras ofertas!
            </h3>
            <p className="mb-4 sm:mb-6 text-white/90 text-sm sm:text-base">
              Recibe promociones exclusivas y entérate primero de nuestras novedades
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white text-base"
              />
              <button className="px-4 sm:px-6 py-3 bg-white text-empanada-golden rounded-lg font-semibold hover:bg-empanada-light transition-colors text-sm sm:text-base">
                Suscribirse
              </button>
            </div>
          </motion.div>
        </div>
      </div> */}

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          {/* Brand - Simplificado en móvil */}
          <div className="space-y-3 sm:space-y-4 md:col-span-2 lg:col-span-1 text-center md:text-left lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2">
              <motion.div
                className="text-2xl sm:text-3xl"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                🥟
              </motion.div>
              <AnimatedGradientText className="text-lg sm:text-xl lg:text-2xl font-bold">
                NONINO EMPANADAS
              </AnimatedGradientText>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto lg:mx-0 hidden lg:block">
              Las mejores empanadas artesanales de la ciudad.
              Tradición familiar desde 1995. Ingredientes frescos,
              sabores únicos y la calidez de siempre.
            </p>
            <div className="flex justify-center lg:justify-start space-x-3 sm:space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-empanada-terracotta hover:text-empanada-golden transition-colors p-2 hover:bg-empanada-medium/50 rounded-full"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-10 h-10 sm:w-12 sm:h-12 lg:w-6 lg:h-6" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links - Oculto en móvil */}
          <div className="space-y-3 sm:space-y-4 hidden lg:block">
            <h4 className="text-base sm:text-lg font-semibold text-empanada-golden">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stores - Simplificado en móvil */}
          <div className="space-y-3 sm:space-y-4 hidden lg:block">
            <h4 className="text-base sm:text-lg font-semibold text-empanada-golden">
              Nuestros Locales
            </h4>
            <div className="space-y-3 sm:space-y-4">
              {sucursales.map((store) => (
                <div key={store.name} className="text-sm">
                  <h5 className="font-medium text-white mb-2 text-sm sm:text-base">{store.name}</h5>
                  <div className="space-y-1 text-gray-400">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{store.shortAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaWhatsapp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{store.tel2}</span>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{store.hours}</span>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact - Solo info esencial en móvil */}
          <div className="space-y-3 sm:space-y-4 text-center lg:text-left">
            <h4 className="text-base sm:text-lg font-semibold text-empanada-golden lg:block hidden">
              Contacto
            </h4>
            <div className="space-y-2 sm:space-y-3 text-sm text-gray-400">
              <div className="hidden lg:block">
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <a
                    href="mailto:info@noninoempanadas.com"
                    className="hover:text-white transition-colors text-xs sm:text-sm"
                  >
                    info@noninoempanadas.com
                  </a>
                </div>
                {/* <div className="pt-2">
                  <h5 className="font-medium text-white mb-2 text-sm sm:text-base">Horarios de Atención</h5>
                  <p className="text-xs sm:text-sm">Lunes a Domingo: 11:00 - 23:00</p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              <p>
                © {currentYear} Nonino Empanadas. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-1 justify-center sm:justify-start">
                <span>Sitio Web desarrollado por <a className="text-white hover:font-semibold" target="_blank" href="https://zeclogic.net.ar/">zecLogic</a></span>
              </div>
            </div>
            <div className="hidden lg:flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-end text-xs sm:text-sm">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-400 hover:text-white transition-colors whitespace-nowrap"
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
