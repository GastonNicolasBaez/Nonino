import { motion } from "framer-motion";
import { Heart, Award, Users, Clock } from "lucide-react";
import { TextAnimate } from "../../components/ui/text-animate";
import { Card, CardContent } from "../../components/ui/card";
import { NumberTicker } from "../../components/ui/number-ticker";

export function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Pasión",
      description: "Cada empanada está hecha con amor y dedicación, manteniendo las recetas familiares que nos han acompañado por generaciones."
    },
    {
      icon: Award,
      title: "Calidad",
      description: "Seleccionamos cuidadosamente cada ingrediente para garantizar el mejor sabor y frescura en todos nuestros productos."
    },
    {
      icon: Users,
      title: "Familia",
      description: "Somos una empresa familiar que valora las relaciones humanas y el trato cercano con cada uno de nuestros clientes."
    },
    {
      icon: Clock,
      title: "Tradición",
      description: "Respetamos las técnicas tradicionales de elaboración mientras innovamos para satisfacer los gustos modernos."
    }
  ];

  const milestones = [
    { year: "1995", event: "Fundación de Nonino Empanadas", description: "Don Carlos Nonino abre el primer local familiar" },
    { year: "2000", event: "Segundo Local", description: "Expansión a la zona norte de la ciudad" },
    { year: "2010", event: "Delivery Online", description: "Lanzamiento de nuestro servicio de delivery" },
    { year: "2020", event: "App Mobile", description: "Desarrollo de nuestra aplicación móvil" },
    { year: "2024", event: "25 Años de Tradición", description: "Celebramos nuestro aniversario con nuevas recetas" },
  ];

  const stats = [
    { value: 29, label: "Años de Experiencia" },
    { value: 15000, label: "Clientes Felices", suffix: "+" },
    { value: 100000, label: "Empanadas Vendidas", suffix: "+" },
    { value: 4.8, label: "Calificación Promedio", decimals: 1 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-empanada-golden via-empanada-crust to-empanada-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 text-center">
          <TextAnimate
            animation="slideUp"
            by="word"
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Nuestra Historia
          </TextAnimate>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-white/90 max-w-3xl mx-auto"
          >
            Una tradición familiar que comenzó hace más de 25 años con el sueño de 
            compartir el auténtico sabor de las empanadas argentinas
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                La Historia de Don Carlos
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Todo comenzó en 1995 cuando Don Carlos Nonino decidió cumplir su sueño 
                  de abrir su propia empanadora. Con las recetas heredadas de su abuela 
                  y una gran pasión por la cocina, abrió el primer local en el centro de la ciudad.
                </p>
                <p>
                  Lo que empezó como un pequeño negocio familiar se convirtió en una tradición 
                  querida por toda la comunidad. Cada empanada es preparada con el mismo cuidado 
                  y dedicación que Don Carlos puso desde el primer día.
                </p>
                <p>
                  Hoy, con más de 25 años de experiencia, seguimos manteniendo esa esencia 
                  familiar mientras incorporamos nuevas tecnologías para brindar el mejor 
                  servicio a nuestros clientes.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img
                src="/api/placeholder/300/400"
                alt="Don Carlos en la cocina"
                className="rounded-lg shadow-lg"
              />
              <img
                src="/api/placeholder/300/200"
                alt="Primer local"
                className="rounded-lg shadow-lg"
              />
              <img
                src="/api/placeholder/300/200"
                alt="Familia Nonino"
                className="rounded-lg shadow-lg"
              />
              <img
                src="/api/placeholder/300/400"
                alt="Empanadas artesanales"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestros Valores
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Los principios que guían cada día nuestro trabajo y nos conectan con nuestros clientes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-empanada-golden/10 rounded-full">
                      <value.icon className="w-8 h-8 text-empanada-golden" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestra Trayectoria
            </h2>
            <p className="text-lg text-gray-600">
              Los momentos más importantes de nuestra historia
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-empanada-golden/20" />
            
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-empanada-golden rounded-full border-4 border-white shadow-lg z-10" />
                
                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold text-empanada-golden mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {milestone.event}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-empanada-golden/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Números que nos Respaldan
            </h2>
            <p className="text-lg text-gray-600">
              El crecimiento y la confianza de nuestros clientes
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-empanada-golden mb-2">
                  <NumberTicker
                    value={stat.value}
                    decimalPlaces={stat.decimals || 0}
                  />
                  {stat.suffix}
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-lg text-gray-600">
              Las personas que hacen posible cada empanada
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Carlos Nonino", role: "Fundador y Chef Principal", image: "/api/placeholder/300/300" },
              { name: "María Nonino", role: "Gerente General", image: "/api/placeholder/300/300" },
              { name: "José Martínez", role: "Chef de Producción", image: "/api/placeholder/300/300" },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-empanada-golden font-medium">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
