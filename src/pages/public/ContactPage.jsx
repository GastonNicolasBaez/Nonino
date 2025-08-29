import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { TextAnimate } from "../../components/ui/text-animate";
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
      details: ["+54 11 1234-5678", "+54 11 8765-4321"],
      action: "tel:+541112345678"
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
      details: ["Av. San Martín 123, Centro", "Calle Belgrano 456, Zona Norte"],
      action: "https://maps.google.com"
    },
    {
      icon: Clock,
      title: "Horarios",
      details: ["Lun-Vie: 11:00 - 23:00", "Sáb-Dom: 11:00 - 24:00"]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-empanada-golden to-empanada-crust text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <TextAnimate
            animation="slideUp"
            by="word"
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Contáctanos
          </TextAnimate>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            Estamos aquí para ayudarte. Contáctanos por cualquier consulta o sugerencia
          </motion.p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-empanada-golden/10 rounded-full">
                      <info.icon className="w-8 h-8 text-empanada-golden" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{info.title}</h3>
                    <div className="space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm">
                          {info.action ? (
                            <a
                              href={info.action}
                              className="hover:text-empanada-golden transition-colors"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-empanada-golden" />
                    Envíanos un Mensaje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nombre *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Teléfono
                        </label>
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+54 11 1234-5678"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Asunto *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-empanada-golden"
                      >
                        <option value="">Selecciona un asunto</option>
                        <option value="pedido">Consulta sobre pedidos</option>
                        <option value="delivery">Información de delivery</option>
                        <option value="productos">Consulta sobre productos</option>
                        <option value="sugerencia">Sugerencia</option>
                        <option value="reclamo">Reclamo</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Mensaje *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Escribe tu mensaje aquí..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-empanada-golden resize-vertical"
                      />
                    </div>

                    <Button type="submit" variant="empanada" className="w-full">
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
              className="space-y-8"
            >
              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle>Preguntas Frecuentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">¿Cuál es el tiempo de entrega?</h4>
                    <p className="text-gray-600 text-sm">
                      Nuestro tiempo de entrega varía entre 30-60 minutos dependiendo de la zona y el horario.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">¿Hacen delivery los domingos?</h4>
                    <p className="text-gray-600 text-sm">
                      Sí, hacemos delivery todos los días de la semana, incluidos domingos y feriados.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">¿Cuál es el pedido mínimo?</h4>
                    <p className="text-gray-600 text-sm">
                      El pedido mínimo varía según la zona: Centro $2000, otras zonas $2500.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Síguenos en Redes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button variant="outline" size="icon">
                      📘
                    </Button>
                    <Button variant="outline" size="icon">
                      📷
                    </Button>
                    <Button variant="outline" size="icon">
                      🐦
                    </Button>
                    <Button variant="outline" size="icon">
                      📺
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Mantente al día con nuestras promociones y novedades
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
