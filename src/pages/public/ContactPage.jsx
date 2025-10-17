import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Instagram } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { TextAnimate } from "../../components/ui/text-animate";
import { FloatingOrderButton } from "../../components/common/FloatingOrderButton";
import { toast } from "sonner";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular envío
    toast.success("Mensaje enviado correctamente. Te responderemos pronto!");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Teléfono",
      details: ["+54 2972 42-5072", "+54 2972 41-0400"],
      action: "tel:+542972425072"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@noninoempanadas.com", "pedidos@noninoempanadas.com"],
      action: "mailto:info@noninoempanadas.com"
    },
    {
      icon: MapPin,
      title: "Dirección",
      details: ["General Villegas 745, Centro", "El Molino, Ruta 40"],
      action: "https://share.google/A8WSr3Ic4LjFV2CUV"
    },
    {
      icon: Clock,
      title: "Horarios",
      details: ["Lun-Dom:  11:00 - 15:00 / 19:00 - 23:00"]
    }
  ];

  return (
    <div className="min-h-screen bg-empanada-light-gray">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black via-empanada-darker to-empanada-medium text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TextAnimate
            animation="slideUp"
            by="word"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2"
          >
            Contáctanos
          </TextAnimate>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-2"
          >
            Estamos aquí para ayudarte. Contáctanos por cualquier consulta o sugerencia
          </motion.p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-empanada-medium via-empanada-light-gray to-empanada-medium/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="mb-3 sm:mb-4 inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-empanada-golden/10 rounded-full">
                      <info.icon className="w-6 h-6 sm:w-8 sm:h-8 text-empanada-golden" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">{info.title}</h3>
                    <div className="space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-xs sm:text-sm">
                          {info.action ? (
                            <a
                              href={info.action}
                              className="hover:text-empanada-golden transition-colors block"
                              target={info.action.startsWith('http') ? '_blank' : undefined}
                              rel={info.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                              {detail}
                            </a>
                          ) : (
                            detail
                          )}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-lg">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-empanada-golden" />
                    Envíanos un Mensaje
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                          Nombre *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Tu nombre completo"
                          className="py-3 text-base border-2 bg-empanada-medium text-white placeholder-gray-400 border-empanada-light-gray focus:border-empanada-golden"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                          Teléfono
                        </label>
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+54 11 1234-5678"
                          className="py-3 text-base border-2 bg-empanada-medium text-white placeholder-gray-400 border-empanada-light-gray focus:border-empanada-golden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Email *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="tu@email.com"
                        className="py-3 text-base border-2 bg-empanada-medium text-white placeholder-gray-400 border-empanada-light-gray focus:border-empanada-golden"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Asunto *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-3 border-2 bg-empanada-medium text-white border-empanada-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-empanada-golden focus:border-empanada-golden text-base [&>option]:bg-empanada-medium [&>option]:text-white"
                      >
                        <option value="">Selecciona un asunto</option>
                        <option value="pedido">Consulta sobre pedidos</option>
                        <option value="delivery">Información de envíos</option>
                        <option value="productos">Consulta sobre productos</option>
                        <option value="franquicia">Consulta por franquicia</option>
                        <option value="sugerencia">Sugerencia</option>
                        <option value="reclamo">Reclamo</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Mensaje *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Escribe tu mensaje aquí..."
                        className="w-full px-3 py-3 border-2 bg-empanada-medium text-white placeholder-gray-400 border-empanada-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-empanada-golden focus:border-empanada-golden resize-vertical text-base"
                      />
                    </div>

                    <Button type="submit" variant="empanada" className="w-full py-3 text-base font-semibold">
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Mensaje
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4 sm:space-y-6 lg:space-y-8"
            >
              {/* FAQ */}
              <Card className="shadow-lg">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Preguntas Frecuentes</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base text-white">¿Cuál es el tiempo de entrega?</h4>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                        Nuestro tiempo de entrega varía entre 30-60 minutos dependiendo de la zona y el horario.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base text-white">¿Hacen envíos los domingos?</h4>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                        Sí, hacemos envíos todos los días de la semana, incluidos domingos y feriados.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base text-white">¿Cuál es el pedido mínimo?</h4>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                        El pedido mínimo varía según la zona: Centro $2000, otras zonas $2500.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="shadow-lg">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Síguenos en Redes</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
                    <motion.a
                      href="#"
                      className="text-empanada-terracotta hover:text-empanada-golden transition-colors p-2 hover:bg-empanada-dark rounded-full border-2 border-empanada-terracotta hover:border-empanada-golden"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Instagram"
                    >
                      <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
                    </motion.a>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 mt-3 sm:mt-4 text-center sm:text-left">
                    Mantente al día con nuestras promociones y novedades
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <FloatingOrderButton />
    </div>
  );
}
